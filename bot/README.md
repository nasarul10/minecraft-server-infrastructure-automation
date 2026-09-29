# Discord Operations Bot

The production project used a custom Node.js bot under `/opt/discord_bot` with Discord.js v14, `rcon-client`, and `dotenv`.

Documented commands:

```text
/start
/stop
/status
/backup
/exec
```

The architecture combined:

- Linux `systemctl` operations for starting/stopping the service;
- Minecraft RCON for live console commands;
- an authorized Discord-user list;
- a dedicated systemd service.

## Reference implementation

[`index.example.js`](index.example.js) is a **sanitized reconstruction of the documented design**, not the original production source file. The exported project conversations describe the bot's stack, commands, control model, service location, and authorization design, but do not contain the original complete JavaScript source.

The example exists to make the infrastructure design concrete while keeping the portfolio honest about what source material was available.
