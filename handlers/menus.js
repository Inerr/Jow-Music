const { loadFiles } = require('../utils/loader')
const ascii = require('ascii-table')

async function loadSelectMenus(client) {
    const table = new ascii().setHeading('Menu ID', 'Status')

    const files = await loadFiles('menus')

    files.forEach((file) => {
        const menu = require(file)
        if (!menu.id) return;

        client.menus.set(menu.id, menu)
        table.addRow(menu.id, "✅")
    })
    return console.log(table.toString())
}

module.exports = {
    loadSelectMenus
}