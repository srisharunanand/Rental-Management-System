"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { propertyAPI } from "../../services/api";

const NAV_SECTIONS = [
  { label: "Main", items: [
    { icon: "⚡", label: "Dashboard", href: "/owner/dashboard", active: false },
    { icon: "🏠", label: "Houses",    href: "/owner/houses",    active: true  },
    { icon: "👥", label: "Tenants",   href: "/owner/tenants",   active: false },
    { icon: "📋", label: "Leases",    href: "/owner/leases",    active: false },
  ]},
  { label: "Finance", items: [
    { icon: "💳", label: "Payments",  href: "/owner/payments",  active: false },
    { icon: "📈", label: "Analytics", href: "/owner/analytics", active: false },
    { icon: "🧾", label: "Invoices",  href: "/owner/invoices",  active: false },
  ]},
  { label: "Tools", items: [
    { icon: "🔧", label: "Maintenance", href: "/owner/complaints", active: false },
    { icon: "💬", label: "Messages",    href: "/owner/messages",   active: false },
    { icon: "⚙️", label: "Settings",   href: "/owner/settings",   active: false },
  ]},
];

const EMPTY_FORM = {
  name: "", address: "", city: "", state: "", pincode: "",
  type: "apartment_complex", total_units: "", description: "",
  amenities: [] as string[],
};

const AMENITY_OPTIONS = ["🅿️ Parking","🏋️ Gym","🏊 Pool","🔒 CCTV","🌳 Garden","💧 Borewell"];

const TYPE_OPTIONS = [
  { value:"apartment_complex",  label:"Apartment Complex" },
  { value:"independent_villa",  label:"Independent Villa" },
  { value:"row_house",          label:"Row House"         },
  { value:"commercial",         label:"Commercial"        },
  { value:"other",              label:"Other"             },
];

function getStatusInfo(occupied: number, total: number) {
  const pct = total > 0 ? Math.round((occupied / total) * 100) : 0;
  if (pct === 100) return { bg:"rgba(34,197,94,0.1)",  color:"#22c55e", label:"● Fully Occupied",    barColor:"linear-gradient(90deg,#22c55e,#06b6d4)" };
  if (pct === 0)   return { bg:"rgba(244,63,94,0.1)",  color:"#f43f5e", label:"○ Vacant",             barColor:"#f43f5e" };
                   return { bg:"rgba(245,158,11,0.1)", color:"#f59e0b", label:"◐ Partially Occupied", barColor:"linear-gradient(90deg,#f59e0b,#06b6d4)" };
}

function getTypeIcon(type: string) {
  const icons: Record<string,string> = {
    apartment_complex:"🏢", independent_villa:"🏠", row_house:"🏡", commercial:"🏗️", other:"🏛️",
  };
  return icons[type] || "🏠";
}

