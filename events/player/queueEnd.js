const {
    Player
} = require('erela.js')
const {
    Client
} = require('discord.js')

/**
 * 
 * @param {Client} client 
 * @param {Player} player 
 */
module.exports = async (client, player) => {
    await client.updateMusic(player)
    player.destroy()
}