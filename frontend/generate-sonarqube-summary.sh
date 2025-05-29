#!/bin/bash

# Configuration
SONAR_URL="http://localhost:9000"
SONAR_TOKEN="sqp_cde2490b1c9bebea059033395e7ad043b9c4fd5a"
PROJECT_KEY="ui-demo-pnl"
OUTPUT_FILE="summary-report-$(date +'%Y-%m-%d_%H-%M-%S').txt"

# Fetch issues from SonarQube
echo "Fetching issues from SonarQube..."
ISSUES_JSON=$(curl -s -u "$SONAR_TOKEN": "$SONAR_URL/api/issues/search?componentKeys=$PROJECT_KEY")

# Fetch overall project metrics (overview data)
echo "Fetching overall project metrics from SonarQube..."
METRICS_JSON=$(curl -s -u "$SONAR_TOKEN": "$SONAR_URL/api/measures/component?component=$PROJECT_KEY&metricKeys=duplicated_lines_density,coverage,complexity,violations,security_rating,reliability_rating")

# Debug: Print the raw METRICS_JSON for inspection
echo "Raw METRICS_JSON: $METRICS_JSON"

# Fetch quality gate status
echo "Fetching quality gate status from SonarQube..."
QUALITY_GATE_JSON=$(curl -s -u "$SONAR_TOKEN": "$SONAR_URL/api/qualitygates/project_status?projectKey=$PROJECT_KEY")

# Check if issues were fetched
if [[ -z "$ISSUES_JSON" || $(echo "$ISSUES_JSON" | jq -r '.issues | length') -eq 0 ]]; then
  echo "Error: No issues data retrieved or issues.json is empty!"
  exit 1
fi

# Check if metrics were fetched, and if not, default to 0 for each metric
DUPLICATION=$(echo "$METRICS_JSON" | jq -r '.component.measures[]? | select(.metric == "duplicated_lines_density") | .value // "0"')
COVERAGE=$(echo "$METRICS_JSON" | jq -r '.component.measures[]? | select(.metric == "coverage") | .value // "0"')
COMPLEXITY=$(echo "$METRICS_JSON" | jq -r '.component.measures[]? | select(.metric == "complexity") | .value // "0"')
VIOLATIONS=$(echo "$METRICS_JSON" | jq -r '.component.measures[]? | select(.metric == "violations") | .value // "0"')
RELIABILITY=$(echo "$METRICS_JSON" | jq -r '.component.measures[]? | select(.metric == "reliability_rating") | .value // "0"')
SECURITY=$(echo "$METRICS_JSON" | jq -r '.component.measures[]? | select(.metric == "security_rating") | .value // "0"')

# Extract quality gate status
QUALITY_GATE_STATUS=$(echo "$QUALITY_GATE_JSON" | jq -r '.projectStatus.status // "N/A"')

# Group issues by severity and categorize with details (status/author/creationDate removed)
GROUPED_ISSUES="Bugs:\n\n"
BUGS=$(echo "$ISSUES_JSON" | jq -r '.issues[] | select(.type == "BUG") |
  "Issue Key: \(.key)\nSeverity: \(.severity)\nRule: \(.rule)\nMessage: \(.message)\nComponent: \(.component)\nLine: \(.line)\nType: \(.type)\n"')
GROUPED_ISSUES+="$BUGS\n\n"

GROUPED_ISSUES+="Maintainability Issues:\n\n"
MAINTAINABILITY_ISSUES=$(echo "$ISSUES_JSON" | jq -r '.issues[] | select(.impacts[].softwareQuality == "MAINTAINABILITY") |
  "Issue Key: \(.key)\nSeverity: \(.severity)\nRule: \(.rule)\nMessage: \(.message)\nComponent: \(.component)\nLine: \(.line)\nType: \(.type)\n"')
GROUPED_ISSUES+="$MAINTAINABILITY_ISSUES\n\n"

GROUPED_ISSUES+="Reliability Issues:\n\n"
RELIABILITY_ISSUES=$(echo "$ISSUES_JSON" | jq -r '.issues[] | select(.impacts[].softwareQuality == "RELIABILITY") |
  "Issue Key: \(.key)\nSeverity: \(.severity)\nRule: \(.rule)\nMessage: \(.message)\nComponent: \(.component)\nLine: \(.line)\nType: \(.type)\n"')
GROUPED_ISSUES+="$RELIABILITY_ISSUES\n\n"

GROUPED_ISSUES+="Security Hotspots:\n\n"
SECURITY_HOTSPOTS=$(echo "$ISSUES_JSON" | jq -r '.issues[] | select(.rule | test("security")) |
  "Issue Key: \(.key)\nSeverity: \(.severity)\nRule: \(.rule)\nMessage: \(.message)\nComponent: \(.component)\nLine: \(.line)\nType: \(.type)\n"')
GROUPED_ISSUES+="$SECURITY_HOTSPOTS\n"

# Prepare summary table
SUMMARY_TABLE="\n\nSUMMARY:\n\n"
SUMMARY_TABLE+="| Metric                 | Value |\n"
SUMMARY_TABLE+="|------------------------|-------|\n"
SUMMARY_TABLE+="| Duplicated Lines       | ${DUPLICATION:-0}% |\n"
SUMMARY_TABLE+="| Test Coverage          | ${COVERAGE:-0}% |\n"
SUMMARY_TABLE+="| Cognitive Complexity   | ${COMPLEXITY:-N/A} |\n"
SUMMARY_TABLE+="| Violations             | ${VIOLATIONS:-N/A} |\n"
SUMMARY_TABLE+="| Reliability Rating     | ${RELIABILITY:-N/A} |\n"
SUMMARY_TABLE+="| Security Rating        | ${SECURITY:-N/A} |\n"
SUMMARY_TABLE+="| Quality Gate Status    | ${QUALITY_GATE_STATUS:-N/A} |\n"

# Output the detailed grouped issues and summary to file
echo -e "$GROUPED_ISSUES" > "$OUTPUT_FILE"
echo -e "$SUMMARY_TABLE" >> "$OUTPUT_FILE"

# Confirm success
echo "✅ Full summary with overall metrics complete: $OUTPUT_FILE"
