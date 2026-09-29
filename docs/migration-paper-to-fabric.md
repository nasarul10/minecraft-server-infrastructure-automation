# PaperMC to Fabric Migration

## Why I Migrated

The original server ran PaperMC. The project later moved to Fabric because I wanted behavior closer to vanilla Minecraft while retaining server-side performance and utility mods.

## Main Migration Risk

Paper stores Nether and End dimension data separately from the Overworld, while vanilla/Fabric expects the dimension directories inside the main world.

```text
# Paper layout
world/
world_nether/DIM-1/
world_the_end/DIM1/

# Fabric / vanilla layout
world/
world/DIM-1/
world/DIM1/
```

If the JAR is changed without migrating these directories, Fabric can generate apparently new Nether/End dimensions.

## Migration Procedure Used

The practical sequence used in the project was:

```bash
# stop the service first
sudo systemctl stop minecraft

# back up the server directory before modifying world data
cd /opt/minecraft
# archive command omitted here because backup naming/storage changed during the project

# move Nether data
mv world_nether/DIM-1 world/

# move End data
mv world_the_end/DIM1 world/
```

After verifying those dimension directories, Paper-specific files were cleaned up and Fabric was installed.

Minecraft 1.21.10 was installed through Fabric Installer 1.1.0, which generated the Fabric launch JAR and downloaded the Minecraft server JAR.

The project then used Fabric API compatible with 1.21.10.

## Service Change

The systemd service originally launched `paper.jar` and was changed to launch the Fabric server JAR instead.

Conceptually:

```ini
# before
ExecStart=/usr/bin/java -Xms2G -Xmx6G -jar paper.jar --nogui

# after
ExecStart=/usr/bin/java -Xms2G -Xmx6G -jar fabric-server.jar nogui
```

## Validation

Validation included:

- confirming Fabric Loader and Minecraft 1.21.10 appeared in startup logs;
- confirming the server reached `Done` successfully;
- joining the server;
- checking the Nether and End to confirm existing builds/world state remained present;
- confirming RCON and the required server-side mods loaded.

## Result

The existing world was successfully brought forward into the Fabric-based server architecture without intentionally resetting the world dimensions.
