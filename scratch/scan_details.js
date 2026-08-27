const SPREADSHEET_ID = '1uf9cnqJO4epgGOmrnc9_M91vvFu4D9ju'
const sheets = [
  'Academia',
  'Extensión',
  'Estudiantes',
  'Otros Gastos de Funcionamiento'
]

async function scanDetailed(sheetName) {
  const url = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/gviz/tq?tqx=out:json&sheet=${encodeURIComponent(sheetName)}`
  try {
    const res = await fetch(url)
    const text = await res.text()
    
    const firstBrace = text.indexOf('{')
    const lastBrace = text.lastIndexOf('}')
    const data = JSON.parse(text.substring(firstBrace, lastBrace + 1))

    console.log(`\n=================== MAPEO DETALLADO: ${sheetName} ===================`)
    const rows = data.table.rows || []

    rows.forEach((r, rIdx) => {
      const c = r.c || []
      const rowVals = c.map(cell => (cell && cell.v !== null && cell.v !== undefined) ? String(cell.v).trim() : '')
      const nonNull = rowVals.filter(v => v !== '')
      if (nonNull.length > 0) {
        // Print row index and first 10 non-empty columns with column indices
        const formatted = c.map((cell, cIdx) => {
          if (!cell || cell.v === null || cell.v === undefined || String(cell.v).trim() === '') return null
          return `Col ${String.fromCharCode(65 + cIdx)} (${cIdx + 1}): "${cell.v}"`
        }).filter(Boolean).join(' | ')
        
        console.log(`Fila ${rIdx + 1}: ${formatted}`)
      }
    })
  } catch (err) {
    console.error(`[${sheetName}] Error:`, err.message)
  }
}

async function run() {
  for (const s of sheets) {
    await scanDetailed(s)
  }
}

run()
