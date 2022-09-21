const {
    EmbedBuilder,
    Client,
    Message,
    VoiceChannel
} = require('discord.js')
const delay = require('delay')
const DB = require('../../models/lang'),
    DB2 = require('../../models/setup')

/**
 * @param {Client} client
 */
module.exports = async (client) => {
    try {
        client.on('interactionCreate', async (interaction) => {
            if (!interaction.guild || interaction.user.bot) return;
            if (interaction.isButton()) {
                let voiceMember = interaction.guild.members.cache.get(interaction.member.id)
                let channel = voiceMember.voice.channel

                let player = await client.manager.get(interaction.guild.id)
                if (!player) return;

                const playChannel = client.channels.cache.get(player.textChannel)
                if (!playChannel) return;

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

                switch (interaction.customId) {
                    case "sprevious":
                        if (!channel) return interaction.reply({
                            content: `${client.i18n.get(lang, "player", "no_voice")}`
                        })
                        else if (interaction.guild.members.me.voice.channel && !interaction.guild.members.me.voice.channel.equals(channel)) return interaction.reply({
                            content: `${client.i18n.get(lang, "player", "no_voice")}`
                        })
                        else if (!player || !player.queue.previous) return interaction.reply({
                            content: `${client.i18n.get(lang, "music", "no_previous")}`
                        })
                        else {
                            await player.queue.unshift(player.queue.previous)
                            await player.stop()

                            interaction.reply({
                                embeds: [
                                    new EmbedBuilder()
                                    .setDescription(`${client.i18n.get(lang, "music", "previous_added")}`)
                                    .setColor(client.config.color)
                                ]
                            })
                        }
                        break;
                    case "sskip":
                        if (!channel) return interaction.reply({
                            content: `${client.i18n.get(lang, "player", "no_voice")}`
                        })
                        else if (interaction.guild.members.me.voice.channel && !interaction.guild.members.me.voice.channel.equals(channel)) return interaction.reply({
                            content: `${client.i18n.get(lang, "player", "no_voice")}`
                        })
                        else if (!player) return interaction.reply({
                            content: `${client.i18n.get(lang, "player", "no_player")}`
                        })
                        else {
                            if (player.queue.size == 0) {
                                await player.destroy()
                                await client.updateMusic(player)

                                interaction.reply({
                                    embeds: [
                                        new EmbedBuilder()
                                        .setDescription(`${client.i18n.get(lang, "music", "skipped")}`)
                                        .setColor(client.config.color)
                                    ]
                                })
                            } else {
                                await player.stop()

                                interaction.reply({
                                    embeds: [
                                        new EmbedBuilder()
                                        .setDescription(`${client.i18n.get(lang, "music", "skipped")}`)
                                        .setColor(client.config.color)
                                    ]
                                })
                            }
                        }
                        break;
                    case "sstop":
                        if (!channel) return interaction.reply({
                            content: `${client.i18n.get(lang, "player", "no_voice")}`
                        })
                        else if (interaction.guild.members.me.voice.channel && !interaction.guild.members.me.voice.channel.equals(channel)) return interaction.reply({
                            content: `${client.i18n.get(lang, "player", "no_voice")}`
                        })
                        else if (!player) return interaction.reply({
                            content: `${client.i18n.get(lang, "player", "no_player")}`
                        })
                        else {
                            await player.destroy()
                            await client.updateMusic(player)

                            interaction.reply({
                                embeds: [
                                    new EmbedBuilder()
                                    .setDescription(`${client.i18n.get(lang, "music", "stopped")}`)
                                    .setColor(client.config.color)
                                ]
                            })
                        }
                        break;
                    case "spause":
                        if (!channel) return interaction.reply({
                            content: `${client.i18n.get(lang, "player", "no_voice")}`
                        })
                        else if (interaction.guild.members.me.voice.channel && !interaction.guild.members.me.voice.channel.equals(channel)) return interaction.reply({
                            content: `${client.i18n.get(lang, "player", "no_voice")}`
                        })
                        else if (!player) return interaction.reply({
                            content: `${client.i18n.get(lang, "player", "no_player")}`
                        })
                        else {
                            await player.pause(!player.paused)
                            const uni = player.paused ? `${client.i18n.get(lang, "player", "switch_pause")}` : `${client.i18n.get(lang, "player", "switch_resume")}`

                            interaction.reply({
                                embeds: [
                                    new EmbedBuilder()
                                    .setDescription(`${client.i18n.get(lang, "player", "paused", {
                                        switch: uni
                                    })}`)
                                    .setColor(client.config.color)
                                ]
                            })
                        }
                        break;
                    case "sloop":
                        if (!channel) return interaction.reply({
                            content: `${client.i18n.get(lang, "player", "no_voice")}`
                        })
                        else if (interaction.guild.members.me.voice.channel && !interaction.guild.members.me.voice.channel.equals(channel)) return interaction.reply({
                            content: `${client.i18n.get(lang, "player", "no_voice")}`
                        })
                        else if (!player) return interaction.reply({
                            content: `${client.i18n.get(lang, "player", "no_player")}`
                        })
                        else {
                            await player.setQueueRepeat(!player.queueRepeat)
                            const uni = player.queueRepeat ? `${client.i18n.get(lang, "player", "switch_enable")}` : `${client.i18n.get(lang, "player", "switch_disable")}`

                            interaction.reply({
                                embeds: [
                                    new EmbedBuilder()
                                    .setDescription(`${client.i18n.get(lang, "player", "loop", {
                                        switch: uni
                                    })}`)
                                    .setColor(client.config.color)
                                ]
                            })
                        }
                        break;
                }
            }
        })
    } catch (err) {
        console.log(err)
    }
    /**
     * @param {Client} client
     * @param {Message} message
     */
    client.on('messageCreate', async (message) => {
        if (!message.guild) return;

        let data = await DB2.findOne({
            idG: message.guild.id,
        })
        if (!data) return await DB2.create({
            idG: message.guild.id,
            status: false,
            channel: "",
            playMsg: ""
        })

        if (data.status === false) return;

        let channel = await message.guild.channels.cache.get(data.channel)
        if (!channel) return;

        if (data.channel != message.channel.id) return;

        let dataL = await DB.findOne({
            idG: message.guild.id
        })
        if (!dataL) {
            dataL = await DB.create({
                idG: message.guild.id,
                lang: 'en'
            })
        }

        const {
            lang
        } = dataL

        if (message.author.id === client.user.id) {
            await delay(3000)
            message.delete()
        }

        if (message.author.bot) return;

        const song = message.cleanContent;
        await message.delete()

        let voiceChannel = await message.member.voice.channel
        if (!voiceChannel) return message.channel.send(`${client.i18n.get(lang, "player", "no_voice")}`)

        const player = await client.manager.create({
            guild: message.guild.id,
            voiceChannel: message.member.voice.channel.id,
            textChannel: message.channel.id,
            selfDeafen: true
        })

        const state = player.state
        if (state != 'CONNECTED') await player.connect()
        const res = await client.manager.search(song, message.author)
        if (res.loadType != 'NO_MATCHES') {
            if (res.loadType == 'TRACK_LOADED') {
                player.queue.add(res.tracks[0])
                if (!player.playing) player.play()
            } else if (res.loadType == 'PLAYLIST_LOADED') {
                player.queue.add(res.tracks)
                if (!player.playing) player.play()
            } else if (res.loadType == 'SEARCH_RESULT') {
                player.queue.add(res.tracks[0])
                if (!player.playing) player.play()
            } else if (res.loadType == 'LOAD_FAILED') {
                message.channel.send(`${client.i18n.get(lang, "music", "load_fail")}`).then((msg) => {
                    setTimeout(() => {
                        msg.delete()
                    }, 4000)
                }).catch(() => {})
                player.destroy()
            }
        } else {
            message.channel.send(`${client.i18n.get(lang, "music", "no_match")}`).then((msg) => {
                setTimeout(() => {
                    msg.delete()
                }, 4000)
            }).catch(() => {})
            player.destroy()
        }

        if (player) {
            client.updateQueueMsg(player)
        }
    })
}