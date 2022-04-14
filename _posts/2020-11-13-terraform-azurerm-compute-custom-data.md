---
title: "Passing Custom Data to Terraform Azure RM Compute Module"
date: 2020-11-13
categories:
  - Terraform
tags:
  - terraform
  - azure
comments: true
---

If you use [Azure RM Compute Module from Terraform Registry](https://registry.terraform.io/modules/Azure/compute/azurerm/latest)
you were probably thinking of ways to configure VM during provisioning. And
there's a bunch of, one of which is to use Azure Compute module's custom data
to pass configuration script:

```
 custom_data string

Description: The custom data to supply to the machine. This can be used as a
cloud-init for Linux systems.

Default: ""
```

As you can see, documentation is really sparse, and if you'll try to pass
couple of commands, they'll not be executed.

Trying to pass script also doesn't work:

```terraform
custom_data         = file("scripts/k8s-manager.sh")
```

After spending some time, I was able to clarify why this doesn't work:

* As per [documentation of linux virtual machine](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/linux_virtual_machine#custom_data)

```
custom_data - (Optional) The Base64-Encoded Custom Data which should be used
for this Virtual Machine. Changing this forces a new resource to be created.
```

* For example, you can set up your script in local variable and pass it
   encoded:

```terraform
locals {
  custom_data = <<CUSTOM_DATA
  #!/bin/bash
  echo "Execute your super awesome commands here!"
  CUSTOM_DATA
  }

# Encode and pass you script
custom_data = base64encode(local.custom_data)
```

* You can also pass your script as file on local filesystem:

```terraform
# Using filebase64 to encode script
custom_data = filebase64("scripts/k8s-node.sh")
```

* Make sure that your script(for Linux) starts with shebang `#!/bin/sh`,
   otherwise it won't be processed.

* Your script will be executed as cloud-init, so all rules from [cloud-init
   overview](https://docs.microsoft.com/en-us/azure/virtual-machines/linux/using-cloud-init#cloud-init-overview)
   applies.

* You can review cloud-init logs at `/var/log/cloud-init.log`. It will contain
   all outputs from your script.

* Finally, for deep troubleshooting, follow [cloud-init-troubleshooting guide](https://docs.microsoft.com/en-us/azure/virtual-machines/linux/cloud-init-troubleshooting)
