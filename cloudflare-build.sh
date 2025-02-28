#!/bin/bash

# Print Node.js and Yarn versions
echo "Node version: $(node -v)"
echo "Yarn version: $(yarn -v)"

# Install dependencies without using the lockfile
echo "Installing dependencies..."
yarn install --no-lockfile

# Build the web version
echo "Building web version..."
npx expo export:web

# Print success message
echo "Build completed successfully!"