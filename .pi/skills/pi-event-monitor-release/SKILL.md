---
name: pi-event-monitor-release
description: Release workflow for pi-event-monitor. Use when preparing, validating, versioning, changelogging, tagging, or publishing a pi-event-monitor release.
---

# pi-event-monitor Release Skill

Use this skill for every release of `pi-event-monitor`.

## Principles

- Use Semantic Versioning: `MAJOR.MINOR.PATCH`.
- `package.json.version` is the source of truth.
- Git tags are `vX.Y.Z`.
- Keep `CHANGELOG.md` accurate and user-facing.
- Never publish from a dirty working tree.
- Never include credentials or npm tokens in files, commits, logs, or release notes.
- Use npm for package publish commands because pi package installation/publishing follows npm conventions.

## Version decision

Choose the smallest correct bump:

- Patch: compatible bug fixes, docs, tests, internal hardening without user-visible behavior changes.
- Minor: backwards-compatible features, new tools/commands/options, UI improvements.
- Major: breaking command/tool names, package layout, monitor semantics, environment variables, or minimum runtime support.

While `0.x`, breaking changes may use a minor bump, but they must be called out clearly in `CHANGELOG.md`.

## Pre-release checklist

1. Confirm the working tree is clean except intended release edits:

   ```sh
   git status --short
   ```

2. Review changes since the last tag:

   ```sh
   git log --oneline --decorate --max-count=20
   git diff --stat $(git describe --tags --abbrev=0 2>/dev/null || git rev-list --max-parents=0 HEAD)..HEAD
   ```

3. Update `CHANGELOG.md`:
   - Move relevant `Unreleased` entries into `## [X.Y.Z] - YYYY-MM-DD`.
   - Use Added / Changed / Fixed / Security / Deprecated / Removed as applicable.
   - Mention security-relevant changes explicitly.
   - Update comparison links at the bottom.

4. Run validation:

   ```sh
   npm test
   npm run pi:load-check
   npm run pack:dry
   ```

5. Dogfood when UI or monitor behavior changed:

   ```sh
   pi -e .
   ```

   Manual checks:
   - `/monitor-watch` wakes on a file edit.
   - `/monitors` renders the bordered panel and keyboard hints.
   - `s` stops a selected monitor from the panel.
   - `/monitor ... :: ...` shows the shell approval dialog.
   - Headless shell monitor behavior remains blocked unless `PI_MONITOR_ALLOW_HEADLESS_SHELL=1`.

## Cutting the release

After changelog and validation:

```sh
npm version patch   # or minor / major
```

This creates a version commit and a `vX.Y.Z` tag.

Push:

```sh
git push origin main --follow-tags
```

Publish manually until CI publishing is configured:

```sh
npm publish --access public
```

## After publishing

Verify npm metadata:

```sh
npm view pi-event-monitor version
npm view pi-event-monitor --json
```

Verify install instructions:

```sh
pi -e npm:pi-event-monitor
# or
pi install npm:pi-event-monitor
```

## CI publishing plan

When GitHub Actions publishing is added:

- Trigger on `v*.*.*` tags.
- Run `npm test`, `npm run pi:load-check`, and `npm run pack:dry` before publish.
- Use npm provenance if supported.
- Store npm token only as a GitHub Actions secret, never in the repository.
- Keep manual `npm publish` as the fallback documented in `RELEASE.md`.
