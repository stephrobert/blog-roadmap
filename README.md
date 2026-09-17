# blog-roadmap

**Read this in another language:** [Français](./README.fr.md)

**This repository is the public backlog of
[blog.stephane-robert.info](https://blog.stephane-robert.info).**

Use it to report an error, propose an improvement, request content and follow
what is planned. Everything goes through **issues**, and every issue sits in a
**project** that shows where it stands.

| | |
|---|---|
| The site | https://blog.stephane-robert.info |
| Report something | [Open an issue](https://github.com/stephrobert/blog-roadmap/issues/new/choose) |
| What is planned | [Roadmap](https://github.com/users/stephrobert/projects/3) |
| What already exists | [Open issues](https://github.com/stephrobert/blog-roadmap/issues) |

The site is written in French, and so is most of this tracker. **You can write
your issues in English**: every form accepts it, and the four forms reachable
from a page carry bilingual labels.

## This repository holds no site code

The site is an Astro Starlight project that lives **elsewhere**, in a separate
repository. You will find here **no page, no component, no build
configuration**, and nothing in this repository is needed to build or deploy the
site.

That separation is deliberate. A public backlog has to be readable, commentable
and sortable by anyone, without granting access to the repository that produces
the publication, and without mixing an editorial discussion with a code review.

The practical consequence: **an issue opened here is not fixed here**. It
describes a problem or an idea, it gets triaged, then the fix happens in the
site repository and the issue is closed with a reference to the commit.

## Reporting an error on a page

The easiest way starts from the page itself: every page carries a **report
block** at the end of its content, with one link per kind of problem. Each link
opens an issue already filled with the **page title**, its **URL** and its
**language**. You only have to describe what you found.

From GitHub, five forms exist:

| Form | When to use it |
|---|---|
| **Page error** | A wrong command, an inaccurate explanation, a screenshot that no longer matches |
| **Outdated content** | The page describes an old version, or the tool changed its behaviour |
| **Broken link** | An internal or external link no longer answers |
| **Content request** | A subject is missing, a course would deserve to exist |
| **Improvement** | The content is right, but the form, structure or path could be better |

A sixth one, **Other**, covers what fits nowhere. It comes last on purpose: a
well-filed issue moves faster.

## Proposing an improvement or some content

Proposals are welcome, and they do not need to be detailed to be useful. Two
things help: say **who** the content would serve, and **what the reader would
know how to do** after reading it. A request phrased as a need is handled far
better than a request phrased as a title.

Opening an issue **does not guarantee** it will be integrated. The site follows
an editorial line, and some requests will be declined or postponed. When that
happens, the reason is written in the issue before it is closed.

## Following what changes

The **blog.stephane-robert.info — Roadmap** project carries every issue with its
status, priority and area. The **Roadmap** and **Done** views show respectively
what is planned and what has just shipped.

To be notified about something precise, subscribe to the issue rather than to
the whole repository: the expected volume is high.

## How an issue moves

```text
Inbox  →  Triage  →  Backlog  →  Planned  →  In progress  →  Review  →  Done
                        ↓
                    Won't do
```

Triage rules, labels and automations live in
[docs/architecture.md](docs/architecture.md), and day-to-day operation in
[docs/administration.md](docs/administration.md).

## Licence

Issues and discussions in this repository are public. The site content itself
remains under the licence stated on the site.
