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

Same limitation as project workflows, and verified rather than assumed:
GraphQL exposes **no mutation touching a discussion category**, and the REST API
has no endpoint at all, returning 404 even on a read. GitHub's API creates
discussions, not the categories that file them.

The six default categories already exist, so the target five are reached by
**renaming** rather than creating, which is faster:

| Default category | Becomes | Format |
|---|---|---|
| 💡 Ideas | **Idées et suggestions / Ideas and suggestions** | open |
| 💬 General | **Formations et pédagogie / Training and pedagogy** | open |
| 🙏 Q&A | **Questions** | keep Q&A |
| 🙌 Show and tell | **Retours d'expérience / Experience reports** | open |
| 📣 Announcements | **Annonces / Announcements** | keep announcement |
| 🗳 Polls | to delete | |

Renaming keeps the category identifier, so the two discussions already published
in Announcements stay where they are.

Pinning is manual too: there is no `pinDiscussion` mutation. Pin
**"Bienvenue : comment participer à l'évolution du site"**.
