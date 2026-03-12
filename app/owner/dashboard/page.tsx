"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";


// ─── Types ────────────────────────────────────────────────────────────────────
type PaymentStatus = "paid" | "pending" | "overdue";

// ─── Static Data ──────────────────────────────────────────────────────────────
const NAV_SECTIONS = [
  {
    label: "Main",
    items: [
      { icon: "⚡", label: "Dashboard",   href: "/owner/dashboard",   badge: null, active: true  },
      { icon: "🏠", label: "Houses",      href: "/owner/houses",      badge: null, active: false },
      { icon: "👥", label: "Tenants",     href: "/owner/tenants",     badge: "12", active: false },
      { icon: "📋", label: "Leases",      href: "/owner/leases",      badge: null, active: false },
    ],
  },
  {
    label: "Finance",
    items: [
      { icon: "💳", label: "Payments",    href: "/owner/payments",    badge: "3",  active: false },
      { icon: "📈", label: "Analytics",   href: "/owner/analytics",   badge: null, active: false },
      { icon: "🧾", label: "Invoices",    href: "/owner/invoices",    badge: null, active: false },
    ],
  },
  {
    label: "Tools",
    items: [
      { icon: "🔧", label: "Maintenance", href: "/owner/complaints",  badge: "5",  active: false },
      { icon: "💬", label: "Messages",    href: "/owner/messages",    badge: null, active: false },
      { icon: "⚙️", label: "Settings",   href: "/owner/settings",    badge: null, active: false },
    ],
  },
];

const STATS = [
  { icon: "🏠", label: "Total Properties", value: "48",    delta: "+4%",  pos: true,  fill: 84, color: "#06b6d4", bg: "rgba(6,182,212,0.1)"  },
  { icon: "👥", label: "Active Tenants",   value: "124",   delta: "+8%",  pos: true,  fill: 92, color: "#8b5cf6", bg: "rgba(139,92,246,0.1)" },
  { icon: "💰", label: "Rent Collected",   value: "₹4.2L", delta: "+12%", pos: true,  fill: 70, color: "#22c55e", bg: "rgba(34,197,94,0.1)"  },
  { icon: "⚠️", label: "Pending Dues",    value: "7",     delta: "+2",   pos: false, fill: 28, color: "#f43f5e", bg: "rgba(244,63,94,0.1)"  },
];

const OCCUPANCY = { occupied: 40, vacant: 8, total: 48 };

const PAYMENT_STATUS_ROWS = [
  { label: "Collected", tenants: 38, amount: "₹3.4L", color: "#22c55e" },
  { label: "Pending",   tenants:  7, amount: "₹58K",  color: "#f59e0b" },
  { label: "Overdue",   tenants:  3, amount: "₹24K",  color: "#f43f5e" },
];

const PAYMENTS: {
  initials: string; name: string; unit: string; property: string;
  amount: string; status: PaymentStatus; date: string; grad: string;
}[] = [
  { initials:"RK", name:"Rahul Krishnan", unit:"Unit 4B", property:"Greenview Apt",  amount:"₹18,000", status:"paid",    date:"Mar 1",  grad:"linear-gradient(135deg,#06b6d4,#8b5cf6)" },
  { initials:"PM", name:"Priya Mehta",    unit:"Unit 2A", property:"Sunrise Villas", amount:"₹22,000", status:"pending", date:"Mar 5",  grad:"linear-gradient(135deg,#f59e0b,#ef4444)" },
  { initials:"SS", name:"Suresh Sharma",  unit:"Unit 1C", property:"Palm Heights",   amount:"₹15,000", status:"overdue", date:"Feb 28", grad:"linear-gradient(135deg,#ef4444,#ec4899)" },
  { initials:"AN", name:"Anjali Nair",    unit:"Unit 3D", property:"Greenview Apt",  amount:"₹20,000", status:"paid",    date:"Mar 1",  grad:"linear-gradient(135deg,#22c55e,#06b6d4)" },
  { initials:"DV", name:"Divya Varma",    unit:"Unit 5A", property:"Palm Heights",   amount:"₹17,500", status:"paid",    date:"Mar 1",  grad:"linear-gradient(135deg,#8b5cf6,#6366f1)" },
];

