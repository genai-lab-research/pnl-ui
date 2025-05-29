#!/bin/bash

# Set the source directory (adjust this path if needed)
SOURCE_DIR="./src"

# Check if the source directory exists
if [ ! -d "$SOURCE_DIR" ]; then
  echo "Source directory $SOURCE_DIR does not exist!"
  exit 1
fi

# Generate a strict ESLint config file
echo "Generating ESLint config..."

cat <<EOF > .eslintrc.json
{
  "root": true,
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "ecmaVersion": "latest",
    "sourceType": "module",
    "project": ["tsconfig.json"]
  },
  "plugins": ["@typescript-eslint"],
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/recommended-requiring-type-checking",
    "plugin:@typescript-eslint/strict"
  ],
  "env": {
    "browser": true,
    "es2021": true,
    "node": true
  },
  "rules": {
    "@typescript-eslint/explicit-module-boundary-types": "error",
    "@typescript-eslint/no-floating-promises": "error",
    "@typescript-eslint/no-misused-promises": "error",
    "@typescript-eslint/no-unnecessary-type-assertion": "error",
    "@typescript-eslint/consistent-type-imports": "warn",
    "@typescript-eslint/consistent-type-definitions": ["error", "interface"],
    "no-console": "warn",
    "no-debugger": "error"
  }
}
EOF


# Install required dependencies (if not already installed)
echo "Installing required dependencies..."
npm install --save-dev eslint \
  @typescript-eslint/parser \
  @typescript-eslint/eslint-plugin \
  typescript


# Run ESLint on the project and generate a JSON report
echo "Running ESLint on the project..."
npx eslint "$SOURCE_DIR" --ext .ts,.tsx --format=json > eslint_report.json

# Check if the ESLint report was generated
if [ ! -f eslint_report.json ]; then
  echo "Error: ESLint report was not generated!"
  exit 1
fi

# Parse the ESLint JSON report
echo "Parsing ESLint JSON report..."

ISSUES=$(jq -r '.[] |
  .filePath as $file |
  .messages[] |
  "File: \($file)\nLine: \(.line)\nSeverity: \(.severity)\nMessage: \(.message)\nRule: \(.ruleId)\n"' eslint_report.json)


# Prepare the output file
OUTPUT_FILE="eslint_report_$(date +'%Y-%m-%d_%H-%M-%S').txt"
echo -e "ESLint Issues Report\n" > "$OUTPUT_FILE"
echo -e "=======================\n" >> "$OUTPUT_FILE"

# Add the issues to the report
if [ -z "$ISSUES" ]; then
  echo "No issues found!" >> "$OUTPUT_FILE"
else
  echo -e "$ISSUES" >> "$OUTPUT_FILE"
fi  # <-- this was missing

# Provide feedback to the user
echo "✅ ESLint report generated: $OUTPUT_FILE"
