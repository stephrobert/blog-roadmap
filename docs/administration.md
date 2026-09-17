# Administration

**Read this in another language:** [Français](./administration.fr.md)

Day-to-day operation of the tracker: what is set up, what has to stay manual,
and how the circuit was verified.

## Manual setup, once

Three built-in project workflows **cannot be enabled through the API**. There is
no `createProjectV2Workflow` or `updateProjectV2Workflow` mutation in the public
GraphQL schema, only `deleteProjectV2Workflow`. They are enabled in the project
interface, under **Workflows**:

| Workflow | Setting |
|---|---|
| **Auto-add to project** | repository `blog-roadmap`, filter `is:issue,is:open` |
| **Item added to project** | set `Status` to `Inbox` |
| **Item closed** | set `Status` to `Done` |

The alternative would be the `actions/add-to-project` action, which needs a
personal access token stored as a repository secret. Three toggles cost less
than a long-lived token with project scope sitting in a public repository.

**View filters** have the same limitation: `ProjectV2ViewConfigurationInput`
only exposes `visibleFieldIds`. The seven views exist with their layout and
columns; each filter is pasted once in the interface.

| View | Filter |
|---|---|
| Inbox | `is:open status:Inbox` |
| Backlog | `is:open status:Backlog` |
| Current | `is:open status:Planned,"In progress",Review` |
| Content | `is:open label:type:content-request,type:content-error,type:outdated,type:enhancement` |
| Bugs | `is:open label:type:bug,type:broken-link,type:ux,type:seo` |
| Roadmap | `is:open status:Planned,"In progress"` |
| Done | `status:Done` |

## What the circuit was verified to do

Four issues, one per kind, opened on 2026-09-17 and then closed. The triage
workflow posed, without any manual step:

| Issue | Origin | Labels obtained |
|---|---|---|
| Page error, FR page | site marker | `area:kubernetes`, `source:reader` |
| Outdated, FR page, no source | site marker | `area:ansible`, `source:reader` |
| Broken link, **EN page** | site marker | `area:containers`, `source:reader` |
| Improvement, opened by the author | no marker | `area:site`, no `source:reader` |

Two things this proves, and one it disproves.

It proves that **the area is deduced for English pages too**. The patterns are
not anchored, they match a substring, so `/en/docs/conteneurs/...` contains
`/docs/conteneurs/...`. A review had reported this as broken; running the actual
patterns against English URLs showed otherwise.

It proves that **`source:reader` is only posed on issues carrying the site
marker**: the author-opened issue did not get it.

It disproves nothing about **falsifiability**: anyone can paste the marker line
into an issue. `source:reader` means "issue carrying the site marker", not
"proof it came from the button". That is enough for its purpose, measuring the
share of reader-originated fixes, and it is not worth complicating.

## The `main` branch is protected

A repository ruleset, modelled on the one used by `feint`, applies to the
default branch. Four constraints, active for everyone:

| Rule | Effect |
|---|---|
| `deletion` | the branch cannot be deleted |
| `non_fast_forward` | no history rewrite, so no `push --force` |
| `pull_request` | every change goes through a pull request, **zero approvals required** |
| `required_status_checks` | the PR waits for "Les gabarits portent les champs attendus", branch must be up to date |

Zero approvals is not a soft protection: on a repository held by a single
person, requiring a reviewer would make the rule either bypassable or blocking,
which amounts to the same thing. What the rule buys here is that no change lands
without going through a PR, hence without the form contract being checked, and
that history stays linear and intact.

The administrator role is listed in `bypass_actors`, but in `pull_request` mode:
it bypasses checks **inside** a PR, never by pushing straight to `main`.
Verified on the repository, a `git push origin main` is rejected.

What this changes day to day:

```bash
git switch -c <branch>
# ... changes, commit ...
git push -u origin <branch>
gh pr create --fill
gh pr merge --squash --delete-branch
```

The form contract check runs **without a path filter** on pull requests, unlike
its `push` trigger. This is deliberate: a required check filtered by path leaves
any PR that does not touch those files waiting forever.

## Opening an issue from a workstation

```bash
gh issue create --repo stephrobert/blog-roadmap \
  --title "[Page] <exact page title>" \
  --label "type:content-error,priority:medium,area:kubernetes,source:author" \
  --body-file <file>
```

The form is **not applied** on the command line: labels are set by hand, and the
body must carry the URL, otherwise the issue breaks its own triage rule. Write
the body into a file rather than inline: quoting breaks on accents and
apostrophes.

## The contract with the site, and its blind half

`contrat-formulaires.yml` checks, on every change to a form, that the four forms
reachable from a page carry `page-title`, `page-url`, `page-id` and `locale`,
and that their `title` prefix matches what the site sends.

It covers **only the half this repository owns**. A rename on the site side stays
invisible from here: the component carries the same warning in its header, and
the `pilotage-backlog` skill carries it a third time. Three copies of a warning
are cheaper than one silent regression.

## What must not be automated

Priority, effort, acceptance, refusal, and closing for inactivity. No `stale`
workflow is installed, and that is a decision, not an omission: an editorial idea
that sleeps for eighteen months is still a good idea.

## Discussion categories: why they are set by hand

Same limitation as project workflows, and verified rather than assumed: GraphQL
exposes **no mutation that creates, renames or deletes a discussion category**,
and the REST API has no endpoint at all, returning 404 even on a read. The only
mutable `categoryId` is the one on `updateDiscussion`, which **moves** a
discussion without touching the category. GitHub's API files discussions, it
does not build the drawers.

The six default categories were therefore **renamed** rather than created, which
keeps their identifier and leaves already published discussions in place. Here
is the state recorded on 2026-09-17, slugs included:

| Category | Actual slug | Format | Template |
|---|---|---|---|
| 💡 Idées & suggestions | `idées-suggestions` | open | yes |
| 🎓 Formations & pédagogie | `formations-pédagogie` | open | yes |
| ❓ Questions | `questions` | Q&A | yes |
| 🔬 Retours d'expérience | `retours-d-expérience` | open | yes |
| 📣 Annonces | `annonces` | announcement | no, write-restricted |
| 🗳 Polls | deleted | | |

**The slug is not guessed, it is measured.** GitHub lowercases, replaces spaces,
`&` and apostrophes with a dash, collapses consecutive separators, and **keeps
accents**. The first version of `.github/discussions.yml` bet on
transliteration, and querying the repository returned all three mismatches at
once.

This check is not automated: a renamed or deleted category produces **no
signal**. Redo it by hand whenever categories move, the query sits at the top of
`.github/discussions.yml`.

This is not cosmetic: GitHub pairs a `DISCUSSION_TEMPLATE/` form with its
category **by file name**. With a wrong slug, nothing errors out, the form
simply never shows up. Renaming a category means renaming its template in the
same move.

Pinning is manual too: the schema carries `pinIssue` and `unpinIssue`, but no
equivalent for a discussion, verified on 2026-09-17. Still to pin:
**"Bienvenue : comment participer à l'évolution du site"**.
