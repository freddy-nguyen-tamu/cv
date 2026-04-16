export function scrollToSection(sectionId) {
  const element = document.getElementById(sectionId)
  if (!element) return

  const rect = element.getBoundingClientRect()
  const absoluteTop = rect.top + window.scrollY
  const viewportHeight = window.innerHeight
  const layoutBySection = {
    home: { mode: 'hero' },
    about: { mode: 'top', offset: 96 },
    projects: { mode: 'top', offset: 96 },
    contact: { mode: 'top', offset: 120 }
  }
  const config = layoutBySection[sectionId] ?? { mode: 'top', offset: 96 }

  let targetTop = absoluteTop

  if (config.mode === 'hero') {
    targetTop = absoluteTop
  } else if (config.mode === 'center') {
    targetTop = absoluteTop + rect.height / 2 - viewportHeight / 2
  } else {
    targetTop = absoluteTop - (config.offset ?? 96)
  }

  const maxScroll = document.documentElement.scrollHeight - viewportHeight

  window.scrollTo({
    top: Math.max(0, Math.min(targetTop, maxScroll)),
    behavior: 'smooth'
  })
}
