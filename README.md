# pi-monitor

Event-driven monitors for [pi](https://pi.dev) sessions. `pi-monitor` lets pi watch shell output or file changes in the background and wake the **same session that started the monitor** only when something happens.

Inspired by Claude Code's Monitor mechanic: stdout lines become events; silence costs no model calls.

## What it does

- Runs selective shell monitors in the background.
- Watches files or directories for changes.
- Injects matching events into the current pi session so the agent can react.
- Shows active monitors in the status line and a `/monitors` details panel.
- Stops monitors automatically when the session switches, forks, reloads, or exits.

## Requirements

- pi coding agent installed.
- Node.js compatible with your pi installation.
- Optional shell utilities for your own monitor commands, e.g. `grep`, `tail`, `fswatch`, `inotifywait`, `gh`.

## Installation

### From npm, once published

```sh
pi install npm:pi-monitor
```

### From git

```sh
pi install git:github.com/<owner>/pi-monitor
```

Pin a release tag for reproducible installs:

```sh
pi install git:github.com/<owner>/pi-monitor@v0.1.0
```

### From a local checkout

```sh
git clone https://github.com/<owner>/pi-monitor.git
pi install ./pi-monitor
```

### Try without installing

```sh
pi -e ./pi-monitor
```

After installing into an already-running pi session, run:

```text
/reload
```

or start a new pi session.

## Quick start

Ask pi naturally:

```text
Start my dev server and monitor it for errors
```

Or use explicit commands:

```text
/monitor app errors :: tail -f app.log | grep --line-buffered -E "ERROR|WARN|FATAL"
/monitor-watch src changes in src
/monitors
```

## Commands

```text
/monitor <description> :: <command>
```

Start a persistent shell monitor. The command runs in your project directory. Every stdout line becomes a monitor event.

```text
/monitor-watch <path> [description]
```

Watch a file or directory using Node `fs.watch`.

```text
/monitors
/monitor-panel
```

Open the monitor details panel.

```text
/monitor-stop <id|all>
```

Stop one monitor or all active monitors.

## Tools available to the agent

- `monitor_start` — run a shell command in the background; stdout lines wake the session.
- `monitor_watch_path` — watch a file or directory.
- `monitor_list` — list running/stopped monitors.
- `monitor_stop` — stop one monitor or all monitors.

## Monitor panel

`/monitors` opens a bordered overlay styled with your current pi theme.

Keyboard controls:

| Key | Action |
| --- | --- |
| `↑` / `↓` | Select monitor |
| `a` | Toggle active-only / all monitors |
| `s` | Stop selected monitor |
| `q` / `Esc` | Close panel |

The panel shows:

- active and total monitor counts
- monitor id, status, kind, age, wakeup count
- command or watched path
- rate-limit window
- stderr temp file path for shell monitors
- recent monitor events

## Examples

### Watch application logs

```text
/monitor app errors :: tail -f app.log | grep --line-buffered -E "ERROR|WARN|FATAL"
```

### Monitor a dev server

```text
/monitor dev errors :: npm run dev 2>&1 | grep --line-buffered -i "error\|failed\|exception"
```

### Watch test failures

```text
/monitor test failures :: npm test 2>&1 | grep --line-buffered -E "FAIL|failed|Error:"
```

### Watch a source directory

```text
/monitor-watch src changes in src
```

### Poll GitHub comments without waking on every poll

```text
/monitor pr comments :: while true; do gh api repos/OWNER/REPO/issues/123/comments --jq '.[] | "\(.user.login): \(.body)"' || true; sleep 30; done
```

For real use, make poll loops stateful so they only print new items.

## Writing good monitors

Monitors are event streams. Every stdout line can become model context, so keep output selective.

Good:

```sh
tail -f app.log | grep --line-buffered -E "ERROR|WARN|FATAL"
```

Bad:

```sh
tail -f app.log
```

Guidelines:

- Use `grep --line-buffered` in pipelines so events arrive immediately.
- Filter aggressively; do not stream raw high-volume logs.
- Add `|| true` inside polling loops so one transient failure does not kill the monitor.
- Use 30s+ polling intervals for remote APIs.
- Avoid commands that print secrets.

## Security model

Shell monitors run arbitrary commands with the same OS permissions as pi. Treat `monitor_start` like `bash` plus a background lifetime.

Safety defaults:

- Interactive `monitor_start` tool calls and `/monitor` commands ask for confirmation before spawning a shell monitor.
- Headless shell monitors are blocked by default.
- To allow shell monitors in trusted headless automation, set:

```sh
PI_MONITOR_ALLOW_HEADLESS_SHELL=1
```

Output handling:

- Monitor stdout is injected into the session and may be sent to the active model.
- Monitor output is quoted and labeled as untrusted external data to reduce prompt-injection risk.
- Individual stdout lines, batches, and unterminated lines are capped.
- Stderr is not injected into the session. It is written to a private temp file capped at 1 MB for debugging.

## Lifecycle and limits

- Monitors are in-memory and session-owned.
- Switching, forking, reloading, or quitting the session stops monitors and suppresses pending wakeups.
- Events arriving within 200 ms are batched into one wakeup.
- Shell monitors default to 60 stdout lines/minute.
- Path watchers default to 120 events/minute.
- Exceeding the rate limit stops the monitor.
- Shell monitor stderr is capped at 1 MB.

## Development

Run checks:

```sh
npm test
npm run pi:load-check
npm run pack:dry
```

Try the package locally:

```sh
pi -e .
```

The smoke test checks syntax, pi package metadata, package dry-run, and avoids optional runtime imports that can break across pi package namespaces.

## Release process

This package uses SemVer. See [`RELEASE.md`](./RELEASE.md) for the release checklist, version policy, and publishing steps.

Short version:

```sh
npm test
npm run pi:load-check
npm run pack:dry
npm version patch   # or minor / major
npm publish --access public
```

## Package manifest

`pi-monitor` is a normal pi package. `package.json` declares:

```json
{
  "keywords": ["pi-package"],
  "pi": { "extensions": ["./extensions"] }
}
```

## License

MIT
