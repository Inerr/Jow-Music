const { EmbedBuilder, WebhookClient, Guild } = require("discord.js");
const webhook = new WebhookClient({
    url: "https://discord.com/api/webhooks/1018956550045454347/B_MkrtJJc6KUObeC8t9awlOLvMziM42eXCwA8eyUi7--sgOdWJDlOTdI5rP0qC76Cfg8"
});

module.exports = {
    name: 'guildDelete',
    /**
     * 
     * @param {Guild} guild 
     * @param {*} client 
     */
    async execute(guild, client) {
        webhook.send({
            embeds: [
                new EmbedBuilder()
                .setTitle(`Servidor eliminado! ${guild.name}`)
                .addFields({
                    name: 'Usuarios:',
                    value: `${guild.memberCount}`
                }, {
                    name: 'Dueño:',
                    value: `<@${guild.ownerId}>`
                })
                .setColor(client.config.color)
            ]
        })
    }
}