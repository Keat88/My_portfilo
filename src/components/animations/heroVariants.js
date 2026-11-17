export const heroContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.085, delayChildren: 0.2 } },
}

export const heroItem = {
  hidden: { opacity: 0, y: 28, filter: 'blur(6px)' },
  show: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
  },
}
