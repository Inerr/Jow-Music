const {
    Client,
    Collection,
    Partials
} = require('discord.js')
const Deezer = require('erela.js-deezer')
const Tidal = require('erela.js-tidal')
const Apple = require('better-erela.js-apple').default
const Spotify = require('better-erela.js-spotify').default
const { Manager } = require('erela.js')
const { I18n } = require('@hammerhq/localization')
const { resolve } = require('path')

const { User, Message, Channel, GuildMember, ThreadMember } = Partials

const client = new Client({
    intents: 131071,
    partials: [User, Message, Channel, GuildMember, ThreadMember]
})

client.config = require('./config.json')
client.commands = new Collection()
client.events = new Collection()
client.buttons = new Collection()
client.menus = new Collection()

client.i18n = new I18n({
    defaultLocale: 'en',
    directory: resolve('locales')
})

client.manager = new Manager({
    nodes: client.config.nodes,
    plugins: [new Spotify({
        clientId: '49bf1f31cdae436bbedf16d1c22f26d6',
        clientSecret: 'ff4ae349793d44fbb051f362f1fd58f4'
    }), new Apple(), new Deezer(), new Tidal()],
    send: (id, payload) => {
        let guild = client.guilds.cache.get(id)
        if (guild) guild.shard.send(payload)
    }
})

client.on('raw', async (data) => client.manager.updateVoiceState(data))

const {
    loadEvents
} = require('./handlers/events')
const {
    loadButtons
} = require('./handlers/buttons')
const {
    loadSelectMenus
} = require('./handlers/menus')

module.exports = client

loadEvents(client)
loadButtons(client)
loadSelectMenus(client)
require('./handlers/player')(client)
require('./handlers/anticrash')(client)

client.login(client.config.token)