"use client";
import { useState,useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { invoiceAPI } from "@/app/services/api";
const NAV_SECTIONS = [
  { label:"Main", items:[
    { icon:"⚡", label:"Dashboard", href:"/owner/dashboard", active:false },
    { icon:"🏠", label:"Houses",   href:"/owner/houses",    active:false },
    { icon:"👥", label:"Tenants",  href:"/owner/tenants",   active:false, badge:"12" },
    { icon:"📋", label:"Leases",   href:"/owner/leases",    active:false },
  ]},
  { label:"Finance", items:[
    { icon:"💳", label:"Payments",  href:"/owner/payments",  active:false, badge:"3" },
    { icon:"📈", label:"Analytics", href:"/owner/analytics", active:false },
    { icon:"🧾", label:"Invoices",  href:"/owner/invoices",  active:true },
  ]},
  { label:"Tools", items:[
    { icon:"🔧", label:"Maintenance", href:"/owner/complaints", active:false, badge:"5" },
    { icon:"💬", label:"Messages",   href:"/owner/messages",   active:false },
    { icon:"⚙️", label:"Settings",  href:"/owner/settings",   active:false },
  ]},
];

type InvStatus = "paid"|"sent"|"overdue"|"draft"|"pending";

// Format invoice for display
const formatInvoice = (invoice: any) => {
  const initials = invoice.tenant?.name?.split(' ').map((n: string) => n[0]).join('') || 'UN';
  const gradients = ['linear-gradient(135deg,#06b6d4,#8b5cf6)', 'linear-gradient(135deg,#f59e0b,#ef4444)', 
    'linear-gradient(135deg,#ef4444,#ec4899)', 'linear-gradient(135deg,#22c55e,#06b6d4)', 
    'linear-gradient(135deg,#8b5cf6,#6366f1)', 'linear-gradient(135deg,#06b6d4,#22c55e)'];
  
  const displayStatus: InvStatus = invoice.status === 'pending' ? 'sent' : (invoice.status as InvStatus) || 'draft';
  
  return {
    id: `INV-${String(invoice.id).padStart(4, '0')}`,
    tenant: invoice.tenant?.name || 'Unknown',
    initials,
    unit: invoice.unit?.unit_number || 'N/A',
    property: invoice.property?.name || 'N/A',
    amount: `₹${invoice.amount?.toLocaleString() || 0}`,
    status: displayStatus,
    date: new Date(invoice.issued_date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }),
    due: new Date(invoice.due_date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }),
    grad: gradients[invoice.id % gradients.length],
    items: [`${new Date(invoice.issued_date).toLocaleDateString('en-IN', { month: 'long' })} Rent — ₹${invoice.amount?.toLocaleString() || 0}`]
  };
};

const STATUS_MAP: Record<InvStatus,{bg:string;color:string;label:string}> = {
  paid:    {bg:"rgba(34,197,94,0.1)",  color:"#22c55e", label:"✓ Paid"},
  sent:    {bg:"rgba(6,182,212,0.1)",  color:"#06b6d4", label:"📤 Sent"},
  overdue: {bg:"rgba(244,63,94,0.1)",  color:"#f43f5e", label:"⚠ Overdue"},
  draft:   {bg:"rgba(100,116,139,0.1)",color:"#64748b", label:"✏ Draft"},
};

