import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

export default function ScrollToTop() {
  const { pathname, hash } = useLocation()

  const getBehavior = (): ScrollBehavior => {
    if (typeof window === 'undefined') return 'auto'
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches
      ? 'auto'
      : 'smooth'
  }

  const highlightElement = (element: HTMLElement) => {
    if (typeof window === 'undefined') return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const highlightClass = 'section-highlight'
    element.classList.remove(highlightClass)
    // Force reflow to restart animation if the user clicks again quickly.
    void element.offsetWidth
    element.classList.add(highlightClass)
    window.setTimeout(() => {
      element.classList.remove(highlightClass)
    }, 1600)
  }

  useEffect(() => {
    const behavior = getBehavior()
    const headerOffset = 80

    if (hash) {
      const id = decodeURIComponent(hash.replace('#', ''))
      const target = document.getElementById(id)
      if (target) {
        const targetTop = target.getBoundingClientRect().top + window.scrollY
        window.scrollTo({
          top: Math.max(targetTop - headerOffset, 0),
          behavior,
        })
        highlightElement(target)
        return
      }
    }

    window.scrollTo({ top: 0, behavior })
  }, [pathname, hash])

  return null
}