const PROPERTIES = [
  { icon:"🏢", name:"Greenview Apt",  addr:"Anna Nagar, Chennai", val:"₹1.2L", units:"12 units" },
  { icon:"🏠", name:"Sunrise Villas", addr:"Velachery, Chennai",  val:"₹96K",  units:"8 units"  },
  { icon:"🏗️", name:"Palm Heights",  addr:"Tambaram, Chennai",   val:"₹80K",  units:"10 units" },
];

const ACTIVITIES = [
  { dot:"#22c55e", text:"Rahul Krishnan paid ₹18,000 for March",      time:"2 hours ago"      },
  { dot:"#f59e0b", text:"Maintenance request: Leaking tap — Unit 2A", time:"5 hours ago"      },
  { dot:"#06b6d4", text:"Lease renewed for Anjali Nair (1 year)",      time:"Yesterday, 4 PM"  },
  { dot:"#f43f5e", text:"Overdue notice sent to Suresh Sharma",        time:"Yesterday, 10 AM" },
  { dot:"#8b5cf6", text:"New tenant registered — Divya Varma",         time:"2 days ago"       },
];

const MAINTENANCE = [
  { color:"#f43f5e", title:"Leaking pipe — Unit 2A",     unit:"Sunrise Villas · High",  status:"overdue" as PaymentStatus },
  { color:"#f59e0b", title:"AC not cooling — Unit 4B",   unit:"Greenview Apt · Medium", status:"pending" as PaymentStatus },
  { color:"#06b6d4", title:"Door lock repair — Unit 3D", unit:"Greenview Apt · Low",    status:"paid"    as PaymentStatus },
];

