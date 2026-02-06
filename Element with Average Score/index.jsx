import { kf } from "./../sdk/index.js";
import React, { useEffect, useMemo, useRef, useState } from "react";

/* ===================== CONFIG (easy to change later) ===================== */
const VARS = {
  startDate: "AAD_Start_Date",
  endDate: "AAD_End_Date",
  siteName: "AAD_Site_Name",
};

const REFRESH_IDS = [
  "ChartReport_KGTjEI5HTK",
  "Label_TeYV6nzKOg",
  "Component_OD41bPJcT0",
  "Component_IP64w3iQXt",
  "Component_Kgna7LQgui",
  "Component_1onGAdsqJw",
];

/* ===================== HELPERS ===================== */

// FY start = Apr 1
const getFinancialYearStart = () => {
  const today = new Date();
  const y = today.getFullYear();
  const m = today.getMonth() + 1;
  const fyStartYear = m >= 4 ? y : y - 1;
  return `${fyStartYear}-04-01`;
};

// FY end = Mar 31
const getFinancialYearEnd = () => {
  const today = new Date();
  const y = today.getFullYear();
  const m = today.getMonth() + 1;
  const fyEndYear = m >= 4 ? y + 1 : y;
  return `${fyEndYear}-03-31`;
};

const toYMD = (v) => {
  if (!v) return "";
  try {
    if (typeof v === "string" && /^\d{4}-\d{2}-\d{2}$/.test(v)) return v;
    return new Date(v).toISOString().split("T")[0];
  } catch {
    return String(v);
  }
};

const ymdToDDMMYYYY = (ymd) => {
  const s = toYMD(ymd);
  if (!s || !/^\d{4}-\d{2}-\d{2}$/.test(s)) return "—";
  const [yyyy, mm, dd] = s.split("-");
  return `${dd}/${mm}/${yyyy}`;
};

const delay = (ms) => new Promise((r) => setTimeout(r, ms));

/* ===================== SAFE KF HELPERS (prevents ready stuck) ===================== */

async function safeGetVar(name) {
  try {
    console.log(`🧾 [KF][getVariable] "${name}" -> START`);
    const v = await kf.app.getVariable(name);
    console.log(`✅ [KF][getVariable] "${name}" ->`, v);
    return v;
  } catch (e) {
    console.error(`❌ [KF][getVariable] "${name}" FAILED:`, e);
    return null;
  }
}

async function safeSetVar(name, value) {
  try {
    console.log(`🧾 [KF][setVariable] "${name}" =`, value);
    await kf.app.setVariable(name, value);
    console.log(`✅ [KF][setVariable] "${name}" OK`);
    return true;
  } catch (e) {
    console.error(`❌ [KF][setVariable] "${name}" FAILED:`, e);
    return false;
  }
}

/* ===================== COMPONENT REFRESH ===================== */

async function refreshComponentsOneByOne(ids = []) {
  console.log("🔄 [Refresh] START. Count:", ids.length, "IDs:", ids);

  for (const id of ids) {
    try {
      console.log(`🔄 [Refresh] getComponent("${id}")`);
      const componentInstance = await kf.app.page.getComponent(id);

      if (!componentInstance) {
        console.warn(`⚠️ [Refresh] Component not found: "${id}"`);
        continue;
      }
      if (typeof componentInstance.refresh !== "function") {
        console.warn(`⚠️ [Refresh] refresh() not available on "${id}"`, componentInstance);
        continue;
      }

      console.log(`✅ [Refresh] refresh() -> "${id}"`);
      componentInstance.refresh();

      await delay(250);
    } catch (e) {
      console.error(`❌ [Refresh] Failed for "${id}":`, e);
    }
  }

  console.log("✅ [Refresh] DONE.");
}

/* ===================== TOP MATERIALS ===================== */

async function setTopMaterialVars(top = []) {
  console.log("🧾 [TopMaterials] Setting Top_* vars. Items:", top);

  for (let i = 1; i <= 5; i++) {
    const item = top[i - 1];
    const nameVar = `Top_${i}_Material_Name`;
    const valueVar = `Top_${i}_Material_Value`;

    if (item) {
      console.log(`✅ [Vars] ${nameVar}="${item.material}" | ${valueVar}=${item.value}`);
      await kf.app.setVariable(nameVar, item.material);
      await kf.app.setVariable(valueVar, item.value);
    } else {
      console.log(`🧹 [Vars] Clear ${nameVar}, ${valueVar}`);
      await kf.app.setVariable(nameVar, "");
      await kf.app.setVariable(valueVar, 0);
    }
  }

  console.log("✅ [TopMaterials] Top_* vars updated.");
}

