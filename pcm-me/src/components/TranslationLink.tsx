'use client'
import React, { useCallback, useEffect, useState } from 'react'
import { useDocumentInfo, useField, useFormFields } from '@payloadcms/ui'

type Sibling = {
  id: string
  locale?: string
  title?: string
  name?: string
  slug?: string
  translationGroupId?: string
}

const btn: React.CSSProperties = {
  marginTop: 6,
  padding: '4px 10px',
  cursor: 'pointer',
  border: '1px solid var(--theme-elevation-250)',
  borderRadius: 4,
  background: 'var(--theme-elevation-50)',
}
const input: React.CSSProperties = {
  width: '100%',
  padding: 5,
  marginBottom: 4,
  boxSizing: 'border-box',
  border: '1px solid var(--theme-elevation-250)',
  borderRadius: 4,
}

/**
 * Sidebar admin control for translation linking (see fields/translationLink.ts).
 */
export const TranslationLink: React.FC = () => {
  const docInfo = useDocumentInfo() as { id?: string | number; collectionSlug?: string }
  const id = docInfo?.id
  const collectionSlug = docInfo?.collectionSlug
  const locale = useFormFields(([fields]) => fields?.locale?.value as string | undefined)
  const { value: tgid, setValue: setTgid } = useField<string>({ path: 'translationGroupId' })

  const [siblings, setSiblings] = useState<Sibling[]>([])
  const [loading, setLoading] = useState(false)
  const [targetId, setTargetId] = useState('')
  const [message, setMessage] = useState('')

  const loadSiblings = useCallback(async () => {
    if (!tgid || !collectionSlug) {
      setSiblings([])
      return
    }
    setLoading(true)
    try {
      const res = await fetch(
        `/api/${collectionSlug}?where[translationGroupId][equals]=${encodeURIComponent(
          String(tgid),
        )}&depth=0&limit=20`,
        { credentials: 'include' },
      )
      const data = await res.json()
      const docs: Sibling[] = (data?.docs || []).filter(
        (d: Sibling) => String(d.id) !== String(id),
      )
      setSiblings(docs)
    } catch {
      /* ignore network errors in the panel */
    }
    setLoading(false)
  }, [tgid, collectionSlug, id])

  useEffect(() => {
    void loadSiblings()
  }, [loadSiblings])

  const linkTo = async () => {
    setMessage('')
    const tid = targetId.trim()
    if (!tid || !collectionSlug) return
    try {
      const res = await fetch(`/api/${collectionSlug}/${tid}?depth=0`, { credentials: 'include' })
      if (!res.ok) {
        setMessage('Could not find that item.')
        return
      }
      const target: Sibling = await res.json()
      if (String(target.id) === String(id)) {
        setMessage('Cannot link an item to itself.')
        return
      }
      if (target.locale && locale && target.locale === locale) {
        setMessage('Target is in the same locale; a translation must be cross-locale.')
        return
      }
      if (!target.translationGroupId) {
        setMessage('Target has no translation group.')
        return
      }
      setTgid(String(target.translationGroupId))
      setMessage('Linked — click Save to apply.')
    } catch {
      setMessage('Link failed.')
    }
  }

  const unlink = () => {
    setTgid(crypto.randomUUID())
    setMessage('Unlinked — click Save to apply.')
  }

  if (!id) {
    return (
      <div style={{ fontSize: 13 }}>
        <strong>Translation link</strong>
        <div style={{ color: 'var(--theme-elevation-500)', marginTop: 4 }}>
          Save this item first to manage its translation link.
        </div>
      </div>
    )
  }

  return (
    <div style={{ fontSize: 13, lineHeight: 1.5 }}>
      <strong>Translation link</strong>
      <div style={{ margin: '4px 0', wordBreak: 'break-all' }}>
        This item ID: <code>{String(id)}</code>
      </div>
      {loading ? (
        <div>Loading…</div>
      ) : siblings.length > 0 ? (
        <div>
          <div>Linked translation(s):</div>
          <ul style={{ paddingInlineStart: 16, margin: '4px 0' }}>
            {siblings.map((s) => (
              <li key={s.id}>
                <a href={`/admin/collections/${collectionSlug}/${s.id}`}>
                  {s.title || s.name || s.slug || s.id} ({s.locale})
                </a>
              </li>
            ))}
          </ul>
          <button type="button" onClick={unlink} style={btn}>
            Unlink
          </button>
        </div>
      ) : (
        <div>
          <div style={{ margin: '4px 0', color: 'var(--theme-elevation-500)' }}>
            No linked translation in the other locale.
          </div>
          <input
            value={targetId}
            onChange={(e) => setTargetId(e.target.value)}
            placeholder="Other-locale item ID"
            style={input}
          />
          <button type="button" onClick={linkTo} style={btn}>
            Link
          </button>
        </div>
      )}
      {message && (
        <div style={{ marginTop: 6, color: 'var(--theme-success-500)' }}>{message}</div>
      )}
    </div>
  )
}
