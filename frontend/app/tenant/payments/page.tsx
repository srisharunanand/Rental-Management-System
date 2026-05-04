"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { paymentAPI } from "@/app/services/api";

const NAV_ITEMS = [
  { icon:"⚡", label:"Dashboard",   href:"/tenant/dashboard",   active:false },
  { icon:"💳", label:"Payments",    href:"/tenant/payments",    active:true  },
  { icon:"🔧", label:"Maintenance", href:"/tenant/complaints", active:false },
  { icon:"📋", label:"My Lease",    href:"/tenant/lease",       active:false },
  { icon:"💬", label:"Messages",    href:"/tenant/messages",    active:false },
  { icon:"⚙️", label:"Settings",   href:"/tenant/settings",    active:false },
];

const TENANT = { name:"Rahul Krishnan", initials:"RK", unit:"Unit 4B", property:"Greenview Apartments", address:"12, Anna Nagar, Chennai – 600 040", floor:"2nd Floor", type:"2 BHK", since:"Jan 2024" };

type PayStatus = "paid"|"pending"|"overdue";

const HISTORY: {id:string;month:string;amount:string;date:string;status:PayStatus;method:string;receipt:string}[] = [
  { id:"PAY-007", month:"Mar 2026", amount:"₹18,000", date:"Due Mar 5",  status:"pending", method:"—",    receipt:"" },
  { id:"PAY-006", month:"Feb 2026", amount:"₹18,000", date:"Feb 1",      status:"paid",    method:"UPI",  receipt:"RCP-0224" },
  { id:"PAY-005", month:"Jan 2026", amount:"₹18,000", date:"Jan 1",      status:"paid",    method:"Bank", receipt:"RCP-0124" },
  { id:"PAY-004", month:"Dec 2025", amount:"₹18,000", date:"Dec 2",      status:"paid",    method:"UPI",  receipt:"RCP-1225" },
  { id:"PAY-003", month:"Nov 2025", amount:"₹18,000", date:"Nov 18",     status:"overdue", method:"—",    receipt:"" },
  { id:"PAY-002", month:"Oct 2025", amount:"₹18,000", date:"Oct 1",      status:"paid",    method:"UPI",  receipt:"RCP-1025" },
  { id:"PAY-001", month:"Sep 2025", amount:"₹18,000", date:"Sep 2",      status:"paid",    method:"Bank", receipt:"RCP-0925" },
];

const PAY_MAP: Record<PayStatus,{bg:string;color:string;label:string}> = {
  paid:    {bg:"rgba(34,197,94,0.1)",  color:"#22c55e", label:"✓ Paid"},
  pending: {bg:"rgba(245,158,11,0.1)", color:"#f59e0b", label:"⏳ Pending"},
  overdue: {bg:"rgba(244,63,94,0.1)",  color:"#f43f5e", label:"✗ Overdue"},
};

