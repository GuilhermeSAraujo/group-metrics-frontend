export function buildDateRangeQueryString(startDate, endDate) {
  if (!startDate || !endDate || startDate > endDate) return ''

  return new URLSearchParams({
    'start-date': startDate,
    'end-date': endDate,
  }).toString()
}

export function withQueryString(endpoint, queryString) {
  if (!queryString) return endpoint

  return `${endpoint}?${queryString}`
}
