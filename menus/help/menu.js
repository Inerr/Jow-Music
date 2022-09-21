const {
    EmbedBuilder,
    Client,
    SelectMenuInteraction
} = require('discord.js')

module.exports = {
    id: 'help-menu',
    /**
     * @param {SelectMenuInteraction} interaction
     * @param {Client} client
     */
    execute(interaction, client, lang) {
        if (interaction.values.includes('setup')) {
            interaction.reply({
                embeds: [
                    new EmbedBuilder()
                    .setAuthor({
                        name: 'Setup',
                        iconURL: client.user.displayAvatarURL()
                    })
                    .setDescription(`${client.i18n.get(lang, "help", "setup_desc")}`)
                    .setColor(client.config.color)
                ],
                ephemeral: true
            })
        } else if (interaction.values.includes('music')) {
            interaction.reply({
                embeds: [
                    new EmbedBuilder()
                    .setAuthor({
                        name: 'Music',
                        iconURL: client.user.displayAvatarURL()
                    })
                    .setDescription(`${client.i18n.get(lang, "help", "music_desc")}`)
                    .setColor(client.config.color)
                ],
                ephemeral: true
            })
        } else if (interaction.values.includes('playlist')) {
            interaction.reply({
                embeds: [
                    new EmbedBuilder()
                    .setAuthor({
                        name: 'Music',
                        iconURL: client.user.displayAvatarURL()
                    })
                    .setDescription(`${client.i18n.get(lang, "help", "playlist_desc")}`)
                    .setColor(client.config.color)
                ],
                ephemeral: true
            })
        }
    }
}