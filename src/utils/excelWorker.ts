import { addAbsencesToDB, addSitesToDB } from '@/utils/idbUtils'
import * as XLSX from 'xlsx'

self.onmessage = async event => {
  const { file, type } = event.data

  const reader = new FileReader()
  reader.onload = (e: any) => {
    const data = e.target.result
    if (data) {
      const workbook = XLSX.read(data, { type: 'binary' })
      const sheetName = workbook.SheetNames[0]
      const worksheet = workbook.Sheets[sheetName]
      const json = XLSX.utils.sheet_to_json(worksheet)
      switch (type) {
        case 'absence':
          storeAbsenceFIle(json)
          break
        case 'site':
          storeSiteFIle(json)
          break
        default:
          storeAbsenceFIle(json)
          break
      }
    }
  }

  reader.readAsBinaryString(file)
}

function storeAbsenceFIle(json: any) {
  // Add a unique ID to each absence

  const absencesWithId = json
    .map((row: any, index: number) => {
      if (row['motif'] && row['Date de dÃ©but'] && row['Date de fin'] && row['username']) {
        return {
          ...row,
          id: `absence-${Date.now()}-${index}` // Unique ID for each absence
        }
      }
    })
    ?.filter(Boolean)

  // Store the absences in IndexedDB
  addAbsencesToDB(absencesWithId).then(() => {
    // Send a message back to the main thread
    self.postMessage({ status: 'success', count: absencesWithId.length })
  })
}
function storeSiteFIle(json: any) {
  // Add a unique ID to each site

  const sitesWithId = json
    .map((row: any, index: number) => {
      if (row['LibellÃ©'] && row['NumÃ©ro de site'] && row['Description'] && row["Contraintes d'accÃ¨s"]) {
        return {
          ...row,
          id: `site-${Date.now()}-${index}` // Unique ID for each site
        }
      }
    })
    ?.filter(Boolean)

  // Store the sites in IndexedDB
  addSitesToDB(sitesWithId).then(() => {
    self.postMessage({ status: 'success', count: sitesWithId.length })
  })
}
