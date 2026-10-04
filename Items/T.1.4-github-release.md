# T.1.4 — GitHub PR and standalone release
Status: Done

## Goal / authorization
The user explicitly requests pushing feat/codex_v2, opening a PR into main and running the release workflow. Publishing is authorized; merging the PR is not requested.

## Concept and acceptance
- Preserve main and feature/gemini_v1, push both v2 and the archived v1 branch, and open a reviewable PR.
- The existing release workflow attempts to publish a private, unscoped npm application and masks failures with `npm publish || true`. Replace this with the application's actual deliverable: a validated standalone HTML with its recordings and licenses embedded.
- A release-created event runs full diagnostics, retains a build artifact and attaches the standalone HTML to that release. Manual dispatch retains an artifact without creating an unsolicited release.
- Create version v2.3.0 from the v2 branch and verify the artifact and workflow completion. Deploy the authorized version through the existing Pages workflow on the same branch; leave the PR open.

## Validation / closure
- Local `./Diagnostics/check.sh` passed: 54 tests, parity/sample/adapters diagnostics, production and standalone builds, and diff check.
- Pushed `feat/codex_v2` and archived `feature/gemini_v1`. Open PR: https://github.com/KeyG89/rhythm-station/pull/1 (mergeable; main remains unchanged).
- Published https://github.com/KeyG89/rhythm-station/releases/tag/v2.3.0 from commit `3d8c2f9bd2df2878d5cd7c1ec9fc188f07005eeb`.
- Release run https://github.com/KeyG89/rhythm-station/actions/runs/37225278446 completed successfully, including full Linux diagnostics, standalone artifact upload and release attachment.
- Pages dispatch https://github.com/KeyG89/rhythm-station/actions/runs/37225291732 was rejected by the existing environment branch policy: feat/codex_v2 is not allowed to deploy. The policy and main were preserved. Merging the PR into main will trigger the existing Pages workflow automatically.
- This closure update only records publishing results; the released application and workflow are unchanged.

## User verification
Open the PR to review changes; open the release and download `standalone_yamaha.html` for the self-contained app. Pages remains on the prior main deployment until the PR is merged.
