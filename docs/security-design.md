# Security Design

## Offline-Mode Trust Model

The server was intentionally operated with Minecraft `online-mode=false` during the project.

That means the Minecraft server does not independently verify that a connecting username belongs to the authenticated Microsoft/Mojang account owner. This is a materially different security model from an online-mode server.

## Mitigations

### EasyAuth

EasyAuth was installed to provide registration/login protection for players on the offline-mode Fabric server.

### Discord authorization

Administrative Discord commands were protected by an explicit user allowlist.

### Environment variables

Bot credentials were handled through `dotenv`/environment configuration rather than being embedded in public code.

### Restricted sudo

The automation user received passwordless sudo only for specific maintenance commands needed by the bot/backup workflow rather than unrestricted `NOPASSWD: ALL`.

### RCON

RCON was enabled for remote console operations. The project treated the RCON password as a secret and used it from the automation layer rather than exposing it in this repository.

## Public-Repository Rules

Never commit:

```text
.env
rclone.conf
Discord bot tokens
RCON passwords
Crafty credentials / API keys
Google OAuth tokens
server IPs if you do not want them public
world/
player data
ops.json
whitelist.json
backups/
logs containing player IPs
```

The root `.gitignore` enforces many of these exclusions.
