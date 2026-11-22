import { Coffee, Code2, Server, Layers } from 'lucide-react'
import {
  SiApachemaven,
  SiDocker,
  SiGithub,
  SiHtml5,
  SiJavascript,
  SiLaravel,
  SiMysql,
  SiPhp,
  SiPostgresql,
  SiPostman,
  SiReact,
  SiSpring,
  SiSpringboot,
  SiSpringsecurity,
  SiSwagger,
  SiTailwindcss,
} from 'react-icons/si'
import { TbApi } from 'react-icons/tb'

const iconMap = {
  SiSpringboot,
  SiSpringsecurity,
  SiSpring,
  TbApi,
  SiPhp,
  SiLaravel,
  SiReact,
  SiJavascript,
  SiHtml5,
  SiTailwindcss,
  SiMysql,
  SiPostgresql,
  SiGithub,
  SiDocker,
  SiApachemaven,
  SiPostman,
  SiSwagger,
  SiCss3: Code2,
  SiJava: Coffee,
  server: Server,
  layers: Layers,
  api: TbApi,
}

export function getTechIcon(name) {
  if (!name) return null
  return iconMap[name] || null
}
