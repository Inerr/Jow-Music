const { loadFiles } = require('../utils/loader')
const ascii = require('ascii-table')

async function loadButtons(client) {
    const table = new ascii().setHeading('Button ID', 'Status')

    const files = await loadFiles('buttons')

    files.forEach((file) => {
        const button = require(file)
        if (!button.id) return;

        client.buttons.set(button.id, button)
        table.addRow(button.id, '✅')
    })
    return console.log(table.toString())
}

module.exports = {
    loadButtons
}