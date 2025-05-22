#!/bin/bash

# Loop through each endpoint file
for file in /Users/ihusar/Documents/Projects/pnl-artifacts-1page/demo/backend/app/api/v1/endpoints/*.py; do
  # Modify the delete endpoints with 204 status code to not return anything
  sed -i '' 's/def delete_.*) -> Any:/def delete_\1) -> None:/g' "$file"
  
  # Remove 'return None' statements from delete endpoints
  sed -i '' '/^    return None$/d' "$file"
done

echo "Fixed all delete endpoints with HTTP 204 status code."