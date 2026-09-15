export function scrollToSection(sectionId) {
  const element = document.getElementById(sectionId)
  if (!element) return

  const navbar = document.querySelector('.navbar')
  const navbarHeight = navbar ? navbar.getBoundingClientRect().height : 64
  const anchor = element.querySelector('.section-title') || element
  const absoluteTop = anchor.getBoundingClientRect().top + window.scrollY
  const targetTop = sectionId === 'home' ? 0 : absoluteTop - navbarHeight - 24
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight

  window.scrollTo({
    top: Math.max(0, Math.min(targetTop, maxScroll)),
    behavior: 'smooth'
  })
}
