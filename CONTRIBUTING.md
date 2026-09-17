# Contributing to the backlog

**Read this in another language:** [Français](./CONTRIBUTING.fr.md)

This repository collects reports and requests about
[blog.stephane-robert.info](https://blog.stephane-robert.info). It takes **no
code**: the site repository is separate, and a fix happens there once the issue
has been triaged.

You can write in **English or French**.

## Before opening an issue

Four habits, in this order.

**1. Check it does not already exist.** Searching on the page URL is usually
enough: `is:issue "your-url"`. Commenting on an existing issue beats opening a
second one, because two threads on the same subject rarely answer each other.

**2. Give the exact URL.** It is the one piece of information without which an
issue cannot be handled. A page named from memory, "the NetworkPolicy guide",
often points at three different pages. The **report block at the bottom of every
page** fills that field for you.

**3. Describe what you observed**, not only what bothered you. A command that
fails with its error message, a value that does not match what the tool returns,
a missing step: those are verifiable facts. "The page is unclear" is not, and the
issue will stall for lack of anything to fix.

**4. Provide a source when you report outdated content.** A link to the
changelog, the release note or the official documentation. Without it, the whole
check has to be redone before anything can happen, and the issue waits.

## What to expect

Proposals are **welcome**, including those that challenge an editorial choice.
They are read.

However, **opening an issue does not guarantee integration**. The site follows a
line, it refuses to grow for the sake of growing, and some requests will be
postponed or declined. When that happens, the reason is written in the issue
before it is closed: a refusal without a reason is a refusal that comes back.

Delays vary. A factual error or a broken link gets fixed quickly. A request for a
whole course is measured in weeks, and sometimes in a refusal.

## Tone

Discussions stay **technical and factual**. They are about what a page says, what
a tool does, and the gap between the two. A disagreement is settled by a source,
not by insistence.

Statements about intent, comments about people, and repeated pushes on an issue
that has already been decided are off topic, and the thread is locked when
needed.

## One issue, one action

The tracker has to stay usable with several hundred open issues. That calls for
one simple discipline: **an issue describes one thing to do**.

An issue bundling six remarks about six pages cannot be planned, cannot be
prioritised and never closes entirely. Six short issues move forward where one
long issue stalls. If you review a whole course, open one issue per page.

## What happens next

Every new issue lands in the **Inbox** column of the project, untriaged. It then
receives a **type**, a **priority** and an **area**, and joins the backlog or is
declined. That circuit is detailed in
[docs/architecture.md](docs/architecture.md).
