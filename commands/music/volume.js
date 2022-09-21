const {
    EmbedBuilder,
    ChatInputCommandInteraction,
    Client,
    ApplicationCommandOptionType,
    PermissionFlagsBits
} = require('discord.js')

module.exports = {
    name: 'volume',
    description: 'Establece el volumen del reproductor.',
    descriptionLocalizations: {
        "pt-BR": "Define o volume do player.",
        "en-US": "Sets the volume of the player."
    },
    options: [{
        name: 'percentage',
        description: 'Porcentaje de volumen.',
        descriptionLocalizations: {
            "pt-BR": "Porcentagem de volume.",
            "en-US": "Volume percentage."
        },
        type: ApplicationCommandOptionType.Integer,
        maxValue: 150,
        minValue: 1,
        required: true
    }],
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
        const vol = interaction.options.getInteger('percentage')

        const player = client.manager.get(interaction.guild.id)
        if (!player) return interaction.editReply({
            content: `${client.i18n.get(lang, "player", "no_player")}`
        })

        const channel = interaction.member.voice.channel
        if (!channel || interaction.member.voice.channel !== interaction.guild.members.me.voice.channel) return interaction.editReply({
            content: `${client.i18n.get(lang, "player", "no_voice")}`
        })

        await player.setVolume(vol)

        interaction.editReply({
            embeds: [
                new EmbedBuilder()
                .setDescription(`${client.i18n.get(lang, "player", "volume", {
                    vol: vol
                })}`)
                .setColor(client.config.color)
            ]
        })
    }
}