---
name: Workspace Initialization
description: Automatically sets up a new workspace with Git, a custom .gitignore, a Dev Container configuration, and an Obsidian vault setup.
---

# Workspace Initialization Skill

This skill automates the process of turning a fresh local folder into a fully configured development workspace and Obsidian vault.

## Usage

Trigger this skill when asked to "initiate this workspace as a git repository" or "setup workspace".

## Steps

### 1. Dev Container Setup (Remote Sources)

- **Source**: Fetch configuration from [Claude Code Dev Container](https://github.com/anthropics/claude-code/tree/main/.devcontainer).
- **Action**:
  - Create a `.devcontainer` folder if it doesn't exist.
  - If remote access is available, download `devcontainer.json`, `Dockerfile`, and any initialization scripts.
  - If remote access is not available, use the baseline files from this skill's `resources/devcontainer` (if provided).

### 2. Obsidian Vault Initialization

- **Action**: Create a `.obsidian` folder in the workspace root.
- **Source**: Copy all files from this skill's `resources/obsidian/` into the `.obsidian` folder.
- **Note**: Ensure the project is recognized as a vault by Obsidian.

### 3. Git Repository Initialization

- **Action**: Run `git init`.
- **Ignore List**: Use the `resources/gitignore_template` from this skill to create the `.gitignore` file.
- **Initial Commit**:
  - `git add .`
  - `git commit -m "@Antigravity Agent : Initial workspace setup (DevContainer, Obsidian, Git)"`

### 4. Initialization Summary (`init_summary.md`)

- **Action**: Create a file named `init_summary.md` in the root.
- **Content**:

    ```markdown
    ---
    tags: [git, devcontainer, init_repo, init_obsidian]
    creation_date: {{DATETIME_ISO_8601_EDT}}
    ---

    # Workspace Initialization Summary

    This summary outlines the automated setup completed for this workspace.

    - **Git Initialized**: ✅
    - **Obsidian Configured**: ✅
    - **Dev Container Ready**: ✅
    ```

- **Time Format**: Use `YYYY-MM-DDThh:mm:ss.sss-04:00` (EDT).

## Resources Integration

- **Obsidian Config**: `resources/obsidian/`
- **Gitignore Template**: `resources/gitignore_template`
