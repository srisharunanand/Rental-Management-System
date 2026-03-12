"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

// ─── Types ────────────────────────────────────────────────────────────────────
type PayStatus = "paid" | "pending" | "overdue";
type ReqStatus = "open" | "in-progress" | "resolved";
type Priority  = "high" | "medium" | "low";

// ─── Data ─────────────────────────────────────────────────────────────────────
const TENANT = {
  name:      "Rahul Krishnan",
  initials:  "RK",
  unit:      "Unit 4B",
  property:  "Greenview Apartments",
  address:   "12, Anna Nagar, Chennai – 600 040",
  floor:     "2nd Floor",
  type:      "2 BHK",
  since:     "Jan 2024",
  leaseEnd:  "Dec 2026",
  monthlyRent: 18000,
};

const STATS = [
  { icon: "💳", label: "Rent Due",       value: "₹18,000", sub: "Due Mar 5",  color: "#f59e0b", bg: "rgba(245,158,11,0.1)",  urgent: true  },
  { icon: "📋", label: "Lease Ends",     value: "Dec 2026", sub: "9 months left", color: "#06b6d4", bg: "rgba(6,182,212,0.1)",  urgent: false },
  { icon: "🔧", label: "Open Requests",  value: "2",        sub: "1 urgent",   color: "#f43f5e", bg: "rgba(244,63,94,0.1)",  urgent: true  },
];

const PAYMENT_HISTORY: { month: string; amount: string; date: string; status: PayStatus; receipt: string }[] = [
  { month: "Mar 2026", amount: "₹18,000", date: "Due Mar 5",  status: "pending",  receipt: "" },
  { month: "Feb 2026", amount: "₹18,000", date: "Feb 1",      status: "paid",     receipt: "RCP-0224" },
  { month: "Jan 2026", amount: "₹18,000", date: "Jan 1",      status: "paid",     receipt: "RCP-0124" },
  { month: "Dec 2025", amount: "₹18,000", date: "Dec 2",      status: "paid",     receipt: "RCP-1225" },
  { month: "Nov 2025", amount: "₹18,000", date: "Nov 3",      status: "overdue",  receipt: "" },
  { month: "Oct 2025", amount: "₹18,000", date: "Oct 1",      status: "paid",     receipt: "RCP-1025" },
];

const MAINTENANCE: { id: string; title: string; category: string; date: string; status: ReqStatus; priority: Priority; note: string }[] = [
  { id: "MR-042", title: "Leaking tap in kitchen",  category: "Plumbing",   date: "Feb 28", status: "in-progress", priority: "high",   note: "Technician scheduled Mar 6" },
  { id: "MR-038", title: "AC not cooling properly", category: "Electrical", date: "Feb 20", status: "open",        priority: "medium", note: "Awaiting owner approval"    },
  { id: "MR-031", title: "Door hinge loose — main", category: "Carpentry",  date: "Jan 15", status: "resolved",    priority: "low",    note: "Fixed Jan 18"               },
];



const ACTIVITIES = [
  { dot: "#22c55e", text: "Payment of ₹18,000 confirmed for Feb",        time: "Feb 1, 10:12 AM"   },
  { dot: "#06b6d4", text: "Maintenance request MR-042 raised",             time: "Feb 28, 2:30 PM"  },
  { dot: "#f59e0b", text: "Rent reminder: Mar payment due on Mar 5",       time: "Mar 1, 9:00 AM"   },
  { dot: "#8b5cf6", text: "New notice posted by owner",                    time: "Mar 2, 11:00 AM"  },
  { dot: "#f43f5e", text: "MR-038 status updated to Open",                 time: "Feb 20, 4:15 PM"  },
];

const MONTHLY_RENT = [
  { month: "Oct", paid: true  },
  { month: "Nov", paid: false },
  { month: "Dec", paid: true  },
  { month: "Jan", paid: true  },
  { month: "Feb", paid: true  },
  { month: "Mar", paid: false },
];

