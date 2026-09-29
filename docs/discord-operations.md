# Discord-Based Server Operations

## Problem

A Minecraft plugin cannot reliably start a stopped Minecraft server because the plugin stops when the JVM stops. Remote power control therefore has to exist outside the Minecraft process.

## Solution Implemented

I built a custom Node.js bot and ran it independently from Minecraft.

### Stack

- Node.js 20
- Discord.js v14
- `rcon-client`
- `dotenv`
- systemd

### Service location

```text
/opt/discord_bot
```

### Process manager

The bot was run as a native Linux service:

```text
discord-bot.service
```

rather than relying on PM2 or an interactive shell.

## Commands

The documented slash commands were:

```text
/start
/stop
/status
/backup
/exec
```

## Dual-Control Model

The bot used two mechanisms:

### systemd

Used for actions that affect the process lifecycle:

```text
start / stop / status
```

### RCON

Used for Minecraft console operations while the server was online.

This split is useful because RCON only exists while Minecraft is running, whereas systemd remains available even when the Minecraft process is stopped.

## Authorization

The project used an `AUTHORIZED_USERS` allowlist so only explicitly permitted Discord users could invoke administrative actions.

Secrets such as Discord tokens and RCON credentials belong in environment variables and are intentionally excluded from this repository.

## Privilege Boundary

The Linux user running the bot needed non-interactive access to a limited set of administrative commands. This was implemented with `sudoers` rather than running the entire bot as root.

The original project granted passwordless access only to a defined command set used by automation. A sanitized example is provided in [`../examples/sudoers.example`](../examples/sudoers.example).
