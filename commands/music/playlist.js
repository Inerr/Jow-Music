const {
    EmbedBuilder,
    ChatInputCommandInteraction,
    ApplicationCommandOptionType,
    PermissionFlagsBits,
    Client
} = require('discord.js')
const {
    convertTime
} = require('../../functions/convertTime')
const formatDuration = require('../../functions/formatDuration')
const {
    queuePage,
    playlistPage
} = require('../../functions/pagination')
const DB = require('../../models/playlist')
const humanize = require('humanize-duration')

const trackAdd = [];

module.exports = {
    name: 'playlist',
    description: '-',
    options: [{
        name: 'create',
        description: 'Crea una nueva lista de reproducción.',
        descriptionLocalizations: {
            "pt-BR": "Crie uma nova lista de reprodução.",
            "en-US": "Create a new playlist."
        },
        type: ApplicationCommandOptionType.Subcommand,
        options: [{
            name: 'name',
            description: 'Nombre de la lista de reproducción.',
            descriptionLocalizations: {
                "pt-BR": "Nome da lista de reprodução.",
                "en-US": "Playlist name."
            },
            type: ApplicationCommandOptionType.String,
            maxLength: 16,
            minLength: 5,
            required: true
        }]
    }, {
        name: 'delete',
        description: 'Elimina una lista de reproducción.',
        descriptionLocalizations: {
            "pt-BR": "Excluir uma lista de reprodução.",
            "en-US": "Delete a playlist."
        },
        type: ApplicationCommandOptionType.Subcommand,
        options: [{
            name: 'name',
            description: 'Nombre de la lista de reproducción.',
            descriptionLocalizations: {
                "pt-BR": "Nome da lista de reprodução.",
                "en-US": "Playlist name."
            },
            type: ApplicationCommandOptionType.String,
            required: true
        }]
    }, {
        name: 'add',
        description: 'Agrega una canción a la lista de reproducción.',
        descriptionLocalizations: {
            "pt-BR": "Adicione uma música à lista de reprodução.",
            "en-US": "Add a song to the playlist."
        },
        type: ApplicationCommandOptionType.Subcommand,
        options: [{
            name: 'name',
            description: 'Nombre de la lista de reproducción.',
            descriptionLocalizations: {
                "pt-BR": "Nome da lista de reprodução.",
                "en-US": "Playlist name."
            },
            type: ApplicationCommandOptionType.String,
            required: true
        }, {
            name: 'query',
            description: 'URL o nombre de la canción.',
            descriptionLocalizations: {
                "pt-BR": "URL ou nome da música.",
                "en-US": "URL or name of the song."
            },
            type: ApplicationCommandOptionType.String,
            required: true
        }]
    }, {
        name: 'remove',
        description: 'Elimina una canción de la lista de reproducción.',
        descriptionLocalizations: {
            "pt-BR": "Remova uma música da lista de reprodução.",
            "en-US": "Remove a song from the playlist."
        },
        type: ApplicationCommandOptionType.Subcommand,
        options: [{
            name: 'name',
            description: 'Nombre de la lista de reproducción.',
            descriptionLocalizations: {
                "pt-BR": "Nome da lista de reprodução.",
                "en-US": "Playlist name."
            },
            type: ApplicationCommandOptionType.String,
            required: true
        }, {
            name: 'position',
            description: 'Posición de la canción en la lista de reproducción.',
            descriptionLocalizations: {
                "pt-BR": "Posição da música na lista de reprodução.",
                "en-US": "Position of the song in the playlist."
            },
            type: ApplicationCommandOptionType.Integer,
            required: true
        }]
    }, {
        name: 'details',
        description: 'Mira detalles de la lista de reproducción.',
        descriptionLocalizations: {
            "pt-BR": "Veja os detalhes da lista de reprodução.",
            "en-US": "View playlist details."
        },
        type: ApplicationCommandOptionType.Subcommand,
        options: [{
            name: 'name',
            description: 'Nombre de la lista de reproducción.',
            descriptionLocalizations: {
                "pt-BR": "Nome da lista de reprodução.",
                "en-US": "Playlist name."
            },
            type: ApplicationCommandOptionType.String,
            required: true
        }, {
            name: 'page',
            description: 'Página que quieres ver.',
            descriptionLocalizations: {
                "pt-BR": "Página que você deseja ver.",
                "en-US": "Page you want to see."
            },
            type: ApplicationCommandOptionType.Integer
        }]
    }, {
        name: 'list',
        description: 'Enlista todas tus listas de reproducción.',
        descriptionLocalizations: {
            "pt-BR": "Liste todas as suas listas de reprodução.",
            "en-US": "List all your playlists."
        },
        type: ApplicationCommandOptionType.Subcommand,
        options: [{
            name: 'page',
            description: 'Página que quieres ver.',
            descriptionLocalizations: {
                "pt-BR": "Página que você deseja ver.",
                "en-US": "Page you want to see."
            },
            type: ApplicationCommandOptionType.Integer
        }]
    }, {
        name: 'privacy',
        description: 'Configura la privacidad de tu lista de reproducción.',
        descriptionLocalizations: {
            "pt-BR": "Defina a privacidade da sua lista de reprodução.",
            "en-US": "Set the privacy of your playlist."
        },
        type: ApplicationCommandOptionType.Subcommand,
        options: [{
            name: 'name',
            description: 'Nombre de la lista de reproducción.',
            descriptionLocalizations: {
                "pt-BR": "Nome da lista de reprodução.",
                "en-US": "Playlist name."
            },
            type: ApplicationCommandOptionType.String,
            required: true
        }, {
            name: 'choice',
            description: 'Pública/Privada.',
            descriptionLocalizations: {
                "pt-BR": "Public/Private.",
                "en-US": "Public/Private."
            },
            type: ApplicationCommandOptionType.String,
            required: true,
            choices: [{
                name: '🔹 | Pública',
                nameLocalizations: {
                    "pt-BR": "🔹 | Public",
                    "en-US": "🔹 | Public"
                },
                value: 'pub'
            }, {
                name: '🔹 | Privada',
                nameLocalizations: {
                    "pt-BR": "🔹 | Private",
                    "en-US": "🔹 | Private"
                },
                value: 'priv'
            }]
        }]
    }, {
        name: 'play',
        description: 'Reproduce una lista de reproducción.',
        descriptionLocalizations: {
            "pt-BR": "Reproduza uma lista de reprodução.",
            "en-US": "Play a playlist."
        },
        type: ApplicationCommandOptionType.Subcommand,
        options: [{
            name: 'name',
            description: 'Nombre de la lista de reproducción.',
            descriptionLocalizations: {
                "pt-BR": "Nome da lista de reprodução.",
                "en-US": "Playlist name."
            },
            type: ApplicationCommandOptionType.String,
            required: true
        }]
    }, {
        name: 'view-all',
        description: 'Mira todas las listas de reproducción públicas.',
        descriptionLocalizations: {
            "pt-BR": "Mira todas as listas de reprodução pública.",
            "en-US": "See all public playlists."
        },
        type: ApplicationCommandOptionType.Subcommand,
        options: [{
            name: 'page',
            description: 'Página que quieres ver.',
            descriptionLocalizations: {
                "pt-BR": "Página que você deseja ver.",
                "en-US": "Page you want to see."
            },
            type: ApplicationCommandOptionType.Integer
        }]
    }, {
        name: 'save',
        description: 'Guarda una lista de reproducción.',
        type: ApplicationCommandOptionType.Subcommand
    }],
    botperms: [
        PermissionFlagsBits.SendMessages,
        PermissionFlagsBits.EmbedLinks,
        PermissionFlagsBits.Connect,
        PermissionFlagsBits.Speak
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

        switch (interaction.options.getSubcommand()) {
            case "create": {
                const name = interaction.options.getString('name')
                const playName = name.replace(/_/g, '')

                const data = await DB.findOne({
                    name: playName
                })

                const limit = await DB.find({
                    owner: interaction.user.id
                }).countDocuments()

                if (data) return interaction.editReply({
                    content: `${client.i18n.get(lang, "playlist", "playlist_exsits")}`
                })
                if (limit >= 10) {
                    interaction.editReply({
                        content: `${client.i18n.get(lang, "playlist", "playlist_limit")}`
                    })
                    return;
                }

                const newData = new DB({
                    name: playName,
                    owner: interaction.user.id,
                    tracks: [],
                    private: true,
                    created: Date.now()
                }).save().then(() => {
                    interaction.editReply({
                        embeds: [
                            new EmbedBuilder()
                            .setDescription(`${client.i18n.get(lang, "playlist", "created", {
                                name: playName
                            })}`)
                            .setColor(client.config.color)
                        ]
                    })
                })
                break;
            }
            case "delete": {
                const name = interaction.options.getString('name')
                const playName = name.replace(/_/g, '')

                const data = await DB.findOne({
                    name: playName
                })

                if (!data) return interaction.editReply({
                    content: `${client.i18n.get(lang, "playlist", "no_playlist")}`
                })
                if (data.owner !== interaction.user.id) return interaction.editReply({
                    content: `${client.i18n.get(lang, "playlist", "no_owner")}`
                })

                await data.delete()

                interaction.editReply({
                    embeds: [
                        new EmbedBuilder()
                        .setDescription(`${client.i18n.get(lang, "playlist", "deleted", {
                            name: playName
                        })}`)
                        .setColor(client.config.color)
                    ]
                })
            }
            break;
        case "add": {
            const name = interaction.options.getString('name')
            const playName = name.replace(/_/g, '')

            const data = await DB.findOne({
                name: playName
            })

            const query = interaction.options.getString('query')

            const res = await client.manager.search(query, interaction.user.id)
            if (res.loadType != 'NO_MATCHES') {
                if (res.loadType == 'TRACK_LOADED' || res.loadType == 'SEARCH_RESULT') {
                    trackAdd.push(res.tracks[0])
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
                    for (let t = 0; t < res.tracks.length; t++) {
                        trackAdd.push(res.tracks[t])
                    }

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
                }
            } else {
                interaction.editReply({
                    content: `${client.i18n.get(lang, "music", "no_match")}`
                })
            }

            DB.findOne({
                name: playName
            }).then(playlist => {
                if (!playlist) return interaction.editReply('No playlist found')
                if (playlist.owner !== interaction.user.id) {
                    interaction.editReply({
                        content: `${client.i18n.get(lang, "playlist", "no_owner")}`
                    })
                    trackAdd.length = 0
                    return;
                }
                const limitTracks = playlist.tracks.length + trackAdd.length
                if (limitTracks > 200) {
                    interaction.editReply({
                        content: `${client.i18n.get(lang, "playlist", "limit_tracks")}`
                    })
                    trackAdd.length = 0
                    return;
                }
                for (let songs = 0; songs < trackAdd.length; songs++) {
                    playlist.tracks.push(trackAdd[songs])
                }
                playlist.save()

                interaction.editReply({
                    embeds: [
                        new EmbedBuilder()
                        .setDescription(`${client.i18n.get(lang, "playlist", "songs_added", {
                                songs: trackAdd.length,
                                playlist: playName
                            })}`)
                        .setColor(client.config.color)
                    ]
                })
                trackAdd.length = 0
            })
        }
        break;
        case "play": {
            const name = interaction.options.getString('name')
            const playName = name.replace(/_/g, '')

            const data = await DB.findOne({
                name: playName
            })

            const channel = interaction.member.voice.channel
            if (!channel) return interaction.editReply({
                content: `${client.i18n.get(lang, "player", "no_voice")}`
            })

            let player = client.manager.get(interaction.guild.id)
            if (!player) {
                player = await client.manager.create({
                    guild: interaction.guild.id,
                    voiceChannel: interaction.member.voice.channel.id,
                    textChannel: interaction.channel.id,
                    selfDeafen: true
                })

                const state = player.state
                if (state != 'CONNECTED') await player.connect()
            }

            const songAdd = [];
            let songLoad = 0

            if (!data) {
                interaction.editReply({
                    content: `${client.i18n.get(lang, "playlist", "no_playlist")}`
                })
                player.destroy()
                return;
            }
            if (data.private && data.owner !== interaction.user.id) {
                interaction.editReply({
                    content: `${client.i18n.get(lang, "playlist", "private_playlist")}`
                })
                player.destroy()
                return;
            }

            interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                    .setDescription(`${client.i18n.get(lang, "playlist", "loaded", {
                            songs: data.tracks.length,
                            playlist: playName
                        })}`)
                    .setColor(client.config.color)
                ]
            })

            for (let i = 0; i < data.tracks.length; i++) {
                const res = await client.manager.search(data.tracks[i].uri, interaction.user)
                if (res.loadType != 'NO_MATCHES') {
                    if (res.loadType == 'TRACK_LOADED' || res.loadType == 'SEARCH_RESULT') {
                        songAdd.push(res.tracks[0])
                        songLoad++
                    } else if (res.loadType == 'PLAYLIST_LOADED') {
                        for (let t = 0; t < res.playlist.tracks.length; t++) {
                            songAdd.push(res.playlist.tracks[t])
                            songLoad++
                        }
                    } else if (res.loadType == 'LOAD_FAILED') {
                        {
                            interaction.editReply({
                                content: `${client.i18n.get(lang, "playlist", "load_fail")}`
                            })
                            player.destroy()
                            return;
                        }
                    }
                } else {
                    {
                        interaction.editReply({
                            content: `${client.i18n.get(lang, "playlist", "load_match")}`
                        })
                        player.destroy()
                        return;
                    }
                }

                if (songLoad == data.tracks.length) {
                    player.queue.add(songAdd)
                    if (!player.playing) player.play()
                }
            }
            break;
        }
        case "remove": {
            const name = interaction.options.getString('name')
            const playName = name.replace(/_/g, '')

            const data = await DB.findOne({
                name: playName
            })

            const position = interaction.options.getInteger('position')

            if (!data) return interaction.editReply({
                content: `${client.i18n.get(lang, "playlist", "no_playlist")}`
            })
            if (data.owner !== interaction.user.id) return interaction.editReply({
                content: `${client.i18n.get(lang, "playlist", "no_owner")}`
            })
            const song = data.tracks[position]
            if (!song) return interaction.editReply({
                content: `${client.i18n.get(lang, "playlist", "invalid_position")}`
            })

            data.tracks.splice(position - 1, 1)
            await data.save()

            interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                    .setDescription(`${client.i18n.get(lang, "playlist", "removes", {
                            position: position,
                            playlist: playName
                        })}`)
                    .setColor(client.config.color)
                ]
            })
            break;
        }
        case "details": {
            const name = interaction.options.getString('name')
            const playName = name.replace(/_/g, '')

            const data = await DB.findOne({
                name: playName
            })

            const page = interaction.options.getInteger('page')

            if (!data) return interaction.editReply({
                content: `${client.i18n.get(lang, "playlist", "no_playlist")}`
            })
            if (data.private && data.owner !== interaction.user.id) return interaction.editReply({
                content: `${client.i18n.get(lang, "playlist", "view_private")}`
            })

            let pagesNum = Math.ceil(data.tracks.length / 10)
            if (pagesNum === 0) pagesNum = 1

            const playStrings = [];
            for (let i = 0; i < data.tracks.length; i++) {
                const playLists = data.tracks[i]
                playStrings.push(`${client.i18n.get(lang, "playlist", "view_lists", {
                        index: i + 1,
                        title: playLists.title,
                        duration: formatDuration(playLists.duration)
                    })}`)
            }

            const duration = formatDuration(data.tracks.reduce((acc, cur) => acc + cur.duration, 0))
            const pages = []
            for (let i = 0; i < pagesNum; i++) {
                const str = playStrings.slice(i * 10, i * 10 + 10).join('\n')
                const embed = new EmbedBuilder()
                    .setAuthor({
                        name: `${data.name}`,
                        iconURL: interaction.user.displayAvatarURL()
                    })
                    .setDescription(`${str == '' ? ' Nothing' : '\n' + str}`)
                    .setColor(client.config.color)
                    .setFooter({
                        text: `${client.i18n.get(lang, "music", "queue_footer", {
                            page: i + 1,
                            pages: pagesNum,
                            songs: data.tracks.length,
                            duration: duration
                        })}`
                    })

                pages.push(embed)
            }
            if (!page) {
                if (pages.length == pagesNum && data.tracks.length > 10) queuePage(client, interaction, pages, 120000, data.tracks.length, duration, lang)
                else return interaction.editReply({
                    embeds: [pages[0]]
                })
            } else {
                if (page > pagesNum) return interaction.editReply({
                    content: `${client.i18n.get(lang, "music", "queue_nofound", {
                            pages: pagesNum
                        })}`
                })
                const pageNum = page == 0 ? 1 : page - 1
                return interaction.editReply({
                    embeds: [pages[pageNum]]
                })
            }
            break;
        }
        case "list":
            const data2 = await DB.find({
                owner: interaction.user.id
            })

            const number = interaction.options.getInteger('page')

            let pagessNum = Math.ceil(data2.length / 10)
            if (pagessNum === 0) pagessNum = 1

            const playlistStrings = [];
            for (let i = 0; i < data2.length; i++) {
                const playlist = data2[i]
                const created = humanize(Date.now() - data2[i].created, {
                    largest: 1
                })
                playlistStrings.push(`${client.i18n.get(lang, "playlist", "view_embed_pl", {
                        index: i + 1,
                        name: playlist.name,
                        tracks: playlist.tracks.length,
                        date: created,
                        privacy: data2[i].private ? 'Private' : 'Public'
                    })}`)
            }

            const pagess = [];
            for (let i = 0; i < pagessNum; i++) {
                const str = playlistStrings.slice(i * 10, i * 10 + 10).join('\n')
                const embed = new EmbedBuilder()
                    .setAuthor({
                        name: `${client.i18n.get(lang, "playlist", "view_embed_author", {
                            user: interaction.user.tag
                        })}`,
                        iconURL: interaction.user.displayAvatarURL()
                    })
                    .setDescription(`${str == '' ? ' Nothing' : '\n' + str}`)
                    .setColor(client.config.color)
                    .setFooter({
                        text: `${client.i18n.get(lang, "playlist", "view_embed_footer", {
                            page: i + 1,
                            pages: pagessNum,
                            songs: data2.length
                        })}`
                    })

                pagess.push(embed)
            }
            if (!number) {
                if (pagess.length == pagessNum && data2.length > 10) playlistPage(client, interaction, pages, 30000, data2.length, lang)
                else return interaction.editReply({
                    embeds: [pagess[0]]
                })
            } else {
                if (number > pagessNum) return interaction.editReply({
                    content: `${client.i18n.get(lang, "music", "queue_nofound", {
                            pages: pagessNum
                        })}`
                })
                const pageNum = number == 0 ? 1 : number - 1
                return interaction.editReply({
                    embeds: [pagess[pageNum]]
                })
            }
            break;
        case "privacy": {
            const name = interaction.options.getString('name')
            const playName = name.replace(/_/g, '')

            const data = await DB.findOne({
                name: playName
            })
            if (!data) return interaction.editReply({
                content: `${client.i18n.get(lang, "playlist", "no_playlist")}`
            })
            if (data.owner !== interaction.user.id) return interaction.editReply({
                content: `${client.i18n.get(lang, "playlist", "view_private")}`
            })

            switch (interaction.options.getString('choice')) {
                case "pub":
                    await DB.findOneAndUpdate({
                        name: playName
                    }, {
                        private: false
                    })

                    interaction.editReply({
                        embeds: [
                            new EmbedBuilder()
                            .setDescription(`${client.i18n.get(lang, "playlist", "public_playlist")}`)
                            .setColor(client.config.color)
                        ]
                    })
                    break;
                case "priv":
                    await DB.findOneAndUpdate({
                        name: playName
                    }, {
                        private: true
                    })

                    interaction.editReply({
                        embeds: [
                            new EmbedBuilder()
                            .setDescription(`${client.i18n.get(lang, "playlist", "privated_playlist")}`)
                            .setColor(client.config.color)
                        ]
                    })
                    break;
            }
        }
        break;
        case "view-all": {
            const number = interaction.options.getInteger('page')

            const playlists = await DB.find({
                private: false
            })

            let pagesNum = Math.ceil(playlists.length / 10)
            if (pagesNum === 0) pagesNum = 1

            const playsString = [];
            for (let i = 0; i < playlists.length; i++) {
                const playlist = playlists[i]
                const created = humanize(Date.now() - playlists[i].created, {
                    largest: 1
                })
                playsString.push(`${client.i18n.get(lang, "playlist", "view_embed_pl2", {
                            index: i + 1,
                            name: playlist.name,
                            tracks: playlist.tracks.length,
                            date: created
                        })}`)
            }

            const pages = [];
            for (let i = 0; i < pagesNum; i++) {
                const str = playsString.slice(i * 10, i * 10 + 10).join('\n')
                const embed = new EmbedBuilder()
                    .setAuthor({
                        name: `Playlists`,
                        iconURL: client.user.displayAvatarURL()
                    })
                    .setDescription(`${str == '' ? ' Nothing' : '\n' + str}`)
                    .setColor(client.config.color)
                    .setFooter({
                        text: `${client.i18n.get(lang, "playlist", "view_embed_footer", {
                            page: i + 1,
                            pages: pagesNum,
                            songs: playlists.length
                        })}`
                    })

                pages.push(embed)
            }
            if (!number) {
                if (pages.length == pagesNum && playlists.length > 10) playlistPage(client, interaction, pages, 30000, playlists.length, lang)
                else return interaction.editReply({
                    embeds: [pages[0]]
                })
            } else {
                if (number > pagesNum) return interaction.editReply({
                    content: `${client.i18n.get(lang, "music", "queue_nofound", {
                            pages: pagesNum
                        })}`
                })
                const pageNum = number == 0 ? 1 : number - 1
                return interaction.editReply({
                    embeds: [pages[pageNum]]
                })
            }

        }
        break;
        case "save": {

        }
        break;
        }
    }
}