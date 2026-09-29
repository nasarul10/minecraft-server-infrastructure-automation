/**
 * Sanitized reference implementation of the Discord operations pattern used
 * in this project. The production bot source was not included in the exported
 * conversations, so this file recreates the documented architecture without
 * claiming to be the original source file.
 */

require('dotenv').config();

const { execFile } = require('node:child_process');
const { promisify } = require('node:util');
const {
  Client,
  GatewayIntentBits,
  REST,
  Routes,
  SlashCommandBuilder,
} = require('discord.js');
const { Rcon } = require('rcon-client');

const execFileAsync = promisify(execFile);
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

const authorizedUsers = new Set(
  (process.env.AUTHORIZED_USERS || '')
    .split(',')
    .map((id) => id.trim())
    .filter(Boolean),
);

const commands = [
  new SlashCommandBuilder().setName('start').setDescription('Start Minecraft'),
  new SlashCommandBuilder().setName('stop').setDescription('Stop Minecraft'),
  new SlashCommandBuilder().setName('status').setDescription('Show service status'),
  new SlashCommandBuilder().setName('backup').setDescription('Run the maintenance backup'),
  new SlashCommandBuilder()
    .setName('exec')
    .setDescription('Run a Minecraft console command over RCON')
    .addStringOption((option) =>
      option.setName('command').setDescription('Minecraft console command').setRequired(true),
    ),
].map((command) => command.toJSON());

function requireAuthorization(interaction) {
  return authorizedUsers.has(interaction.user.id);
}

async function sudoSystemctl(action) {
  const allowed = new Set(['start', 'stop', 'status']);
  if (!allowed.has(action)) throw new Error('Unsupported systemctl action');

  const { stdout, stderr } = await execFileAsync('/usr/bin/sudo', [
    '/bin/systemctl',
    action,
    'minecraft',
  ]);

  return (stdout || stderr || `${action} completed`).trim();
}

async function runBackup() {
  const { stdout, stderr } = await execFileAsync('/usr/bin/sudo', [
    '/usr/local/bin/mc_restart.sh',
  ]);
  return (stdout || stderr || 'Backup completed').trim();
}

async function runRcon(command) {
  const rcon = await Rcon.connect({
    host: process.env.RCON_HOST || '127.0.0.1',
    port: Number(process.env.RCON_PORT || 25575),
    password: process.env.RCON_PASSWORD,
  });

  try {
    return await rcon.send(command);
  } finally {
    rcon.end();
  }
}

client.once('ready', () => {
  console.log(`Discord operations bot logged in as ${client.user.tag}`);
});

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  if (!requireAuthorization(interaction)) {
    await interaction.reply({ content: 'Not authorized.', ephemeral: true });
    return;
  }

  await interaction.deferReply({ ephemeral: true });

  try {
    let output;
    switch (interaction.commandName) {
      case 'start':
      case 'stop':
      case 'status':
        output = await sudoSystemctl(interaction.commandName);
        break;
      case 'backup':
        output = await runBackup();
        break;
      case 'exec':
        output = await runRcon(interaction.options.getString('command', true));
        break;
      default:
        output = 'Unknown command.';
    }

    await interaction.editReply(`\`\`\`\n${String(output).slice(0, 1800)}\n\`\`\``);
  } catch (error) {
    console.error(error);
    await interaction.editReply(`Operation failed: ${error.message}`);
  }
});

async function main() {
  const required = ['DISCORD_TOKEN', 'DISCORD_CLIENT_ID', 'DISCORD_GUILD_ID'];
  for (const key of required) {
    if (!process.env[key]) throw new Error(`Missing ${key}`);
  }

  const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);
  await rest.put(
    Routes.applicationGuildCommands(
      process.env.DISCORD_CLIENT_ID,
      process.env.DISCORD_GUILD_ID,
    ),
    { body: commands },
  );

  await client.login(process.env.DISCORD_TOKEN);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
