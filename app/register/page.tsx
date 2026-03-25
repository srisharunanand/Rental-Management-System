"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authAPI } from "../services/api";
type Role = "tenant" | "owner";

export default function RegisterPage() {
  const router = useRouter();
  const [role,      setRole]      = useState<Role>("tenant");
  const [name,      setName]      = useState("");
  const [email,     setEmail]     = useState("");
  const [phone,     setPhone]     = useState("");
  const [password,  setPassword]  = useState("");
  const [confirm,   setConfirm]   = useState("");
  const [showPw,    setShowPw]    = useState(false);
  const [loading,   setLoading]   = useState(false);
  const [error,     setError]     = useState("");


const handleRegister = async () => {
  if (!name || !email || !password || !phone || !role) {
    setError("Please fill all fields");
    return;
  }
  if (password !== confirm) {
    setError("Passwords do not match");
    return;
  }

  setLoading(true);
  setError("");

  try {
    const response = await authAPI.register({
      full_name: name,      // ← was fullName, yours is name
      email,
      password,
      phone,
      role,
    });

    const { user, token } = response.data;

    // Save to localStorage
    localStorage.setItem(
      "rentmanager_user",
      JSON.stringify({ ...user, token })
    );

    // Set role cookie
    document.cookie = `role=${user.role}; path=/; max-age=${60 * 60 * 24 * 30}`;

    // Redirect to correct dashboard
    if (user.role === "owner") {
      router.push("/owner/dashboard");
    } else {
      router.push("/tenant/dashboard");
    }

  } catch (err: unknown) {
    if (err instanceof Error) {
      setError(err.message);
    } else {
      setError("Registration failed. Please try again.");
    }
  } finally {
    setLoading(false);
  }
};

  const ROLE_CONFIG = {
    tenant: { color:"#06b6d4", bg:"rgba(6,182,212,0.1)", border:"rgba(6,182,212,0.3)", icon:"👤", label:"Tenant", sub:"I rent a property" },
    owner:  { color:"#8b5cf6", bg:"rgba(139,92,246,0.1)", border:"rgba(139,92,246,0.3)", icon:"🏠", label:"Property Owner", sub:"I own properties" },
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        html,body{height:100%;font-family:'Plus Jakarta Sans',sans-serif;background:#080e1a;color:#e2e8f0}
        ::-webkit-scrollbar{width:4px}::-webkit-scrollbar-thumb{background:#1e2d47;border-radius:4px}
        @keyframes fadeUp{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}}
        @keyframes pulse-ring{0%{transform:scale(1);opacity:.5}100%{transform:scale(1.7);opacity:0}}
        @keyframes blobFloat1{0%,100%{transform:translate(0,0)}50%{transform:translate(40px,-30px)}}
        @keyframes blobFloat2{0%,100%{transform:translate(0,0)}50%{transform:translate(-40px,30px)}}
        @keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
        .card{animation:fadeUp .45s ease both .05s;background:#0d1526;border:1px solid #1e2d47;border-radius:20px;padding:clamp(24px,4vw,36px);width:100%;max-width:440px;position:relative}
        .card::before{content:'';position:absolute;top:-1px;left:20%;right:20%;height:1px;background:linear-gradient(90deg,transparent,rgba(6,182,212,0.5),transparent)}
        .inp{width:100%;padding:11px 14px;background:rgba(255,255,255,0.04);border:1px solid #1e2d47;border-radius:10px;color:#e2e8f0;font-size:13px;font-family:inherit;outline:none;transition:border-color .2s,box-shadow .2s}
        .inp:focus{border-color:rgba(6,182,212,0.6);box-shadow:0 0 0 3px rgba(6,182,212,0.08)}
        .inp::placeholder{color:#2d4060}
        .submit-btn{width:100%;padding:13px;border:none;border-radius:11px;font-size:14px;font-weight:700;color:white;cursor:pointer;font-family:inherit;transition:transform .15s,box-shadow .15s;background:linear-gradient(135deg,#06b6d4,#8b5cf6)}
        .submit-btn:hover:not(:disabled){transform:translateY(-1px);box-shadow:0 8px 24px rgba(6,182,212,0.35)}
        .submit-btn:disabled{opacity:0.7;cursor:not-allowed}
        .role-card{flex:1;padding:13px 10px;border-radius:12px;border:1px solid #1e2d47;background:rgba(255,255,255,0.02);cursor:pointer;transition:all .2s;text-align:center}
        .spinner{width:18px;height:18px;border:2.5px solid rgba(255,255,255,0.3);border-top-color:white;border-radius:50%;animation:spin .7s linear infinite;display:inline-block}
      `}</style>

      {/* Background blobs */}
      <div style={{position:"fixed",inset:0,overflow:"hidden",pointerEvents:"none"}}>
        <div style={{position:"absolute",width:"clamp(300px,40vw,500px)",height:"clamp(300px,40vw,500px)",borderRadius:"50%",background:`radial-gradient(circle,${role==="tenant"?"rgba(6,182,212,0.12)":"rgba(139,92,246,0.12)"},transparent 70%)`,top:"-10%",left:"-15%",animation:"blobFloat1 10s ease-in-out infinite",transition:"background 0.6s"}}/>
        <div style={{position:"absolute",width:"clamp(250px,35vw,450px)",height:"clamp(250px,35vw,450px)",borderRadius:"50%",background:`radial-gradient(circle,${role==="owner"?"rgba(139,92,246,0.12)":"rgba(6,182,212,0.08)"},transparent 70%)`,bottom:"-10%",right:"-10%",animation:"blobFloat2 13s ease-in-out infinite",transition:"background 0.6s"}}/>
        <div style={{position:"absolute",inset:0,backgroundImage:"linear-gradient(rgba(6,182,212,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(6,182,212,0.03) 1px,transparent 1px)",backgroundSize:"40px 40px"}}/>
      </div>

      <div style={{position:"relative",zIndex:1,minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"24px",overflowY:"auto"}}>

        {/* Logo */}
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:24}}>
          <div style={{position:"relative",width:36,height:36,borderRadius:10,background:"linear-gradient(135deg,#06b6d4,#8b5cf6)",display:"grid",placeItems:"center",fontSize:18,boxShadow:"0 0 20px rgba(6,182,212,0.3)"}}>
            🏠<div style={{position:"absolute",inset:-4,borderRadius:14,border:"1.5px solid rgba(6,182,212,0.3)",animation:"pulse-ring 2s ease-out infinite",pointerEvents:"none"}}/>
          </div>
          <div>
            <div style={{fontSize:16,fontWeight:700,color:"#e2e8f0",letterSpacing:"-0.02em"}}>RentManager</div>
            <div style={{fontSize:9,color:"#4a6080",textTransform:"uppercase",letterSpacing:"0.1em"}}>Property OS</div>
          </div>
        </div>

        <div className="card">
          <div style={{textAlign:"center",marginBottom:22}}>
            <div style={{fontSize:22,fontWeight:800,color:"#e2e8f0",letterSpacing:"-0.02em",marginBottom:4}}>Create Account</div>
            <div style={{fontSize:13,color:"#4a6080"}}>Join RentManager today</div>
          </div>

          {/* Role selector */}
          <div style={{marginBottom:20}}>
            <div style={{fontSize:11,fontWeight:600,color:"#94a3b8",textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:8}}>I am a</div>
            <div style={{display:"flex",gap:10}}>
              {(["tenant","owner"] as Role[]).map(r=>{
                const cfg = ROLE_CONFIG[r];
                const active = role === r;
                return (
                  <div key={r} className="role-card"
                    onClick={()=>setRole(r)}
                    style={{borderColor:active?cfg.border:"#1e2d47",background:active?cfg.bg:"rgba(255,255,255,0.02)"}}>
                    <div style={{fontSize:24,marginBottom:4}}>{cfg.icon}</div>
                    <div style={{fontSize:13,fontWeight:700,color:active?cfg.color:"#94a3b8"}}>{cfg.label}</div>
                    <div style={{fontSize:10,color:active?cfg.color:"#4a6080",marginTop:2}}>{cfg.sub}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Fields */}
          <div style={{display:"flex",flexDirection:"column",gap:13}}>
            <div>
              <div style={{fontSize:11,fontWeight:600,color:"#94a3b8",textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:6}}>Full Name</div>
              <input className="inp" placeholder="e.g. Rahul Krishnan" value={name} onChange={e=>setName(e.target.value)}/>
            </div>
            <div>
              <div style={{fontSize:11,fontWeight:600,color:"#94a3b8",textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:6}}>Email Address</div>
              <input className="inp" type="email" placeholder="you@example.com" value={email} onChange={e=>setEmail(e.target.value)}/>
            </div>
            <div>
              <div style={{fontSize:11,fontWeight:600,color:"#94a3b8",textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:6}}>Phone Number</div>
              <input className="inp" placeholder="+91 98400 XXXXX" value={phone} onChange={e=>setPhone(e.target.value)}/>
            </div>
            <div>
              <div style={{fontSize:11,fontWeight:600,color:"#94a3b8",textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:6}}>Password</div>
              <div style={{position:"relative"}}>
                <input className="inp" type={showPw?"text":"password"} placeholder="Min. 8 characters" value={password} onChange={e=>setPassword(e.target.value)} style={{paddingRight:44}}/>
                <button onClick={()=>setShowPw(p=>!p)} style={{position:"absolute",right:12,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",color:"#4a6080",cursor:"pointer",fontSize:15,fontFamily:"inherit",lineHeight:1}}>
                  {showPw?"🙈":"👁️"}
                </button>
              </div>
              {/* Strength bar */}
              {password.length > 0 && (
                <div style={{marginTop:6}}>
                  <div style={{height:3,background:"#1e2d47",borderRadius:2,overflow:"hidden"}}>
                    <div style={{height:"100%",width:`${Math.min(100,(password.length/10)*100)}%`,background:password.length>=8?"#22c55e":password.length>=5?"#f59e0b":"#f43f5e",borderRadius:2,transition:"all .3s"}}/>
                  </div>
                  <div style={{fontSize:10,color:password.length>=8?"#22c55e":password.length>=5?"#f59e0b":"#f43f5e",marginTop:3,fontWeight:600}}>
                    {password.length>=8?"Strong":password.length>=5?"Fair":"Too short"}
                  </div>
                </div>
              )}
            </div>
            <div>
              <div style={{fontSize:11,fontWeight:600,color:"#94a3b8",textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:6}}>Confirm Password</div>
              <input className="inp" type={showPw?"text":"password"} placeholder="Repeat password" value={confirm} onChange={e=>setConfirm(e.target.value)}/>
              {confirm && password !== confirm && (
                <div style={{fontSize:11,color:"#f43f5e",marginTop:4}}>⚠ Passwords do not match</div>
              )}
            </div>
          </div>

        {error && (
  <div style={{
    background: "rgba(244,63,94,0.1)",
    border: "1px solid rgba(244,63,94,0.3)",
    borderRadius: 8,
    padding: "10px 14px",
    color: "#f43f5e",
    fontSize: 13,
    marginBottom: 12,
    textAlign: "center"
  }}>
    ⚠️ {error}
  </div>
)}

          {/* Submit */}
          <button type="button" className="submit-btn" onClick={handleRegister} disabled={loading} style={{marginTop:18,background:role==="owner"?"linear-gradient(135deg,#8b5cf6,#6366f1)":"linear-gradient(135deg,#06b6d4,#8b5cf6)"}}>
            {loading ? <span className="spinner"/> : `Create ${ROLE_CONFIG[role].label} Account →`}
          </button>

          <div style={{textAlign:"center",marginTop:18,fontSize:13,color:"#4a6080"}}>
            Already have an account?{" "}
            <Link href="/login" style={{color:"#06b6d4",fontWeight:600,textDecoration:"none"}}>Sign in</Link>
          </div>
        </div>
      </div>
    </>
  );
}