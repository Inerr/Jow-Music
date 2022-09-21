const {
    EmbedBuilder,
    Client,
    ChatInputCommandInteraction,
    PermissionFlagsBits
} = require('discord.js')

module.exports = {
    name: 'pause',
    description: 'Pausa/Reanuda el reproductor.',
    descriptionLocalizations: {
        "pt-BR": "Pausar/retomar o player.",
        "en-US": "Pause/resume the player."
    },
    botperms: [
        PermissionFlagsBits.SendMessages,
        PermissionFlagsBits.EmbedLinks
    ],
    /**
     * 
     * @param {ChatInputCommandInteraction} interaction 
     * @param {Client} client 
     */
    async execute(interaction, client, lang) {
        await interaction.deferReply({ ephemeral: false })

        const player = client.manager.get(interaction.guild.id)
        if (!player) return interaction.editReply({
            content: `${client.i18n.get(lang, "player", "no_player")}`
        })

        const channel = interaction.member.voice.channel
        if (!channel || interaction.member.voice.channel !== interaction.guild.members.me.voice.channel) return interaction.editReply({
            content: `${client.i18n.get(lang, "player", "no_voice")}`
        })

        await player.pause(player.playing)
        const uni = player.paused ? `${client.i18n.get(lang, "player", "switch_pause")}` : `${client.i18n.get(lang, "player", "switch_resume")}`

        interaction.editReply({
            embeds: [
                new EmbedBuilder()
                .setDescription(`${client.i18n.get(lang, "player", "paused", {
                    switch: uni
                })}`)
                .setColor(client.config.color)
            ]
        })
    }
}