async function runTopMaterials_DEBUG({ acc_id, user_id, start_date, end_date }) {
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("🚀 [TopMaterials][DEBUG] START");
  console.log("✅ Inputs:", { acc_id, user_id, start_date, end_date });

  await setTopMaterialVars([]);

  if (!acc_id || !user_id || !start_date || !end_date) {
    console.warn("⚠️ [TopMaterials][DEBUG] Missing inputs -> STOP");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    return;
  }

  const url =
    `/analytics/2/${encodeURIComponent(acc_id)}/ds_Process_Child_Table_Top_Materia_A00/report/` +
    `Pivot_table_of_top_material_A00?apply_preferences=true` +
    `&$created_by_id=${encodeURIComponent(user_id)}` +
    `&$start_date=${encodeURIComponent(start_date)}` +
    `&$end_date=${encodeURIComponent(end_date)}`;

  console.log("🌐 [TopMaterials][DEBUG] URL:", url);

  try {
    const pivotResult = await kf.api(url, { method: "GET" });
    console.log("✅ [TopMaterials][DEBUG] pivotResult keys:", pivotResult ? Object.keys(pivotResult) : null);

    const dataRows = Array.isArray(pivotResult?.Data) ? pivotResult.Data : [];
    console.log("📦 [TopMaterials][DEBUG] Data length:", dataRows.length);

    if (!dataRows.length) {
      console.warn("⚠️ [TopMaterials][DEBUG] No data -> Top_* already cleared.");
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      return;
    }

    const materialRowMeta = (pivotResult?.Rows || []).find((r) => r?.FieldId === "Material_Code");
    const createdByRowMeta = (pivotResult?.Rows || []).find((r) => r?.FieldId === "_created_by._id");
    const colMeta = (pivotResult?.Columns || []).find((c) => c?.FieldId === "Material_Code");
    const valMeta = (pivotResult?.Values || [])[0];

    const rowKeyMaterial = materialRowMeta?.Id || null;
    const rowKeyCreatedBy = createdByRowMeta?.Id || null;
    const colKey = colMeta?.Id || null;
    const valueKey = valMeta?.Id || null;

    if (!rowKeyMaterial || !colKey || !valueKey) {
      console.error("❌ [TopMaterials][DEBUG] Missing derived keys -> cannot compute top materials.");
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      return;
    }

    const matches = [];
    for (const r of dataRows) {
      const rowVal = r[rowKeyMaterial];
      const colVal = r[colKey];
      if (rowVal == null || colVal == null) continue;

      if (String(rowVal) === String(colVal)) {
        matches.push({
          material: String(rowVal),
          value: Number(r[valueKey]) || 0,
          createdBy: rowKeyCreatedBy ? r[rowKeyCreatedBy] : null,
        });
      }
    }

    if (!matches.length) {
      console.warn("⚠️ [TopMaterials][DEBUG] No diagonal matches -> Top_* stays cleared.");
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      return;
    }

    matches.sort((a, b) => b.value - a.value);
    await setTopMaterialVars(matches.slice(0, 5));

    console.log("✅ [TopMaterials][DEBUG] DONE (success)");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  } catch (err) {
    console.error("❌ [TopMaterials][DEBUG] API error:", err);
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  }
}

/* ===================== UI: DATE FIELD ===================== */

function DateField({ label, valueYMD, onChangeYMD }) {
  const display = ymdToDDMMYYYY(valueYMD);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6, width: "100%" }}>
      <div style={{ fontSize: 12, fontWeight: 700, color: "#4C1D95" }}>{label}</div>

      <div style={{ position: "relative", width: "100%" }}>
        <div
          style={{
            width: "100%",
            height: 38,
            borderRadius: 12,
            background: "#FFFFFF",
            border: "1px solid #D8B4FE",
            boxShadow: "0 6px 16px rgba(88, 28, 135, 0.10)",
            display: "flex",
            alignItems: "center",
            padding: "0 12px",
            color: "#6D28D9",
            fontSize: 13,
            fontWeight: 700,
            letterSpacing: "0.2px",
            boxSizing: "border-box",
          }}
        >
          {display}
        </div>

        <input
          type="date"
          value={toYMD(valueYMD)}
          onChange={(e) => onChangeYMD(e.target.value)}
          style={{ position: "absolute", inset: 0, opacity: 0, cursor: "pointer" }}
        />
      </div>
    </div>
  );
}

