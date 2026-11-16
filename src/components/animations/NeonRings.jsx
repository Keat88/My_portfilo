export default function NeonRings() {
  return (
    <div className="pointer-events-none absolute inset-0" aria-hidden="true">
      <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle,rgba(56,189,248,0.16)_0%,rgba(168,85,247,0.1)_45%,transparent_70%)] blur-2xl" />

      <div className="absolute inset-[2%] rounded-full border border-[var(--ring-border)]" />

      <div className="animate-spin-slower absolute inset-[2%] rounded-full border border-dashed border-[var(--ring-border-dash)]">
        <span className="absolute left-1/2 top-0 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary shadow-[0_0_14px_5px_rgba(56,189,248,0.55)]" />
      </div>

      <div className="animate-spin-slow absolute inset-[10%]">
        <div className="orbit-arc absolute inset-0" />
        <span className="absolute bottom-[6%] left-[14%] h-2 w-2 rounded-full bg-violet shadow-[0_0_16px_6px_rgba(168,85,247,0.5)]" />
      </div>

      <div className="animate-spin-reverse absolute inset-[17%]">
        <div className="orbit-arc-alt absolute inset-0" />
        <span className="absolute right-[8%] top-[20%] h-1.5 w-1.5 rounded-full bg-cyan shadow-[0_0_14px_5px_rgba(34,211,238,0.55)]" />
      </div>

      <div className="animate-pulse-glow absolute inset-[25%] rounded-full border border-primary/15 shadow-[0_0_60px_rgba(56,189,248,0.18),inset_0_0_50px_rgba(168,85,247,0.12)]" />
    </div>
  )
}
