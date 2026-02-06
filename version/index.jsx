// // // // //-----=====================-------------------------------------------------- */
// // // import React, { useEffect, useMemo, useRef, useState } from "react";
// // // import { kf } from "./../sdk/index.js";

// // // /* ===================== CONSTANT LIGHT THEME (NO DARK / NO TRANSPARENT BG) ===================== */
// // // const UI = {
// // //   bg: "#F3F4F6",
// // //   surface: "#FFFFFF",
// // //   border: "#E5E7EB",
// // //   text: "#111827",
// // //   muted: "#6B7280",
// // //   tintA: "#EEF2FF",
// // //   tintB: "#F5F3FF",
// // //   tintC: "#ECFDF5",
// // //   accent: "#2563EB",
// // //   accent2: "#7C3AED",
// // //   danger: "#B91C1C",
// // // };

// // // const FLOW_ID = "Version_Master_A00";
// // // const APP_ID = "Ac9Pds4TaXkR";
// // // const LIST_PAGE_SIZE = 100000;

// // // const delay = (ms) => new Promise((r) => setTimeout(r, ms));

// // // const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
// // // const fmtDate = (ymd) => {
// // //   if (!ymd) return "—";
// // //   const d = new Date(ymd);
// // //   if (Number.isNaN(d.getTime())) return String(ymd);
// // //   return `${d.getDate()} ${monthNames[d.getMonth()]} ${d.getFullYear()}`;
// // // };

// // // const safeUserName = (u) => u?.Name || u?.DisplayName || u?.Email || "—";

// // // const fmtVersion = (v) => {
// // //   if (v == null || v === "") return "V—";
// // //   const s = String(v).trim();
// // //   const m = s.match(/^v\s*(\d+)$/i);
// // //   if (m?.[1]) return `V${m[1]}`;
// // //   const n = Number(s);
// // //   if (!Number.isNaN(n) && Number.isFinite(n)) return `V${String(n)}`;
// // //   return s.toUpperCase().startsWith("V") ? s.toUpperCase() : `V${s}`;
// // // };

// // // const chipStyle = (bg, fg, border) => ({
// // //   display: "inline-flex",
// // //   alignItems: "center",
// // //   padding: "2px 10px",
// // //   borderRadius: 999,
// // //   fontSize: 11,
// // //   fontWeight: 800,
// // //   backgroundColor: bg,
// // //   color: fg,
// // //   WebkitTextFillColor: fg,
// // //   border: `1px solid ${border}`,
// // //   whiteSpace: "nowrap",
// // // });

// // // const cardShadow = "0 8px 18px rgba(17, 24, 39, 0.06)";

// // // const buildListUrl = ({ accId, withAccount }) => {
// // //   const qs = `visited=1&page_number=1&page_size=${LIST_PAGE_SIZE}`;
// // //   return withAccount ? `/form/2/${accId}/${FLOW_ID}/list?${qs}` : `/form/2/${APP_ID}/${FLOW_ID}/list?${qs}`;
// // // };

// // // const buildDetailUrls = ({ accId, rowId }) => [
// // //   `/form/2/${accId}/${FLOW_ID}/${rowId}`,
// // //   `/form/2/${APP_ID}/${FLOW_ID}/${rowId}`,
// // //   `/form/2/${accId}/${APP_ID}/${FLOW_ID}/${rowId}`,
// // // ];

// // // async function kfApiTryMany(urls) {
// // //   let lastErr = null;
// // //   for (const url of urls) {
// // //     try {
// // //       const res = await kf.api(url);
// // //       return { res, usedUrl: url };
// // //     } catch (e) {
// // //       lastErr = e;
// // //     }
// // //   }
// // //   throw lastErr;
// // // }

// // // /** Group list rows by Audit_ID */
// // // const buildAuditGroups = (rows = []) => {
// // //   const map = new Map();
// // //   rows.forEach((r) => {
// // //     const auditId = r?.Audit_ID || "—";
// // //     if (!map.has(auditId)) map.set(auditId, []);
// // //     map.get(auditId).push(r);
// // //   });

// // //   const audits = Array.from(map.entries()).map(([auditId, items]) => {
// // //     const sorted = [...items].sort((a, b) => {
// // //       const av = a?.Version ?? "";
// // //       const bv = b?.Version ?? "";
// // //       const an = Number(av);
// // //       const bn = Number(bv);
// // //       if (!Number.isNaN(an) && !Number.isNaN(bn)) return bn - an;
// // //       return String(bv).localeCompare(String(av));
// // //     });

// // //     const pick = (key) => sorted.find((x) => x?.[key] != null)?.[key];

// // //     return {
// // //       auditId,
// // //       siteName: pick("Site_Name") || "—",
// // //       auditType: pick("Audit_Type") || "—",
// // //       scheduledDate: pick("Audit_Scheduled_Date") || null,
// // //       auditor: pick("Auditor") || null,
// // //       auditee: pick("Auditee") || null,
// // //       deptHead: pick("Department_Head") || null,
// // //       versions: sorted.map((x) => ({
// // //         rowId: x?._id,
// // //         versionLabel: fmtVersion(x?.Version),
// // //         scheduledDate: x?.Audit_Scheduled_Date ?? null,
// // //         auditType: x?.Audit_Type ?? pick("Audit_Type") ?? "—",
// // //       })),
// // //       versionCount: sorted.length,
// // //     };
// // //   });

// // //   audits.sort((a, b) => {
// // //     const ad = a.scheduledDate ? new Date(a.scheduledDate).getTime() : -Infinity;
// // //     const bd = b.scheduledDate ? new Date(b.scheduledDate).getTime() : -Infinity;
// // //     if (bd !== ad) return bd - ad;
// // //     return String(a.auditId).localeCompare(String(b.auditId));
// // //   });

// // //   return audits;
// // // };

// // // const auditTypePill = (auditType) => {
// // //   const t = String(auditType || "").toLowerCase();
// // //   if (t.includes("annual")) return chipStyle("#DBEAFE", "#1D4ED8", "#93C5FD");
// // //   if (t.includes("qgmp")) return chipStyle("#DCFCE7", "#166534", "#86EFAC");
// // //   return chipStyle("#EDE9FE", "#5B21B6", "#C4B5FD");
// // // };

// // // /* ===================== FILTER DRAWER (SOLID BG) ===================== */
// // // function FilterDrawer({ open, onClose, availableSites, availableTypes, filters, setFilters }) {
// // //   if (!open) return null;

// // //   const overlay = {
// // //     position: "fixed",
// // //     inset: 0,
// // //     zIndex: 99999,
// // //     display: "flex",
// // //     justifyContent: "flex-end",
// // //     background: UI.bg, // solid
// // //     overflow: "hidden",
// // //   };

// // //   const panel = {
// // //     width: 360,
// // //     maxWidth: "92vw",
// // //     height: "100%",
// // //     background: UI.surface,
// // //     borderLeft: `1px solid ${UI.border}`,
// // //     boxShadow: "0 18px 48px rgba(15,23,42,0.12)",
// // //     padding: 12,
// // //     boxSizing: "border-box",
// // //     display: "flex",
// // //     flexDirection: "column",
// // //     gap: 10,
// // //     overflow: "hidden",
// // //   };

// // //   const label = {
// // //     fontSize: 11,
// // //     fontWeight: 900,
// // //     color: UI.text,
// // //     WebkitTextFillColor: UI.text,
// // //     marginBottom: 6,
// // //   };

// // //   const input = {
// // //     width: "100%",
// // //     height: 36,
// // //     padding: "0 10px",
// // //     borderRadius: 12,
// // //     border: `1px solid ${UI.border}`,
// // //     outline: "none",
// // //     fontSize: 13,
// // //     color: UI.text,
// // //     WebkitTextFillColor: UI.text,
// // //     background: UI.surface,
// // //     boxSizing: "border-box",
// // //     appearance: "none",
// // //     WebkitAppearance: "none",
// // //     MozAppearance: "none",
// // //   };

// // //   const option = { color: UI.text, WebkitTextFillColor: UI.text, backgroundColor: UI.surface };

// // //   const btn = {
// // //     height: 36,
// // //     padding: "0 12px",
// // //     borderRadius: 12,
// // //     border: `1px solid ${UI.text}`,
// // //     background: UI.surface,
// // //     cursor: "pointer",
// // //     fontSize: 13,
// // //     fontWeight: 900,
// // //     color: UI.text,
// // //     WebkitTextFillColor: UI.text,
// // //     display: "inline-flex",
// // //     alignItems: "center",
// // //     justifyContent: "center",
// // //     gap: 8,
// // //   };

// // //   return (
// // //     <div
// // //       style={overlay}
// // //       onMouseDown={(e) => {
// // //         if (e.target === e.currentTarget) onClose();
// // //       }}
// // //     >
// // //       <div style={panel} onMouseDown={(e) => e.stopPropagation()}>
// // //         <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
// // //           <div style={{ fontSize: 13, fontWeight: 950, color: UI.text, WebkitTextFillColor: UI.text }}>Filters</div>
// // //           <button style={btn} onClick={onClose}>
// // //             Close
// // //           </button>
// // //         </div>

// // //         <div>
// // //           <div style={label}>Site</div>
// // //           <select style={input} value={filters.site} onChange={(e) => setFilters((p) => ({ ...p, site: e.target.value }))}>
// // //             <option style={option} value="all">
// // //               All
// // //             </option>
// // //             {availableSites.map((s) => (
// // //               <option style={option} key={s} value={s}>
// // //                 {s}
// // //               </option>
// // //             ))}
// // //           </select>
// // //         </div>

// // //         <div>
// // //           <div style={label}>Audit Type</div>
// // //           <select style={input} value={filters.type} onChange={(e) => setFilters((p) => ({ ...p, type: e.target.value }))}>
// // //             <option style={option} value="all">
// // //               All
// // //             </option>
// // //             {availableTypes.map((t) => (
// // //               <option style={option} key={t} value={t}>
// // //                 {t}
// // //               </option>
// // //             ))}
// // //           </select>
// // //         </div>

// // //         <div>
// // //           <div style={label}>Start date</div>
// // //           <input style={input} type="date" value={filters.startDate} onChange={(e) => setFilters((p) => ({ ...p, startDate: e.target.value }))} />
// // //         </div>

// // //         <div>
// // //           <div style={label}>End date</div>
// // //           <input style={input} type="date" value={filters.endDate} onChange={(e) => setFilters((p) => ({ ...p, endDate: e.target.value }))} />
// // //         </div>

// // //         <div style={{ display: "flex", gap: 10, marginTop: "auto" }}>
// // //           <button
// // //             style={{ ...btn, flex: 1, border: `1px solid ${UI.border}` }}
// // //             onClick={() => setFilters({ site: "all", type: "all", startDate: "", endDate: "" })}
// // //           >
// // //             Reset
// // //           </button>
// // //           <button style={{ ...btn, flex: 1 }} onClick={onClose}>
// // //             Apply
// // //           </button>
// // //         </div>
// // //       </div>
// // //     </div>
// // //   );
// // // }

// // // /* ===================== TABLE ===================== */
// // // function DetailTable({ rows }) {
// // //   if (!Array.isArray(rows) || rows.length === 0) return null;

// // //   const th = {
// // //     textAlign: "left",
// // //     fontSize: 10,
// // //     fontWeight: 900,
// // //     color: UI.muted,
// // //     WebkitTextFillColor: UI.muted,
// // //     padding: "9px 10px",
// // //     borderBottom: `1px solid ${UI.border}`,
// // //     position: "sticky",
// // //     top: 0,
// // //     background: UI.surface,
// // //     zIndex: 2,
// // //     whiteSpace: "nowrap",
// // //   };

// // //   const td = {
// // //     fontSize: 12,
// // //     color: UI.text,
// // //     WebkitTextFillColor: UI.text,
// // //     padding: "9px 10px",
// // //     borderBottom: `1px solid ${UI.border}`,
// // //     verticalAlign: "top",
// // //   };

// // //   const wrap = { ...td, whiteSpace: "pre-wrap", lineHeight: 1.35, minWidth: 220 };
// // //   const nowrap = { ...td, whiteSpace: "nowrap" };

// // //   return (
// // //     <div style={{ marginTop: 12, border: `1px solid ${UI.border}`, borderRadius: 18, overflow: "hidden" }}>
// // //       <div style={{ maxHeight: "100%", overflow: "auto", background: UI.surface }}>
// // //         <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: 0 }}>
// // //           <thead>
// // //             <tr>
// // //               <th style={th}>Element</th>
// // //               <th style={th}>Factor</th>
// // //               <th style={th}>Requirement</th>
// // //               <th style={th}>Observation</th>
// // //               <th style={th}>Rating</th>
// // //               <th style={th}>RCA</th>
// // //               <th style={th}>CAPA</th>
// // //               <th style={th}>Dept Head</th>
// // //               <th style={th}>Status</th>
// // //             </tr>
// // //           </thead>
// // //           <tbody>
// // //             {rows.map((r, idx) => (
// // //               <tr key={r?._id || `${idx}`}>
// // //                 <td style={nowrap}>{r?.Element || "—"}</td>
// // //                 <td style={wrap}>{r?.Factor || "—"}</td>
// // //                 <td style={wrap}>{r?.Requirement_1 || "—"}</td>
// // //                 <td style={wrap}>{r?.Observation || "—"}</td>
// // //                 <td style={nowrap}>{r?.Rating ?? "—"}</td>
// // //                 <td style={wrap}>{r?.RCA_1 || "—"}</td>
// // //                 <td style={wrap}>{r?.CAPA_1 || "—"}</td>
// // //                 <td style={wrap}>{r?.Deparment_Head_Feedback || "—"}</td>
// // //                 <td style={nowrap}>{r?.Auditor_Feedback_2 || "—"}</td>
// // //               </tr>
// // //             ))}
// // //           </tbody>
// // //         </table>
// // //       </div>
// // //     </div>
// // //   );
// // // }

// // // /* ===================== BASIC UI ===================== */
// // // function Panel({ title, subtitle, tint, children, headerRight }) {
// // //   // IMPORTANT: panel itself does NOT scroll; only body scrolls.
// // //   return (
// // //     <div
// // //       style={{
// // //         borderRadius: 18,
// // //         backgroundColor: UI.surface,
// // //         border: `1px solid ${UI.border}`,
// // //         boxShadow: cardShadow,
// // //         overflow: "hidden",
// // //         display: "flex",
// // //         flexDirection: "column",
// // //         minHeight: 0,
// // //         minWidth: 0,
// // //         height: "100%",
// // //       }}
// // //     >
// // //       <div
// // //         style={{
// // //           padding: "12px 14px",
// // //           borderBottom: `1px solid ${UI.border}`,
// // //           backgroundColor: tint,
// // //           display: "flex",
// // //           alignItems: "center",
// // //           justifyContent: "space-between",
// // //           gap: 10,
// // //           minWidth: 0,
// // //           flex: "0 0 auto",
// // //         }}
// // //       >
// // //         <div style={{ minWidth: 0 }}>
// // //           <div style={{ fontSize: 13, fontWeight: 950, color: UI.text, WebkitTextFillColor: UI.text }}>{title}</div>
// // //           {subtitle ? <div style={{ fontSize: 12, color: UI.muted, WebkitTextFillColor: UI.muted, marginTop: 2 }}>{subtitle}</div> : null}
// // //         </div>
// // //         {headerRight ? <div style={{ flex: "0 0 auto" }}>{headerRight}</div> : null}
// // //       </div>

// // //       {/* Only this area scrolls */}
// // //       <div
// // //         style={{
// // //           padding: 12,
// // //           overflowY: "auto",
// // //           overflowX: "hidden",
// // //           display: "flex",
// // //           flexDirection: "column",
// // //           gap: 10,
// // //           minHeight: 0,
// // //           minWidth: 0,
// // //           flex: "1 1 auto",
// // //         }}
// // //       >
// // //         {children}
// // //       </div>
// // //     </div>
// // //   );
// // // }

// // // function Empty({ children }) {
// // //   return <div style={{ padding: 14, color: UI.muted, WebkitTextFillColor: UI.muted, fontSize: 13 }}>{children}</div>;
// // // }

// // // function ErrorText({ children }) {
// // //   return <div style={{ padding: 14, color: UI.danger, WebkitTextFillColor: UI.danger, fontSize: 13 }}>{children}</div>;
// // // }

// // // function Meta({ label, value }) {
// // //   return (
// // //     <div style={{ display: "flex", flexDirection: "column", gap: 2, minWidth: 0 }}>
// // //       <div style={{ fontSize: 11, fontWeight: 900, color: UI.muted, WebkitTextFillColor: UI.muted }}>{label}</div>
// // //       <div style={{ fontSize: 12, color: UI.text, WebkitTextFillColor: UI.text, fontWeight: 800, wordBreak: "break-word", minWidth: 0 }}>
// // //         {value == null || value === "" ? "—" : String(value)}
// // //       </div>
// // //     </div>
// // //   );
// // // }

// // // /* ===================== COLLAPSED RAIL ===================== */
// // // function CollapsedRail({ title, subtitle, onExpand }) {
// // //   return (
// // //     <div
// // //       onClick={onExpand}
// // //       title="Click to expand"
// // //       style={{
// // //         height: "100%",
// // //         borderRadius: 18,
// // //         border: `1px solid ${UI.border}`,
// // //         background: UI.surface,
// // //         boxShadow: cardShadow,
// // //         overflow: "hidden",
// // //         cursor: "pointer",
// // //         display: "flex",
// // //         flexDirection: "column",
// // //         userSelect: "none",
// // //         minWidth: 0,
// // //       }}
// // //     >
// // //       <div
// // //         style={{
// // //           background: UI.bg,
// // //           borderBottom: `1px solid ${UI.border}`,
// // //           padding: 10,
// // //           display: "flex",
// // //           alignItems: "center",
// // //           justifyContent: "center",
// // //           gap: 8,
// // //         }}
// // //       >
// // //         <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
// // //           <path d="M10 7l5 5-5 5" stroke={UI.text} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
// // //         </svg>
// // //       </div>

// // //       <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: 10 }}>
// // //         <div
// // //           style={{
// // //             writingMode: "vertical-rl",
// // //             transform: "rotate(180deg)",
// // //             display: "flex",
// // //             alignItems: "center",
// // //             gap: 8,
// // //             color: UI.text,
// // //             WebkitTextFillColor: UI.text,
// // //             fontWeight: 950,
// // //             fontSize: 12,
// // //             whiteSpace: "nowrap",
// // //           }}
// // //         >
// // //           {title}
// // //           {subtitle ? <span style={{ color: UI.muted, WebkitTextFillColor: UI.muted, fontWeight: 800, fontSize: 11 }}>{subtitle}</span> : null}
// // //         </div>
// // //       </div>
// // //     </div>
// // //   );
// // // }

// // // /* ===================== ICON BUTTON ===================== */
// // // function IconBtn({ title, onClick, children }) {
// // //   return (
// // //     <button
// // //       title={title}
// // //       onClick={onClick}
// // //       style={{
// // //         width: 34,
// // //         height: 34,
// // //         borderRadius: 12,
// // //         border: `1px solid ${UI.border}`,
// // //         background: UI.surface,
// // //         cursor: "pointer",
// // //         display: "inline-flex",
// // //         alignItems: "center",
// // //         justifyContent: "center",
// // //         padding: 0,
// // //       }}
// // //     >
// // //       {children}
// // //     </button>
// // //   );
// // // }

// // // /* ===================== MAIN PAGE ===================== */
// // // export function DefaultLandingComponent() {
// // //   const [ready, setReady] = useState(false);

// // //   const [loadingList, setLoadingList] = useState(false);
// // //   const [listError, setListError] = useState("");
// // //   const [rawListRows, setRawListRows] = useState([]);

// // //   const [search, setSearch] = useState("");
// // //   const [filters, setFilters] = useState({ site: "all", type: "all", startDate: "", endDate: "" });
// // //   const [filterOpen, setFilterOpen] = useState(false);

// // //   const [selectedAuditId, setSelectedAuditId] = useState(null);
// // //   const [selectedVersionRowId, setSelectedVersionRowId] = useState(null);

// // //   const [loadingDetail, setLoadingDetail] = useState(false);
// // //   const [detailError, setDetailError] = useState("");
// // //   const [detail, setDetail] = useState(null);

// // //   const [collapseMode, setCollapseMode] = useState("none"); // "none" | "audit" | "both"

// // //   const listAbortRef = useRef(false);
// // //   const detailAbortRef = useRef(false);

// // //   useEffect(() => {
// // //     let cancelled = false;
// // //     const boot = async () => {
// // //       let attempts = 0;
// // //       while ((!kf.account?._id || !kf.user?._id) && !cancelled && attempts < 40) {
// // //         await delay(200);
// // //         attempts += 1;
// // //       }
// // //       if (cancelled) return;
// // //       setReady(Boolean(kf.account?._id));
// // //     };
// // //     boot();
// // //     return () => {
// // //       cancelled = true;
// // //     };
// // //   }, []);

// // //   const loadVersionList = async ({ silent = false } = {}) => {
// // //     const accId = kf.account?._id;
// // //     if (!accId) return;

// // //     if (!silent) setLoadingList(true);
// // //     setListError("");
// // //     listAbortRef.current = false;

// // //     const urlWithAcc = buildListUrl({ accId, withAccount: true });
// // //     const urlWithoutAcc = buildListUrl({ accId, withAccount: false });

// // //     try {
// // //       const { res } = await kfApiTryMany([urlWithAcc, urlWithoutAcc]);
// // //       if (listAbortRef.current) return;

// // //       const rows =
// // //         Array.isArray(res?.Data) ? res.Data :
// // //         Array.isArray(res?.data) ? res.data :
// // //         Array.isArray(res?.Items) ? res.Items :
// // //         Array.isArray(res?.items) ? res.items :
// // //         [];

// // //       setRawListRows(rows);

// // //       if (!selectedAuditId && rows.length > 0) {
// // //         const firstAuditId = rows[0]?.Audit_ID;
// // //         if (firstAuditId) setSelectedAuditId(firstAuditId);
// // //       }
// // //     } catch (e) {
// // //       if (listAbortRef.current) return;
// // //       setListError(e?.message || "Failed to load audits list.");
// // //       setRawListRows([]);
// // //     } finally {
// // //       if (!listAbortRef.current && !silent) setLoadingList(false);
// // //     }
// // //   };

// // //   useEffect(() => {
// // //     if (!ready) return;
// // //     loadVersionList({ silent: false });
// // //     const t = setInterval(() => loadVersionList({ silent: true }), 12000);
// // //     return () => {
// // //       clearInterval(t);
// // //       listAbortRef.current = true;
// // //     };
// // //     // eslint-disable-next-line react-hooks/exhaustive-deps
// // //   }, [ready]);

// // //   const loadVersionDetail = async (rowId) => {
// // //     const accId = kf.account?._id;
// // //     if (!accId || !rowId) return;

// // //     setDetailError("");
// // //     setLoadingDetail(true);
// // //     detailAbortRef.current = false;

// // //     const urls = buildDetailUrls({ accId, rowId });

// // //     try {
// // //       const { res } = await kfApiTryMany(urls);
// // //       if (detailAbortRef.current) return;

// // //       const payload = res?.Data ? res.Data : res?.data ? res.data : res;
// // //       setDetail(payload || null);
// // //     } catch (e) {
// // //       if (detailAbortRef.current) return;
// // //       setDetailError(e?.message || "Failed to load version details.");
// // //       setDetail(null);
// // //     } finally {
// // //       if (!detailAbortRef.current) setLoadingDetail(false);
// // //     }
// // //   };

// // //   const audits = useMemo(() => buildAuditGroups(rawListRows), [rawListRows]);

// // //   const availableSites = useMemo(() => {
// // //     const set = new Set();
// // //     rawListRows.forEach((r) => r?.Site_Name && set.add(r.Site_Name));
// // //     return Array.from(set).sort((a, b) => String(a).localeCompare(String(b)));
// // //   }, [rawListRows]);

// // //   const availableTypes = useMemo(() => {
// // //     const set = new Set();
// // //     rawListRows.forEach((r) => r?.Audit_Type && set.add(r.Audit_Type));
// // //     return Array.from(set).sort((a, b) => String(a).localeCompare(String(b)));
// // //   }, [rawListRows]);

// // //   const filteredAudits = useMemo(() => {
// // //     const q = search.trim().toLowerCase();
// // //     const startMs = filters.startDate ? new Date(filters.startDate).getTime() : null;
// // //     const endMs = filters.endDate ? new Date(filters.endDate).getTime() : null;

// // //     return audits.filter((a) => {
// // //       if (filters.site !== "all" && a.siteName !== filters.site) return false;
// // //       if (filters.type !== "all" && a.auditType !== filters.type) return false;

// // //       if (startMs || endMs) {
// // //         const d = a.scheduledDate ? new Date(a.scheduledDate).getTime() : null;
// // //         if (d == null) return false;
// // //         if (startMs && d < startMs) return false;
// // //         if (endMs && d > endMs) return false;
// // //       }

// // //       if (!q) return true;
// // //       const hay = [a.auditId, a.siteName, a.auditType, safeUserName(a.auditor), safeUserName(a.auditee)].join(" ").toLowerCase();
// // //       return hay.includes(q);
// // //     });
// // //   }, [audits, search, filters]);

// // //   const selectedAudit = useMemo(
// // //     () => filteredAudits.find((a) => a.auditId === selectedAuditId) || null,
// // //     [filteredAudits, selectedAuditId]
// // //   );

// // //   const gridTemplateColumns = useMemo(() => {
// // //   if (collapseMode === "both") return "56px 56px 620px";
// // //   if (collapseMode === "audit") return "56px 320px 620px";
// // //   return "360px 320px 620px";
// // // }, [collapseMode]);


// // //   // auto-collapse on version select
// // //   useEffect(() => {
// // //     if (selectedVersionRowId) setCollapseMode("audit");
// // //   }, [selectedVersionRowId]);

