#!/bin/bash

# EveryPoll Reversion Script
# This script reverts the EveryPoll customizations back to the original mentat-template-js state

# Text formatting
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Default settings
CREATE_BACKUP=true
INSTALL_DEPS=false
TIMESTAMP=$(date +"%Y%m%d%H%M%S")
BACKUP_DIR="everypoll-backup-$TIMESTAMP"

# Exit on any error
set -e

# Print script banner
echo -e "${BLUE}=========================================================${NC}"
echo -e "${BLUE}   EveryPoll to mentat-template-js Reversion Script      ${NC}"
echo -e "${BLUE}=========================================================${NC}"

# Parse command line arguments
while [[ "$#" -gt 0 ]]; do
    case $1 in
        --no-backup) CREATE_BACKUP=false ;;
        --install-deps) INSTALL_DEPS=true ;;
        -h|--help) 
            echo "Usage: ./revert.sh [options]"
            echo "Options:"
            echo "  --no-backup    Skip creating a backup"
            echo "  --install-deps Automatically install dependencies after reversion"
            echo "  -h, --help     Show this help message"
            exit 0
            ;;
        *) echo "Unknown parameter: $1"; exit 1 ;;
    esac
    shift
done

# Display settings
echo "Settings:"
echo "  Create backup: $CREATE_BACKUP"
echo "  Install dependencies: $INSTALL_DEPS"
echo

# Confirm before proceeding
echo -e "${YELLOW}WARNING: This will remove all EveryPoll customizations and revert to the original template.${NC}"
echo -e "${YELLOW}This action cannot be undone. All EveryPoll specific code will be removed.${NC}"
read -p "Are you sure you want to continue? (y/n): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]
then
    echo -e "${RED}Operation cancelled.${NC}"
    exit 1
fi

# Function to log actions
log() {
    echo -e "${GREEN}[LOG]${NC} $1"
}

# Function to log warnings
warn() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# Function to log errors
error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Create backup if requested
if [ "$CREATE_BACKUP" = true ]; then
    log "Creating backup in directory: $BACKUP_DIR"
    mkdir -p "$BACKUP_DIR"
    
    # Copy important files and directories
    cp -r client "$BACKUP_DIR/"
    cp -r server "$BACKUP_DIR/"
    cp -r .mentat "$BACKUP_DIR/"
    cp package.json "$BACKUP_DIR/"
    
    if [ $? -eq 0 ]; then
        log "Backup created successfully."
    else
        error "Failed to create backup. Aborting."
        exit 1
    fi
fi

log "Starting reversion process..."

# 1. Remove EveryPoll-specific directories and files
log "Removing EveryPoll-specific directories and files..."

# Client-side and server-side removals
directories_to_remove=(
    "server/prisma"
    "server/src/config"
    "server/src/types"
    "client/src/store"
    "client/src/api"
    "client/src/hooks"
    "client/src/utils"
    "client/src/routes"
    "client/src/pages"
    "client/src/context"
)

files_to_remove=(
    "client/src/theme.ts"
    ".mentat/CHANGELOG.md"
    ".mentat/ROADMAP.md"
    "server/.env"
)

# Remove directories
for dir in "${directories_to_remove[@]}"; do
    if [ -d "$dir" ]; then
        log "Removing directory: $dir"
        rm -rf "$dir"
    else
        warn "Directory not found: $dir (skipping)"
    fi
done

# Remove files
for file in "${files_to_remove[@]}"; do
    if [ -f "$file" ]; then
        log "Removing file: $file"
        rm -f "$file"
    else
        warn "File not found: $file (skipping)"
    fi
done

# 2. Revert client/src/main.tsx to original template version
log "Reverting client/src/main.tsx to original template version..."

mkdir -p client/src
cat > client/src/main.tsx << 'EOL'
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './styles.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
EOL

# 3. Revert server/src/app.ts to original template version
log "Reverting server/src/app.ts to original template version..."

