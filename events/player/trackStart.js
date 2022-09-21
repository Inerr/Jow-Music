const {
    Player
} = require('erela.js')
const {
    Client,
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
} = require('discord.js')
const DB = require('../../models/lang'),
    DB2 = require('../../models/setup')
const formatDuration = require('../../functions/formatDuration')
const delay = require('delay')

/**
 * 
 * @param {Client} client 
 * @param {Player} player 
 */
module.exports = async (client, player, track, payload) => {
    if (!player) return;

    await client.updateQueueMsg(player)

    const data = await DB2.findOne({
        idG: player.guild
    })
    if (player.textChannel === data.channel) return;

    let dataL = await DB.findOne({
        idG: player.guild
    })
    if (!dataL) {
        dataL = await DB.create({
            idG: player.guild,
            lang: 'en'
        })
    }

    const {
        lang
    } = dataL

    const embed = new EmbedBuilder()
        .setAuthor({
            name: `${track.title}`,
            iconURL: client.user.displayAvatarURL()
        })
        .setThumbnail(`${track.thumbnail}`)
        .addFields({
            name: `${client.i18n.get(lang, "music", "requester")}`,
            value: `${track.requester}`
        }, {
            name: `${client.i18n.get(lang, "music", "duration")}`,
            value: `${formatDuration(track.duration)}`,
            inline: true
        }, {
            name: `${client.i18n.get(lang, "music", "queue_length")}`,
            value: `${player.queue.length}`,
            inline: true
        }, {
            name: `${client.i18n.get(lang, "music", "queue_duration")}`,
            value: `${formatDuration(player.queue.duration)}`,
            inline: true
        })
        .setColor(client.config.color)

    const row = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
            .setStyle(ButtonStyle.Secondary)
            .setCustomId("pause")
            .setEmoji("⏯"),

            new ButtonBuilder()
            .setStyle(ButtonStyle.Secondary)
            .setCustomId("previous")
            .setEmoji("⬅"),

            new ButtonBuilder()
            .setStyle(ButtonStyle.Secondary)
            .setCustomId("stop")
            .setEmoji("⏹"),

            new ButtonBuilder()
            .setStyle(ButtonStyle.Secondary)
            .setCustomId("skip")
            .setEmoji("➡"),

            new ButtonBuilder()
            .setStyle(ButtonStyle.Secondary)
            .setCustomId("loop")
            .setEmoji("🔄"),
        )

    const np = await client.guilds.cache.get(player.guild).channels.cache.get(player.textChannel).send({
        embeds: [embed],
        components: [row]
    })

    // setTimeout(() => {
    //     np.edit({
    //         components: []
    //     })
    // }, track.duration)

    const filter = (interaction) => {
        if (interaction.guild.members.me.voice.channel && interaction.guild.members.me.voice.channelId === interaction.member.voice.channelId) return true;
        else {
            interaction.reply({
                content: `${client.i18n.get(lang, "player", "no_voice")}`,
                ephemeral: true
            })
        }
    }
    const collector = np.createMessageComponentCollector({
        filter,
        time: track.duration
    })

    // collector.on('collect', async (interaction) => {
    //     const id = interaction.customId
    //     if (id === 'pause') {
    //         if (!player) return collector.stop()

    //         await player.pause(!player.paused)
    //         const uni = player.paused ? `${client.i18n.get(lang, "player", "switch_pause")}` : `${client.i18n.get(lang, "player", "switch_resume")}`

    //         interaction.reply({
    //             embeds: [
    //                 new EmbedBuilder()
    //                 .setDescription(`${client.i18n.get(lang, "player", "paused", {
    //                     switch: uni
    //                 })}`)
    //                 .setColor(client.config.color)
    //                 .setFooter({
    //                     text: `${client.i18n.get(lang, "music", "action_by", {
    //                         user: `${interaction.user.tag}`
    //                     })}`,
    //                     iconURL: interaction.user.displayAvatarURL()
    //                 })
    //             ]
    //         })

    //         await delay(4000)
    //         interaction.deleteReply()
    //     } else if (id === 'previous') {
    //         if (!player) return collector.stop()

    //         if (!player.queue.previous) return interaction.reply({
    //             content: `${client.i18n.get(lang, "music", "no_previous")}`
    //         }).then(() => {
    //             setTimeout(() => {
    //                 interaction.deleteReply()
    //             }, 4000)
    //         })

    //         await player.queue.unshift(player.queue.previous)
    //         await player.stop()

    //         interaction.reply({
    //             embeds: [
    //                 new EmbedBuilder()
    //                 .setDescription(`${client.i18n.get(lang, "music", "previous_added")}`)
    //                 .setColor(client.config.color)
    //                 .setFooter({
    //                     text: `${client.i18n.get(lang, "music", "action_by", {
    //                         user: `${interaction.user.tag}`
    //                     })}`,
    //                     iconURL: interaction.user.displayAvatarURL()
    //                 })
    //             ]
    //         })

    //         await delay(4000)
    //         interaction.deleteReply()
    //     } else if (id === 'stop') {
    //         if (!player) return collector.stop()

    //         await client.updateMusic(player)
    //         await player.destroy()

    //         await np.edit({
    //             embeds: [embed],
    //             components: []
    //         })
    //         interaction.reply({
    //             embeds: [
    //                 new EmbedBuilder()
    //                 .setDescription(`${client.i18n.get(lang, "music", "stopped")}`)
    //                 .setColor(client.config.color)
    //                 .setFooter({
    //                     text: `${client.i18n.get(lang, "music", "action_by", {
    //                         user: `${interaction.user.tag}`
    //                     })}`,
    //                     iconURL: interaction.user.displayAvatarURL()
    //                 })
    //             ]
    //         })

    //         await delay(4000)
    //         interaction.deleteReply()
    //     } else if (id === 'skip') {
    //         if (!player) return collector.stop()

    //         if (player.queue.size == 0) {
    //             await client.updateMusic(player)
    //             await player.destroy()

    //             await np.edit({
    //                 embeds: [embed],
    //                 components: []
    //             })
    //             interaction.reply({
    //                 embeds: [
    //                     new EmbedBuilder()
    //                     .setDescription(`${client.i18n.get(lang, "music", "skipped")}`)
    //                     .setColor(client.config.color)
    //                     .setFooter({
    //                         text: `${client.i18n.get(lang, "music", "action_by", {
    //                             user: `${interaction.user.tag}`
    //                         })}`,
    //                         iconURL: interaction.user.displayAvatarURL()
    //                     })
    //                 ]
    //             })

    //             await delay(4000)
    //             interaction.deleteReply()
    //         } else {
    //             await player.stop()

    //             await np.edit({
    //                 embeds: [embed],
    //                 components: []
    //             })
    //             interaction.reply({
    //                 embeds: [
    //                     new EmbedBuilder()
    //                     .setDescription(`${client.i18n.get(lang, "music", "skipped")}`)
    //                     .setColor(client.config.color)
    //                     .setFooter({
    //                         text: `${client.i18n.get(lang, "music", "action_by", {
    //                             user: `${interaction.user.tag}`
    //                         })}`,
    //                         iconURL: interaction.user.displayAvatarURL()
    //                     })
    //                 ]
    //             })

    //             await delay(4000)
    //             interaction.deleteReply()
    //         }
    //     } else if (id === 'loop') {
    //         if (!player) return collector.stop()

    //         await player.setQueueRepeat(!player.queueRepeat)
    //         const uni = player.queueRepeat ? `${client.i18n.get(lang, "player", "switch_enable")}` : `${client.i18n.get(lang, "player", "switch_disable")}`

    //         interaction.reply({
    //             embeds: [
    //                 new EmbedBuilder()
    //                 .setDescription(`${client.i18n.get(lang, "player", "loop", {
    //                     switch: uni
    //                 })}`)
    //                 .setColor(client.config.color)
    //                 .setFooter({
    //                     text: `${client.i18n.get(lang, "music", "action_by", {
    //                             user: `${interaction.user.tag}`
    //                         })}`,
    //                     iconURL: interaction.user.displayAvatarURL()
    //                 })
    //             ]
    //         })

    //         await delay(4000)
    //         interaction.deleteReply()
    //     }
    // })
    collector.on('end', (reason) => {
        np.edit({
            components: []
        })
    })
}