// // //   const filterIconBtn = {
// // //     width: 36,
// // //     height: 36,
// // //     borderRadius: 12,
// // //     border: `1px solid ${UI.border}`,
// // //     background: UI.surface,
// // //     cursor: "pointer",
// // //     display: "inline-flex",
// // //     alignItems: "center",
// // //     justifyContent: "center",
// // //     padding: 0,
// // //   };

// // //   const topBtn = {
// // //     height: 36,
// // //     padding: "0 12px",
// // //     borderRadius: 999,
// // //     border: `1px solid ${UI.text}`,
// // //     background: UI.surface,
// // //     cursor: "pointer",
// // //     fontSize: 13,
// // //     fontWeight: 900,
// // //     color: UI.text,
// // //     WebkitTextFillColor: UI.text,
// // //   };

// // //   /* ===================== FULL SIZE LAYOUT (NO OUTER SCROLL) ===================== */
// // //   return (
// // //     <div
// // //       style={{
// // //         width: "100%",
// // //         height: "100%",
// // //         minWidth: 0,
// // //         minHeight: 0,
// // //         display: "flex",
// // //         flexDirection: "column",
// // //         backgroundColor: UI.bg,
// // //         color: UI.text,
// // //         fontFamily: "Inter, system-ui, sans-serif",
// // //         overflow: "hidden", // ✅ stop page scroll
// // //         boxSizing: "border-box",
// // //       }}
// // //     >
// // //       <FilterDrawer
// // //         open={filterOpen}
// // //         onClose={() => setFilterOpen(false)}
// // //         availableSites={availableSites}
// // //         availableTypes={availableTypes}
// // //         filters={filters}
// // //         setFilters={setFilters}
// // //       />

// // //       {/* TOP BAR (fixed height, no scroll) */}
// // //       <div
// // //         style={{
// // //           padding: "12px 18px",
// // //           backgroundColor: UI.surface,
// // //           boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
// // //           display: "flex",
// // //           alignItems: "center",
// // //           gap: 12,
// // //           zIndex: 2,
// // //           borderBottom: `1px solid ${UI.border}`,
// // //           flex: "0 0 auto",
// // //           boxSizing: "border-box",
// // //         }}
// // //       >
// // //         <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
// // //           <div
// // //             style={{
// // //               width: 36,
// // //               height: 36,
// // //               borderRadius: 12,
// // //               backgroundColor: UI.tintB,
// // //               display: "flex",
// // //               alignItems: "center",
// // //               justifyContent: "center",
// // //               border: "1px solid #E9D5FF",
// // //               color: "#5B21B6",
// // //               WebkitTextFillColor: "#5B21B6",
// // //               fontWeight: 950,
// // //               fontSize: 14,
// // //             }}
// // //           >
// // //             V
// // //           </div>
// // //           <div style={{ fontSize: 15, fontWeight: 950, color: UI.text, WebkitTextFillColor: UI.text }}>
// // //             Audit Versions
// // //           </div>
// // //         </div>

// // //         <div style={{ flex: 1 }} />

// // //         <input
// // //           value={search}
// // //           onChange={(e) => setSearch(e.target.value)}
// // //           onKeyDown={(e) => e.stopPropagation()}
// // //           onMouseDown={(e) => e.stopPropagation()}
// // //           placeholder="Search audit, site, type, auditor…"
// // //           autoComplete="off"
// // //           style={{
// // //             width: 360,
// // //             maxWidth: "42vw",
// // //             padding: "9px 12px",
// // //             borderRadius: 999,
// // //             border: `1px solid ${UI.border}`,
// // //             outline: "none",
// // //             fontSize: 13,
// // //             backgroundColor: "#F9FAFB",
// // //             color: UI.text,
// // //             WebkitTextFillColor: UI.text,
// // //             caretColor: UI.text,
// // //           }}
// // //         />

// // //         {/* three lines icon */}
// // //         <button style={filterIconBtn} onClick={() => setFilterOpen(true)} title="Filters">
// // //           <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
// // //             <path d="M4 7h16" stroke={UI.text} strokeWidth="2" strokeLinecap="round" />
// // //             <path d="M7 12h13" stroke={UI.text} strokeWidth="2" strokeLinecap="round" />
// // //             <path d="M10 17h10" stroke={UI.text} strokeWidth="2" strokeLinecap="round" />
// // //           </svg>
// // //         </button>

// // //         <button onClick={() => loadVersionList({ silent: false })} style={topBtn} title="Refresh">
// // //           Refresh
// // //         </button>
// // //       </div>

// // //       {/* BODY: fills remaining height; no outer scroll */}
// // //       <div
// // //         style={{
// // //           flex: "1 1 auto",
// // //           minHeight: 0,
// // //           minWidth: 0,
// // //           padding: 12,
// // //           overflow: "hidden", // ✅ stop outer scroll
// // //           backgroundColor: UI.bg,
// // //           boxSizing: "border-box",
// // //         }}
// // //       >
// // //         <div
// // //           style={{
// // //             height: "100%",
// // //             minHeight: 0,
// // //             minWidth: 0,
// // //             display: "grid",
// // //             gridTemplateColumns,
// // //             gap: 12,
// // //             overflow: "hidden", // ✅ stop outer scroll
// // //             transition: "grid-template-columns 180ms ease",
// // //             backgroundColor: UI.bg,
// // //             boxSizing: "border-box",
// // //           }}
// // //         >
// // //           {/* LEFT */}
// // //           {collapseMode === "audit" || collapseMode === "both" ? (
// // //             <CollapsedRail title="Audits" subtitle={selectedAuditId || ""} onExpand={() => setCollapseMode("none")} />
// // //           ) : (
// // //             <Panel
// // //               title="Audits"
// // //               subtitle={loadingList ? "Loading…" : listError ? "Error loading audits" : `${filteredAudits.length} shown`}
// // //               tint={UI.tintB}
// // //               headerRight={
// // //                 <IconBtn title="Collapse audits" onClick={() => setCollapseMode("audit")}>
// // //                   <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
// // //                     <path d="M15 6l-6 6 6 6" stroke={UI.text} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
// // //                   </svg>
// // //                 </IconBtn>
// // //               }
// // //             >
// // //               {!ready && <Empty>Waiting for Kissflow context…</Empty>}
// // //               {ready && loadingList && <Empty>Loading audits…</Empty>}
// // //               {ready && !loadingList && listError && <ErrorText>{listError}</ErrorText>}
// // //               {ready && !loadingList && !listError && filteredAudits.length === 0 && <Empty>No audits match your filters.</Empty>}

// // //               {filteredAudits.map((a) => {
// // //                 const active = a.auditId === selectedAuditId;
// // //                 return (
// // //                   <div
// // //                     key={a.auditId}
// // //                     onClick={() => {
// // //                       setSelectedAuditId(a.auditId);
// // //                       setSelectedVersionRowId(null);
// // //                       setDetail(null);
// // //                       setDetailError("");
// // //                     }}
// // //                     style={{
// // //                       cursor: "pointer",
// // //                       borderRadius: 16,
// // //                       border: active ? `2px solid ${UI.accent2}` : `1px solid ${UI.border}`,
// // //                       backgroundColor: active ? UI.tintB : UI.surface,
// // //                       padding: 12,
// // //                       transition: "0.15s ease",
// // //                       minWidth: 0,
// // //                     }}
// // //                   >
// // //                     <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, minWidth: 0 }}>
// // //                       <div style={{ fontSize: 13, fontWeight: 950, color: UI.text, WebkitTextFillColor: UI.text, minWidth: 0 }}>
// // //                         {a.auditId}
// // //                       </div>
// // //                       <div style={chipStyle("#EDE9FE", "#5B21B6", "#C4B5FD")}>{a.versionCount} versions</div>
// // //                     </div>

// // //                     <div style={{ marginTop: 8, display: "flex", flexWrap: "wrap", gap: 8, minWidth: 0 }}>
// // //                       <span style={auditTypePill(a.auditType)}>{a.auditType || "—"}</span>
// // //                       <span style={chipStyle("#F3F4F6", "#374151", UI.border)}>{fmtDate(a.scheduledDate)}</span>
// // //                       <span style={chipStyle("#F3F4F6", "#374151", UI.border)}>{a.siteName || "—"}</span>
// // //                     </div>

// // //                     <div style={{ marginTop: 10, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, minWidth: 0 }}>
// // //                       <Meta label="Auditor" value={safeUserName(a.auditor)} />
// // //                       <Meta label="Auditee" value={safeUserName(a.auditee)} />
// // //                     </div>
// // //                   </div>
// // //                 );
// // //               })}
// // //             </Panel>
// // //           )}

// // //           {/* MIDDLE */}
// // //           {collapseMode === "both" ? (
// // //             <CollapsedRail title="Versions" subtitle={detail?.Version ? fmtVersion(detail?.Version) : ""} onExpand={() => setCollapseMode("audit")} />
// // //           ) : (
// // //             <Panel
// // //               title="Versions"
// // //               subtitle={selectedAudit ? `For ${selectedAudit.auditId}` : "Select an audit"}
// // //               tint={UI.tintA}
// // //               headerRight={
// // //                 <IconBtn title="Collapse versions" onClick={() => setCollapseMode("both")}>
// // //                   <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
// // //                     <path d="M15 6l-6 6 6 6" stroke={UI.text} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
// // //                   </svg>
// // //                 </IconBtn>
// // //               }
// // //             >
// // //               {!selectedAudit && <Empty>Pick an audit to see versions.</Empty>}

// // //               {selectedAudit &&
// // //                 selectedAudit.versions.map((v) => {
// // //                   const active = v.rowId === selectedVersionRowId;
// // //                   return (
// // //                     <div
// // //                       key={v.rowId}
// // //                       onClick={() => {
// // //                         setSelectedVersionRowId(v.rowId);
// // //                         loadVersionDetail(v.rowId);
// // //                       }}
// // //                       style={{
// // //                         cursor: "pointer",
// // //                         borderRadius: 16,
// // //                         border: active ? `2px solid ${UI.accent}` : `1px solid ${UI.border}`,
// // //                         backgroundColor: active ? "#EFF6FF" : UI.surface,
// // //                         padding: 12,
// // //                         transition: "0.15s ease",
// // //                         minWidth: 0,
// // //                       }}
// // //                     >
// // //                       <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10, minWidth: 0 }}>
// // //                         <div style={{ fontSize: 13, fontWeight: 950, color: UI.text, WebkitTextFillColor: UI.text }}>
// // //                           {v.versionLabel}
// // //                         </div>
// // //                         <div style={chipStyle("#DBEAFE", "#1D4ED8", "#93C5FD")}>{fmtDate(v.scheduledDate)}</div>
// // //                       </div>

// // //                       <div style={{ marginTop: 8, display: "flex", flexWrap: "wrap", gap: 8 }}>
// // //                         <span style={auditTypePill(v.auditType)}>{v.auditType || "—"}</span>
// // //                       </div>
// // //                     </div>
// // //                   );
// // //                 })}
// // //             </Panel>
// // //           )}

// // //           {/* RIGHT */}
// // //           <Panel title="Version Details" subtitle={selectedVersionRowId ? "" : "Select a version"} tint={UI.tintC}>
// // //             <div style={{ position: "relative", minHeight: 240, minWidth: 0 }}>
// // //               {loadingDetail && selectedVersionRowId && (
// // //                 <div
// // //                   style={{
// // //                     position: "absolute",
// // //                     inset: 0,
// // //                     background: UI.surface,
// // //                     zIndex: 3,
// // //                     display: "flex",
// // //                     alignItems: "center",
// // //                     justifyContent: "center",
// // //                     fontWeight: 900,
// // //                     color: UI.muted,
// // //                     WebkitTextFillColor: UI.muted,
// // //                     borderRadius: 16,
// // //                     border: `1px solid ${UI.border}`,
// // //                   }}
// // //                 >
// // //                   Loading…
// // //                 </div>
// // //               )}

// // //               {!selectedVersionRowId && <Empty>Choose a version to view details.</Empty>}
// // //               {selectedVersionRowId && !loadingDetail && detailError && <ErrorText>{detailError}</ErrorText>}

// // //               {selectedVersionRowId && detail && (
// // //                 <div
// // //                   style={{
// // //                     border: `1px solid ${UI.border}`,
// // //                     borderRadius: 18,
// // //                     padding: 14,
// // //                     backgroundColor: UI.surface,
// // //                     boxShadow: cardShadow,
// // //                     minWidth: 0,
// // //                   }}
// // //                 >
// // //                   <div style={{ fontSize: 14, fontWeight: 950, color: UI.text, WebkitTextFillColor: UI.text }}>
// // //                     {detail?.Audit_ID || "—"} • {fmtVersion(detail?.Version)}
// // //                   </div>

// // //                   <div style={{ marginTop: 6, fontSize: 12, color: UI.muted, WebkitTextFillColor: UI.muted }}>
// // //                     {(detail?.Audit_Type || "—") + " • " + (detail?.Site_Name || "—") + " • " + fmtDate(detail?.Audit_Scheduled_Date)}
// // //                   </div>

// // //                   <div style={{ marginTop: 12, display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, minWidth: 0 }}>
// // //                     <Meta label="Site" value={detail?.Site_Name} />
// // //                     <Meta label="Scheduled Date" value={fmtDate(detail?.Audit_Scheduled_Date)} />
// // //                     <Meta label="Audit Type" value={detail?.Audit_Type} />
// // //                   </div>

// // //                   <div style={{ marginTop: 10, display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, minWidth: 0 }}>
// // //                     <Meta label="Auditor" value={safeUserName(detail?.Auditor)} />
// // //                     <Meta label="Auditee" value={safeUserName(detail?.Auditee)} />
// // //                     <Meta label="Department Head" value={safeUserName(detail?.Department_Head)} />
// // //                   </div>

// // //                   <DetailTable rows={detail?.["Table::Untitled_Table"] || []} />
// // //                 </div>
// // //               )}
// // //             </div>
// // //           </Panel>
// // //         </div>
// // //       </div>
// // //     </div>
// // //   );
// // // }
// // // export default DefaultLandingComponent;

// // // //-----=====================-------------------------------------------------- */
// // /**
// //  * ✅ What was fixed (UI-only, no data/logic/content changes)
// //  * -----------------------------------------------------------------------------
// //  * 1) Component ALWAYS fills its parent: 100% width + 100% height (even with 1 item)
// //  * 2) No outer scroll at all (header + page never scroll). Only panel bodies scroll.
// //  * 3) Collapsing columns NEVER shrinks the whole component.
// //  *    - Grid ALWAYS has at least one `1fr` column so it consumes remaining width.
// //  * 4) When a column collapses, remaining columns expand to fill the freed space.
// //  * 5) Top header remains stable and does not change width when columns collapse.
// //  * 6) Added "Expand" control to view Version Details in full page (overlay).
// //  *    - Pure UI overlay; same content/mapping.
// //  */

// // import React, { useEffect, useMemo, useRef, useState } from "react";
// // import { kf } from "./../sdk/index.js";

// // /* ===================== CONSTANT LIGHT THEME (NO DARK / NO TRANSPARENT BG) ===================== */
// // const UI = {
// //   bg: "#F3F4F6",
// //   surface: "#FFFFFF",
// //   border: "#E5E7EB",
// //   text: "#111827",
// //   muted: "#6B7280",
// //   tintA: "#EEF2FF",
// //   tintB: "#F5F3FF",
// //   tintC: "#ECFDF5",
// //   accent: "#2563EB",
// //   accent2: "#7C3AED",
// //   danger: "#B91C1C",
// // };

// // const FLOW_ID = "Version_Master_A00";
// // const APP_ID = "Ac9Pds4TaXkR";
// // const LIST_PAGE_SIZE = 100000;

// // const delay = (ms) => new Promise((r) => setTimeout(r, ms));

// // const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
// // const fmtDate = (ymd) => {
// //   if (!ymd) return "—";
// //   const d = new Date(ymd);
// //   if (Number.isNaN(d.getTime())) return String(ymd);
// //   return `${d.getDate()} ${monthNames[d.getMonth()]} ${d.getFullYear()}`;
// // };

// // const safeUserName = (u) => u?.Name || u?.DisplayName || u?.Email || "—";

// // const fmtVersion = (v) => {
// //   if (v == null || v === "") return "V—";
// //   const s = String(v).trim();
// //   const m = s.match(/^v\s*(\d+)$/i);
// //   if (m?.[1]) return `V${m[1]}`;
// //   const n = Number(s);
// //   if (!Number.isNaN(n) && Number.isFinite(n)) return `V${String(n)}`;
// //   return s.toUpperCase().startsWith("V") ? s.toUpperCase() : `V${s}`;
// // };

// // const chipStyle = (bg, fg, border) => ({
// //   display: "inline-flex",
// //   alignItems: "center",
// //   padding: "2px 10px",
// //   borderRadius: 999,
// //   fontSize: 11,
// //   fontWeight: 800,
// //   backgroundColor: bg,
// //   color: fg,
// //   WebkitTextFillColor: fg,
// //   border: `1px solid ${border}`,
// //   whiteSpace: "nowrap",
// // });

// // const cardShadow = "0 8px 18px rgba(17, 24, 39, 0.06)";

// // const buildListUrl = ({ accId, withAccount }) => {
// //   const qs = `visited=1&page_number=1&page_size=${LIST_PAGE_SIZE}`;
// //   return withAccount ? `/form/2/${accId}/${FLOW_ID}/list?${qs}` : `/form/2/${APP_ID}/${FLOW_ID}/list?${qs}`;
// // };

// // const buildDetailUrls = ({ accId, rowId }) => [
// //   `/form/2/${accId}/${FLOW_ID}/${rowId}`,
// //   `/form/2/${APP_ID}/${FLOW_ID}/${rowId}`,
// //   `/form/2/${accId}/${APP_ID}/${FLOW_ID}/${rowId}`,
// // ];

// // async function kfApiTryMany(urls) {
// //   let lastErr = null;
// //   for (const url of urls) {
// //     try {
// //       const res = await kf.api(url);
// //       return { res, usedUrl: url };
// //     } catch (e) {
// //       lastErr = e;
// //     }
// //   }
// //   throw lastErr;
// // }

// // /** Group list rows by Audit_ID */
// // const buildAuditGroups = (rows = []) => {
// //   const map = new Map();
// //   rows.forEach((r) => {
// //     const auditId = r?.Audit_ID || "—";
// //     if (!map.has(auditId)) map.set(auditId, []);
// //     map.get(auditId).push(r);
// //   });

// //   const audits = Array.from(map.entries()).map(([auditId, items]) => {
// //     const sorted = [...items].sort((a, b) => {
// //       const av = a?.Version ?? "";
// //       const bv = b?.Version ?? "";
// //       const an = Number(av);
// //       const bn = Number(bv);
// //       if (!Number.isNaN(an) && !Number.isNaN(bn)) return bn - an;
// //       return String(bv).localeCompare(String(av));
// //     });

// //     const pick = (key) => sorted.find((x) => x?.[key] != null)?.[key];

// //     return {
// //       auditId,
// //       siteName: pick("Site_Name") || "—",
// //       auditType: pick("Audit_Type") || "—",
// //       scheduledDate: pick("Audit_Scheduled_Date") || null,
// //       auditor: pick("Auditor") || null,
// //       auditee: pick("Auditee") || null,
// //       deptHead: pick("Department_Head") || null,
// //       versions: sorted.map((x) => ({
// //         rowId: x?._id,
// //         versionLabel: fmtVersion(x?.Version),
// //         scheduledDate: x?.Audit_Scheduled_Date ?? null,
// //         auditType: x?.Audit_Type ?? pick("Audit_Type") ?? "—",
// //       })),
// //       versionCount: sorted.length,
// //     };
// //   });

// //   audits.sort((a, b) => {
// //     const ad = a.scheduledDate ? new Date(a.scheduledDate).getTime() : -Infinity;
// //     const bd = b.scheduledDate ? new Date(b.scheduledDate).getTime() : -Infinity;
// //     if (bd !== ad) return bd - ad;
// //     return String(a.auditId).localeCompare(String(b.auditId));
// //   });

// //   return audits;
// // };

// // const auditTypePill = (auditType) => {
// //   const t = String(auditType || "").toLowerCase();
// //   if (t.includes("annual")) return chipStyle("#DBEAFE", "#1D4ED8", "#93C5FD");
// //   if (t.includes("qgmp")) return chipStyle("#DCFCE7", "#166534", "#86EFAC");
// //   return chipStyle("#EDE9FE", "#5B21B6", "#C4B5FD");
// // };

// // /* ===================== FILTER DRAWER (SOLID BG) ===================== */
// // function FilterDrawer({ open, onClose, availableSites, availableTypes, filters, setFilters }) {
// //   if (!open) return null;

// //   const overlay = {
// //     position: "fixed",
// //     inset: 0,
// //     zIndex: 99999,
// //     display: "flex",
// //     justifyContent: "flex-end",
// //     background: UI.bg, // solid
// //     overflow: "hidden",
// //   };

// //   const panel = {
// //     width: 360,
// //     maxWidth: "92vw",
// //     height: "100%",
// //     background: UI.surface,
// //     borderLeft: `1px solid ${UI.border}`,
// //     boxShadow: "0 18px 48px rgba(15,23,42,0.12)",
// //     padding: 12,
// //     boxSizing: "border-box",
// //     display: "flex",
// //     flexDirection: "column",
// //     gap: 10,
// //     overflow: "hidden",
// //   };

// //   const label = {
// //     fontSize: 11,
// //     fontWeight: 900,
// //     color: UI.text,
// //     WebkitTextFillColor: UI.text,
// //     marginBottom: 6,
// //   };

// //   const input = {
// //     width: "100%",
// //     height: 36,
// //     padding: "0 10px",
// //     borderRadius: 12,
// //     border: `1px solid ${UI.border}`,
// //     outline: "none",
// //     fontSize: 13,
// //     color: UI.text,
// //     WebkitTextFillColor: UI.text,
// //     background: UI.surface,
// //     boxSizing: "border-box",
// //     appearance: "none",
// //     WebkitAppearance: "none",
// //     MozAppearance: "none",
// //   };

// //   const option = { color: UI.text, WebkitTextFillColor: UI.text, backgroundColor: UI.surface };

// //   const btn = {
// //     height: 36,
// //     padding: "0 12px",
// //     borderRadius: 12,
// //     border: `1px solid ${UI.text}`,
// //     background: UI.surface,
// //     cursor: "pointer",
// //     fontSize: 13,
// //     fontWeight: 900,
// //     color: UI.text,
// //     WebkitTextFillColor: UI.text,
// //     display: "inline-flex",
// //     alignItems: "center",
// //     justifyContent: "center",
// //     gap: 8,
// //   };

// //   return (
// //     <div
// //       style={overlay}
// //       onMouseDown={(e) => {
// //         if (e.target === e.currentTarget) onClose();
// //       }}
// //     >
// //       <div style={panel} onMouseDown={(e) => e.stopPropagation()}>
// //         <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
// //           <div style={{ fontSize: 13, fontWeight: 950, color: UI.text, WebkitTextFillColor: UI.text }}>Filters</div>
// //           <button style={btn} onClick={onClose}>
// //             Close
// //           </button>
// //         </div>

// //         <div>
// //           <div style={label}>Site</div>
// //           <select style={input} value={filters.site} onChange={(e) => setFilters((p) => ({ ...p, site: e.target.value }))}>
// //             <option style={option} value="all">
// //               All
// //             </option>
// //             {availableSites.map((s) => (
// //               <option style={option} key={s} value={s}>
// //                 {s}
// //               </option>
// //             ))}
// //           </select>
// //         </div>

// //         <div>
// //           <div style={label}>Audit Type</div>
// //           <select style={input} value={filters.type} onChange={(e) => setFilters((p) => ({ ...p, type: e.target.value }))}>
// //             <option style={option} value="all">
// //               All
// //             </option>
// //             {availableTypes.map((t) => (
// //               <option style={option} key={t} value={t}>
// //                 {t}
// //               </option>
// //             ))}
// //           </select>
// //         </div>

// //         <div>
// //           <div style={label}>Start date</div>
// //           <input style={input} type="date" value={filters.startDate} onChange={(e) => setFilters((p) => ({ ...p, startDate: e.target.value }))} />
// //         </div>

// //         <div>
// //           <div style={label}>End date</div>
// //           <input style={input} type="date" value={filters.endDate} onChange={(e) => setFilters((p) => ({ ...p, endDate: e.target.value }))} />
// //         </div>

// //         <div style={{ display: "flex", gap: 10, marginTop: "auto" }}>
// //           <button
// //             style={{ ...btn, flex: 1, border: `1px solid ${UI.border}` }}
// //             onClick={() => setFilters({ site: "all", type: "all", startDate: "", endDate: "" })}
// //           >
// //             Reset
// //           </button>
// //           <button style={{ ...btn, flex: 1 }} onClick={onClose}>
// //             Apply
// //           </button>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }

// // /* ===================== TABLE ===================== */
// // function DetailTable({ rows }) {
// //   if (!Array.isArray(rows) || rows.length === 0) return null;

// //   const th = {
// //     textAlign: "left",
// //     fontSize: 10,
// //     fontWeight: 900,
// //     color: UI.muted,
// //     WebkitTextFillColor: UI.muted,
// //     padding: "9px 10px",
// //     borderBottom: `1px solid ${UI.border}`,
// //     position: "sticky",
// //     top: 0,
// //     background: UI.surface,
// //     zIndex: 2,
// //     whiteSpace: "nowrap",
// //   };

// //   const td = {
// //     fontSize: 12,
// //     color: UI.text,
// //     WebkitTextFillColor: UI.text,
// //     padding: "9px 10px",
// //     borderBottom: `1px solid ${UI.border}`,
// //     verticalAlign: "top",
// //   };

// //   const wrap = { ...td, whiteSpace: "pre-wrap", lineHeight: 1.35, minWidth: 220 };
// //   const nowrap = { ...td, whiteSpace: "nowrap" };

