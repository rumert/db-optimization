#!/bin/bash

echo "[$(date)] Starting backup..."

if mongodump --host localhost --port 27020 --out /backups/full-backup-$(date +%F); then
    echo "[$(date)] Backup completed successfully."
else
    echo "[$(date)] Backup failed with error code $?"
fi
