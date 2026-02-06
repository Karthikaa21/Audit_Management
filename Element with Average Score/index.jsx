import { kf } from './../sdk/index.js'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import styles from './styles.module.css'

/* ---------------- helpers ---------------- */
const toDateOnly = (v) => {
    if (!v) return ''
    const s = String(v)
    return s.includes('T') ? s.split('T')[0] : s.slice(0, 10)
}
const normalizeEmail = (v) => String(v || '').trim().toLowerCase()
const isBetweenInclusive = (dateStr, startStr, endStr) => {
    const d = toDateOnly(dateStr)
    const s = toDateOnly(startStr)
    const e = toDateOnly(endStr)
    if (!d || !s || !e) return false
    return d >= s && d <= e
}
const safeGetVar = async (name) => {
    try {
        if (kf?.app?.getVariable) return await Promise.resolve(kf.app.getVariable(name))
    } catch (e) {}
    try {
        if (kf?.app?.page?.getVariable) return await Promise.resolve(kf.app.page.getVariable(name))
    } catch (e) {}
    return ''
}
const fetchAllAuditItems = async (accId) => {
    const url =
        `/process/2/${accId}/admin/Audit_Process_Management_A00/item?` +
        `page_number=1&page_size=1000000000000000&apply_preference=1`
    const res = await kf.api(url)
    return Array.isArray(res?.Data) ? res.Data : []
}
const fetchAuditDetail = async (accId, instanceId) => {
    const url = `/process/2/${accId}/admin/Audit_Process_Management_A00/${instanceId}`
    const res = await kf.api(url)
    return res?.data || res
}
const mapWithConcurrency = async (items, limit, mapper) => {
    const results = new Array(items.length)
    let i = 0
    const runners = new Array(Math.min(limit, items.length)).fill(null).map(async () => {
        while (i < items.length) {
            const idx = i++
            results[idx] = await mapper(items[idx], idx)
        }
    })
    await Promise.all(runners)
    return results
}

/* ---------------- Modal ---------------- */
function Modal({ open, title, onClose, children }) {
    if (!open) return null

    const overlay = {
        position: 'fixed',
        inset: 0,
        background: 'rgba(15, 23, 42, 0.35)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 14,
        zIndex: 99999,
    }

    const card = {
        width: 'min(820px, 96vw)',
        maxHeight: '78vh',
        background: '#fff',
        borderRadius: 14,
        border: '1px solid rgba(124, 58, 237, 0.16)',
        boxShadow: '0 22px 70px rgba(2, 6, 23, 0.22)',
        overflow: 'hidden',
    }

    const header = {
        padding: '10px 12px',
        background: 'linear-gradient(180deg, rgba(124,58,237,0.10), rgba(124,58,237,0.04))',
        borderBottom: '1px solid rgba(124, 58, 237, 0.14)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 10,
    }

    const closeBtn = {
        width: 30,
        height: 30,
        borderRadius: 10,
        border: '1px solid rgba(124, 58, 237, 0.16)',
        background: '#fff',
        cursor: 'pointer',
        display: 'grid',
        placeItems: 'center',
        fontWeight: 900,
        color: '#4c1d95',
        lineHeight: '1',
        fontSize: 14,
    }

    return (
        <div
            style={overlay}
            onClick={(e) => {
                if (e.target === e.currentTarget) onClose()
            }}
        >
            <div style={card}>
                <div style={header}>
                    <div
                        style={{
                            fontSize: 13,
                            fontWeight: 900,
                            color: '#4c1d95',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            maxWidth: 'calc(100% - 44px)',
                        }}
                    >
                        {title}
                    </div>
                    <button style={closeBtn} onClick={onClose} aria-label="Close">
                        ✕
                    </button>
                </div>

                <div style={{ padding: 12, overflow: 'auto', maxHeight: 'calc(78vh - 44px)' }}>
                    {children}
                </div>
            </div>
        </div>
    )
}

