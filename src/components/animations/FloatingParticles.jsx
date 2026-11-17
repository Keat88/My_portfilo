const COUNT = 22
const TONES = ['primary', 'cyan', 'violet']

const PARTICLES = Array.from({ length: COUNT }, (_, index) => {
  const angle = (index / COUNT) * Math.PI * 2 + (index % 3) * 0.12
  const radius = 40 + ((index * 37) % 9)
  const driftX = ((index * 53) % 21) - 10
  const driftY = ((index * 29) % 23) - 14

  return {
    id: index,
    left: 50 + Math.cos(angle) * radius,
    top: 50 + Math.sin(angle) * radius,
    size: 1.5 + (index % 4) * 0.7,
    opacity: 0.24 + ((index * 13) % 46) / 100,
    delay: (index % 9) * 0.55,
    duration: 6 + (index % 7),
    driftX,
    driftY,
    tone: TONES[index % TONES.length],
  }
})

export default function FloatingParticles() {
  return (
    <div className="pointer-events-none absolute inset-[-14%]" aria-hidden="true">
      {PARTICLES.map((particle) => (
        <span
          key={particle.id}
          className={`particle particle--${particle.tone}`}
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