mkdir -p server/src
cat > server/src/app.ts << 'EOL'
import express from 'express';
import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import cors from 'cors';
import path from 'path';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Initialize Express app
export const app = express();
export const PORT = process.env.PORT || 5000;
export const CLIENT_DIST_PATH = path.join(__dirname, '../../client/dist');

// Basic middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files
app.use(express.static(CLIENT_DIST_PATH));

// Error handler middleware
const errorHandler: ErrorRequestHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'production' ? {} : err
  });
  next();
};
app.use(errorHandler);

// Basic API route
app.get('/api', (req: Request, res: Response) => {
  res.json({ message: 'Welcome to the Mentat Template JS API!' });
});

// Serve React app for any other routes (SPA)
app.get('*', (req: Request, res: Response) => {
  res.sendFile(path.join(CLIENT_DIST_PATH, 'index.html'));
});
EOL

# 4. Create a simplified .env.example
log "Creating simplified .env.example..."

cat > server/.env.example << 'EOL'
# Server Configuration
PORT=5000
NODE_ENV=development
EOL

# 5. Update client/package.json
log "Updating client/package.json to remove EveryPoll-specific dependencies..."

cat > client/package.json << 'EOL'
{
  "name": "client",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "test": "vitest run",
    "test:watch": "vitest",
    "build": "tsc -b && vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^19.0.0",
    "react-dom": "^19.0.0"
  },
  "devDependencies": {
    "@testing-library/jest-dom": "^6.6.3",
    "@testing-library/react": "^16.2.0",
    "@testing-library/user-event": "^14.6.1",
    "@types/react": "^19.0.12",
    "@types/react-dom": "^19.0.4",
    "@vitejs/plugin-react": "^4.3.4",
    "jsdom": "^24.0.0",
    "typescript": "~5.8.2",
    "vite": "^6.2.3",
    "vitest": "^1.2.2"
  }
}
EOL

# 6. Update server/package.json
log "Updating server/package.json to remove EveryPoll-specific dependencies..."

cat > server/package.json << 'EOL'
{
  "name": "server",
  "version": "1.0.0",
  "main": "server.ts",
  "scripts": {
    "dev": "ts-node-dev --respawn src/server.ts",
    "build": "tsc",
    "start": "node dist/server.js",
    "test": "jest",
    "test:watch": "jest --watch"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "description": "",
  "dependencies": {
    "cors": "^2.8.5",
    "dotenv": "^16.4.5",
    "express": "^4.21.2"
  },
  "devDependencies": {
    "@types/cors": "^2.8.17",
    "@types/express": "^5.0.1",
    "@types/jest": "^29.5.12",
    "@types/node": "^22.13.13",
    "@types/supertest": "^6.0.2",
    "jest": "^29.7.0",
    "supertest": "^6.3.4",
    "ts-jest": "^29.1.2",
    "ts-node-dev": "^2.0.0",
    "typescript": "^5.8.2"
  }
}
EOL

# 7. Make the script executable
chmod +x revert.sh

# 8. Install dependencies if requested
if [ "$INSTALL_DEPS" = true ]; then
    log "Installing dependencies..."
    npm install
    if [ $? -eq 0 ]; then
        log "Dependencies installed successfully."
    else
        warn "Error installing dependencies. You should run 'npm install' manually."
    fi
fi

# Completion message
log "Reversion completed successfully!"
echo -e "${BLUE}=========================================================${NC}"
echo -e "${GREEN}The codebase has been reverted to the original mentat-template-js state.${NC}"

if [ "$CREATE_BACKUP" = true ]; then
    echo -e "${YELLOW}A backup of the original files has been created in:${NC} ${BLUE}$BACKUP_DIR${NC}"
fi

if [ "$INSTALL_DEPS" = false ]; then
    echo -e "${YELLOW}Remember to run ${BLUE}npm install${NC}${YELLOW} to update dependencies.${NC}"
fi

echo -e "${BLUE}=========================================================${NC}"
