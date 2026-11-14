import { readStorage, writeStorage } from '../services/storage.js'

function isRecordCollection(value) {
  return (
    Array.isArray(value) &&
    value.every(
      (record) =>
        record !== null &&
        typeof record === 'object' &&
        !Array.isArray(record) &&
        Number.isInteger(record.id),
    )
  )
}

export function loadCollection(key, seed) {
  const stored = readStorage(key)

  if (isRecordCollection(stored)) {
    return stored
  }

  const initial = seed.map((record) => ({ ...record }))
  writeStorage(key, initial)
  return initial
}

export function appendRecords(records, additions) {
  if (
    !Array.isArray(additions) ||
    additions.some((record) => !record || !Number.isInteger(record.id))
  ) {
    throw new TypeError('Data yang ditambahkan harus memiliki id bilangan bulat.')
  }

  return [...records, ...additions]
}

export function appendRecord(key, records, record) {
  const next = appendRecords(records, [record])
  writeStorage(key, next)
  return next
}

export function updateRecord(key, records, id, changes) {
  if (!records.some((record) => record.id === id)) {
    throw new Error(`Data dengan id ${id} tidak ditemukan.`)
  }

  const next = records.map((record) =>
    record.id === id ? { ...record, ...changes, id: record.id } : record,
  )
  writeStorage(key, next)
  return next
}

export function removeRecord(key, records, id) {
  if (!records.some((record) => record.id === id)) {
    throw new Error(`Data dengan id ${id} tidak ditemukan.`)
  }

  const next = records.filter((record) => record.id !== id)
  writeStorage(key, next)
  return next
}