// //   return (
// //     <div style={{ marginTop: 12, border: `1px solid ${UI.border}`, borderRadius: 18, overflow: "hidden" }}>
// //       <div style={{ maxHeight: "100%", overflow: "auto", background: UI.surface }}>
// //         <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: 0 }}>
// //           <thead>
// //             <tr>
// //               <th style={th}>Element</th>
// //               <th style={th}>Factor</th>
// //               <th style={th}>Requirement</th>
// //               <th style={th}>Observation</th>
// //               <th style={th}>Rating</th>
// //               <th style={th}>RCA</th>
// //               <th style={th}>CAPA</th>
// //               <th style={th}>Dept Head</th>
// //               <th style={th}>Status</th>
// //             </tr>
// //           </thead>
// //           <tbody>
// //             {rows.map((r, idx) => (
// //               <tr key={r?._id || `${idx}`}>
// //                 <td style={nowrap}>{r?.Element || "—"}</td>
// //                 <td style={wrap}>{r?.Factor || "—"}</td>
// //                 <td style={wrap}>{r?.Requirement_1 || "—"}</td>
// //                 <td style={wrap}>{r?.Observation || "—"}</td>
// //                 <td style={nowrap}>{r?.Rating ?? "—"}</td>
// //                 <td style={wrap}>{r?.RCA_1 || "—"}</td>
// //                 <td style={wrap}>{r?.CAPA_1 || "—"}</td>
// //                 <td style={wrap}>{r?.Deparment_Head_Feedback || "—"}</td>
// //                 <td style={nowrap}>{r?.Auditor_Feedback_2 || "—"}</td>
// //               </tr>
// //             ))}
// //           </tbody>
// //         </table>
// //       </div>
// //     </div>
// //   );
// // }

// // /* ===================== BASIC UI ===================== */
// // function Panel({ title, subtitle, tint, children, headerRight }) {
// //   /**
// //    * ✅ Key: Panel itself never causes page scroll.
// //    * - Panel header is fixed inside panel.
// //    * - Panel body is the only scroll area.
// //    */
// //   return (
// //     <div
// //       style={{
// //         borderRadius: 18,
// //         backgroundColor: UI.surface,
// //         border: `1px solid ${UI.border}`,
// //         boxShadow: cardShadow,
// //         overflow: "hidden",
// //         display: "flex",
// //         flexDirection: "column",
// //         minHeight: 0,
// //         minWidth: 0,
// //         height: "100%",
// //       }}
// //     >
// //       <div
// //         style={{
// //           padding: "12px 14px",
// //           borderBottom: `1px solid ${UI.border}`,
// //           backgroundColor: tint,
// //           display: "flex",
// //           alignItems: "center",
// //           justifyContent: "space-between",
// //           gap: 10,
// //           minWidth: 0,
// //           flex: "0 0 auto",
// //         }}
// //       >
// //         <div style={{ minWidth: 0 }}>
// //           <div style={{ fontSize: 13, fontWeight: 950, color: UI.text, WebkitTextFillColor: UI.text }}>{title}</div>
// //           {subtitle ? <div style={{ fontSize: 12, color: UI.muted, WebkitTextFillColor: UI.muted, marginTop: 2 }}>{subtitle}</div> : null}
// //         </div>
// //         {headerRight ? <div style={{ flex: "0 0 auto" }}>{headerRight}</div> : null}
// //       </div>

// //       {/* ✅ Only this body scrolls */}
// //       <div
// //         style={{
// //           padding: 12,
// //           overflowY: "auto",
// //           overflowX: "hidden",
// //           display: "flex",
// //           flexDirection: "column",
// //           gap: 10,
// //           minHeight: 0,
// //           minWidth: 0,
// //           flex: "1 1 auto",
// //         }}
// //       >
// //         {children}
// //       </div>
// //     </div>
// //   );
// // }

// // function Empty({ children }) {
// //   return <div style={{ padding: 14, color: UI.muted, WebkitTextFillColor: UI.muted, fontSize: 13 }}>{children}</div>;
// // }

// // function ErrorText({ children }) {
// //   return <div style={{ padding: 14, color: UI.danger, WebkitTextFillColor: UI.danger, fontSize: 13 }}>{children}</div>;
// // }

// // function Meta({ label, value }) {
// //   return (
// //     <div style={{ display: "flex", flexDirection: "column", gap: 2, minWidth: 0 }}>
// //       <div style={{ fontSize: 11, fontWeight: 900, color: UI.muted, WebkitTextFillColor: UI.muted }}>{label}</div>
// //       <div style={{ fontSize: 12, color: UI.text, WebkitTextFillColor: UI.text, fontWeight: 800, wordBreak: "break-word", minWidth: 0 }}>
// //         {value == null || value === "" ? "—" : String(value)}
// //       </div>
// //     </div>
// //   );
// // }

// // /* ===================== COLLAPSED RAIL ===================== */
// // function CollapsedRail({ title, subtitle, onExpand }) {
// //   return (
// //     <div
// //       onClick={onExpand}
// //       title="Click to expand"
// //       style={{
// //         height: "100%",
// //         borderRadius: 18,
// //         border: `1px solid ${UI.border}`,
// //         background: UI.surface,
// //         boxShadow: cardShadow,
// //         overflow: "hidden",
// //         cursor: "pointer",
// //         display: "flex",
// //         flexDirection: "column",
// //         userSelect: "none",
// //         minWidth: 0,
// //       }}
// //     >
// //       <div
// //         style={{
// //           background: UI.bg,
// //           borderBottom: `1px solid ${UI.border}`,
// //           padding: 10,
// //           display: "flex",
// //           alignItems: "center",
// //           justifyContent: "center",
// //           gap: 8,
// //         }}
// //       >
// //         <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
// //           <path d="M10 7l5 5-5 5" stroke={UI.text} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
// //         </svg>
// //       </div>

// //       <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: 10 }}>
// //         <div
// //           style={{
// //             writingMode: "vertical-rl",
// //             transform: "rotate(180deg)",
// //             display: "flex",
// //             alignItems: "center",
// //             gap: 8,
// //             color: UI.text,
// //             WebkitTextFillColor: UI.text,
// //             fontWeight: 950,
// //             fontSize: 12,
// //             whiteSpace: "nowrap",
// //           }}
// //         >
// //           {title}
// //           {subtitle ? <span style={{ color: UI.muted, WebkitTextFillColor: UI.muted, fontWeight: 800, fontSize: 11 }}>{subtitle}</span> : null}
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }

// // /* ===================== ICON BUTTON ===================== */
// // function IconBtn({ title, onClick, children }) {
// //   return (
// //     <button
// //       title={title}
// //       onClick={onClick}
// //       style={{
// //         width: 34,
// //         height: 34,
// //         borderRadius: 12,
// //         border: `1px solid ${UI.border}`,
// //         background: UI.surface,
// //         cursor: "pointer",
// //         display: "inline-flex",
// //         alignItems: "center",
// //         justifyContent: "center",
// //         padding: 0,
// //       }}
// //     >
// //       {children}
// //     </button>
// //   );
// // }

// // /* ===================== FULL PAGE OVERLAY (Version details) ===================== */
// // function FullPageOverlay({ open, title, subtitle, onClose, children }) {
// //   if (!open) return null;

// //   // ✅ Overlay covers the whole custom component area (fixed to viewport)
// //   return (
// //     <div
// //       style={{
// //         position: "fixed",
// //         inset: 0,
// //         zIndex: 99998,
// //         background: UI.bg,
// //         display: "flex",
// //         flexDirection: "column",
// //         overflow: "hidden", // ✅ no scroll outside
// //       }}
// //     >
// //       {/* ✅ Overlay header (static) */}
// //       <div
// //         style={{
// //           padding: "12px 18px",
// //           backgroundColor: UI.surface,
// //           boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
// //           display: "flex",
// //           alignItems: "center",
// //           gap: 12,
// //           zIndex: 2,
// //           borderBottom: `1px solid ${UI.border}`,
// //           flex: "0 0 auto",
// //           boxSizing: "border-box",
// //         }}
// //       >
// //         <button
// //           onClick={onClose}
// //           style={{
// //             height: 36,
// //             padding: "0 12px",
// //             borderRadius: 12,
// //             border: `1px solid ${UI.border}`,
// //             background: UI.surface,
// //             cursor: "pointer",
// //             fontSize: 13,
// //             fontWeight: 900,
// //             color: UI.text,
// //             WebkitTextFillColor: UI.text,
// //             display: "inline-flex",
// //             alignItems: "center",
// //             gap: 8,
// //           }}
// //           title="Back"
// //         >
// //           <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
// //             <path d="M15 18l-6-6 6-6" stroke={UI.text} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
// //           </svg>
// //           Back
// //         </button>

// //         <div style={{ minWidth: 0 }}>
// //           <div style={{ fontSize: 15, fontWeight: 950, color: UI.text, WebkitTextFillColor: UI.text, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
// //             {title}
// //           </div>
// //           {subtitle ? (
// //             <div style={{ fontSize: 12, color: UI.muted, WebkitTextFillColor: UI.muted, marginTop: 2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
// //               {subtitle}
// //             </div>
// //           ) : null}
// //         </div>
// //       </div>

// //       {/* ✅ Overlay body: only this area can scroll */}
// //       <div
// //         style={{
// //           flex: "1 1 auto",
// //           minHeight: 0,
// //           padding: 12,
// //           overflow: "auto", // ✅ overlay body scroll only
// //           boxSizing: "border-box",
// //         }}
// //       >
// //         {children}
// //       </div>
// //     </div>
// //   );
// // }

// // /* ===================== MAIN PAGE ===================== */
// // export function DefaultLandingComponent() {
// //   const [ready, setReady] = useState(false);

// //   const [loadingList, setLoadingList] = useState(false);
// //   const [listError, setListError] = useState("");
// //   const [rawListRows, setRawListRows] = useState([]);

// //   const [search, setSearch] = useState("");
// //   const [filters, setFilters] = useState({ site: "all", type: "all", startDate: "", endDate: "" });
// //   const [filterOpen, setFilterOpen] = useState(false);

// //   const [selectedAuditId, setSelectedAuditId] = useState(null);
// //   const [selectedVersionRowId, setSelectedVersionRowId] = useState(null);

// //   const [loadingDetail, setLoadingDetail] = useState(false);
// //   const [detailError, setDetailError] = useState("");
// //   const [detail, setDetail] = useState(null);

// //   const [collapseMode, setCollapseMode] = useState("none"); // "none" | "audit" | "both"

// //   // ✅ NEW: full-page details overlay
// //   const [detailsFullscreen, setDetailsFullscreen] = useState(false);

// //   const listAbortRef = useRef(false);
// //   const detailAbortRef = useRef(false);

// //   useEffect(() => {
// //     let cancelled = false;
// //     const boot = async () => {
// //       let attempts = 0;
// //       while ((!kf.account?._id || !kf.user?._id) && !cancelled && attempts < 40) {
// //         await delay(200);
// //         attempts += 1;
// //       }
// //       if (cancelled) return;
// //       setReady(Boolean(kf.account?._id));
// //     };
// //     boot();
// //     return () => {
// //       cancelled = true;
// //     };
// //   }, []);

// //   const loadVersionList = async ({ silent = false } = {}) => {
// //     const accId = kf.account?._id;
// //     if (!accId) return;

// //     if (!silent) setLoadingList(true);
// //     setListError("");
// //     listAbortRef.current = false;

// //     const urlWithAcc = buildListUrl({ accId, withAccount: true });
// //     const urlWithoutAcc = buildListUrl({ accId, withAccount: false });

// //     try {
// //       const { res } = await kfApiTryMany([urlWithAcc, urlWithoutAcc]);
// //       if (listAbortRef.current) return;

// //       const rows =
// //         Array.isArray(res?.Data) ? res.Data :
// //         Array.isArray(res?.data) ? res.data :
// //         Array.isArray(res?.Items) ? res.Items :
// //         Array.isArray(res?.items) ? res.items :
// //         [];

// //       setRawListRows(rows);

// //       if (!selectedAuditId && rows.length > 0) {
// //         const firstAuditId = rows[0]?.Audit_ID;
// //         if (firstAuditId) setSelectedAuditId(firstAuditId);
// //       }
// //     } catch (e) {
// //       if (listAbortRef.current) return;
// //       setListError(e?.message || "Failed to load audits list.");
// //       setRawListRows([]);
// //     } finally {
// //       if (!listAbortRef.current && !silent) setLoadingList(false);
// //     }
// //   };

// //   useEffect(() => {
// //     if (!ready) return;
// //     loadVersionList({ silent: false });
// //     const t = setInterval(() => loadVersionList({ silent: true }), 12000);
// //     return () => {
// //       clearInterval(t);
// //       listAbortRef.current = true;
// //     };
// //     // eslint-disable-next-line react-hooks/exhaustive-deps
// //   }, [ready]);

// //   const loadVersionDetail = async (rowId) => {
// //     const accId = kf.account?._id;
// //     if (!accId || !rowId) return;

// //     setDetailError("");
// //     setLoadingDetail(true);
// //     detailAbortRef.current = false;

// //     const urls = buildDetailUrls({ accId, rowId });

// //     try {
// //       const { res } = await kfApiTryMany(urls);
// //       if (detailAbortRef.current) return;

// //       const payload = res?.Data ? res.Data : res?.data ? res.data : res;
// //       setDetail(payload || null);
// //     } catch (e) {
// //       if (detailAbortRef.current) return;
// //       setDetailError(e?.message || "Failed to load version details.");
// //       setDetail(null);
// //     } finally {
// //       if (!detailAbortRef.current) setLoadingDetail(false);
// //     }
// //   };

// //   const audits = useMemo(() => buildAuditGroups(rawListRows), [rawListRows]);

// //   const availableSites = useMemo(() => {
// //     const set = new Set();
// //     rawListRows.forEach((r) => r?.Site_Name && set.add(r.Site_Name));
// //     return Array.from(set).sort((a, b) => String(a).localeCompare(String(b)));
// //   }, [rawListRows]);

// //   const availableTypes = useMemo(() => {
// //     const set = new Set();
// //     rawListRows.forEach((r) => r?.Audit_Type && set.add(r.Audit_Type));
// //     return Array.from(set).sort((a, b) => String(a).localeCompare(String(b)));
// //   }, [rawListRows]);

// //   const filteredAudits = useMemo(() => {
// //     const q = search.trim().toLowerCase();
// //     const startMs = filters.startDate ? new Date(filters.startDate).getTime() : null;
// //     const endMs = filters.endDate ? new Date(filters.endDate).getTime() : null;

// //     return audits.filter((a) => {
// //       if (filters.site !== "all" && a.siteName !== filters.site) return false;
// //       if (filters.type !== "all" && a.auditType !== filters.type) return false;

// //       if (startMs || endMs) {
// //         const d = a.scheduledDate ? new Date(a.scheduledDate).getTime() : null;
// //         if (d == null) return false;
// //         if (startMs && d < startMs) return false;
// //         if (endMs && d > endMs) return false;
// //       }

// //       if (!q) return true;
// //       const hay = [a.auditId, a.siteName, a.auditType, safeUserName(a.auditor), safeUserName(a.auditee)].join(" ").toLowerCase();
// //       return hay.includes(q);
// //     });
// //   }, [audits, search, filters]);

// //   const selectedAudit = useMemo(
// //     () => filteredAudits.find((a) => a.auditId === selectedAuditId) || null,
// //     [filteredAudits, selectedAuditId]
// //   );

// //   /**
// //    * ✅ IMPORTANT FIX:
// //    * - Grid always contains at least one flexible column (1fr),
// //    * - So the grid ALWAYS fills the available width and never shrinks.
// //    *
// //    * Column sizing intent:
// //    * - Normal:    audits fixed, versions fixed, details takes remaining (1fr)
// //    * - audit:     audits collapsed 56px, versions fixed, details 1fr
// //    * - both:      audits collapsed 56px, versions collapsed 56px, details 1fr
// //    */
// //   const gridTemplateColumns = useMemo(() => {
// //     const AUDIT_W = "360px";
// //     const VERSION_W = "320px";
// //     const COLLAPSED = "56px";

// //     if (collapseMode === "both") return `${COLLAPSED} ${COLLAPSED} 1fr`;
// //     if (collapseMode === "audit") return `${COLLAPSED} ${VERSION_W} 1fr`;
// //     return `${AUDIT_W} ${VERSION_W} 1fr`;
// //   }, [collapseMode]);

// //   // auto-collapse on version select (keeping your behavior)
// //   useEffect(() => {
// //     if (selectedVersionRowId) setCollapseMode("audit");
// //   }, [selectedVersionRowId]);

// //   const filterIconBtn = {
// //     width: 36,
// //     height: 36,
// //     borderRadius: 12,
// //     border: `1px solid ${UI.border}`,
// //     background: UI.surface,
// //     cursor: "pointer",
// //     display: "inline-flex",
// //     alignItems: "center",
// //     justifyContent: "center",
// //     padding: 0,
// //   };

// //   const topBtn = {
// //     height: 36,
// //     padding: "0 12px",
// //     borderRadius: 999,
// //     border: `1px solid ${UI.text}`,
// //     background: UI.surface,
// //     cursor: "pointer",
// //     fontSize: 13,
// //     fontWeight: 900,
// //     color: UI.text,
// //     WebkitTextFillColor: UI.text,
// //   };

// //   // ✅ Used in details header right to open fullscreen
// //   const expandBtnStyle = {
// //     height: 34,
// //     padding: "0 10px",
// //     borderRadius: 12,
// //     border: `1px solid ${UI.border}`,
// //     background: UI.surface,
// //     cursor: "pointer",
// //     fontSize: 12,
// //     fontWeight: 900,
// //     color: UI.text,
// //     WebkitTextFillColor: UI.text,
// //     display: "inline-flex",
// //     alignItems: "center",
// //     gap: 8,
// //   };

// //   /* ===================== FULL SIZE LAYOUT (NO OUTER SCROLL) ===================== */
// //   return (
// //     <div
// //       style={{
// //         /**
// //          * ✅ MUST be full size of parent
// //          * - If Kissflow container gives a height, this will fill it.
// //          * - If parent is not full height, you must ensure parent container is full height too.
// //          */
// //         width: "100%",
// //         height: "100%",
// //         minWidth: 0,
// //         minHeight: 0,
// //         display: "flex",
// //         flexDirection: "column",
// //         backgroundColor: UI.bg,
// //         color: UI.text,
// //         fontFamily: "Inter, system-ui, sans-serif",

// //         /**
// //          * ✅ NO PAGE SCROLL
// //          * - Entire component is clipped
// //          * - Only inner panel bodies can scroll
// //          */
// //         overflow: "hidden",
// //         boxSizing: "border-box",
// //       }}
// //     >
// //       <FilterDrawer
// //         open={filterOpen}
// //         onClose={() => setFilterOpen(false)}
// //         availableSites={availableSites}
// //         availableTypes={availableTypes}
// //         filters={filters}
// //         setFilters={setFilters}
// //       />

// //       {/* ✅ Full page overlay for details (same content, just full screen) */}
// //       <FullPageOverlay
// //         open={detailsFullscreen}
// //         onClose={() => setDetailsFullscreen(false)}
// //         title={detail ? `${detail?.Audit_ID || "—"} • ${fmtVersion(detail?.Version)}` : "Version Details"}
// //         subtitle={
// //           detail
// //             ? `${detail?.Audit_Type || "—"} • ${detail?.Site_Name || "—"} • ${fmtDate(detail?.Audit_Scheduled_Date)}`
// //             : ""
// //         }
// //       >
// //         {/* Reuse the same details card content */}
// //         {!selectedVersionRowId && <Empty>Choose a version to view details.</Empty>}
// //         {selectedVersionRowId && loadingDetail && (
// //           <div
// //             style={{
// //               width: "100%",
// //               borderRadius: 16,
// //               border: `1px solid ${UI.border}`,
// //               background: UI.surface,
// //               padding: 18,
// //               fontWeight: 900,
// //               color: UI.muted,
// //               WebkitTextFillColor: UI.muted,
// //               textAlign: "center",
// //             }}
// //           >
// //             Loading…
// //           </div>
// //         )}
// //         {selectedVersionRowId && !loadingDetail && detailError && <ErrorText>{detailError}</ErrorText>}

// //         {selectedVersionRowId && detail && (
// //           <div
// //             style={{
// //               border: `1px solid ${UI.border}`,
// //               borderRadius: 18,
// //               padding: 14,
// //               backgroundColor: UI.surface,
// //               boxShadow: cardShadow,
// //               minWidth: 0,
// //             }}
// //           >
// //             <div style={{ fontSize: 14, fontWeight: 950, color: UI.text, WebkitTextFillColor: UI.text }}>
// //               {detail?.Audit_ID || "—"} • {fmtVersion(detail?.Version)}
// //             </div>

// //             <div style={{ marginTop: 6, fontSize: 12, color: UI.muted, WebkitTextFillColor: UI.muted }}>
// //               {(detail?.Audit_Type || "—") + " • " + (detail?.Site_Name || "—") + " • " + fmtDate(detail?.Audit_Scheduled_Date)}
// //             </div>

// //             <div style={{ marginTop: 12, display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, minWidth: 0 }}>
// //               <Meta label="Site" value={detail?.Site_Name} />
// //               <Meta label="Scheduled Date" value={fmtDate(detail?.Audit_Scheduled_Date)} />
// //               <Meta label="Audit Type" value={detail?.Audit_Type} />
// //             </div>

// //             <div style={{ marginTop: 10, display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, minWidth: 0 }}>
// //               <Meta label="Auditor" value={safeUserName(detail?.Auditor)} />
// //               <Meta label="Auditee" value={safeUserName(detail?.Auditee)} />
// //               <Meta label="Department Head" value={safeUserName(detail?.Department_Head)} />
// //             </div>

// //             <DetailTable rows={detail?.["Table::Untitled_Table"] || []} />
// //           </div>
// //         )}
// //       </FullPageOverlay>

// //       {/* ===================== TOP BAR (STATIC) ===================== */}
// //       <div
// //         style={{
// //           /**
// //            * ✅ Header is fixed INSIDE component (not scrolling)
// //            * ✅ Never changes width due to grid collapse
// //            */
// //           width: "100%",
// //           padding: "12px 18px",
// //           backgroundColor: UI.surface,
// //           boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
// //           display: "flex",
// //           alignItems: "center",
// //           gap: 12,
// //           zIndex: 2,
// //           borderBottom: `1px solid ${UI.border}`,
// //           flex: "0 0 auto",
// //           boxSizing: "border-box",
// //         }}
// //       >
// //         <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
// //           <div
// //             style={{
// //               width: 36,
// //               height: 36,
// //               borderRadius: 12,
// //               backgroundColor: UI.tintB,
// //               display: "flex",
// //               alignItems: "center",
// //               justifyContent: "center",
// //               border: "1px solid #E9D5FF",
// //               color: "#5B21B6",
// //               WebkitTextFillColor: "#5B21B6",
// //               fontWeight: 950,
// //               fontSize: 14,
// //             }}
// //           >
// //             V
// //           </div>
// //           <div style={{ fontSize: 15, fontWeight: 950, color: UI.text, WebkitTextFillColor: UI.text }}>Audit Versions</div>
// //         </div>

// //         <div style={{ flex: 1 }} />

// //         <input
// //           value={search}
// //           onChange={(e) => setSearch(e.target.value)}
// //           onKeyDown={(e) => e.stopPropagation()}
// //           onMouseDown={(e) => e.stopPropagation()}
// //           placeholder="Search audit, site, type, auditor…"
// //           autoComplete="off"
// //           style={{
// //             width: 360,
// //             maxWidth: "42vw",
// //             padding: "9px 12px",
// //             borderRadius: 999,
// //             border: `1px solid ${UI.border}`,
// //             outline: "none",
// //             fontSize: 13,
// //             backgroundColor: "#F9FAFB",
// //             color: UI.text,
// //             WebkitTextFillColor: UI.text,
// //             caretColor: UI.text,
// //           }}
// //         />

// //         <button style={filterIconBtn} onClick={() => setFilterOpen(true)} title="Filters">
// //           <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
// //             <path d="M4 7h16" stroke={UI.text} strokeWidth="2" strokeLinecap="round" />
// //             <path d="M7 12h13" stroke={UI.text} strokeWidth="2" strokeLinecap="round" />
// //             <path d="M10 17h10" stroke={UI.text} strokeWidth="2" strokeLinecap="round" />
// //           </svg>
// //         </button>

// //         <button onClick={() => loadVersionList({ silent: false })} style={topBtn} title="Refresh">
// //           Refresh
// //         </button>
// //       </div>

// //       {/* ===================== BODY (NO OUTER SCROLL) ===================== */}
// //       <div
// //         style={{
// //           /**
// //            * ✅ Body fills remaining height and clips overflow
// //            * ✅ Prevents whole page scroll
// //            */
// //           flex: "1 1 auto",
// //           minHeight: 0,
// //           minWidth: 0,
// //           padding: 12,
// //           overflow: "hidden",
// //           backgroundColor: UI.bg,
// //           boxSizing: "border-box",
// //         }}
// //       >
// //         <div
// //           style={{
// //             /**
// //              * ✅ Grid always full size and never shrinks
// //              * - width/height 100%
// //              * - details column uses 1fr to fill remaining width
// //              */
// //             width: "100%",
// //             height: "100%",
// //             minHeight: 0,
// //             minWidth: 0,
// //             display: "grid",
// //             gridTemplateColumns,
// //             gap: 12,

// //             /**
// //              * ✅ NO grid scroll
// //              * Only panels scroll in their bodies
// //              */
// //             overflow: "hidden",

