"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { analyticsAPI } from "../../services/api";

// ─── Types ────────────────────────────────────────────────────────────────────
type PaymentStatus = "paid" | "pending" | "overdue";

// ─── Static Nav Data ──────────────────────────────────────────────────────────
const NAV_SECTIONS = [
  {
    label: "Main",
    items: [
      { icon: "⚡", label: "Dashboard",   href: "/owner/dashboard",   badge: null, active: true  },
      { icon: "🏠", label: "Houses",      href: "/owner/houses",      badge: null, active: false },
      { icon: "👥", label: "Tenants",     href: "/owner/tenants",     badge: null, active: false },
      { icon: "📋", label: "Leases",      href: "/owner/leases",      badge: null, active: false },
    ],
  },
  {
    label: "Finance",
    items: [
      { icon: "💳", label: "Payments",    href: "/owner/payments",    badge: null, active: false },
      { icon: "📈", label: "Analytics",   href: "/owner/analytics",   badge: null, active: false },
      { icon: "🧾", label: "Invoices",    href: "/owner/invoices",    badge: null, active: false },
    ],
  },
  {
    label: "Tools",
    items: [
      { icon: "🔧", label: "Maintenance", href: "/owner/complaints",  badge: null, active: false },
      { icon: "💬", label: "Messages",    href: "/owner/messages",    badge: null, active: false },
      { icon: "⚙️", label: "Settings",   href: "/owner/settings",    badge: null, active: false },
    ],
  },
];

