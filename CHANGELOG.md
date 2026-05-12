# Changelog

All notable changes to `pi-event-monitor` will be documented in this file.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project uses [Semantic Versioning](https://semver.org/).

## [Unreleased]

## [0.1.0] - 2026-05-08

### Added

- Initial pi package with event-driven shell monitors.
- Path watcher monitor for files and directories.
- Tools: `monitor_start`, `monitor_watch_path`, `monitor_list`, `monitor_stop`.
- Commands: `/monitor`, `/monitor-watch`, `/monitors`, `/monitor-panel`, `/monitor-stop`.
- Monitor details overlay with active monitor counts, metadata, recent events, and stop action.
- Session lifecycle cleanup for switch, fork, reload, and shutdown.
- Smoke test and package dry-run validation.

### Security

- Shell monitor approval dialog in interactive sessions.
- Headless shell monitors blocked by default unless `PI_MONITOR_ALLOW_HEADLESS_SHELL=1`.
- Monitor output quoted and labeled as untrusted external data before injection into the session.
- Stdout truncation, batch caps, rate limits, and unterminated-line caps.
- Stderr stored outside the session in private temp files capped at 1 MB.

[Unreleased]: https://github.com/Helmi/pi-event-monitor/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/Helmi/pi-event-monitor/releases/tag/v0.1.0