// //             transition: "grid-template-columns 180ms ease",
// //             backgroundColor: UI.bg,
// //             boxSizing: "border-box",
// //           }}
// //         >
// //           {/* ===================== LEFT (Audits) ===================== */}
// //           {collapseMode === "audit" || collapseMode === "both" ? (
// //             <CollapsedRail title="Audits" subtitle={selectedAuditId || ""} onExpand={() => setCollapseMode("none")} />
// //           ) : (
// //             <Panel
// //               title="Audits"
// //               subtitle={loadingList ? "Loading…" : listError ? "Error loading audits" : `${filteredAudits.length} shown`}
// //               tint={UI.tintB}
// //               headerRight={
// //                 <IconBtn title="Collapse audits" onClick={() => setCollapseMode("audit")}>
// //                   <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
// //                     <path d="M15 6l-6 6 6 6" stroke={UI.text} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
// //                   </svg>
// //                 </IconBtn>
// //               }
// //             >
// //               {!ready && <Empty>Waiting for Kissflow context…</Empty>}
// //               {ready && loadingList && <Empty>Loading audits…</Empty>}
// //               {ready && !loadingList && listError && <ErrorText>{listError}</ErrorText>}
// //               {ready && !loadingList && !listError && filteredAudits.length === 0 && <Empty>No audits match your filters.</Empty>}

// //               {filteredAudits.map((a) => {
// //                 const active = a.auditId === selectedAuditId;
// //                 return (
// //                   <div
// //                     key={a.auditId}
// //                     onClick={() => {
// //                       setSelectedAuditId(a.auditId);
// //                       setSelectedVersionRowId(null);
// //                       setDetail(null);
// //                       setDetailError("");
// //                     }}
// //                     style={{
// //                       cursor: "pointer",
// //                       borderRadius: 16,
// //                       border: active ? `2px solid ${UI.accent2}` : `1px solid ${UI.border}`,
// //                       backgroundColor: active ? UI.tintB : UI.surface,
// //                       padding: 12,
// //                       transition: "0.15s ease",
// //                       minWidth: 0,
// //                     }}
// //                   >
// //                     <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, minWidth: 0 }}>
// //                       <div style={{ fontSize: 13, fontWeight: 950, color: UI.text, WebkitTextFillColor: UI.text, minWidth: 0 }}>
// //                         {a.auditId}
// //                       </div>
// //                       <div style={chipStyle("#EDE9FE", "#5B21B6", "#C4B5FD")}>{a.versionCount} versions</div>
// //                     </div>

// //                     <div style={{ marginTop: 8, display: "flex", flexWrap: "wrap", gap: 8, minWidth: 0 }}>
// //                       <span style={auditTypePill(a.auditType)}>{a.auditType || "—"}</span>
// //                       <span style={chipStyle("#F3F4F6", "#374151", UI.border)}>{fmtDate(a.scheduledDate)}</span>
// //                       <span style={chipStyle("#F3F4F6", "#374151", UI.border)}>{a.siteName || "—"}</span>
// //                     </div>

// //                     <div style={{ marginTop: 10, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, minWidth: 0 }}>
// //                       <Meta label="Auditor" value={safeUserName(a.auditor)} />
// //                       <Meta label="Auditee" value={safeUserName(a.auditee)} />
// //                     </div>
// //                   </div>
// //                 );
// //               })}
// //             </Panel>
// //           )}

// //           {/* ===================== MIDDLE (Versions) ===================== */}
// //           {collapseMode === "both" ? (
// //             <CollapsedRail title="Versions" subtitle={detail?.Version ? fmtVersion(detail?.Version) : ""} onExpand={() => setCollapseMode("audit")} />
// //           ) : (
// //             <Panel
// //               title="Versions"
// //               subtitle={selectedAudit ? `For ${selectedAudit.auditId}` : "Select an audit"}
// //               tint={UI.tintA}
// //               headerRight={
// //                 <IconBtn title="Collapse versions" onClick={() => setCollapseMode("both")}>
// //                   <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
// //                     <path d="M15 6l-6 6 6 6" stroke={UI.text} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
// //                   </svg>
// //                 </IconBtn>
// //               }
// //             >
// //               {!selectedAudit && <Empty>Pick an audit to see versions.</Empty>}

// //               {selectedAudit &&
// //                 selectedAudit.versions.map((v) => {
// //                   const active = v.rowId === selectedVersionRowId;
// //                   return (
// //                     <div
// //                       key={v.rowId}
// //                       onClick={() => {
// //                         setSelectedVersionRowId(v.rowId);
// //                         loadVersionDetail(v.rowId);
// //                       }}
// //                       style={{
// //                         cursor: "pointer",
// //                         borderRadius: 16,
// //                         border: active ? `2px solid ${UI.accent}` : `1px solid ${UI.border}`,
// //                         backgroundColor: active ? "#EFF6FF" : UI.surface,
// //                         padding: 12,
// //                         transition: "0.15s ease",
// //                         minWidth: 0,
// //                       }}
// //                     >
// //                       <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10, minWidth: 0 }}>
// //                         <div style={{ fontSize: 13, fontWeight: 950, color: UI.text, WebkitTextFillColor: UI.text }}>
// //                           {v.versionLabel}
// //                         </div>
// //                         <div style={chipStyle("#DBEAFE", "#1D4ED8", "#93C5FD")}>{fmtDate(v.scheduledDate)}</div>
// //                       </div>

// //                       <div style={{ marginTop: 8, display: "flex", flexWrap: "wrap", gap: 8 }}>
// //                         <span style={auditTypePill(v.auditType)}>{v.auditType || "—"}</span>
// //                       </div>
// //                     </div>
// //                   );
// //                 })}
// //             </Panel>
// //           )}

// //           {/* ===================== RIGHT (Details) ===================== */}
// //           <Panel
// //             title="Version Details"
// //             subtitle={selectedVersionRowId ? "" : "Select a version"}
// //             tint={UI.tintC}
// //             headerRight={
// //               /**
// //                * ✅ NEW: Expand (full page) button
// //                * - Only enabled when a version is selected
// //                * - Does not change any mapping/content
// //                */
// //               <button
// //                 style={{
// //                   ...expandBtnStyle,
// //                   opacity: selectedVersionRowId ? 1 : 0.5,
// //                   pointerEvents: selectedVersionRowId ? "auto" : "none",
// //                 }}
// //                 onClick={() => setDetailsFullscreen(true)}
// //                 title="Expand to full page"
// //               >
// //                 <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
// //                   <path d="M9 3H5a2 2 0 0 0-2 2v4" stroke={UI.text} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
// //                   <path d="M15 21h4a2 2 0 0 0 2-2v-4" stroke={UI.text} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
// //                   <path d="M21 9V5a2 2 0 0 0-2-2h-4" stroke={UI.text} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
// //                   <path d="M3 15v4a2 2 0 0 0 2 2h4" stroke={UI.text} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
// //                 </svg>
// //                 Expand
// //               </button>
// //             }
// //           >
// //             <div style={{ position: "relative", minHeight: 240, minWidth: 0 }}>
// //               {loadingDetail && selectedVersionRowId && (
// //                 <div
// //                   style={{
// //                     position: "absolute",
// //                     inset: 0,
// //                     background: UI.surface,
// //                     zIndex: 3,
// //                     display: "flex",
// //                     alignItems: "center",
// //                     justifyContent: "center",
// //                     fontWeight: 900,
// //                     color: UI.muted,
// //                     WebkitTextFillColor: UI.muted,
// //                     borderRadius: 16,
// //                     border: `1px solid ${UI.border}`,
// //                   }}
// //                 >
// //                   Loading…
// //                 </div>
// //               )}

// //               {!selectedVersionRowId && <Empty>Choose a version to view details.</Empty>}
// //               {selectedVersionRowId && !loadingDetail && detailError && <ErrorText>{detailError}</ErrorText>}

// //               {selectedVersionRowId && detail && (
// //                 <div
// //                   style={{
// //                     border: `1px solid ${UI.border}`,
// //                     borderRadius: 18,
// //                     padding: 14,
// //                     backgroundColor: UI.surface,
// //                     boxShadow: cardShadow,
// //                     minWidth: 0,
// //                   }}
// //                 >
// //                   <div style={{ fontSize: 14, fontWeight: 950, color: UI.text, WebkitTextFillColor: UI.text }}>
// //                     {detail?.Audit_ID || "—"} • {fmtVersion(detail?.Version)}
// //                   </div>

// //                   <div style={{ marginTop: 6, fontSize: 12, color: UI.muted, WebkitTextFillColor: UI.muted }}>
// //                     {(detail?.Audit_Type || "—") + " • " + (detail?.Site_Name || "—") + " • " + fmtDate(detail?.Audit_Scheduled_Date)}
// //                   </div>

// //                   <div style={{ marginTop: 12, display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, minWidth: 0 }}>
// //                     <Meta label="Site" value={detail?.Site_Name} />
// //                     <Meta label="Scheduled Date" value={fmtDate(detail?.Audit_Scheduled_Date)} />
// //                     <Meta label="Audit Type" value={detail?.Audit_Type} />
// //                   </div>

// //                   <div style={{ marginTop: 10, display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, minWidth: 0 }}>
// //                     <Meta label="Auditor" value={safeUserName(detail?.Auditor)} />
// //                     <Meta label="Auditee" value={safeUserName(detail?.Auditee)} />
// //                     <Meta label="Department Head" value={safeUserName(detail?.Department_Head)} />
// //                   </div>

// //                   <DetailTable rows={detail?.["Table::Untitled_Table"] || []} />
// //                 </div>
// //               )}
// //             </div>
// //           </Panel>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }

// // export default DefaultLandingComponent;

// // //-----=====================-------------------------------------------------- */
// import React, { useEffect, useMemo, useRef, useState } from "react";
// import { kf } from "./../sdk/index.js";

// /* ===================== CONSTANT LIGHT THEME (NO DARK / NO TRANSPARENT BG) ===================== */
// const UI = {
//   bg: "#F3F4F6",
//   surface: "#FFFFFF",
//   border: "#E5E7EB",
//   text: "#111827",
//   muted: "#6B7280",
//   tintA: "#EEF2FF",
//   tintB: "#F5F3FF",
//   tintC: "#ECFDF5",
//   accent: "#2563EB",
//   accent2: "#7C3AED",
//   danger: "#B91C1C",
// };

// const FLOW_ID = "Version_Master_A00";
// const APP_ID = "Ac9Pds4TaXkR";
// const LIST_PAGE_SIZE = 100000;

// const delay = (ms) => new Promise((r) => setTimeout(r, ms));

// const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
// const fmtDate = (ymd) => {
//   if (!ymd) return "—";
//   const d = new Date(ymd);
//   if (Number.isNaN(d.getTime())) return String(ymd);
//   return `${d.getDate()} ${monthNames[d.getMonth()]} ${d.getFullYear()}`;
// };

// const safeUserName = (u) => u?.Name || u?.DisplayName || u?.Email || "—";

// const fmtVersion = (v) => {
//   if (v == null || v === "") return "V—";
//   const s = String(v).trim();
//   const m = s.match(/^v\s*(\d+)$/i);
//   if (m?.[1]) return `V${m[1]}`;
//   const n = Number(s);
//   if (!Number.isNaN(n) && Number.isFinite(n)) return `V${String(n)}`;
//   return s.toUpperCase().startsWith("V") ? s.toUpperCase() : `V${s}`;
// };

// const chipStyle = (bg, fg, border) => ({
//   display: "inline-flex",
//   alignItems: "center",
//   padding: "2px 10px",
//   borderRadius: 999,
//   fontSize: 11,
//   fontWeight: 800,
//   backgroundColor: bg,
//   color: fg,
//   WebkitTextFillColor: fg,
//   border: `1px solid ${border}`,
//   whiteSpace: "nowrap",
// });

// const cardShadow = "0 8px 18px rgba(17, 24, 39, 0.06)";

// const buildListUrl = ({ accId, withAccount }) => {
//   const qs = `visited=1&page_number=1&page_size=${LIST_PAGE_SIZE}`;
//   return withAccount ? `/form/2/${accId}/${FLOW_ID}/list?${qs}` : `/form/2/${APP_ID}/${FLOW_ID}/list?${qs}`;
// };

// const buildDetailUrls = ({ accId, rowId }) => [
//   `/form/2/${accId}/${FLOW_ID}/${rowId}`,
//   `/form/2/${APP_ID}/${FLOW_ID}/${rowId}`,
//   `/form/2/${accId}/${APP_ID}/${FLOW_ID}/${rowId}`,
// ];

// async function kfApiTryMany(urls) {
//   let lastErr = null;
//   for (const url of urls) {
//     try {
//       const res = await kf.api(url);
//       return { res, usedUrl: url };
//     } catch (e) {
//       lastErr = e;
//     }
//   }
//   throw lastErr;
// }

// /** Group list rows by Audit_ID */
// const buildAuditGroups = (rows = []) => {
//   const map = new Map();
//   rows.forEach((r) => {
//     const auditId = r?.Audit_ID || "—";
//     if (!map.has(auditId)) map.set(auditId, []);
//     map.get(auditId).push(r);
//   });

//   const audits = Array.from(map.entries()).map(([auditId, items]) => {
//     const sorted = [...items].sort((a, b) => {
//       const av = a?.Version ?? "";
//       const bv = b?.Version ?? "";
//       const an = Number(av);
//       const bn = Number(bv);
//       if (!Number.isNaN(an) && !Number.isNaN(bn)) return bn - an;
//       return String(bv).localeCompare(String(av));
//     });

//     const pick = (key) => sorted.find((x) => x?.[key] != null)?.[key];

//     return {
//       auditId,
//       siteName: pick("Site_Name") || "—",
//       auditType: pick("Audit_Type") || "—",
//       scheduledDate: pick("Audit_Scheduled_Date") || null,
//       auditor: pick("Auditor") || null,
//       auditee: pick("Auditee") || null,
//       deptHead: pick("Department_Head") || null,
//       versions: sorted.map((x) => ({
//         rowId: x?._id,
//         versionLabel: fmtVersion(x?.Version),
//         scheduledDate: x?.Audit_Scheduled_Date ?? null,
//         auditType: x?.Audit_Type ?? pick("Audit_Type") ?? "—",
//       })),
//       versionCount: sorted.length,
//     };
//   });

//   audits.sort((a, b) => {
//     const ad = a.scheduledDate ? new Date(a.scheduledDate).getTime() : -Infinity;
//     const bd = b.scheduledDate ? new Date(b.scheduledDate).getTime() : -Infinity;
//     if (bd !== ad) return bd - ad;
//     return String(a.auditId).localeCompare(String(b.auditId));
//   });

//   return audits;
// };

// const auditTypePill = (auditType) => {
//   const t = String(auditType || "").toLowerCase();
//   if (t.includes("annual")) return chipStyle("#DBEAFE", "#1D4ED8", "#93C5FD");
//   if (t.includes("qgmp")) return chipStyle("#DCFCE7", "#166534", "#86EFAC");
//   return chipStyle("#EDE9FE", "#5B21B6", "#C4B5FD");
// };

// /* ===================== FILTER DRAWER (SOLID BG) ===================== */
// function FilterDrawer({ open, onClose, availableSites, availableTypes, filters, setFilters }) {
//   if (!open) return null;

//   const overlay = {
//     position: "fixed",
//     inset: 0,
//     zIndex: 99999,
//     display: "flex",
//     justifyContent: "flex-end",
//     background: UI.bg,
//     overflow: "hidden",
//   };

//   const panel = {
//     width: 360,
//     maxWidth: "92vw",
//     height: "100%",
//     background: UI.surface,
//     borderLeft: `1px solid ${UI.border}`,
//     boxShadow: "0 18px 48px rgba(15,23,42,0.12)",
//     padding: 12,
//     boxSizing: "border-box",
//     display: "flex",
//     flexDirection: "column",
//     gap: 10,
//     overflow: "hidden",
//   };

//   const label = {
//     fontSize: 11,
//     fontWeight: 900,
//     color: UI.text,
//     WebkitTextFillColor: UI.text,
//     marginBottom: 6,
//   };

//   const input = {
//     width: "100%",
//     height: 36,
//     padding: "0 10px",
//     borderRadius: 12,
//     border: `1px solid ${UI.border}`,
//     outline: "none",
//     fontSize: 13,
//     color: UI.text,
//     WebkitTextFillColor: UI.text,
//     background: UI.surface,
//     boxSizing: "border-box",
//     appearance: "none",
//     WebkitAppearance: "none",
//     MozAppearance: "none",
//   };

//   const option = { color: UI.text, WebkitTextFillColor: UI.text, backgroundColor: UI.surface };

//   const btn = {
//     height: 36,
//     padding: "0 12px",
//     borderRadius: 12,
//     border: `1px solid ${UI.text}`,
//     background: UI.surface,
//     cursor: "pointer",
//     fontSize: 13,
//     fontWeight: 900,
//     color: UI.text,
//     WebkitTextFillColor: UI.text,
//     display: "inline-flex",
//     alignItems: "center",
//     justifyContent: "center",
//     gap: 8,
//   };

//   return (
//     <div
//       style={overlay}
//       onMouseDown={(e) => {
//         if (e.target === e.currentTarget) onClose();
//       }}
//     >
//       <div style={panel} onMouseDown={(e) => e.stopPropagation()}>
//         <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
//           <div style={{ fontSize: 13, fontWeight: 950, color: UI.text, WebkitTextFillColor: UI.text }}>Filters</div>
//           <button style={btn} onClick={onClose}>
//             Close
//           </button>
//         </div>

//         <div>
//           <div style={label}>Site</div>
//           <select style={input} value={filters.site} onChange={(e) => setFilters((p) => ({ ...p, site: e.target.value }))}>
//             <option style={option} value="all">
//               All
//             </option>
//             {availableSites.map((s) => (
//               <option style={option} key={s} value={s}>
//                 {s}
//               </option>
//             ))}
//           </select>
//         </div>

//         <div>
//           <div style={label}>Audit Type</div>
//           <select style={input} value={filters.type} onChange={(e) => setFilters((p) => ({ ...p, type: e.target.value }))}>
//             <option style={option} value="all">
//               All
//             </option>
//             {availableTypes.map((t) => (
//               <option style={option} key={t} value={t}>
//                 {t}
//               </option>
//             ))}
//           </select>
//         </div>

//         <div>
//           <div style={label}>Start date</div>
//           <input style={input} type="date" value={filters.startDate} onChange={(e) => setFilters((p) => ({ ...p, startDate: e.target.value }))} />
//         </div>

//         <div>
//           <div style={label}>End date</div>
//           <input style={input} type="date" value={filters.endDate} onChange={(e) => setFilters((p) => ({ ...p, endDate: e.target.value }))} />
//         </div>

//         <div style={{ display: "flex", gap: 10, marginTop: "auto" }}>
//           <button
//             style={{ ...btn, flex: 1, border: `1px solid ${UI.border}` }}
//             onClick={() => setFilters({ site: "all", type: "all", startDate: "", endDate: "" })}
//           >
//             Reset
//           </button>
//           <button style={{ ...btn, flex: 1 }} onClick={onClose}>
//             Apply
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// /* ===================== TABLE ===================== */
// function DetailTable({ rows }) {
//   if (!Array.isArray(rows) || rows.length === 0) return null;

//   const th = {
//     textAlign: "left",
//     fontSize: 10,
//     fontWeight: 900,
//     color: UI.muted,
//     WebkitTextFillColor: UI.muted,
//     padding: "9px 10px",
//     borderBottom: `1px solid ${UI.border}`,
//     position: "sticky",
//     top: 0,
//     background: UI.surface,
//     zIndex: 2,
//     whiteSpace: "nowrap",
//   };

//   const td = {
//     fontSize: 12,
//     color: UI.text,
//     WebkitTextFillColor: UI.text,
//     padding: "9px 10px",
//     borderBottom: `1px solid ${UI.border}`,
//     verticalAlign: "top",
//   };

//   // ✅ IMPORTANT: remove forced minimum widths that break the grid.
//   // Keep content the same; just avoid forcing the whole column to expand.
//   const wrap = { ...td, whiteSpace: "pre-wrap", lineHeight: 1.35 };
//   const nowrap = { ...td, whiteSpace: "nowrap" };

//   return (
//     <div style={{ marginTop: 12, border: `1px solid ${UI.border}`, borderRadius: 18, overflow: "hidden" }}>
//       {/* ✅ This is the key: Horizontal scroll stays INSIDE details panel */}
//       <div
//         style={{
//           maxHeight: "100%",
//           overflowY: "auto",
//           overflowX: "auto",
//           background: UI.surface,
//           maxWidth: "100%",
//         }}
//       >
//         <table
//           style={{
//             // ✅ table can be wider than container, but will scroll INSIDE
//             width: "max-content",
//             minWidth: "100%",
//             borderCollapse: "separate",
//             borderSpacing: 0,
//           }}
//         >
//           <thead>
//             <tr>
//               <th style={th}>Element</th>
//               <th style={th}>Factor</th>
//               <th style={th}>Requirement</th>
//               <th style={th}>Observation</th>
//               <th style={th}>Rating</th>
//               <th style={th}>RCA</th>
//               <th style={th}>CAPA</th>
//               <th style={th}>Dept Head</th>
//               <th style={th}>Status</th>
//             </tr>
//           </thead>
//           <tbody>
//             {rows.map((r, idx) => (
//               <tr key={r?._id || `${idx}`}>
//                 <td style={nowrap}>{r?.Element || "—"}</td>
//                 <td style={wrap}>{r?.Factor || "—"}</td>
//                 <td style={wrap}>{r?.Requirement_1 || "—"}</td>
//                 <td style={wrap}>{r?.Observation || "—"}</td>
//                 <td style={nowrap}>{r?.Rating ?? "—"}</td>
//                 <td style={wrap}>{r?.RCA_1 || "—"}</td>
//                 <td style={wrap}>{r?.CAPA_1 || "—"}</td>
//                 <td style={wrap}>{r?.Deparment_Head_Feedback || "—"}</td>
//                 <td style={nowrap}>{r?.Auditor_Feedback_2 || "—"}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }

// /* ===================== BASIC UI ===================== */
// function Panel({ title, subtitle, tint, children, headerRight }) {
//   return (
//     <div
//       style={{
//         borderRadius: 18,
//         backgroundColor: UI.surface,
//         border: `1px solid ${UI.border}`,
//         boxShadow: cardShadow,
//         overflow: "hidden",
//         display: "flex",
//         flexDirection: "column",
//         minHeight: 0,
//         minWidth: 0, // ✅ allow shrinking inside grid
//         height: "100%",
//       }}
//     >
//       <div
//         style={{
//           padding: "12px 14px",
//           borderBottom: `1px solid ${UI.border}`,
//           backgroundColor: tint,
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "space-between",
//           gap: 10,
//           minWidth: 0,
//           flex: "0 0 auto",
//         }}
//       >
//         <div style={{ minWidth: 0 }}>
//           <div style={{ fontSize: 13, fontWeight: 950, color: UI.text, WebkitTextFillColor: UI.text }}>{title}</div>
//           {subtitle ? <div style={{ fontSize: 12, color: UI.muted, WebkitTextFillColor: UI.muted, marginTop: 2 }}>{subtitle}</div> : null}
//         </div>
//         {headerRight ? <div style={{ flex: "0 0 auto" }}>{headerRight}</div> : null}
//       </div>

//       <div
//         style={{
//           padding: 12,
//           overflowY: "auto",
//           overflowX: "hidden",
//           display: "flex",
//           flexDirection: "column",
//           gap: 10,
//           minHeight: 0,
//           minWidth: 0, // ✅ critical for grid to work correctly
//           flex: "1 1 auto",
//         }}
//       >
//         {children}
//       </div>
//     </div>
//   );
// }

// function Empty({ children }) {
//   return <div style={{ padding: 14, color: UI.muted, WebkitTextFillColor: UI.muted, fontSize: 13 }}>{children}</div>;
// }

// function ErrorText({ children }) {
//   return <div style={{ padding: 14, color: UI.danger, WebkitTextFillColor: UI.danger, fontSize: 13 }}>{children}</div>;
// }

// function Meta({ label, value }) {
//   return (
//     <div style={{ display: "flex", flexDirection: "column", gap: 2, minWidth: 0 }}>
//       <div style={{ fontSize: 11, fontWeight: 900, color: UI.muted, WebkitTextFillColor: UI.muted }}>{label}</div>
//       <div style={{ fontSize: 12, color: UI.text, WebkitTextFillColor: UI.text, fontWeight: 800, wordBreak: "break-word", minWidth: 0 }}>
//         {value == null || value === "" ? "—" : String(value)}
//       </div>
//     </div>
//   );
// }

// /* ===================== COLLAPSED RAIL ===================== */
// function CollapsedRail({ title, subtitle, onExpand }) {
//   return (
//     <div
//       onClick={onExpand}
//       title="Click to expand"
//       style={{
//         height: "100%",
//         borderRadius: 18,
//         border: `1px solid ${UI.border}`,
//         background: UI.surface,
//         boxShadow: cardShadow,
//         overflow: "hidden",
//         cursor: "pointer",
//         display: "flex",
//         flexDirection: "column",
//         userSelect: "none",
//         minWidth: 0,
//       }}
//     >
//       <div
//         style={{
//           background: UI.bg,
//           borderBottom: `1px solid ${UI.border}`,
//           padding: 10,
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "center",
//           gap: 8,
//         }}
//       >
//         <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
//           <path d="M10 7l5 5-5 5" stroke={UI.text} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
//         </svg>
//       </div>

//       <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: 10 }}>
//         <div
//           style={{
//             writingMode: "vertical-rl",
//             transform: "rotate(180deg)",
//             display: "flex",
//             alignItems: "center",
//             gap: 8,
//             color: UI.text,
//             WebkitTextFillColor: UI.text,
//             fontWeight: 950,
//             fontSize: 12,
//             whiteSpace: "nowrap",
//           }}
//         >
//           {title}
//           {subtitle ? <span style={{ color: UI.muted, WebkitTextFillColor: UI.muted, fontWeight: 800, fontSize: 11 }}>{subtitle}</span> : null}
//         </div>
//       </div>
//     </div>
//   );
// }

// /* ===================== ICON BUTTON ===================== */
// function IconBtn({ title, onClick, children }) {
//   return (
//     <button
//       title={title}
//       onClick={onClick}
//       style={{
//         width: 34,
//         height: 34,
//         borderRadius: 12,
//         border: `1px solid ${UI.border}`,
//         background: UI.surface,
//         cursor: "pointer",
//         display: "inline-flex",
//         alignItems: "center",
//         justifyContent: "center",
//         padding: 0,
//       }}
//     >
//       {children}
//     </button>
//   );
// }

