import * as TablerIcons from '@tabler/icons-react'
import { linkTree } from '../../data/link-tree'
import styles from './link-tree.module.css'

const data = linkTree[0]

type TablerIconName = keyof typeof TablerIcons

export default function LinkTree() {
  return (
    <div className={styles.linkTree}>
      <div className={styles.linkTreeButtons}>
        {data.social.map(item => {
          const Icon = TablerIcons[
            item.icon as TablerIconName
          ] as React.ElementType
          return (
            <a
              key={item.name}
              href={item.url}
              target='_blank'
              rel='noopener noreferrer'
              className='btn outline font-primary'>
              {Icon && <Icon stroke={2} size={20} />}
              <span>{item.name}</span>
            </a>
          )
        })}
      </div>
    </div>
  )
}