export default function TenantPaymentsPage() {
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [payModal,   setPayModal]   = useState(false);
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string|null>(null);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        setLoading(true);
        const response = await paymentAPI.getAll();
        setPayments(response.data || []);
        setError(null);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch payments');
        setPayments([]);
      } finally {
        setLoading(false);
      }
    };
    fetchPayments();
  }, []);

  const paidCount   = payments.filter((p: any) => p.status === 'paid').length;
  const onTimeRate  = Math.round((paidCount / Math.max(payments.length, 1)) * 100);

  return(
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        html,body{height:100%;font-family:'Plus Jakarta Sans',sans-serif;background:#080e1a;color:#e2e8f0}
        ::-webkit-scrollbar{width:4px;height:4px}::-webkit-scrollbar-thumb{background:#1e2d47;border-radius:4px}
        @keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
        @keyframes pulse-ring{0%{transform:scale(1);opacity:.5}100%{transform:scale(1.6);opacity:0}}
        @keyframes shimmer{0%{background-position:-200% center}100%{background-position:200% center}}
        @keyframes blink{0%,100%{opacity:1}50%{opacity:.3}}
        .a1{animation:fadeUp .4s ease both .05s}.a2{animation:fadeUp .4s ease both .10s}
        .a3{animation:fadeUp .4s ease both .15s}.a4{animation:fadeUp .4s ease both .20s}
        .sb-link{display:flex;align-items:center;gap:10px;padding:9px 10px;border-radius:8px;font-size:13px;font-weight:500;color:#94a3b8;cursor:pointer;transition:all .15s;text-decoration:none;margin-bottom:2px;border:1px solid transparent}
        .sb-link:hover{background:rgba(255,255,255,0.04);color:#e2e8f0}
        .sb-link.active{background:rgba(6,182,212,0.1);color:#06b6d4;border-color:rgba(6,182,212,0.15)}
        .sidebar{position:fixed;top:0;left:0;bottom:0;width:250px;background:#0d1526;border-right:1px solid #1e2d47;display:flex;flex-direction:column;z-index:300;transition:transform .3s ease}
        .navbar{position:fixed;top:0;left:250px;right:0;height:62px;background:#0d1526;border-bottom:1px solid #1e2d47;display:flex;align-items:center;justify-content:space-between;padding:0 24px;z-index:200}
        .page-main{margin-left:250px;margin-top:62px;padding:26px;min-height:calc(100vh - 62px)}
        .glass-card{background:#111d33;border:1px solid #1e2d47;border-radius:14px;padding:20px;position:relative;overflow:hidden}
        .glass-card::after{content:'';position:absolute;bottom:0;left:20%;right:20%;height:1px;background:linear-gradient(90deg,transparent,rgba(6,182,212,0.25),transparent)}
        .pay-btn{background:linear-gradient(90deg,#2563eb 0%,#06b6d4 40%,#2563eb 60%,#1d4ed8 100%);background-size:200% auto;animation:shimmer 2.5s linear infinite;border:none;border-radius:10px;padding:12px 22px;font-family:'Plus Jakarta Sans',sans-serif;font-size:13px;font-weight:700;color:white;cursor:pointer;transition:transform .15s,box-shadow .15s;white-space:nowrap}
        .pay-btn:hover{transform:translateY(-1px);box-shadow:0 8px 24px rgba(6,182,212,0.35)}
        .hist-row{display:grid;grid-template-columns:1.2fr 1fr 1fr 1fr 1fr auto;align-items:center;gap:12px;padding:13px 16px;border-radius:10px;border:1px solid #1e2d47;background:#0d1526;margin-bottom:8px;transition:border-color .15s}
        .hist-row:hover{border-color:rgba(6,182,212,0.3)}
        .hist-row:last-child{margin-bottom:0}
        .hist-header{display:grid;grid-template-columns:1.2fr 1fr 1fr 1fr 1fr auto;gap:12px;padding:0 16px 10px;font-size:10px;font-weight:700;color:#4a6080;text-transform:uppercase;letter-spacing:.1em}
        .mob-overlay{display:none;position:fixed;inset:0;background:rgba(0,0,0,0.6);z-index:250;backdrop-filter:blur(2px)}
        .nav-ico{width:36px;height:36px;border-radius:8px;background:#111d33;border:1px solid #1e2d47;display:grid;place-items:center;cursor:pointer;font-size:15px;position:relative;transition:border-color .2s;flex-shrink:0}
        .nav-ico:hover{border-color:#06b6d4}
        .modal-bg{position:fixed;inset:0;background:rgba(0,0,0,0.7);backdrop-filter:blur(4px);z-index:500;display:flex;align-items:center;justify-content:center;padding:16px}
        .modal-card{background:#0d1526;border:1px solid #1e2d47;border-radius:18px;padding:32px;width:100%;max-width:400px;position:relative}
        .blink{animation:blink 1.5s ease-in-out infinite}
        .main-grid{display:grid;grid-template-columns:1fr 300px;gap:18px}
        .table-wrap{overflow-x:auto}
        .hist-row,.hist-header{min-width:560px}
        @media(max-width:1100px){.main-grid{grid-template-columns:1fr}}
        @media(max-width:768px){
          .sidebar{transform:translateX(-100%)}.sidebar.open{transform:translateX(0)}
          .mob-overlay.open{display:block}
          .navbar{left:0;padding:0 16px}.page-main{margin-left:0;padding:16px}
          .mob-burger{display:grid !important}.nav-search-wrap{display:none}
        }
      `}</style>

      <div className={`mob-overlay${mobileOpen?" open":""}`} onClick={()=>setMobileOpen(false)}/>

      {/* Pay Modal */}
      {payModal&&(
        <div className="modal-bg" onClick={()=>setPayModal(false)}>
          <div className="modal-card" onClick={e=>e.stopPropagation()}>
            <button onClick={()=>setPayModal(false)} style={{position:"absolute",top:16,right:16,background:"none",border:"1px solid #1e2d47",borderRadius:8,width:30,height:30,display:"grid",placeItems:"center",cursor:"pointer",color:"#94a3b8",fontSize:14,fontFamily:"inherit"}}>✕</button>
            <div style={{fontSize:20,fontWeight:800,color:"#e2e8f0",marginBottom:4}}>Pay Rent</div>
            <div style={{fontSize:13,color:"#4a6080",marginBottom:22}}>March 2026 · Due Mar 5</div>
            <div style={{background:"rgba(6,182,212,0.06)",border:"1px solid rgba(6,182,212,0.15)",borderRadius:12,padding:"16px 18px",marginBottom:20,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div>
                <div style={{fontSize:11,color:"#4a6080"}}>Amount Due</div>
                <div style={{fontSize:28,fontWeight:800,color:"#06b6d4",letterSpacing:"-0.02em"}}>₹18,000</div>
              </div>
              <div style={{fontSize:28}}>💳</div>
            </div>
            <div style={{fontSize:12,fontWeight:600,color:"#94a3b8",textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:10}}>Select Method</div>
            <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:22}}>
              {[{ico:"🏦",label:"UPI / Bank Transfer"},{ico:"💳",label:"Debit / Credit Card"},{ico:"📱",label:"Paytm / PhonePe"}].map((m,i)=>(
                <div key={i} style={{display:"flex",alignItems:"center",gap:12,padding:"11px 14px",borderRadius:10,border:"1px solid #1e2d47",background:"rgba(255,255,255,0.02)",cursor:"pointer",transition:"border-color .15s"}}
                  onMouseEnter={e=>(e.currentTarget as HTMLDivElement).style.borderColor="rgba(6,182,212,0.45)"}
                  onMouseLeave={e=>(e.currentTarget as HTMLDivElement).style.borderColor="#1e2d47"}>
                  <span style={{fontSize:18}}>{m.ico}</span>
                  <span style={{fontSize:13,fontWeight:500,color:"#e2e8f0",flex:1}}>{m.label}</span>
                  <span style={{fontSize:12,color:"#4a6080"}}>›</span>
                </div>
              ))}
            </div>
            <button className="pay-btn" style={{width:"100%"}}>Confirm Payment →</button>
          </div>
        </div>
      )}

      {/* Sidebar */}
      <aside className={`sidebar${mobileOpen?" open":""}`}>
        <div style={{height:62,display:"flex",alignItems:"center",gap:12,padding:"0 20px",borderBottom:"1px solid #1e2d47",flexShrink:0}}>
          <div style={{position:"relative",width:34,height:34,borderRadius:9,background:"linear-gradient(135deg,#06b6d4,#8b5cf6)",display:"grid",placeItems:"center",fontSize:16,flexShrink:0,boxShadow:"0 0 16px rgba(6,182,212,0.3)"}}>
            🏠<div style={{position:"absolute",inset:-3,borderRadius:12,border:"1.5px solid rgba(6,182,212,0.35)",animation:"pulse-ring 2s ease-out infinite",pointerEvents:"none"}}/>
          </div>
          <div>
            <div style={{fontSize:15,fontWeight:700,color:"#e2e8f0",letterSpacing:"-0.02em"}}>RentManager</div>
            <div style={{fontSize:9,color:"#4a6080",textTransform:"uppercase",letterSpacing:"0.1em"}}>Tenant Portal</div>
          </div>
        </div>
        {/* Identity card */}
        <div style={{margin:"14px 12px",background:"rgba(6,182,212,0.06)",border:"1px solid rgba(6,182,212,0.15)",borderRadius:12,padding:"14px"}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <div style={{width:38,height:38,borderRadius:"50%",background:"linear-gradient(135deg,#06b6d4,#8b5cf6)",display:"grid",placeItems:"center",color:"white",fontSize:14,fontWeight:700,flexShrink:0}}>{TENANT.initials}</div>
            <div>
              <div style={{fontSize:13,fontWeight:700,color:"#e2e8f0"}}>{TENANT.name}</div>
              <div style={{fontSize:11,color:"#06b6d4"}}>{TENANT.unit} · {TENANT.property.split(" ")[0]}</div>
              <div style={{fontSize:10,color:"#4a6080",marginTop:2}}>{TENANT.address}</div>
            </div>
          </div>
        </div>
        <nav style={{flex:1,padding:"4px 12px",overflowY:"auto"}}>
          {NAV_ITEMS.map(item=>(
            <Link key={item.href} href={item.href} className={`sb-link${item.active?" active":""}`} onClick={()=>setMobileOpen(false)}>
              <span style={{fontSize:15,width:18,textAlign:"center",flexShrink:0}}>{item.icon}</span>
              <span style={{flex:1}}>{item.label}</span>
            </Link>
          ))}
        </nav>
        <div style={{padding:"13px 12px",borderTop:"1px solid #1e2d47",flexShrink:0}}>
          <button onClick={()=>{localStorage.removeItem("rentmanager_user");document.cookie="role=; path=/; max-age=0";router.push("/login");}}
            style={{display:"flex",alignItems:"center",gap:10,padding:9,borderRadius:9,cursor:"pointer",background:"transparent",border:"1px solid transparent",color:"#f43f5e",fontSize:13,fontWeight:500,fontFamily:"inherit",width:"100%",transition:"all .15s"}}
            onMouseEnter={e=>{(e.currentTarget as HTMLButtonElement).style.background="rgba(244,63,94,0.07)";(e.currentTarget as HTMLButtonElement).style.borderColor="rgba(244,63,94,0.2)"}}
            onMouseLeave={e=>{(e.currentTarget as HTMLButtonElement).style.background="transparent";(e.currentTarget as HTMLButtonElement).style.borderColor="transparent"}}>
            <span style={{fontSize:15,width:18,textAlign:"center"}}>🚪</span><span>Logout</span>
          </button>
        </div>
      </aside>

      <header className="navbar">
        <div style={{display:"flex",alignItems:"center",gap:14}}>
          <button className="mob-burger" onClick={()=>setMobileOpen(true)} style={{display:"none",background:"none",border:"1px solid #1e2d47",borderRadius:7,padding:"6px 8px",cursor:"pointer",color:"#94a3b8",fontSize:16,fontFamily:"inherit"}}>☰</button>
          <div>
            <div style={{fontSize:15,fontWeight:700,color:"#e2e8f0"}}>My Payments</div>
            <div style={{fontSize:11,color:"#4a6080"}}>Home → Payments</div>
          </div>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <div style={{display:"flex",alignItems:"center",gap:6,background:"rgba(245,158,11,0.1)",border:"1px solid rgba(245,158,11,0.25)",borderRadius:20,padding:"5px 12px"}}>
            <div className="blink" style={{width:6,height:6,borderRadius:"50%",background:"#f59e0b"}}/>
            <span style={{fontSize:11,fontWeight:600,color:"#f59e0b"}}>Rent due Mar 5</span>
          </div>
          <Link href="/owner/complaints" className="nav-ico" style={{textDecoration:"none"}}>🔔<div style={{position:"absolute",top:5,right:5,width:7,height:7,borderRadius:"50%",background:"#f43f5e",border:"2px solid #0d1526"}}/></Link>
          <Link href="/tenant/settings" style={{width:36,height:36,borderRadius:8,background:"linear-gradient(135deg,#06b6d4,#8b5cf6)",display:"grid",placeItems:"center",color:"white",fontSize:12,fontWeight:700,border:"1.5px solid rgba(6,182,212,0.3)",textDecoration:"none",flexShrink:0}}>RK</Link>
        </div>
      </header>

      <main className="page-main">

        <div className="a1" style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:14,marginBottom:22}}>
          <div>
            <div style={{fontSize:"clamp(18px,2.5vw,24px)",fontWeight:800,color:"#e2e8f0",letterSpacing:"-0.02em"}}>My Payments</div>
            <div style={{fontSize:13,color:"#94a3b8",marginTop:3}}>{paidCount} of {HISTORY.length} months paid · {onTimeRate}% on-time rate</div>
          </div>
          <button className="pay-btn" onClick={()=>setPayModal(true)}>💳 Pay March Rent →</button>
        </div>

        <div className="main-grid">
          {/* Left: history table */}
          <div className="glass-card a2">
            <div style={{fontSize:14,fontWeight:700,color:"#e2e8f0",marginBottom:16}}>Payment History</div>
            <div className="table-wrap">
              <div className="hist-header">
                <span>Month</span><span>Amount</span><span>Method</span><span>Date</span><span>Status</span><span></span>
              </div>
              {payments.map((p: any) => (
                <div key={p.id} className="hist-row">
                  <div>
                    <div style={{fontSize:13,fontWeight:600,color:"#e2e8f0"}}>{new Date(p.created_at).toLocaleDateString('en-IN', {month:'short', year:'2-digit'})}</div>
                    <div style={{fontSize:11,color:"#4a6080"}}>PAY-{String(p.id).padStart(3,'0')}</div>
                  </div>
                  <div style={{fontSize:13,fontWeight:700,color:"#e2e8f0"}}>₹{p.amount.toLocaleString()}</div>
                  <div style={{fontSize:12,color:"#64748b"}}>{p.payment_method || '—'}</div>
                  <div style={{fontSize:12,color:"#64748b"}}>{new Date(p.due_date).toLocaleDateString('en-IN')}</div>
                  <span style={{display:"inline-flex",alignItems:"center",padding:"3px 9px",borderRadius:20,fontSize:11,fontWeight:600,background:PAY_MAP[p.status as PayStatus].bg,color:PAY_MAP[p.status as PayStatus].color,whiteSpace:"nowrap"}}>{PAY_MAP[p.status as PayStatus].label}</span>
                  <button style={{padding:"5px 9px",background:"rgba(6,182,212,0.08)",border:"1px solid rgba(6,182,212,0.2)",borderRadius:7,color:p.status==="paid"?"#06b6d4":"#4a6080",fontSize:11,fontWeight:600,cursor:p.status==="paid"?"pointer":"default",fontFamily:"inherit",opacity:p.status==="paid"?1:0.4,whiteSpace:"nowrap"}}>
                    {p.status==="paid"?"🧾 Receipt":p.status==="pending"?"💸 Pay":"—"}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Right: summary */}
          <div style={{display:"flex",flexDirection:"column",gap:16}}>
            {/* Next payment due */}
            <div className="glass-card a3">
              <div style={{fontSize:13,fontWeight:700,color:"#e2e8f0",marginBottom:14}}>Next Payment Due</div>
              <div style={{fontSize:36,fontWeight:800,color:"#f59e0b",letterSpacing:"-0.03em",lineHeight:1}}>₹18,000</div>
              <div style={{fontSize:12,color:"#f59e0b",marginTop:6,display:"flex",alignItems:"center",gap:5}}>
                <div className="blink" style={{width:6,height:6,borderRadius:"50%",background:"#f59e0b",display:"inline-block"}}/>
                Due March 5, 2026
              </div>
              <button className="pay-btn" onClick={()=>setPayModal(true)} style={{marginTop:16,width:"100%",padding:"11px"}}>Pay Now →</button>
            </div>

            {/* Stats */}
            <div className="glass-card a3">
              <div style={{fontSize:13,fontWeight:700,color:"#e2e8f0",marginBottom:14}}>Payment Stats</div>
              {[
                {label:"On-Time Rate",  value:`${onTimeRate}%`,        color:"#22c55e"},
                {label:"Total Paid",    value:`₹${(paidCount*18000).toLocaleString()}`, color:"#06b6d4"},
                {label:"Months Active", value:`${HISTORY.length} mo`,  color:"#8b5cf6"},
                {label:"Monthly Rent",  value:"₹18,000",               color:"#e2e8f0"},
              ].map(s=>(
                <div key={s.label} style={{display:"flex",justifyContent:"space-between",padding:"10px 0",borderBottom:"1px solid #1e2d47",fontSize:13}}>
                  <span style={{color:"#4a6080"}}>{s.label}</span>
                  <span style={{fontWeight:700,color:s.color}}>{s.value}</span>
                </div>
              ))}
            </div>

            {/* Streak */}
            <div className="glass-card a4">
              <div style={{fontSize:13,fontWeight:700,color:"#e2e8f0",marginBottom:12}}>Monthly Streak</div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:6}}>
                {HISTORY.slice().reverse().map(h=>(
                  <div key={h.id} style={{textAlign:"center"}}>
                    <div style={{height:28,borderRadius:7,background:h.status==="paid"?"rgba(34,197,94,0.15)":h.status==="pending"?"rgba(245,158,11,0.15)":"rgba(244,63,94,0.12)",border:`1px solid ${h.status==="paid"?"rgba(34,197,94,0.25)":h.status==="pending"?"rgba(245,158,11,0.25)":"rgba(244,63,94,0.25)"}`,display:"grid",placeItems:"center",fontSize:12,color:h.status==="paid"?"#22c55e":h.status==="pending"?"#f59e0b":"#f43f5e"}}>
                      {h.status==="paid"?"✓":h.status==="pending"?"⏳":"✗"}
                    </div>
                    <div style={{fontSize:9,color:"#4a6080",marginTop:4}}>{h.month.split(" ")[0]}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}