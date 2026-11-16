const PARTICLES = Array.from({ length: 22 }, (_, index) => {
  const angle = (index / 22) * Math.PI * 2
  const radius = 42 + ((index * 37) % 7)
  const driftX = ((index * 53) % 17) - 8
  const driftY = ((index * 29) % 19) - 12

  return {
    id: index,
    left: 50 + Math.cos(angle) * radius,
    top: 50 + Math.sin(angle) * radius,
    size: 2 + (index % 3),
    opacity: 0.25 + ((index * 13) % 50) / 100,
    delay: (index % 8) * 0.65,
    duration: 6 + (index % 6),
    driftX,
    driftY,
  }
})

export default function FloatingParticles() {
  return (
    <div className="pointer-events-none absolute inset-[-14%]" aria-hidden="true">
      {PARTICLES.map((particle) => (
        <span
          key={particle.id}
          className="particle"
          style={{
            left: `${particle.left}%`,
            top: `${particle.top}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            opacity: particle.opacity,
            '--duration': `${particle.duration}s`,
            '--delay': `${particle.delay}s`,
            '--drift-x': `${particle.driftX}px`,
            '--drift-y': `${particle.driftY}px`,
          }}
        />
      ))}
    </div>
  )
}
