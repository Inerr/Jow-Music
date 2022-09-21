module.exports = (client) => {
    require('./player/update')(client)
    require('./player/buttons')(client)
    require('./player/content')(client)
    require('./player/events')(client)
}