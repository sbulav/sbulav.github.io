---
title: "jira-oil.nvim — Edit Jira like a Neovim buffer"
date: 2026-03-02
categories:
  - neovim
  - plugins
tags:
  - neovim
  - jira
  - productivity
comments: true
---

As a team lead, managing and creating Jira tasks is something I have to do on a
daily basis. Jumping between the code in my editor and the Jira web interface
often breaks my flow, so I've spent a lot of time looking for a better way to
handle my backlog.

Over the years, I've tried multiple approaches to solve this:
- Using the plain command-line tool <a
  href="https://github.com/ankitpokhrel/jira-cli">jira-cli</a>. It's great for
  scripts, but can feel a bit disconnected when you just want to quickly update
  multiple tasks.
- Creating my own TUI application. This was almost good, but it lacked elegance
  and was not able to handle mass changes easily.
- Checking out and even forking other Neovim Jira integrations, like <a
  href="https://github.com/sbulav/jira.nvim">jira.nvim</a>. Also pretty good
  solution, but every action requires digging through a lot of menus. And mass
  change is not possible.

Finally, I came up with an idea to create use the same approach as in the
brilliant <a href="https://github.com/stevearc/oil.nvim">oil.nvim</a>, but for
Jira.

So, introducing **<a href="https://github.com/sbulav/jira-oil.nvim">jira-oil.nvim</a>**.

![jira-oil-demo optimized](https://github.com/user-attachments/assets/fe7dba53-6017-4d99-8e15-dd9fcf4e47ec)

---

## Features

The core idea is to make Jira feel like plain text:

- **Buffer-as-Jira**: View your sprint and backlog as a tabular list in a
  normal Neovim buffer.
- **Inline Editing**: Change a task's status, reassign it, or edit summaries by
  editing the text directly. 
- **Batch Mutations**: Make multiple changes across different issues, save the
  buffer, and confirm before execution.
- **Task Copying**: Yank lines and paste them to create new tasks from existing
  ones.
- **Scratch Buffers**: Full issue details in a structured buffer with
  description editing.
- **Draft State**: Scratch buffer edits persist as drafts and are shown with
  `[draft]` markers.
- **Epic & Components**: Pick epics and components interactively when editing
  issues.

## Usage in Practice

The workflow is incredibly straightforward. You run `:JiraOil` to open your combined sprint and backlog.

```text
PROJ-101 │ In Progress │ me   │ Fix the login bug
PROJ-102 │ To Do       │ john │ Update README
```

Want to move a task to "In Progress"? Just change the text in the status
column. Want to assign it to yourself? Change the assignee name. Once you are
done making your edits, just press `<C-s>` (or `:w`). A floating window will
show your pending mutations, and you simply press `Y` to confirm.

Need to write a detailed description? Press `<CR>` to open the scratch buffer
for that specific issue, write your description using standard Neovim text
  objects and commands, and save.

## Conclusion

I've been using this plugin for a week now, and I'm really happy with how it
turned out. It completely changes the way I interact with Jira, turning a
tedious web-based chore into a seamless, keyboard-driven text editing
experience.

If you spend your days jumping between Neovim and Jira, give <a
href="https://github.com/sbulav/jira-oil.nvim">jira-oil.nvim</a> a try!
