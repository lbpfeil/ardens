import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Arden FVS',
    short_name: 'Arden',
    description: 'Gestão de qualidade na construção civil - Verificações de Serviços',
    start_url: '/app',
    display: 'standalone',
    background_color: '#1C1C1C',
    theme_color: '#3ECF8E',
    icons: [
      {
        src: '/icon.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/apple-icon.png',
        sizes: '180x180',
        type: 'image/png',
      },
    ],
  }
}
