const {
    ChatInputCommandInteraction,
    PermissionFlagsBits,
    Client
} = require('discord.js')
const devs = ['975720541589757993', '787396792270454815']
const DB = require('../../models/lang')

module.exports = {
    name: 'interactionCreate',
    /**
     * @param {ChatInputCommandInteraction} interaction
     * @param {Client} client
     */
    async execute(interaction, client) {
        let language = client.i18n
        const data = await DB.findOne({
            idG: interaction.guild.id
        })
        if (data && data.lang) language = data.lang
        let lang = language

        if (!interaction.isChatInputCommand()) return;

        const cmd = client.commands.get(interaction.commandName)
        if (!cmd) return interaction.reply({
            content: `${client.config.emojis.wrong} ${client.i18n.get(lang, "command", "out")}`,
            ephemeral: true
        })

        if (cmd.dev && !devs.includes(interaction.user.id)) return interaction.reply({
            content: `${client.config.emojis.wrong} ${client.i18n.get(lang, "command", "dev_perms")}`,
            ephemeral: true
        })

        if (cmd.userperms && !interaction.member.permissions.has(cmd.userperms)) return interaction.reply({
            content: `${client.config.emojis.wrong} ${client.i18n.get(lang, "command", "user_perms")}`,
            ephemeral: true
        })
        if (cmd.botperms && !interaction.member.permissions.has(cmd.botperms)) return interaction.reply({
            content: `${client.config.emojis.wrong} ${client.i18n.get(lang, "command", "bot_perms")}`,
            ephemeral: true
        })

        cmd.execute(interaction, client, lang)
        console.log(interaction.commandId)
    }
}