export function scrollToSection(sectionId) {
  const element = document.getElementById(sectionId)
  if (!element) return

  const viewportHeight = window.innerHeight
  const navbar = document.querySelector('.navbar')
  const navbarHeight = navbar ? navbar.getBoundingClientRect().height : 80
  const titleBlock = element.querySelector('.section-title')
  const anchorElement = titleBlock || element
  const rect = anchorElement.getBoundingClientRect()
  const absoluteTop = rect.top + window.scrollY
  const layoutBySection = {
    home: { mode: 'hero' },
    about: { mode: 'title', offset: 24 },
    projects: { mode: 'title', offset: 24 },
    contact: { mode: 'title', offset: 24 }
  }
  const config = layoutBySection[sectionId] ?? { mode: 'title', offset: 24 }

  let targetTop = absoluteTop

  if (config.mode === 'hero') {
    targetTop = absoluteTop
  } else if (config.mode === 'title') {
    targetTop = absoluteTop - navbarHeight - (config.offset ?? 24)
  } else if (config.mode === 'center') {
    const sectionRect = element.getBoundingClientRect()
    const sectionAbsoluteTop = sectionRect.top + window.scrollY
    targetTop = sectionAbsoluteTop + sectionRect.height / 2 - viewportHeight / 2
  } else {
    targetTop = absoluteTop - (config.offset ?? 96)
  }

  const maxScroll = document.documentElement.scrollHeight - viewportHeight

  window.scrollTo({
    top: Math.max(0, Math.min(targetTop, maxScroll)),
    behavior: 'smooth'
  })
}
