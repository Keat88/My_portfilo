import * as Si from 'react-icons/si'
import { TbApi } from 'react-icons/tb'
import { Server, Layers } from 'lucide-react'

export function getTechIcon(name) {
  if (!name) return null
  if (name === 'TbApi') return TbApi
  if (name === 'server') return Server
  if (name === 'layers') return Layers
  if (name === 'api') return TbApi
  return Si[name] || null
}
