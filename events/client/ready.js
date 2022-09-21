const {
    loadCommands
} = require('../../handlers/commands')
const {
    Client
} = require('discord.js')
const mongoose = require('mongoose')

module.exports = {
    name: 'ready',
    once: true,
    /**
     * 
     * @param {Client} client 
     */
    execute(client) {
        console.log('Client online')
        client.user.setPresence({
            status: 'idle'
        })

        client.manager.init(client.user.id)

        loadCommands(client)

        mongoose.connect('mongodb+srv://jow:jow@cluster0.kgr3n6s.mongodb.net/?retryWrites=true&w=majority', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        }).then(() => {
            console.log('Conectado a la base de datos')
        }).catch(err => console.log(err))
    }
}