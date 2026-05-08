# Release process

`pi-monitor` uses [Semantic Versioning](https://semver.org/): `MAJOR.MINOR.PATCH`.

## Version policy

- **Patch** (`0.1.1`): compatible bug fixes, documentation fixes, test-only changes, small hardening that does not change user-facing behavior.
- **Minor** (`0.2.0`): backwards-compatible features, new tools/commands/options, meaningful UX improvements.
- **Major** (`1.0.0`, `2.0.0`): breaking changes to tool names, command syntax, monitor semantics, environment variables, package layout, or minimum pi/Node support.

While the package is `0.x`, minor versions may include API/behavior changes. Still, prefer treating breaking changes as a minor bump and calling them out clearly in `CHANGELOG.md`.

## Source of truth

- `package.json.version` is the canonical version.
- Git tags use `vX.Y.Z`, e.g. `v0.1.0`.
- `CHANGELOG.md` records user-visible changes.

## Pre-release checklist

From a clean working tree:

```sh
npm test
npm run pi:load-check
npm run pack:dry
```

Also dogfood interactively before public release:

```sh
pi -e .
```

Recommended manual checks:

1. Start a path watcher with `/monitor-watch` and confirm a file edit wakes the session.
2. Open `/monitors` and confirm active monitor details render.
3. Stop a monitor from the panel with `s`.
4. Start a shell monitor with `/monitor ... :: ...` and confirm the approval dialog appears.
5. Confirm headless shell monitor behavior is blocked unless `PI_MONITOR_ALLOW_HEADLESS_SHELL=1`.

## Cutting a release

Choose the bump:

```sh
npm version patch   # or minor / major
```

This updates `package.json` and creates a git commit + `vX.Y.Z` tag.

Then push:

```sh
git push origin main --follow-tags
```

Publish to npm when ready:

```sh
npm publish --access public
```

If publishing from git instead of npm, create a GitHub release for the tag and install with:

```sh
pi install git:github.com/<owner>/pi-monitor@vX.Y.Z
```

## Changelog discipline

Use `CHANGELOG.md` with these sections when relevant:

- Added
- Changed
- Fixed
- Security
- Deprecated
- Removed

Before `npm version`, move items from `Unreleased` into the new version section with the release date.

## Compatibility notes

- Keep pi core imports minimal and type-only when possible.
- Do not add runtime imports from `@earendil-works/pi-ai` or `@earendil-works/pi-tui` unless package resolution has been tested across global, local, npm, and git installs.
- Any feature that can run shell commands must document its security model and default to safe behavior in headless mode.
