const {
    EmbedBuilder,
    ChatInputCommandInteraction,
    Client,
    PermissionFlagsBits,
    ApplicationCommandOptionType
} = require('discord.js')
const DB = require('../../models/setup')
const formatDuration = require('../../functions/formatDuration')
const { queuePage } = require('../../functions/pagination')

module.exports = {
    name: 'queue',
    description: '-',
    options: [{
        name: 'view',
        description: 'Mira la lista de espera del servidor.',
        descriptionLocalizations: {
            "pt-BR": "Veja a lista de espera do servidor.",
            "en-US": "Look at the server's waiting list."
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
        name: 'clear',
        description: 'Limpia la lista de espera.',
        descriptionLocalizations: {
            "pt-BR": "Limpe a lista de espera.",
            "en-US": "Clear the waiting list."
        },
        type: ApplicationCommandOptionType.Subcommand
    }, {
        name: 'skipto',
        description: 'Salta a una canción especifica de la lista de espera.',
        descriptionLocalizations: {
            "pt-BR": "Saltar para uma música específica na lista de espera.",
            "en-US": "Jump to a specific song on the queue list."
        },
        type: ApplicationCommandOptionType.Subcommand,
        options: [{
            name: 'position',
            description: 'Posición en la lista de espera.',
            descriptionLocalizations: {
                "pt-BR": "Posição na lista de espera.",
                "en-US": "Position on the waiting list."
            },
            type: ApplicationCommandOptionType.Integer,
            minValue: 1,
            required: true
        }]
    }, {
        name: 'loop',
        description: 'Activa/Desactiva el bucle de la lista de espera.',
        descriptionLocalizations: {
            "pt-BR": "Ativa/Desativa o loop de fila.",
            "en-US": "Turns the queue loop on/off."
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

        if (!player.queue.length) return interaction.editReply({
            content: `${client.i18n.get(lang, "music", "no_queue_length")}`
        })

        switch (interaction.options.getSubcommand()) {
            case "view":
                const page = interaction.options.getInteger('page')

                let pagesNum = Math.ceil(player.queue.length / 10)
                if (pagesNum === 0) pagesNum = 1

                const songStrings = [];
                for (let i = 0;i < player.queue.length; i++) {
                    const song = player.queue[i]
                    songStrings.push(`***${i + 1}. ${song.title} [${formatDuration(song.duration)}] • ${song.requester}***`)
                }

                const pages = [];
                for (let i = 0; i < pagesNum; i++) {
                    const str = songStrings.slice(i * 10, i * 10 + 10).join('\n')

                    const embed = new EmbedBuilder()
                    .setAuthor({
                        name: 'Jow',
                        iconURL: client.user.displayAvatarURL()
                    })
                    .setDescription(`${client.i18n.get(lang, "music", "queue_desc", {
                        title: player.queue.current.title,
                        duration: formatDuration(player.queue.current.duration),
                        requester: player.queue.current.requester,
                        rest: str == '' ? ' Nothing' : '\n' + str
                    })}`)
                    .setFooter({
                        text: `${client.i18n.get(lang, "music", "queue_footer", {
                            page: i + 1,
                            pages: pagesNum,
                            queue_length: player.queue.length,
                            duration: formatDuration(player.queue.duration)
                        })}`
                    })
                    .setColor(client.config.color)

                    pages.push(embed)
                }

                if (!page) {
                    if (pages.length == pagesNum && player.queue.length > 10) queuePage(client, interaction, pages, 120000, player.queue.length, formatDuration(player.queue.duration), lang)
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
            case "clear":
                await player.queue.clear()

                interaction.editReply({
                    embeds: [
                        new EmbedBuilder()
                        .setDescription(`${client.i18n.get(lang, "music", "queue_clear")}`)
                        .setColor(client.config.color)
                    ]
                })
            break;
            case "skipto":
                const position = interaction.options.getInteger('position')

                if((position > player.queue.length) || (position && !player.queue[position - 1])) return interaction.editReply({
                    content: `${client.i18n.get(lang, "music", "no_skipto")}`
                })
                if (position == 1) player.stop()

                await player.queue.splice(0, position - 1)
                await player.stop()

                interaction.editReply({
                    embeds: [
                        new EmbedBuilder()
                        .setDescription(`${client.i18n.get(lang, "music", "skipto", {
                            position: position
                        })}`)
                        .setColor(client.config.color)
                    ]
                })
            break;
            case "loop":
                await player.setQueueRepeat(!player.queueRepeat)
                const uni = player.queueRepeat ? `${client.i18n.get(lang, "player", "switch_enable")}` : `${client.i18n.get(lang, "player", "switch_disable")}`

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
        }
    }
}