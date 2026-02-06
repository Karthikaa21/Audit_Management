import React, { useState, useMemo, useEffect, useRef } from "react";
import { kf } from "./../sdk/index.js";

const POLL_INTERVAL_MS = 20000; // 20 sec

// ✅ ONLY show audits assigned to me (any role: Auditor / Auditee / CAPA)
const CALENDAR_SHOW_MODE = "only_assigned_to_me";

// ---------- helpers ----------
const getUserIdFrom = (u) =>
  u?._id || u?.id || u?.Id || u?.UserId || u?.user_id || null;

function dateKey(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
    2,
    "0"
  )}-${String(d.getDate()).padStart(2, "0")}`;
}

// ✅ assignment palette by role (Auditor / Auditee / CAPA)
const getAssignmentPalette = (assignmentRole) => {
  if (assignmentRole === "auditor") {
    return { bg: "#DCFCE7", fg: "#166534", border: "#16A34A", label: "Auditor" };
  }
  if (assignmentRole === "auditee") {
    return { bg: "#FEF9C3", fg: "#854D0E", border: "#EAB308", label: "Auditee" };
  }
  if (assignmentRole === "capa") {
    return { bg: "#FFE4E6", fg: "#9F1239", border: "#FB7185", label: "CAPA" };
  }
  return { bg: "#E5E7EB", fg: "#374151", border: "#D1D5DB", label: "" };
};

// ✅ Try multiple field names because your process field keys may vary
const pickUserObj = (item, keys = []) => {
  for (const k of keys) {
    const v = item?.[k];
    if (v) return v;
  }
  return null;
};

// ✅ Detect my assignment roles from the item response
const getMyAssignmentRoles = (item, userId) => {
  const uid = String(userId || "");

  const auditorObj = pickUserObj(item, ["Auditor", "Auditor_1", "Assigned_Auditor"]);
  const auditeeObj = pickUserObj(item, ["Auditee", "Auditee_1", "Site_Owner", "Process_Owner"]);
  const capaObj = pickUserObj(item, ["CAPA_Owner", "CAPA_Assignee", "CAPA_Responsible", "Capa_Owner"]);

  const roles = [];

  const auditorId = getUserIdFrom(auditorObj);
  const auditeeId = getUserIdFrom(auditeeObj);
  const capaId = getUserIdFrom(capaObj);

  if (auditorId && String(auditorId) === uid) roles.push("auditor");
  if (auditeeId && String(auditeeId) === uid) roles.push("auditee");
  if (capaId && String(capaId) === uid) roles.push("capa");

  return { roles, auditorObj, auditeeObj, capaObj };
};

export function DefaultLandingComponent() {
  const today = new Date();

  const [viewMode, setViewMode] = useState("month"); // day | week | month
  const [currentDate, setCurrentDate] = useState(today);
  const [hoveredDate, setHoveredDate] = useState(null);

  // events: [{ id,title,dateKey,assignmentRole,auditType,siteName,createdByName,auditorName,auditeeName,capaName }]
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);

  // Filters
  const [roleFilter, setRoleFilter] = useState("all"); // all | auditor | auditee | capa
  const [auditTypeFilter, setAuditTypeFilter] = useState("all");
  const [siteFilter, setSiteFilter] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const filtersRef = useRef(null);

  const monthNames = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December",
  ];
  const weekDaysShort = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  const firstDayOfMonth = useMemo(
    () => new Date(currentYear, currentMonth, 1),
    [currentYear, currentMonth]
  );
  const lastDayOfMonth = useMemo(
    () => new Date(currentYear, currentMonth + 1, 0),
    [currentYear, currentMonth]
  );
  const monthStartWeekday = firstDayOfMonth.getDay();
  const daysInMonth = lastDayOfMonth.getDate();

  const areSameDay = (a, b) => dateKey(a) === dateKey(b);

  // ---------- filter options ----------
  const auditTypeOptions = useMemo(() => {
    const set = new Set();
    events.forEach((ev) => {
      const label = ev.auditType || ev.title;
      if (label) set.add(label);
    });
    return Array.from(set);
  }, [events]);

  const siteOptions = useMemo(() => {
    const set = new Set();
    events.forEach((ev) => {
      if (ev.siteName) set.add(ev.siteName);
    });
    return Array.from(set);
  }, [events]);

  // ---------- apply filters ----------
  const filteredEvents = useMemo(() => {
    return events.filter((ev) => {
      if (roleFilter !== "all" && ev.assignmentRole !== roleFilter) return false;

      if (auditTypeFilter !== "all") {
        const label = ev.auditType || ev.title;
        if (label !== auditTypeFilter) return false;
      }

      if (siteFilter !== "all" && ev.siteName !== siteFilter) return false;

      return true;
    });
  }, [events, roleFilter, auditTypeFilter, siteFilter]);

  const eventsForDate = (d) =>
    filteredEvents.filter((e) => e.dateKey === dateKey(d));

  // ---------- map item -> events (only assigned roles) ----------
  const mapItemToEvents = (item, userId) => {
    const rawDate =
      item?.Audit_Scheduled_Date ||
      item?.Audit_Scheduled_Date__Final ||
      item?._created_at;

    if (!rawDate) return [];

    const d = new Date(rawDate);
    if (Number.isNaN(d.getTime())) return [];

    const dateKeyStr = dateKey(d);
    const baseId = item?._id || `${dateKeyStr}-${Math.random()}`;

    const { roles, auditorObj, auditeeObj, capaObj } = getMyAssignmentRoles(
      item,
      userId
    );

    // ✅ Only show what is assigned to me
    if (CALENDAR_SHOW_MODE === "only_assigned_to_me" && roles.length === 0) {
      return [];
    }

    // Fields (keep same parsing style as your code)
    const siteName = item?.Site_Name || "Unnamed site";

    const auditTypeRaw = item?.Audit_Type;
    let auditTypeLabel = "";

    if (Array.isArray(auditTypeRaw)) {
      auditTypeLabel = auditTypeRaw
        .map((v) =>
          typeof v === "object" && v !== null
            ? v.Name || v.label || v.DisplayName || ""
            : String(v)
        )
        .filter(Boolean)
        .join(", ");
    } else if (auditTypeRaw && typeof auditTypeRaw === "object") {
      auditTypeLabel =
        auditTypeRaw.Name || auditTypeRaw.label || auditTypeRaw.DisplayName || "";
    } else if (auditTypeRaw != null) {
      auditTypeLabel = String(auditTypeRaw);
    }

    const title = auditTypeLabel || siteName || "Audit";

    const createdByObj = item?._created_by || item?.Created_By;
    const createdByName =
      createdByObj?.Name ||
      createdByObj?.DisplayName ||
      createdByObj?.Email ||
      "";

    const auditorName =
      auditorObj?.Name || auditorObj?.DisplayName || auditorObj?.Email || "";
    const auditeeName =
      auditeeObj?.Name || auditeeObj?.DisplayName || auditeeObj?.Email || "";
    const capaName = capaObj?.Name || capaObj?.DisplayName || capaObj?.Email || "";

    // ✅ Create one card per role assigned to me (Auditor / Auditee / CAPA)
    return roles.map((r) => ({
      id: `${baseId}-${r}`,
      title,
      dateKey: dateKeyStr,
      assignmentRole: r, // auditor | auditee | capa
      auditType: auditTypeLabel,
      siteName,
      createdByName,
      auditorName,
      auditeeName,
      capaName,
    }));
  };

  // ---------- fetch from process ----------
  const loadEvents = async (showLoader = false) => {
    try {
      if (showLoader) setLoading(true);

      const accId = kf.account?._id;
      const userId = kf.user?._id;

      if (!accId || !userId) {
        setEvents([]);
        return;
      }

      const monthForQuery =
        viewMode === "month" ? currentMonth + 1 : currentDate.getMonth() + 1;

      const monthStr = String(monthForQuery).padStart(2, "0");
      const q = `-${monthStr}-`; // your pattern

      const url = `/process/2/${accId}/admin/Audit_Process_Management_A00/item?page_number=1&page_size=10000000000000000&apply_preference=1&q=${encodeURIComponent(
        q
      )}`;

      const res = await kf.api(url);

      const rawList = Array.isArray(res?.Data)
        ? res.Data
        : Array.isArray(res?.items)
        ? res.items
        : [];

      const mapped = [];
      rawList.forEach((item) => {
        const evs = mapItemToEvents(item, userId);
        evs.forEach((ev) => ev && mapped.push(ev));
      });

      setEvents(mapped);
    } catch (e) {
      console.error("Failed to load audits:", e);
      setEvents([]);
    } finally {
      if (showLoader) {
        setLoading(false);
        setHasLoadedOnce(true);
      }
    }
  };

  // ---------- initial load + polling ----------
  useEffect(() => {
    let cancelled = false;
    let intervalId;

    const bootstrap = async () => {
      let attempts = 0;
      while (
        (!kf.user?._id || !kf.account?._id) &&
        !cancelled &&
        attempts < 20
      ) {
        await new Promise((r) => setTimeout(r, 250));
        attempts += 1;
      }
      if (cancelled) return;

      await loadEvents(true);

      intervalId = setInterval(() => {
        if (!cancelled) loadEvents(false);
      }, POLL_INTERVAL_MS);
    };

    bootstrap();

    return () => {
      cancelled = true;
      if (intervalId) clearInterval(intervalId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [viewMode, currentDate]);

  // ---------- pinch / trackpad zoom ----------
  useEffect(() => {
    const handleWheel = (e) => {
      if (!e.ctrlKey) return;
      e.preventDefault();

      if (e.deltaY > 0) {
        if (viewMode === "day") setViewMode("week");
        else if (viewMode === "week") setViewMode("month");
      }

      if (e.deltaY < 0) {
        if (viewMode === "month") {
          if (hoveredDate) setCurrentDate(hoveredDate);
          setViewMode("week");
        } else if (viewMode === "week") {
          setViewMode("day");
        }
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    return () => window.removeEventListener("wheel", handleWheel);
  }, [viewMode, hoveredDate]);

  // ---------- close filters popover ----------
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (showFilters && filtersRef.current && !filtersRef.current.contains(e.target)) {
        setShowFilters(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showFilters]);

  // ---------- navigation ----------
  const goPrev = () => {
    if (viewMode === "month") setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
    else if (viewMode === "week") {
      const prev = new Date(currentDate);
      prev.setDate(prev.getDate() - 7);
      setCurrentDate(prev);
    } else {
      const prev = new Date(currentDate);
      prev.setDate(prev.getDate() - 1);
      setCurrentDate(prev);
    }
  };

  const goNext = () => {
    if (viewMode === "month") setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
    else if (viewMode === "week") {
      const next = new Date(currentDate);
      next.setDate(next.getDate() + 7);
      setCurrentDate(next);
    } else {
      const next = new Date(currentDate);
      next.setDate(next.getDate() + 1);
      setCurrentDate(next);
    }
  };

  const goToday = () => setCurrentDate(today);

  // ---------- month view ----------
  const renderMonthView = () => {
    const cells = [];

    for (let i = 0; i < monthStartWeekday; i++) cells.push(<div key={`empty-${i}`} />);

    for (let day = 1; day <= daysInMonth; day++) {
      const d = new Date(currentYear, currentMonth, day);
      const list = eventsForDate(d);
      const isToday = areSameDay(d, today);

      cells.push(
        <div
          key={day}
          onClick={() => {
            setCurrentDate(d);
            setViewMode("day");
          }}
          style={{
            backgroundColor: "#FFFFFF",
            borderRadius: 16,
            border: isToday ? "2px solid #7C3AED" : "1px solid #E5E7EB",
            padding: 8,
            cursor: "pointer",
            boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
            display: "flex",
            flexDirection: "column",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "#F5F3FF";
            setHoveredDate(d);
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "#FFFFFF";
          }}
        >
          <div
            style={{
              textAlign: "right",
              fontSize: 12,
              fontWeight: 600,
              color: isToday ? "#7C3AED" : "#111827",
              marginBottom: 4,
            }}
          >
            {day}
          </div>

          {list.slice(0, 2).map((ev) => {
            const palette = getAssignmentPalette(ev.assignmentRole);
            return (
              <div
                key={ev.id}
                style={{
                  fontSize: 10,
                  padding: "2px 4px",
                  borderRadius: 6,
                  backgroundColor: palette.bg,
                  color: palette.fg,
                  marginBottom: 2,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                • {palette.label}: {ev.title}
              </div>
            );
          })}

          {list.length > 2 && (
            <div style={{ fontSize: 10, color: "#7C3AED" }}>
              +{list.length - 2} more
            </div>
          )}
        </div>
      );
    }

    return (
      <>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(7, 1fr)",
            backgroundColor: "#F3E8FF",
            color: "#6D28D9",
            fontWeight: 600,
            fontSize: 12,
            padding: "8px 0",
            textAlign: "center",
          }}
        >
          {weekDaysShort.map((d) => (
            <div key={d}>{d.charAt(0)}</div>
          ))}
        </div>

        <div
          style={{
            flex: 1,
            display: "grid",
            gridTemplateColumns: "repeat(7, 1fr)",
            gridAutoRows: "minmax(100px, auto)",
            gap: 10,
            padding: 12,
            overflowY: "auto",
            backgroundColor: "#F9FAFB",
          }}
        >
          {cells}
        </div>
      </>
    );
  };

  // ---------- day view ----------
  const renderDayView = () => {
    const list = eventsForDate(currentDate);

    return (
      <div
        style={{
          flex: 1,
          padding: 20,
          display: "flex",
          flexDirection: "column",
          gap: 16,
          backgroundColor: "#F9FAFB",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <div style={{ fontSize: 12, color: "#6B7280" }}>
              {weekDaysShort[currentDate.getDay()]}
            </div>
            <div style={{ fontSize: 20, fontWeight: 700, color: "#4C1D95" }}>
              {monthNames[currentDate.getMonth()]} {currentDate.getDate()},{" "}
              {currentDate.getFullYear()}
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {/* Role filter */}
            <div
              style={{
                display: "inline-flex",
                borderRadius: 999,
                backgroundColor: "#F3F4F6",
                border: "1px solid #E5E7EB",
                overflow: "hidden",
              }}
            >
              {[
                { key: "all", label: "All" },
                { key: "auditor", label: "Auditor" },
                { key: "auditee", label: "Auditee" },
                { key: "capa", label: "CAPA" },
              ].map((opt) => {
                const active = roleFilter === opt.key;
                return (
                  <button
                    key={opt.key}
                    onClick={() => setRoleFilter(opt.key)}
                    style={{
                      padding: "4px 8px",
                      border: "none",
                      outline: "none",
                      fontSize: 11,
                      cursor: "pointer",
                      backgroundColor: active ? "#4C1D95" : "transparent",
                      color: active ? "#FFFFFF" : "#4B5563",
                      fontWeight: active ? 600 : 500,
                    }}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>

            {/* Filters */}
            <div style={{ position: "relative" }} ref={filtersRef}>
              <button
                onClick={() => setShowFilters((prev) => !prev)}
                style={{
                  padding: "4px 10px",
                  borderRadius: 999,
                  border: "1px solid #D1D5DB",
                  fontSize: 12,
                  backgroundColor: "#F9FAFB",
                  color: "#111827",
                  cursor: "pointer",
                  outline: "none",
                }}
              >
                Filters ▾
              </button>

              {showFilters && (
                <div
                  style={{
                    position: "absolute",
                    right: 0,
                    marginTop: 4,
                    backgroundColor: "#FFFFFF",
                    borderRadius: 12,
                    border: "1px solid #E5E7EB",
                    boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
                    padding: 10,
                    minWidth: 220,
                    zIndex: 30,
                  }}
                >
                  <div style={{ fontSize: 11, fontWeight: 600, color: "#6B7280", marginBottom: 4 }}>
                    Audit type
                  </div>
                  <select
                    value={auditTypeFilter}
                    onChange={(e) => setAuditTypeFilter(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "4px 8px",
                      borderRadius: 8,
                      border: "1px solid #D1D5DB",
                      fontSize: 12,
                      marginBottom: 8,
                      backgroundColor: "#F9FAFB",
                      color: "#111827",
                      outline: "none",
                    }}
                  >
                    <option value="all">All types</option>
                    {auditTypeOptions.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>

                  <div style={{ fontSize: 11, fontWeight: 600, color: "#6B7280", marginBottom: 4 }}>
                    Site
                  </div>
                  <select
                    value={siteFilter}
                    onChange={(e) => setSiteFilter(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "4px 8px",
                      borderRadius: 8,
                      border: "1px solid #D1D5DB",
                      fontSize: 12,
                      backgroundColor: "#F9FAFB",
                      color: "#111827",
                      outline: "none",
                    }}
                  >
                    <option value="all">All sites</option>
                    {siteOptions.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>

                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8, gap: 8 }}>
                    <button
                      onClick={() => {
                        setRoleFilter("all");
                        setAuditTypeFilter("all");
                        setSiteFilter("all");
                      }}
                      style={{
                        flex: 1,
                        padding: "4px 8px",
                        borderRadius: 999,
                        border: "none",
                        backgroundColor: "#EEF2FF",
                        color: "#4C1D95",
                        fontSize: 11,
                        fontWeight: 600,
                        cursor: "pointer",
                      }}
                    >
                      Clear
                    </button>
                    <button
                      onClick={() => setShowFilters(false)}
                      style={{
                        padding: "4px 8px",
                        borderRadius: 999,
                        border: "1px solid #E5E7EB",
                        backgroundColor: "#FFFFFF",
                        color: "#374151",
                        fontSize: 11,
                        cursor: "pointer",
                      }}
                    >
                      Close
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* ✅ NO "Create audit" button */}
          </div>
        </div>

        <div
          style={{
            marginTop: 8,
            borderRadius: 12,
            border: "1px solid #E5E7EB",
            backgroundColor: "#FFFFFF",
            padding: 12,
            minHeight: 120,
          }}
        >
          {loading && !hasLoadedOnce && (
            <div style={{ fontSize: 13, color: "#6B7280", textAlign: "center", padding: 12 }}>
              Loading audits…
            </div>
          )}

          {!loading && list.length === 0 && (
            <div style={{ fontSize: 13, color: "#9CA3AF", textAlign: "center", padding: 20 }}>
              No audits assigned for this day.
            </div>
          )}

          {!loading && list.length > 0 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {list.map((ev) => {
                const palette = getAssignmentPalette(ev.assignmentRole);
                return (
                  <div
                    key={ev.id}
                    style={{
                      borderRadius: 8,
                      backgroundColor: palette.bg,
                      padding: "8px 10px",
                      fontSize: 13,
                      color: palette.fg,
                      border: `1px solid ${palette.border}`,
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                      <div style={{ fontSize: 12 }}>
                        <strong>{palette.label} • </strong>
                        {ev.auditType || ev.title}
                      </div>
                    </div>

                    <div style={{ fontSize: 12 }}>
                      <strong>Site:</strong> {ev.siteName}
                    </div>

                    {/* show the other parties for context */}
                    {ev.auditorName && (
                      <div style={{ fontSize: 12 }}>
                        <strong>Auditor:</strong> {ev.auditorName}
                      </div>
                    )}
                    {ev.auditeeName && (
                      <div style={{ fontSize: 12 }}>
                        <strong>Auditee:</strong> {ev.auditeeName}
                      </div>
                    )}
                    {ev.capaName && (
                      <div style={{ fontSize: 12 }}>
                        <strong>CAPA:</strong> {ev.capaName}
                      </div>
                    )}
                    {ev.createdByName && (
                      <div style={{ fontSize: 12 }}>
                        <strong>Created by:</strong> {ev.createdByName}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    );
  };

  // ---------- week view ----------
  const renderWeekView = () => {
    const dayIndex = currentDate.getDay();
    const weekStart = new Date(currentDate);
    weekStart.setDate(currentDate.getDate() - dayIndex);

    const days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(weekStart);
      d.setDate(weekStart.getDate() + i);
      return d;
    });

    return (
      <div style={{ flex: 1, display: "flex", flexDirection: "column", backgroundColor: "#F9FAFB" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(7, 1fr)",
            borderBottom: "1px solid #E5E7EB",
            backgroundColor: "#F3E8FF",
            padding: "6px 8px",
            gap: 4,
          }}
        >
          {days.map((d) => {
            const isSelected = areSameDay(d, currentDate);
            return (
              <div
                key={d.toISOString()}
                onClick={() => setCurrentDate(d)}
                style={{
                  textAlign: "center",
                  cursor: "pointer",
                  padding: "4px 0",
                  borderRadius: 999,
                  backgroundColor: isSelected ? "#EDE9FE" : "#F3E8FF",
                  border: isSelected ? "1px solid #7C3AED" : "1px solid transparent",
                }}
              >
                <div style={{ fontSize: 11, fontWeight: 600, color: isSelected ? "#5B21B6" : "#6D28D9" }}>
                  {weekDaysShort[d.getDay()]}
                </div>
                <div style={{ fontSize: 13, fontWeight: 700, color: isSelected ? "#4C1D95" : "#4B5563", marginTop: 2 }}>
                  {d.getDate()}
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ flex: 1, display: "grid", gridTemplateColumns: "repeat(7, 1fr)", padding: 12, gap: 8, overflowY: "auto" }}>
          {days.map((d) => {
            const list = eventsForDate(d);
            const isSelected = areSameDay(d, currentDate);

            return (
              <div
                key={d.toISOString()}
                style={{
                  borderRadius: 12,
                  border: "1px solid #E5E7EB",
                  backgroundColor: isSelected ? "#F9FAFF" : "#FFFFFF",
                  padding: 8,
                  display: "flex",
                  flexDirection: "column",
                  gap: 6,
                }}
              >
                {!loading && list.length === 0 && (
                  <div style={{ fontSize: 11, color: "#9CA3AF", textAlign: "center", paddingTop: 8 }}>
                    No audits
                  </div>
                )}

                {!loading &&
                  list.length > 0 &&
                  list.map((ev) => {
                    const palette = getAssignmentPalette(ev.assignmentRole);
                    return (
                      <div
                        key={ev.id}
                        style={{
                          borderRadius: 8,
                          backgroundColor: palette.bg,
                          padding: "6px 8px",
                          fontSize: 12,
                          color: palette.fg,
                          border: `1px solid ${palette.border}`,
                        }}
                      >
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 2 }}>
                          <span style={{ fontWeight: 600 }}>
                            {palette.label}: {ev.auditType || ev.title}
                          </span>
                        </div>
                        <div style={{ fontSize: 11 }}>
                          <strong>Site:</strong> {ev.siteName}
                        </div>
                      </div>
                    );
                  })}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // ---------- main render ----------
  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#F3F4F6",
        fontFamily: "Inter, system-ui, sans-serif",
      }}
    >
      {/* Top bar */}
      <div
        style={{
          padding: "12px 24px",
          backgroundColor: "#FFFFFF",
          boxShadow: "0 2px 6px rgba(0,0,0,0.06)",
          display: "flex",
          alignItems: "center",
          gap: 16,
          zIndex: 10,
        }}
      >
        <button
          onClick={goPrev}
          style={{
            borderRadius: 12,
            border: "1px solid #111827",
            backgroundColor: "#FFFFFF",
            width: 32,
            height: 32,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 18,
            cursor: "pointer",
            color: "#374151",
            outline: "none",
            boxShadow: "none",
          }}
        >
          ‹
        </button>
        <button
          onClick={goNext}
          style={{
            borderRadius: 12,
            border: "1px solid #111827",
            backgroundColor: "#FFFFFF",
            width: 32,
            height: 32,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 18,
            cursor: "pointer",
            color: "#374151",
            outline: "none",
            boxShadow: "none",
          }}
        >
          ›
        </button>

        <div style={{ fontWeight: 700, fontSize: 18, color: "#111827" }}>
          {monthNames[currentMonth]} {currentYear}
        </div>

        <button
          onClick={goToday}
          style={{
            marginLeft: 8,
            padding: 0,
            borderRadius: 999,
            border: "2px solid #7C3AED",
            backgroundColor: "#FFFFFF",
            cursor: "pointer",
            outline: "none",
            boxShadow: "none",
          }}
        >
          <div
            style={{
              padding: "4px 16px",
              borderRadius: 999,
              backgroundColor: "#F5F3FF",
              color: "#111827",
              fontSize: 13,
              fontWeight: 600,
            }}
          >
            Today
          </div>
        </button>

        <div style={{ flex: 1 }} />

        {/* View mode */}
        <div style={{ position: "relative" }}>
          <select
            value={viewMode}
            onChange={(e) => setViewMode(e.target.value)}
            style={{
              appearance: "none",
              WebkitAppearance: "none",
              MozAppearance: "none",
              padding: "6px 32px 6px 14px",
              borderRadius: 999,
              border: "1px solid #9CA3AF",
              fontSize: 13,
              color: "#111827",
              backgroundColor: "#FFFFFF",
              cursor: "pointer",
              outline: "none",
              boxShadow: "none",
            }}
          >
            <option value="day">Day</option>
            <option value="week">Week</option>
            <option value="month">Month</option>
          </select>
          <span
            style={{
              position: "absolute",
              right: 10,
              top: "50%",
              transform: "translateY(-50%)",
              fontSize: 10,
              pointerEvents: "none",
              color: "#4B5563",
            }}
          >
            ▼
          </span>
        </div>
      </div>

      {viewMode === "month" && renderMonthView()}
      {viewMode === "day" && renderDayView()}
      {viewMode === "week" && renderWeekView()}
    </div>
  );
}

export default DefaultLandingComponent;
