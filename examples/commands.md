# pi-monitor examples

Shell monitors treat stdout as the event stream. Keep stdout selective.

```text
/monitor dev errors :: npm run dev 2>&1 | grep --line-buffered -E "error|failed|exception"
/monitor app log :: tail -f app.log | grep --line-buffered -E "ERROR|WARN|FATAL"
/monitor test failures :: npm test 2>&1 | grep --line-buffered -E "FAIL|failed|Error:"
/monitor pr comments :: while true; do gh api repos/OWNER/REPO/issues/123/comments --jq '.[] | select(.created_at > "2026-01-01T00:00:00Z") | "\(.user.login): \(.body)"' || true; sleep 30; done
```

Path watcher:

```text
/monitor-watch src changes in src
```

Management:

```text
/monitors        # opens details modal
/monitor-panel   # same modal
/monitor-stop mon-1
/monitor-stop all
```