/* ---------------- Component ---------------- */
export function DefaultLandingComponent() {
    const [rows, setRows] = useState([]) // { element, average, sources: [{auditId,auditDate,score}] }
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [selected, setSelected] = useState(null)
    const [query, setQuery] = useState('')

    const lastInputsRef = useRef({ site: '', start: '', end: '', email: '' })

    useEffect(() => {
        kf.context.watchParams(function (data) {
            console.log('watch params data', data)
        }, [])
    }, [])

    const loadElementAverages = async () => {
        setLoading(true)
        setError('')

        try {
            const accId = kf?.account?._id
            if (!accId) throw new Error('kf.account._id not found')

            const siteName = String((await safeGetVar('AAD_Site_Name')) || '').trim()
            const startDate = toDateOnly(await safeGetVar('AAD_Start_Date'))
            const endDate = toDateOnly(await safeGetVar('AAD_End_Date'))
            const userEmail = normalizeEmail(await safeGetVar('User_Email'))

            if (!siteName || !startDate || !endDate || !userEmail) {
                setRows([])
                return
            }

            // 1) list
            const allItems = await fetchAllAuditItems(accId)

            // 2) filter list
            const filtered = allItems.filter((it) => {
                const scheduled = toDateOnly(it?.Audit_Scheduled_Date)
                const site = String(it?.Site_Name || '').trim()

                const auditorEmail = normalizeEmail(it?.Auditor_email_id)
                const auditeeEmail = normalizeEmail(it?.Auditee_email_id)
                const deptHeadEmail =
                    normalizeEmail(it?.Department_Head_Email_ID) ||
                    normalizeEmail(it?.Department_Head?.Dep_head_Email)

                const emailMatch =
                    userEmail === auditorEmail ||
                    userEmail === auditeeEmail ||
                    userEmail === deptHeadEmail

                return site === siteName && isBetweenInclusive(scheduled, startDate, endDate) && emailMatch
            })

            // list instance id -> listItem (FIRST URL)
            const listById = new Map()
            for (const it of filtered) {
                const id = it?._id || it?.Instance_ID || it?.instance_id || it?.id
                if (id) listById.set(id, it)
            }

            const instanceIds = Array.from(listById.keys())
            if (instanceIds.length === 0) {
                setRows([])
                return
            }

            // 3) details
            const details = await mapWithConcurrency(instanceIds, 10, async (id) => {
                try {
                    const detail = await fetchAuditDetail(accId, id)
                    return { id, detail }
                } catch (e) {
                    console.log('detail fetch failed', id, e)
                    return { id, detail: null }
                }
            })

            // 4) aggregate
            const agg = new Map()
            for (const item of details) {
                if (!item?.detail) continue

                const instanceId = item.id
                const d = item.detail
                const listItem = listById.get(instanceId) || {}

                const table =
                    d['Table::Untitled_Table'] ||
                    d['Table::untitled_table'] ||
                    d['Untitled_Table'] ||
                    []

                if (!Array.isArray(table)) continue

                for (const r of table) {
                    const element = String(r?.Element || r?.element || '').trim()
                    if (!element) continue

                    const scoreRaw = r?.Rating_in_Number ?? r?.rating_in_number
                    const score = typeof scoreRaw === 'number' ? scoreRaw : Number(scoreRaw)
                    if (!Number.isFinite(score)) continue

                    const curr = agg.get(element) || { sum: 0, count: 0, sources: [] }
                    curr.sum += score
                    curr.count += 1

                    const auditIdFromList =
                        listItem?.Audit_ID ||
                        listItem?.Audit_id ||
                        listItem?.AuditId ||
                        listItem?.AUDIT_ID ||
                        listItem?._id ||
                        instanceId

                    const auditDate = toDateOnly(listItem?.Audit_Scheduled_Date || d?.Audit_Scheduled_Date)

                    curr.sources.push({ auditId: auditIdFromList, auditDate, score })
                    agg.set(element, curr)
                }
            }

            const out = Array.from(agg.entries())
                .map(([element, v]) => ({
                    element,
                    average: v.count ? v.sum / v.count : 0,
                    sources: v.sources,
                }))
                .sort((a, b) => b.average - a.average)

            setRows(out)
        } catch (e) {
            setError(e?.message || String(e))
        } finally {
            setLoading(false)
        }
    }

    // ✅ auto refresh (no UI)
    useEffect(() => {
        let mounted = true

        const tick = async () => {
            if (!mounted) return

            const siteName = String((await safeGetVar('AAD_Site_Name')) || '').trim()
            const startDate = toDateOnly(await safeGetVar('AAD_Start_Date'))
            const endDate = toDateOnly(await safeGetVar('AAD_End_Date'))
            const userEmail = normalizeEmail(await safeGetVar('User_Email'))

            const last = lastInputsRef.current
            const changed =
                last.site !== siteName ||
                last.start !== startDate ||
                last.end !== endDate ||
                last.email !== userEmail

            if (changed) {
                lastInputsRef.current = { site: siteName, start: startDate, end: endDate, email: userEmail }
                await loadElementAverages()
            }
        }

        const interval = setInterval(tick, 2000)
        tick()

        return () => {
            mounted = false
            clearInterval(interval)
        }
    }, [])

    /* ---------------- UI ---------------- */
    const theme = {
        bg: '#ffffff',
        text: '#0f172a',
        muted: '#64748b',
        line: 'rgba(2, 6, 23, 0.08)',
        purpleDeep: '#4c1d95',
        lavender: 'rgba(124, 58, 237, 0.06)',
        border: 'rgba(124, 58, 237, 0.14)',
        shadow: '0 14px 50px rgba(2, 6, 23, 0.06)',
    }

    // ✅ occupy full width of parent; shrink naturally
    const page = {
        width: '100%',
        maxWidth: '100%',
        padding: 12,
        background: theme.bg,
        overflow: 'hidden',
    }

    const searchWrap = {
        width: '100%',
        maxWidth: 520,
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '10px 12px',
        borderRadius: 12,
        border: `1px solid ${theme.border}`,
        background: '#ffffff', // ✅ solid white
        boxShadow: '0 10px 26px rgba(2, 6, 23, 0.04)',
    }

    const searchInput = {
        width: '100%',
        border: 'none',
        outline: 'none',
        fontSize: 13,
        fontWeight: 650,
        color: theme.text,
        background: '#ffffff', // ✅ solid white
    }

    const card = {
        marginTop: 12,
        borderRadius: 16,
        border: `1px solid ${theme.border}`,
        background: '#fff',
        boxShadow: theme.shadow,
        overflow: 'hidden',
        width: '100%',
    }

    // ✅ only table scrolls
    const tableWrap = {
        maxHeight: 'calc(100vh - 120px)',
        overflowY: 'auto',
        overflowX: 'auto',
    }

    const th = {
        position: 'sticky',
        top: 0,
        background: '#fff',
        zIndex: 1,
        textAlign: 'left',
        padding: '12px 14px',
        fontSize: 11,
        color: theme.muted,
        fontWeight: 900,
        letterSpacing: '0.06em',
        textTransform: 'uppercase',
        borderBottom: `1px solid ${theme.line}`,
        whiteSpace: 'nowrap',
    }

    const thRight = { ...th, textAlign: 'right' }

    const tdEl = {
        padding: '14px 14px',
        borderBottom: `1px solid ${theme.line}`,
        color: theme.text,
        fontWeight: 750,
        fontSize: 14,
    }

    const tdScore = {
        padding: '14px 14px',
        borderBottom: `1px solid ${theme.line}`,
        textAlign: 'right',
        fontWeight: 900,
        color: theme.purpleDeep,
        fontSize: 14,
        fontVariantNumeric: 'tabular-nums',
    }

    const filteredRows = useMemo(() => {
        const q = query.trim().toLowerCase()
        if (!q) return rows
        return rows.filter((r) => String(r.element || '').toLowerCase().includes(q))
    }, [rows, query])

    return (
        <div
            className={styles.landingHero}
            style={{
                background: '#ffffff', // ✅ force white even if root css is dark
                width: '100%',
                minHeight: '100vh',
                overflow: 'hidden',
            }}
        >
            <div className={styles.mainDiv} style={page}>
                {/* Search only */}
                <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-start' }}>
                    <div style={searchWrap}>
                        <span style={{ color: theme.muted, fontSize: 14 }}>⌕</span>
                        <input
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Search table"
                            style={searchInput}
                        />
                    </div>
                </div>

                {/* Error (only if needed) */}
                {error ? (
                    <div
                        style={{
                            marginTop: 10,
                            padding: 12,
                            borderRadius: 14,
                            border: '1px solid rgba(239, 68, 68, 0.20)',
                            background: 'rgba(239, 68, 68, 0.05)',
                            color: '#991b1b',
                            fontSize: 12,
                            fontWeight: 800,
                        }}
                    >
                        {error}
                    </div>
                ) : null}

                {/* Table only */}
                <div style={card}>
                    <div style={tableWrap}>
                        {filteredRows.length === 0 ? (
                            <div style={{ padding: 16, color: theme.muted, fontWeight: 700, fontSize: 13 }}>
                                {loading ? 'Loading…' : 'No data found'}
                            </div>
                        ) : (
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr>
                                        <th style={th}>Element</th>
                                        <th style={thRight}>Average Score</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredRows.map((r, idx) => (
                                        <tr
                                            key={r.element}
                                            onClick={() => setSelected(r)}
                                            style={{
                                                cursor: 'pointer',
                                                background: idx % 2 === 0 ? '#fff' : theme.lavender,
                                                transition: 'background 120ms ease',
                                            }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.background = 'rgba(124,58,237,0.08)'
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.background = idx % 2 === 0 ? '#fff' : theme.lavender
                                            }}
                                        >
                                            <td style={tdEl}>{r.element}</td>
                                            <td style={tdScore}>{Number(r.average).toFixed(2)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>

                {/* Popup modal */}
                <Modal open={!!selected} title={selected ? selected.element : ''} onClose={() => setSelected(null)}>
                    {!selected ? null : (
                        <div
                            style={{
                                borderRadius: 14,
                                border: `1px solid ${theme.border}`,
                                overflow: 'hidden',
                            }}
                        >
                            <div style={{ overflowX: 'auto', maxHeight: '62vh', overflowY: 'auto' }}>
                                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                    <thead>
                                        <tr>
                                            <th style={th}>Audit ID</th>
                                            <th style={th}>Audit Date</th>
                                            <th style={thRight}>Element Score</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {selected.sources.map((s, i) => (
                                            <tr
                                                key={`${s.auditId}-${i}`}
                                                style={{
                                                    background: i % 2 === 0 ? '#fff' : theme.lavender,
                                                }}
                                            >
                                                <td
                                                    style={{
                                                        padding: '12px 14px',
                                                        borderBottom: `1px solid ${theme.line}`,
                                                        fontWeight: 800,
                                                        color: theme.text,
                                                        whiteSpace: 'nowrap',
                                                        fontSize: 13,
                                                    }}
                                                >
                                                    {s.auditId || '-'}
                                                </td>
                                                <td
                                                    style={{
                                                        padding: '12px 14px',
                                                        borderBottom: `1px solid ${theme.line}`,
                                                        color: theme.text,
                                                        whiteSpace: 'nowrap',
                                                        fontWeight: 700,
                                                        fontSize: 13,
                                                    }}
                                                >
                                                    {s.auditDate || '-'}
                                                </td>
                                                <td
                                                    style={{
                                                        padding: '12px 14px',
                                                        borderBottom: `1px solid ${theme.line}`,
                                                        textAlign: 'right',
                                                        fontWeight: 950,
                                                        color: theme.purpleDeep,
                                                        fontVariantNumeric: 'tabular-nums',
                                                        fontSize: 13,
                                                    }}
                                                >
                                                    {Number(s.score).toFixed(2)}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </Modal>
            </div>
        </div>
    )
}
export default DefaultLandingComponent;
