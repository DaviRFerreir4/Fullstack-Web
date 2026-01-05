import { useEffect, useState } from 'react'

const mediaQuery = '(width < 1024px)'

export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(
    window.matchMedia(mediaQuery).matches
  )

  useEffect(() => {
    const media = window.matchMedia(mediaQuery)

    const handleResize = (e: MediaQueryListEvent) => setIsMobile(e.matches)
    media.addEventListener('change', handleResize)

    return () => media.removeEventListener('change', handleResize)
  }, [])

  return isMobile
}
