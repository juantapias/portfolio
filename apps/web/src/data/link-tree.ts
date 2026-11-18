// src/data/link-tree.ts

/** Iconos disponibles (ver el mapa en components/link-tree). */
export type LinkTreeIcon =
  | 'IconBrandInstagram'
  | 'IconBrandGithub'
  | 'IconBrandTiktok'
  | 'IconWorldWww'

interface LinkTreeData {
  userName: string
  social: { name: string; url: string; icon: LinkTreeIcon }[]
}

export const linkTree: LinkTreeData[] = [
  {
    userName: 'tapias.dev',
    social: [
      {
        name: 'Instagram',
        url: 'https://www.instagram.com/tapias.dev/',
        icon: 'IconBrandInstagram',
      },
      {
        name: 'GitHub',
        url: 'https://github.com/juantapias',
        icon: 'IconBrandGithub',
      },
      {
        name: 'TikTok',
        url: 'https://www.tiktok.com/@tapias.dev/',
        icon: 'IconBrandTiktok',
      },
      { name: 'Website', url: 'https://juantapias.dev', icon: 'IconWorldWww' },
    ],
  },
]