// ─── Pill ─────────────────────────────────────────────────────────────────────
const PILL_STYLES: Record<PaymentStatus, { bg: string; color: string }> = {
  paid:    { bg:"rgba(34,197,94,0.1)",  color:"#22c55e" },
  pending: { bg:"rgba(245,158,11,0.1)", color:"#f59e0b" },
  overdue: { bg:"rgba(244,63,94,0.1)",  color:"#f43f5e" },
};
const PILL_LABEL: Record<PaymentStatus, string> = {
  paid:"✓ Paid", pending:"⏳ Pending", overdue:"✗ Overdue",
};
function Pill({ status }: { status: PaymentStatus }) {
  const s = PILL_STYLES[status];
  return (
    <span style={{ display:"inline-flex", alignItems:"center", padding:"3px 9px", borderRadius:20, fontSize:11, fontWeight:600, background:s.bg, color:s.color }}>
      {PILL_LABEL[status]}
    </span>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function DashboardPage() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const router = useRouter();

  // ── Real data from API ──
  const [dashData, setDashData]   = useState<any>(null);
  const [loading,  setLoading]    = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await analyticsAPI.ownerStats();
        setDashData(res.data);
      } catch (err) {
        console.error("Failed to fetch dashboard stats", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  // ── Derived values ──
  const properties   = dashData?.properties   ?? 0;
  const units        = dashData?.units        ?? { total_units: 0, occupied: 0, vacant: 0 };
  const payments     = dashData?.payments     ?? { collected: 0, pending: 0, overdue: 0 };
  const monthlyIncome= dashData?.monthly_income ?? [];
  const openRequests = dashData?.open_requests ?? 0;
  const recentPayments  = dashData?.recent_payments  ?? [];
  const recentRequests  = dashData?.recent_requests  ?? [];
  const recentActivities = dashData?.recent_activities ?? [];

  const totalUnits = units.total_units || 1;
  const occPct     = Math.round(((units.occupied || 0) / totalUnits) * 100);
  const CIRC       = 2 * Math.PI * 44;

  const maxIncome  = monthlyIncome.length
    ? Math.max(...monthlyIncome.map((m: any) => Number(m.income) || 0), 1)
    : 1;

  const formatINR = (val: number) => {
    if (val >= 100000) return `₹${(val / 100000).toFixed(1)}L`;
    if (val >= 1000)   return `₹${Math.round(val / 1000)}K`;
    return `₹${val}`;
  };

  // ── Stat cards (dynamic) ──
  const STATS = [
    {
      icon:"🏠", label:"Total Properties",
      value: loading ? "—" : String(properties),
      delta:"+4%", pos:true, fill: Math.min(properties * 5, 100),
      color:"#06b6d4", bg:"rgba(6,182,212,0.1)",
    },
    {
      icon:"👥", label:"Active Tenants",
      value: loading ? "—" : String(units.occupied || 0),
      delta:"+8%", pos:true, fill: occPct,
      color:"#8b5cf6", bg:"rgba(139,92,246,0.1)",
    },
    {
      icon:"💰", label:"Rent Collected",
      value: loading ? "—" : formatINR(payments.collected || 0),
      delta:"+12%", pos:true,
      fill: payments.collected && (payments.collected + payments.pending + payments.overdue)
        ? Math.round((payments.collected / (payments.collected + payments.pending + payments.overdue)) * 100)
        : 0,
      color:"#22c55e", bg:"rgba(34,197,94,0.1)",
    },
    {
      icon:"⚠️", label:"Pending Dues",
      value: loading ? "—" : String(openRequests),
      delta: openRequests > 0 ? `+${openRequests}` : "0",
      pos: false,
      fill: Math.min(openRequests * 10, 100),
      color:"#f43f5e", bg:"rgba(244,63,94,0.1)",
    },
  ];

  const PAYMENT_STATUS_ROWS = [
    { label:"Collected", tenants: units.occupied || 0, amount: formatINR(payments.collected || 0), color:"#22c55e" },
    { label:"Pending",   tenants: 0,                   amount: formatINR(payments.pending   || 0), color:"#f59e0b" },
    { label:"Overdue",   tenants: 0,                   amount: formatINR(payments.overdue   || 0), color:"#f43f5e" },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');
        *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
        html, body { height:100%; font-family:'Plus Jakarta Sans',sans-serif; background:#080e1a; color:#e2e8f0; }
        ::-webkit-scrollbar { width:4px; height:4px; }
        ::-webkit-scrollbar-thumb { background:#1e2d47; border-radius:4px; }

        @keyframes fadeUp    { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        @keyframes pulse-ring{ 0%{transform:scale(1);opacity:.5} 100%{transform:scale(1.6);opacity:0} }
        @keyframes spin      { to{transform:rotate(360deg)} }

        .anim-1{animation:fadeUp .45s ease both .05s} .anim-2{animation:fadeUp .45s ease both .10s}
        .anim-3{animation:fadeUp .45s ease both .15s} .anim-4{animation:fadeUp .45s ease both .20s}
        .anim-5{animation:fadeUp .45s ease both .25s} .anim-6{animation:fadeUp .45s ease both .30s}
        .anim-7{animation:fadeUp .45s ease both .35s} .anim-8{animation:fadeUp .45s ease both .40s}
        .anim-9{animation:fadeUp .45s ease both .45s}

        .sb-link {
          display:flex; align-items:center; gap:10px; padding:9px 10px;
          border-radius:8px; font-size:13px; font-weight:500; color:#94a3b8;
          cursor:pointer; transition:all .15s; text-decoration:none;
          margin-bottom:2px; border:1px solid transparent;
        }
        .sb-link:hover  { background:rgba(255,255,255,0.04); color:#e2e8f0; }
        .sb-link.active { background:rgba(6,182,212,0.1); color:#06b6d4; border-color:rgba(6,182,212,0.15); }

        .stat-card {
          background:#111d33; border:1px solid #1e2d47; border-radius:14px;
          padding:20px; transition:border-color .2s, transform .2s; cursor:default;
        }
        .stat-card:hover { border-color:#06b6d4; transform:translateY(-2px); }

        .glass-card {
          background:#111d33; border:1px solid #1e2d47; border-radius:14px;
          padding:20px; position:relative; overflow:hidden;
        }
        .glass-card::after {
          content:''; position:absolute; bottom:0; left:20%; right:20%;
          height:1px; background:linear-gradient(90deg,transparent,rgba(6,182,212,0.25),transparent);
        }

        .pay-row:hover td { background:rgba(6,182,212,0.03); }

        .prop-mini {
          display:flex; align-items:center; gap:12px;
          background:#0d1526; border:1px solid #1e2d47;
          border-radius:10px; padding:12px 14px;
          transition:border-color .15s, transform .15s; cursor:pointer;
        }
        .prop-mini:hover { border-color:#06b6d4; transform:translateX(3px); }

        .bar-col { position:relative; }
        .bar-col:hover .bar-tip { opacity:1; transform:translateX(-50%) translateY(-4px); }
        .bar-tip {
          position:absolute; bottom:calc(100% + 6px); left:50%;
          transform:translateX(-50%) translateY(0);
          background:#1e2d47; border:1px solid #2d4060;
          border-radius:6px; padding:4px 9px; font-size:11px; font-weight:700;
          color:#e2e8f0; white-space:nowrap; opacity:0;
          transition:opacity .2s, transform .2s; pointer-events:none;
        }

        .qa-btn {
          background:rgba(6,182,212,0.05); border:1px solid rgba(6,182,212,0.12);
          border-radius:10px; padding:12px 8px;
          cursor:pointer; text-align:center; transition:all .2s; font-family:inherit;
        }
        .qa-btn:hover {
          background:rgba(6,182,212,0.12); border-color:rgba(6,182,212,0.4);
          transform:translateY(-2px); box-shadow:0 6px 18px rgba(6,182,212,0.1);
        }

        .nav-ico {
          width:36px; height:36px; border-radius:8px;
          background:#111d33; border:1px solid #1e2d47;
          display:grid; place-items:center; cursor:pointer;
          font-size:15px; position:relative; transition:border-color .2s; flex-shrink:0;
        }
        .nav-ico:hover { border-color:#06b6d4; }

        .mob-overlay { display:none; position:fixed; inset:0; background:rgba(0,0,0,0.6); z-index:250; backdrop-filter:blur(2px); }
        @media(max-width:768px) { .mob-overlay.open { display:block; } }

        .stats-grid  { display:grid; grid-template-columns:repeat(4,1fr); gap:14px; }
        .main-grid   { display:grid; grid-template-columns:1fr 320px;     gap:18px; }
        .bottom-grid { display:grid; grid-template-columns:1fr 1fr;       gap:18px; }
        .occ-grid    { display:grid; grid-template-columns:1fr 1fr;       gap:18px; }

        @media(max-width:1200px) {
          .stats-grid { grid-template-columns:repeat(2,1fr); }
          .main-grid  { grid-template-columns:1fr; }
          .occ-grid   { grid-template-columns:1fr; }
        }
        @media(max-width:768px) {
          .stats-grid  { grid-template-columns:repeat(2,1fr); }
          .bottom-grid { grid-template-columns:1fr; }
        }
        @media(max-width:480px) { .stats-grid { grid-template-columns:1fr; } }

        .sidebar {
          position:fixed; top:0; left:0; bottom:0; width:250px;
          background:#0d1526; border-right:1px solid #1e2d47;
          display:flex; flex-direction:column; z-index:300;
          transition:transform .3s ease;
        }
        @media(max-width:768px) {
          .sidebar { transform:translateX(-100%); }
          .sidebar.open { transform:translateX(0); }
        }

        .navbar {
          position:fixed; top:0; left:250px; right:0; height:62px;
          background:#0d1526; border-bottom:1px solid #1e2d47;
          display:flex; align-items:center; justify-content:space-between;
          padding:0 24px; z-index:200;
        }
        .page-main {
          margin-left:250px; margin-top:62px; padding:26px;
          min-height:calc(100vh - 62px); position:relative; z-index:1;
        }

        @media(max-width:768px) {
          .navbar    { left:0; padding:0 16px; }
          .page-main { margin-left:0; padding:16px; }
          .nav-search-wrap { display:none; }
          .mob-burger { display:grid !important; }
        }

        .table-scroll { overflow-x:auto; }
        .table-scroll table { min-width:520px; }

        .skeleton {
          background: linear-gradient(90deg, #1e2d47 25%, #2d4060 50%, #1e2d47 75%);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
          border-radius: 6px;
        }
        @keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
      `}</style>

      {/* Mobile overlay */}
      <div className={`mob-overlay${mobileOpen ? " open" : ""}`} onClick={() => setMobileOpen(false)} />

      {/* ══ SIDEBAR ══ */}
      <aside className={`sidebar${mobileOpen ? " open" : ""}`}>
        <div style={{ height:62, display:"flex", alignItems:"center", gap:12, padding:"0 20px", borderBottom:"1px solid #1e2d47", flexShrink:0 }}>
          <div style={{ position:"relative", width:34, height:34, borderRadius:9, background:"linear-gradient(135deg,#06b6d4,#8b5cf6)", display:"grid", placeItems:"center", fontSize:16, flexShrink:0, boxShadow:"0 0 16px rgba(6,182,212,0.3)" }}>
            🏠
            <div style={{ position:"absolute", inset:-3, borderRadius:12, border:"1.5px solid rgba(6,182,212,0.35)", animation:"pulse-ring 2s ease-out infinite", pointerEvents:"none" }} />
          </div>
          <div>
            <div style={{ fontSize:15, fontWeight:700, color:"#e2e8f0", letterSpacing:"-0.02em" }}>RentManager</div>
            <div style={{ fontSize:9, color:"#4a6080", textTransform:"uppercase", letterSpacing:"0.1em" }}>Property OS</div>
          </div>
        </div>

        <nav style={{ flex:1, padding:"16px 12px", overflowY:"auto" }}>
          {NAV_SECTIONS.map((section) => (
            <div key={section.label}>
              <div style={{ fontSize:9, fontWeight:700, color:"#4a6080", textTransform:"uppercase", letterSpacing:"0.14em", padding:"0 8px", margin:"16px 0 6px" }}>
                {section.label}
              </div>
              {section.items.map((item) => (
                <Link key={item.href} href={item.href} className={`sb-link${item.active ? " active" : ""}`} onClick={() => setMobileOpen(false)}>
                  <span style={{ fontSize:15, width:18, textAlign:"center", flexShrink:0 }}>{item.icon}</span>
                  <span style={{ flex:1 }}>{item.label}</span>
                  {item.badge && (
                    <span style={{ fontSize:10, fontWeight:700, padding:"2px 7px", borderRadius:10, background: item.active ? "rgba(6,182,212,0.15)" : "rgba(255,255,255,0.05)", color: item.active ? "#06b6d4" : "#4a6080" }}>
                      {item.badge}
                    </span>
                  )}
                </Link>
              ))}
            </div>
          ))}
        </nav>

        <div style={{ padding:"14px 12px", borderTop:"1px solid #1e2d47", flexShrink:0 }}>
          <button
            onClick={() => {
              localStorage.removeItem("rentmanager_user");
              document.cookie = "role=; path=/; max-age=0";
              router.push("/login");
            }}
            style={{
              display:"flex", alignItems:"center", gap:10,
              padding:9, borderRadius:9, cursor:"pointer",
              background:"transparent", border:"1px solid transparent",
              color:"#f43f5e", fontSize:13, fontWeight:500,
              fontFamily:"inherit", width:"100%", marginTop:4,
              transition:"all .15s",
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLButtonElement).style.background  = "rgba(244,63,94,0.07)";
              (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(244,63,94,0.2)";
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLButtonElement).style.background  = "transparent";
              (e.currentTarget as HTMLButtonElement).style.borderColor = "transparent";
            }}
          >
            <span style={{ fontSize:15, width:18, textAlign:"center" }}>🚪</span>
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* ══ NAVBAR ══ */}
      <header className="navbar">
        <div style={{ display:"flex", alignItems:"center", gap:14 }}>
          <button onClick={() => setMobileOpen(true)} className="mob-burger"
            style={{ display:"none", background:"none", border:"1px solid #1e2d47", borderRadius:7, padding:"6px 8px", cursor:"pointer", color:"#94a3b8", fontSize:16, fontFamily:"inherit" }}>
            ☰
          </button>
          <div>
            <div style={{ fontSize:15, fontWeight:700, color:"#e2e8f0" }}>Dashboard</div>
            <div style={{ fontSize:11, color:"#4a6080" }}>Home → Overview</div>
          </div>
        </div>

        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <div className="nav-search-wrap" style={{ display:"flex", alignItems:"center", gap:8, background:"#111d33", border:"1px solid #1e2d47", borderRadius:8, padding:"7px 12px", width:220 }}>
            <span style={{ color:"#4a6080", fontSize:13, flexShrink:0 }}>🔍</span>
            <input type="text" placeholder="Search…" style={{ background:"none", border:"none", outline:"none", fontSize:13, color:"#e2e8f0", fontFamily:"inherit", width:"100%" }} />
          </div>
          <Link href="/owner/complaints" className="nav-ico" style={{ textDecoration:"none" }}>
            🔔
            <div style={{ position:"absolute", top:5, right:5, width:7, height:7, borderRadius:"50%", background:"#f43f5e", border:"2px solid #0d1526" }} />
          </Link>
          <Link href="/owner/messages" className="nav-ico" style={{ textDecoration:"none" }}>📬</Link>
          <Link href="/owner/settings" style={{ width:36, height:36, borderRadius:8, background:"linear-gradient(135deg,#06b6d4,#8b5cf6)", display:"grid", placeItems:"center", color:"white", fontSize:12, fontWeight:700, cursor:"pointer", boxShadow:"0 0 12px rgba(6,182,212,0.25)", border:"1.5px solid rgba(6,182,212,0.3)", flexShrink:0, textDecoration:"none" }}>
            AK
          </Link>
        </div>
      </header>

      {/* ══ MAIN ══ */}
      <main className="page-main">

        {/* Heading */}
        <div className="anim-1" style={{ marginBottom:22 }}>
          <div style={{ fontSize:"clamp(18px,2.5vw,24px)", fontWeight:800, color:"#e2e8f0", letterSpacing:"-0.02em" }}>
            Welcome back 👋
          </div>
          <div style={{ fontSize:13, color:"#94a3b8", marginTop:3 }}>
            {loading ? "Loading your portfolio…" : "Here's your property portfolio at a glance."}
          </div>
        </div>

        {/* Stat cards */}
        <div className="stats-grid" style={{ marginBottom:18 }}>
          {STATS.map((s, i) => (
            <div key={s.label} className={`stat-card anim-${i + 1}`}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
                <div style={{ width:38, height:38, borderRadius:10, background:s.bg, display:"grid", placeItems:"center", fontSize:17 }}>{s.icon}</div>
                <div style={{ fontSize:11, fontWeight:600, padding:"3px 8px", borderRadius:20, background: s.pos ? "rgba(34,197,94,0.1)" : "rgba(244,63,94,0.1)", color: s.pos ? "#22c55e" : "#f43f5e" }}>{s.delta}</div>
              </div>
              {loading
                ? <div className="skeleton" style={{ height:32, width:"60%", marginBottom:8 }} />
                : <div style={{ fontSize:28, fontWeight:800, color:"#e2e8f0", letterSpacing:"-0.03em", marginBottom:3 }}>{s.value}</div>
              }
              <div style={{ fontSize:12, color:"#4a6080" }}>{s.label}</div>
              <div style={{ height:2, background:"#1e2d47", borderRadius:2, marginTop:16, overflow:"hidden" }}>
                <div style={{ height:"100%", width:`${s.fill}%`, background:s.color, borderRadius:2 }} />
              </div>
            </div>
          ))}
        </div>

        {/* Occupancy + Payment Status */}
        <div className="occ-grid anim-5" style={{ marginBottom:18 }}>
          <div className="glass-card">
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:18 }}>
              <div style={{ fontSize:14, fontWeight:700, color:"#e2e8f0" }}>Occupied vs Vacant</div>
              <div style={{ fontSize:12, color:"#06b6d4", fontWeight:600 }}>{units.total_units || 0} units total</div>
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:24, flexWrap:"wrap" }}>
              <div style={{ position:"relative", width:110, height:110, flexShrink:0 }}>
                <svg width="110" height="110" viewBox="0 0 110 110" style={{ transform:"rotate(-90deg)" }}>
                  <circle cx="55" cy="55" r="44" fill="none" stroke="#1e2d47" strokeWidth="11" />
                  <circle cx="55" cy="55" r="44" fill="none" stroke="url(#occGrad)" strokeWidth="11"
                    strokeDasharray={CIRC}
                    strokeDashoffset={CIRC * (1 - (units.occupied || 0) / (totalUnits))}
                    strokeLinecap="round" />
                  <defs>
                    <linearGradient id="occGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#06b6d4" /><stop offset="100%" stopColor="#8b5cf6" />
                    </linearGradient>
                  </defs>
                </svg>
                <div style={{ position:"absolute", inset:0, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center" }}>
                  <div style={{ fontSize:22, fontWeight:800, color:"#e2e8f0" }}>{occPct}%</div>
                  <div style={{ fontSize:9, color:"#4a6080", textTransform:"uppercase", letterSpacing:"0.08em" }}>Occupied</div>
                </div>
              </div>
              <div style={{ flex:1, minWidth:140 }}>
                {[
                  { label:"Occupied", val: units.occupied || 0, color:"#06b6d4" },
                  { label:"Vacant",   val: units.vacant   || 0, color:"#f43f5e" },
                ].map(r => (
                  <div key={r.label} style={{ marginBottom:14 }}>
                    <div style={{ display:"flex", justifyContent:"space-between", marginBottom:5 }}>
                      <div style={{ display:"flex", alignItems:"center", gap:7 }}>
                        <div style={{ width:8, height:8, borderRadius:"50%", background:r.color }} />
                        <span style={{ fontSize:12, color:"#94a3b8" }}>{r.label}</span>
                      </div>
                      <span style={{ fontSize:12, fontWeight:700, color:"#e2e8f0" }}>{r.val} units</span>
                    </div>
                    <div style={{ height:5, background:"#1e2d47", borderRadius:3, overflow:"hidden" }}>
                      <div style={{ height:"100%", width:`${(r.val / totalUnits) * 100}%`, background:r.color, borderRadius:3 }} />
                    </div>
                  </div>
                ))}
                <div style={{ display:"flex", gap:8, marginTop:6 }}>
                  {[
                    { label:"Occupied", val: units.occupied || 0, color:"#06b6d4", dimBg:"rgba(6,182,212,0.08)", dimBorder:"rgba(6,182,212,0.15)" },
                    { label:"Vacant",   val: units.vacant   || 0, color:"#f43f5e", dimBg:"rgba(244,63,94,0.08)", dimBorder:"rgba(244,63,94,0.15)"  },
                  ].map(r => (
                    <div key={r.label} style={{ flex:1, background:r.dimBg, border:`1px solid ${r.dimBorder}`, borderRadius:10, padding:"10px 12px", textAlign:"center" }}>
                      <div style={{ fontSize:20, fontWeight:800, color:r.color }}>{r.val}</div>
                      <div style={{ fontSize:11, color:"#4a6080" }}>{r.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="glass-card">
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:18 }}>
              <div style={{ fontSize:14, fontWeight:700, color:"#e2e8f0" }}>Payment Status</div>
              <div style={{ fontSize:12, color:"#06b6d4", fontWeight:600 }}>This Month</div>
            </div>
            {PAYMENT_STATUS_ROWS.map(r => (
              <div key={r.label} style={{ marginBottom:16 }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:6 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                    <div style={{ width:8, height:8, borderRadius:"50%", background:r.color }} />
                    <span style={{ fontSize:13, color:"#94a3b8" }}>{r.label}</span>
                    <span style={{ fontSize:11, background:"rgba(255,255,255,0.05)", color:"#4a6080", padding:"1px 7px", borderRadius:10 }}>{r.tenants} tenants</span>
                  </div>
                  <span style={{ fontSize:13, fontWeight:700, color:"#e2e8f0" }}>{r.amount}</span>
                </div>
                <div style={{ height:5, background:"#1e2d47", borderRadius:3, overflow:"hidden" }}>
                  <div style={{ height:"100%", width:`${totalUnits > 0 ? (r.tenants / totalUnits) * 100 : 0}%`, background:r.color, borderRadius:3 }} />
                </div>
              </div>
            ))}
            <div style={{ marginTop:8, background:"rgba(6,182,212,0.06)", border:"1px solid rgba(6,182,212,0.15)", borderRadius:10, padding:"12px 14px", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <div>
                <div style={{ fontSize:11, color:"#4a6080" }}>Total Rent Collected</div>
                {loading
                  ? <div className="skeleton" style={{ height:28, width:100, marginTop:4 }} />
                  : <div style={{ fontSize:22, fontWeight:800, color:"#06b6d4", letterSpacing:"-0.02em" }}>{formatINR(payments.collected || 0)}</div>
                }
              </div>
              <div style={{ textAlign:"right" }}>
                <div style={{ fontSize:11, color:"#22c55e", fontWeight:600 }}>This month</div>
                <div style={{ fontSize:11, color:"#4a6080", marginTop:2 }}>
                  {new Date().toLocaleDateString("en-IN",{ month:"short", year:"numeric" })}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Monthly Income Chart */}
        <div className="glass-card anim-6" style={{ marginBottom:18 }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:20, flexWrap:"wrap", gap:10 }}>
            <div>
              <div style={{ fontSize:14, fontWeight:700, color:"#e2e8f0" }}>Monthly Income</div>
              <div style={{ fontSize:12, color:"#4a6080", marginTop:2 }}>Last 6 months</div>
            </div>
            <div style={{ textAlign:"right" }}>
              {loading
                ? <div className="skeleton" style={{ height:28, width:80 }} />
                : <div style={{ fontSize:24, fontWeight:800, color:"#e2e8f0", letterSpacing:"-0.02em" }}>
                    {formatINR(payments.collected || 0)}
                  </div>
              }
              <div style={{ fontSize:11, color:"#22c55e", fontWeight:600 }}>This month</div>
            </div>
          </div>

          {loading ? (
            <div style={{ display:"flex", alignItems:"flex-end", gap:10, height:140 }}>
              {[60,80,50,90,70,100,85].map((h,i) => (
                <div key={i} className="skeleton" style={{ flex:1, height:`${h}%`, borderRadius:6 }} />
              ))}
            </div>
          ) : monthlyIncome.length === 0 ? (
            <div style={{ height:140, display:"flex", alignItems:"center", justifyContent:"center", color:"#4a6080", fontSize:13 }}>
              No income data yet
            </div>
          ) : (
            <div style={{ display:"flex", alignItems:"flex-end", gap:10, height:140, paddingTop:10 }}>
              {monthlyIncome.map((m: any, i: number) => {
                const isLast = i === monthlyIncome.length - 1;
                const barH   = Math.round((Number(m.income) / maxIncome) * 118);
                return (
                  <div key={m.month} className="bar-col" style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:6 }}>
                    <div className="bar-tip">₹{Math.round(Number(m.income) / 1000)}K</div>
                    <div style={{ width:"100%", height:barH, borderRadius:6, background: isLast ? "linear-gradient(180deg,#06b6d4,#8b5cf6)" : "rgba(6,182,212,0.15)", border: isLast ? "none" : "1px solid rgba(6,182,212,0.1)", position:"relative", overflow:"hidden" }}>
                      {isLast && <div style={{ position:"absolute", inset:0, background:"linear-gradient(180deg,rgba(255,255,255,0.15) 0%,transparent 60%)", borderRadius:6 }} />}
                    </div>
                    <div style={{ fontSize:11, color: isLast ? "#06b6d4" : "#4a6080", fontWeight: isLast ? 700 : 400 }}>{m.month}</div>
                  </div>
                );
              })}
            </div>
          )}

          <div style={{ display:"flex", justifyContent:"flex-end", gap:16, marginTop:14, paddingTop:12, borderTop:"1px solid #1e2d47", flexWrap:"wrap" }}>
            {[{ color:"linear-gradient(90deg,#06b6d4,#8b5cf6)", label:"Current month" }, { color:"rgba(6,182,212,0.2)", label:"Previous months" }].map(l => (
              <div key={l.label} style={{ display:"flex", alignItems:"center", gap:7 }}>
                <div style={{ width:24, height:8, borderRadius:4, background:l.color }} />
                <span style={{ fontSize:11, color:"#4a6080" }}>{l.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Payments Table + Top Properties */}
        <div className="main-grid" style={{ marginBottom:18 }}>

          {/* Recent Payments */}
          <div className="glass-card anim-7">
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
              <div style={{ fontSize:14, fontWeight:700, color:"#e2e8f0" }}>Tenant Payments</div>
              <Link href="/owner/payments" style={{ fontSize:12, color:"#06b6d4", fontWeight:600, textDecoration:"none" }}>View all →</Link>
            </div>
            {loading ? (
              <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
                {[1,2,3].map(i => <div key={i} className="skeleton" style={{ height:44, borderRadius:8 }} />)}
              </div>
            ) : recentPayments.length === 0 ? (
              <div style={{ color:"#4a6080", fontSize:13, textAlign:"center", padding:"24px 0" }}>No payments recorded yet</div>
            ) : (
              <div className="table-scroll">
                <table style={{ width:"100%", borderCollapse:"collapse" }}>
                  <thead>
                    <tr>
                      {["Tenant","Property","Amount","Status","Date"].map(h => (
                        <th key={h} style={{ fontSize:10, fontWeight:700, color:"#4a6080", textTransform:"uppercase", letterSpacing:"0.1em", padding:"0 0 10px", textAlign:"left", borderBottom:"1px solid #1e2d47" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {recentPayments.map((p: any, i: number) => {
                      const initials = (p.tenant_name || "??").split(" ").map((w: string) => w[0]).join("").slice(0,2).toUpperCase();
                      const grads = ["linear-gradient(135deg,#06b6d4,#8b5cf6)","linear-gradient(135deg,#f59e0b,#ef4444)","linear-gradient(135deg,#22c55e,#06b6d4)","linear-gradient(135deg,#8b5cf6,#6366f1)"];
                      return (
                        <tr key={p.id} className="pay-row" style={{ borderBottom: i < recentPayments.length - 1 ? "1px solid #1e2d47" : "none" }}>
                          <td style={{ padding:"12px 0", verticalAlign:"middle" }}>
                            <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                              <div style={{ width:32, height:32, borderRadius:8, background:grads[i % grads.length], display:"grid", placeItems:"center", fontSize:12, fontWeight:700, color:"white", flexShrink:0 }}>{initials}</div>
                              <div>
                                <div style={{ fontSize:13, fontWeight:600, color:"#e2e8f0" }}>{p.tenant_name}</div>
                                <div style={{ fontSize:11, color:"#4a6080" }}>{p.unit_number}</div>
                              </div>
                            </div>
                          </td>
                          <td style={{ padding:"12px 0", fontSize:13, color:"#94a3b8", verticalAlign:"middle" }}>{p.property_name}</td>
                          <td style={{ padding:"12px 0", fontSize:13, fontWeight:700, color:"#e2e8f0", verticalAlign:"middle" }}>₹{Number(p.amount).toLocaleString("en-IN")}</td>
                          <td style={{ padding:"12px 0", verticalAlign:"middle" }}><Pill status={p.status as PaymentStatus} /></td>
                          <td style={{ padding:"12px 0", fontSize:12, color:"#4a6080", verticalAlign:"middle" }}>
                            {p.payment_date ? new Date(p.payment_date).toLocaleDateString("en-IN",{day:"numeric",month:"short"}) : "—"}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Recent Maintenance */}
          <div className="glass-card anim-7">
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
              <div style={{ fontSize:14, fontWeight:700, color:"#e2e8f0" }}>Maintenance Queue</div>
              <Link href="/owner/complaints" style={{ fontSize:12, color:"#06b6d4", fontWeight:600, textDecoration:"none" }}>{openRequests} open</Link>
            </div>
            {loading ? (
              <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
                {[1,2,3].map(i => <div key={i} className="skeleton" style={{ height:44, borderRadius:8 }} />)}
              </div>
            ) : recentRequests.length === 0 ? (
              <div style={{ color:"#4a6080", fontSize:13, textAlign:"center", padding:"24px 0" }}>No maintenance requests</div>
            ) : (
              <div style={{ display:"flex", flexDirection:"column", gap:0 }}>
                {recentRequests.map((m: any, i: number) => {
                  const priorityColor: Record<string, string> = { high:"#f43f5e", medium:"#f59e0b", low:"#06b6d4" };
                  const statusMap: Record<string, PaymentStatus> = { open:"overdue", "in-progress":"pending", resolved:"paid" };
                  return (
                    <div key={m.id} style={{ display:"flex", alignItems:"center", gap:12, padding:"10px 0", borderBottom: i < recentRequests.length - 1 ? "1px solid #1e2d47" : "none" }}>
                      <div style={{ width:6, height:28, borderRadius:3, background: priorityColor[m.priority] || "#06b6d4", flexShrink:0 }} />
                      <div style={{ flex:1 }}>
                        <div style={{ fontSize:13, fontWeight:500, color:"#e2e8f0" }}>{m.title}</div>
                        <div style={{ fontSize:11, color:"#4a6080" }}>{m.unit_number} · {m.property_name}</div>
                      </div>
                      <Pill status={statusMap[m.status] || "pending"} />
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Activity + Quick Actions */}
        <div className="bottom-grid">
          <div className="glass-card anim-8">
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
              <div style={{ fontSize:14, fontWeight:700, color:"#e2e8f0" }}>Recent Activities</div>
            </div>
            {loading ? (
              <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
                {[1,2,3,4].map(i => <div key={i} className="skeleton" style={{ height:36, borderRadius:8 }} />)}
              </div>
            ) : recentActivities.length === 0 ? (
              /* fallback static if backend doesn't return activities */
              [
                { dot:"#22c55e", text:"Payments recorded this month", time:"Today" },
                { dot:"#06b6d4", text:"Dashboard loaded from database", time:"Just now" },
              ].map((a, i) => (
                <div key={i} style={{ display:"flex", gap:12, padding:"10px 0", borderBottom: i === 0 ? "1px solid #1e2d47" : "none" }}>
                  <div style={{ display:"flex", flexDirection:"column", alignItems:"center" }}>
                    <div style={{ width:8, height:8, borderRadius:"50%", background:a.dot, flexShrink:0, marginTop:4 }} />
                  </div>
                  <div>
                    <div style={{ fontSize:13, color:"#e2e8f0", lineHeight:1.45 }}>{a.text}</div>
                    <div style={{ fontSize:11, color:"#4a6080", marginTop:3 }}>{a.time}</div>
                  </div>
                </div>
              ))
            ) : (
              recentActivities.map((a: any, i: number) => (
                <div key={i} style={{ display:"flex", gap:12, padding:"10px 0", borderBottom: i < recentActivities.length - 1 ? "1px solid #1e2d47" : "none" }}>
                  <div style={{ display:"flex", flexDirection:"column", alignItems:"center" }}>
                    <div style={{ width:8, height:8, borderRadius:"50%", background:"#06b6d4", flexShrink:0, marginTop:4 }} />
                  </div>
                  <div>
                    <div style={{ fontSize:13, color:"#e2e8f0", lineHeight:1.45 }}>{a.text || a.title}</div>
                    <div style={{ fontSize:11, color:"#4a6080", marginTop:3 }}>{a.time || a.created_at}</div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="glass-card anim-9">
            <div style={{ fontSize:14, fontWeight:700, color:"#e2e8f0", marginBottom:14 }}>Quick Actions</div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
              {[
                { ico:"➕", lbl:"Add Property", href:"/owner/houses"    },
                { ico:"👤", lbl:"Add Tenant",   href:"/owner/tenants"   },
                { ico:"📄", lbl:"New Lease",    href:"/owner/leases"    },
                { ico:"💸", lbl:"Record Pay",   href:"/owner/payments"  },
                { ico:"🔔", lbl:"Maintenance",  href:"/owner/complaints"},
                { ico:"📊", lbl:"Analytics",    href:"/owner/analytics" },
              ].map(q => (
                <Link key={q.lbl} href={q.href} style={{ textDecoration:"none" }}>
                  <div className="qa-btn">
                    <div style={{ fontSize:18, marginBottom:4 }}>{q.ico}</div>
                    <div style={{ fontSize:11, fontWeight:600, color:"#94a3b8" }}>{q.lbl}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

      </main>
    </>
  );
}