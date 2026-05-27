#!/usr/bin/env bash

# ---------------------------------------------
# Claude Hook: Async PR Size Warning
# ---------------------------------------------
# Warns when the working tree becomes large.
# Non-blocking notification-only hook.
# ---------------------------------------------

MAX_LINES=300
MAX_FILES=12

# Ensure inside git repo
git rev-parse --is-inside-work-tree >/dev/null 2>&1 || exit 0

# Calculate total changed lines
changed_lines=$(
  git diff --numstat | awk '
  {
    added += $1
    deleted += $2
  }
  END {
    print added + deleted
  }'
)

changed_lines=${changed_lines:-0}

# Count changed files
changed_files=$(git diff --name-only | wc -l | tr -d ' ')

# Only emit message if threshold crossed
if [ "$changed_lines" -gt "$MAX_LINES" ] || [ "$changed_files" -gt "$MAX_FILES" ]; then

  cat <<EOF
{
  "systemMessage": "⚠️ Large working tree detected: ${changed_lines} changed lines across ${changed_files} files. Consider reviewing changes, creating a PR, or starting a fresh Claude session."
}
EOF

fi

exit 0