// /* ===================== FULL PAGE OVERLAY ===================== */
// function FullPageOverlay({ open, onClose, title, subtitle, children }) {
//   if (!open) return null;

//   return (
//     <div
//       style={{
//         position: "fixed",
//         inset: 0,
//         zIndex: 99998,
//         background: UI.bg,
//         display: "flex",
//         flexDirection: "column",
//         overflow: "hidden",
//       }}
//     >
//       <div
//         style={{
//           padding: "12px 18px",
//           backgroundColor: UI.surface,
//           boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
//           display: "flex",
//           alignItems: "center",
//           gap: 12,
//           zIndex: 2,
//           borderBottom: `1px solid ${UI.border}`,
//           flex: "0 0 auto",
//           boxSizing: "border-box",
//         }}
//       >
//         <button
//           onClick={onClose}
//           style={{
//             height: 36,
//             padding: "0 12px",
//             borderRadius: 12,
//             border: `1px solid ${UI.border}`,
//             background: UI.surface,
//             cursor: "pointer",
//             fontSize: 13,
//             fontWeight: 900,
//             color: UI.text,
//             WebkitTextFillColor: UI.text,
//             display: "inline-flex",
//             alignItems: "center",
//             gap: 8,
//           }}
//           title="Back"
//         >
//           <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
//             <path d="M15 18l-6-6 6-6" stroke={UI.text} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
//           </svg>
//           Back
//         </button>

//         <div style={{ minWidth: 0 }}>
//           <div style={{ fontSize: 15, fontWeight: 950, color: UI.text, WebkitTextFillColor: UI.text, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
//             {title}
//           </div>
//           {subtitle ? (
//             <div style={{ fontSize: 12, color: UI.muted, WebkitTextFillColor: UI.muted, marginTop: 2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
//               {subtitle}
//             </div>
//           ) : null}
//         </div>
//       </div>

//       <div style={{ flex: "1 1 auto", minHeight: 0, padding: 12, overflow: "auto", boxSizing: "border-box" }}>
//         {children}
//       </div>
//     </div>
//   );
// }

// /* ===================== MAIN PAGE ===================== */
// export function DefaultLandingComponent() {
//   const [ready, setReady] = useState(false);

//   const [loadingList, setLoadingList] = useState(false);
//   const [listError, setListError] = useState("");
//   const [rawListRows, setRawListRows] = useState([]);

//   const [search, setSearch] = useState("");
//   const [filters, setFilters] = useState({ site: "all", type: "all", startDate: "", endDate: "" });
//   const [filterOpen, setFilterOpen] = useState(false);

//   const [selectedAuditId, setSelectedAuditId] = useState(null);
//   const [selectedVersionRowId, setSelectedVersionRowId] = useState(null);

//   const [loadingDetail, setLoadingDetail] = useState(false);
//   const [detailError, setDetailError] = useState("");
//   const [detail, setDetail] = useState(null);

//   const [collapseMode, setCollapseMode] = useState("none"); // "none" | "audit" | "both"
//   const [detailsFullscreen, setDetailsFullscreen] = useState(false);

//   const listAbortRef = useRef(false);
//   const detailAbortRef = useRef(false);

//   useEffect(() => {
//     let cancelled = false;
//     const boot = async () => {
//       let attempts = 0;
//       while ((!kf.account?._id || !kf.user?._id) && !cancelled && attempts < 40) {
//         await delay(200);
//         attempts += 1;
//       }
//       if (cancelled) return;
//       setReady(Boolean(kf.account?._id));
//     };
//     boot();
//     return () => {
//       cancelled = true;
//     };
//   }, []);

//   const loadVersionList = async ({ silent = false } = {}) => {
//     const accId = kf.account?._id;
//     if (!accId) return;

//     if (!silent) setLoadingList(true);
//     setListError("");
//     listAbortRef.current = false;

//     const urlWithAcc = buildListUrl({ accId, withAccount: true });
//     const urlWithoutAcc = buildListUrl({ accId, withAccount: false });

//     try {
//       const { res } = await kfApiTryMany([urlWithAcc, urlWithoutAcc]);
//       if (listAbortRef.current) return;

//       const rows =
//         Array.isArray(res?.Data) ? res.Data :
//         Array.isArray(res?.data) ? res.data :
//         Array.isArray(res?.Items) ? res.Items :
//         Array.isArray(res?.items) ? res.items :
//         [];

//       setRawListRows(rows);

//       if (!selectedAuditId && rows.length > 0) {
//         const firstAuditId = rows[0]?.Audit_ID;
//         if (firstAuditId) setSelectedAuditId(firstAuditId);
//       }
//     } catch (e) {
//       if (listAbortRef.current) return;
//       setListError(e?.message || "Failed to load audits list.");
//       setRawListRows([]);
//     } finally {
//       if (!listAbortRef.current && !silent) setLoadingList(false);
//     }
//   };

//   useEffect(() => {
//     if (!ready) return;
//     loadVersionList({ silent: false });
//     const t = setInterval(() => loadVersionList({ silent: true }), 12000);
//     return () => {
//       clearInterval(t);
//       listAbortRef.current = true;
//     };
//   }, [ready]);

//   const loadVersionDetail = async (rowId) => {
//     const accId = kf.account?._id;
//     if (!accId || !rowId) return;

//     setDetailError("");
//     setLoadingDetail(true);
//     detailAbortRef.current = false;

//     const urls = buildDetailUrls({ accId, rowId });

//     try {
//       const { res } = await kfApiTryMany(urls);
//       if (detailAbortRef.current) return;

//       const payload = res?.Data ? res.Data : res?.data ? res.data : res;
//       setDetail(payload || null);
//     } catch (e) {
//       if (detailAbortRef.current) return;
//       setDetailError(e?.message || "Failed to load version details.");
//       setDetail(null);
//     } finally {
//       if (!detailAbortRef.current) setLoadingDetail(false);
//     }
//   };

//   const audits = useMemo(() => buildAuditGroups(rawListRows), [rawListRows]);

//   const availableSites = useMemo(() => {
//     const set = new Set();
//     rawListRows.forEach((r) => r?.Site_Name && set.add(r.Site_Name));
//     return Array.from(set).sort((a, b) => String(a).localeCompare(String(b)));
//   }, [rawListRows]);

//   const availableTypes = useMemo(() => {
//     const set = new Set();
//     rawListRows.forEach((r) => r?.Audit_Type && set.add(r.Audit_Type));
//     return Array.from(set).sort((a, b) => String(a).localeCompare(String(b)));
//   }, [rawListRows]);

//   const filteredAudits = useMemo(() => {
//     const q = search.trim().toLowerCase();
//     const startMs = filters.startDate ? new Date(filters.startDate).getTime() : null;
//     const endMs = filters.endDate ? new Date(filters.endDate).getTime() : null;

//     return audits.filter((a) => {
//       if (filters.site !== "all" && a.siteName !== filters.site) return false;
//       if (filters.type !== "all" && a.auditType !== filters.type) return false;

//       if (startMs || endMs) {
//         const d = a.scheduledDate ? new Date(a.scheduledDate).getTime() : null;
//         if (d == null) return false;
//         if (startMs && d < startMs) return false;
//         if (endMs && d > endMs) return false;
//       }

//       if (!q) return true;
//       const hay = [a.auditId, a.siteName, a.auditType, safeUserName(a.auditor), safeUserName(a.auditee)].join(" ").toLowerCase();
//       return hay.includes(q);
//     });
//   }, [audits, search, filters]);

//   const selectedAudit = useMemo(
//     () => filteredAudits.find((a) => a.auditId === selectedAuditId) || null,
//     [filteredAudits, selectedAuditId]
//   );

//   /**
//    * ✅ CORE FIX:
//    * - Use minmax() so columns NEVER push other columns offscreen.
//    * - Column 3 ALWAYS takes remaining space: minmax(0, 1fr)
//    * - Column 1/2 can shrink within bounds on smaller screens
//    */
//   const gridTemplateColumns = useMemo(() => {
//     const COLLAPSED = "56px";

//     // Responsive widths (can shrink if screen is smaller)
//     const AUDIT = "minmax(280px, 360px)";
//     const VERSION = "minmax(260px, 320px)";

//     if (collapseMode === "both") return `${COLLAPSED} ${COLLAPSED} minmax(0, 1fr)`;
//     if (collapseMode === "audit") return `${COLLAPSED} ${VERSION} minmax(0, 1fr)`;
//     return `${AUDIT} ${VERSION} minmax(0, 1fr)`;
//   }, [collapseMode]);

//   useEffect(() => {
//     if (selectedVersionRowId) setCollapseMode("audit");
//   }, [selectedVersionRowId]);

//   const filterIconBtn = {
//     width: 36,
//     height: 36,
//     borderRadius: 12,
//     border: `1px solid ${UI.border}`,
//     background: UI.surface,
//     cursor: "pointer",
//     display: "inline-flex",
//     alignItems: "center",
//     justifyContent: "center",
//     padding: 0,
//   };

//   const topBtn = {
//     height: 36,
//     padding: "0 12px",
//     borderRadius: 999,
//     border: `1px solid ${UI.text}`,
//     background: UI.surface,
//     cursor: "pointer",
//     fontSize: 13,
//     fontWeight: 900,
//     color: UI.text,
//     WebkitTextFillColor: UI.text,
//   };

//   const expandBtnStyle = {
//     height: 34,
//     padding: "0 10px",
//     borderRadius: 12,
//     border: `1px solid ${UI.border}`,
//     background: UI.surface,
//     cursor: "pointer",
//     fontSize: 12,
//     fontWeight: 900,
//     color: UI.text,
//     WebkitTextFillColor: UI.text,
//     display: "inline-flex",
//     alignItems: "center",
//     gap: 8,
//   };

//   return (
//     <div
//       style={{
//         width: "100%",
//         height: "100%",
//         minWidth: 0,
//         minHeight: 0,
//         display: "flex",
//         flexDirection: "column",
//         backgroundColor: UI.bg,
//         color: UI.text,
//         fontFamily: "Inter, system-ui, sans-serif",
//         overflow: "hidden",
//         boxSizing: "border-box",
//       }}
//     >
//       <FilterDrawer
//         open={filterOpen}
//         onClose={() => setFilterOpen(false)}
//         availableSites={availableSites}
//         availableTypes={availableTypes}
//         filters={filters}
//         setFilters={setFilters}
//       />

//       <FullPageOverlay
//         open={detailsFullscreen}
//         onClose={() => setDetailsFullscreen(false)}
//         title={detail ? `${detail?.Audit_ID || "—"} • ${fmtVersion(detail?.Version)}` : "Version Details"}
//         subtitle={detail ? `${detail?.Audit_Type || "—"} • ${detail?.Site_Name || "—"} • ${fmtDate(detail?.Audit_Scheduled_Date)}` : ""}
//       >
//         {!selectedVersionRowId && <Empty>Choose a version to view details.</Empty>}
//         {selectedVersionRowId && loadingDetail && (
//           <div
//             style={{
//               width: "100%",
//               borderRadius: 16,
//               border: `1px solid ${UI.border}`,
//               background: UI.surface,
//               padding: 18,
//               fontWeight: 900,
//               color: UI.muted,
//               WebkitTextFillColor: UI.muted,
//               textAlign: "center",
//             }}
//           >
//             Loading…
//           </div>
//         )}
//         {selectedVersionRowId && !loadingDetail && detailError && <ErrorText>{detailError}</ErrorText>}

//         {selectedVersionRowId && detail && (
//           <div
//             style={{
//               border: `1px solid ${UI.border}`,
//               borderRadius: 18,
//               padding: 14,
//               backgroundColor: UI.surface,
//               boxShadow: cardShadow,
//               minWidth: 0,
//             }}
//           >
//             <div style={{ fontSize: 14, fontWeight: 950, color: UI.text, WebkitTextFillColor: UI.text }}>
//               {detail?.Audit_ID || "—"} • {fmtVersion(detail?.Version)}
//             </div>

//             <div style={{ marginTop: 6, fontSize: 12, color: UI.muted, WebkitTextFillColor: UI.muted }}>
//               {(detail?.Audit_Type || "—") + " • " + (detail?.Site_Name || "—") + " • " + fmtDate(detail?.Audit_Scheduled_Date)}
//             </div>

//             <div style={{ marginTop: 12, display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, minWidth: 0 }}>
//               <Meta label="Site" value={detail?.Site_Name} />
//               <Meta label="Scheduled Date" value={fmtDate(detail?.Audit_Scheduled_Date)} />
//               <Meta label="Audit Type" value={detail?.Audit_Type} />
//             </div>

//             <div style={{ marginTop: 10, display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, minWidth: 0 }}>
//               <Meta label="Auditor" value={safeUserName(detail?.Auditor)} />
//               <Meta label="Auditee" value={safeUserName(detail?.Auditee)} />
//               <Meta label="Department Head" value={safeUserName(detail?.Department_Head)} />
//             </div>

//             <DetailTable rows={detail?.["Table::Untitled_Table"] || []} />
//           </div>
//         )}
//       </FullPageOverlay>

//       {/* TOP BAR */}
//       <div
//         style={{
//           width: "100%",
//           padding: "12px 18px",
//           backgroundColor: UI.surface,
//           boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
//           display: "flex",
//           alignItems: "center",
//           gap: 12,
//           zIndex: 2,
//           borderBottom: `1px solid ${UI.border}`,
//           flex: "0 0 auto",
//           boxSizing: "border-box",
//         }}
//       >
//         <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
//           <div
//             style={{
//               width: 36,
//               height: 36,
//               borderRadius: 12,
//               backgroundColor: UI.tintB,
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//               border: "1px solid #E9D5FF",
//               color: "#5B21B6",
//               WebkitTextFillColor: "#5B21B6",
//               fontWeight: 950,
//               fontSize: 14,
//             }}
//           >
//             V
//           </div>
//           <div style={{ fontSize: 15, fontWeight: 950, color: UI.text, WebkitTextFillColor: UI.text }}>Audit Versions</div>
//         </div>

//         <div style={{ flex: 1 }} />

//         <input
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//           onKeyDown={(e) => e.stopPropagation()}
//           onMouseDown={(e) => e.stopPropagation()}
//           placeholder="Search audit, site, type, auditor…"
//           autoComplete="off"
//           style={{
//             width: 360,
//             maxWidth: "42vw",
//             padding: "9px 12px",
//             borderRadius: 999,
//             border: `1px solid ${UI.border}`,
//             outline: "none",
//             fontSize: 13,
//             backgroundColor: "#F9FAFB",
//             color: UI.text,
//             WebkitTextFillColor: UI.text,
//             caretColor: UI.text,
//           }}
//         />

//         <button style={filterIconBtn} onClick={() => setFilterOpen(true)} title="Filters">
//           <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
//             <path d="M4 7h16" stroke={UI.text} strokeWidth="2" strokeLinecap="round" />
//             <path d="M7 12h13" stroke={UI.text} strokeWidth="2" strokeLinecap="round" />
//             <path d="M10 17h10" stroke={UI.text} strokeWidth="2" strokeLinecap="round" />
//           </svg>
//         </button>

//         <button onClick={() => loadVersionList({ silent: false })} style={topBtn} title="Refresh">
//           Refresh
//         </button>
//       </div>

//       {/* BODY */}
//       <div
//         style={{
//           flex: "1 1 auto",
//           minHeight: 0,
//           minWidth: 0,
//           padding: 12,
//           overflow: "hidden",
//           backgroundColor: UI.bg,
//           boxSizing: "border-box",
//         }}
//       >
//         <div
//           style={{
//             width: "100%",
//             height: "100%",
//             minHeight: 0,
//             minWidth: 0,
//             display: "grid",
//             gridTemplateColumns,
//             gap: 12,
//             overflow: "hidden",
//             transition: "grid-template-columns 180ms ease",
//             backgroundColor: UI.bg,
//             boxSizing: "border-box",
//           }}
//         >
//           {/* LEFT */}
//           {collapseMode === "audit" || collapseMode === "both" ? (
//             <CollapsedRail title="Audits" subtitle={selectedAuditId || ""} onExpand={() => setCollapseMode("none")} />
//           ) : (
//             <Panel
//               title="Audits"
//               subtitle={loadingList ? "Loading…" : listError ? "Error loading audits" : `${filteredAudits.length} shown`}
//               tint={UI.tintB}
//               headerRight={
//                 <IconBtn title="Collapse audits" onClick={() => setCollapseMode("audit")}>
//                   <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
//                     <path d="M15 6l-6 6 6 6" stroke={UI.text} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
//                   </svg>
//                 </IconBtn>
//               }
//             >
//               {!ready && <Empty>Waiting for Kissflow context…</Empty>}
//               {ready && loadingList && <Empty>Loading audits…</Empty>}
//               {ready && !loadingList && listError && <ErrorText>{listError}</ErrorText>}
//               {ready && !loadingList && !listError && filteredAudits.length === 0 && <Empty>No audits match your filters.</Empty>}

//               {filteredAudits.map((a) => {
//                 const active = a.auditId === selectedAuditId;
//                 return (
//                   <div
//                     key={a.auditId}
//                     onClick={() => {
//                       setSelectedAuditId(a.auditId);
//                       setSelectedVersionRowId(null);
//                       setDetail(null);
//                       setDetailError("");
//                     }}
//                     style={{
//                       cursor: "pointer",
//                       borderRadius: 16,
//                       border: active ? `2px solid ${UI.accent2}` : `1px solid ${UI.border}`,
//                       backgroundColor: active ? UI.tintB : UI.surface,
//                       padding: 12,
//                       transition: "0.15s ease",
//                       minWidth: 0,
//                     }}
//                   >
//                     <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, minWidth: 0 }}>
//                       <div style={{ fontSize: 13, fontWeight: 950, color: UI.text, WebkitTextFillColor: UI.text, minWidth: 0 }}>
//                         {a.auditId}
//                       </div>
//                       <div style={chipStyle("#EDE9FE", "#5B21B6", "#C4B5FD")}>{a.versionCount} versions</div>
//                     </div>

//                     <div style={{ marginTop: 8, display: "flex", flexWrap: "wrap", gap: 8, minWidth: 0 }}>
//                       <span style={auditTypePill(a.auditType)}>{a.auditType || "—"}</span>
//                       <span style={chipStyle("#F3F4F6", "#374151", UI.border)}>{fmtDate(a.scheduledDate)}</span>
//                       <span style={chipStyle("#F3F4F6", "#374151", UI.border)}>{a.siteName || "—"}</span>
//                     </div>

//                     <div style={{ marginTop: 10, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, minWidth: 0 }}>
//                       <Meta label="Auditor" value={safeUserName(a.auditor)} />
//                       <Meta label="Auditee" value={safeUserName(a.auditee)} />
//                     </div>
//                   </div>
//                 );
//               })}
//             </Panel>
//           )}

//           {/* MIDDLE */}
//           {collapseMode === "both" ? (
//             <CollapsedRail title="Versions" subtitle={detail?.Version ? fmtVersion(detail?.Version) : ""} onExpand={() => setCollapseMode("audit")} />
//           ) : (
//             <Panel
//               title="Versions"
//               subtitle={selectedAudit ? `For ${selectedAudit.auditId}` : "Select an audit"}
//               tint={UI.tintA}
//               headerRight={
//                 <IconBtn title="Collapse versions" onClick={() => setCollapseMode("both")}>
//                   <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
//                     <path d="M15 6l-6 6 6 6" stroke={UI.text} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
//                   </svg>
//                 </IconBtn>
//               }
//             >
//               {!selectedAudit && <Empty>Pick an audit to see versions.</Empty>}

//               {selectedAudit &&
//                 selectedAudit.versions.map((v) => {
//                   const active = v.rowId === selectedVersionRowId;
//                   return (
//                     <div
//                       key={v.rowId}
//                       onClick={() => {
//                         setSelectedVersionRowId(v.rowId);
//                         loadVersionDetail(v.rowId);
//                       }}
//                       style={{
//                         cursor: "pointer",
//                         borderRadius: 16,
//                         border: active ? `2px solid ${UI.accent}` : `1px solid ${UI.border}`,
//                         backgroundColor: active ? "#EFF6FF" : UI.surface,
//                         padding: 12,
//                         transition: "0.15s ease",
//                         minWidth: 0,
//                       }}
//                     >
//                       <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10, minWidth: 0 }}>
//                         <div style={{ fontSize: 13, fontWeight: 950, color: UI.text, WebkitTextFillColor: UI.text }}>
//                           {v.versionLabel}
//                         </div>
//                         <div style={chipStyle("#DBEAFE", "#1D4ED8", "#93C5FD")}>{fmtDate(v.scheduledDate)}</div>
//                       </div>

//                       <div style={{ marginTop: 8, display: "flex", flexWrap: "wrap", gap: 8 }}>
//                         <span style={auditTypePill(v.auditType)}>{v.auditType || "—"}</span>
//                       </div>
//                     </div>
//                   );
//                 })}
//             </Panel>
//           )}

//           {/* RIGHT */}
//           <Panel
//             title="Version Details"
//             subtitle={selectedVersionRowId ? "" : "Select a version"}
//             tint={UI.tintC}
//             headerRight={
//               <button
//                 style={{
//                   ...expandBtnStyle,
//                   opacity: selectedVersionRowId ? 1 : 0.5,
//                   pointerEvents: selectedVersionRowId ? "auto" : "none",
//                 }}
//                 onClick={() => setDetailsFullscreen(true)}
//                 title="Expand to full page"
//               >
//                 <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
//                   <path d="M9 3H5a2 2 0 0 0-2 2v4" stroke={UI.text} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
//                   <path d="M15 21h4a2 2 0 0 0 2-2v-4" stroke={UI.text} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
//                   <path d="M21 9V5a2 2 0 0 0-2-2h-4" stroke={UI.text} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
//                   <path d="M3 15v4a2 2 0 0 0 2 2h4" stroke={UI.text} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
//                 </svg>
//                 Expand
//               </button>
//             }
//           >
//             <div style={{ position: "relative", minHeight: 240, minWidth: 0 }}>
//               {loadingDetail && selectedVersionRowId && (
//                 <div
//                   style={{
//                     position: "absolute",
//                     inset: 0,
//                     background: UI.surface,
//                     zIndex: 3,
//                     display: "flex",
//                     alignItems: "center",
//                     justifyContent: "center",
//                     fontWeight: 900,
//                     color: UI.muted,
//                     WebkitTextFillColor: UI.muted,
//                     borderRadius: 16,
//                     border: `1px solid ${UI.border}`,
//                   }}
//                 >
//                   Loading…
//                 </div>
//               )}

//               {!selectedVersionRowId && <Empty>Choose a version to view details.</Empty>}
//               {selectedVersionRowId && !loadingDetail && detailError && <ErrorText>{detailError}</ErrorText>}

//               {selectedVersionRowId && detail && (
//                 <div
//                   style={{
//                     border: `1px solid ${UI.border}`,
//                     borderRadius: 18,
//                     padding: 14,
//                     backgroundColor: UI.surface,
//                     boxShadow: cardShadow,
//                     minWidth: 0,
//                   }}
//                 >
//                   <div style={{ fontSize: 14, fontWeight: 950, color: UI.text, WebkitTextFillColor: UI.text }}>
//                     {detail?.Audit_ID || "—"} • {fmtVersion(detail?.Version)}
//                   </div>

//                   <div style={{ marginTop: 6, fontSize: 12, color: UI.muted, WebkitTextFillColor: UI.muted }}>
//                     {(detail?.Audit_Type || "—") + " • " + (detail?.Site_Name || "—") + " • " + fmtDate(detail?.Audit_Scheduled_Date)}
//                   </div>

//                   <div style={{ marginTop: 12, display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, minWidth: 0 }}>
//                     <Meta label="Site" value={detail?.Site_Name} />
//                     <Meta label="Scheduled Date" value={fmtDate(detail?.Audit_Scheduled_Date)} />
//                     <Meta label="Audit Type" value={detail?.Audit_Type} />
//                   </div>

//                   <div style={{ marginTop: 10, display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, minWidth: 0 }}>
//                     <Meta label="Auditor" value={safeUserName(detail?.Auditor)} />
//                     <Meta label="Auditee" value={safeUserName(detail?.Auditee)} />
//                     <Meta label="Department Head" value={safeUserName(detail?.Department_Head)} />
//                   </div>

//                   <DetailTable rows={detail?.["Table::Untitled_Table"] || []} />
//                 </div>
//               )}
//             </div>
//           </Panel>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default DefaultLandingComponent;

// import React, { useEffect, useMemo, useRef, useState } from "react";
// import { kf } from "./../sdk/index.js";



// /* ===================== CONSTANT LIGHT THEME (NO DARK / NO TRANSPARENT BG) ===================== */
// const UI = {
//   bg: "#F3F4F6",
//   surface: "#FFFFFF",
//   border: "#E5E7EB",
//   text: "#111827",
//   muted: "#6B7280",
//   tintA: "#EEF2FF",
//   tintB: "#F5F3FF",
//   tintC: "#ECFDF5",
//   accent: "#2563EB",
//   accent2: "#7C3AED",
//   danger: "#B91C1C",
// };

// const FLOW_ID = "Version_Master_A00";
// const APP_ID = "Ac9Pds4TaXkR";
// const LIST_PAGE_SIZE = 100000;

// const delay = (ms) => new Promise((r) => setTimeout(r, ms));

// const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
// const fmtDate = (ymd) => {
//   if (!ymd) return "—";
//   const d = new Date(ymd);
//   if (Number.isNaN(d.getTime())) return String(ymd);
//   return `${d.getDate()} ${monthNames[d.getMonth()]} ${d.getFullYear()}`;
// };

// const safeUserName = (u) => u?.Name || u?.DisplayName || u?.Email || "—";

