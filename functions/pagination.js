const {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
} = require('discord.js')

const queuePage = async (client, interaction, pages, timeout, queueLength, queueDuration, lang) => {
    if (!interaction && !interaction.channel) return console.log('Channel is inaccessible')
    if (!pages) return console.log('Pages are not given')

    const row = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
            .setCustomId('back')
            .setEmoji('⬅')
            .setStyle(ButtonStyle.Secondary),

            new ButtonBuilder()
            .setCustomId('next')
            .setEmoji('➡')
            .setStyle(ButtonStyle.Secondary)
        )

    let page = 0
    const curPage = await interaction.editReply({
        embeds: [
            pages[page].setFooter({
                text: `${client.i18n.get(lang, "music", "queue_footer", {
                    page: page + 1,
                    pages: pages.length,
                    queue_length: queueLength,
                    duration: queueDuration
                })}`
            })
        ],
        components: [row]
    })
    if (pages.length == 0) return;

    const filter = (m) => m.user.id === interaction.user.id
    const collector = await curPage.createMessageComponentCollector({
        filter,
        time: timeout
    })

    collector.on('collect', async (interaction) => {
        if (!interaction.deferred) await interaction.deferUpdate()
        if (interaction.customId === 'back') {
            page = page > 0 ? --page : pages.length - 1
        } else if (interaction.customId === 'next') {
            page = page + 1 < pages.length ? ++page : 0
        }

        curPage.edit({
            embeds: [
                pages[page].setFooter({
                    text: `${client.i18n.get(lang, "music", "queue_footer", {
                        page: page + 1,
                        pages: pages.length,
                        queue_length: queueLength,
                        duration: queueDuration
                    })}`
                })
            ],
            components: [row]
        })
    })
    collector.on('end', () => {
        const drow = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                .setCustomId('back')
                .setEmoji('⬅')
                .setStyle(ButtonStyle.Secondary)
                .setDisabled(),

                new ButtonBuilder()
                .setCustomId('next')
                .setEmoji('➡')
                .setStyle(ButtonStyle.Secondary)
                .setDisabled()
            )

        curPage.edit({
            embeds: [
                pages[page].setFooter({
                    text: `${client.i18n.get(lang, "music", "queue_footer", {
                        page: page + 1,
                        pages: pages.length,
                        queue_length: queueLength,
                        duration: queueDuration
                    })}`
                })
            ],
            components: [drow]
        })
        return curPage;
    })
}

const playlistPage = async (client, interaction, pages, timeout, queueLength, lang) => {
    if (!interaction && !interaction.channel) return console.log('Channel is inaccessible')
    if (!pages) return console.log('Pages are not given')

    const row = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
            .setCustomId('back')
            .setEmoji('⬅')
            .setStyle(ButtonStyle.Secondary),

            new ButtonBuilder()
            .setCustomId('next')
            .setEmoji('➡')
            .setStyle(ButtonStyle.Secondary)
        )

    let page = 0
    const curPage = await interaction.editReply({
        embeds: [
            pages[page].setFooter({
                text: `${client.i18n.get(lang, "playlist", "view_embed_footer", {
                    page: page + 1,
                    pages: pages.length,
                    songs: queueLength
                })}`
            })
        ],
        components: [row]
    })
    if (pages.length == 0) return;

    const filter = (m) => m.user.id === interaction.user.id
    const collector = await curPage.createMessageComponentCollector({
        filter,
        time: timeout
    })

    collector.on('collect', async (interaction) => {
        if (!interaction.deferred) await interaction.deferUpdate()
        if (interaction.customId === 'back') {
            page = page > 0 ? --page : pages.length - 1
        } else if (interaction.customId === 'next') {
            page = page + 1 < pages.length ? ++page : 0
        }

        curPage.edit({
            embeds: [
                pages[page].setFooter({
                    text: `${client.i18n.get(lang, "playlist", "view_embed_footer", {
                        page: page + 1,
                        pages: pages.length,
                        songs: queueLength
                    })}`
                })
            ],
            components: [row]
        })
    })
    collector.on('end', () => {
        const drow = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                .setCustomId('back')
                .setEmoji('⬅')
                .setStyle(ButtonStyle.Secondary)
                .setDisabled(),

                new ButtonBuilder()
                .setCustomId('next')
                .setEmoji('➡')
                .setStyle(ButtonStyle.Secondary)
                .setDisabled()
            )

        curPage.edit({
            embeds: [
                pages[page].setFooter({
                    text: `${client.i18n.get(lang, "playlist", "view_embed_footer", {
                        page: page + 1,
                        pages: pages.length,
                        songs: queueLength
                    })}`
                })
            ],
            components: [drow]
        })
        return curPage;
    })
}

module.exports = {
    queuePage,
    playlistPage
}