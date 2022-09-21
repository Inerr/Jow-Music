const {
    EmbedBuilder,
    ButtonInteraction,
    Client
} = require('discord.js')
const delay = require('delay')

module.exports = {
    id: 'pause',
    /**
     * @param {ButtonInteraction} interaction
     * @param {Client} client
     */
    async execute(interaction, client, lang) {
        const player = client.manager?.players.get(interaction.guild.id)
        if (!player) return interaction.reply({
            content: `${client.i18n.get(lang, "player", "no_player")}`
        }).then(async () => {
            await delay(3000)
            interaction.deleteReply()
        })
        const channel = interaction.member.voice.channel
        if (!channel || interaction.guild.members.me.voice.channelId !== interaction.member.voice.channelId) return interaction.reply({
            content: `${client.i18n.get(lang, "player", "no_voice")}`
        }).then(async () => {
            await delay(3000)
            interaction.deleteReply()
        })

        await player.pause(!player.paused)
        const uni = player.paused ? `${client.i18n.get(lang, "player", "switch_pause")}` : `${client.i18n.get(lang, "player", "switch_resume")}`

        interaction.reply({
            embeds: [
                new EmbedBuilder()
                .setDescription(`${client.i18n.get(lang, "player", "paused", {
                        switch: uni
                    })}`)
                .setColor(client.config.color)
                .setFooter({
                    text: `${client.i18n.get(lang, "music", "action_by", {
                            user: `${interaction.user.tag}`
                        })}`,
                    iconURL: interaction.user.displayAvatarURL()
                })
            ]
        })

        await delay(5000)
        interaction.deleteReply()
    }
}