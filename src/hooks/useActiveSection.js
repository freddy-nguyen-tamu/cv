import { useEffect, useState } from 'react'

const DEFAULT_SECTION_IDS = ['home', 'about', 'projects', 'contact']

export function useActiveSection(sectionIds = DEFAULT_SECTION_IDS, offsetRatio = 0.35) {
  const [activeSection, setActiveSection] = useState(sectionIds[0] || '')

  useEffect(() => {
    const sections = sectionIds
      .map((id) => document.getElementById(id))
      .filter(Boolean)

    if (!sections.length) return

    if (!('IntersectionObserver' in window)) {
      setActiveSection(sections[0].id)
      return
    }

    const topMargin = Math.round(offsetRatio * 100)
    const bottomMargin = Math.max(0, 92 - topMargin)
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)

        if (visible[0]?.target?.id) {
          setActiveSection((current) =>
            current === visible[0].target.id ? current : visible[0].target.id
          )
        }
      },
      {
        rootMargin: `-${topMargin}% 0px -${bottomMargin}% 0px`,
        threshold: 0
      }
    )

    sections.forEach((section) => observer.observe(section))

    return () => observer.disconnect()
  }, [offsetRatio, sectionIds])

  return activeSection
}
