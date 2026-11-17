export default function NeonRings() {
  return (
    <div className="pointer-events-none absolute inset-0" aria-hidden="true">
      <div className="absolute inset-[-6%] rounded-full bg-[radial-gradient(circle,color-mix(in_srgb,var(--primary)_18%,transparent)_0%,color-mix(in_srgb,var(--violet)_12%,transparent)_45%,transparent_72%)] blur-3xl" />

      <div className="animate-spin-slower absolute inset-[-2%] rounded-full border border-primary/8 [animation-duration:64s]">
        <span className="absolute left-1/2 top-0 h-1 w-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan/80 shadow-[0_0_12px_4px_color-mix(in_srgb,var(--cyan)_45%,transparent)]" />
        <span className="absolute bottom-[4%] right-[22%] h-1 w-1 rounded-full bg-violet/70 shadow-[0_0_10px_3px_color-mix(in_srgb,var(--violet)_40%,transparent)]" />
      </div>

      <div className="absolute inset-[1%] rounded-full border border-[var(--ring-border)] shadow-[inset_0_0_30px_color-mix(in_srgb,var(--primary)_8%,transparent)]" />

      <div className="animate-spin-slower absolute inset-[1%] rounded-full border border-dashed border-[var(--ring-border-dash)]">
        <span className="absolute left-1/2 top-0 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary shadow-[0_0_18px_6px_color-mix(in_srgb,var(--primary)_60%,transparent)]" />
        <span className="absolute bottom-[12%] right-[8%] h-1.5 w-1.5 rounded-full bg-cyan/90 shadow-[0_0_12px_4px_color-mix(in_srgb,var(--cyan)_55%,transparent)]" />
        <span className="absolute bottom-[30%] left-[2%] h-1 w-1 rounded-full bg-violet/80 shadow-[0_0_10px_3px_color-mix(in_srgb,var(--violet)_45%,transparent)]" />
      </div>

      <div className="animate-spin-slow absolute inset-[9%]">
        <div className="orbit-arc absolute inset-0" />
        <span className="absolute bottom-[6%] left-[14%] h-2 w-2 rounded-full bg-violet shadow-[0_0_18px_7px_color-mix(in_srgb,var(--violet)_55%,transparent)]" />
      </div>

      <div className="animate-spin-reverse absolute inset-[16%]">
        <div className="orbit-arc-alt absolute inset-0" />
        <span className="absolute right-[7%] top-[18%] h-1.5 w-1.5 rounded-full bg-cyan shadow-[0_0_16px_6px_color-mix(in_srgb,var(--cyan)_60%,transparent)]" />
        <span className="absolute bottom-[16%] left-[10%] h-1 w-1 rounded-full bg-primary/90 shadow-[0_0_10px_4px_color-mix(in_srgb,var(--primary)_50%,transparent)]" />
      </div>

      <div className="animate-spin-slow absolute inset-[23%] rounded-full border border-primary/10 [animation-duration:38s] [animation-direction:reverse]">
        <span className="absolute left-[10%] top-[50%] h-1 w-1 rounded-full bg-primary/80 shadow-[0_0_10px_3px_color-mix(in_srgb,var(--primary)_50%,transparent)]" />
        <span className="absolute right-[18%] top-[12%] h-1.5 w-1.5 rounded-full bg-violet/80 shadow-[0_0_12px_4px_color-mix(in_srgb,var(--violet)_45%,transparent)]" />
      </div>

      <div className="animate-spin-slower absolute inset-[29%] rounded-full border border-dashed border-cyan/10 [animation-duration:52s] [animation-direction:reverse]" />

      <div className="animate-pulse-glow absolute inset-[28%] rounded-full border border-primary/15 shadow-[0_0_70px_color-mix(in_srgb,var(--primary)_18%,transparent),inset_0_0_55px_color-mix(in_srgb,var(--violet)_14%,transparent)]" />
    </div>
  )
}
