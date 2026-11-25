export const readPref = (t?, a?) => {
  try {
    const e = localStorage.getItem(t)
    return e == null ? a : JSON.parse(e)
  } catch {
    return a
  }
}

export const writePref = (t?, a?) => {
  try {
    localStorage.setItem(t, JSON.stringify(a))
  } catch {}
}