// const fmtVersion = (v) => {
//   if (v == null || v === "") return "V—";
//   const s = String(v).trim();
//   const m = s.match(/^v\s*(\d+)$/i);
//   if (m?.[1]) return `V${m[1]}`;
//   const n = Number(s);
//   if (!Number.isNaN(n) && Number.isFinite(n)) return `V${String(n)}`;
//   return s.toUpperCase().startsWith("V") ? s.toUpperCase() : `V${s}`;
// };

// const chipStyle = (bg, fg, border) => ({
//   display: "inline-flex",
//   alignItems: "center",
//   padding: "2px 10px",
//   borderRadius: 999,
//   fontSize: 11,
//   fontWeight: 800,
//   backgroundColor: bg,
//   color: fg,
//   WebkitTextFillColor: fg,
//   border: `1px solid ${border}`,
//   whiteSpace: "nowrap",
// });

// const cardShadow = "0 8px 18px rgba(17, 24, 39, 0.06)";

// const buildListUrl = ({ accId, withAccount }) => {
//   const qs = `visited=1&page_number=1&page_size=${LIST_PAGE_SIZE}`;
//   return withAccount ? `/form/2/${accId}/${FLOW_ID}/list?${qs}` : `/form/2/${APP_ID}/${FLOW_ID}/list?${qs}`;
// };

// const buildDetailUrls = ({ accId, rowId }) => [
//   `/form/2/${accId}/${FLOW_ID}/${rowId}`,
//   `/form/2/${APP_ID}/${FLOW_ID}/${rowId}`,
//   `/form/2/${accId}/${APP_ID}/${FLOW_ID}/${rowId}`,
// ];

// async function kfApiTryMany(urls) {
//   let lastErr = null;
//   for (const url of urls) {
//     try {
//       const res = await kf.api(url);
//       return { res, usedUrl: url };
//     } catch (e) {
//       lastErr = e;
//     }
//   }
//   throw lastErr;
// }

// /**
//  * ✅ FIX 1: Do NOT group missing Audit_ID into "—"
//  * ✅ FIX 2: Provide stable unique keys for versions even if _id is missing
//  */
// const buildAuditGroups = (rows = []) => {
//   const map = new Map();

//   rows.forEach((r) => {
//     const auditIdRaw = r?.Audit_ID;
//     if (!auditIdRaw) return; // ✅ skip invalid rows (prevents ghost cross-audit grouping)
//     const auditId = String(auditIdRaw).trim();
//     if (!auditId) return;

//     if (!map.has(auditId)) map.set(auditId, []);
//     map.get(auditId).push(r);
//   });

//   const audits = Array.from(map.entries()).map(([auditId, items]) => {
//     const sorted = [...items].sort((a, b) => {
//       const av = a?.Version ?? "";
//       const bv = b?.Version ?? "";
//       const an = Number(av);
//       const bn = Number(bv);
//       if (!Number.isNaN(an) && !Number.isNaN(bn)) return bn - an;
//       return String(bv).localeCompare(String(av));
//     });

//     const pick = (key) => sorted.find((x) => x?.[key] != null)?.[key];

//     return {
//       auditId,
//       siteName: pick("Site_Name") || "—",
//       auditType: pick("Audit_Type") || "—",
//       scheduledDate: pick("Audit_Scheduled_Date") || null,
//       auditor: pick("Auditor") || null,
//       auditee: pick("Auditee") || null,
//       deptHead: pick("Department_Head") || null,

//       // ✅ stable keys: auditId + rowId + idx
//       versions: sorted.map((x, idx) => {
//         const rowId = x?._id || null;
//         return {
//           rowId,
//           _key: `${auditId}::${rowId || "noid"}::${idx}`,
//           versionLabel: fmtVersion(x?.Version),
//           scheduledDate: x?.Audit_Scheduled_Date ?? null,
//           auditType: x?.Audit_Type ?? pick("Audit_Type") ?? "—",
//         };
//       }),

//       versionCount: sorted.length,
//     };
//   });

//   audits.sort((a, b) => {
//     const ad = a.scheduledDate ? new Date(a.scheduledDate).getTime() : -Infinity;
//     const bd = b.scheduledDate ? new Date(b.scheduledDate).getTime() : -Infinity;
//     if (bd !== ad) return bd - ad;
//     return String(a.auditId).localeCompare(String(b.auditId));
//   });

//   return audits;
// };

// const auditTypePill = (auditType) => {
//   const t = String(auditType || "").toLowerCase();
//   if (t.includes("annual")) return chipStyle("#DBEAFE", "#1D4ED8", "#93C5FD");
//   if (t.includes("qgmp")) return chipStyle("#DCFCE7", "#166534", "#86EFAC");
//   return chipStyle("#EDE9FE", "#5B21B6", "#C4B5FD");
// };

// /* ===================== FILTER DRAWER (SOLID BG) ===================== */
// function FilterDrawer({ open, onClose, availableSites, availableTypes, filters, setFilters }) {
//   if (!open) return null;

//   const overlay = {
//     position: "fixed",
//     inset: 0,
//     zIndex: 99999,
//     display: "flex",
//     justifyContent: "flex-end",
//     background: UI.bg,
//     overflow: "hidden",
//   };

//   const panel = {
//     width: 360,
//     maxWidth: "92vw",
//     height: "100%",
//     background: UI.surface,
//     borderLeft: `1px solid ${UI.border}`,
//     boxShadow: "0 18px 48px rgba(15,23,42,0.12)",
//     padding: 12,
//     boxSizing: "border-box",
//     display: "flex",
//     flexDirection: "column",
//     gap: 10,
//     overflow: "hidden",
//   };

//   const label = {
//     fontSize: 11,
//     fontWeight: 900,
//     color: UI.text,
//     WebkitTextFillColor: UI.text,
//     marginBottom: 6,
//   };

//   const input = {
//     width: "100%",
//     height: 36,
//     padding: "0 10px",
//     borderRadius: 12,
//     border: `1px solid ${UI.border}`,
//     outline: "none",
//     fontSize: 13,
//     color: UI.text,
//     WebkitTextFillColor: UI.text,
//     background: UI.surface,
//     boxSizing: "border-box",
//     appearance: "none",
//     WebkitAppearance: "none",
//     MozAppearance: "none",
//   };

//   const option = { color: UI.text, WebkitTextFillColor: UI.text, backgroundColor: UI.surface };

//   const btn = {
//     height: 36,
//     padding: "0 12px",
//     borderRadius: 12,
//     border: `1px solid ${UI.text}`,
//     background: UI.surface,
//     cursor: "pointer",
//     fontSize: 13,
//     fontWeight: 900,
//     color: UI.text,
//     WebkitTextFillColor: UI.text,
//     display: "inline-flex",
//     alignItems: "center",
//     justifyContent: "center",
//     gap: 8,
//   };

//   return (
//     <div
//       style={overlay}
//       onMouseDown={(e) => {
//         if (e.target === e.currentTarget) onClose();
//       }}
//     >
//       <div style={panel} onMouseDown={(e) => e.stopPropagation()}>
//         <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
//           <div style={{ fontSize: 13, fontWeight: 950, color: UI.text, WebkitTextFillColor: UI.text }}>Filters</div>
//           <button style={btn} onClick={onClose}>
//             Close
//           </button>
//         </div>

//         <div>
//           <div style={label}>Site</div>
//           <select style={input} value={filters.site} onChange={(e) => setFilters((p) => ({ ...p, site: e.target.value }))}>
//             <option style={option} value="all">
//               All
//             </option>
//             {availableSites.map((s) => (
//               <option style={option} key={s} value={s}>
//                 {s}
//               </option>
//             ))}
//           </select>
//         </div>

//         <div>
//           <div style={label}>Audit Type</div>
//           <select style={input} value={filters.type} onChange={(e) => setFilters((p) => ({ ...p, type: e.target.value }))}>
//             <option style={option} value="all">
//               All
//             </option>
//             {availableTypes.map((t) => (
//               <option style={option} key={t} value={t}>
//                 {t}
//               </option>
//             ))}
//           </select>
//         </div>

//         <div>
//           <div style={label}>Start date</div>
//           <input style={input} type="date" value={filters.startDate} onChange={(e) => setFilters((p) => ({ ...p, startDate: e.target.value }))} />
//         </div>

//         <div>
//           <div style={label}>End date</div>
//           <input style={input} type="date" value={filters.endDate} onChange={(e) => setFilters((p) => ({ ...p, endDate: e.target.value }))} />
//         </div>

//         <div style={{ display: "flex", gap: 10, marginTop: "auto" }}>
//           <button
//             style={{ ...btn, flex: 1, border: `1px solid ${UI.border}` }}
//             onClick={() => setFilters({ site: "all", type: "all", startDate: "", endDate: "" })}
//           >
//             Reset
//           </button>
//           <button style={{ ...btn, flex: 1 }} onClick={onClose}>
//             Apply
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// /* ===================== TABLE ===================== */
// function DetailTable({ rows }) {
//   if (!Array.isArray(rows) || rows.length === 0) return null;

//   const th = {
//     textAlign: "left",
//     fontSize: 10,
//     fontWeight: 900,
//     color: UI.muted,
//     WebkitTextFillColor: UI.muted,
//     padding: "9px 10px",
//     borderBottom: `1px solid ${UI.border}`,
//     position: "sticky",
//     top: 0,
//     background: UI.surface,
//     zIndex: 2,
//     whiteSpace: "nowrap",
//   };

//   const td = {
//     fontSize: 12,
//     color: UI.text,
//     WebkitTextFillColor: UI.text,
//     padding: "9px 10px",
//     borderBottom: `1px solid ${UI.border}`,
//     verticalAlign: "top",
//   };

//   const wrap = { ...td, whiteSpace: "pre-wrap", lineHeight: 1.35 };
//   const nowrap = { ...td, whiteSpace: "nowrap" };

//   return (
//     <div style={{ marginTop: 12, border: `1px solid ${UI.border}`, borderRadius: 18, overflow: "hidden" }}>
//       <div
//         style={{
//           maxHeight: "100%",
//           overflowY: "auto",
//           overflowX: "auto",
//           background: UI.surface,
//           maxWidth: "100%",
//         }}
//       >
//         <table
//           style={{
//             width: "max-content",
//             minWidth: "100%",
//             borderCollapse: "separate",
//             borderSpacing: 0,
//           }}
//         >
//           <thead>
//             <tr>
//               <th style={th}>Element</th>
//               <th style={th}>Factor</th>
//               <th style={th}>Requirement</th>
//               <th style={th}>Observation</th>
//               <th style={th}>Rating</th>
//               <th style={th}>RCA</th>
//               <th style={th}>CAPA</th>
//               <th style={th}>Dept Head</th>
//               <th style={th}>Status</th>
//             </tr>
//           </thead>
//           <tbody>
//             {rows.map((r, idx) => (
//               <tr key={r?._id || `${idx}`}>
//                 <td style={nowrap}>{r?.Element || "—"}</td>
//                 <td style={wrap}>{r?.Factor || "—"}</td>
//                 <td style={wrap}>{r?.Requirement_1 || "—"}</td>
//                 <td style={wrap}>{r?.Observation || "—"}</td>
//                 <td style={nowrap}>{r?.Rating ?? "—"}</td>
//                 <td style={wrap}>{r?.RCA_1 || "—"}</td>
//                 <td style={wrap}>{r?.CAPA_1 || "—"}</td>
//                 <td style={wrap}>{r?.Deparment_Head_Feedback || "—"}</td>
//                 <td style={nowrap}>{r?.Auditor_Feedback_2 || "—"}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }

// /* ===================== BASIC UI ===================== */
// function Panel({ title, subtitle, tint, children, headerRight }) {
//   return (
//     <div
//       style={{
//         borderRadius: 18,
//         backgroundColor: UI.surface,
//         border: `1px solid ${UI.border}`,
//         boxShadow: cardShadow,
//         overflow: "hidden",
//         display: "flex",
//         flexDirection: "column",
//         minHeight: 0,
//         minWidth: 0,
//         height: "100%",
//       }}
//     >
//       <div
//         style={{
//           padding: "12px 14px",
//           borderBottom: `1px solid ${UI.border}`,
//           backgroundColor: tint,
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "space-between",
//           gap: 10,
//           minWidth: 0,
//           flex: "0 0 auto",
//         }}
//       >
//         <div style={{ minWidth: 0 }}>
//           <div style={{ fontSize: 13, fontWeight: 950, color: UI.text, WebkitTextFillColor: UI.text }}>{title}</div>
//           {subtitle ? <div style={{ fontSize: 12, color: UI.muted, WebkitTextFillColor: UI.muted, marginTop: 2 }}>{subtitle}</div> : null}
//         </div>
//         {headerRight ? <div style={{ flex: "0 0 auto" }}>{headerRight}</div> : null}
//       </div>

//       <div
//         style={{
//           padding: 12,
//           overflowY: "auto",
//           overflowX: "hidden",
//           display: "flex",
//           flexDirection: "column",
//           gap: 10,
//           minHeight: 0,
//           minWidth: 0,
//           flex: "1 1 auto",
//         }}
//       >
//         {children}
//       </div>
//     </div>
//   );
// }

// function Empty({ children }) {
//   return <div style={{ padding: 14, color: UI.muted, WebkitTextFillColor: UI.muted, fontSize: 13 }}>{children}</div>;
// }

// function ErrorText({ children }) {
//   return <div style={{ padding: 14, color: UI.danger, WebkitTextFillColor: UI.danger, fontSize: 13 }}>{children}</div>;
// }

// function Meta({ label, value }) {
//   return (
//     <div style={{ display: "flex", flexDirection: "column", gap: 2, minWidth: 0 }}>
//       <div style={{ fontSize: 11, fontWeight: 900, color: UI.muted, WebkitTextFillColor: UI.muted }}>{label}</div>
//       <div style={{ fontSize: 12, color: UI.text, WebkitTextFillColor: UI.text, fontWeight: 800, wordBreak: "break-word", minWidth: 0 }}>
//         {value == null || value === "" ? "—" : String(value)}
//       </div>
//     </div>
//   );
// }

// /* ===================== COLLAPSED RAIL ===================== */
// function CollapsedRail({ title, subtitle, onExpand }) {
//   return (
//     <div
//       onClick={onExpand}
//       title="Click to expand"
//       style={{
//         height: "100%",
//         borderRadius: 18,
//         border: `1px solid ${UI.border}`,
//         background: UI.surface,
//         boxShadow: cardShadow,
//         overflow: "hidden",
//         cursor: "pointer",
//         display: "flex",
//         flexDirection: "column",
//         userSelect: "none",
//         minWidth: 0,
//       }}
//     >
//       <div
//         style={{
//           background: UI.bg,
//           borderBottom: `1px solid ${UI.border}`,
//           padding: 10,
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "center",
//           gap: 8,
//         }}
//       >
//         <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
//           <path d="M10 7l5 5-5 5" stroke={UI.text} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
//         </svg>
//       </div>

//       <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: 10 }}>
//         <div
//           style={{
//             writingMode: "vertical-rl",
//             transform: "rotate(180deg)",
//             display: "flex",
//             alignItems: "center",
//             gap: 8,
//             color: UI.text,
//             WebkitTextFillColor: UI.text,
//             fontWeight: 950,
//             fontSize: 12,
//             whiteSpace: "nowrap",
//           }}
//         >
//           {title}
//           {subtitle ? <span style={{ color: UI.muted, WebkitTextFillColor: UI.muted, fontWeight: 800, fontSize: 11 }}>{subtitle}</span> : null}
//         </div>
//       </div>
//     </div>
//   );
// }

// /* ===================== ICON BUTTON ===================== */
// function IconBtn({ title, onClick, children }) {
//   return (
//     <button
//       title={title}
//       onClick={onClick}
//       style={{
//         width: 34,
//         height: 34,
//         borderRadius: 12,
//         border: `1px solid ${UI.border}`,
//         background: UI.surface,
//         cursor: "pointer",
//         display: "inline-flex",
//         alignItems: "center",
//         justifyContent: "center",
//         padding: 0,
//       }}
//     >
//       {children}
//     </button>
//   );
// }

// /* ===================== FULL PAGE OVERLAY ===================== */
// function FullPageOverlay({ open, onClose, title, subtitle, children }) {
//   if (!open) return null;

//   return (
//     <div
//       style={{
//         position: "fixed",
//         inset: 0,
//         zIndex: 99998,
//         background: UI.bg,
//         display: "flex",
//         flexDirection: "column",
//         overflow: "hidden",
//       }}
//     >
//       <div
//         style={{
//           padding: "12px 18px",
//           backgroundColor: UI.surface,
//           boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
//           display: "flex",
//           alignItems: "center",
//           gap: 12,
//           zIndex: 2,
//           borderBottom: `1px solid ${UI.border}`,
//           flex: "0 0 auto",
//           boxSizing: "border-box",
//         }}
//       >
//         <button
//           onClick={onClose}
//           style={{
//             height: 36,
//             padding: "0 12px",
//             borderRadius: 12,
//             border: `1px solid ${UI.border}`,
//             background: UI.surface,
//             cursor: "pointer",
//             fontSize: 13,
//             fontWeight: 900,
//             color: UI.text,
//             WebkitTextFillColor: UI.text,
//             display: "inline-flex",
//             alignItems: "center",
//             gap: 8,
//           }}
//           title="Back"
//         >
//           <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
//             <path d="M15 18l-6-6 6-6" stroke={UI.text} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
//           </svg>
//           Back
//         </button>

//         <div style={{ minWidth: 0 }}>
//           <div style={{ fontSize: 15, fontWeight: 950, color: UI.text, WebkitTextFillColor: UI.text, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
//             {title}
//           </div>
//           {subtitle ? (
//             <div style={{ fontSize: 12, color: UI.muted, WebkitTextFillColor: UI.muted, marginTop: 2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
//               {subtitle}
//             </div>
//           ) : null}
//         </div>
//       </div>

//       <div style={{ flex: "1 1 auto", minHeight: 0, padding: 12, overflow: "auto", boxSizing: "border-box" }}>
//         {children}
//       </div>
//     </div>
//   );
// }

// /* ===================== MAIN PAGE ===================== */
// export function DefaultLandingComponent() {
//   const [ready, setReady] = useState(false);

//   const [loadingList, setLoadingList] = useState(false);
//   const [listError, setListError] = useState("");
//   const [rawListRows, setRawListRows] = useState([]);

//   const [search, setSearch] = useState("");
//   const [filters, setFilters] = useState({ site: "all", type: "all", startDate: "", endDate: "" });
//   const [filterOpen, setFilterOpen] = useState(false);

//   const [selectedAuditId, setSelectedAuditId] = useState(null);
//   const [selectedVersionRowId, setSelectedVersionRowId] = useState(null);

//   const [loadingDetail, setLoadingDetail] = useState(false);
//   const [detailError, setDetailError] = useState("");
//   const [detail, setDetail] = useState(null);

//   const [collapseMode, setCollapseMode] = useState("none"); // "none" | "audit" | "both"
//   const [detailsFullscreen, setDetailsFullscreen] = useState(false);

//   const listAbortRef = useRef(false);
//   const detailAbortRef = useRef(false);

//   useEffect(() => {
//     let cancelled = false;
//     const boot = async () => {
//       let attempts = 0;
//       while ((!kf.account?._id || !kf.user?._id) && !cancelled && attempts < 40) {
//         await delay(200);
//         attempts += 1;
//       }
//       if (cancelled) return;
//       setReady(Boolean(kf.account?._id));
//     };
//     boot();
//     return () => {
//       cancelled = true;
//     };
//   }, []);

//   const loadVersionList = async ({ silent = false } = {}) => {
//     const accId = kf.account?._id;
//     if (!accId) return;

//     if (!silent) setLoadingList(true);
//     setListError("");
//     listAbortRef.current = false;

//     const urlWithAcc = buildListUrl({ accId, withAccount: true });
//     const urlWithoutAcc = buildListUrl({ accId, withAccount: false });

//     try {
//       const { res } = await kfApiTryMany([urlWithAcc, urlWithoutAcc]);
//       if (listAbortRef.current) return;

//       const rows =
//         Array.isArray(res?.Data) ? res.Data :
//         Array.isArray(res?.data) ? res.data :
//         Array.isArray(res?.Items) ? res.Items :
//         Array.isArray(res?.items) ? res.items :
//         [];

//       setRawListRows(rows);

//       // ✅ FIX: choose first VALID audit id (not undefined)
//       if (!selectedAuditId) {
//         const firstValid = rows.find((r) => r?.Audit_ID)?.Audit_ID;
//         if (firstValid) setSelectedAuditId(String(firstValid).trim());
//       } else {
//         // ✅ FIX: if selectedAuditId no longer exists after refresh, clear selection safely
//         const exists = rows.some((r) => String(r?.Audit_ID || "").trim() === String(selectedAuditId).trim());
//         if (!exists) {
//           setSelectedAuditId(null);
//           setSelectedVersionRowId(null);
//           setDetail(null);
//           setDetailError("");
//         }
//       }
//     } catch (e) {
//       if (listAbortRef.current) return;
//       setListError(e?.message || "Failed to load audits list.");
//       setRawListRows([]);
//     } finally {
//       if (!listAbortRef.current && !silent) setLoadingList(false);
//     }
//   };

//   useEffect(() => {
//     if (!ready) return;

//     loadVersionList({ silent: false });

//     // Auto refresh
//     const t = setInterval(() => loadVersionList({ silent: true }), 12000);

//     return () => {
//       clearInterval(t);
//       listAbortRef.current = true;
//     };
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [ready]);

//   const loadVersionDetail = async (rowId) => {
//     const accId = kf.account?._id;
//     if (!accId || !rowId) return;

//     setDetailError("");
//     setLoadingDetail(true);
//     detailAbortRef.current = false;

//     const urls = buildDetailUrls({ accId, rowId });

//     try {
//       const { res } = await kfApiTryMany(urls);
//       if (detailAbortRef.current) return;

//       const payload = res?.Data ? res.Data : res?.data ? res.data : res;
//       setDetail(payload || null);
//     } catch (e) {
//       if (detailAbortRef.current) return;
//       setDetailError(e?.message || "Failed to load version details.");
//       setDetail(null);
//     } finally {
//       if (!detailAbortRef.current) setLoadingDetail(false);
//     }
//   };

//   const audits = useMemo(() => buildAuditGroups(rawListRows), [rawListRows]);

//   const availableSites = useMemo(() => {
//     const set = new Set();
//     rawListRows.forEach((r) => r?.Site_Name && set.add(r.Site_Name));
//     return Array.from(set).sort((a, b) => String(a).localeCompare(String(b)));
//   }, [rawListRows]);

//   const availableTypes = useMemo(() => {
//     const set = new Set();
//     rawListRows.forEach((r) => r?.Audit_Type && set.add(r.Audit_Type));
//     return Array.from(set).sort((a, b) => String(a).localeCompare(String(b)));
//   }, [rawListRows]);

//   const filteredAudits = useMemo(() => {
//     const q = search.trim().toLowerCase();
//     const startMs = filters.startDate ? new Date(filters.startDate).getTime() : null;
//     const endMs = filters.endDate ? new Date(filters.endDate).getTime() : null;

//     return audits.filter((a) => {
//       if (filters.site !== "all" && a.siteName !== filters.site) return false;
//       if (filters.type !== "all" && a.auditType !== filters.type) return false;

//       if (startMs || endMs) {
//         const d = a.scheduledDate ? new Date(a.scheduledDate).getTime() : null;
//         if (d == null) return false;
//         if (startMs && d < startMs) return false;
//         if (endMs && d > endMs) return false;
//       }

//       if (!q) return true;
//       const hay = [a.auditId, a.siteName, a.auditType, safeUserName(a.auditor), safeUserName(a.auditee)].join(" ").toLowerCase();
//       return hay.includes(q);
//     });
//   }, [audits, search, filters]);

//   const selectedAudit = useMemo(
//     () => filteredAudits.find((a) => a.auditId === selectedAuditId) || null,
//     [filteredAudits, selectedAuditId]
//   );

//   // Keep your behavior: auto-collapse when version selected
//   useEffect(() => {
//     if (selectedVersionRowId) setCollapseMode("audit");
//   }, [selectedVersionRowId]);

//   const gridTemplateColumns = useMemo(() => {
//     const COLLAPSED = "56px";
//     const AUDIT = "minmax(280px, 360px)";
//     const VERSION = "minmax(260px, 320px)";

//     if (collapseMode === "both") return `${COLLAPSED} ${COLLAPSED} minmax(0, 1fr)`;
//     if (collapseMode === "audit") return `${COLLAPSED} ${VERSION} minmax(0, 1fr)`;
//     return `${AUDIT} ${VERSION} minmax(0, 1fr)`;
//   }, [collapseMode]);

//   const filterIconBtn = {
//     width: 36,
//     height: 36,
//     borderRadius: 12,
//     border: `1px solid ${UI.border}`,
//     background: UI.surface,
//     cursor: "pointer",
//     display: "inline-flex",
//     alignItems: "center",
//     justifyContent: "center",
//     padding: 0,
//   };

//   const topBtn = {
//     height: 36,
//     padding: "0 12px",
//     borderRadius: 999,
//     border: `1px solid ${UI.text}`,
//     background: UI.surface,
//     cursor: "pointer",
//     fontSize: 13,
//     fontWeight: 900,
//     color: UI.text,
//     WebkitTextFillColor: UI.text,
//   };

//   const expandBtnStyle = {
//     height: 34,
//     padding: "0 10px",
//     borderRadius: 12,
//     border: `1px solid ${UI.border}`,
//     background: UI.surface,
//     cursor: "pointer",
//     fontSize: 12,
//     fontWeight: 900,
//     color: UI.text,
//     WebkitTextFillColor: UI.text,
//     display: "inline-flex",
//     alignItems: "center",
//     gap: 8,
//   };

