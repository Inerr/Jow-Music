const {
    ChatInputCommandInteraction,
    ApplicationCommandOptionType,
    PermissionFlagsBits,
    Client,
    EmbedBuilder,
} = require('discord.js')
const {
    String
} = ApplicationCommandOptionType
const langModel = require('../../models/lang')

module.exports = {
    name: 'language',
    description: 'Configura el idioma del servidor.',
    descriptionLocalizations: {
        "en-US": "Set the server language.",
        "pt-BR": "Defina o idioma do servidor."
    },
    options: [{
        name: 'lang',
        description: 'El idioma para establecer.',
        descriptionLocalizations: {
            "en-US": "The language to set.",
            "pt-BR": "O idioma a ser definido."
        },
        type: String,
        required: true,
        choices: [{
            name: '🇪🇸 | Español',
            value: 'es'
        }, {
            name: '🇧🇷 | Português (BR)',
            value: 'br'
        }, {
            name: '🇺🇸 | English',
            value: 'en'
        }]
    }],
    userperms: [
        PermissionFlagsBits.ManageGuild
    ],
    botperms: [
        PermissionFlagsBits.SendMessages,
        PermissionFlagsBits.EmbedLinks
    ],
    /**
     * @param {ChatInputCommandInteraction} interaction
     * @param {Client} client
     */
    async execute(interaction, client, lang) {
        const data = await langModel.findOne({
            idG: interaction.guild.id
        })
        if (!data) await langModel.create({
            idG: interaction.guild.id
        })

        switch (interaction.options.getString('lang')) {
            case "es":
                await langModel.findOneAndUpdate({
                    idG: interaction.guild.id
                }, {
                    lang: 'es'
                })
        
                interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle(`${client.i18n.get('es', "lang", "title")}`)
                            .setDescription(`${client.i18n.get('es', "lang", "description", {
                                language: `🇪🇸 Español`
                            })}`)
                            .setColor('#2f3136')
                    ]
                })
            break;
            case "br":
                await langModel.findOneAndUpdate({
                    idG: interaction.guild.id
                }, {
                    lang: 'pt'
                })
        
                interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle(`${client.i18n.get('pt', "lang", "title")}`)
                            .setDescription(`${client.i18n.get('pt', "lang", "description", {
                                language: `🇧🇷 Português (BR)`
                            })}`)
                            .setColor('#2f3136')
                    ]
                })
            break;
            case "en":
                await langModel.findOneAndUpdate({
                    idG: interaction.guild.id
                }, {
                    lang: 'en'
                })
        
                interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle(`${client.i18n.get('en', "lang", "title")}`)
                            .setDescription(`${client.i18n.get('en', "lang", "description", {
                                language: `🇺🇸 English`
                            })}`)
                            .setColor('#2f3136')
                    ]
                })
            break;
        }

        // await langModel.findOneAndUpdate({
        //     idG: interaction.guild.id
        // }, {
        //     lang: language
        // })

        // interaction.reply({
        //     embeds: [
        //         new EmbedBuilder()
        //             .setTitle(`${client.i18n.get(lang, "lang", "title")}`)
        //             .setDescription(`${client.i18n.get(lang, "lang", "description", {
        //                 language: `${lang_msg}`
        //             })}`)
        //             .setColor('#2f3136')
        //     ]
        // })
    }
}