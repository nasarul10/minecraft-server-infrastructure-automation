#!/usr/bin/env bash
# Sanitized portfolio example based on the maintenance workflow used in the project.
# Adapt paths, service name, rclone remote, retention policy, and notification method
# before using this on a real server.

set -euo pipefail

SERVICE_NAME="minecraft"
SERVER_DIR="/srv/minecraft"
BACKUP_DIR="/srv/backups/minecraft"
RCLONE_REMOTE="gdrive:Minecraft_Server_Backups"
TIMESTAMP="$(date -u +'%Y-%m-%d_%H-%M-%S')"
ARCHIVE="$BACKUP_DIR/minecraft-$TIMESTAMP.tar.gz"

mkdir -p "$BACKUP_DIR"

# In the production project, players were warned before maintenance.
# A deployment can do that over RCON here.

echo "[$(date -u --iso-8601=seconds)] stopping $SERVICE_NAME"
sudo systemctl stop "$SERVICE_NAME"

cleanup() {
  # If the script fails after stopping the server, try to bring it back online.
  if ! systemctl is-active --quiet "$SERVICE_NAME"; then
    sudo systemctl start "$SERVICE_NAME" || true
  fi
}
trap cleanup EXIT

echo "[$(date -u --iso-8601=seconds)] creating archive $ARCHIVE"
tar -czf "$ARCHIVE" -C "$SERVER_DIR" .

echo "[$(date -u --iso-8601=seconds)] uploading backup"
rclone copy "$ARCHIVE" "$RCLONE_REMOTE"

echo "[$(date -u --iso-8601=seconds)] starting $SERVICE_NAME"
sudo systemctl start "$SERVICE_NAME"

trap - EXIT

echo "[$(date -u --iso-8601=seconds)] maintenance backup completed"

# The original project also incorporated VPS rebooting in its scheduled
# maintenance flow. It is intentionally not enabled in this public example.