//   return (
//     <div
//       style={{
//         width: "100%",
//         height: "100%",
//         minWidth: 0,
//         minHeight: 0,
//         display: "flex",
//         flexDirection: "column",
//         backgroundColor: UI.bg,
//         color: UI.text,
//         fontFamily: "Inter, system-ui, sans-serif",
//         overflow: "hidden",
//         boxSizing: "border-box",
//       }}
//     >
//       <FilterDrawer
//         open={filterOpen}
//         onClose={() => setFilterOpen(false)}
//         availableSites={availableSites}
//         availableTypes={availableTypes}
//         filters={filters}
//         setFilters={setFilters}
//       />

//       <FullPageOverlay
//         open={detailsFullscreen}
//         onClose={() => setDetailsFullscreen(false)}
//         title={detail ? `${detail?.Audit_ID || "—"} • ${fmtVersion(detail?.Version)}` : "Version Details"}
//         subtitle={detail ? `${detail?.Audit_Type || "—"} • ${detail?.Site_Name || "—"} • ${fmtDate(detail?.Audit_Scheduled_Date)}` : ""}
//       >
//         {!selectedVersionRowId && <Empty>Choose a version to view details.</Empty>}
//         {selectedVersionRowId && loadingDetail && (
//           <div
//             style={{
//               width: "100%",
//               borderRadius: 16,
//               border: `1px solid ${UI.border}`,
//               background: UI.surface,
//               padding: 18,
//               fontWeight: 900,
//               color: UI.muted,
//               WebkitTextFillColor: UI.muted,
//               textAlign: "center",
//             }}
//           >
//             Loading…
//           </div>
//         )}
//         {selectedVersionRowId && !loadingDetail && detailError && <ErrorText>{detailError}</ErrorText>}

//         {selectedVersionRowId && detail && (
//           <div
//             style={{
//               border: `1px solid ${UI.border}`,
//               borderRadius: 18,
//               padding: 14,
//               backgroundColor: UI.surface,
//               boxShadow: cardShadow,
//               minWidth: 0,
//             }}
//           >
//             <div style={{ fontSize: 14, fontWeight: 950, color: UI.text, WebkitTextFillColor: UI.text }}>
//               {detail?.Audit_ID || "—"} • {fmtVersion(detail?.Version)}
//             </div>

//             <div style={{ marginTop: 6, fontSize: 12, color: UI.muted, WebkitTextFillColor: UI.muted }}>
//               {(detail?.Audit_Type || "—") + " • " + (detail?.Site_Name || "—") + " • " + fmtDate(detail?.Audit_Scheduled_Date)}
//             </div>

//             <div style={{ marginTop: 12, display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, minWidth: 0 }}>
//               <Meta label="Site" value={detail?.Site_Name} />
//               <Meta label="Scheduled Date" value={fmtDate(detail?.Audit_Scheduled_Date)} />
//               <Meta label="Audit Type" value={detail?.Audit_Type} />
//             </div>

//             <div style={{ marginTop: 10, display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, minWidth: 0 }}>
//               <Meta label="Auditor" value={safeUserName(detail?.Auditor)} />
//               <Meta label="Auditee" value={safeUserName(detail?.Auditee)} />
//               <Meta label="Department Head" value={safeUserName(detail?.Department_Head)} />
//             </div>

//             <DetailTable rows={detail?.["Table::Untitled_Table"] || []} />
//           </div>
//         )}
//       </FullPageOverlay>

//       {/* TOP BAR */}
//       <div
//         style={{
//           width: "100%",
//           padding: "12px 18px",
//           backgroundColor: UI.surface,
//           boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
//           display: "flex",
//           alignItems: "center",
//           gap: 12,
//           zIndex: 2,
//           borderBottom: `1px solid ${UI.border}`,
//           flex: "0 0 auto",
//           boxSizing: "border-box",
//         }}
//       >
//         <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
//           <div
//             style={{
//               width: 36,
//               height: 36,
//               borderRadius: 12,
//               backgroundColor: UI.tintB,
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//               border: "1px solid #E9D5FF",
//               color: "#5B21B6",
//               WebkitTextFillColor: "#5B21B6",
//               fontWeight: 950,
//               fontSize: 14,
//             }}
//           >
//             V
//           </div>
//           <div style={{ fontSize: 15, fontWeight: 950, color: UI.text, WebkitTextFillColor: UI.text }}>Audit Versions</div>
//         </div>

//         <div style={{ flex: 1 }} />

//         <input
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//           onKeyDown={(e) => e.stopPropagation()}
//           onMouseDown={(e) => e.stopPropagation()}
//           placeholder="Search audit, site, type, auditor…"
//           autoComplete="off"
//           style={{
//             width: 360,
//             maxWidth: "42vw",
//             padding: "9px 12px",
//             borderRadius: 999,
//             border: `1px solid ${UI.border}`,
//             outline: "none",
//             fontSize: 13,
//             backgroundColor: "#F9FAFB",
//             color: UI.text,
//             WebkitTextFillColor: UI.text,
//             caretColor: UI.text,
//           }}
//         />

//         <button style={filterIconBtn} onClick={() => setFilterOpen(true)} title="Filters">
//           <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
//             <path d="M4 7h16" stroke={UI.text} strokeWidth="2" strokeLinecap="round" />
//             <path d="M7 12h13" stroke={UI.text} strokeWidth="2" strokeLinecap="round" />
//             <path d="M10 17h10" stroke={UI.text} strokeWidth="2" strokeLinecap="round" />
//           </svg>
//         </button>

//         <button onClick={() => loadVersionList({ silent: false })} style={topBtn} title="Refresh">
//           Refresh
//         </button>
//       </div>

//       {/* BODY */}
//       <div
//         style={{
//           flex: "1 1 auto",
//           minHeight: 0,
//           minWidth: 0,
//           padding: 12,
//           overflow: "hidden",
//           backgroundColor: UI.bg,
//           boxSizing: "border-box",
//         }}
//       >
//         <div
//           style={{
//             width: "100%",
//             height: "100%",
//             minHeight: 0,
//             minWidth: 0,
//             display: "grid",
//             gridTemplateColumns,
//             gap: 12,
//             overflow: "hidden",
//             transition: "grid-template-columns 180ms ease",
//             backgroundColor: UI.bg,
//             boxSizing: "border-box",
//           }}
//         >
//           {/* LEFT */}
//           {collapseMode === "audit" || collapseMode === "both" ? (
//             <CollapsedRail title="Audits" subtitle={selectedAuditId || ""} onExpand={() => setCollapseMode("none")} />
//           ) : (
//             <Panel
//               title="Audits"
//               subtitle={loadingList ? "Loading…" : listError ? "Error loading audits" : `${filteredAudits.length} shown`}
//               tint={UI.tintB}
//               headerRight={
//                 <IconBtn title="Collapse audits" onClick={() => setCollapseMode("audit")}>
//                   <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
//                     <path d="M15 6l-6 6 6 6" stroke={UI.text} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
//                   </svg>
//                 </IconBtn>
//               }
//             >
//               {!ready && <Empty>Waiting for Kissflow context…</Empty>}
//               {ready && loadingList && <Empty>Loading audits…</Empty>}
//               {ready && !loadingList && listError && <ErrorText>{listError}</ErrorText>}
//               {ready && !loadingList && !listError && filteredAudits.length === 0 && <Empty>No audits match your filters.</Empty>}

//               {filteredAudits.map((a) => {
//                 const active = a.auditId === selectedAuditId;
//                 return (
//                   <div
//                     key={a.auditId}
//                     onClick={() => {
//                       setSelectedAuditId(a.auditId);
//                       setSelectedVersionRowId(null);
//                       setDetail(null);
//                       setDetailError("");
//                     }}
//                     style={{
//                       cursor: "pointer",
//                       borderRadius: 16,
//                       border: active ? `2px solid ${UI.accent2}` : `1px solid ${UI.border}`,
//                       backgroundColor: active ? UI.tintB : UI.surface,
//                       padding: 12,
//                       transition: "0.15s ease",
//                       minWidth: 0,
//                     }}
//                   >
//                     <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, minWidth: 0 }}>
//                       <div style={{ fontSize: 13, fontWeight: 950, color: UI.text, WebkitTextFillColor: UI.text, minWidth: 0 }}>
//                         {a.auditId}
//                       </div>
//                       <div style={chipStyle("#EDE9FE", "#5B21B6", "#C4B5FD")}>{a.versionCount} versions</div>
//                     </div>

//                     <div style={{ marginTop: 8, display: "flex", flexWrap: "wrap", gap: 8, minWidth: 0 }}>
//                       <span style={auditTypePill(a.auditType)}>{a.auditType || "—"}</span>
//                       <span style={chipStyle("#F3F4F6", "#374151", UI.border)}>{fmtDate(a.scheduledDate)}</span>
//                       <span style={chipStyle("#F3F4F6", "#374151", UI.border)}>{a.siteName || "—"}</span>
//                     </div>

//                     <div style={{ marginTop: 10, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, minWidth: 0 }}>
//                       <Meta label="Auditor" value={safeUserName(a.auditor)} />
//                       <Meta label="Auditee" value={safeUserName(a.auditee)} />
//                     </div>
//                   </div>
//                 );
//               })}
//             </Panel>
//           )}

//           {/* MIDDLE */}
//           {collapseMode === "both" ? (
//             <CollapsedRail title="Versions" subtitle={detail?.Version ? fmtVersion(detail?.Version) : ""} onExpand={() => setCollapseMode("audit")} />
//           ) : (
//             <Panel
//               title="Versions"
//               subtitle={selectedAudit ? `For ${selectedAudit.auditId}` : "Select an audit"}
//               tint={UI.tintA}
//               headerRight={
//                 <IconBtn title="Collapse versions" onClick={() => setCollapseMode("both")}>
//                   <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
//                     <path d="M15 6l-6 6 6 6" stroke={UI.text} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
//                   </svg>
//                 </IconBtn>
//               }
//             >
//               {!selectedAudit && <Empty>Pick an audit to see versions.</Empty>}

//               {selectedAudit &&
//                 selectedAudit.versions.map((v) => {
//                   const active = v.rowId === selectedVersionRowId;
//                   return (
//                     <div
//                       key={v._key} // ✅ FIX: stable unique key prevents ghost versions
//                       onClick={() => {
//                         if (!v.rowId) return; // ✅ safety: cannot load detail without id
//                         setSelectedVersionRowId(v.rowId);
//                         loadVersionDetail(v.rowId);
//                       }}
//                       style={{
//                         cursor: v.rowId ? "pointer" : "not-allowed",
//                         opacity: v.rowId ? 1 : 0.6,
//                         borderRadius: 16,
//                         border: active ? `2px solid ${UI.accent}` : `1px solid ${UI.border}`,
//                         backgroundColor: active ? "#EFF6FF" : UI.surface,
//                         padding: 12,
//                         transition: "0.15s ease",
//                         minWidth: 0,
//                       }}
//                       title={!v.rowId ? "Missing row id for this version item" : ""}
//                     >
//                       <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10, minWidth: 0 }}>
//                         <div style={{ fontSize: 13, fontWeight: 950, color: UI.text, WebkitTextFillColor: UI.text }}>
//                           {v.versionLabel}
//                         </div>
//                         <div style={chipStyle("#DBEAFE", "#1D4ED8", "#93C5FD")}>{fmtDate(v.scheduledDate)}</div>
//                       </div>

//                       <div style={{ marginTop: 8, display: "flex", flexWrap: "wrap", gap: 8 }}>
//                         <span style={auditTypePill(v.auditType)}>{v.auditType || "—"}</span>
//                       </div>
//                     </div>
//                   );
//                 })}
//             </Panel>
//           )}

//           {/* RIGHT */}
//           <Panel
//             title="Version Details"
//             subtitle={selectedVersionRowId ? "" : "Select a version"}
//             tint={UI.tintC}
//             headerRight={
//               <button
//                 style={{
//                   ...expandBtnStyle,
//                   opacity: selectedVersionRowId ? 1 : 0.5,
//                   pointerEvents: selectedVersionRowId ? "auto" : "none",
//                 }}
//                 onClick={() => setDetailsFullscreen(true)}
//                 title="Expand to full page"
//               >
//                 <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
//                   <path d="M9 3H5a2 2 0 0 0-2 2v4" stroke={UI.text} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
//                   <path d="M15 21h4a2 2 0 0 0 2-2v-4" stroke={UI.text} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
//                   <path d="M21 9V5a2 2 0 0 0-2-2h-4" stroke={UI.text} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
//                   <path d="M3 15v4a2 2 0 0 0 2 2h4" stroke={UI.text} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
//                 </svg>
//                 Expand
//               </button>
//             }
//           >
//             <div style={{ position: "relative", minHeight: 240, minWidth: 0 }}>
//               {loadingDetail && selectedVersionRowId && (
//                 <div
//                   style={{
//                     position: "absolute",
//                     inset: 0,
//                     background: UI.surface,
//                     zIndex: 3,
//                     display: "flex",
//                     alignItems: "center",
//                     justifyContent: "center",
//                     fontWeight: 900,
//                     color: UI.muted,
//                     WebkitTextFillColor: UI.muted,
//                     borderRadius: 16,
//                     border: `1px solid ${UI.border}`,
//                   }}
//                 >
//                   Loading…
//                 </div>
//               )}

//               {!selectedVersionRowId && <Empty>Choose a version to view details.</Empty>}
//               {selectedVersionRowId && !loadingDetail && detailError && <ErrorText>{detailError}</ErrorText>}

//               {selectedVersionRowId && detail && (
//                 <div
//                   style={{
//                     border: `1px solid ${UI.border}`,
//                     borderRadius: 18,
//                     padding: 14,
//                     backgroundColor: UI.surface,
//                     boxShadow: cardShadow,
//                     minWidth: 0,
//                   }}
//                 >
//                   <div style={{ fontSize: 14, fontWeight: 950, color: UI.text, WebkitTextFillColor: UI.text }}>
//                     {detail?.Audit_ID || "—"} • {fmtVersion(detail?.Version)}
//                   </div>

//                   <div style={{ marginTop: 6, fontSize: 12, color: UI.muted, WebkitTextFillColor: UI.muted }}>
//                     {(detail?.Audit_Type || "—") + " • " + (detail?.Site_Name || "—") + " • " + fmtDate(detail?.Audit_Scheduled_Date)}
//                   </div>

//                   <div style={{ marginTop: 12, display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, minWidth: 0 }}>
//                     <Meta label="Site" value={detail?.Site_Name} />
//                     <Meta label="Scheduled Date" value={fmtDate(detail?.Audit_Scheduled_Date)} />
//                     <Meta label="Audit Type" value={detail?.Audit_Type} />
//                   </div>

//                   <div style={{ marginTop: 10, display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, minWidth: 0 }}>
//                     <Meta label="Auditor" value={safeUserName(detail?.Auditor)} />
//                     <Meta label="Auditee" value={safeUserName(detail?.Auditee)} />
//                     <Meta label="Department Head" value={safeUserName(detail?.Department_Head)} />
//                   </div>

//                   <DetailTable rows={detail?.["Table::Untitled_Table"] || []} />
//                 </div>
//               )}
//             </div>
//           </Panel>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default DefaultLandingComponent;


import React, { useEffect, useMemo, useRef, useState } from "react";
import { kf } from "./../sdk/index.js";

/* ===================== CONSTANT LIGHT THEME (NO DARK / NO TRANSPARENT BG) ===================== */
const UI = {
  bg: "#F3F4F6",
  surface: "#FFFFFF",
  border: "#E5E7EB",
  text: "#111827",
  muted: "#6B7280",
  tintA: "#EEF2FF",
  tintB: "#F5F3FF",
  tintC: "#ECFDF5",
  accent: "#2563EB",
  accent2: "#7C3AED",
  danger: "#B91C1C",
};

const FLOW_ID = "Version_Master_A00";
const APP_ID = "Ac9Pds4TaXkR";
const LIST_PAGE_SIZE = 100000;

const delay = (ms) => new Promise((r) => setTimeout(r, ms));

const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const fmtDate = (ymd) => {
  if (!ymd) return "—";
  const d = new Date(ymd);
  if (Number.isNaN(d.getTime())) return String(ymd);
  return `${d.getDate()} ${monthNames[d.getMonth()]} ${d.getFullYear()}`;
};

const safeUserName = (u) => u?.Name || u?.DisplayName || u?.Email || "—";

const fmtVersion = (v) => {
  if (v == null || v === "") return "V—";
  const s = String(v).trim();
  const m = s.match(/^v\s*(\d+)$/i);
  if (m?.[1]) return `V${m[1]}`;
  const n = Number(s);
  if (!Number.isNaN(n) && Number.isFinite(n)) return `V${String(n)}`;
  return s.toUpperCase().startsWith("V") ? s.toUpperCase() : `V${s}`;
};

const chipStyle = (bg, fg, border) => ({
  display: "inline-flex",
  alignItems: "center",
  padding: "2px 10px",
  borderRadius: 999,
  fontSize: 11,
  fontWeight: 800,
  backgroundColor: bg,
  color: fg,
  WebkitTextFillColor: fg,
  border: `1px solid ${border}`,
  whiteSpace: "nowrap",
});

const cardShadow = "0 8px 18px rgba(17, 24, 39, 0.06)";

const buildListUrl = ({ accId, withAccount }) => {
  const qs = `visited=1&page_number=1&page_size=${LIST_PAGE_SIZE}`;
  return withAccount ? `/form/2/${accId}/${FLOW_ID}/list?${qs}` : `/form/2/${APP_ID}/${FLOW_ID}/list?${qs}`;
};

const buildDetailUrls = ({ accId, rowId }) => [
  `/form/2/${accId}/${FLOW_ID}/${rowId}`,
  `/form/2/${APP_ID}/${FLOW_ID}/${rowId}`,
  `/form/2/${accId}/${APP_ID}/${FLOW_ID}/${rowId}`,
];

async function kfApiTryMany(urls) {
  let lastErr = null;
  for (const url of urls) {
    try {
      const res = await kf.api(url);
      return { res, usedUrl: url };
    } catch (e) {
      lastErr = e;
    }
  }
  throw lastErr;
}

/**
 * ✅ FIX 1: Do NOT group missing Audit_ID into "—"
 * ✅ FIX 2: Provide stable unique keys for versions even if _id is missing
 */
const buildAuditGroups = (rows = []) => {
  const map = new Map();

  rows.forEach((r) => {
    const auditIdRaw = r?.Audit_ID;
    if (!auditIdRaw) return; // ✅ skip invalid rows (prevents ghost cross-audit grouping)
    const auditId = String(auditIdRaw).trim();
    if (!auditId) return;

    if (!map.has(auditId)) map.set(auditId, []);
    map.get(auditId).push(r);
  });

  const audits = Array.from(map.entries()).map(([auditId, items]) => {
    const sorted = [...items].sort((a, b) => {
      const av = a?.Version ?? "";
      const bv = b?.Version ?? "";
      const an = Number(av);
      const bn = Number(bv);
      if (!Number.isNaN(an) && !Number.isNaN(bn)) return bn - an;
      return String(bv).localeCompare(String(av));
    });

    const pick = (key) => sorted.find((x) => x?.[key] != null)?.[key];

    return {
      auditId,
      siteName: pick("Site_Name") || "—",
      auditType: pick("Audit_Type") || "—",
      scheduledDate: pick("Audit_Scheduled_Date") || null,
      auditor: pick("Auditor") || null,
      auditee: pick("Auditee") || null,
      deptHead: pick("Department_Head") || null,

      // ✅ stable keys: auditId + rowId + idx
      versions: sorted.map((x, idx) => {
        const rowId = x?._id || null;
        return {
          rowId,
          _key: `${auditId}::${rowId || "noid"}::${idx}`,
          versionLabel: fmtVersion(x?.Version),
          scheduledDate: x?.Audit_Scheduled_Date ?? null,
          auditType: x?.Audit_Type ?? pick("Audit_Type") ?? "—",
        };
      }),

      versionCount: sorted.length,
    };
  });

  audits.sort((a, b) => {
    const ad = a.scheduledDate ? new Date(a.scheduledDate).getTime() : -Infinity;
    const bd = b.scheduledDate ? new Date(b.scheduledDate).getTime() : -Infinity;
    if (bd !== ad) return bd - ad;
    return String(a.auditId).localeCompare(String(b.auditId));
  });

  return audits;
};

const auditTypePill = (auditType) => {
  const t = String(auditType || "").toLowerCase();
  if (t.includes("annual")) return chipStyle("#DBEAFE", "#1D4ED8", "#93C5FD");
  if (t.includes("qgmp")) return chipStyle("#DCFCE7", "#166534", "#86EFAC");
  return chipStyle("#EDE9FE", "#5B21B6", "#C4B5FD");
};

