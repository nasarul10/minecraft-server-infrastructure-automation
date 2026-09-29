# Project Timeline

This repository documents an evolving home-lab/server-administration project. The important part is the progression of the infrastructure, not a single frozen configuration.

## 1. PaperMC on Ubuntu

- Minecraft Java server hosted on Ubuntu VPS.
- Managed directly with a `minecraft` systemd unit.
- RCON enabled for remote console operations.

## 2. Migration to Fabric

- Existing Paper world backed up.
- Nether and End dimension directories migrated into the vanilla/Fabric world structure.
- Fabric 1.21.10 installed using Fabric Installer.
- Fabric API and server-side mods added.
- systemd startup changed from Paper JAR to Fabric launcher.

## 3. Server-Side Features

- EasyAuth added for authentication in offline mode.
- Simple Voice Chat added with its UDP service port.
- Chunky added for world pre-generation.
- Performance mods introduced: Lithium, FerriteCore, C2ME, ModernFix, Krypton.

## 4. Automated Backups

- rclone configured for Google Drive.
- Backup/maintenance script created.
- cron added for daily execution.
- rclone permissions adjusted so scheduled jobs could use the remote configuration.

## 5. Discord Operations

- Custom Node.js/Discord.js bot created.
- Slash commands added for lifecycle, status, backups, and remote execution.
- systemd and RCON used as separate control planes.
- bot moved under its own systemd service.
- Discord-user authorization allowlist added.

## 6. Crafty Controller

- Crafty Controller installed under `/opt/crafty`.
- Existing Minecraft server imported into Crafty's managed server area.
- Crafty configured as a persistent systemd service.
- Backup and filesystem paths reviewed after the migration.

## 7. Performance Investigation

- Investigated repeated `Can't keep up` and movement warnings.
- Used Linux CPU/memory statistics to distinguish host steal time from guest saturation.
- Pre-generated world terrain with Chunky.
- Tuned/tested C2ME concurrency and server render/simulation workload.
- Reviewed performance-mod compatibility.
- Used Spark-style profiling to move from guesswork toward main-thread measurement.