/* ===================== UI: SEARCHABLE SITE SELECT ===================== */

function SiteSearchField({
  label = "Site",
  placeholder = "Search & select site",
  options = [],
  value = "",
  onSelect,
  disabled,
  loadingText = "Loading sites...",
  ready,
}) {
  const wrapRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (value) setQuery(value);
    if (!value && query && !open) setQuery("");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  useEffect(() => {
    const onDocDown = (e) => {
      if (!wrapRef.current) return;
      if (!wrapRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onDocDown);
    return () => document.removeEventListener("mousedown", onDocDown);
  }, []);

  const filtered = useMemo(() => {
    const q = (query || "").trim().toLowerCase();
    if (!q) return options.slice(0, 60);
    return options.filter((o) => String(o).toLowerCase().includes(q)).slice(0, 60);
  }, [options, query]);

  const showMenu = open && !disabled;

  const placeholderText = disabled
    ? ready
      ? loadingText
      : "Waiting for Kissflow..."
    : placeholder;

  return (
    <div style={{ width: "100%" }} ref={wrapRef}>
      <div style={{ fontSize: 12, fontWeight: 700, color: "#4C1D95", marginBottom: 6 }}>
        {label}
      </div>

      <div style={{ position: "relative", width: "100%" }}>
        <input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          placeholder={placeholderText}
          disabled={disabled}
          style={{
            width: "100%",
            height: 38,
            padding: "0 12px",
            borderRadius: 12,
            border: "1px solid #D8B4FE",
            background: disabled ? "#F5F3FF" : "#FFFFFF",
            boxShadow: "0 6px 16px rgba(88, 28, 135, 0.10)",
            fontSize: 13,
            fontWeight: 700,
            color: "#111827",
            outline: "none",
            boxSizing: "border-box",
          }}
        />

        {showMenu ? (
          <div
            style={{
              position: "absolute",
              zIndex: 50,
              top: 44,
              left: 0,
              right: 0,
              background: "#FFFFFF",
              border: "1px solid #E9D5FF",
              borderRadius: 12,
              boxShadow: "0 18px 45px rgba(88, 28, 135, 0.18)",
              overflow: "hidden",
              maxHeight: 220,
              overflowY: "auto",
            }}
          >
            {filtered.length ? (
              filtered.map((opt, idx) => (
                <div
                  key={`${opt}-${idx}`}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    setQuery(String(opt));
                    setOpen(false);
                    onSelect(String(opt));
                  }}
                  style={{
                    padding: "10px 12px",
                    cursor: "pointer",
                    fontSize: 13,
                    fontWeight: 700,
                    color: "#111827",
                    borderBottom: idx === filtered.length - 1 ? "none" : "1px solid #F3E8FF",
                    background: String(opt) === String(value) ? "#F5F3FF" : "#FFFFFF",
                  }}
                >
                  {opt}
                </div>
              ))
            ) : (
              <div style={{ padding: "10px 12px", fontSize: 13, fontWeight: 700, color: "#6B7280" }}>
                No matches
              </div>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
}

/* ===================== MAIN (MERGED) COMPONENT ===================== */

export function DefaultLandingComponent() {
  const [ready, setReady] = useState(false);

  const [siteOptions, setSiteOptions] = useState([]);
  const [loadingSites, setLoadingSites] = useState(false);
  const fetchedSitesRef = useRef(false);

  const [draftSite, setDraftSite] = useState("");
  const [draftStart, setDraftStart] = useState(getFinancialYearStart());
  const [draftEnd, setDraftEnd] = useState(getFinancialYearEnd());

  const [appliedSite, setAppliedSite] = useState("");
  const [appliedStart, setAppliedStart] = useState(getFinancialYearStart());
  const [appliedEnd, setAppliedEnd] = useState(getFinancialYearEnd());

  const runSeqRef = useRef(0);

  const invalidDraftRange =
    draftStart && draftEnd && new Date(toYMD(draftEnd)) < new Date(toYMD(draftStart));

  /* ---------- Boot (NOW: robust + logs) ---------- */
  useEffect(() => {
    let cancelled = false;

    const boot = async () => {
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      console.log("🟣 [Boot] START");

      try {
        let tries = 0;
        while ((!kf?.account?._id || !kf?.user?._id) && tries < 300) {
          if (tries % 25 === 0) {
            console.log("🟣 [Boot] Waiting for KF context...", {
              tries,
              acc: kf?.account?._id,
              user: kf?.user?._id,
            });
          }
          await delay(200);
          tries++;
        }

        const acc_id = kf?.account?._id || "";
        const user_id = kf?.user?._id || "";
        const user_email = kf?.user?.Email || "";

        console.log("🟣 [Boot] Context after wait:", { acc_id, user_id, user_email });

        // even if some of these fail, we continue
        await safeSetVar("User_Email", user_email);
        await safeSetVar("User_Acc_ID", user_id);
        await safeSetVar("Acc_ID", acc_id);

        const storedStart = await safeGetVar(VARS.startDate);
        const storedEnd = await safeGetVar(VARS.endDate);
        const storedSite = await safeGetVar(VARS.siteName);

        const start = toYMD(storedStart) || getFinancialYearStart();
        const end = toYMD(storedEnd) || getFinancialYearEnd();
        const site = storedSite == null ? "" : String(storedSite);

        console.log("🟣 [Boot] Final values:", { start, end, site });

        await safeSetVar(VARS.startDate, start);
        await safeSetVar(VARS.endDate, end);
        await safeSetVar(VARS.siteName, site);

        if (cancelled) return;

        setDraftStart(start);
        setDraftEnd(end);
        setDraftSite(site);

        setAppliedStart(start);
        setAppliedEnd(end);
        setAppliedSite(site);

        setReady(true);
        console.log("✅ [Boot] READY = true");
        console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      } catch (e) {
        console.error("❌ [Boot] Fatal error:", e);

        // IMPORTANT: still set ready so UI isn't permanently dead
        if (!cancelled) {
          setReady(true);
          console.warn("⚠️ [Boot] Forced READY=true so UI can be used.");
        }

        console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      }
    };

    boot();
    return () => {
      cancelled = true;
    };
  }, []);

  /* ---------- Fetch sites ---------- */
  useEffect(() => {
    if (!ready) return;
    if (fetchedSitesRef.current) return;
    fetchedSitesRef.current = true;

    let cancelled = false;

    const fetchSites = async () => {
      setLoadingSites(true);
      try {
        const acc = kf?.account?._id;
        if (!acc) {
          console.warn("⚠️ [SiteDropdown] acc_id missing -> cannot fetch sites.");
          return;
        }

        const API_URL = `/form/2/${acc}/Site_Master_A00/list?visited=1&page_number=1&page_size=10000000`;

        console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
        console.log("🚀 [SiteDropdown] FETCH START");
        console.log("🌐 [SiteDropdown] URL:", API_URL);

        const res = await kf.api(API_URL, { method: "GET" });

        console.log("✅ [SiteDropdown] FULL RESPONSE:", res);

        const rows = Array.isArray(res?.Data) ? res.Data : [];
        const mapped = rows
          .map((r, idx) => {
            const rawName = r?.Site_Name;
            const name = rawName == null ? "" : String(rawName).trim();
            if (!name) {
              if (idx < 5) console.warn("⚠️ [SiteDropdown] Missing Site_Name:", r);
              return null;
            }
            return name;
          })
          .filter(Boolean);

        const unique = Array.from(new Set(mapped)).sort((a, b) => a.localeCompare(b));

        console.log("✅ [SiteDropdown] Unique count:", unique.length);

        if (!cancelled) setSiteOptions(unique);

        console.log("✅ [SiteDropdown] FETCH DONE");
        console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      } catch (err) {
        console.error("❌ [SiteDropdown] Fetch error:", err);
        if (!cancelled) setSiteOptions([]);
      } finally {
        if (!cancelled) setLoadingSites(false);
      }
    };

    fetchSites();
    return () => {
      cancelled = true;
    };
  }, [ready]);

  /* ---------- Apply + Reset (with logs) ---------- */
  const applyFilters = async () => {
    console.log("🟣 [Apply] CLICKED");

    const start = toYMD(draftStart);
    const end = toYMD(draftEnd);
    const site = draftSite || "";

    console.log("🟣 [Apply] Values:", { start, end, site });

    if (start && end && new Date(end) < new Date(start)) {
      console.warn("⚠️ [Apply] Invalid range End < Start. Stop.");
      return;
    }

    await safeSetVar(VARS.startDate, start);
    await safeSetVar(VARS.endDate, end);
    await safeSetVar(VARS.siteName, site);

    setAppliedStart(start);
    setAppliedEnd(end);
    setAppliedSite(site);
  };

  const resetFilters = async () => {
    console.log("🧼 [Reset] CLICKED");

    const start = getFinancialYearStart();
    const end = getFinancialYearEnd();
    const site = "";

    console.log("🧼 [Reset] Defaults:", { start, end, site });

    await safeSetVar(VARS.startDate, start);
    await safeSetVar(VARS.endDate, end);
    await safeSetVar(VARS.siteName, site);

    setDraftStart(start);
    setDraftEnd(end);
    setDraftSite(site);

    setAppliedStart(start);
    setAppliedEnd(end);
    setAppliedSite(site);
  };

  /* ---------- Run on applied change ---------- */
  useEffect(() => {
    const run = async () => {
      if (!ready) return;

      const start = toYMD(appliedStart);
      const end = toYMD(appliedEnd);

      console.log("🟢 [Run] Triggered:", { start, end, appliedSite });

      if (start && end && new Date(end) < new Date(start)) {
        console.warn("⚠️ [Validation] End < Start. Skip API + refresh.");
        return;
      }

      const seq = ++runSeqRef.current;
      const acc_id = kf?.account?._id;
      const user_id = kf?.user?._id;

      await runTopMaterials_DEBUG({ acc_id, user_id, start_date: start, end_date: end });

      if (seq !== runSeqRef.current) return;
      await refreshComponentsOneByOne(REFRESH_IDS);
    };

    run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, appliedStart, appliedEnd, appliedSite]);

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        boxSizing: "border-box",
        padding: "14px 14px",
        borderRadius: 0,
        background: "linear-gradient(180deg, #FAF5FF 0%, #F5F3FF 100%)",
        border: "1px solid #E9D5FF",
        boxShadow: "0 18px 45px rgba(88, 28, 135, 0.10)",
        display: "flex",
        flexDirection: "column",
        gap: 12,
      }}
    >
      <SiteSearchField
        label="Site"
        placeholder="Type to search site..."
        options={siteOptions}
        value={draftSite}
        disabled={loadingSites || !ready}
        loadingText="Loading sites..."
        ready={ready}
        onSelect={(val) => {
          console.log("🟦 [SiteSearch] Selected:", val);
          setDraftSite(val || "");
        }}
      />

      <div style={{ display: "flex", flexDirection: "column", gap: 12, width: "100%" }}>
        <DateField label="Start Date" valueYMD={draftStart} onChangeYMD={setDraftStart} />
        <DateField label="End Date" valueYMD={draftEnd} onChangeYMD={setDraftEnd} />
      </div>

      {invalidDraftRange ? (
        <div style={{ color: "#B91C1C", fontWeight: 900, fontSize: 12 }}>
          End date must be same or after Start date
        </div>
      ) : null}

      {/* Buttons (also fix click by overriding global padding + minWidth) */}
      <div style={{ marginTop: "auto" }} />

      <div style={{ display: "flex", gap: 10, marginTop: 4, width: "100%", flexWrap: "wrap" }}>
        <button
          type="button"
          onClick={applyFilters}
          disabled={!ready || loadingSites || invalidDraftRange}
          style={{
            flex: "1 1 0",
            minWidth: 0,
            height: 48,
            padding: "0 12px",
            borderRadius: 12,
            border: "1px solid #C4B5FD",
            background: invalidDraftRange
              ? "#F3F4F6"
              : "linear-gradient(180deg, #E9D5FF 0%, #DDD6FE 100%)",
            color: invalidDraftRange ? "#6B7280" : "#4C1D95",
            fontWeight: 900,
            fontSize: 13,
            cursor: !ready || loadingSites || invalidDraftRange ? "not-allowed" : "pointer",
            boxShadow: "0 10px 24px rgba(88, 28, 135, 0.12)",
          }}
        >
          Apply Filter
        </button>

        <button
          type="button"
          onClick={resetFilters}
          disabled={!ready}
          style={{
            flex: "1 1 0",
            minWidth: 0,
            height: 48,
            padding: "0 12px",
            borderRadius: 12,
            border: "1px solid #E9D5FF",
            background: "#FFFFFF",
            color: "#6D28D9",
            fontWeight: 900,
            fontSize: 13,
            cursor: !ready ? "not-allowed" : "pointer",
            boxShadow: "0 10px 24px rgba(88, 28, 135, 0.08)",
          }}
        >
          Reset
        </button>
      </div>
    </div>
  );
}

export default DefaultLandingComponent;
