const {
    ChatInputCommandInteraction,
    Client,
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    SelectMenuBuilder,
    PermissionFlagsBits
} = require('discord.js')

module.exports = {
    name: 'help',
    description: 'Mira todos los comandos.',
    descriptionLocalizations: {
        "pt-BR": "Veja todos os comandos.",
        "en-US": "See all the commands."
    },
    botperms: [
        PermissionFlagsBits.SendMessages,
        PermissionFlagsBits.EmbedLinks
    ],
    /**
     * @param {ChatInputCommandInteraction} interaction
     * @param {Client} client
     */
    async execute(interaction, client, lang) {
        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                .setStyle(ButtonStyle.Link)
                .setURL('https://discord.gg/ZWWhd55T9m')
                .setLabel('Tunik Studios'),

                new ButtonBuilder()
                .setStyle(ButtonStyle.Link)
                .setURL('https://discord.com/api/oauth2/authorize?client_id=1008877181939757056&permissions=277062470976&scope=bot%20applications.commands')
                .setLabel('Invite')
            )
        
            const menuRow = new ActionRowBuilder()
            .addComponents(
                new SelectMenuBuilder()
                .setCustomId('help-menu')
                .setPlaceholder('Has una selección')
                .addOptions({
                    label: 'Setup',
                    description: client.i18n.get(lang, "help", "setup_menu_desc"),
                    emoji: '⚙',
                    value: 'setup'
                }, {
                    label: 'Music',
                    description: client.i18n.get(lang, "help", "music_menu_desc"),
                    emoji: '🎵',
                    value: 'music'
                }, {
                    label: 'Playlist',
                    description: client.i18n.get(lang, "help", "playlist_menu_desc"),
                    emoji: '💾',
                    value: 'playlist'
                })
            )

        const embed = new EmbedBuilder()
        .setAuthor({
            name: 'Jow',
            iconURL: client.user.displayAvatarURL()
        })
        .setDescription(`${client.i18n.get(lang, "help", "make_selection")}`)
        .setColor(client.config.color)

        interaction.reply({
            embeds: [embed],
            components: [menuRow, row]
        })
    }
}