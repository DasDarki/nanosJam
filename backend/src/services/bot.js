const { Client, Intents } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS] });

let guild = null;
let testerRole = null;

client.on("ready", async () => {
    try {
        guild = await client.guilds.fetch(process.env.DISCORD_GUILD_ID);
        testerRole = await guild.roles.fetch(process.env.DISCORD_TESTER_ROLE_ID);
    } catch (e) {
        console.error("Failed to initialize Discord Bot: ", e);
    }
});

function startBot() {
    return client.login(process.env.DISCORD_BOT_TOKEN);
}

async function isTester(userId) {
    if (!testerRole) {
        return false;
    }

    const user = await guild.members.fetch(userId);
    if (!user) {
        return false;
    }

    return user.roles.cache.some(role => role.id === testerRole.id);
}

module.exports = {
    startBot,
    isTester
}
