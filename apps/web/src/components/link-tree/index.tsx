import {
  IconBrandGithub,
  IconBrandInstagram,
  IconBrandTiktok,
  IconWorldWww,
} from '@tabler/icons-react'
import { linkTree, type LinkTreeIcon } from '../../data/link-tree'
import styles from './link-tree.module.css'

// Importar solo los iconos usados: `import * as` metía la librería entera (~2,8 MB) en el bundle
const icons: Record<LinkTreeIcon, typeof IconWorldWww> = {
  IconBrandInstagram,
  IconBrandGithub,
  IconBrandTiktok,
  IconWorldWww,
}

const data = linkTree[0]

export default function LinkTree() {
  return (
    <div className={styles.linkTree}>
      <div className={styles.linkTreeButtons}>
        {data.social.map(item => {
          const Icon = icons[item.icon]
          return (
            <a
              key={item.name}
              href={item.url}
              target='_blank'
              rel='noopener noreferrer'
              className='btn outline font-primary'>
              <Icon stroke={2} size={20} />
              <span>{item.name}</span>
            </a>
          )
        })}
      </div>
    </div>
  )
}
