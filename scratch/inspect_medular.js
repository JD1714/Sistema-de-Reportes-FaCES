const SPREADSHEET_ID = '1uf9cnqJO4epgGOmrnc9_M91vvFu4D9ju'
const sheets = ['Academia', 'Extensión', 'Estudiantes']

async function scanMedularRows() {
  for (const sheetName of sheets) {
    const url = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/gviz/tq?tqx=out:json&sheet=${encodeURIComponent(sheetName)}`
    try {
      const res = await fetch(url)
      const text = await res.text()
      const firstBrace = text.indexOf('{')
      const lastBrace = text.lastIndexOf('}')
      if (firstBrace === -1) continue
      const data = JSON.parse(text.substring(firstBrace, lastBrace + 1))

      console.log(`\n=================== HOJA: ${sheetName} ===================`)
      const rows = data.table.rows || []
      rows.forEach((r, idx) => {
        const c = r.c || []
        const textInRow = c.map(cell => (cell && cell.v !== null) ? String(cell.v).trim() : '').filter(Boolean).slice(0, 3).join(' | ')
        if (textInRow) {
          console.log(`[${sheetName}] Fila ${idx + 1}: ${textInRow}`)
        }
      })
    } catch (e) {
      console.error(e)
    }
  }
}

scanMedularRows()