/* ===================== FILTER DRAWER (SOLID BG) ===================== */
function FilterDrawer({ open, onClose, availableSites, availableTypes, filters, setFilters }) {
  if (!open) return null;

  const overlay = {
    position: "fixed",
    inset: 0,
    zIndex: 99999,
    display: "flex",
    justifyContent: "flex-end",
    background: UI.bg,
    overflow: "hidden",
  };

  const panel = {
    width: 360,
    maxWidth: "92vw",
    height: "100%",
    background: UI.surface,
    borderLeft: `1px solid ${UI.border}`,
    boxShadow: "0 18px 48px rgba(15,23,42,0.12)",
    padding: 12,
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
    gap: 10,
    overflow: "hidden",
  };

  const label = {
    fontSize: 11,
    fontWeight: 900,
    color: UI.text,
    WebkitTextFillColor: UI.text,
    marginBottom: 6,
  };

  const input = {
    width: "100%",
    height: 36,
    padding: "0 10px",
    borderRadius: 12,
    border: `1px solid ${UI.border}`,
    outline: "none",
    fontSize: 13,
    color: UI.text,
    WebkitTextFillColor: UI.text,
    background: UI.surface,
    boxSizing: "border-box",
    appearance: "none",
    WebkitAppearance: "none",
    MozAppearance: "none",
  };

  const option = { color: UI.text, WebkitTextFillColor: UI.text, backgroundColor: UI.surface };

  const btn = {
    height: 36,
    padding: "0 12px",
    borderRadius: 12,
    border: `1px solid ${UI.text}`,
    background: UI.surface,
    cursor: "pointer",
    fontSize: 13,
    fontWeight: 900,
    color: UI.text,
    WebkitTextFillColor: UI.text,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  };

  return (
    <div
      style={overlay}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div style={panel} onMouseDown={(e) => e.stopPropagation()}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
          <div style={{ fontSize: 13, fontWeight: 950, color: UI.text, WebkitTextFillColor: UI.text }}>Filters</div>
          <button style={btn} onClick={onClose}>
            Close
          </button>
        </div>

        <div>
          <div style={label}>Site</div>
          <select style={input} value={filters.site} onChange={(e) => setFilters((p) => ({ ...p, site: e.target.value }))}>
            <option style={option} value="all">
              All
            </option>
            {availableSites.map((s) => (
              <option style={option} key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        <div>
          <div style={label}>Audit Type</div>
          <select style={input} value={filters.type} onChange={(e) => setFilters((p) => ({ ...p, type: e.target.value }))}>
            <option style={option} value="all">
              All
            </option>
            {availableTypes.map((t) => (
              <option style={option} key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        <div>
          <div style={label}>Start date</div>
          <input style={input} type="date" value={filters.startDate} onChange={(e) => setFilters((p) => ({ ...p, startDate: e.target.value }))} />
        </div>

        <div>
          <div style={label}>End date</div>
          <input style={input} type="date" value={filters.endDate} onChange={(e) => setFilters((p) => ({ ...p, endDate: e.target.value }))} />
        </div>

        <div style={{ display: "flex", gap: 10, marginTop: "auto" }}>
          <button
            style={{ ...btn, flex: 1, border: `1px solid ${UI.border}` }}
            onClick={() => setFilters({ site: "all", type: "all", startDate: "", endDate: "" })}
          >
            Reset
          </button>
          <button style={{ ...btn, flex: 1 }} onClick={onClose}>
            Apply
          </button>
        </div>
      </div>
    </div>
  );
}

/* ===================== TABLE ===================== */
function DetailTable({ rows }) {
  if (!Array.isArray(rows) || rows.length === 0) return null;

  const th = {
    textAlign: "left",
    fontSize: 10,
    fontWeight: 900,
    color: UI.muted,
    WebkitTextFillColor: UI.muted,
    padding: "9px 10px",
    borderBottom: `1px solid ${UI.border}`,
    position: "sticky",
    top: 0,
    background: UI.surface,
    zIndex: 2,
    whiteSpace: "nowrap",
  };

  const td = {
    fontSize: 12,
    color: UI.text,
    WebkitTextFillColor: UI.text,
    padding: "9px 10px",
    borderBottom: `1px solid ${UI.border}`,
    verticalAlign: "top",
  };

  const wrap = { ...td, whiteSpace: "pre-wrap", lineHeight: 1.35 };
  const nowrap = { ...td, whiteSpace: "nowrap" };

  return (
    <div style={{ marginTop: 12, border: `1px solid ${UI.border}`, borderRadius: 18, overflow: "hidden" }}>
      <div
        style={{
          maxHeight: "100%",
          overflowY: "auto",
          overflowX: "auto",
          background: UI.surface,
          maxWidth: "100%",
        }}
      >
        <table
          style={{
            width: "max-content",
            minWidth: "100%",
            borderCollapse: "separate",
            borderSpacing: 0,
          }}
        >
          <thead>
            <tr>
              <th style={th}>Element</th>
              <th style={th}>Factor</th>
              <th style={th}>Requirement</th>
              <th style={th}>Observation</th>
              <th style={th}>Rating</th>
              <th style={th}>RCA</th>
              <th style={th}>CAPA</th>
              <th style={th}>Dept Head</th>
              <th style={th}>Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, idx) => (
              <tr key={r?._id || `${idx}`}>
                <td style={nowrap}>{r?.Element || "—"}</td>
                <td style={wrap}>{r?.Factor || "—"}</td>
                <td style={wrap}>{r?.Requirement_1 || "—"}</td>
                <td style={wrap}>{r?.Observation || "—"}</td>
                <td style={nowrap}>{r?.Rating ?? "—"}</td>
                <td style={wrap}>{r?.RCA_1 || "—"}</td>
                <td style={wrap}>{r?.CAPA_1 || "—"}</td>
                <td style={wrap}>{r?.Deparment_Head_Feedback || "—"}</td>
                <td style={nowrap}>{r?.Auditor_Feedback_2 || "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ===================== BASIC UI ===================== */
function Panel({ title, subtitle, tint, children, headerRight }) {
  return (
    <div
      style={{
        borderRadius: 18,
        backgroundColor: UI.surface,
        border: `1px solid ${UI.border}`,
        boxShadow: cardShadow,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        minHeight: 0,
        minWidth: 0,
        height: "100%",
      }}
    >
      <div
        style={{
          padding: "12px 14px",
          borderBottom: `1px solid ${UI.border}`,
          backgroundColor: tint,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 10,
          minWidth: 0,
          flex: "0 0 auto",
        }}
      >
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: 13, fontWeight: 950, color: UI.text, WebkitTextFillColor: UI.text }}>{title}</div>
          {subtitle ? <div style={{ fontSize: 12, color: UI.muted, WebkitTextFillColor: UI.muted, marginTop: 2 }}>{subtitle}</div> : null}
        </div>
        {headerRight ? <div style={{ flex: "0 0 auto" }}>{headerRight}</div> : null}
      </div>

      <div
        style={{
          padding: 12,
          overflowY: "auto",
          overflowX: "hidden",
          display: "flex",
          flexDirection: "column",
          gap: 10,
          minHeight: 0,
          minWidth: 0,
          flex: "1 1 auto",
        }}
      >
        {children}
      </div>
    </div>
  );
}

function Empty({ children }) {
  return <div style={{ padding: 14, color: UI.muted, WebkitTextFillColor: UI.muted, fontSize: 13 }}>{children}</div>;
}

function ErrorText({ children }) {
  return <div style={{ padding: 14, color: UI.danger, WebkitTextFillColor: UI.danger, fontSize: 13 }}>{children}</div>;
}

function Meta({ label, value }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 2, minWidth: 0 }}>
      <div style={{ fontSize: 11, fontWeight: 900, color: UI.muted, WebkitTextFillColor: UI.muted }}>{label}</div>
      <div style={{ fontSize: 12, color: UI.text, WebkitTextFillColor: UI.text, fontWeight: 800, wordBreak: "break-word", minWidth: 0 }}>
        {value == null || value === "" ? "—" : String(value)}
      </div>
    </div>
  );
}

/* ===================== COLLAPSED RAIL ===================== */
function CollapsedRail({ title, subtitle, onExpand }) {
  return (
    <div
      onClick={onExpand}
      title="Click to expand"
      style={{
        height: "100%",
        borderRadius: 18,
        border: `1px solid ${UI.border}`,
        background: UI.surface,
        boxShadow: cardShadow,
        overflow: "hidden",
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
        userSelect: "none",
        minWidth: 0,
      }}
    >
      <div
        style={{
          background: UI.bg,
          borderBottom: `1px solid ${UI.border}`,
          padding: 10,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
        }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M10 7l5 5-5 5" stroke={UI.text} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: 10 }}>
        <div
          style={{
            writingMode: "vertical-rl",
            transform: "rotate(180deg)",
            display: "flex",
            alignItems: "center",
            gap: 8,
            color: UI.text,
            WebkitTextFillColor: UI.text,
            fontWeight: 950,
            fontSize: 12,
            whiteSpace: "nowrap",
          }}
        >
          {title}
          {subtitle ? <span style={{ color: UI.muted, WebkitTextFillColor: UI.muted, fontWeight: 800, fontSize: 11 }}>{subtitle}</span> : null}
        </div>
      </div>
    </div>
  );
}

/* ===================== ICON BUTTON ===================== */
function IconBtn({ title, onClick, children }) {
  return (
    <button
      title={title}
      onClick={onClick}
      style={{
        width: 34,
        height: 34,
        borderRadius: 12,
        border: `1px solid ${UI.border}`,
        background: UI.surface,
        cursor: "pointer",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 0,
      }}
    >
      {children}
    </button>
  );
}

/* ===================== FULL PAGE OVERLAY ===================== */
function FullPageOverlay({ open, onClose, title, subtitle, children }) {
  if (!open) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 99998,
        background: UI.bg,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          padding: "12px 18px",
          backgroundColor: UI.surface,
          boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
          display: "flex",
          alignItems: "center",
          gap: 12,
          zIndex: 2,
          borderBottom: `1px solid ${UI.border}`,
          flex: "0 0 auto",
          boxSizing: "border-box",
        }}
      >
        <button
          onClick={onClose}
          style={{
            height: 36,
            padding: "0 12px",
            borderRadius: 12,
            border: `1px solid ${UI.border}`,
            background: UI.surface,
            cursor: "pointer",
            fontSize: 13,
            fontWeight: 900,
            color: UI.text,
            WebkitTextFillColor: UI.text,
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
          }}
          title="Back"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M15 18l-6-6 6-6" stroke={UI.text} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Back
        </button>

        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: 15, fontWeight: 950, color: UI.text, WebkitTextFillColor: UI.text, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {title}
          </div>
          {subtitle ? (
            <div style={{ fontSize: 12, color: UI.muted, WebkitTextFillColor: UI.muted, marginTop: 2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {subtitle}
            </div>
          ) : null}
        </div>
      </div>

      <div style={{ flex: "1 1 auto", minHeight: 0, padding: 12, overflow: "auto", boxSizing: "border-box" }}>
        {children}
      </div>
    </div>
  );
}

/* ===================== MAIN PAGE ===================== */
export function DefaultLandingComponent() {
  const [ready, setReady] = useState(false);

  const [loadingList, setLoadingList] = useState(false);
  const [listError, setListError] = useState("");
  const [rawListRows, setRawListRows] = useState([]);

  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({ site: "all", type: "all", startDate: "", endDate: "" });
  const [filterOpen, setFilterOpen] = useState(false);

  const [selectedAuditId, setSelectedAuditId] = useState(null);
  const [selectedVersionRowId, setSelectedVersionRowId] = useState(null);

  const [loadingDetail, setLoadingDetail] = useState(false);
  const [detailError, setDetailError] = useState("");
  const [detail, setDetail] = useState(null);

  const [collapseMode, setCollapseMode] = useState("none"); // "none" | "audit" | "both"
  const [detailsFullscreen, setDetailsFullscreen] = useState(false);

  const listAbortRef = useRef(false);
  const detailAbortRef = useRef(false);

  // ✅ NEW: once user selects an audit, NEVER auto-select default again
  const userSelectedAuditRef = useRef(false);

  useEffect(() => {
    let cancelled = false;
    const boot = async () => {
      let attempts = 0;
      while ((!kf.account?._id || !kf.user?._id) && !cancelled && attempts < 40) {
        await delay(200);
        attempts += 1;
      }
      if (cancelled) return;
      setReady(Boolean(kf.account?._id));
    };
    boot();
    return () => {
      cancelled = true;
    };
  }, []);

  const loadVersionList = async ({ silent = false } = {}) => {
    const accId = kf.account?._id;
    if (!accId) return;

    if (!silent) setLoadingList(true);
    setListError("");
    listAbortRef.current = false;

    const urlWithAcc = buildListUrl({ accId, withAccount: true });
    const urlWithoutAcc = buildListUrl({ accId, withAccount: false });

    try {
      const { res } = await kfApiTryMany([urlWithAcc, urlWithoutAcc]);
      if (listAbortRef.current) return;

      const rows =
        Array.isArray(res?.Data) ? res.Data :
        Array.isArray(res?.data) ? res.data :
        Array.isArray(res?.Items) ? res.Items :
        Array.isArray(res?.items) ? res.items :
        [];

      setRawListRows(rows);

      // ✅ FIX (core): Auto-select ONLY on first load BEFORE user clicks any audit.
      if (!userSelectedAuditRef.current && !selectedAuditId) {
        const firstValid = rows.find((r) => r?.Audit_ID)?.Audit_ID;
        if (firstValid) setSelectedAuditId(String(firstValid).trim());
      }

      // ✅ FIX (core): Do NOT clear user's selection on refresh.
      // (Your earlier "exists check" is what caused it to jump back to first audit.)
    } catch (e) {
      if (listAbortRef.current) return;
      setListError(e?.message || "Failed to load audits list.");
      setRawListRows([]);
    } finally {
      if (!listAbortRef.current && !silent) setLoadingList(false);
    }
  };

  useEffect(() => {
    if (!ready) return;

    loadVersionList({ silent: false });

    // Auto refresh
    const t = setInterval(() => loadVersionList({ silent: true }), 12000);

    return () => {
      clearInterval(t);
      listAbortRef.current = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready]);

  const loadVersionDetail = async (rowId) => {
    const accId = kf.account?._id;
    if (!accId || !rowId) return;

    setDetailError("");
    setLoadingDetail(true);
    detailAbortRef.current = false;

    const urls = buildDetailUrls({ accId, rowId });

    try {
      const { res } = await kfApiTryMany(urls);
      if (detailAbortRef.current) return;

      const payload = res?.Data ? res.Data : res?.data ? res.data : res;
      setDetail(payload || null);
    } catch (e) {
      if (detailAbortRef.current) return;
      setDetailError(e?.message || "Failed to load version details.");
      setDetail(null);
    } finally {
      if (!detailAbortRef.current) setLoadingDetail(false);
    }
  };

  const audits = useMemo(() => buildAuditGroups(rawListRows), [rawListRows]);

  const availableSites = useMemo(() => {
    const set = new Set();
    rawListRows.forEach((r) => r?.Site_Name && set.add(r.Site_Name));
    return Array.from(set).sort((a, b) => String(a).localeCompare(String(b)));
  }, [rawListRows]);

  const availableTypes = useMemo(() => {
    const set = new Set();
    rawListRows.forEach((r) => r?.Audit_Type && set.add(r.Audit_Type));
    return Array.from(set).sort((a, b) => String(a).localeCompare(String(b)));
  }, [rawListRows]);

  const filteredAudits = useMemo(() => {
    const q = search.trim().toLowerCase();
    const startMs = filters.startDate ? new Date(filters.startDate).getTime() : null;
    const endMs = filters.endDate ? new Date(filters.endDate).getTime() : null;

    return audits.filter((a) => {
      if (filters.site !== "all" && a.siteName !== filters.site) return false;
      if (filters.type !== "all" && a.auditType !== filters.type) return false;

      if (startMs || endMs) {
        const d = a.scheduledDate ? new Date(a.scheduledDate).getTime() : null;
        if (d == null) return false;
        if (startMs && d < startMs) return false;
        if (endMs && d > endMs) return false;
      }

      if (!q) return true;
      const hay = [a.auditId, a.siteName, a.auditType, safeUserName(a.auditor), safeUserName(a.auditee)].join(" ").toLowerCase();
      return hay.includes(q);
    });
  }, [audits, search, filters]);

  // ✅ FIX: selectedAudit must come from FULL audits list, not filtered list
  // Otherwise filters/search can make it look like selection "lost".
  const selectedAudit = useMemo(
    () => audits.find((a) => a.auditId === selectedAuditId) || null,
    [audits, selectedAuditId]
  );

  // Keep your behavior: auto-collapse when version selected
  useEffect(() => {
    if (selectedVersionRowId) setCollapseMode("audit");
  }, [selectedVersionRowId]);

  const gridTemplateColumns = useMemo(() => {
    const COLLAPSED = "56px";
    const AUDIT = "minmax(280px, 360px)";
    const VERSION = "minmax(260px, 320px)";

    if (collapseMode === "both") return `${COLLAPSED} ${COLLAPSED} minmax(0, 1fr)`;
    if (collapseMode === "audit") return `${COLLAPSED} ${VERSION} minmax(0, 1fr)`;
    return `${AUDIT} ${VERSION} minmax(0, 1fr)`;
  }, [collapseMode]);

  const filterIconBtn = {
    width: 36,
    height: 36,
    borderRadius: 12,
    border: `1px solid ${UI.border}`,
    background: UI.surface,
    cursor: "pointer",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 0,
  };

  const topBtn = {
    height: 36,
    padding: "0 12px",
    borderRadius: 999,
    border: `1px solid ${UI.text}`,
    background: UI.surface,
    cursor: "pointer",
    fontSize: 13,
    fontWeight: 900,
    color: UI.text,
    WebkitTextFillColor: UI.text,
  };

  const expandBtnStyle = {
    height: 34,
    padding: "0 10px",
    borderRadius: 12,
    border: `1px solid ${UI.border}`,
    background: UI.surface,
    cursor: "pointer",
    fontSize: 12,
    fontWeight: 900,
    color: UI.text,
    WebkitTextFillColor: UI.text,
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
  };

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        minWidth: 0,
        minHeight: 0,
        display: "flex",
        flexDirection: "column",
        backgroundColor: UI.bg,
        color: UI.text,
        fontFamily: "Inter, system-ui, sans-serif",
        overflow: "hidden",
        boxSizing: "border-box",
      }}
    >
      <FilterDrawer
        open={filterOpen}
        onClose={() => setFilterOpen(false)}
        availableSites={availableSites}
        availableTypes={availableTypes}
        filters={filters}
        setFilters={setFilters}
      />

      <FullPageOverlay
        open={detailsFullscreen}
        onClose={() => setDetailsFullscreen(false)}
        title={detail ? `${detail?.Audit_ID || "—"} • ${fmtVersion(detail?.Version)}` : "Version Details"}
        subtitle={detail ? `${detail?.Audit_Type || "—"} • ${detail?.Site_Name || "—"} • ${fmtDate(detail?.Audit_Scheduled_Date)}` : ""}
      >
        {!selectedVersionRowId && <Empty>Choose a version to view details.</Empty>}
        {selectedVersionRowId && loadingDetail && (
          <div
            style={{
              width: "100%",
              borderRadius: 16,
              border: `1px solid ${UI.border}`,
              background: UI.surface,
              padding: 18,
              fontWeight: 900,
              color: UI.muted,
              WebkitTextFillColor: UI.muted,
              textAlign: "center",
            }}
          >
            Loading…
          </div>
        )}
        {selectedVersionRowId && !loadingDetail && detailError && <ErrorText>{detailError}</ErrorText>}

        {selectedVersionRowId && detail && (
          <div
            style={{
              border: `1px solid ${UI.border}`,
              borderRadius: 18,
              padding: 14,
              backgroundColor: UI.surface,
              boxShadow: cardShadow,
              minWidth: 0,
            }}
          >
            <div style={{ fontSize: 14, fontWeight: 950, color: UI.text, WebkitTextFillColor: UI.text }}>
              {detail?.Audit_ID || "—"} • {fmtVersion(detail?.Version)}
            </div>

            <div style={{ marginTop: 6, fontSize: 12, color: UI.muted, WebkitTextFillColor: UI.muted }}>
              {(detail?.Audit_Type || "—") + " • " + (detail?.Site_Name || "—") + " • " + fmtDate(detail?.Audit_Scheduled_Date)}
            </div>

            <div style={{ marginTop: 12, display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, minWidth: 0 }}>
              <Meta label="Site" value={detail?.Site_Name} />
              <Meta label="Scheduled Date" value={fmtDate(detail?.Audit_Scheduled_Date)} />
              <Meta label="Audit Type" value={detail?.Audit_Type} />
            </div>

            <div style={{ marginTop: 10, display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, minWidth: 0 }}>
              <Meta label="Auditor" value={safeUserName(detail?.Auditor)} />
              <Meta label="Auditee" value={safeUserName(detail?.Auditee)} />
              <Meta label="Department Head" value={safeUserName(detail?.Department_Head)} />
            </div>

            <DetailTable rows={detail?.["Table::Untitled_Table"] || []} />
          </div>
        )}
      </FullPageOverlay>

      {/* TOP BAR */}
      <div
        style={{
          width: "100%",
          padding: "12px 18px",
          backgroundColor: UI.surface,
          boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
          display: "flex",
          alignItems: "center",
          gap: 12,
          zIndex: 2,
          borderBottom: `1px solid ${UI.border}`,
          flex: "0 0 auto",
          boxSizing: "border-box",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 12,
              backgroundColor: UI.tintB,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "1px solid #E9D5FF",
              color: "#5B21B6",
              WebkitTextFillColor: "#5B21B6",
              fontWeight: 950,
              fontSize: 14,
            }}
          >
            V
          </div>
          <div style={{ fontSize: 15, fontWeight: 950, color: UI.text, WebkitTextFillColor: UI.text }}>Audit Versions</div>
        </div>

        <div style={{ flex: 1 }} />

        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
          placeholder="Search audit, site, type, auditor…"
          autoComplete="off"
          style={{
            width: 360,
            maxWidth: "42vw",
            padding: "9px 12px",
            borderRadius: 999,
            border: `1px solid ${UI.border}`,
            outline: "none",
            fontSize: 13,
            backgroundColor: "#F9FAFB",
            color: UI.text,
            WebkitTextFillColor: UI.text,
            caretColor: UI.text,
          }}
        />

        <button style={filterIconBtn} onClick={() => setFilterOpen(true)} title="Filters">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M4 7h16" stroke={UI.text} strokeWidth="2" strokeLinecap="round" />
            <path d="M7 12h13" stroke={UI.text} strokeWidth="2" strokeLinecap="round" />
            <path d="M10 17h10" stroke={UI.text} strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>

        <button onClick={() => loadVersionList({ silent: false })} style={topBtn} title="Refresh">
          Refresh
        </button>
      </div>

      {/* BODY */}
      <div
        style={{
          flex: "1 1 auto",
          minHeight: 0,
          minWidth: 0,
          padding: 12,
          overflow: "hidden",
          backgroundColor: UI.bg,
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            minHeight: 0,
            minWidth: 0,
            display: "grid",
            gridTemplateColumns,
            gap: 12,
            overflow: "hidden",
            transition: "grid-template-columns 180ms ease",
            backgroundColor: UI.bg,
            boxSizing: "border-box",
          }}
        >
          {/* LEFT */}
          {collapseMode === "audit" || collapseMode === "both" ? (
            <CollapsedRail title="Audits" subtitle={selectedAuditId || ""} onExpand={() => setCollapseMode("none")} />
          ) : (
            <Panel
              title="Audits"
              subtitle={loadingList ? "Loading…" : listError ? "Error loading audits" : `${filteredAudits.length} shown`}
              tint={UI.tintB}
              headerRight={
                <IconBtn title="Collapse audits" onClick={() => setCollapseMode("audit")}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M15 6l-6 6 6 6" stroke={UI.text} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </IconBtn>
              }
            >
              {!ready && <Empty>Waiting for Kissflow context…</Empty>}
              {ready && loadingList && <Empty>Loading audits…</Empty>}
              {ready && !loadingList && listError && <ErrorText>{listError}</ErrorText>}
              {ready && !loadingList && !listError && filteredAudits.length === 0 && <Empty>No audits match your filters.</Empty>}

              {filteredAudits.map((a) => {
                const active = a.auditId === selectedAuditId;
                return (
                  <div
                    key={a.auditId}
                    onClick={() => {
                      userSelectedAuditRef.current = true; // ✅ key fix: lock selection
                      setSelectedAuditId(a.auditId);
                      setSelectedVersionRowId(null);
                      setDetail(null);
                      setDetailError("");
                    }}
                    style={{
                      cursor: "pointer",
                      borderRadius: 16,
                      border: active ? `2px solid ${UI.accent2}` : `1px solid ${UI.border}`,
                      backgroundColor: active ? UI.tintB : UI.surface,
                      padding: 12,
                      transition: "0.15s ease",
                      minWidth: 0,
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 950, color: UI.text, WebkitTextFillColor: UI.text, minWidth: 0 }}>
                        {a.auditId}
                      </div>
                      <div style={chipStyle("#EDE9FE", "#5B21B6", "#C4B5FD")}>{a.versionCount} versions</div>
                    </div>

                    <div style={{ marginTop: 8, display: "flex", flexWrap: "wrap", gap: 8, minWidth: 0 }}>
                      <span style={auditTypePill(a.auditType)}>{a.auditType || "—"}</span>
                      <span style={chipStyle("#F3F4F6", "#374151", UI.border)}>{fmtDate(a.scheduledDate)}</span>
                      <span style={chipStyle("#F3F4F6", "#374151", UI.border)}>{a.siteName || "—"}</span>
                    </div>

                    <div style={{ marginTop: 10, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, minWidth: 0 }}>
                      <Meta label="Auditor" value={safeUserName(a.auditor)} />
                      <Meta label="Auditee" value={safeUserName(a.auditee)} />
                    </div>
                  </div>
                );
              })}
            </Panel>
          )}

          {/* MIDDLE */}
          {collapseMode === "both" ? (
            <CollapsedRail title="Versions" subtitle={detail?.Version ? fmtVersion(detail?.Version) : ""} onExpand={() => setCollapseMode("audit")} />
          ) : (
            <Panel
              title="Versions"
              subtitle={selectedAudit ? `For ${selectedAudit.auditId}` : "Select an audit"}
              tint={UI.tintA}
              headerRight={
                <IconBtn title="Collapse versions" onClick={() => setCollapseMode("both")}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M15 6l-6 6 6 6" stroke={UI.text} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </IconBtn>
              }
            >
              {!selectedAudit && <Empty>Pick an audit to see versions.</Empty>}

              {selectedAudit &&
                selectedAudit.versions.map((v) => {
                  const active = v.rowId === selectedVersionRowId;
                  return (
                    <div
                      key={v._key} // ✅ FIX: stable unique key prevents ghost versions
                      onClick={() => {
                        if (!v.rowId) return; // ✅ safety: cannot load detail without id
                        setSelectedVersionRowId(v.rowId);
                        loadVersionDetail(v.rowId);
                      }}
                      style={{
                        cursor: v.rowId ? "pointer" : "not-allowed",
                        opacity: v.rowId ? 1 : 0.6,
                        borderRadius: 16,
                        border: active ? `2px solid ${UI.accent}` : `1px solid ${UI.border}`,
                        backgroundColor: active ? "#EFF6FF" : UI.surface,
                        padding: 12,
                        transition: "0.15s ease",
                        minWidth: 0,
                      }}
                      title={!v.rowId ? "Missing row id for this version item" : ""}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10, minWidth: 0 }}>
                        <div style={{ fontSize: 13, fontWeight: 950, color: UI.text, WebkitTextFillColor: UI.text }}>
                          {v.versionLabel}
                        </div>
                        <div style={chipStyle("#DBEAFE", "#1D4ED8", "#93C5FD")}>{fmtDate(v.scheduledDate)}</div>
                      </div>

                      <div style={{ marginTop: 8, display: "flex", flexWrap: "wrap", gap: 8 }}>
                        <span style={auditTypePill(v.auditType)}>{v.auditType || "—"}</span>
                      </div>
                    </div>
                  );
                })}
            </Panel>
          )}

          {/* RIGHT */}
          <Panel
            title="Version Details"
            subtitle={selectedVersionRowId ? "" : "Select a version"}
            tint={UI.tintC}
            headerRight={
              <button
                style={{
                  ...expandBtnStyle,
                  opacity: selectedVersionRowId ? 1 : 0.5,
                  pointerEvents: selectedVersionRowId ? "auto" : "none",
                }}
                onClick={() => setDetailsFullscreen(true)}
                title="Expand to full page"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M9 3H5a2 2 0 0 0-2 2v4" stroke={UI.text} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M15 21h4a2 2 0 0 0 2-2v-4" stroke={UI.text} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M21 9V5a2 2 0 0 0-2-2h-4" stroke={UI.text} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M3 15v4a2 2 0 0 0 2 2h4" stroke={UI.text} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Expand
              </button>
            }
          >
            <div style={{ position: "relative", minHeight: 240, minWidth: 0 }}>
              {loadingDetail && selectedVersionRowId && (
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: UI.surface,
                    zIndex: 3,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 900,
                    color: UI.muted,
                    WebkitTextFillColor: UI.muted,
                    borderRadius: 16,
                    border: `1px solid ${UI.border}`,
                  }}
                >
                  Loading…
                </div>
              )}

              {!selectedVersionRowId && <Empty>Choose a version to view details.</Empty>}
              {selectedVersionRowId && !loadingDetail && detailError && <ErrorText>{detailError}</ErrorText>}

              {selectedVersionRowId && detail && (
                <div
                  style={{
                    border: `1px solid ${UI.border}`,
                    borderRadius: 18,
                    padding: 14,
                    backgroundColor: UI.surface,
                    boxShadow: cardShadow,
                    minWidth: 0,
                  }}
                >
                  <div style={{ fontSize: 14, fontWeight: 950, color: UI.text, WebkitTextFillColor: UI.text }}>
                    {detail?.Audit_ID || "—"} • {fmtVersion(detail?.Version)}
                  </div>

                  <div style={{ marginTop: 6, fontSize: 12, color: UI.muted, WebkitTextFillColor: UI.muted }}>
                    {(detail?.Audit_Type || "—") + " • " + (detail?.Site_Name || "—") + " • " + fmtDate(detail?.Audit_Scheduled_Date)}
                  </div>

                  <div style={{ marginTop: 12, display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, minWidth: 0 }}>
                    <Meta label="Site" value={detail?.Site_Name} />
                    <Meta label="Scheduled Date" value={fmtDate(detail?.Audit_Scheduled_Date)} />
                    <Meta label="Audit Type" value={detail?.Audit_Type} />
                  </div>

                  <div style={{ marginTop: 10, display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, minWidth: 0 }}>
                    <Meta label="Auditor" value={safeUserName(detail?.Auditor)} />
                    <Meta label="Auditee" value={safeUserName(detail?.Auditee)} />
                    <Meta label="Department Head" value={safeUserName(detail?.Department_Head)} />
                  </div>

                  <DetailTable rows={detail?.["Table::Untitled_Table"] || []} />
                </div>
              )}
            </div>
          </Panel>
        </div>
      </div>
    </div>
  );
}

export default DefaultLandingComponent;
