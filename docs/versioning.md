# StoryForge Versioning

## Table Of Contents

- [Version Format](#version-format)
- [Version Rules](#version-rules)
- [Issue Version Impact](#issue-version-impact)
- [Examples](#examples)
- [Release Checklist](#release-checklist)

## Version Format

StoryForge uses Semantic Versioning in the `MAJOR.MINOR.PATCH` format.

Official docs: [Semantic Versioning 2.0.0](https://semver.org/)

## Version Rules

- **Major version:** increment for breaking changes that change expected user workflows, public data shapes, route contracts, or generated story compatibility.
- **Minor version:** increment for backward-compatible features, reusable foundations, meaningful UI additions, new export options, new generation options, or architecture improvements that expand the app without breaking existing behavior.
- **Patch version:** increment for backward-compatible bug fixes, small copy updates, styling fixes, documentation fixes, dependency patch updates, and internal cleanup with no meaningful feature expansion.

For `0.x.y` thesis-stage releases, StoryForge still uses the same practical meaning: `0.MINOR.PATCH`. A minor bump marks a meaningful project milestone, while a patch bump marks a safe fix or small cleanup.

## Issue Version Impact

Each issue should include a **Version impact** section.

Use one of these values:

- `major`: breaking change or incompatible behavior change
- `minor`: backward-compatible feature, reusable foundation, or meaningful architecture improvement
- `patch`: bug fix, documentation update, styling fix, or small internal cleanup
- `none`: planning, research, duplicate issue, or work that does not ship a code/documentation change

Issue version impact is an estimate. The final pull request or release decides the actual version bump based on the combined shipped changes.

## Examples

- `0.3.0` to `0.3.1`: fix generated story validation error text.
- `0.3.0` to `0.4.0`: add reusable UI primitives and shared generation validation.
- `0.4.0` to `0.5.0`: add a new story export format.
- `0.5.0` to `1.0.0`: declare the thesis-ready stable release.
- `1.0.0` to `2.0.0`: change the saved/generated story schema in a way that older consumers cannot use.

## Release Checklist

1. Review completed issues and pull requests.
2. Pick the highest required version impact: major beats minor, minor beats patch.
3. Update `package.json` and `package-lock.json`.
4. Run `npm run check:all`.
5. Use the final version in release notes, issue closeout, and pull request summary.