// ─── Sub-components ───────────────────────────────────────────────────────────
const PAY_MAP: Record<PayStatus, { bg: string; color: string; label: string }> = {
  paid:    { bg: "rgba(34,197,94,0.1)",  color: "#22c55e", label: "✓ Paid"     },
  pending: { bg: "rgba(245,158,11,0.1)", color: "#f59e0b", label: "⏳ Pending" },
  overdue: { bg: "rgba(244,63,94,0.1)",  color: "#f43f5e", label: "✗ Overdue" },
};
const REQ_MAP: Record<ReqStatus, { bg: string; color: string; label: string }> = {
  "open":        { bg: "rgba(244,63,94,0.1)",  color: "#f43f5e", label: "Open"        },
  "in-progress": { bg: "rgba(245,158,11,0.1)", color: "#f59e0b", label: "In Progress" },
  "resolved":    { bg: "rgba(34,197,94,0.1)",  color: "#22c55e", label: "Resolved"    },
};
const PRI_MAP: Record<Priority, { color: string }> = {
  high:   { color: "#f43f5e" },
  medium: { color: "#f59e0b" },
  low:    { color: "#06b6d4" },
};

function Pill({ bg, color, label }: { bg: string; color: string; label: string }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600, background: bg, color, whiteSpace: "nowrap" }}>
      {label}
    </span>
  );
}