export default function HousesPage() {
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [search,     setSearch]     = useState("");
  const [filter,     setFilter]     = useState<"all"|"full"|"partial"|"vacant">("all");
  const [showModal,  setShowModal]  = useState(false);
  const [form,       setForm]       = useState(EMPTY_FORM);
  const [saving,     setSaving]     = useState(false);
  const [saveError,  setSaveError]  = useState("");

  const [properties, setProperties] = useState<any[]>([]);
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState("");

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const res = await propertyAPI.getAll();
      setProperties(res.data || []);
    } catch (err: any) {
      setError(err.message || "Failed to load properties");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProperties(); }, []);

  const totalUnits    = properties.reduce((a, p) => a + (Number(p.total_units)    || 0), 0);
  const totalOccupied = properties.reduce((a, p) => a + (Number(p.occupied_units) || 0), 0);
  const totalVacant   = properties.reduce((a, p) => a + (Number(p.vacant_units)   || 0), 0);

  const filtered = properties.filter(p => {
    const occ   = Number(p.occupied_units) || 0;
    const total = Number(p.total_units)    || 0;
    const pct   = total > 0 ? Math.round((occ / total) * 100) : 0;
    const matchF = filter === "all"
      || (filter === "full"    && pct === 100)
      || (filter === "partial" && pct > 0 && pct < 100)
      || (filter === "vacant"  && pct === 0);
    const q = search.toLowerCase();
    const matchS = !q || (p.name||"").toLowerCase().includes(q) || (p.address||"").toLowerCase().includes(q) || (p.city||"").toLowerCase().includes(q);
    return matchF && matchS;
  });

  const handleSave = async () => {
    if (!form.name || !form.address || !form.type) { setSaveError("Name, address and type are required"); return; }
    setSaving(true); setSaveError("");
    try {
      await propertyAPI.create({
        name: form.name, address: form.address, city: form.city,
        state: form.state, pincode: form.pincode, type: form.type,
        total_units: Number(form.total_units) || 0,
        description: form.description, amenities: form.amenities,
      });
      setShowModal(false); setForm(EMPTY_FORM); await fetchProperties();
    } catch (err: any) {
      setSaveError(err.message || "Failed to save property");
    } finally { setSaving(false); }
  };

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    try {
      await propertyAPI.delete(id);
      setProperties(prev => prev.filter(p => p.id !== id));
    } catch (err: any) { alert(err.message || "Failed to delete property"); }
  };

  const toggleAmenity = (a: string) =>
    setForm(f => ({...f, amenities: f.amenities.includes(a) ? f.amenities.filter(x=>x!==a) : [...f.amenities, a]}));

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        html,body{height:100%;font-family:'Plus Jakarta Sans',sans-serif;background:#080e1a;color:#e2e8f0}
        ::-webkit-scrollbar{width:4px;height:4px}
        ::-webkit-scrollbar-thumb{background:#1e2d47;border-radius:4px}
        @keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
        @keyframes pulse-ring{0%{transform:scale(1);opacity:.5}100%{transform:scale(1.6);opacity:0}}
        @keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}
        .a1{animation:fadeUp .4s ease both .05s}.a2{animation:fadeUp .4s ease both .10s}
        .a3{animation:fadeUp .4s ease both .15s}.a4{animation:fadeUp .4s ease both .20s}
        .sb-link{display:flex;align-items:center;gap:10px;padding:9px 10px;border-radius:8px;font-size:13px;font-weight:500;color:#94a3b8;cursor:pointer;transition:all .15s;text-decoration:none;margin-bottom:2px;border:1px solid transparent}
        .sb-link:hover{background:rgba(255,255,255,0.04);color:#e2e8f0}
        .sb-link.active{background:rgba(6,182,212,0.1);color:#06b6d4;border-color:rgba(6,182,212,0.15)}
        .sidebar{position:fixed;top:0;left:0;bottom:0;width:250px;background:#0d1526;border-right:1px solid #1e2d47;display:flex;flex-direction:column;z-index:300;transition:transform .3s ease}
        .navbar{position:fixed;top:0;left:250px;right:0;height:62px;background:#0d1526;border-bottom:1px solid #1e2d47;display:flex;align-items:center;justify-content:space-between;padding:0 24px;z-index:200}
        .page-main{margin-left:250px;margin-top:62px;padding:26px;min-height:calc(100vh - 62px);position:relative;z-index:1}
        .house-card{background:#111d33;border:1px solid #1e2d47;border-radius:14px;padding:20px;transition:border-color .2s,transform .2s}
        .house-card:hover{border-color:rgba(6,182,212,0.5);transform:translateY(-2px);box-shadow:0 8px 24px rgba(6,182,212,0.08)}
        .filter-btn{padding:7px 14px;border-radius:8px;font-size:12px;font-weight:600;cursor:pointer;border:1px solid #1e2d47;background:#111d33;color:#94a3b8;transition:all .15s;font-family:inherit}
        .filter-btn.active{background:rgba(6,182,212,0.1);color:#06b6d4;border-color:rgba(6,182,212,0.3)}
        .filter-btn:hover{border-color:#06b6d4;color:#06b6d4}
        .add-btn{background:linear-gradient(135deg,#06b6d4,#8b5cf6);border:none;border-radius:10px;padding:10px 18px;font-size:13px;font-weight:700;color:white;cursor:pointer;font-family:inherit;transition:transform .15s,box-shadow .15s;white-space:nowrap}
        .add-btn:hover{transform:translateY(-1px);box-shadow:0 6px 20px rgba(6,182,212,0.35)}
        .add-btn:disabled{opacity:.6;cursor:not-allowed;transform:none}
        .mob-overlay{display:none;position:fixed;inset:0;background:rgba(0,0,0,0.6);z-index:250;backdrop-filter:blur(2px)}
        .nav-ico{width:36px;height:36px;border-radius:8px;background:#111d33;border:1px solid #1e2d47;display:grid;place-items:center;cursor:pointer;font-size:15px;position:relative;transition:border-color .2s;flex-shrink:0}
        .nav-ico:hover{border-color:#06b6d4}
        .modal-bg{position:fixed;inset:0;background:rgba(0,0,0,0.7);backdrop-filter:blur(4px);z-index:500;display:flex;align-items:center;justify-content:center;padding:16px}
        .modal-card{background:#0d1526;border:1px solid #1e2d47;border-radius:18px;padding:28px;width:100%;max-width:480px;position:relative;max-height:90vh;overflow-y:auto}
        .inp{width:100%;padding:10px 14px;background:rgba(255,255,255,0.04);border:1px solid #1e2d47;border-radius:9px;color:#e2e8f0;font-size:13px;font-family:inherit;outline:none;transition:border-color .2s}
        .inp:focus{border-color:rgba(6,182,212,0.5)}
        .inp::placeholder{color:#334155}
        .houses-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:16px}
        .skeleton{background:linear-gradient(90deg,#1e2d47 25%,#2d4060 50%,#1e2d47 75%);background-size:200% 100%;animation:shimmer 1.5s infinite;border-radius:14px}
        .action-btn{flex:1;padding:7px 0;font-size:11px;font-weight:600;border-radius:8px;border:1px solid #1e2d47;cursor:pointer;font-family:inherit;transition:all .15s}
        @media(max-width:1200px){.houses-grid{grid-template-columns:repeat(2,1fr)}}
        @media(max-width:768px){
          .sidebar{transform:translateX(-100%)}
          .sidebar.open{transform:translateX(0)}
          .mob-overlay.open{display:block}
          .navbar{left:0;padding:0 16px}
          .page-main{margin-left:0;padding:16px}
          .mob-burger{display:grid !important}
          .nav-search-wrap{display:none}
          .houses-grid{grid-template-columns:1fr}
        }
      `}</style>

      <div className={`mob-overlay${mobileOpen?" open":""}`} onClick={()=>setMobileOpen(false)}/>

      {/* Add Property Modal */}
      {showModal && (
        <div className="modal-bg" onClick={()=>setShowModal(false)}>
          <div className="modal-card" onClick={e=>e.stopPropagation()}>
            <button onClick={()=>setShowModal(false)} style={{position:"absolute",top:16,right:16,background:"none",border:"1px solid #1e2d47",borderRadius:8,width:30,height:30,display:"grid",placeItems:"center",cursor:"pointer",color:"#94a3b8",fontSize:14,fontFamily:"inherit"}}>✕</button>
            <div style={{fontSize:18,fontWeight:800,color:"#e2e8f0",marginBottom:4}}>Add New Property</div>
            <div style={{fontSize:12,color:"#4a6080",marginBottom:22}}>Fill in the property details below</div>
            {saveError && <div style={{background:"rgba(244,63,94,0.1)",border:"1px solid rgba(244,63,94,0.3)",borderRadius:8,padding:"10px 14px",color:"#f43f5e",fontSize:13,marginBottom:16}}>⚠️ {saveError}</div>}
            <div style={{display:"flex",flexDirection:"column",gap:14}}>
              <div>
                <div style={{fontSize:11,fontWeight:600,color:"#94a3b8",textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:6}}>Property Name *</div>
                <input className="inp" placeholder="e.g. Greenview Apartments" value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))}/>
              </div>
              <div>
                <div style={{fontSize:11,fontWeight:600,color:"#94a3b8",textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:6}}>Property Type *</div>
                <select className="inp" value={form.type} onChange={e=>setForm(f=>({...f,type:e.target.value}))} style={{cursor:"pointer"}}>
                  {TYPE_OPTIONS.map(t=><option key={t.value} value={t.value}>{t.label}</option>)}
                </select>
              </div>
              <div>
                <div style={{fontSize:11,fontWeight:600,color:"#94a3b8",textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:6}}>Full Address *</div>
                <input className="inp" placeholder="Street, Area" value={form.address} onChange={e=>setForm(f=>({...f,address:e.target.value}))}/>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10}}>
                {[{label:"City",key:"city",ph:"Chennai"},{label:"State",key:"state",ph:"Tamil Nadu"},{label:"Pincode",key:"pincode",ph:"600040"}].map(f=>(
                  <div key={f.key}>
                    <div style={{fontSize:11,fontWeight:600,color:"#94a3b8",textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:6}}>{f.label}</div>
                    <input className="inp" placeholder={f.ph} value={(form as any)[f.key]} onChange={e=>setForm(prev=>({...prev,[f.key]:e.target.value}))}/>
                  </div>
                ))}
              </div>
              <div>
                <div style={{fontSize:11,fontWeight:600,color:"#94a3b8",textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:6}}>Number of Units</div>
                <input className="inp" type="number" placeholder="e.g. 12" value={form.total_units} onChange={e=>setForm(f=>({...f,total_units:e.target.value}))}/>
              </div>
              <div>
                <div style={{fontSize:11,fontWeight:600,color:"#94a3b8",textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:6}}>Description</div>
                <textarea className="inp" placeholder="Optional notes…" rows={2} value={form.description} onChange={e=>setForm(f=>({...f,description:e.target.value}))} style={{resize:"vertical"}}/>
              </div>
              <div>
                <div style={{fontSize:11,fontWeight:600,color:"#94a3b8",textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:8}}>Amenities</div>
                <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
                  {AMENITY_OPTIONS.map(a=>{
                    const sel = form.amenities.includes(a);
                    return <button key={a} type="button" onClick={()=>toggleAmenity(a)} style={{padding:"6px 12px",background:sel?"rgba(6,182,212,0.15)":"rgba(6,182,212,0.06)",border:`1px solid ${sel?"rgba(6,182,212,0.5)":"rgba(6,182,212,0.15)"}`,borderRadius:8,cursor:"pointer",fontSize:12,color:sel?"#06b6d4":"#94a3b8",fontFamily:"inherit",transition:"all .15s"}}>{a}</button>;
                  })}
                </div>
              </div>
              <button className="add-btn" disabled={saving} onClick={handleSave} style={{marginTop:6,width:"100%",padding:"12px"}}>
                {saving?"Saving…":"Save Property →"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sidebar */}
      <aside className={`sidebar${mobileOpen?" open":""}`}>
        <div style={{height:62,display:"flex",alignItems:"center",gap:12,padding:"0 20px",borderBottom:"1px solid #1e2d47",flexShrink:0}}>
          <div style={{position:"relative",width:34,height:34,borderRadius:9,background:"linear-gradient(135deg,#06b6d4,#8b5cf6)",display:"grid",placeItems:"center",fontSize:16,flexShrink:0,boxShadow:"0 0 16px rgba(6,182,212,0.3)"}}>
            🏠
            <div style={{position:"absolute",inset:-3,borderRadius:12,border:"1.5px solid rgba(6,182,212,0.35)",animation:"pulse-ring 2s ease-out infinite",pointerEvents:"none"}}/>
          </div>
          <div>
            <div style={{fontSize:15,fontWeight:700,color:"#e2e8f0",letterSpacing:"-0.02em"}}>RentManager</div>
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
                </Link>
              ))}
            </div>
          ))}
        </nav>
        <div style={{padding:"14px 12px",borderTop:"1px solid #1e2d47",flexShrink:0}}>
          <button onClick={()=>{localStorage.removeItem("rentmanager_user");document.cookie="role=; path=/; max-age=0";router.push("/login");}}
            style={{display:"flex",alignItems:"center",gap:10,padding:9,borderRadius:9,cursor:"pointer",background:"transparent",border:"1px solid transparent",color:"#f43f5e",fontSize:13,fontWeight:500,fontFamily:"inherit",width:"100%",transition:"all .15s"}}
            onMouseEnter={e=>{(e.currentTarget as HTMLButtonElement).style.background="rgba(244,63,94,0.07)";(e.currentTarget as HTMLButtonElement).style.borderColor="rgba(244,63,94,0.2)"}}
            onMouseLeave={e=>{(e.currentTarget as HTMLButtonElement).style.background="transparent";(e.currentTarget as HTMLButtonElement).style.borderColor="transparent"}}>
            <span style={{fontSize:15,width:18,textAlign:"center"}}>🚪</span><span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Navbar */}
      <header className="navbar">
        <div style={{display:"flex",alignItems:"center",gap:14}}>
          <button className="mob-burger" onClick={()=>setMobileOpen(true)} style={{display:"none",background:"none",border:"1px solid #1e2d47",borderRadius:7,padding:"6px 8px",cursor:"pointer",color:"#94a3b8",fontSize:16,fontFamily:"inherit"}}>☰</button>
          <div>
            <div style={{fontSize:15,fontWeight:700,color:"#e2e8f0"}}>Houses</div>
            <div style={{fontSize:11,color:"#4a6080"}}>Home → Houses</div>
          </div>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <div className="nav-search-wrap" style={{display:"flex",alignItems:"center",gap:8,background:"#111d33",border:"1px solid #1e2d47",borderRadius:8,padding:"7px 12px",width:220}}>
            <span style={{color:"#4a6080",fontSize:13}}>🔍</span>
            <input type="text" placeholder="Search…" value={search} onChange={e=>setSearch(e.target.value)} style={{background:"none",border:"none",outline:"none",fontSize:13,color:"#e2e8f0",fontFamily:"inherit",width:"100%"}}/>
          </div>
          <Link href="/owner/complaints" className="nav-ico" style={{textDecoration:"none"}}>🔔<div style={{position:"absolute",top:5,right:5,width:7,height:7,borderRadius:"50%",background:"#f43f5e",border:"2px solid #0d1526"}}/></Link>
          <Link href="/owner/messages" className="nav-ico" style={{textDecoration:"none"}}>📬</Link>
          <Link href="/owner/settings" style={{width:36,height:36,borderRadius:8,background:"linear-gradient(135deg,#06b6d4,#8b5cf6)",display:"grid",placeItems:"center",color:"white",fontSize:12,fontWeight:700,cursor:"pointer",flexShrink:0,border:"1.5px solid rgba(6,182,212,0.3)",textDecoration:"none"}}>AK</Link>
        </div>
      </header>

      {/* Main */}
      <main className="page-main">

        {/* Header */}
        <div className="a1" style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:14,marginBottom:22}}>
          <div>
            <div style={{fontSize:"clamp(18px,2.5vw,24px)",fontWeight:800,color:"#e2e8f0",letterSpacing:"-0.02em"}}>My Properties</div>
            <div style={{fontSize:13,color:"#94a3b8",marginTop:3}}>
              {loading ? "Loading…" : `${properties.length} properties · ${totalOccupied} tenants`}
            </div>
          </div>
          <button className="add-btn" onClick={()=>setShowModal(true)}>+ Add Property</button>
        </div>

        {/* Summary cards */}
        <div className="a2" style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))",gap:12,marginBottom:20}}>
          {[
            {icon:"🏘️",label:"Total Properties",value:loading?"—":properties.length, color:"#06b6d4",bg:"rgba(6,182,212,0.1)"},
            {icon:"🔑",label:"Total Units",      value:loading?"—":totalUnits,        color:"#8b5cf6",bg:"rgba(139,92,246,0.1)"},
            {icon:"👥",label:"Occupied",         value:loading?"—":totalOccupied,     color:"#22c55e",bg:"rgba(34,197,94,0.1)"},
            {icon:"🔓",label:"Vacant Units",     value:loading?"—":totalVacant,       color:"#f43f5e",bg:"rgba(244,63,94,0.1)"},
          ].map(s=>(
            <div key={s.label} style={{background:"#111d33",border:"1px solid #1e2d47",borderRadius:12,padding:"16px",display:"flex",alignItems:"center",gap:12}}>
              <div style={{width:36,height:36,borderRadius:9,background:s.bg,display:"grid",placeItems:"center",fontSize:16,flexShrink:0}}>{s.icon}</div>
              <div>
                <div style={{fontSize:22,fontWeight:800,color:s.color,letterSpacing:"-0.02em"}}>{s.value}</div>
                <div style={{fontSize:11,color:"#4a6080"}}>{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="a3" style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:20,alignItems:"center"}}>
          {([{key:"all",label:"All Properties"},{key:"full",label:"✅ Fully Occupied"},{key:"partial",label:"⚠️ Partial"},{key:"vacant",label:"🔴 Vacant"}] as const).map(f=>(
            <button key={f.key} className={`filter-btn${filter===f.key?" active":""}`} onClick={()=>setFilter(f.key)}>{f.label}</button>
          ))}
          <div style={{marginLeft:"auto",display:"flex",alignItems:"center",gap:8,background:"#111d33",border:"1px solid #1e2d47",borderRadius:8,padding:"7px 12px"}}>
            <span style={{color:"#4a6080",fontSize:13}}>🔍</span>
            <input placeholder="Search properties…" value={search} onChange={e=>setSearch(e.target.value)} style={{background:"none",border:"none",outline:"none",fontSize:13,color:"#e2e8f0",fontFamily:"inherit",width:160}}/>
          </div>
        </div>

        {/* Error */}
        {error && <div style={{background:"rgba(244,63,94,0.1)",border:"1px solid rgba(244,63,94,0.3)",borderRadius:10,padding:"14px 18px",color:"#f43f5e",fontSize:13,marginBottom:20}}>⚠️ {error}</div>}

        {/* Loading skeletons */}
        {loading && (
          <div className="houses-grid">
            {[1,2,3,4,5,6].map(i=><div key={i} className="skeleton" style={{height:280}}/>)}
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && filtered.length === 0 && (
          <div style={{textAlign:"center",padding:"60px 20px",color:"#4a6080"}}>
            <div style={{fontSize:40,marginBottom:12}}>🏠</div>
            <div style={{fontSize:16,fontWeight:600,color:"#94a3b8"}}>
              {properties.length===0?"No properties added yet":"No properties match your filter"}
            </div>
            <div style={{fontSize:13,marginTop:4}}>
              {properties.length===0?'Click "+ Add Property" to get started':"Try adjusting your search or filter"}
            </div>
          </div>
        )}

        {/* Property cards */}
        {!loading && !error && filtered.length > 0 && (
          <div className="houses-grid a4">
            {filtered.map((p:any)=>{
              const occ    = Number(p.occupied_units)||0;
              const total  = Number(p.total_units)  ||0;
              const vac    = Number(p.vacant_units)  ||0;
              const occPct = total>0?Math.round((occ/total)*100):0;
              const st     = getStatusInfo(occ,total);
              const icon   = getTypeIcon(p.type);
              const amenities:string[] = (()=>{ try{return Array.isArray(p.amenities)?p.amenities:JSON.parse(p.amenities||"[]")}catch{return []} })();
              return (
                <div key={p.id} className="house-card">
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:14}}>
                    <div style={{display:"flex",alignItems:"center",gap:10}}>
                      <div style={{width:42,height:42,borderRadius:11,background:"rgba(6,182,212,0.1)",border:"1px solid rgba(6,182,212,0.2)",display:"grid",placeItems:"center",fontSize:20,flexShrink:0}}>{icon}</div>
                      <div>
                        <div style={{fontSize:14,fontWeight:700,color:"#e2e8f0"}}>{p.name}</div>
                        <div style={{fontSize:11,color:"#4a6080"}}>{(p.type||"").replace(/_/g," ")} · #{p.id}</div>
                      </div>
                    </div>
                    <span style={{fontSize:10,fontWeight:600,padding:"3px 9px",borderRadius:20,background:st.bg,color:st.color,whiteSpace:"nowrap"}}>{st.label}</span>
                  </div>

                  <div style={{fontSize:12,color:"#64748b",marginBottom:14,display:"flex",gap:6,alignItems:"flex-start"}}>
                    <span style={{flexShrink:0}}>📍</span>
                    <span>{p.address}{p.city?`, ${p.city}`:""}</span>
                  </div>

                  <div style={{marginBottom:14}}>
                    <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
                      <span style={{fontSize:12,color:"#94a3b8"}}>Occupancy</span>
                      <span style={{fontSize:12,fontWeight:700,color:"#e2e8f0"}}>{occ}/{total} units</span>
                    </div>
                    <div style={{height:6,background:"#1e2d47",borderRadius:4,overflow:"hidden"}}>
                      <div style={{height:"100%",width:`${occPct}%`,background:st.barColor,borderRadius:4}}/>
                    </div>
                    <div style={{fontSize:11,color:st.color,marginTop:4,fontWeight:600}}>{occPct}% occupied · {vac} vacant</div>
                  </div>

                  {amenities.length>0&&(
                    <div style={{display:"flex",gap:4,flexWrap:"wrap",marginBottom:14}}>
                      {amenities.map((a:string)=>(
                        <span key={a} style={{fontSize:10,padding:"2px 7px",borderRadius:8,background:"rgba(255,255,255,0.04)",border:"1px solid #1e2d47",color:"#64748b"}}>{a}</span>
                      ))}
                    </div>
                  )}

                  <div style={{display:"flex",gap:8,paddingTop:14,borderTop:"1px solid #1e2d47"}}>
                    <Link href={`/owner/tenants?property=${p.id}`} style={{textDecoration:"none",flex:1}}>
                      <button className="action-btn" style={{width:"100%",background:"rgba(6,182,212,0.05)",color:"#94a3b8"}}
                        onMouseEnter={e=>(e.currentTarget as HTMLButtonElement).style.borderColor="rgba(6,182,212,0.4)"}
                        onMouseLeave={e=>(e.currentTarget as HTMLButtonElement).style.borderColor="#1e2d47"}>
                        👥 Tenants
                      </button>
                    </Link>
                    <button className="action-btn" style={{flex:1,background:"rgba(6,182,212,0.05)",color:"#94a3b8"}}
                      onMouseEnter={e=>(e.currentTarget as HTMLButtonElement).style.borderColor="rgba(6,182,212,0.4)"}
                      onMouseLeave={e=>(e.currentTarget as HTMLButtonElement).style.borderColor="#1e2d47"}>
                      ✏️ Edit
                    </button>
                    <button className="action-btn" style={{flex:1,background:"rgba(244,63,94,0.06)",color:"#f43f5e"}}
                      onClick={()=>handleDelete(p.id,p.name)}
                      onMouseEnter={e=>(e.currentTarget as HTMLButtonElement).style.borderColor="rgba(244,63,94,0.4)"}
                      onMouseLeave={e=>(e.currentTarget as HTMLButtonElement).style.borderColor="#1e2d47"}>
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </main>
    </>
  );
}