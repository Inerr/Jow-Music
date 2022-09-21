const {
    EmbedBuilder,
    ChatInputCommandInteraction,
    Client,
    PermissionFlagsBits,
    ApplicationCommandOptionType
} = require('discord.js')
const DB = require('../../models/setup')
const formatDuration = require('../../functions/formatDuration')

module.exports = {
    name: 'current',
    description: '-',
    options: [{
        name: 'view',
        description: 'Mira la canción que esta sonando.',
        descriptionLocalizations: {
            "pt-BR": "Olhe para a música que está tocando.",
            "en-US": "Look at the song that is playing."
        },
        type: ApplicationCommandOptionType.Subcommand
    }, {
        name: 'loop',
        description: 'Activa/Desactiva el bucle de la canción.',
        descriptionLocalizations: {
            "pt-BR": "Ativa/desativa o loop de música.",
            "en-US": "Turns the song loop on/off."
        },
        type: ApplicationCommandOptionType.Subcommand
    }, {
        name: 'replay',
        description: 'Vuelve a reproducir la canción que esta sonando.',
        descriptionLocalizations: {
            "pt-BR": "Repetir a música que está tocando.",
            "en-US": "Replay the song that is playing."
        },
        type: ApplicationCommandOptionType.Subcommand
    }, {
        name: 'skip',
        description: 'Omite la canción actual.',
        descriptionLocalizations: {
            "pt-BR": "Pule a música atual.",
            "en-US": "Skip the current song."
        },
        type: ApplicationCommandOptionType.Subcommand
    }, {
        name: 'stop',
        description: 'Deten la música.',
        descriptionLocalizations: {
            "pt-BR": "Pare a música.",
            "en-US": "Stop the music."
        },
        type: ApplicationCommandOptionType.Subcommand
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
        await interaction.deferReply({
            ephemeral: false
        })

        const player = client.manager.get(interaction.guild.id)
        if (!player) return interaction.editReply({
            content: `${client.i18n.get(lang, "player", "no_player")}`
        })

        const channel = interaction.member.voice.channel
        if (!channel || interaction.member.voice.channel !== interaction.guild.members.me.voice.channel) return interaction.editReply({
            content: `${client.i18n.get(lang, "player", "no_voice")}`
        })

        switch (interaction.options.getSubcommand()) {
            case "view":
                const data = await DB.findOne({
                    idG: interaction.guild.id
                })
                if (data && data.status === true) return interaction.editReply({
                    content: `${client.i18n.get(lang, "music", "now_playing", {
                        channel: `<#${data.channel}>`
                    })}`
                })

                interaction.editReply({
                    embeds: [
                        new EmbedBuilder()
                        .setDescription(`${client.i18n.get(lang, "music", "playing", {
                            title: player.queue.current.title,
                            duration: formatDuration(player.queue.current.duration)
                        })}`)
                        .setColor(client.config.color)
                    ]
                })
                break;
            case "loop":
                await player.setTrackRepeat(!player.trackRepeat)
                const uni = player.trackRepeat ? `${client.i18n.get(lang, "player", "switch_enable")}` : `${client.i18n.get(lang, "player", "switch_disable")}`

                interaction.editReply({
                    embeds: [
                        new EmbedBuilder()
                        .setDescription(`${client.i18n.get(lang, "player", "loop", {
                            switch: uni
                        })}`)
                        .setColor(client.config.color)
                    ]
                })
                break;
            case "replay":
                await player.seek(0)

                interaction.editReply({
                    embeds: [
                        new EmbedBuilder()
                        .setDescription(`${client.i18n.get(lang, "music", "replay", {
                            title: player.queue.current.title
                        })}`)
                        .setColor(client.config.color)
                    ]
                })
                break;
            case "skip":
                if (player.queue.size == 0) {
                    await client.updateMusic(player)
                    await player.destroy()

                    interaction.editReply({
                        embeds: [
                            new EmbedBuilder()
                            .setDescription(`${client.i18n.get(lang, "music", "skipped")}`)
                            .setColor(client.config.color)
                        ]
                    })
                } else {
                    await player.stop()

                    interaction.editReply({
                        embeds: [
                            new EmbedBuilder()
                            .setDescription(`${client.i18n.get(lang, "music", "skipped")}`)
                            .setColor(client.config.color)
                        ]
                    })
                }
                break;
            case "stop":
                await client.updateMusic(player)
                await player.destroy()

                interaction.editReply({
                    embeds: [
                        new EmbedBuilder()
                        .setDescription(`${client.i18n.get(lang, "music", "stopped")}`)
                        .setColor(client.config.color)
                    ]
                })
                break;
        }
    }
}