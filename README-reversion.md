# EveryPoll Reversion Script

This document explains how to use the `revert.sh` script to revert the EveryPoll application back to the original mentat-template-js state.

## Overview

The reversion script is designed to remove all EveryPoll-specific additions and modifications, returning the codebase to its original template state. This process:

1. Creates a backup of the current state (optional)
2. Removes EveryPoll-specific files and directories
3. Reverts modified files to their template versions
4. Updates package.json files to remove added dependencies
5. Optionally reinstalls dependencies

## Prerequisites

- Bash shell environment (Linux, macOS, or WSL on Windows)
- Execute permissions on the script file

## Usage

### Basic Usage

To run the reversion script with default settings:

1. Make sure the script is executable:
   ```bash
   chmod +x revert.sh
   ```

2. Run the script:
   ```bash
   ./revert.sh
   ```

3. You'll be prompted for confirmation before the script proceeds
   - Type 'y' to continue
   - Type any other key to cancel

4. After the script completes, reinstall dependencies:
   ```bash
   npm install
   ```

### Command Line Options

The script supports several command-line options:

```bash
./revert.sh [options]
```

Available options:

- `--no-backup`: Skip creating a backup before making changes
- `--install-deps`: Automatically install dependencies after reversion
- `-h, --help`: Display help message

Examples:

```bash
# Skip backup creation
./revert.sh --no-backup

# Automatically install dependencies after reversion
./revert.sh --install-deps

# Skip backup and install dependencies
./revert.sh --no-backup --install-deps
```

## Backup

By default, the script creates a backup of the current state before making any changes. The backup is stored in a directory named `everypoll-backup-TIMESTAMP`, where `TIMESTAMP` is the current date and time.

The backup includes:
- All client files
- All server files
- .mentat directory
- Root package.json

If backup creation fails, the script will abort without making changes.

## What Changes Are Made

The script makes the following changes:

### Directories Removed
- server/prisma
- server/src/config
- server/src/types
- client/src/store
- client/src/api
- client/src/hooks
- client/src/utils
- client/src/routes
- client/src/pages
- client/src/context

### Files Removed
- client/src/theme.ts
- .mentat/CHANGELOG.md
- .mentat/ROADMAP.md
- server/.env

### Files Reverted
- client/src/main.tsx
- server/src/app.ts
- server/.env.example

### Dependencies Removed

#### Client
- @emotion/react, @emotion/styled
- @mui/icons-material, @mui/material
- @reduxjs/toolkit
- @tanstack/react-query
- date-fns, lodash
- react-hook-form
- react-redux
- recharts

#### Server
- @prisma/client
- bcrypt
- connect-pg-simple
- cookie-parser
- express-session
- helmet
- jsonwebtoken
- multer
- passport, passport-google-oauth20
- zod

## Troubleshooting

If you encounter any issues:

1. **Permission denied**: Run `chmod +x revert.sh` to make the script executable

2. **Errors during execution**: Check the output messages for specific errors.
   - The script uses 'set -e', so it will stop at the first error

3. **Missing files after reversion**: Run `npm install` to reinstall the dependencies

4. **Unexpected state**: If the reversion fails or results in an unexpected state:
   - First check if a backup was created and restore from there
   - As a last resort, reset the repository with git:
     ```bash
     git checkout -- .
     git clean -fd
     npm install
     ```

5. **Backup issues**: If you need to restore from backup:
   ```bash
   # Replace with your actual backup directory name
   cp -r everypoll-backup-TIMESTAMP/* .
   npm install
   ```
