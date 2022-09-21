const {
    SelectMenuInteraction,
    Client,
    PermissionFlagsBits
} = require('discord.js')
const DB = require('../../models/lang')

module.exports = {
    name: 'interactionCreate',
    /**
     * 
     * @param {SelectMenuInteraction} interaction 
     * @param {Client} client 
     */
    async execute(interaction, client) {
        let language = client.i18n
        const data = await DB.findOne({
            idG: interaction.guild.id
        })
        if (data && data.lang) language = data.lang
        let lang = language

        if (!interaction.isSelectMenu()) return;
        const menu = client.menus.get(interaction.customId)

        if (!menu) return;

        menu.execute(interaction, client, lang)
    }
}