# Pilot architecture

**Read this in another language:** [Français](./architecture.fr.md)

This document describes how a report becomes a published fix. It is the
reference for triage, labels and automations.

## The circuit

```text
SITE  blog.stephane-robert.info
  │
  │   report block at the bottom of every page, one link per kind of problem
  │   pre-fills title, URL and language
  ▼
GITHUB ISSUE  stephrobert/blog-roadmap
  │
  │   Issue Form: the reader only describes the problem
  │   Triage action: adds source:reader and area:*
  ▼
GITHUB PROJECT  "blog.stephane-robert.info — Roadmap"
  │
  ├─ Inbox        arrived, untriaged
  ├─ Triage       type, priority, area and effort being set
  ├─ Backlog      accepted, not scheduled
  ├─ Planned      scheduled
  ├─ In progress  being fixed, in the SITE repository
  ├─ Review       fixed, waiting for publication
  ├─ Done         published
  └─ Won't do     declined, with the reason written in the issue
  │
  ▼
SITE REPOSITORY  (separate)
  fix, build, publish
  │
  ▼
ISSUE CLOSED  referencing the commit
```

The important part is the **boundary**: this repository carries the decision, the
site repository carries the fix. No content is ever modified here.

## Labels

The taxonomy is deliberately **short**. A tracker dies of too many labels long
before it dies of too many issues: past twenty or so, nobody applies them the
same way any more, and filtering stops meaning anything.

### Type, one per issue

| Label | What it means |
|---|---|
| `type:content-error` | The page says something wrong |
| `type:outdated` | The page was right, the technology changed |
| `type:broken-link` | A link no longer answers |
| `type:content-request` | Content that does not exist yet |
| `type:enhancement` | The content is right, the form could be better |
| `type:seo` | Search, metadata, heading structure |
| `type:ux` | Navigation, readability, site ergonomics |
| `type:bug` | Technical defect of the site itself |

`type:outdated` and `type:content-error` are often confused. The rule: if the
page **has ever been right**, it is `outdated`; if it has **never** been right,
it is `content-error`. The distinction is not cosmetic, it decides the fix, a
version refresh in one case, a rewrite in the other.

### Priority, one per issue

| Label | Criterion |
|---|---|
| `priority:critical` | A reader applying the page breaks something, or gets exposed |
| `priority:high` | Wrong information on a heavily read page, or a blocked path |
| `priority:medium` | Real defect, no immediate consequence |
| `priority:low` | Comfort, consistency, debt |

Priority is set **at triage**, never at creation. An issue arriving with a
priority announced by its author still gets one assigned.

### Area

`area:kubernetes`, `area:linux`, `area:ansible`, `area:terraform`, `area:cloud`,
`area:devsecops`, `area:containers`, `area:observability`, `area:ai`,
`area:site`.

These are **deduced from the URL** by the triage workflow, and the last one,
`area:site`, covers what concerns no content: navigation, search, theme,
performance.

**What `area` means, and what it does not.** `area` names the **content
affected**, never the nature of the problem, which is what `type` is for. A
navigation defect observed on a Kubernetes page is therefore
`type:ux` + `area:kubernetes`, not `area:site`. `area:site` is reserved for what
concerns no content at all: the home page, search, the theme, global
performance.

### Source

`source:reader`, `source:author`, `source:automated`.

`source:reader` is added automatically when the issue comes from the site. It
measures something useful: the share of fixes that come from readers rather than
from an internal review.

## Triage rules

An issue leaves **Inbox** when four things are true:

1. it carries a **usable URL**, or does not need one;
2. it describes **one actionable thing**, otherwise it is split;
3. it carries a **type** and a **priority**;
4. it is not a **duplicate**, otherwise it is closed referencing the other one.

Three frequent refusals, always motivated in writing:

- **outside the editorial line**: the subject exists, it does not fit the scope
  the site set for itself;
- **already covered elsewhere**: a page answers the need, the issue becomes an
  internal linking problem;
- **not reproducible**: the report does not allow finding the defect again, and a
  follow-up went unanswered.

## Automations

What is automated is what a human would retype **identically** every time. The
rest is not, by choice.

| Automation | Where | What it does |
|---|---|---|
| Add to project | Project built-in workflow | Every new issue lands in `Inbox` |
| Move to Done | Project built-in workflow | A closed issue moves to `Done` |
| Source and area | `.github/workflows/issue-triage.yml` | Adds `source:reader` and `area:*` from the URL |

**What is not automated, and will not be**: priority, effort, acceptance,
refusal, and closing for inactivity. An editorial backlog is not a bug queue: an
idea that sleeps for eighteen months is still a good idea, and a bot closing it
after sixty days destroys exactly what this repository exists to preserve. That
is why **no `stale` workflow is installed**.

The triage workflow never **removes** a label. A wrong deduction corrected by
hand stays corrected, even if the issue is edited afterwards.

## Pre-filling from the site

The report block of every page builds one URL per form and passes the fields
through the query string. Parameter names are the **field identifiers** of the
forms, and renaming an identifier silently breaks the pre-filling.

| Parameter | Form field |
|---|---|
| `title` | the issue title |
| `page-title` | Page |
| `page-url` | URL |
| `page-id` | Page id, the Starlight identifier |
| `locale` | Page language |

The four forms reachable from a page all carry these four identifiers, which is
what lets the site send them the same context. `page-id` matters because a URL
changes: a section rework moves dozens of pages, and historical issues would stop
being attachable to the content they targeted. The
`contrat-formulaires.yml` workflow checks this half of the contract on every
change to a form. GitHub's chooser page,
`/issues/new/choose`, **does not forward query parameters**: that is why each
kind of problem targets its own form directly.

## What this repository does not do

It does not measure audience, it does not collect "was this page helpful" votes,
and it receives no metric. Those signals have their place, but separately:
turning every thumbs-down into an issue would drown the backlog in
non-actionable noise and make the tracker unusable within weeks.
