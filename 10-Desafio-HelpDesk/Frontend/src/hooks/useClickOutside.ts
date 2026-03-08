// bom revisar
import { useEffect, useRef } from 'react'

export function useClickOutside(handler: () => void, enabled: boolean) {
  const ref = useRef<HTMLElement | null>(null)

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (
        enabled &&
        ref.current &&
        !ref.current.contains(event.target as HTMLElement)
      ) {
        handler()
      }
    }

    document.addEventListener('mousedown', handleClick)

    return () => document.removeEventListener('mousedown', handleClick)
  }, [handler])

  return ref
}
