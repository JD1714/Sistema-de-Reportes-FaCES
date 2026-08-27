const fs = require('fs')

const SPREADSHEET_ID = '1uf9cnqJO4epgGOmrnc9_M91vvFu4D9ju'
const sheets = [
  'Academia',
  'Extensión',
  'Estudiantes',
  'Otros Gastos de Funcionamiento',
  'Gastos de Personal'
]

async function scanSheet(sheetName) {
  const url = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/gviz/tq?tqx=out:json&sheet=${encodeURIComponent(sheetName)}`
  try {
    const res = await fetch(url)
    const text = await res.text()
    
    const firstBrace = text.indexOf('{')
    const lastBrace = text.lastIndexOf('}')
    if (firstBrace === -1 || lastBrace === -1) {
      console.log(`[${sheetName}] No se pudo parsear el JSON. Status text:`, text.substring(0, 100))
      return
    }

    const data = JSON.parse(text.substring(firstBrace, lastBrace + 1))
    if (data.status !== 'ok') {
      console.log(`[${sheetName}] Error status:`, data.status)
      return
    }

    console.log(`\n=================== HOJA: ${sheetName} ===================`)
    const rows = data.table.rows || []
    console.log(`Total de Filas: ${rows.length}`)

    rows.forEach((r, rIdx) => {
      const c = r.c || []
      const rowVals = c.map(cell => (cell && cell.v !== null && cell.v !== undefined) ? String(cell.v).trim() : '')
      const nonNull = rowVals.filter(v => v !== '')
      if (nonNull.length > 0) {
        console.log(`Fila ${rIdx + 1}: ${rowVals.slice(0, 16).join(' | ')}`)
      }
    })
  } catch (err) {
    console.error(`[${sheetName}] Error:`, err.message)
  }
}

async function run() {
  for (const s of sheets) {
    await scanSheet(s)
  }
}

run()
