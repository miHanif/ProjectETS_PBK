const rupiahFormatter = new Intl.NumberFormat('id-ID', {
  maximumFractionDigits: 0,
})

export function formatRupiah(value) {
  return `Rp ${rupiahFormatter.format(Number(value) || 0)}`
}

export function localDateKey(date = new Date()) {
  const pad = (value) => String(value).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
}

export function localMonthKey(date = new Date()) {
  const pad = (value) => String(value).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}`
}

export function getReportDateRange(mode, period) {
  if (mode === 'harian' && /^\d{4}-\d{2}-\d{2}$/.test(period)) {
    const date = new Date(`${period}T00:00:00`)
    if (!Number.isNaN(date.getTime()) && localDateKey(date) === period) {
      return { start: period, end: period }
    }
  }

  if (mode === 'bulanan' && /^\d{4}-\d{2}$/.test(period)) {
    const [year, month] = period.split('-').map(Number)
    if (month < 1 || month > 12) {
      return null
    }
    const lastDay = new Date(year, month, 0).getDate()
    return {
      start: `${period}-01`,
      end: `${period}-${String(lastDay).padStart(2, '0')}`,
    }
  }

  return null
}

export function formatDateTime(value) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return value
  }

  return new Intl.DateTimeFormat('id-ID', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date)
}

export function formatDate(value) {
  const date = new Date(`${value}T00:00:00`)
  if (Number.isNaN(date.getTime())) {
    return value
  }

  return new Intl.DateTimeFormat('id-ID', { dateStyle: 'medium' }).format(date)
}