const NAV_ITEMS = [
  { icon: "⚡", label: "Dashboard",   href: "/tenant/dashboard",   active: true  },
  { icon: "💳", label: "Payments",    href: "/tenant/payments",    active: false },
  { icon: "🔧", label: "Maintenance", href: "/tenant/complaints", active: false },
  { icon: "📋", label: "My Lease",    href: "/tenant/lease",       active: false },
  { icon: "💬", label: "Messages",    href: "/tenant/messages",    active: false },
  { icon: "⚙️", label: "Settings",   href: "/tenant/settings",    active: false },
];

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function TenantDashboardPage() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [payModal,   setPayModal]   = useState(false);
  const router = useRouter();

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html, body { height: 100%; font-family: 'Plus Jakarta Sans', sans-serif; background: #080e1a; color: #e2e8f0; }
        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-thumb { background: #1e2d47; border-radius: 4px; }

        /* ── Animations ── */
        @keyframes fadeUp   { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
        @keyframes pulse-ring { 0% { transform:scale(1); opacity:.5; } 100% { transform:scale(1.6); opacity:0; } }
        @keyframes shimmer  { 0% { background-position:-200% center; } 100% { background-position:200% center; } }
        @keyframes blink    { 0%,100% { opacity:1; } 50% { opacity:.3; } }

        .a1{animation:fadeUp .45s ease both .05s} .a2{animation:fadeUp .45s ease both .10s}
        .a3{animation:fadeUp .45s ease both .15s} .a4{animation:fadeUp .45s ease both .20s}
        .a5{animation:fadeUp .45s ease both .25s} .a6{animation:fadeUp .45s ease both .30s}
        .a7{animation:fadeUp .45s ease both .35s} .a8{animation:fadeUp .45s ease both .40s}
        .a9{animation:fadeUp .45s ease both .45s}

        /* ── Sidebar ── */
        .sidebar {
          position:fixed; top:0; left:0; bottom:0; width:250px;
          background:#0d1526; border-right:1px solid #1e2d47;
          display:flex; flex-direction:column; z-index:300;
          transition:transform .3s ease;
        }
        .sb-link {
          display:flex; align-items:center; gap:10px; padding:9px 10px;
          border-radius:8px; font-size:13px; font-weight:500; color:#94a3b8;
          cursor:pointer; transition:all .15s; text-decoration:none;
          margin-bottom:2px; border:1px solid transparent;
        }
        .sb-link:hover  { background:rgba(255,255,255,0.04); color:#e2e8f0; }
        .sb-link.active { background:rgba(6,182,212,0.1); color:#06b6d4; border-color:rgba(6,182,212,0.15); }

        /* ── Navbar ── */
        .top-nav {
          position:fixed; top:0; left:250px; right:0; height:62px;
          background:#0d1526; border-bottom:1px solid #1e2d47;
          display:flex; align-items:center; justify-content:space-between;
          padding:0 24px; z-index:200;
        }

        /* ── Main ── */
        .page-main { margin-left:250px; margin-top:62px; padding:26px; min-height:calc(100vh - 62px); }

        /* ── Cards ── */
        .glass-card {
          background:#111d33; border:1px solid #1e2d47; border-radius:14px;
          padding:20px; position:relative; overflow:hidden;
        }
        .glass-card::after {
          content:''; position:absolute; bottom:0; left:20%; right:20%;
          height:1px; background:linear-gradient(90deg,transparent,rgba(6,182,212,0.25),transparent);
        }
        .stat-card {
          background:#111d33; border:1px solid #1e2d47; border-radius:14px;
          padding:20px; transition:border-color .2s, transform .2s;
        }
        .stat-card:hover { border-color:#06b6d4; transform:translateY(-2px); }
        .stat-card.urgent { border-color:rgba(245,158,11,0.25); }
        .stat-card.urgent:hover { border-color:rgba(245,158,11,0.6); }

        /* ── Shimmer pay button ── */
        .pay-btn {
          background:linear-gradient(90deg,#2563eb 0%,#06b6d4 40%,#2563eb 60%,#1d4ed8 100%);
          background-size:200% auto; animation:shimmer 2.5s linear infinite;
          border:none; border-radius:10px; padding:12px 22px;
          font-family:'Plus Jakarta Sans',sans-serif; font-size:13px; font-weight:700;
          color:white; cursor:pointer; transition:transform .15s, box-shadow .15s;
          white-space:nowrap;
        }
        .pay-btn:hover { transform:translateY(-1px); box-shadow:0 8px 24px rgba(6,182,212,0.35); }

        /* ── Nav icon button ── */
        .nav-ico {
          width:36px; height:36px; border-radius:8px;
          background:#111d33; border:1px solid #1e2d47;
          display:grid; place-items:center; cursor:pointer;
          font-size:15px; position:relative; transition:border-color .2s; flex-shrink:0;
        }
        .nav-ico:hover { border-color:#06b6d4; }

        /* ── Table rows ── */
        .trow:hover td { background:rgba(6,182,212,0.03); }

        /* ── Maintenance item ── */
        .maint-row { padding:12px 14px; border-radius:11px; border:1px solid #1e2d47; background:#0d1526; margin-bottom:8px; cursor:pointer; transition:border-color .15s; }
        .maint-row:last-child { margin-bottom:0; }
        .maint-row:hover { border-color:rgba(6,182,212,0.4); }

        /* ── Notice item ── */
        .notice-row { display:flex; align-items:flex-start; gap:12px; padding:10px 0; border-bottom:1px solid #1e2d47; }
        .notice-row:last-child { border-bottom:none; }

        /* ── Quick action btn ── */
        .qa-btn {
          background:rgba(6,182,212,0.05); border:1px solid rgba(6,182,212,0.12);
          border-radius:10px; padding:14px 10px; cursor:pointer;
          text-align:center; transition:all .2s; font-family:inherit;
        }
        .qa-btn:hover {
          background:rgba(6,182,212,0.12); border-color:rgba(6,182,212,0.4);
          transform:translateY(-2px); box-shadow:0 6px 18px rgba(6,182,212,0.1);
        }

        /* ── Modal overlay ── */
        .modal-bg {
          position:fixed; inset:0; background:rgba(0,0,0,0.7);
          backdrop-filter:blur(4px); z-index:500;
          display:flex; align-items:center; justify-content:center; padding:16px;
          animation:fadeUp .2s ease;
        }
        .modal-card {
          background:#0d1526; border:1px solid #1e2d47; border-radius:18px;
          padding:32px; width:100%; max-width:400px; position:relative;
        }

        /* ── Mobile overlay ── */
        .mob-overlay { display:none; position:fixed; inset:0; background:rgba(0,0,0,0.6); z-index:250; backdrop-filter:blur(2px); }

        /* ── Blink dot ── */
        .blink-dot { animation:blink 1.5s ease-in-out infinite; }

        /* ── Grids ── */
        .stats-grid  { display:grid; grid-template-columns:repeat(4,1fr); gap:14px; }
        .two-col     { display:grid; grid-template-columns:1fr 1fr;        gap:18px; }
        .three-col   { display:grid; grid-template-columns:1.4fr 1fr 1fr;  gap:18px; }

        /* ── Responsive ── */
        @media(max-width:1200px) {
          .three-col { grid-template-columns:1fr 1fr; }
          .stats-grid { grid-template-columns:repeat(2,1fr); }
        }
        @media(max-width:900px) {
          .three-col { grid-template-columns:1fr; }
          .two-col   { grid-template-columns:1fr; }
        }
        @media(max-width:768px) {
          .sidebar   { transform:translateX(-100%); }
          .sidebar.open { transform:translateX(0); }
          .mob-overlay.open { display:block; }
          .top-nav   { left:0; padding:0 16px; }
          .page-main { margin-left:0; padding:16px; }
          .nav-search-wrap { display:none; }
          .mob-burger { display:grid !important; }
        }
        @media(max-width:480px) {
          .stats-grid { grid-template-columns:1fr 1fr; }
        }
        @media(max-width:360px) {
          .stats-grid { grid-template-columns:1fr; }
        }

        .table-scroll { overflow-x:auto; }
        .table-scroll table { min-width:500px; }
      `}</style>

      {/* Mobile overlay */}
      <div className={`mob-overlay${mobileOpen ? " open" : ""}`} onClick={() => setMobileOpen(false)} />

      {/* ══════════════════════════════════════
          PAYMENT MODAL
      ══════════════════════════════════════ */}
      {payModal && (
        <div className="modal-bg" onClick={() => setPayModal(false)}>
          <div className="modal-card" onClick={e => e.stopPropagation()}>
            {/* Close */}
            <button onClick={() => setPayModal(false)} style={{ position:"absolute", top:16, right:16, background:"none", border:"1px solid #1e2d47", borderRadius:8, width:30, height:30, display:"grid", placeItems:"center", cursor:"pointer", color:"#94a3b8", fontSize:14, fontFamily:"inherit" }}>✕</button>

            <div style={{ fontSize:20, fontWeight:800, color:"#e2e8f0", letterSpacing:"-0.02em", marginBottom:4 }}>Pay Rent</div>
            <div style={{ fontSize:13, color:"#4a6080", marginBottom:24 }}>March 2026 · Due Mar 5</div>

            {/* Amount box */}
            <div style={{ background:"rgba(6,182,212,0.06)", border:"1px solid rgba(6,182,212,0.15)", borderRadius:12, padding:"16px 18px", marginBottom:20, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <div>
                <div style={{ fontSize:11, color:"#4a6080" }}>Amount Due</div>
                <div style={{ fontSize:28, fontWeight:800, color:"#06b6d4", letterSpacing:"-0.02em" }}>₹18,000</div>
              </div>
              <div style={{ fontSize:28 }}>💳</div>
            </div>

            {/* Payment methods */}
            <div style={{ fontSize:12, fontWeight:600, color:"#94a3b8", textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:10 }}>Select Method</div>
            <div style={{ display:"flex", flexDirection:"column", gap:8, marginBottom:22 }}>
              {[
                { ico:"🏦", label:"UPI / Bank Transfer" },
                { ico:"💳", label:"Debit / Credit Card"  },
                { ico:"📱", label:"Paytm / PhonePe"      },
              ].map((m, i) => (
                <div key={i} style={{ display:"flex", alignItems:"center", gap:12, padding:"11px 14px", borderRadius:10, border:"1px solid #1e2d47", background:"rgba(255,255,255,0.02)", cursor:"pointer", transition:"border-color .15s" }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = "rgba(6,182,212,0.45)")}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = "#1e2d47")}
                >
                  <span style={{ fontSize:18 }}>{m.ico}</span>
                  <span style={{ fontSize:13, fontWeight:500, color:"#e2e8f0" }}>{m.label}</span>
                  <span style={{ marginLeft:"auto", fontSize:12, color:"#4a6080" }}>›</span>
                </div>
              ))}
            </div>

            <button className="pay-btn" style={{ width:"100%" }}>
              Confirm Payment →
            </button>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════
          SIDEBAR
      ══════════════════════════════════════ */}
      <aside className={`sidebar${mobileOpen ? " open" : ""}`}>
        {/* Brand */}
        <div style={{ height:62, display:"flex", alignItems:"center", gap:12, padding:"0 20px", borderBottom:"1px solid #1e2d47", flexShrink:0 }}>
          <div style={{ position:"relative", width:34, height:34, borderRadius:9, background:"linear-gradient(135deg,#06b6d4,#8b5cf6)", display:"grid", placeItems:"center", fontSize:16, flexShrink:0, boxShadow:"0 0 16px rgba(6,182,212,0.3)" }}>
            🏠
            <div style={{ position:"absolute", inset:-3, borderRadius:12, border:"1.5px solid rgba(6,182,212,0.35)", animation:"pulse-ring 2s ease-out infinite", pointerEvents:"none" }} />
          </div>
          <div>
            <div style={{ fontSize:15, fontWeight:700, color:"#e2e8f0", letterSpacing:"-0.02em" }}>RentManager</div>
            <div style={{ fontSize:9, color:"#4a6080", textTransform:"uppercase", letterSpacing:"0.1em" }}>Tenant Portal</div>
          </div>
        </div>

        {/* Tenant identity card */}
        <div style={{ margin:"14px 12px", background:"rgba(6,182,212,0.06)", border:"1px solid rgba(6,182,212,0.15)", borderRadius:12, padding:"14px" }}>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <div style={{ width:38, height:38, borderRadius:"50%", background:"linear-gradient(135deg,#06b6d4,#8b5cf6)", display:"grid", placeItems:"center", color:"white", fontSize:14, fontWeight:700, flexShrink:0, boxShadow:"0 0 12px rgba(6,182,212,0.3)" }}>
              {TENANT.initials}
            </div>
            <div style={{ overflow:"hidden" }}>
              <div style={{ fontSize:13, fontWeight:700, color:"#e2e8f0", whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{TENANT.name}</div>
              <div style={{ fontSize:11, color:"#06b6d4" }}>{TENANT.unit} · {TENANT.property}</div>
<div style={{ fontSize:10, color:"#4a6080", marginTop:3 }}>{TENANT.address}</div>
            </div>
          </div>
          <div style={{ marginTop:10, display:"flex", gap:6 }}>
            <div style={{ flex:1, background:"rgba(255,255,255,0.04)", borderRadius:8, padding:"6px 8px", textAlign:"center" }}>
              <div style={{ fontSize:11, color:"#4a6080" }}>Floor</div>
              <div style={{ fontSize:12, fontWeight:700, color:"#e2e8f0" }}>{TENANT.floor}</div>
            </div>
            <div style={{ flex:1, background:"rgba(255,255,255,0.04)", borderRadius:8, padding:"6px 8px", textAlign:"center" }}>
              <div style={{ fontSize:11, color:"#4a6080" }}>Type</div>
              <div style={{ fontSize:12, fontWeight:700, color:"#e2e8f0" }}>{TENANT.type}</div>
            </div>
            <div style={{ flex:1, background:"rgba(255,255,255,0.04)", borderRadius:8, padding:"6px 8px", textAlign:"center" }}>
              <div style={{ fontSize:11, color:"#4a6080" }}>Since</div>
              <div style={{ fontSize:12, fontWeight:700, color:"#e2e8f0" }}>{TENANT.since}</div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex:1, padding:"4px 12px", overflowY:"auto" }}>
          <div style={{ fontSize:9, fontWeight:700, color:"#4a6080", textTransform:"uppercase", letterSpacing:"0.14em", padding:"0 8px", margin:"6px 0" }}>Menu</div>
          {NAV_ITEMS.map(item => (
            <Link key={item.href} href={item.href} className={`sb-link${item.active ? " active" : ""}`} onClick={() => setMobileOpen(false)}>
              <span style={{ fontSize:15, width:18, textAlign:"center", flexShrink:0 }}>{item.icon}</span>
              <span style={{ flex:1 }}>{item.label}</span>
              {item.badge && (
                <span style={{ fontSize:10, fontWeight:700, padding:"2px 7px", borderRadius:10, background:"rgba(244,63,94,0.15)", color:"#f43f5e" }}>
                  {item.badge}
                </span>
              )}
            </Link>
          ))}
        </nav>

        {/* Logout */}
        <div style={{ padding:"13px 12px", borderTop:"1px solid #1e2d47", flexShrink:0 }}>
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

      {/* ══════════════════════════════════════
          NAVBAR
      ══════════════════════════════════════ */}
      <header className="top-nav">
        <div style={{ display:"flex", alignItems:"center", gap:14 }}>
          <button className="mob-burger" onClick={() => setMobileOpen(true)}
            style={{ display:"none", background:"none", border:"1px solid #1e2d47", borderRadius:7, padding:"6px 9px", cursor:"pointer", color:"#94a3b8", fontSize:16, fontFamily:"inherit" }}>
            ☰
          </button>
          <div>
            <div style={{ fontSize:15, fontWeight:700, color:"#e2e8f0" }}>My Dashboard</div>
            <div style={{ fontSize:11, color:"#4a6080" }}>{TENANT.unit} · {TENANT.property}</div>
          </div>
        </div>

        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          {/* Rent due urgent pill */}
          <div style={{ display:"flex", alignItems:"center", gap:6, background:"rgba(245,158,11,0.1)", border:"1px solid rgba(245,158,11,0.25)", borderRadius:20, padding:"5px 12px" }}>
            <div className="blink-dot" style={{ width:6, height:6, borderRadius:"50%", background:"#f59e0b" }} />
            <span style={{ fontSize:11, fontWeight:600, color:"#f59e0b" }}>Rent due Mar 5</span>
          </div>

          <div className="nav-search-wrap" style={{ display:"flex", alignItems:"center", gap:8, background:"#111d33", border:"1px solid #1e2d47", borderRadius:8, padding:"7px 12px", width:200 }}>
            <span style={{ color:"#4a6080", fontSize:13, flexShrink:0 }}>🔍</span>
            <input type="text" placeholder="Search…" style={{ background:"none", border:"none", outline:"none", fontSize:13, color:"#e2e8f0", fontFamily:"inherit", width:"100%" }} />
          </div>

          {/* Notification bell */}
          <div className="nav-ico">🔔<div style={{position:"absolute",top:5,right:5,width:7,height:7,borderRadius:"50%",background:"#f43f5e",border:"2px solid #0d1526"}}/></div>

          {/* Avatar */}
        <Link href="/tenant/settings" style={{width:36,height:36,borderRadius:8,background:"linear-gradient(135deg,#06b6d4,#8b5cf6)",display:"grid",placeItems:"center",color:"white",fontSize:12,fontWeight:700,border:"1.5px solid rgba(6,182,212,0.3)",textDecoration:"none",flexShrink:0}}>RK</Link>
        </div>
      </header>

      {/* ══════════════════════════════════════
          MAIN CONTENT
      ══════════════════════════════════════ */}
      <main className="page-main">

        {/* ── Welcome + Pay Rent CTA ─────────────────────────────────────── */}
        <div className="a1" style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", flexWrap:"wrap", gap:14, marginBottom:20 }}>
          <div>
            <div style={{ fontSize:"clamp(18px,2.5vw,24px)", fontWeight:800, color:"#e2e8f0", letterSpacing:"-0.02em" }}>
              Good morning, {TENANT.name.split(" ")[0]} 👋
            </div>
            
          </div>
          <button className="pay-btn" onClick={() => setPayModal(true)}>
            💳 Pay Rent — ₹18,000
          </button>
        </div>

        {/* ── STAT CARDS ─────────────────────────────────────────────────── */}
        <div className="stats-grid a2" style={{ marginBottom:18 }}>
          {STATS.map((s, i) => (
            <div key={i} className={`stat-card${s.urgent ? " urgent" : ""}`}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
                <div style={{ width:38, height:38, borderRadius:10, background:s.bg, display:"grid", placeItems:"center", fontSize:18 }}>{s.icon}</div>
                {s.urgent && <div className="blink-dot" style={{ width:8, height:8, borderRadius:"50%", background:s.color }} />}
              </div>
              <div style={{ fontSize:"clamp(18px,2vw,26px)", fontWeight:800, color:"#e2e8f0", letterSpacing:"-0.02em", lineHeight:1 }}>{s.value}</div>
              <div style={{ fontSize:12, color:s.color, fontWeight:600, marginTop:4 }}>{s.label}</div>
              <div style={{ fontSize:11, color:"#4a6080", marginTop:2 }}>{s.sub}</div>
            </div>
          ))}
        </div>

        {/* ── RENT OVERVIEW + PAYMENT HISTORY ───────────────────────────── */}
        <div className="two-col a3" style={{ marginBottom:18 }}>

          {/* Rent Overview card */}
          <div className="glass-card">
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:18 }}>
              <div style={{ fontSize:14, fontWeight:700, color:"#e2e8f0" }}>Rent Overview</div>
              <div style={{ fontSize:12, color:"#06b6d4", fontWeight:600 }}>Mar 2026</div>
            </div>

            {/* Big rent amount */}
            <div style={{ display:"flex", alignItems:"flex-end", justifyContent:"space-between", marginBottom:18, flexWrap:"wrap", gap:10 }}>
              <div>
                <div style={{ fontSize:11, color:"#4a6080", marginBottom:4 }}>Monthly Rent</div>
                <div style={{ fontSize:38, fontWeight:800, color:"#e2e8f0", letterSpacing:"-0.03em", lineHeight:1 }}>₹18,000</div>
                <div style={{ fontSize:12, color:"#f59e0b", marginTop:5, display:"flex", alignItems:"center", gap:5 }}>
                  <div className="blink-dot" style={{ width:6, height:6, borderRadius:"50%", background:"#f59e0b", display:"inline-block" }} />
                  Due on March 5, 2026
                </div>
              </div>
              <button className="pay-btn" onClick={() => setPayModal(true)} style={{ fontSize:12, padding:"10px 18px" }}>
                Pay Now →
              </button>
            </div>

            {/* Payment streak */}
            <div style={{ marginBottom:16 }}>
              <div style={{ fontSize:12, color:"#4a6080", marginBottom:8 }}>Last 6 Months</div>
              <div style={{ display:"flex", gap:6 }}>
                {MONTHLY_RENT.map((m, i) => (
                  <div key={i} style={{ flex:1, textAlign:"center" }}>
                    <div style={{ height:28, borderRadius:6, background: m.paid ? "rgba(34,197,94,0.2)" : "rgba(244,63,94,0.15)", border:`1px solid ${m.paid ? "rgba(34,197,94,0.3)" : "rgba(244,63,94,0.3)"}`, display:"grid", placeItems:"center", fontSize:12 }}>
                      {m.paid ? "✓" : "✗"}
                    </div>
                    <div style={{ fontSize:10, color:"#4a6080", marginTop:4 }}>{m.month}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Lease info */}
            <div style={{ display:"flex", gap:8 }}>
              {[
                { label:"Lease Start", val:"Jan 2024",  color:"#06b6d4" },
                { label:"Lease End",   val:"Dec 2026",  color:"#8b5cf6" },
                { label:"Deposit",     val:"₹36,000",   color:"#22c55e" },
              ].map(r => (
                <div key={r.label} style={{ flex:1, background:"rgba(255,255,255,0.03)", border:"1px solid #1e2d47", borderRadius:10, padding:"10px 8px", textAlign:"center" }}>
                  <div style={{ fontSize:10, color:"#4a6080" }}>{r.label}</div>
                  <div style={{ fontSize:13, fontWeight:700, color:r.color, marginTop:3 }}>{r.val}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Payment History */}
          <div className="glass-card">
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
              <div style={{ fontSize:14, fontWeight:700, color:"#e2e8f0" }}>Payment History</div>
              <Link href="/tenant/payments" style={{ fontSize:12, color:"#06b6d4", fontWeight:600, textDecoration:"none" }}>View all →</Link>
            </div>
            <div className="table-scroll">
              <table style={{ width:"100%", borderCollapse:"collapse" }}>
                <thead>
                  <tr>
                    {["Month","Amount","Status","Receipt"].map(h => (
                      <th key={h} style={{ fontSize:10, fontWeight:700, color:"#4a6080", textTransform:"uppercase", letterSpacing:"0.1em", padding:"0 0 10px", textAlign:"left", borderBottom:"1px solid #1e2d47" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {PAYMENT_HISTORY.map((p, i) => (
                    <tr key={i} className="trow" style={{ borderBottom: i < PAYMENT_HISTORY.length - 1 ? "1px solid rgba(30,45,71,0.5)" : "none" }}>
                      <td style={{ padding:"10px 0", fontSize:13, color:"#e2e8f0", fontWeight:500 }}>{p.month}</td>
                      <td style={{ padding:"10px 0", fontSize:13, fontWeight:700, color:"#e2e8f0" }}>{p.amount}</td>
                      <td style={{ padding:"10px 0" }}><Pill {...PAY_MAP[p.status]} /></td>
                      <td style={{ padding:"10px 0", fontSize:12, color: p.receipt ? "#06b6d4" : "#4a6080" }}>
                        {p.receipt || "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* ── MAINTENANCE + NOTICES + ACTIVITY ─────────────────────────── */}
        <div className="three-col a5" style={{ marginBottom:18 }}>

          {/* Maintenance Requests */}
          <div className="glass-card">
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
              <div style={{ fontSize:14, fontWeight:700, color:"#e2e8f0" }}>My Requests</div>
              <Link href="/tenant/maintenance" style={{ fontSize:12, color:"#06b6d4", fontWeight:600, textDecoration:"none" }}>+ New</Link>
            </div>
            {MAINTENANCE.map((m, i) => (
              <div key={i} className="maint-row">
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:6 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                    <div style={{ width:4, height:20, borderRadius:2, background:PRI_MAP[m.priority].color, flexShrink:0 }} />
                    <div>
                      <div style={{ fontSize:13, fontWeight:600, color:"#e2e8f0", lineHeight:1.3 }}>{m.title}</div>
                      <div style={{ fontSize:11, color:"#4a6080" }}>{m.category} · {m.id}</div>
                    </div>
                  </div>
                  <Pill {...REQ_MAP[m.status]} />
                </div>
                <div style={{ fontSize:11, color:"#4a6080", paddingLeft:12 }}>
                  📅 {m.date} &nbsp;·&nbsp; {m.note}
                </div>
              </div>
            ))}

            {/* New request button */}
            <button style={{ marginTop:10, width:"100%", padding:"10px", fontSize:13, fontWeight:600, color:"#06b6d4", background:"rgba(6,182,212,0.06)", border:"1px dashed rgba(6,182,212,0.25)", borderRadius:10, cursor:"pointer", fontFamily:"inherit", transition:"all .2s" }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(6,182,212,0.12)"; (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(6,182,212,0.5)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(6,182,212,0.06)"; (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(6,182,212,0.25)"; }}
            >
              + Raise New Request
            </button>
          </div>

          

          {/* Recent Activity */}
          <div className="glass-card">
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
              <div style={{ fontSize:14, fontWeight:700, color:"#e2e8f0" }}>Activity</div>
              <div style={{ fontSize:12, color:"#4a6080" }}>Recent</div>
            </div>
            {ACTIVITIES.map((a, i) => (
              <div key={i} style={{ display:"flex", gap:10, padding:"9px 0", borderBottom: i < ACTIVITIES.length - 1 ? "1px solid #1e2d47" : "none" }}>
                <div style={{ display:"flex", flexDirection:"column", alignItems:"center" }}>
                  <div style={{ width:7, height:7, borderRadius:"50%", background:a.dot, flexShrink:0, marginTop:4 }} />
                  {i < ACTIVITIES.length - 1 && <div style={{ width:1, flex:1, background:"#1e2d47", marginTop:3 }} />}
                </div>
                <div style={{ paddingBottom: i < ACTIVITIES.length - 1 ? 6 : 0 }}>
                  <div style={{ fontSize:12, color:"#e2e8f0", lineHeight:1.4 }}>{a.text}</div>
                  <div style={{ fontSize:10, color:"#4a6080", marginTop:2 }}>{a.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── QUICK ACTIONS ──────────────────────────────────────────────── */}
        <div className="glass-card a8">
          <div style={{ fontSize:14, fontWeight:700, color:"#e2e8f0", marginBottom:14 }}>Quick Actions</div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(120px, 1fr))", gap:10 }}>
            {[
              { ico:"💳", lbl:"Pay Rent",       action: () => setPayModal(true), href:null },
              { ico:"🔧", lbl:"New Request",     action: null, href:"/tenant/maintenance" },
              { ico:"📋", lbl:"View Lease",      action: null, href:"/tenant/lease"       },
              { ico:"💬", lbl:"Message Owner",   action: null, href:"/tenant/messages"    },
              { ico:"📞", lbl:"Emergency",       action: null, href:"/tenant/emergency"   },
            ].map((q, i) =>
              q.href ? (
                <Link key={i} href={q.href} style={{ textDecoration:"none" }}>
                  <div className="qa-btn">
                    <div style={{ fontSize:22, marginBottom:5 }}>{q.ico}</div>
                    <div style={{ fontSize:11, fontWeight:600, color:"#94a3b8" }}>{q.lbl}</div>
                  </div>
                </Link>
              ) : (
                <button key={i} className="qa-btn" onClick={q.action ?? undefined}>
                  <div style={{ fontSize:22, marginBottom:5 }}>{q.ico}</div>
                  <div style={{ fontSize:11, fontWeight:600, color:"#94a3b8" }}>{q.lbl}</div>
                </button>
              )
            )}
          </div>
        </div>

      </main>
    </>
  );
}