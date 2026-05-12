# Contributing

Thanks for your interest in `pi-event-monitor`.

## Start with an issue

Please open a GitHub issue before starting work on a pull request.

Use the issue to discuss:

- the problem or feature request
- proposed behavior
- security implications, especially for shell monitors
- compatibility concerns with pi versions or install modes

Small typo fixes are fine without prior discussion, but anything that changes behavior should have an issue first.

## Development

Run the checks before opening a PR:

```sh
npm test
npm run pi:load-check
npm run pack:dry
```

For UI or monitor behavior changes, also dogfood locally:

```sh
pi -e .
```

Recommended manual checks:

- `/monitor-watch` wakes on a file edit.
- `/monitors` renders the bordered panel and keyboard hints.
- `s` stops a selected monitor from the panel.
- `/monitor ... :: ...` shows the shell approval dialog.
- Headless shell monitors stay blocked unless `PI_MONITOR_ALLOW_HEADLESS_SHELL=1`.

## Security expectations

This package can start background shell commands, so security-sensitive changes need extra care.

Contributions must preserve these defaults unless an issue explicitly agrees otherwise:

- shell monitors require confirmation in interactive sessions
- headless shell monitors are blocked by default
- monitor output is treated as untrusted data
- stdout/stderr output is capped
- monitors are session-owned and stop on session lifecycle changes

Never commit tokens, credentials, local `.npmrc`, `.env`, logs, or temporary files.

## Release changes

For release-related work, follow `RELEASE.md` and keep `CHANGELOG.md` updated.

This project uses Semantic Versioning.
