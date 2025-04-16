#!/bin/bash

# EveryPoll Detection Script
# This script scans the codebase to determine if EveryPoll components are present

# Text formatting
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}=========================================================${NC}"
echo -e "${BLUE}   EveryPoll Detection Script                            ${NC}"
echo -e "${BLUE}=========================================================${NC}"
echo "This script checks if EveryPoll components are present in the codebase."
echo

# Track if we've found EveryPoll components
FOUND_COMPONENTS=false

# Check for EveryPoll-specific directories
echo -e "${YELLOW}Checking for EveryPoll directories...${NC}"
directories_to_check=(
    "server/prisma"
    "server/src/config"
    "client/src/store"
    "client/src/api"
)

for dir in "${directories_to_check[@]}"; do
    if [ -d "$dir" ]; then
        echo -e "  ${GREEN}✓${NC} Found: $dir"
        FOUND_COMPONENTS=true
    else
        echo -e "  ${RED}✗${NC} Not found: $dir"
    fi
done
echo

# Check for EveryPoll-specific files
echo -e "${YELLOW}Checking for EveryPoll files...${NC}"
files_to_check=(
    "client/src/theme.ts"
    ".mentat/CHANGELOG.md"
    ".mentat/ROADMAP.md"
    "server/prisma/schema.prisma"
)

for file in "${files_to_check[@]}"; do
    if [ -f "$file" ]; then
        echo -e "  ${GREEN}✓${NC} Found: $file"
        FOUND_COMPONENTS=true
    else
        echo -e "  ${RED}✗${NC} Not found: $file"
    fi
done
echo

# Check for EveryPoll dependencies in package.json files
echo -e "${YELLOW}Checking for EveryPoll dependencies...${NC}"

# Check client dependencies
if grep -q "@mui/material\|@reduxjs/toolkit\|@tanstack/react-query" client/package.json 2>/dev/null; then
    echo -e "  ${GREEN}✓${NC} Found: EveryPoll client dependencies"
    FOUND_COMPONENTS=true
else
    echo -e "  ${RED}✗${NC} Not found: EveryPoll client dependencies"
fi

# Check server dependencies
if grep -q "@prisma/client\|passport\|connect-pg-simple" server/package.json 2>/dev/null; then
    echo -e "  ${GREEN}✓${NC} Found: EveryPoll server dependencies"
    FOUND_COMPONENTS=true
else
    echo -e "  ${RED}✗${NC} Not found: EveryPoll server dependencies"
fi
echo

# Check for EveryPoll-specific content in code files
echo -e "${YELLOW}Checking for EveryPoll code content...${NC}"

# Check if app.ts contains EveryPoll-specific code
if grep -q "everypoll\|passport\|PostgresStore" server/src/app.ts 2>/dev/null; then
    echo -e "  ${GREEN}✓${NC} Found: EveryPoll backend code"
    FOUND_COMPONENTS=true
else
    echo -e "  ${RED}✗${NC} Not found: EveryPoll backend code"
fi

# Check if main.tsx contains EveryPoll-specific providers
if grep -q "Provider\|QueryClientProvider\|ThemeProvider" client/src/main.tsx 2>/dev/null; then
    echo -e "  ${GREEN}✓${NC} Found: EveryPoll frontend providers"
    FOUND_COMPONENTS=true
else
    echo -e "  ${RED}✗${NC} Not found: EveryPoll frontend providers"
fi
echo

# Final verdict
echo -e "${BLUE}=========================================================${NC}"
if [ "$FOUND_COMPONENTS" = true ]; then
    echo -e "${YELLOW}RESULT: EveryPoll components were detected in the codebase.${NC}"
    echo -e "You can use the revert.sh script to revert to the original template."
else
    echo -e "${GREEN}RESULT: No EveryPoll components were detected.${NC}"
    echo -e "The codebase appears to be in the original template state."
fi
echo -e "${BLUE}=========================================================${NC}"

# Make the script executable
chmod +x check-everypoll.sh
