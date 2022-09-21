const {
    EmbedBuilder,
    PermissionFlagsBits,
    Client,
    ChatInputCommandInteraction,
    ApplicationCommandOptionType
} = require('discord.js')
const { Player } = require('erela.js')
const formatDuration = require('../../functions/formatDuration')

module.exports = {
    name: 'play',
    description: 'Reproduce una canción.',
    descriptionLocalizations: {
        "pt-BR": "Reproduza uma música.",
        "en-US": "Play a song."
    },
    options: [{
        name: 'query',
        description: 'URL o nombre de la canción.',
        descriptionLocalizations: {
            "pt-BR": "URL ou nome da música.",
            "en-US": "URL or name of the song."
        },
        type: ApplicationCommandOptionType.String,
        required: true
    }],
    botperms: [
        PermissionFlagsBits.Speak,
        PermissionFlagsBits.Connect,
        PermissionFlagsBits.EmbedLinks,
        PermissionFlagsBits.SendMessages
    ],
    /**
     * @param {ChatInputCommandInteraction} interaction
     * @param {Client} client
     */
    async execute(interaction, client, lang) {
        await interaction.deferReply({ ephemeral: false })

        const query = interaction.options.getString('query')

        const channel = interaction.member.voice.channel
        if (!channel) return interaction.editReply({
            content: `${client.i18n.get(lang, "player", "no_voice")}`
        })

        const player = await client.manager.create({
            guild: interaction.guild.id,
            voiceChannel: interaction.member.voice.channel.id,
            textChannel: interaction.channel.id,
            selfDeafen: true
        })

        const state = player.state
        if (state != 'CONNECTED') await player.connect()
        const res = await client.manager.search(query, interaction.user)
        if (res.loadType != 'NO_MATCHES') {
            if (res.loadType == 'TRACK_LOADED' || res.loadType == 'SEARCH_RESULT') {
                player.queue.add(res.tracks[0])
                if (!player.playing) player.play()

                interaction.editReply({
                    embeds: [
                        new EmbedBuilder()
                        .setDescription(`${client.i18n.get(lang, "music", "song_added", {
                            title: res.tracks[0].title,
                            duration: formatDuration(res.tracks[0].duration)
                        })}`)
                        .setColor(client.config.color)
                    ]
                })
            } else if (res.loadType == 'PLAYLIST_LOADED') {
                player.queue.add(res.tracks)
                if (!player.playing) player.play()

                interaction.editReply({
                    embeds: [
                        new EmbedBuilder()
                        .setDescription(`${client.i18n.get(lang, "music", "playlist_added", {
                            songs: res.tracks.length,
                            playlist: res.playlist.name
                        })}`)
                        .setColor(client.config.color)
                    ]
                })
            } else if (res.loadType == 'LOAD_FAILED') {
                interaction.editReply({
                    content: `${client.i18n.get(lang, "music", "load_fail")}`
                })
                player.destroy()
            }
        } else {
            interaction.editReply({
                content: `${client.i18n.get(lang, "music", "no_match")}`
            })
        }
    }
}