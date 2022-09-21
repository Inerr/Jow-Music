const delay = require('delay')
const { PermissionFlagsBits } = require('discord.js')

module.exports = {
    name: 'voiceStateUpdate',
    async execute(oldState, newState, client) {
        const player = client.manager?.players.get(newState.guild.id)
        if (!player) return;

        if (!newState.guild.members.cache.get(client.user.id).voice.channelId) player.destroy()
        
        if (newState.channelId && newState.channel.type == 'GUILD_STAGE_VOICE' && newState.guild.members.me.voice.suppress) {
            if (newState.guild.members.me.permissions.has(PermissionFlagsBits.Connect) || (newState.channel && newState.channel.permissionsFor(newState.guild.members.me).has(PermissionFlagsBits.Speak))) {
                newState.guild.members.me.voice.setSuppressed(false)
            }
        }

        if (oldState.id === client.user.id) return;
        if (!oldState.guild.members.cache.get(client.user.id).voice.channelId) return;

        if (oldState.guild.members.cache.get(client.user.id).voice.channelId === oldState.channelId) {
            if (oldState.guild.members.me.voice?.channel && oldState.guild.members.me.voice.channel.members.filter((m) => !m.user.bot).size === 0) {
                await delay(120000)

                const vcMembers = oldState.guild.members.me.voice?.channel.members.size
                if (!vcMembers || vcMembers === 1) {
                    const newPlayer = client.manager?.players.get(newState.guild.id)
                    newPlayer ? player.destroy() : oldState.guild.members.me.voice?.channel.leave().catch(() => {})
                    client.updateMusic(newPlayer)
                }
            }
        }
    }
}