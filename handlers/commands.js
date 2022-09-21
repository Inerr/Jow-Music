const { loadFiles } = require('../utils/loader')
const ascii = require('ascii-table')

async function loadCommands(client) {
    const table = new ascii().setHeading('Command', 'Status')

    await client.commands.clear()

    let commandsArray = [];
    let privateArray = [];

    const files = await loadFiles('commands')

    files.forEach((file) => {
        const command = require(file)
        client.commands.set(command.name, command)

        if (command.dev) privateArray.push(command)
        else commandsArray.push(command)

        table.addRow(command.name, '✅')
    })

    client.guilds.cache.get('976659658439811154').commands.set(privateArray)
    client.application.commands.set(commandsArray)

    return console.log(table.toString())
}

module.exports = {
    loadCommands
}