const {
    Client,
    EmbedBuilder
} = require('discord.js')
const formatDuration = require('../../functions/formatDuration')
const { Player } = require('erela.js')
const DB = require('../../models/lang'),
      DB2 = require('../../models/setup')

/**
 * @param {Client} client
 */

module.exports = async (client) => {
    /**
     * @param {Player} player
     */
    client.updateQueueMsg = async function(player) {
        let data = await DB2.findOne({
            idG: player.guild
        })
        if (data.status === false) return;

        let channel = await client.channels.cache.get(data.channel)
        if (!channel) return;

        let playMsg = await channel.messages.fetch(data.playMsg, { cache: false, force: true })
        if (!playMsg) return;

        let dataL = await DB.findOne({
            idG: player.guild
        })
        if (!dataL) {
            dataL = await DB.create({
                idG: player.guild,
                lang: 'en'
            })
        }

        const { lang } = dataL

        const songStrings = [];
        const queuedSongs = player.queue.map((song, i) => `${client.i18n.get(lang, "setup", "setup_content_queue", {
            index: i + 1,
            title: song.title,
            duration: formatDuration(song.duration),
            requester: song.requester
        })}`)

        await songStrings.push(...queuedSongs)

        const Str = songStrings.slice(0, 10).join('\n')

        let cSong = player.queue.current
        let qDuration = `${formatDuration(player.queue.duration)}`

        let embed = new EmbedBuilder()
            .setAuthor({
                name: `${client.i18n.get(lang, "setup", "setup_author")}`,
                iconURL: client.user.displayAvatarURL()
            })
            .setDescription(`${client.i18n.get(lang, "setup", "setup_desc", {
                title: cSong.title,
                url: cSong.uri,
                duration: formatDuration(cSong.duration),
                requester: cSong.requester
            })}`)
            .setColor(client.config.color)
            .setImage(`https://img.youtube.com/vi/${cSong.identifier}/sddefault.jpg`)
            .setFooter({
                text: `${client.i18n.get(lang, "setup", "setup_footer", {
                    songs: player.queue.length,
                    duration: qDuration
                })}`
            })

        return await playMsg.edit({
            content: `${client.i18n.get(lang, "setup", "setup_content")}\n${Str == '' ? `${client.i18n.get(lang, "setup", "setup_content_empty")}` : '\n' + Str}`,
            embeds: [embed],
            components: [client.enSwitch]
        }).catch(() => {})
    }

    /**
     * @param {Player} player
     */
    client.updateMusic = async function(player) {
        let data = await DB2.findOne({
            idG: player.guild
        })
        if (data.status === false) return;

        let channel = await client.channels.cache.get(data.channel)
        if (!channel) return;

        let playMsg = await channel.messages.fetch(data.playMsg, { cache: true, force: true })
        if (!playMsg) return;

        let dataL = await DB.findOne({
            idG: player.guild
        })
        if (!dataL) {
            dataL = await DB.create({
                idG: player.guild,
                lang: 'en'
            })
        }

        const { lang } = dataL

        const queueMsg = `${client.i18n.get(lang, "setup", "setup_queue_msg")}`

        const playEmbed = new EmbedBuilder()
            .setAuthor({
                name: `${client.i18n.get(lang, "setup", "setup_play_author")}`,
                iconURL: client.user.displayAvatarURL()
            })
            .setDescription(`${client.i18n.get(lang, "setup", "setup_play_desc")}`)
            .setImage('https://i.gifer.com/cm8.gif')
            .setColor(client.config.color)

        return await playMsg.edit({
            content: `${queueMsg}`,
            embeds: [playEmbed],
            components: [client.diSwitch]
        }).catch(() => {})
    }
}