#!/bin/bash

find . -name "*.yml" | while read filename; do
  if ! grep -q "hunter" "$filename"; then
    echo "$filename"
  fi
done

# find . -name "*.yml" | while read filename; do
#   if grep -q "description: null" "$filename"; then
#     sed -i "s/description: null/description: ''/g" "$filename"
#     echo "Updated $filename"
#   fi
# done
