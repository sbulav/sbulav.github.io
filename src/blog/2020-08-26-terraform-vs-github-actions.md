---
title: "Terraform vs Github Actions"
date: 2020-08-26
categories:
  - terraform
tags:
  - terraform
  - github actions
comments: true
---

My project is migrating to github, and one of team intentions was to use github
actions instead of Jenkins.

However, while building pipeline for Terraform in GitHub actions, things did not
went well. In this article I will try to describe issues I've faced and how I
mitigated them

### Issue 1: setup-terraform wrapper

Since there is official github action [setup-terraform](https://github.com/hashicorp/setup-terraform#setup-terraform)
it will be your first intentions.

But in this case you will face many discouraging errors.

First of all, documentation is a bit outdated and examples from documentation
could fail in many cases. For me, first issue was that example use of 
[terraform output]( https://github.com/hashicorp/setup-terraform/blame/master/README.md#L112)
fails on large TF plans due to environment variable couldn't handle too large
output. For me, grabbing `terraform plan` worked only below ~3500 lines.

Secondly, you would think ok, terraform now can output to JSON, why don't me
just parse it with `jq`? Unfortunately, with wrapper that wouldn't work either.

Somehow wrapper breaks bash piping and redirection, so with totally valid
commands

```bash
terraform plan -no-color -out planfile
terraform show -no-color -json planfile > plan.json
cat plan.json | jq -r '.'
```

you'll receive lots of random jq errors due to broken json file. There's an open
[ticket](https://github.com/hashicorp/setup-terraform/issues/20) but with no
solution at the time of writing.

You might think OK, so let's just disable wrapper - and in this case you'll face:

### Issue 2: GitHub actions set-output

With wrapper enabled, you have access to following outputs:
*  stdout - The STDOUT stream of the call to the terraform binary.
*  stderr - The STDERR stream of the call to the terraform binary.
*  exitcode - The exit code of the call to the terraform binary.

For example, you can refence outputs when posing a message into pull requests by
`steps.plan.outputs.stdout`, which is very convenient.

With wrapper disabled, all those outputs are unavailable and you have to define
them manually, something like:

```bash
echo "::set-output name=logvalidate::$(cat output.log)"
```

But in this case, you'll face another issue - only first line of text file
is being captured. There's an open issue in [actions/toolkit](https://github.com/actions/toolkit/issues/403)
where developer says that `When echo'ing the command manually (the community
issue) the user must escape.`

Here's an example of possible workaround:
```bash
    REPORT="$(cat plan.log)"
    REPORT="${REPORT//'%'/'%25'}"
    REPORT="${REPORT//$'\n'/'%0A'}"
    REPORT="${REPORT//$'\r'/'%0D'}"
    echo "::set-output name=logplan::$REPORT"
```

Finally, we're not capturing error log and exit code to reflect it in PR comment.
By default, pipeline will stop at first failed step. Since we're trying to grab
all possible logs, we can use separate step to process data and `|| always()`
to execute step even if one of previous steps failed.

```yaml
    - name: Terraform Plan
      id: plan
      run: |
        terraform plan -no-color -out planfile 2>error.log
        terraform show -no-color -json planfile > plan.json
        changes=$(cat plan.json | jq -r '[.resource_changes[]? | { resource: .address, action: .change.actions[] } | select (.action != "no-op")]')
        summary=$(echo $changes | jq -r '.   | "Environment has \(length) changes"')
        details=$(echo $changes | jq -r '.[] | "* \(.resource) will be \(.action)d"')
        echo "Summary: $summary " > plan.log
        echo "${details}" >> plan.log

    - name: Terraform Plan process
      id: process
      if: github.event_name == 'pull_request' || always()
      run: |
        REPORT="$(cat *.log)"
        REPORT="${REPORT//'%'/'%25'}"
        REPORT="${REPORT//$'\n'/'%0A'}"
        REPORT="${REPORT//$'\r'/'%0D'}"
        echo "::set-output name=logplan::$REPORT"
```

That gives us correct stage error status and error message available for further
use:

![Terraform pr comment](/assets/images/terraform-pr-comment.png)

### Working solution

Wrapping it up, with workarounds for issues mentioned above I've came up with
following solution:

```yaml
    - name: Terraform setup
      uses: hashicorp/setup-terraform@v1
      with:
        terraform_version: 0.13.0
        terraform_wrapper: false

    - name: Terraform Format
      id: fmt
      run: |
        terraform fmt -check -diff -no-color | tee fmt.log
        REPORT="$(cat fmt.log)"
        REPORT="${REPORT//'%'/'%25'}"
        REPORT="${REPORT//$'\n'/'%0A'}"
        REPORT="${REPORT//$'\r'/'%0D'}"
        echo "::set-output name=logfmt::$REPORT"
      continue-on-error: true

    - name: Terraform init
      id: init
      run: |
        terraform init -input=false
        terraform workspace new ${{ matrix.environment }} || true
        terraform workspace select ${{ matrix.environment }}

    - name: Terraform Validate
      id: validate
      run: |
        terraform validate -no-color | tee validate.log
        REPORT="$(cat validate.log)"
        REPORT="${REPORT//'%'/'%25'}"
        REPORT="${REPORT//$'\n'/'%0A'}"
        REPORT="${REPORT//$'\r'/'%0D'}"
        rm validate.log
        echo "::set-output name=logvalidate::$REPORT"

    - name: Terraform Plan
      id: plan
      run: |
        terraform plan -no-color -out planfile 2>error.log
        terraform show -no-color -json planfile > plan.json
        changes=$(cat plan.json | jq -r '[.resource_changes[]? | { resource: .address, action: .change.actions[] } | select (.action != "no-op")]')
        summary=$(echo $changes | jq -r '.   | "Environment has \(length) changes"')
        details=$(echo $changes | jq -r '.[] | "* \(.resource) will be \(.action)d"')
        echo "Summary: $summary " > plan.log
        echo "${details}" >> plan.log

    - name: Terraform Plan process
      id: process
      if: github.event_name == 'pull_request' || always()
      run: |
        REPORT="$(cat *.log)"
        REPORT="${REPORT//'%'/'%25'}"
        REPORT="${REPORT//$'\n'/'%0A'}"
        REPORT="${REPORT//$'\r'/'%0D'}"
        echo "::set-output name=logplan::$REPORT"

    - name: Write output for pull request
      uses: actions/github-script@v2.0.0
      if: github.event_name == 'pull_request' || always()
      with:
        github-token: ${{ secrets.GITHUB_TOKEN }}
        script: |
          const output = `### Validation result for \`${{ matrix.environment }}\`
          #### Terraform Format and Style \`${{ steps.fmt.outcome }}\`
          <details><summary>Show Format</summary>
          \`\`\`
            ${{steps.fmt.outputs.logfmt}}
          \`\`\`
          </details>
          #### Terraform Initialization \`${{ steps.init.outcome }}\`
          #### Terraform Validation ${{ steps.validate.outputs.logvalidate }}
          #### Terraform Plan \`${{ steps.plan.outcome }}\`
          <details><summary>Show Plan</summary>
          \`\`\`
            ${{steps.process.outputs.logplan}}
          \`\`\`
          *You can see the complete command output [here](https://github.com/${{github.repository}}/actions/runs/${{github.run_id}})*
          </details>
          *Triggered by: @${{ github.actor }}, Action: \`${{ github.event_name }}\`, Workflow: \`${{ github.workflow }}\`*`;
          github.issues.createComment({
            issue_number: context.issue.number,
            owner: context.repo.owner,
            repo: context.repo.repo,
            body: output
          })
```

