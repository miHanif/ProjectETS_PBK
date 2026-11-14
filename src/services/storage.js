export function readStorage(key) {
  const serialized = window.localStorage.getItem(key)

  if (serialized === null) {
    return null
  }

  try {
    return JSON.parse(serialized)
  } catch (error) {
    console.warn(`Data localStorage "${key}" bukan JSON valid dan akan diinisialisasi ulang.`, error)
    return undefined
  }
}

export function writeStorage(key, value) {
  const serialized = JSON.stringify(value)

  if (serialized === undefined) {
    throw new TypeError(`Data untuk localStorage "${key}" tidak dapat diserialisasi.`)
  }

  window.localStorage.setItem(key, serialized)
}

export function removeStorage(key) {
  window.localStorage.removeItem(key)
}
