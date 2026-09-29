# Automation and Backups

## Goal

The goal was to make routine server maintenance independent of an active SSH session and to keep an off-host copy of the server data.

## Tooling

- Bash
- cron
- systemd
- tar/archive tooling
- rclone
- Google Drive

## Final Documented Scheduled Workflow

The final project notes record a maintenance script at:

```text
/usr/local/bin/mc_restart.sh
```

with a cron schedule of:

```cron
0 3 * * *
```

The host used UTC/GMT, so this ran daily at 03:00 UTC.

The workflow was designed to:

1. warn connected players;
2. stop the Minecraft service cleanly;
3. create a compressed backup;
4. upload the backup to Google Drive using rclone;
5. write maintenance output to a log;
6. reboot the VPS as part of the scheduled maintenance flow.

The documented log file was:

```text
/home/<linux-user>/mc_restart.log
```

## rclone Issue Resolved

During implementation, the cron-driven process initially ran into permission problems accessing `rclone.conf`. Ownership/permissions were corrected so the user running the cron job could read the configured Google Drive remote.

## Crafty Transition

After Crafty imported the Minecraft server, the active server files moved under Crafty's managed server directory. That meant backup paths created during the earlier `/opt/minecraft` phase had to be reviewed so automation did not continue archiving an obsolete path.

This was an important infrastructure lesson: **automation that contains absolute paths must be revalidated after application migration**.

## Public Example

[`../scripts/mc_restart.example.sh`](../scripts/mc_restart.example.sh) is a sanitized reference implementation. It intentionally contains placeholders rather than production paths, credentials, remote names, or player data.
