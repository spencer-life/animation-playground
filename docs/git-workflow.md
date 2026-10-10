# Git workflow

The baseline is [spencer-life/project-template](https://github.com/spencer-life/project-template)
and its [Git workflow](https://github.com/spencer-life/project-template/blob/main/docs/git-workflow.md).
Project-specific decisions and explicit user instructions take precedence within
their scope. This project uses local pnpm validation and intentionally has no
automatic GitHub Actions validation or deployment workflow.

## Track and implement

Use or reuse a GitHub issue describing the problem, acceptance criteria, current
status, validation, and delivery link. Search before creating a duplicate. If
GitHub access is unavailable, preserve pending work in tracked Markdown and
publish it when access is available.

Start independent work from current `main` in a clean task checkout. Resume work
on its owning branch; preserve unrelated edits and inspect existing work before
creating another branch. Use a focused topic branch and PR targeting `main`.
Use a stack only when separately reviewable changes have a real dependency.

Commit coherent recovery points and push useful checkpoints within scope. The
GitHub connector can manage issues, branches, files, commits, and PRs when shell
authentication is unavailable. Recheck current remote heads and use expected-SHA
checks for updates; do not overwrite concurrent work or invent access.

## Validate and review

Run applicable commands from [Contributing](../CONTRIBUTING.md). Record the full
revision, commands, results, coverage, and remaining limitations. Revalidate when
relevant source or the check contract changes. Preserve actual required checks,
reviews, and protection; local results do not replace any hosted gate that exists.

Before delivery, inspect the intended diff and base, latest full head SHA,
applicable checks and reviews, unresolved findings and conversations, and deployment
effects. Fix failures caused by the change and follow required work through
completion. A queued build or open PR is not delivery.

Under the standing template policy, KETA reviews current-head evidence and asks
for specific user merge approval identifying the repository, PR, and reviewed
head. Explicit task-specific user authorization takes precedence. The initial
Animation Playground request authorizes autonomous end-to-end building and
hosting without questions; that authorization is not a blanket policy for future
unrelated work. Known authorized deployment effects do not require repeat approval.
Never bypass tool approvals, required checks, reviews, protection, or credential
boundaries.

## Confirm delivery and clean up

Verify the actual merge and the hosted result. Record the delivered commit,
validation, live URL, and limitations in the issue. Close the issue only after
its acceptance criteria are met.

Refresh `main` safely. Remove only fully delivered task branches with no dirty
work, undelivered changes, active worktrees, or remaining dependents. Keep
unfinished work and identify its next step. Squash merges need confirmation of
the merged PR and delivered diff; ancestry alone is insufficient evidence.

Releases, unrelated maintenance, access changes, background automation, and new
service scope need their own authorization unless already included. A file alone
does not prove that hosting, protection, alerts, or a dependency bot is enabled.
Adding a manually triggered Pages publishing workflow is an optional later change,
not an assumption that Pages is configured.
