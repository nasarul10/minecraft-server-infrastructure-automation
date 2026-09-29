# Security Policy / Sanitization Notes

This is a portfolio repository. Production credentials and player/server data must not be committed.

## Secrets to keep private

- Discord bot token
- Discord application/client secrets
- RCON password
- Crafty credentials and API keys
- Google/rclone OAuth tokens
- private SSH keys
- server IP/address information you do not want public

## Sensitive runtime data

Do not publish the Minecraft world, player data, authentication database, backups, or logs containing player IP addresses.

## Environment files

Use a local `.env` file and keep only `.env.example` in Git.

## sudoers

Grant the automation account only the commands it genuinely needs. Avoid running the Discord bot itself as root.
