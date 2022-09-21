const {
    EmbedBuilder,
    Client,
    ChatInputCommandInteraction,
    PermissionFlagsBits,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
} = require('discord.js')

module.exports = {
    name: 'status',
    description: 'Mira el estado del bot y otra información adicional.',
    descriptionLocalizations: {
        "pt-BR": "Veja o status do bot e outras informações adicionais.",
        "en-US": "See the status of the bot and other additional information."
    },
    botperms: [
        PermissionFlagsBits.SendMessages,
        PermissionFlagsBits.EmbedLinks
    ],
    async execute(interaction, client, lang) {
        await interaction.deferReply()
        const row = new ActionRowBuilder()
        .setComponents(
            new ButtonBuilder()
            .setLabel(`Bot`)
            .setCustomId(`bot`)
            .setStyle(ButtonStyle.Secondary),

            new ButtonBuilder()
            .setLabel(`Music Nodes`)
            .setCustomId('nodes')
            .setStyle(ButtonStyle.Secondary)
        )

        const msg = await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                .setAuthor({
                    name: 'Jow',
                    iconURL: client.user.displayAvatarURL()
                })
                .setDescription(`${client.i18n.get(lang, "status", "main_embed", {
                    servers: client.guilds.cache.size,
                    users: client.users.cache.size.toLocaleString()
                })}`)
                .setColor(client.config.color)
            ],
            components: [row]
        })

        const filter = (i) => i.user.id === interaction.user.id

        const collector = interaction.channel.createMessageComponentCollector({
            time: 120000,
            filter
        })

        collector.on('collect', async (interaction) => {
            const id = interaction.customId
            if (id === 'bot') {
                await msg.edit({
                    embeds: [
                        new EmbedBuilder()
                        .setDescription(`${client.i18n.get(lang, "status", "bot_status_desc")}`)
                        .addFields({
                            name: 'Ping:',
                            value: `${client.ws.ping}`
                        }, {
                            name: 'Memory Usage:',
                            value: `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}mb`,
                            inline: true
                        }, {
                            name: 'Uptime:',
                            value: `<t:${parseInt(client.readyTimestamp / 1000)}:R>`,
                            inline: true
                        })
                        .setColor(client.config.color)
                    ],
                    ephemeral: true
                })
            } else if (id === 'nodes') {
                const node = client.manager.nodes.values().next().value.stats

                await msg.edit({
                    embeds: [
                        new EmbedBuilder()
                        .setDescription(`${client.i18n.get(lang, "status", "music_nodes_desc")}`)
                        .addFields({
                            name: `CPU Usage:`,
                            value: `${node.cpu.lavalinkLoad}%`,
                            inline: true
                        }, {
                            name: `Memory Usage:`,
                            value: `${node.memory}`,
                            inline: true
                        }, {
                            name: 'Uptime:',
                            value: `<t:${node.uptime}:R>`,
                            inline: true
                        }, {
                            name: 'Players:',
                            value: `${node.players}`
                        }, {
                            name: 'Playing Players:',
                            value: `${node.playingPlayers}`
                        })
                        .setColor(client.config.color)
                    ],
                    ephemeral: true
                })
            }
        })
        collector.on('end', () => {
            msg.edit({
                components: []
            })
        })
    }
}