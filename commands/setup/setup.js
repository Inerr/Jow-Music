const {
    ChatInputCommandInteraction,
    EmbedBuilder,
    Client,
    ApplicationCommandOptionType,
    PermissionFlagsBits
} = require('discord.js')
const DB = require('../../models/setup')

module.exports = {
    name: 'setup',
    description: '-',
    options: [{
        name: 'music',
        description: 'Configura el canal de solicitudes.',
        descriptionLocalizations: {
            "pt-BR": "Configure o canal de solicitação.",
            "en-US": "Configure the request channel."
        },
        type: ApplicationCommandOptionType.Subcommand,
        options: [{
            name: 'choice',
            description: 'Crea/Elimina el canal de solicitudes.',
            descriptionLocalizations: {
                "pt-BR": "Crie/exclua o canal de solicitação.",
                "en-US": "Create/Delete the request channel."
            },
            type: ApplicationCommandOptionType.String,
            required: true,
            choices: [{
                name: '🔹 | Crear',
                nameLocalizations: {
                    "pt-BR": "🔹 | Criar",
                    "en-US": "🔹 | Create"
                },
                value: 'create'
            }, {
                name: '🔹 | Eliminar',
                nameLocalizations: {
                    "pt-BR": "🔹 | Remover",
                    "en-US": "🔹 | Delete"
                },
                value: 'delete'
            }]
        }]
    }],
    userperms: [
        PermissionFlagsBits.ManageChannels
    ],
    botperms: [
        PermissionFlagsBits.ManageChannels,
        PermissionFlagsBits.EmbedLinks,
        PermissionFlagsBits.SendMessages
    ],
    /**
     * @param {ChatInputCommandInteraction} interaction
     * @param {Client} client
     */
    async execute(interaction, client, lang) {
        await interaction.deferReply({ ephemeral: false })

        switch (interaction.options.getSubcommand()) {
            case "music":
                switch (interaction.options.getString('choice')) {
                    case "create":
                        await interaction.guild.channels.create({
                            name: "jow-requests",
                            type: 0,
                            topic: `${client.i18n.get(lang, "setup", "setup_topic")}`,
                            parent_id: interaction.channel.parentId,
                            user_limit: 3,
                            rate_limit_per_user: 3
                        }).then(async (channel) => {
                            const queueMsg = `${client.i18n.get(lang, "setup", "setup_queue_msg")}`

                            const embed = new EmbedBuilder()
                            .setAuthor({
                                name: `${client.i18n.get(lang, "setup", "setup_play_author")}`,
                                iconURL: client.user.displayAvatarURL()
                            })
                            .setDescription(`${client.i18n.get(lang, "setup", "setup_play_desc")}`)
                            .setImage('https://i.gifer.com/cm8.gif')
                            .setColor(client.config.color)

                            await channel.send({
                                content: `${queueMsg}`,
                                embeds: [embed],
                                components: [client.diSwitch]
                            }).then(async (msg) => {
                                await DB.findOneAndUpdate({
                                    idG: interaction.guild.id
                                }, {
                                    status: true,
                                    channel: channel.id,
                                    playMsg: msg.id
                                }, {
                                    upsert: true,
                                    new: true
                                })
                            })

                            interaction.editReply({
                                embeds: [
                                    new EmbedBuilder()
                                    .setDescription(`${client.i18n.get(lang, "setup", "setup_msg", {
                                        channel: channel
                                    })}`)
                                    .setColor(client.config.color)
                                ]
                            })
                        })
                    break;
                    case "delete":
                        const data = await DB.findOne({
                            idG: interaction.guild.id
                        })
                        if (!data) return interaction.editReply({
                            content: `${client.i18n.get(lang, "setup", "no_data")}`
                        })

                        const channel = interaction.guild.channels.cache.get(data.channel)
                        
                        await channel.delete()
                        await DB.findOneAndDelete({
                            idG: interaction.guild.id
                        })

                        interaction.editReply({
                            embeds: [
                                new EmbedBuilder()
                                .setDescription(`${client.i18n.get(lang, "setup", "setup_delete")}`)
                                .setColor(client.config.color)
                            ]
                        })
                    break;
                }
            break;
        }
    }
}