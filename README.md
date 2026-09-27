# GTAW Image Manager — Web

Public landing and install page for GTAW Image Manager.

## Product workflow

The product is Discord-first and uses Discord HTTP Interactions:

1. Add the application to a Discord server.
2. A member with **Manage Server** runs `/setup`.
3. Select exactly one screenshot approval channel and exactly one approver role.
4. Users post PNG, JPEG, WebP or GIF screenshots in that channel.
5. An authorized approver right-clicks a screenshot and chooses **Apps → Approve Screenshot**.
6. The serverless backend validates the interaction and processes the image.
7. The bot posts hosted image URLs and grouped BBCode in the uploader's private Discord thread.
8. Approved screenshots are marked with a ☑️ reaction, and duplicate approvals are handled gracefully.

There is no separate upload dashboard and no persistent Discord Gateway worker in the current architecture.

## Deploy

This repo is built with Vite and deployed to GitHub Pages using GitHub Actions.

Project Pages URL:

`https://bucksmon.github.io/GTAW-Image-Manager-Web/`

## Development

Requirements: Node.js 24+.

```bash
npm --prefix frontend install
npm --prefix frontend run dev
npm --prefix frontend run build
```

## Configuration

The only public build variable is:

`VITE_DISCORD_CLIENT_ID`

The Discord application ID is not a secret. Bot tokens, API keys, MongoDB credentials and image-provider credentials belong in the private serverless backend deployment.

## Repository

The frontend is intentionally a static public site. Discord interactions, image processing, hosting-provider calls and database operations are handled by the private backend.
