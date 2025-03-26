import { openDB } from 'idb'

const DB_NAME = 'UPTELDB'
const ABSENCE_STORE_NAME = 'absences'
const SITE_STORE_NAME = 'sites'

export const initDB = async (STORE_NAME: string) => {
  return openDB<any>(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' })
        store.createIndex('by-date', 'date') //  Create an index for querying
      }
    }
  })
}

// absence
export const addAbsencesToDB = async (absences: any[]) => {
  const db = await initDB(ABSENCE_STORE_NAME)
  const tx = db.transaction(ABSENCE_STORE_NAME, 'readwrite')
  const store = tx.objectStore(ABSENCE_STORE_NAME)
  for (const absence of absences) {
    await store.put(absence)
  }
  await tx.done
}

export const getAbsencesFromDB = async () => {
  const db = await initDB(ABSENCE_STORE_NAME)
  return db.getAll(ABSENCE_STORE_NAME)
}

export const removeAbsenceFromDB = async (id: string) => {
  const db = await initDB('absences')
  await db.delete(ABSENCE_STORE_NAME, id)
}

// site
export const addSitesToDB = async (sites: any[]) => {
  const db = await initDB(SITE_STORE_NAME)
  const tx = db.transaction(SITE_STORE_NAME, 'readwrite')
  const store = tx.objectStore(SITE_STORE_NAME)
  for (const site of sites) {
    await store.put(site)
  }
  await tx.done
}

export const getSitesFromDB = async () => {
  const db = await initDB(SITE_STORE_NAME)
  return db.getAll(SITE_STORE_NAME)
}

export const removeSiteFromDB = async (id: string) => {
  const db = await initDB('sites')
  await db.delete(SITE_STORE_NAME, id)
}
