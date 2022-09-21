const {
    ButtonInteraction,
    Client,
    PermissionFlagsBits
} = require('discord.js')
const DB = require('../../models/lang')

module.exports = {
    name: 'interactionCreate',
    /**
     * 
     * @param {ButtonInteraction} interaction 
     * @param {Client} client 
     */
    async execute(interaction, client) {
        let language = client.i18n
        const data = await DB.findOne({
            idG: interaction.guild.id
        })
        if (data && data.lang) language = data.lang
        let lang = language

        if (!interaction.isButton()) return;
        const btn = client.buttons.get(interaction.customId)

        if (!btn) return;

        btn.execute(interaction, client, lang)
    }
}