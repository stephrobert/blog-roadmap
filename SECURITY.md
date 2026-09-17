# Reporting a security problem

**Read this in another language:** [Français](./SECURITY.fr.md)

This repository is a **public editorial backlog**. It holds no application code,
no deployment configuration and no secret. A vulnerability will not be found
here, but two neighbouring cases deserve a private channel.

## What must not go through a public issue

**A secret published by mistake on the site.** An API key, a token, a password or
an internal address that slipped into a guide example. Opening a public issue
would report it to everyone at the same time as to me, and freeze it in the
tracker history.

**A dangerous piece of security advice.** A command, a configuration or an
example that would expose the reader who applies it: permissions too wide,
authentication disabled, encryption missing. Reporting it privately leaves time
to fix the page before it is read further.

## How to report it

Through this repository's
**[Security Advisories](https://github.com/stephrobert/blog-roadmap/security/advisories/new)**,
which open a private thread between you and me.

Failing that, through the contact form on the site. Either way, give the **exact
URL** of the page and what looks dangerous to you.

## What you can expect

An acknowledgement within a few days. An exposed secret is handled first,
revoked, then removed from the content. A dangerous recommendation is corrected
on the page, and the correction is public even when the report was not.

## What falls outside this scope

An ordinary technical error, a broken link, outdated content: those are public
issues, and they are much better handled in the open. The forms of this
repository exist for that.

The site exposes no application service: it serves static pages through a CDN. A
vulnerability report about an application that does not exist will be closed
without further action.
