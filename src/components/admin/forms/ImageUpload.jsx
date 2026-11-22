import { useRef, useState } from 'react'
import { ImagePlus, X } from 'lucide-react'
import { cn } from '../../../utils/cn'

export default function ImageUpload({ label = 'Thumbnail', value, onChange, hint }) {
  const inputRef = useRef(null)
  const [drag, setDrag] = useState(false)

  const handleFile = (file) => {
    if (!file || !file.type.startsWith('image/')) return
    const reader = new FileReader()
    reader.onload = () => onChange({ file, preview: reader.result, name: file.name })
    reader.readAsDataURL(file)
  }

  return (
    <div className="space-y-1.5">
      {label && <p className="text-sm font-medium text-[var(--text-soft)]">{label}</p>}
      <div
        onDragOver={(e) => { e.preventDefault(); setDrag(true) }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => { e.preventDefault(); setDrag(false); handleFile(e.dataTransfer.files?.[0]) }}
        className={cn('relative overflow-hidden rounded-xl border border-dashed p-4 transition', drag ? 'border-primary/50 bg-primary/5' : 'border-white/15 bg-white/[0.02]')}
      >
        {value?.preview ? (
          <div className="relative">
            <img src={value.preview} alt="Preview" className="h-40 w-full rounded-lg object-cover" />
            <button type="button" onClick={() => onChange(null)} className="absolute right-2 top-2 grid h-8 w-8 place-items-center rounded-lg bg-black/60 text-white hover:bg-black/80" aria-label="Remove image">
              <X className="h-4 w-4" />
            </button>
            <p className="mt-2 truncate text-xs text-muted">{value.name || 'Selected image'}</p>
          </div>
        ) : (
          <button type="button" onClick={() => inputRef.current?.click()} className="flex w-full flex-col items-center justify-center gap-2 py-6 text-center text-muted hover:text-ink">
            <span className="grid h-11 w-11 place-items-center rounded-xl border border-white/10 bg-white/5 text-primary"><ImagePlus className="h-5 w-5" /></span>
            <span className="text-sm"><span className="font-medium text-ink">Click to upload</span> or drag and drop</span>
            <span className="text-xs text-muted/70">PNG, JPG, WEBP</span>
          </button>
        )}
        <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleFile(e.target.files?.[0])} />
      </div>
      {hint && <p className="text-xs text-muted">{hint}</p>}
    </div>
  )
}