export default function InvoicesPage() {
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [invoices, setInvoices] = useState<any[]>([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState<string|null>(null);
  const [filter,     setFilter]     = useState<InvStatus|"all">("all");
  const [selected,   setSelected]   = useState<typeof INVOICES[0]|null>(null);
  const [search,     setSearch]     = useState("");
useEffect(() => {
  const fetchInvoices = async () => {
    try {
      setLoading(true);
      const response = await invoiceAPI.getAll();
      setInvoices(response.data || []);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch invoices');
      setInvoices([]);
    } finally {
      setLoading(false);
    }
  };
  fetchInvoices();
}, []);
  const displayInvoices = invoices.map(formatInvoice);

  const filtered = displayInvoices.filter(i=>
    (filter==="all"||i.status===filter)&&
    (i.tenant.toLowerCase().includes(search.toLowerCase())||i.id.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        html,body{height:100%;font-family:'Plus Jakarta Sans',sans-serif;background:#080e1a;color:#e2e8f0}
        ::-webkit-scrollbar{width:4px;height:4px}::-webkit-scrollbar-thumb{background:#1e2d47;border-radius:4px}
        @keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
        @keyframes pulse-ring{0%{transform:scale(1);opacity:.5}100%{transform:scale(1.6);opacity:0}}
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
        .inv-row{display:grid;grid-template-columns:2fr 1.2fr 1fr 1fr 1fr 1fr auto;align-items:center;gap:12px;padding:13px 16px;border-radius:11px;border:1px solid #1e2d47;background:#0d1526;margin-bottom:8px;transition:border-color .15s;cursor:pointer}
        .inv-row:hover{border-color:rgba(6,182,212,0.35)}
        .inv-row:last-child{margin-bottom:0}
        .inv-header{display:grid;grid-template-columns:2fr 1.2fr 1fr 1fr 1fr 1fr auto;gap:12px;padding:0 16px 10px;font-size:10px;font-weight:700;color:#4a6080;text-transform:uppercase;letter-spacing:.1em}
        .filter-btn{padding:7px 14px;border-radius:8px;font-size:12px;font-weight:600;cursor:pointer;border:1px solid #1e2d47;background:#111d33;color:#94a3b8;transition:all .15s;font-family:inherit}
        .filter-btn.active{background:rgba(6,182,212,0.1);color:#06b6d4;border-color:rgba(6,182,212,0.3)}
        .filter-btn:hover{border-color:#06b6d4;color:#06b6d4}
        .add-btn{background:linear-gradient(135deg,#06b6d4,#8b5cf6);border:none;border-radius:10px;padding:10px 18px;font-size:13px;font-weight:700;color:white;cursor:pointer;font-family:inherit;transition:transform .15s}
        .add-btn:hover{transform:translateY(-1px);box-shadow:0 6px 20px rgba(6,182,212,0.3)}
        .mob-overlay{display:none;position:fixed;inset:0;background:rgba(0,0,0,0.6);z-index:250;backdrop-filter:blur(2px)}
        .nav-ico{width:36px;height:36px;border-radius:8px;background:#111d33;border:1px solid #1e2d47;display:grid;place-items:center;cursor:pointer;font-size:15px;position:relative;transition:border-color .2s;flex-shrink:0}
        .modal-bg{position:fixed;inset:0;background:rgba(0,0,0,0.7);backdrop-filter:blur(4px);z-index:500;display:flex;align-items:center;justify-content:center;padding:16px}
        .modal-card{background:#0d1526;border:1px solid #1e2d47;border-radius:18px;padding:28px;width:100%;max-width:440px;position:relative;max-height:90vh;overflow-y:auto}
        .table-wrap{overflow-x:auto}
        .inv-row,.inv-header{min-width:700px}
        @media(max-width:768px){
          .sidebar{transform:translateX(-100%)}.sidebar.open{transform:translateX(0)}
          .mob-overlay.open{display:block}
          .navbar{left:0;padding:0 16px}.page-main{margin-left:0;padding:16px}
          .mob-burger{display:grid !important}
        }
      `}</style>

      <div className={`mob-overlay${mobileOpen?" open":""}`} onClick={()=>setMobileOpen(false)}/>

      {selected&&(
        <div className="modal-bg" onClick={()=>setSelected(null)}>
          <div className="modal-card" onClick={e=>e.stopPropagation()}>
            <button onClick={()=>setSelected(null)} style={{position:"absolute",top:16,right:16,background:"none",border:"1px solid #1e2d47",borderRadius:8,width:30,height:30,display:"grid",placeItems:"center",cursor:"pointer",color:"#94a3b8",fontSize:14,fontFamily:"inherit"}}>✕</button>
            {/* Invoice preview header */}
            <div style={{background:"linear-gradient(135deg,rgba(6,182,212,0.1),rgba(139,92,246,0.1))",border:"1px solid rgba(6,182,212,0.2)",borderRadius:12,padding:"18px 20px",marginBottom:20}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                <div>
                  <div style={{fontSize:11,color:"#4a6080",textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:4}}>Invoice</div>
                  <div style={{fontSize:20,fontWeight:800,color:"#06b6d4"}}>{selected.id}</div>
                </div>
                <span style={{fontSize:11,fontWeight:600,padding:"4px 10px",borderRadius:20,background:STATUS_MAP[selected.status].bg,color:STATUS_MAP[selected.status].color}}>{STATUS_MAP[selected.status].label}</span>
              </div>
            </div>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:16,fontSize:13}}>
              <div>
                <div style={{fontSize:11,color:"#4a6080",marginBottom:2}}>Bill To</div>
                <div style={{fontWeight:700,color:"#e2e8f0"}}>{selected.tenant}</div>
                <div style={{color:"#4a6080"}}>{selected.unit} · {selected.property}</div>
              </div>
              <div style={{textAlign:"right"}}>
                <div style={{fontSize:11,color:"#4a6080",marginBottom:2}}>Date Issued</div>
                <div style={{fontWeight:600,color:"#e2e8f0"}}>{selected.date}</div>
                <div style={{color:"#f59e0b"}}>Due {selected.due}</div>
              </div>
            </div>
            <div style={{background:"rgba(255,255,255,0.03)",border:"1px solid #1e2d47",borderRadius:10,padding:"14px",marginBottom:16}}>
              <div style={{fontSize:10,fontWeight:700,color:"#4a6080",textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:10}}>Line Items</div>
              {selected.items.map((item,i)=>(
                <div key={i} style={{display:"flex",justifyContent:"space-between",fontSize:13,padding:"8px 0",borderBottom:i<selected.items.length-1?"1px solid rgba(30,45,71,0.6)":"none"}}>
                  <span style={{color:"#94a3b8"}}>{item.split(" — ")[0]}</span>
                  <span style={{fontWeight:600,color:"#e2e8f0"}}>{item.split(" — ")[1]}</span>
                </div>
              ))}
              <div style={{display:"flex",justifyContent:"space-between",padding:"12px 0 0",borderTop:"1px solid #1e2d47",marginTop:8}}>
                <span style={{fontSize:13,fontWeight:700,color:"#e2e8f0"}}>Total</span>
                <span style={{fontSize:16,fontWeight:800,color:"#06b6d4"}}>{selected.amount}</span>
              </div>
            </div>
            <div style={{display:"flex",gap:8}}>
              <button className="add-btn" style={{flex:1,padding:"10px"}}>📥 Download PDF</button>
              <button className="add-btn" style={{flex:1,padding:"10px",background:"linear-gradient(135deg,#22c55e,#16a34a)"}}>📤 Send Again</button>
            </div>
          </div>
        </div>
      )}

      <aside className={`sidebar${mobileOpen?" open":""}`}>
        <div style={{height:62,display:"flex",alignItems:"center",gap:12,padding:"0 20px",borderBottom:"1px solid #1e2d47",flexShrink:0}}>
          <div style={{position:"relative",width:34,height:34,borderRadius:9,background:"linear-gradient(135deg,#06b6d4,#8b5cf6)",display:"grid",placeItems:"center",fontSize:16,flexShrink:0}}>🏠
            <div style={{position:"absolute",inset:-3,borderRadius:12,border:"1.5px solid rgba(6,182,212,0.35)",animation:"pulse-ring 2s ease-out infinite",pointerEvents:"none"}}/>
          </div>
          <div>
            <div style={{fontSize:15,fontWeight:700,color:"#e2e8f0"}}>RentManager</div>
            <div style={{fontSize:9,color:"#4a6080",textTransform:"uppercase",letterSpacing:"0.1em"}}>Property OS</div>
          </div>
        </div>
        <nav style={{flex:1,padding:"16px 12px",overflowY:"auto"}}>
          {NAV_SECTIONS.map(s=>(
            <div key={s.label}>
              <div style={{fontSize:9,fontWeight:700,color:"#4a6080",textTransform:"uppercase",letterSpacing:"0.14em",padding:"0 8px",margin:"16px 0 6px"}}>{s.label}</div>
              {s.items.map(item=>(
                <Link key={item.href} href={item.href} className={`sb-link${item.active?" active":""}`} onClick={()=>setMobileOpen(false)}>
                  <span style={{fontSize:15,width:18,textAlign:"center",flexShrink:0}}>{item.icon}</span>
                  <span style={{flex:1}}>{item.label}</span>
                  {"badge" in item&&item.badge&&<span style={{fontSize:10,fontWeight:700,padding:"2px 7px",borderRadius:10,background:item.active?"rgba(6,182,212,0.15)":"rgba(255,255,255,0.05)",color:item.active?"#06b6d4":"#4a6080"}}>{item.badge}</span>}
                </Link>
              ))}
            </div>
          ))}
        </nav>
        <div style={{padding:"14px 12px",borderTop:"1px solid #1e2d47"}}>
          <button onClick={()=>{localStorage.removeItem("rentmanager_user");document.cookie="role=; path=/; max-age=0";router.push("/login");}}
            style={{display:"flex",alignItems:"center",gap:10,padding:9,borderRadius:9,cursor:"pointer",background:"transparent",border:"1px solid transparent",color:"#f43f5e",fontSize:13,fontWeight:500,fontFamily:"inherit",width:"100%",transition:"all .15s"}}
            onMouseEnter={e=>{(e.currentTarget as HTMLButtonElement).style.background="rgba(244,63,94,0.07)";(e.currentTarget as HTMLButtonElement).style.borderColor="rgba(244,63,94,0.2)"}}
            onMouseLeave={e=>{(e.currentTarget as HTMLButtonElement).style.background="transparent";(e.currentTarget as HTMLButtonElement).style.borderColor="transparent"}}>
            <span>🚪</span><span>Logout</span>
          </button>
        </div>
      </aside>

      <header className="navbar">
        <div style={{display:"flex",alignItems:"center",gap:14}}>
          <button className="mob-burger" onClick={()=>setMobileOpen(true)} style={{display:"none",background:"none",border:"1px solid #1e2d47",borderRadius:7,padding:"6px 8px",cursor:"pointer",color:"#94a3b8",fontSize:16,fontFamily:"inherit"}}>☰</button>
          <div>
            <div style={{fontSize:15,fontWeight:700,color:"#e2e8f0"}}>Invoices</div>
            <div style={{fontSize:11,color:"#4a6080"}}>Home → Invoices</div>
          </div>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <div style={{display:"flex",alignItems:"center",gap:8,background:"#111d33",border:"1px solid #1e2d47",borderRadius:8,padding:"7px 12px",width:220}}>
            <span style={{color:"#4a6080",fontSize:13}}>🔍</span>
            <input type="text" placeholder="Search invoices…" value={search} onChange={e=>setSearch(e.target.value)} style={{background:"none",border:"none",outline:"none",fontSize:13,color:"#e2e8f0",fontFamily:"inherit",width:"100%"}}/>
          </div>
          <Link href="/owner/complaints" className="nav-ico" style={{textDecoration:"none"}}>🔔<div style={{position:"absolute",top:5,right:5,width:7,height:7,borderRadius:"50%",background:"#f43f5e",border:"2px solid #0d1526"}}/></Link>
          <Link href="/owner/settings" style={{width:36,height:36,borderRadius:8,background:"linear-gradient(135deg,#06b6d4,#8b5cf6)",display:"grid",placeItems:"center",color:"white",fontSize:12,fontWeight:700,border:"1.5px solid rgba(6,182,212,0.3)",textDecoration:"none",flexShrink:0}}>AK</Link>
        </div>
      </header>

      <main className="page-main">
        <div className="a1" style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:14,marginBottom:22}}>
          <div>
            <div style={{fontSize:"clamp(18px,2.5vw,24px)",fontWeight:800,color:"#e2e8f0",letterSpacing:"-0.02em"}}>Invoices</div>
            <div style={{fontSize:13,color:"#94a3b8",marginTop:3}}>{displayInvoices.length} invoices · March 2026</div>
          </div>
          <button className="add-btn">+ Generate Invoice</button>
        </div>

        {/* Loading State */}
        {loading && (
          <div style={{textAlign:"center",padding:"60px 20px",color:"#4a6080"}}>
            <div style={{fontSize:32,marginBottom:8}}>⏳</div>
            <div style={{fontSize:14,color:"#94a3b8"}}>Loading invoices...</div>
          </div>
        )}

        {/* Error Display */}
        {error && !loading && (
          <div style={{background:"rgba(244,63,94,0.1)",border:"1px solid rgba(244,63,94,0.2)",borderRadius:12,padding:16,marginBottom:20,color:"#f43f5e",fontSize:13}}>
            ⚠️ {error}
          </div>
        )}

        {!loading && (
        <>
        <div className="a2" style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(130px,1fr))",gap:12,marginBottom:20}}>
          {[
            {icon:"🧾",label:"Total",   value:displayInvoices.length,                                   color:"#06b6d4",bg:"rgba(6,182,212,0.1)"},
            {icon:"✅",label:"Paid",    value:displayInvoices.filter(i=>i.status==="paid").length,      color:"#22c55e",bg:"rgba(34,197,94,0.1)"},
            {icon:"📤",label:"Sent",    value:displayInvoices.filter(i=>i.status==="sent").length,      color:"#06b6d4",bg:"rgba(6,182,212,0.1)"},
            {icon:"⚠️",label:"Overdue", value:displayInvoices.filter(i=>i.status==="overdue").length,   color:"#f43f5e",bg:"rgba(244,63,94,0.1)"},
          ].map(s=>(
            <div key={s.label} style={{background:"#111d33",border:"1px solid #1e2d47",borderRadius:12,padding:"16px",display:"flex",alignItems:"center",gap:12}}>
              <div style={{width:36,height:36,borderRadius:9,background:s.bg,display:"grid",placeItems:"center",fontSize:16,flexShrink:0}}>{s.icon}</div>
              <div>
                <div style={{fontSize:22,fontWeight:800,color:s.color}}>{s.value}</div>
                <div style={{fontSize:11,color:"#4a6080"}}>{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="a3" style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:16}}>
          {(["all","paid","sent","overdue","draft"] as const).map(f=>(
            <button key={f} className={`filter-btn${filter===f?" active":""}`} onClick={()=>setFilter(f)}>
              {f==="all"?"All":f==="paid"?"✅ Paid":f==="sent"?"📤 Sent":f==="overdue"?"⚠️ Overdue":"✏ Draft"}
            </button>
          ))}
        </div>

        <div className="glass-card a4">
          <div className="table-wrap">
            <div className="inv-header">
              <span>Tenant</span><span>Property</span><span>Amount</span><span>Issued</span><span>Due</span><span>Status</span><span></span>
            </div>
            {filtered.map(inv=>(
              <div key={inv.id} className="inv-row" onClick={()=>setSelected(inv)}>
                <div style={{display:"flex",alignItems:"center",gap:10}}>
                  <div style={{width:32,height:32,borderRadius:8,background:inv.grad,display:"grid",placeItems:"center",fontSize:11,fontWeight:700,color:"white",flexShrink:0}}>{inv.initials}</div>
                  <div>
                    <div style={{fontSize:13,fontWeight:600,color:"#e2e8f0"}}>{inv.tenant}</div>
                    <div style={{fontSize:11,color:"#4a6080"}}>{inv.id}</div>
                  </div>
                </div>
                <div style={{fontSize:12,color:"#94a3b8"}}>{inv.property}</div>
                <div style={{fontSize:13,fontWeight:700,color:"#e2e8f0"}}>{inv.amount}</div>
                <div style={{fontSize:12,color:"#4a6080"}}>{inv.date}</div>
                <div style={{fontSize:12,color:inv.status==="overdue"?"#f43f5e":"#4a6080"}}>{inv.due}</div>
                <span style={{display:"inline-flex",padding:"3px 9px",borderRadius:20,fontSize:11,fontWeight:600,background:STATUS_MAP[inv.status].bg,color:STATUS_MAP[inv.status].color,whiteSpace:"nowrap"}}>{STATUS_MAP[inv.status].label}</span>
                <button style={{padding:"6px 10px",background:"rgba(6,182,212,0.08)",border:"1px solid rgba(6,182,212,0.2)",borderRadius:8,color:"#06b6d4",fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:"inherit",flexShrink:0}} onClick={e=>{e.stopPropagation();setSelected(inv)}}>View</button>
              </div>
            ))}
          </div>
        </div>
        </>
        )}
      </main>
    </>
  );
}