# T.1.4 — GitHub PR and standalone release
Status: In Progress

## Goal / authorization
The user explicitly requests pushing feat/codex_v2, opening a PR into main and running the release workflow. Publishing is authorized; merging the PR is not requested.

## Concept and acceptance
- Preserve main and feature/gemini_v1, push both v2 and the archived v1 branch, and open a reviewable PR.
- The existing release workflow attempts to publish a private, unscoped npm application and masks failures with `npm publish || true`. Replace this with the application's actual deliverable: a validated standalone HTML with its recordings and licenses embedded.
- A release-created event runs full diagnostics, retains a build artifact and attaches the standalone HTML to that release. Manual dispatch retains an artifact without creating an unsolicited release.
- Create version v2.3.0 from the v2 branch and verify the artifact and workflow completion. Deploy the authorized version through the existing Pages workflow on the same branch; leave the PR open.

## Validation / closure
Pending remote workflow execution.
