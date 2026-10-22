import { useEffect, useRef, useState } from 'react'

export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const raw = window.localStorage.getItem(key)
      return raw ? JSON.parse(raw) : initialValue
    } catch (err) {
      console.error('No se pudo leer localStorage:', err)
      return initialValue
    }
  })

  const first = useRef(true)

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value))
    } catch (err) {
      console.error('No se pudo guardar en localStorage:', err)
    }
  }, [key, value])

  return [value, setValue]
}
