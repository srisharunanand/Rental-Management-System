"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const NAV_ITEMS = [
  { icon:"⚡", label:"Dashboard",   href:"/tenant/dashboard",   active:false },
  { icon:"💳", label:"Payments",    href:"/tenant/payments",    active:false },
  { icon:"🔧", label:"Maintenance", href:"/tenant/complaints",  active:false },
  { icon:"📋", label:"My Lease",    href:"/tenant/lease",       active:false },
  { icon:"💬", label:"Messages",    href:"/tenant/messages",    active:false },
  { icon:"⚙️", label:"Settings",   href:"/tenant/settings",    active:true },
];

const TENANT = { name:"Rahul Krishnan", initials:"RK", unit:"Unit 4B", property:"Greenview Apartments", address:"12, Anna Nagar, Chennai – 600 040" };

const TABS = ["Profile","Notifications","Security","Preferences"];

export default function TenantSettingsPage() {
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [tab,        setTab]        = useState("Profile");
  const [toggles,    setToggles]    = useState({
    emailRent:true, emailMaintenance:true, emailNotice:true,
    smsRent:false,  smsMaintenance:false,  smsNotice:false,
    darkMode:true,  compactView:false,     soundAlerts:true, twoFactor:false,
  });

  const flip = (k: keyof typeof toggles) => setToggles(p=>({...p,[k]:!p[k]}));

  const Toggle = ({k,label,sub}:{k:keyof typeof toggles;label:string;sub?:string})=>(
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"13px 0",borderBottom:"1px solid rgba(30,45,71,0.5)"}}>
      <div>
        <div style={{fontSize:13,fontWeight:500,color:"#e2e8f0"}}>{label}</div>
        {sub&&<div style={{fontSize:11,color:"#4a6080",marginTop:2}}>{sub}</div>}
      </div>
      <div onClick={()=>flip(k)} style={{width:42,height:24,borderRadius:12,background:toggles[k]?"#06b6d4":"#1e2d47",position:"relative",cursor:"pointer",transition:"background .2s",flexShrink:0}}>
        <div style={{position:"absolute",top:3,left:toggles[k]?20:3,width:18,height:18,borderRadius:"50%",background:"white",transition:"left .2s",boxShadow:"0 1px 4px rgba(0,0,0,0.3)"}}/>
      </div>
    </div>
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
        .a1{animation:fadeUp .4s ease both .05s}.a2{animation:fadeUp .4s ease both .10s}.a3{animation:fadeUp .4s ease both .15s}
        .sb-link{display:flex;align-items:center;gap:10px;padding:9px 10px;border-radius:8px;font-size:13px;font-weight:500;color:#94a3b8;cursor:pointer;transition:all .15s;text-decoration:none;margin-bottom:2px;border:1px solid transparent}
        .sb-link:hover{background:rgba(255,255,255,0.04);color:#e2e8f0}
        .sb-link.active{background:rgba(6,182,212,0.1);color:#06b6d4;border-color:rgba(6,182,212,0.15)}
        .sidebar{position:fixed;top:0;left:0;bottom:0;width:250px;background:#0d1526;border-right:1px solid #1e2d47;display:flex;flex-direction:column;z-index:300;transition:transform .3s ease}
        .navbar{position:fixed;top:0;left:250px;right:0;height:62px;background:#0d1526;border-bottom:1px solid #1e2d47;display:flex;align-items:center;justify-content:space-between;padding:0 24px;z-index:200}
        .page-main{margin-left:250px;margin-top:62px;padding:26px;min-height:calc(100vh - 62px)}
        .glass-card{background:#111d33;border:1px solid #1e2d47;border-radius:14px;padding:24px}
        .mob-overlay{display:none;position:fixed;inset:0;background:rgba(0,0,0,0.6);z-index:250;backdrop-filter:blur(2px)}
        .nav-ico{width:36px;height:36px;border-radius:8px;background:#111d33;border:1px solid #1e2d47;display:grid;place-items:center;cursor:pointer;font-size:15px;position:relative;transition:border-color .2s;flex-shrink:0}
        .tab-btn{padding:9px 18px;border-radius:9px;font-size:13px;font-weight:600;cursor:pointer;border:1px solid transparent;background:transparent;color:#94a3b8;font-family:inherit;transition:all .15s;white-space:nowrap}
        .tab-btn.active{background:rgba(6,182,212,0.1);color:#06b6d4;border-color:rgba(6,182,212,0.2)}
        .tab-btn:hover{color:#e2e8f0}
        .inp{width:100%;padding:10px 14px;background:rgba(255,255,255,0.04);border:1px solid #1e2d47;border-radius:9px;color:#e2e8f0;font-size:13px;font-family:inherit;outline:none;transition:border-color .2s}
        .inp:focus{border-color:rgba(6,182,212,0.5)}
        .inp::placeholder{color:#334155}
        .save-btn{background:linear-gradient(135deg,#06b6d4,#8b5cf6);border:none;border-radius:10px;padding:10px 24px;font-size:13px;font-weight:700;color:white;cursor:pointer;font-family:inherit;transition:transform .15s}
        .save-btn:hover{transform:translateY(-1px);box-shadow:0 6px 20px rgba(6,182,212,0.3)}
        .two-col{display:grid;grid-template-columns:1fr 1fr;gap:20px}
        @media(max-width:900px){.two-col{grid-template-columns:1fr}}
        @media(max-width:768px){
          .sidebar{transform:translateX(-100%)}.sidebar.open{transform:translateX(0)}
          .mob-overlay.open{display:block}
          .navbar{left:0;padding:0 16px}.page-main{margin-left:0;padding:16px}
          .mob-burger{display:grid !important}
        }
      `}</style>

      <div className={`mob-overlay${mobileOpen?" open":""}`} onClick={()=>setMobileOpen(false)}/>

      {/* Sidebar */}
      <aside className={`sidebar${mobileOpen?" open":""}`}>
        <div style={{height:62,display:"flex",alignItems:"center",gap:12,padding:"0 20px",borderBottom:"1px solid #1e2d47",flexShrink:0}}>
          <div style={{position:"relative",width:34,height:34,borderRadius:9,background:"linear-gradient(135deg,#06b6d4,#8b5cf6)",display:"grid",placeItems:"center",fontSize:16,flexShrink:0}}>
            🏠<div style={{position:"absolute",inset:-3,borderRadius:12,border:"1.5px solid rgba(6,182,212,0.35)",animation:"pulse-ring 2s ease-out infinite",pointerEvents:"none"}}/>
          </div>
          <div>
            <div style={{fontSize:15,fontWeight:700,color:"#e2e8f0"}}>RentManager</div>
            <div style={{fontSize:9,color:"#4a6080",textTransform:"uppercase",letterSpacing:"0.1em"}}>Tenant Portal</div>
          </div>
        </div>
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
              {"badge" in item&&item.badge&&<span style={{fontSize:10,fontWeight:700,padding:"2px 7px",borderRadius:10,background:item.active?"rgba(6,182,212,0.15)":"rgba(255,255,255,0.05)",color:item.active?"#06b6d4":"#4a6080"}}>{item.badge}</span>}
            </Link>
          ))}
        </nav>
        <div style={{padding:"13px 12px",borderTop:"1px solid #1e2d47",flexShrink:0}}>
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
            <div style={{fontSize:15,fontWeight:700,color:"#e2e8f0"}}>Settings</div>
            <div style={{fontSize:11,color:"#4a6080"}}>Home → Settings</div>
          </div>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <Link href="/owner/complaints" className="nav-ico" style={{textDecoration:"none"}}>🔔<div style={{position:"absolute",top:5,right:5,width:7,height:7,borderRadius:"50%",background:"#f43f5e",border:"2px solid #0d1526"}}/></Link>
          <div style={{width:36,height:36,borderRadius:8,background:"linear-gradient(135deg,#06b6d4,#8b5cf6)",display:"grid",placeItems:"center",color:"white",fontSize:12,fontWeight:700,border:"1.5px solid rgba(6,182,212,0.3)"}}>{TENANT.initials}</div>
        </div>
      </header>

      <main className="page-main">
        <div className="a1" style={{marginBottom:22}}>
          <div style={{fontSize:"clamp(18px,2.5vw,24px)",fontWeight:800,color:"#e2e8f0",letterSpacing:"-0.02em"}}>Settings</div>
          <div style={{fontSize:13,color:"#94a3b8",marginTop:3}}>Manage your account and preferences</div>
        </div>

        {/* Tabs */}
        <div className="a2" style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:22,background:"#111d33",border:"1px solid #1e2d47",borderRadius:12,padding:6}}>
          {TABS.map(t=>(
            <button key={t} className={`tab-btn${tab===t?" active":""}`} onClick={()=>setTab(t)}>{t}</button>
          ))}
        </div>

        {/* Profile */}
        {tab==="Profile"&&(
          <div className="a3 two-col">
            <div className="glass-card">
              <div style={{fontSize:15,fontWeight:700,color:"#e2e8f0",marginBottom:20}}>Personal Information</div>
              <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:24}}>
                <div style={{width:64,height:64,borderRadius:16,background:"linear-gradient(135deg,#06b6d4,#8b5cf6)",display:"grid",placeItems:"center",color:"white",fontSize:24,fontWeight:700,flexShrink:0}}>{TENANT.initials}</div>
                <div>
                  <div style={{fontSize:16,fontWeight:700,color:"#e2e8f0"}}>{TENANT.name}</div>
                  <div style={{fontSize:12,color:"#4a6080"}}>{TENANT.unit} · {TENANT.property}</div>
                  <button style={{marginTop:6,padding:"4px 12px",background:"rgba(6,182,212,0.08)",border:"1px solid rgba(6,182,212,0.2)",borderRadius:7,color:"#06b6d4",fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>Change Photo</button>
                </div>
              </div>
              {[
                {label:"Full Name",  val:"Rahul Krishnan",          ph:"Your full name"},
                {label:"Email",      val:"rahul@email.com",          ph:"Email address"},
                {label:"Phone",      val:"+91 98400 11111",          ph:"Phone number"},
                {label:"Emergency Contact", val:"+91 98400 99999",  ph:"Emergency contact"},
              ].map(f=>(
                <div key={f.label} style={{marginBottom:14}}>
                  <div style={{fontSize:11,fontWeight:600,color:"#94a3b8",textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:6}}>{f.label}</div>
                  <input className="inp" defaultValue={f.val} placeholder={f.ph}/>
                </div>
              ))}
              <button className="save-btn" style={{marginTop:8}}>Save Changes</button>
            </div>

            <div className="glass-card">
              <div style={{fontSize:15,fontWeight:700,color:"#e2e8f0",marginBottom:20}}>Tenancy Details</div>
              {[
                {icon:"🏠",label:"Unit",          value:TENANT.unit},
                {icon:"🏢",label:"Property",      value:TENANT.property},
                {icon:"📍",label:"Address",       value:TENANT.address},
                {icon:"📅",label:"Tenant Since",  value:"January 2024"},
                {icon:"📋",label:"Lease Ends",    value:"December 2026"},
                {icon:"💰",label:"Monthly Rent",  value:"₹18,000"},
                {icon:"🏦",label:"Deposit Paid",  value:"₹36,000"},
              ].map(s=>(
                <div key={s.label} style={{display:"flex",justifyContent:"space-between",padding:"11px 0",borderBottom:"1px solid rgba(30,45,71,0.5)",fontSize:13,gap:12}}>
                  <div style={{display:"flex",gap:8,alignItems:"center",color:"#94a3b8",flexShrink:0}}>
                    <span>{s.icon}</span><span>{s.label}</span>
                  </div>
                  <span style={{fontWeight:600,color:"#e2e8f0",textAlign:"right"}}>{s.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Notifications */}
        {tab==="Notifications"&&(
          <div className="a3 two-col">
            <div className="glass-card">
              <div style={{fontSize:15,fontWeight:700,color:"#e2e8f0",marginBottom:6}}>Email Notifications</div>
              <div style={{fontSize:12,color:"#4a6080",marginBottom:16}}>Choose what you receive via email</div>
              <Toggle k="emailRent"        label="Rent payment receipts"    sub="After each successful payment"/>
              <Toggle k="emailMaintenance" label="Maintenance updates"      sub="Status changes on your requests"/>
              <Toggle k="emailNotice"      label="Owner notices"            sub="New notices from property owner"/>
            </div>
            <div className="glass-card">
              <div style={{fontSize:15,fontWeight:700,color:"#e2e8f0",marginBottom:6}}>SMS Notifications</div>
              <div style={{fontSize:12,color:"#4a6080",marginBottom:16}}>Standard carrier rates may apply</div>
              <Toggle k="smsRent"        label="Rent due reminder"        sub="2 days before due date"/>
              <Toggle k="smsMaintenance" label="Maintenance resolved"     sub="When your request is fixed"/>
              <Toggle k="smsNotice"      label="Urgent notices only"      sub="Only high-priority alerts"/>
            </div>
          </div>
        )}

        {/* Security */}
        {tab==="Security"&&(
          <div className="a3 two-col">
            <div className="glass-card">
              <div style={{fontSize:15,fontWeight:700,color:"#e2e8f0",marginBottom:20}}>Change Password</div>
              {["Current Password","New Password","Confirm New Password"].map(f=>(
                <div key={f} style={{marginBottom:14}}>
                  <div style={{fontSize:11,fontWeight:600,color:"#94a3b8",textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:6}}>{f}</div>
                  <input className="inp" type="password" placeholder="••••••••"/>
                </div>
              ))}
              <button className="save-btn">Update Password</button>
            </div>
            <div className="glass-card">
              <div style={{fontSize:15,fontWeight:700,color:"#e2e8f0",marginBottom:20}}>Security Options</div>
              <Toggle k="twoFactor" label="Two-Factor Authentication" sub="Adds an extra layer of security"/>
              <div style={{marginTop:20,padding:"14px",background:"rgba(6,182,212,0.06)",border:"1px solid rgba(6,182,212,0.15)",borderRadius:10}}>
                <div style={{fontSize:13,fontWeight:600,color:"#06b6d4",marginBottom:4}}>🔒 Login Activity</div>
                <div style={{fontSize:12,color:"#94a3b8",marginBottom:10}}>Last login: Today at 9:15 AM from Chennai, IN</div>
                <div style={{fontSize:12,color:"#94a3b8",marginBottom:10}}>1 device currently active</div>
                <button style={{padding:"6px 14px",background:"rgba(244,63,94,0.08)",border:"1px solid rgba(244,63,94,0.2)",borderRadius:8,color:"#f43f5e",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>Sign out all devices</button>
              </div>
              <div style={{marginTop:14,padding:"13px 14px",background:"rgba(245,158,11,0.06)",border:"1px solid rgba(245,158,11,0.15)",borderRadius:10,fontSize:12,color:"#94a3b8",lineHeight:1.5}}>
                <div style={{fontWeight:600,color:"#f59e0b",marginBottom:4}}>⚠️ Privacy Note</div>
                Your data is encrypted and never shared with third parties without your consent.
              </div>
            </div>
          </div>
        )}

        {/* Preferences */}
        {tab==="Preferences"&&(
          <div className="a3 two-col">
            <div className="glass-card">
              <div style={{fontSize:15,fontWeight:700,color:"#e2e8f0",marginBottom:6}}>App Preferences</div>
              <div style={{fontSize:12,color:"#4a6080",marginBottom:16}}>Customize your portal experience</div>
              <Toggle k="darkMode"    label="Dark Mode"       sub="Default and recommended"/>
              <Toggle k="compactView" label="Compact View"    sub="Denser layout on list pages"/>
              <Toggle k="soundAlerts" label="Sound Alerts"    sub="Play a sound on new messages"/>
            </div>
            <div className="glass-card">
              <div style={{fontSize:15,fontWeight:700,color:"#e2e8f0",marginBottom:20}}>Regional Settings</div>
              {[
                {label:"Currency",   val:"INR (₹)"},
                {label:"Date Format",val:"DD/MM/YYYY"},
                {label:"Time Zone",  val:"IST (UTC+5:30)"},
                {label:"Language",   val:"English"},
              ].map(f=>(
                <div key={f.label} style={{marginBottom:14}}>
                  <div style={{fontSize:11,fontWeight:600,color:"#94a3b8",textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:6}}>{f.label}</div>
                  <input className="inp" defaultValue={f.val}/>
                </div>
              ))}
              <button className="save-btn">Save Preferences</button>
            </div>
          </div>
        )}
      </main>
    </>
  );
}