import { useState } from 'react'
import type { ProjectView } from '../../types/projects'
import styles from './project.module.css'
import { useTranslations } from '../../utils/i18n'
import { IconExternalLink } from '@tabler/icons-react'

interface Props {
  locale: 'es' | 'en'
  project: ProjectView
}

export default function ProjectPage({ locale, project }: Props) {
  const t = useTranslations(locale)

  const [activeImage, setActiveImage] = useState<string | null>(null)

  // Cloudinary auto-optimization: inject f_auto,q_auto,w_1400 into upload URL
  const optimizedCover = project.coverImage?.replace(
    '/upload/',
    '/upload/f_auto,q_auto,w_1400/'
  )

  const metaItems = [
    { label: t('project.year'), value: project.year.toString() },
    { label: t('project.duration'), value: project.duration },
    { label: t('project.industry'), value: project.industry },
    { label: t('project.country'), value: project.country },
  ]

  return (
    <div
      style={{
        fontFamily: "'Space Grotesk', sans-serif",
        background: '#0a0a0a',
        color: '#fff',
      }}>
      {/* ── HERO ── */}
      <section>
        <div className={styles.heroSection}>
          {optimizedCover ? (
            <img
              src={optimizedCover}
              alt={`Proyecto ${project.name}`}
              width={1400}
              height={910}
              loading='eager'
              decoding='async'
              fetchPriority='high'
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          ) : (
            <div
              style={{ width: '100%', height: '100%', background: '#161616' }}
            />
          )}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background:
                'linear-gradient(to bottom, rgba(10,10,10,0.2) 0%, rgba(10,10,10,0.85) 100%)',
            }}
          />
          <div
            style={{
              position: 'absolute',
              top: '2rem',
              left: '2.5rem',
              display: 'flex',
              gap: '0.5rem',
            }}>
            <span
              style={{
                background: '#E8A020',
                color: '#000',
                fontSize: '0.75rem',
                fontWeight: 700,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                padding: '0.35rem 0.9rem',
                borderRadius: '999px',
              }}>
              {project.category}
            </span>
            <span
              style={{
                border: '1px solid rgba(255,255,255,0.3)',
                color: '#fff',
                fontSize: '0.75rem',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                padding: '0.35rem 0.9rem',
                borderRadius: '999px',
              }}>
              {project.industry}
            </span>
          </div>
          <div
            style={{
              position: 'absolute',
              bottom: '2.5rem',
              left: '2.5rem',
              right: '2.5rem',
            }}>
            <h1
              style={{
                fontSize: 'clamp(2rem, 7vw, 6.5rem)',
                lineHeight: 0.95,
                letterSpacing: '0.02em',
                marginBottom: '0.75rem',
              }}>
              {project.name}
            </h1>
            <p
              style={{
                fontSize: 'clamp(0.875rem, 1.5vw, 1.05rem)',
                color: 'rgba(255,255,255,0.65)',
                maxWidth: '520px',
              }}>
              {project.overview.short}
            </p>
          </div>
        </div>
      </section>

      {/* ── META ROW ── */}
      <section className={styles.metaRow}>
        {metaItems.map(item => (
          <div
            key={item.label}
            style={{ padding: '1.5rem 2rem', background: '#0a0a0a' }}>
            <p
              style={{
                fontSize: '0.75rem',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: '#E8A020',
                marginBottom: '0.4rem',
              }}>
              {item.label}
            </p>
            <p style={{ fontSize: '0.95rem', fontWeight: 500, color: '#fff' }}>
              {item.value}
            </p>
          </div>
        ))}
      </section>

      {/* ── OVERVIEW ── */}
      <section
        style={{
          padding: '5rem 2.5rem',
          maxWidth: '1100px',
          margin: '0 auto',
        }}>
        <div className={styles.overviewGrid}>
          <div>
            <p
              style={{
                fontSize: '0.75rem',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: '#E8A020',
                marginBottom: '1rem',
              }}>
              {t('project.overview.label')}
            </p>
            <h2
              style={{
                fontSize: 'clamp(1.5rem, 3.5vw, 3.2rem)',
                lineHeight: 1.1,
                letterSpacing: '0.03em',
              }}>
              {t('project.overview.title')}
            </h2>
            {project.website && (
              <a
                href={project.website}
                target='_blank'
                rel='noopener noreferrer'
                className='btn outline'
                style={{ marginTop: '2rem', display: 'inline-flex' }}>
                {t('project.overview.cta')}
                <IconExternalLink stroke={2} />
              </a>
            )}
          </div>
          <p
            style={{
              fontSize: '1.1rem',
              lineHeight: 1.75,
              color: 'rgba(255,255,255,0.75)',
              paddingTop: '2.5rem',
            }}>
            {project.overview.medium}
          </p>
        </div>
      </section>

      {/* ── RETO Y SOLUCIÓN ── */}
      <section
        style={{
          padding: '4rem 2.5rem',
          background: 'rgba(255,255,255,0.02)',
          borderTop: '1px solid rgba(255,255,255,0.06)',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
        }}>
        <div
          style={{ maxWidth: '1100px', margin: '0 auto' }}
          className={styles.grid2col}>
          <div>
            <h3
              style={{
                fontSize: 'clamp(1.25rem, 2.5vw, 2rem)',
                marginBottom: '1.25rem',
                letterSpacing: '0.02em',
              }}>
              {t('project.challenge.label')}
            </h3>
            <p
              style={{
                fontSize: '1rem',
                lineHeight: 1.8,
                color: 'rgba(255,255,255,0.65)',
              }}>
              {project.challenge.description}
            </p>
          </div>
          <div>
            <h3
              style={{
                fontSize: 'clamp(1.25rem, 2.5vw, 2rem)',
                marginBottom: '1.25rem',
                letterSpacing: '0.02em',
              }}>
              {t('project.solution.label')}
            </h3>
            <p
              style={{
                fontSize: '1rem',
                lineHeight: 1.8,
                color: 'rgba(255,255,255,0.65)',
              }}>
              {project.solution.description}
            </p>
          </div>
        </div>
      </section>

      {/* ── FEATURES & RESPONSABILIDADES ── */}
      <section
        style={{
          padding: '5rem 2.5rem',
          maxWidth: '1100px',
          margin: '0 auto',
        }}>
        <div className={styles.grid2col}>
          <div>
            <p
              style={{
                fontSize: '0.75rem',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: '#E8A020',
                marginBottom: '1.5rem',
              }}>
              {t('project.features.label')}
            </p>
            <ul
              style={{
                listStyle: 'none',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
              }}>
              {project.features.map(f => (
                <li
                  key={f}
                  style={{
                    padding: '0.75rem 0',
                    borderBottom: '1px solid rgba(255,255,255,0.08)',
                    fontSize: '1rem',
                    color: 'rgba(255,255,255,0.75)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                  }}>
                  <span
                    style={{
                      width: '6px',
                      height: '6px',
                      background: '#E8A020',
                      borderRadius: '50%',
                      flexShrink: 0,
                    }}
                  />
                  {f}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p
              style={{
                fontSize: '0.75rem',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: '#E8A020',
                marginBottom: '1.5rem',
              }}>
              {t('project.responsibilities.label')}
            </p>
            <ul
              style={{
                listStyle: 'none',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
              }}>
              {project.responsibilities.map(r => (
                <li
                  key={r}
                  style={{
                    padding: '0.75rem 0',
                    borderBottom: '1px solid rgba(255,255,255,0.08)',
                    fontSize: '1rem',
                    color: 'rgba(255,255,255,0.75)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                  }}>
                  <span
                    style={{
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      border: '1px solid #E8A020',
                      flexShrink: 0,
                    }}
                  />
                  {r}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── TECH STACK & TAGS ── */}
      <section
        style={{
          padding: '3rem 2.5rem',
          maxWidth: '1100px',
          margin: '0 auto',
          borderTop: '1px solid rgba(255,255,255,0.06)',
        }}>
        <div className={styles.grid2col}>
          <div>
            <p
              style={{
                fontSize: '0.75rem',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: '#E8A020',
                marginBottom: '1.5rem',
              }}>
              Tech Stack
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {project.techStack.map(t => (
                <span
                  key={t}
                  style={{
                    padding: '0.4rem 0.9rem',
                    border: '1px solid rgba(255,255,255,0.15)',
                    borderRadius: '999px',
                    fontSize: '0.85rem',
                    color: 'rgba(255,255,255,0.65)',
                  }}>
                  {t}
                </span>
              ))}
            </div>
          </div>
          <div>
            <p
              style={{
                fontSize: '0.75rem',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: '#E8A020',
                marginBottom: '1.5rem',
              }}>
              Tags
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {project.tags.map(tag => (
                <span
                  key={tag}
                  style={{
                    padding: '0.4rem 0.9rem',
                    background: 'rgba(232,160,32,0.1)',
                    border: '1px solid rgba(232,160,32,0.25)',
                    borderRadius: '999px',
                    fontSize: '0.85rem',
                    color: '#E8A020',
                  }}>
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section
        style={{
          padding: '5rem 2.5rem',
          borderTop: '1px solid rgba(255,255,255,0.06)',
          textAlign: 'center',
        }}>
        <h2
          style={{
            fontSize: 'clamp(1.75rem, 6vw, 5rem)',
            marginBottom: '1.25rem',
            letterSpacing: '0.02em',
          }}>
          {t('project.cta.title')}
        </h2>
        <p
          style={{
            color: 'rgba(255,255,255,0.5)',
            fontSize: '1rem',
            marginBottom: '2.5rem',
          }}>
          {t('project.cta.subtitle')}
        </p>
        <div
          style={{
            display: 'flex',
            gap: '1rem',
            justifyContent: 'center',
            flexWrap: 'wrap',
          }}>
          <a href='https://wa.link/63go9c' className='btn primary'>
            {t('project.cta.contact')}
          </a>
          <a href={`/${locale}?section=projects`} className='btn outline'>
            {t('project.cta.more')}
          </a>
        </div>
      </section>

      {/* ── LIGHTBOX ── */}
      {activeImage && (
        <div
          onClick={() => setActiveImage(null)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.92)',
            zIndex: 999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'zoom-out',
          }}>
          <img
            src={activeImage}
            alt='Vista ampliada'
            style={{
              maxWidth: '90vw',
              maxHeight: '90vh',
              objectFit: 'contain',
              borderRadius: '8px',
            }}
          />
        </div>
      )}
    </div>
  )
}