const MONTHLY_INCOME = [
  { month:"Sep", amount:280000 },
  { month:"Oct", amount:310000 },
  { month:"Nov", amount:295000 },
  { month:"Dec", amount:340000 },
  { month:"Jan", amount:360000 },
  { month:"Feb", amount:390000 },
  { month:"Mar", amount:420000 },
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
  const maxIncome = Math.max(...MONTHLY_INCOME.map(m => m.amount));
  const occPct    = Math.round((OCCUPANCY.occupied / OCCUPANCY.total) * 100);
  const CIRC      = 2 * Math.PI * 44;
  const router = useRouter();
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

        .user-row { border-radius:8px; cursor:pointer; transition:background .15s; border:1px solid transparent; }
        .user-row:hover { background:rgba(255,255,255,0.04); }

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
        .page-main { margin-left:250px; margin-top:62px; padding:26px; min-height:calc(100vh - 62px); }

        @media(max-width:768px) {
          .navbar    { left:0; padding:0 16px; }
          .page-main { margin-left:0; padding:16px; }
          .nav-search-wrap { display:none; }
          .mob-burger { display:grid !important; }
        }

        .table-scroll { overflow-x:auto; }
        .table-scroll table { min-width:520px; }
      `}</style>

      {/* Mobile overlay */}
      <div className={`mob-overlay${mobileOpen ? " open" : ""}`} onClick={() => setMobileOpen(false)} />

      {/* ══════════════════════════════════════════════════════════════════════
          SIDEBAR
      ══════════════════════════════════════════════════════════════════════ */}
      <aside className={`sidebar${mobileOpen ? " open" : ""}`}>

        {/* Brand */}
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

        {/* Nav links */}
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

        {/* ── Sidebar footer: user row + logout ── */}
        <div style={{ padding:"14px 12px", borderTop:"1px solid #1e2d47", flexShrink:0 }}>
          {/* User info row */}
          

          <button
  onClick={() => {
    localStorage.removeItem("rentmanager_user");
    document.cookie = "role=; path=/; max-age=0";
    router.push("/login");
  }}
  style={{
    display: "flex", alignItems: "center", gap: 10,
    padding: 9, borderRadius: 9, cursor: "pointer",
    background: "transparent", border: "1px solid transparent",
    color: "#f43f5e", fontSize: 13, fontWeight: 500,
    fontFamily: "inherit", width: "100%", marginTop: 4,
    transition: "all .15s",
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
  <span style={{ fontSize: 15, width: 18, textAlign: "center" }}>🚪</span>
  <span>Logout</span>
</button>
        </div>

      </aside>

      {/* ══════════════════════════════════════════════════════════════════════
          NAVBAR
      ══════════════════════════════════════════════════════════════════════ */}
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

  {/* Bell → Complaints */}
  <Link href="/owner/complaints" className="nav-ico" style={{ textDecoration:"none" }}>
    🔔
    <div style={{ position:"absolute", top:5, right:5, width:7, height:7, borderRadius:"50%", background:"#f43f5e", border:"2px solid #0d1526" }} />
  </Link>

  {/* Mailbox → Messages */}
  <Link href="/owner/messages" className="nav-ico" style={{ textDecoration:"none" }}>
    📬
  </Link>

  {/* Avatar → Settings */}
  <Link href="/owner/settings" style={{ width:36, height:36, borderRadius:8, background:"linear-gradient(135deg,#06b6d4,#8b5cf6)", display:"grid", placeItems:"center", color:"white", fontSize:12, fontWeight:700, cursor:"pointer", boxShadow:"0 0 12px rgba(6,182,212,0.25)", border:"1.5px solid rgba(6,182,212,0.3)", flexShrink:0, textDecoration:"none" }}>
    AK
  </Link>
</div>
      </header>

      {/* ══════════════════════════════════════════════════════════════════════
          MAIN
      ══════════════════════════════════════════════════════════════════════ */}
      <main className="page-main">

        {/* Page heading */}
        <div className="anim-1" style={{ marginBottom:22 }}>
          <div style={{ fontSize:"clamp(18px,2.5vw,24px)", fontWeight:800, color:"#e2e8f0", letterSpacing:"-0.02em" }}>
            Welcome back, Arjun 👋
          </div>
          <div style={{ fontSize:13, color:"#94a3b8", marginTop:3 }}>
            Here&rsquo;s your property portfolio at a glance.
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
              <div style={{ fontSize:28, fontWeight:800, color:"#e2e8f0", letterSpacing:"-0.03em", marginBottom:3 }}>{s.value}</div>
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
              <div style={{ fontSize:12, color:"#06b6d4", fontWeight:600 }}>{OCCUPANCY.total} units total</div>
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:24, flexWrap:"wrap" }}>
              <div style={{ position:"relative", width:110, height:110, flexShrink:0 }}>
                <svg width="110" height="110" viewBox="0 0 110 110" style={{ transform:"rotate(-90deg)" }}>
                  <circle cx="55" cy="55" r="44" fill="none" stroke="#1e2d47" strokeWidth="11" />
                  <circle cx="55" cy="55" r="44" fill="none" stroke="url(#occGrad)" strokeWidth="11"
                    strokeDasharray={CIRC} strokeDashoffset={CIRC * (1 - OCCUPANCY.occupied / OCCUPANCY.total)} strokeLinecap="round" />
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
                {[{ label:"Occupied", val:OCCUPANCY.occupied, color:"#06b6d4" }, { label:"Vacant", val:OCCUPANCY.vacant, color:"#f43f5e" }].map(r => (
                  <div key={r.label} style={{ marginBottom:14 }}>
                    <div style={{ display:"flex", justifyContent:"space-between", marginBottom:5 }}>
                      <div style={{ display:"flex", alignItems:"center", gap:7 }}>
                        <div style={{ width:8, height:8, borderRadius:"50%", background:r.color }} />
                        <span style={{ fontSize:12, color:"#94a3b8" }}>{r.label}</span>
                      </div>
                      <span style={{ fontSize:12, fontWeight:700, color:"#e2e8f0" }}>{r.val} units</span>
                    </div>
                    <div style={{ height:5, background:"#1e2d47", borderRadius:3, overflow:"hidden" }}>
                      <div style={{ height:"100%", width:`${(r.val / OCCUPANCY.total) * 100}%`, background:r.color, borderRadius:3 }} />
                    </div>
                  </div>
                ))}
                <div style={{ display:"flex", gap:8, marginTop:6 }}>
                  {[{ label:"Occupied", val:OCCUPANCY.occupied, color:"#06b6d4", dimBg:"rgba(6,182,212,0.08)", dimBorder:"rgba(6,182,212,0.15)" }, { label:"Vacant", val:OCCUPANCY.vacant, color:"#f43f5e", dimBg:"rgba(244,63,94,0.08)", dimBorder:"rgba(244,63,94,0.15)" }].map(r => (
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
                  <div style={{ height:"100%", width:`${(r.tenants / OCCUPANCY.total) * 100}%`, background:r.color, borderRadius:3 }} />
                </div>
              </div>
            ))}
            <div style={{ marginTop:8, background:"rgba(6,182,212,0.06)", border:"1px solid rgba(6,182,212,0.15)", borderRadius:10, padding:"12px 14px", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <div>
                <div style={{ fontSize:11, color:"#4a6080" }}>Total Rent Collected</div>
                <div style={{ fontSize:22, fontWeight:800, color:"#06b6d4", letterSpacing:"-0.02em" }}>₹4,20,000</div>
              </div>
              <div style={{ textAlign:"right" }}>
                <div style={{ fontSize:11, color:"#22c55e", fontWeight:600 }}>↑ 12% vs Feb</div>
                <div style={{ fontSize:11, color:"#4a6080", marginTop:2 }}>Mar 2026</div>
              </div>
            </div>
          </div>
        </div>

        {/* Monthly Income Chart */}
        <div className="glass-card anim-6" style={{ marginBottom:18 }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:20, flexWrap:"wrap", gap:10 }}>
            <div>
              <div style={{ fontSize:14, fontWeight:700, color:"#e2e8f0" }}>Monthly Income</div>
              <div style={{ fontSize:12, color:"#4a6080", marginTop:2 }}>Sep 2025 — Mar 2026</div>
            </div>
            <div style={{ textAlign:"right" }}>
              <div style={{ fontSize:24, fontWeight:800, color:"#e2e8f0", letterSpacing:"-0.02em" }}>₹4.2L</div>
              <div style={{ fontSize:11, color:"#22c55e", fontWeight:600 }}>↑ 7.7% vs last month</div>
            </div>
          </div>
          <div style={{ display:"flex", alignItems:"flex-end", gap:10, height:140, paddingTop:10 }}>
            {MONTHLY_INCOME.map((m, i) => {
              const isLast = i === MONTHLY_INCOME.length - 1;
              const barH   = Math.round((m.amount / maxIncome) * 118);
              return (
                <div key={m.month} className="bar-col" style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:6 }}>
                  <div className="bar-tip">₹{Math.round(m.amount / 1000)}K</div>
                  <div style={{ width:"100%", height:barH, borderRadius:6, background: isLast ? "linear-gradient(180deg,#06b6d4,#8b5cf6)" : "rgba(6,182,212,0.15)", border: isLast ? "none" : "1px solid rgba(6,182,212,0.1)", position:"relative", overflow:"hidden" }}>
                    {isLast && <div style={{ position:"absolute", inset:0, background:"linear-gradient(180deg,rgba(255,255,255,0.15) 0%,transparent 60%)", borderRadius:6 }} />}
                  </div>
                  <div style={{ fontSize:11, color: isLast ? "#06b6d4" : "#4a6080", fontWeight: isLast ? 700 : 400 }}>{m.month}</div>
                </div>
              );
            })}
          </div>
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
          <div className="glass-card anim-7">
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
              <div style={{ fontSize:14, fontWeight:700, color:"#e2e8f0" }}>Tenant Payments</div>
              <Link href="/owner/payments" style={{ fontSize:12, color:"#06b6d4", fontWeight:600, textDecoration:"none" }}>View all →</Link>
            </div>
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
                  {PAYMENTS.map((p, i) => (
                    <tr key={i} className="pay-row" style={{ borderBottom: i < PAYMENTS.length - 1 ? "1px solid #1e2d47" : "none" }}>
                      <td style={{ padding:"12px 0", verticalAlign:"middle" }}>
                        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                          <div style={{ width:32, height:32, borderRadius:8, background:p.grad, display:"grid", placeItems:"center", fontSize:12, fontWeight:700, color:"white", flexShrink:0 }}>{p.initials}</div>
                          <div>
                            <div style={{ fontSize:13, fontWeight:600, color:"#e2e8f0" }}>{p.name}</div>
                            <div style={{ fontSize:11, color:"#4a6080" }}>{p.unit}</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding:"12px 0", fontSize:13, color:"#94a3b8", verticalAlign:"middle" }}>{p.property}</td>
                      <td style={{ padding:"12px 0", fontSize:13, fontWeight:700, color:"#e2e8f0", verticalAlign:"middle" }}>{p.amount}</td>
                      <td style={{ padding:"12px 0", verticalAlign:"middle" }}><Pill status={p.status} /></td>
                      <td style={{ padding:"12px 0", fontSize:12, color:"#4a6080", verticalAlign:"middle" }}>{p.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="glass-card anim-7">
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
              <div style={{ fontSize:14, fontWeight:700, color:"#e2e8f0" }}>Top Properties</div>
              <Link href="/owner/houses" style={{ fontSize:12, color:"#06b6d4", fontWeight:600, textDecoration:"none" }}>Manage</Link>
            </div>
            <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
              {PROPERTIES.map((p, i) => (
                <div key={i} className="prop-mini">
                  <div style={{ fontSize:18, flexShrink:0 }}>{p.icon}</div>
                  <div style={{ flex:1, overflow:"hidden" }}>
                    <div style={{ fontSize:13, fontWeight:600, color:"#e2e8f0" }}>{p.name}</div>
                    <div style={{ fontSize:11, color:"#4a6080" }}>{p.addr}</div>
                  </div>
                  <div style={{ textAlign:"right", flexShrink:0 }}>
                    <div style={{ fontSize:13, fontWeight:700, color:"#06b6d4" }}>{p.val}</div>
                    <div style={{ fontSize:10, color:"#4a6080" }}>{p.units}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Activity + Maintenance */}
        <div className="bottom-grid">
          <div className="glass-card anim-8">
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
              <div style={{ fontSize:14, fontWeight:700, color:"#e2e8f0" }}>Recent Activities</div>
              <div style={{ fontSize:12, color:"#06b6d4", fontWeight:600, cursor:"pointer" }}>See all</div>
            </div>
            {ACTIVITIES.map((a, i) => (
              <div key={i} style={{ display:"flex", gap:12, padding:"10px 0", borderBottom: i < ACTIVITIES.length - 1 ? "1px solid #1e2d47" : "none" }}>
                <div style={{ display:"flex", flexDirection:"column", alignItems:"center" }}>
                  <div style={{ width:8, height:8, borderRadius:"50%", background:a.dot, flexShrink:0, marginTop:4 }} />
                  {i < ACTIVITIES.length - 1 && <div style={{ width:1, flex:1, background:"#1e2d47", marginTop:4 }} />}
                </div>
                <div style={{ paddingBottom: i < ACTIVITIES.length - 1 ? 8 : 0 }}>
                  <div style={{ fontSize:13, color:"#e2e8f0", lineHeight:1.45 }}>{a.text}</div>
                  <div style={{ fontSize:11, color:"#4a6080", marginTop:3 }}>{a.time}</div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
            <div className="glass-card anim-9">
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
                <div style={{ fontSize:14, fontWeight:700, color:"#e2e8f0" }}>Maintenance Queue</div>
                <div style={{ fontSize:12, color:"#06b6d4", fontWeight:600, cursor:"pointer" }}>5 open</div>
              </div>
              {MAINTENANCE.map((m, i) => (
                <div key={i} style={{ display:"flex", alignItems:"center", gap:12, padding:"10px 0", borderBottom: i < MAINTENANCE.length - 1 ? "1px solid #1e2d47" : "none" }}>
                  <div style={{ width:6, height:28, borderRadius:3, background:m.color, flexShrink:0 }} />
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:13, fontWeight:500, color:"#e2e8f0" }}>{m.title}</div>
                    <div style={{ fontSize:11, color:"#4a6080" }}>{m.unit}</div>
                  </div>
                  <Pill status={m.status} />
                </div>
              ))}
            </div>

            <div className="glass-card anim-9">
              <div style={{ fontSize:14, fontWeight:700, color:"#e2e8f0", marginBottom:14 }}>Quick Actions</div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
                {[
                  { ico:"➕", lbl:"Add Property", href:"/owner/houses"    },
                  { ico:"👤", lbl:"Add Tenant",   href:"/owner/tenants"   },
                  { ico:"📄", lbl:"New Lease",    href:"/owner/leases"    },
                  { ico:"💸", lbl:"Record Pay",   href:"/owner/payments"  },
                  { ico:"🔔", lbl:"Send Notice",  href:"/owner/tenants"   },
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
        </div>

      </main>
    </>
  );
}