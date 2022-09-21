const {
    Player
} = require('erela.js')
const delay = require('delay')

/**
 * 
 * @param {Client} client 
 * @param {Player} player 
 */
module.exports = async (client, player, oldChannel, newChannel) => {
    if (!newChannel) return player ? player.destroy() : undefined
    else {
        player.voiceChannel = newChannel
        player.pause(true)
        await delay(1000)
        player.pause(false)
    }
}