# Performance Troubleshooting

## Symptoms

The Fabric server experienced periods of serious tick lag. Logs included messages such as:

```text
Can't keep up! Is the server overloaded?
```

and repeated vehicle movement warnings while a player was travelling quickly through the world.

Some reported delays were several seconds, and one observed event was tens of seconds behind the tick schedule.

## Environment

During the main troubleshooting phase the server was running on an OpenVZ VPS with:

- 8 GB RAM
- initially 4 vCPU
- Java heap configured up to roughly 6 GB
- Crafty Controller on the same VPS

Additional CPU was later assigned during testing.

## Diagnostic Method

### 1. Separate host pressure from JVM pressure

I used `top`/`htop` to inspect:

- user CPU (`us`)
- system CPU (`sy`)
- idle CPU (`id`)
- I/O wait (`wa`)
- steal time (`st`)
- Java RSS / CPU
- Crafty/Python CPU
- OS logging/process activity

A useful observation during testing was that CPU steal time could be `0.0` while the guest itself was still effectively CPU-saturated. That helped avoid attributing every lag event to noisy neighbors on the OpenVZ host.

### 2. Reduce on-demand world generation

Chunky was used to pre-generate a radius of approximately 3000 blocks during one phase of testing.

This moved expensive terrain generation away from active player sessions and made it easier to determine whether remaining lag came from chunk generation, loading, ticking, networking, or another source.

### 3. Tune chunk concurrency

C2ME was used to parallelize chunk operations. On the small VPS, its global executor parallelism was deliberately constrained during testing rather than allowing chunk work to consume every available vCPU.

### 4. Reduce active simulation workload

Lower view and simulation distances were tested to reduce the number of chunks being loaded/ticked per player.

### 5. Profile the server thread

Spark was used as a profiling tool later in the troubleshooting process. The goal was to inspect MSPT/main-thread hotspots rather than infer bottlenecks only from high-level CPU percentages.

## Fabric Performance Stack

The project used or tested a server-side performance stack that included:

- Lithium
- FerriteCore
- C2ME
- ModernFix
- Krypton
- Chunky

Other utility/gameplay components included:

- Fabric API
- EasyAuth
- Simple Voice Chat

ServerCore was also present during one phase of the project and later became part of the compatibility/troubleshooting discussion, so the mod set was reviewed for overlap rather than assuming that more optimization mods always means better performance.

## Important Lesson

Performance troubleshooting was iterative. Not every suggestion from the troubleshooting conversations became part of the final design.

In particular, aggressive OS-level actions such as completely disabling core logging services are **not documented here as recommended fixes**. For a portfolio repository, the important work was the diagnostic process: measure, isolate, profile, change one layer at a time, and verify.

## Takeaways

- A large Java heap does not solve a CPU-bound server.
- Shared virtualization must be measured rather than blamed by default.
- Chunk generation, chunk loading, entity ticking, networking, JVM pauses, and management software can all produce similar player-visible lag.
- Pre-generation is both an optimization and a useful diagnostic technique.
- Linux process metrics and Minecraft MSPT/TPS data should be read together.
