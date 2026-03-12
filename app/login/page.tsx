"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { saveUser, type UserRole } from "../utils/auth";

export default function LoginPage() {
  const router = useRouter();
  const [role,     setRole]     = useState<UserRole>("owner");
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [loading,  setLoading]  = useState(false);
  const [mounted,  setMounted]  = useState(false);
  const [focused,  setFocused]  = useState<string | null>(null);
  const [btnHover, setBtnHover] = useState(false);

  useEffect(() => setMounted(true), []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      // 1️⃣  Save role to localStorage (for client-side helpers)
      saveUser({ name: role === "owner" ? "Arjun Kumar" : "Rahul Krishnan", email, role });

      // 2️⃣  Set cookie so middleware can protect routes on the server
      document.cookie = `role=${role}; path=/; max-age=${60 * 60 * 24 * 7}`; // 7 days

      // 3️⃣  Route without reload
      setLoading(false);
      router.push(role === "owner" ? "/owner/dashboard" : "/tenant/dashboard");
    }, 1600);
  };

  const inputStyle = (field: string): React.CSSProperties => ({
    width: "100%", padding: "12px 16px", fontSize: "14px",
    color: "#f1f5f9",
    background: focused === field ? "rgba(37,99,235,0.08)" : "rgba(255,255,255,0.04)",
    border: `1.5px solid ${focused === field ? "rgba(37,99,235,0.6)" : "rgba(255,255,255,0.08)"}`,
    borderRadius: "10px", outline: "none", transition: "all 0.2s",
    boxShadow: focused === field ? "0 0 0 3px rgba(37,99,235,0.12)" : "none",
    fontFamily: "'DM Sans', sans-serif",
  });

  // Role colours
  const RC = {
    owner:  { active: "#06b6d4", glow: "rgba(6,182,212,0.25)",  icon: "🏠", title: "Owner",  sub: "Manage properties & tenants" },
    tenant: { active: "#8b5cf6", glow: "rgba(139,92,246,0.25)", icon: "👤", title: "Tenant", sub: "View rent, requests & notices" },
  };
  const activeColor = RC[role].active;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'DM Sans', sans-serif; }

        @keyframes fadeUp {
          from { opacity:0; transform:translateY(24px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes float1 { 0%,100%{transform:translateY(0) translateX(0)} 33%{transform:translateY(-18px) translateX(10px)} 66%{transform:translateY(10px) translateX(-8px)} }
        @keyframes float2 { 0%,100%{transform:translateY(0) translateX(0)} 40%{transform:translateY(14px) translateX(-12px)} 70%{transform:translateY(-10px) translateX(8px)} }
        @keyframes float3 { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-20px)} }
        @keyframes pulse-ring { 0%{transform:scale(1);opacity:.4} 100%{transform:scale(1.6);opacity:0} }
        @keyframes spin-slow  { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes shimmer    { 0%{background-position:-200% center} 100%{background-position:200% center} }
        @keyframes dots { 0%,80%,100%{opacity:0;transform:scale(.8)} 40%{opacity:1;transform:scale(1)} }

        .blob1     { animation: float1    9s ease-in-out infinite; }
        .blob2     { animation: float2   12s ease-in-out infinite; }
        .blob3     { animation: float3    7s ease-in-out infinite; }
        .deco-spin { animation: spin-slow 18s linear      infinite; }

        .card-enter { animation: fadeUp 0.6s cubic-bezier(0.22,1,0.36,1) both 0.1s; }
        .f1{animation:fadeUp .5s ease both .20s} .f2{animation:fadeUp .5s ease both .28s}
        .f3{animation:fadeUp .5s ease both .36s} .f4{animation:fadeUp .5s ease both .44s}
        .f5{animation:fadeUp .5s ease both .50s}

        .dot1{animation:dots 1.2s infinite ease-in-out 0.0s}
        .dot2{animation:dots 1.2s infinite ease-in-out 0.2s}
        .dot3{animation:dots 1.2s infinite ease-in-out 0.4s}

        .shimmer-btn {
          background-size: 200% auto;
          animation: shimmer 2.5s linear infinite;
        }
        .ring-pulse::after {
          content:''; position:absolute; inset:-4px; border-radius:50%;
          border:2px solid #3b82f6; animation:pulse-ring 1.8s ease-out infinite;
        }

        input::placeholder { color: #334155; }

        /* Role toggle cards */
        .role-card {
          flex: 1; padding: 12px 10px; border-radius: 12px;
          border: 1.5px solid #1a2942; background: rgba(255,255,255,0.03);
          cursor: pointer; transition: all .2s; text-align: center;
        }
        .role-card:hover { border-color: rgba(255,255,255,0.15); }

        /* Scrollable on very short screens */
        .auth-card { padding: clamp(22px,5vw,44px) clamp(18px,5vw,38px); }
        @media(max-height:640px){ .auth-card{ max-height:95vh; overflow-y:auto; } }
        @media(max-width:360px) { .auth-card{ border-radius:14px !important; } }

        .nav-link:hover { text-decoration: underline; }
      `}</style>

      <main style={{
        minHeight: "100vh", background: "#0f172a",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontFamily: "'DM Sans', sans-serif", padding: "16px",
        position: "relative", overflow: "hidden",
      }}>

        {/* Blobs */}
        <div className="blob1" style={{ position:"absolute", top:"-10%", left:"-5%", width:"clamp(180px,45vw,500px)", height:"clamp(180px,45vw,500px)", borderRadius:"50%", background:`radial-gradient(circle,${RC[role].glow} 0%,transparent 70%)`, transition:"background 0.4s", pointerEvents:"none" }} />
        <div className="blob2" style={{ position:"absolute", bottom:"-15%", right:"-5%", width:"clamp(200px,50vw,600px)", height:"clamp(200px,50vw,600px)", borderRadius:"50%", background:`radial-gradient(circle,rgba(99,102,241,0.14) 0%,transparent 70%)`, pointerEvents:"none" }} />
        <div className="blob3" style={{ position:"absolute", top:"40%", right:"20%", width:"clamp(80px,25vw,300px)", height:"clamp(80px,25vw,300px)", borderRadius:"50%", background:"radial-gradient(circle,rgba(14,165,233,0.10) 0%,transparent 70%)", pointerEvents:"none" }} />
        <div className="deco-spin" style={{ position:"absolute", top:"8%", right:"8%", width:"120px", height:"120px", borderRadius:"50%", border:"1.5px dashed rgba(99,102,241,0.2)", pointerEvents:"none" }} />
        <div style={{ position:"absolute", inset:0, backgroundImage:"linear-gradient(rgba(255,255,255,0.02) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.02) 1px,transparent 1px)", backgroundSize:"48px 48px", pointerEvents:"none" }} />

        {mounted && (
          <div
            className="card-enter auth-card"
            style={{
              background: "rgba(255,255,255,0.04)", backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "20px", width: "100%", maxWidth: "430px",
              position: "relative", zIndex: 10,
              boxShadow: "0 24px 64px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.08)",
              transition: "box-shadow 0.4s",
            }}
          >

            {/* Logo */}
            <div className="f1" style={{ display:"flex", alignItems:"center", gap:"12px", marginBottom:"26px" }}>
              <div className="ring-pulse" style={{ position:"relative", width:"42px", height:"42px", background:"linear-gradient(135deg,#2563eb,#6366f1)", borderRadius:"12px", display:"grid", placeItems:"center", fontSize:"20px", boxShadow:"0 4px 16px rgba(37,99,235,0.4)", flexShrink:0 }}>
                🏠
              </div>
              <div>
                <div style={{ fontSize:"17px", fontWeight:700, color:"#f1f5f9", letterSpacing:"-0.02em" }}>RentManager</div>
                <div style={{ fontSize:"11px", color:"#64748b", letterSpacing:"0.06em", textTransform:"uppercase" }}>Property Portal</div>
              </div>
            </div>

            {/* Heading */}
            <div className="f1" style={{ marginBottom:"22px" }}>
              <h1 style={{ fontSize:"clamp(20px,5vw,25px)", fontWeight:700, color:"#f1f5f9", letterSpacing:"-0.02em" }}>
                Welcome back
              </h1>
              <p style={{ fontSize:"13px", color:"#64748b", marginTop:4 }}>
                Choose your role to continue
              </p>
            </div>

            {/* ── Role Toggle ─────────────────────────────────────────────── */}
            <div className="f2" style={{ display:"flex", gap:10, marginBottom:22 }}>
              {(["owner", "tenant"] as UserRole[]).map(r => {
                const isActive = role === r;
                const c = RC[r];
                return (
                  <div
                    key={r}
                    className="role-card"
                    onClick={() => setRole(r)}
                    style={{
                      borderColor: isActive ? c.active : "#1a2942",
                      background:  isActive ? `rgba(${r === "owner" ? "6,182,212" : "139,92,246"},0.08)` : "rgba(255,255,255,0.03)",
                      boxShadow:   isActive ? `0 0 0 1px ${c.active}40` : "none",
                    }}
                  >
                    <div style={{ fontSize:22, marginBottom:5 }}>{c.icon}</div>
                    <div style={{ fontSize:13, fontWeight:700, color: isActive ? c.active : "#94a3b8", marginBottom:2 }}>{c.title}</div>
                    <div style={{ fontSize:10, color:"#475569", lineHeight:1.4 }}>{c.sub}</div>
                  </div>
                );
              })}
            </div>

            {/* Form */}
            <form onSubmit={handleLogin} style={{ display:"flex", flexDirection:"column", gap:"16px" }}>

              {/* Email */}
              <div className="f3" style={{ display:"flex", flexDirection:"column", gap:"6px" }}>
                <label style={{ fontSize:"12px", fontWeight:600, color:"#94a3b8", textTransform:"uppercase", letterSpacing:"0.08em" }}>
                  Email Address
                </label>
                <input
                  type="email" placeholder="you@example.com"
                  value={email} onChange={e => setEmail(e.target.value)} required
                  onFocus={() => setFocused("email")} onBlur={() => setFocused(null)}
                  style={inputStyle("email")}
                />
              </div>

              {/* Password */}
              <div className="f3" style={{ display:"flex", flexDirection:"column", gap:"6px" }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                  <label style={{ fontSize:"12px", fontWeight:600, color:"#94a3b8", textTransform:"uppercase", letterSpacing:"0.08em" }}>
                    Password
                  </label>
                 
<Link href="/forgot-password" style={{fontSize:12,color:"#4a6080"}}>Forgot password?</Link>
                </div>
                <input
                  type="password" placeholder="••••••••"
                  value={password} onChange={e => setPassword(e.target.value)} required
                  onFocus={() => setFocused("password")} onBlur={() => setFocused(null)}
                  style={inputStyle("password")}
                />
              </div>

              {/* Submit */}
              <div className="f4">
                <button
                  type="submit" disabled={loading}
                  onMouseEnter={() => setBtnHover(true)}
                  onMouseLeave={() => setBtnHover(false)}
                  className={!loading ? "shimmer-btn" : ""}
                  style={{
                    width: "100%", padding: "13px",
                    fontSize: "14px", fontWeight: 600, color: "#ffffff",
                    background: loading
                      ? "#1e3a8a"
                      : `linear-gradient(90deg, ${activeColor} 0%, #6366f1 40%, ${activeColor} 60%, #1d4ed8 100%)`,
                    border: "none", borderRadius: "10px", marginTop: "2px",
                    cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.85 : 1,
                    transform: btnHover && !loading ? "translateY(-1px)" : "translateY(0)",
                    boxShadow: btnHover && !loading ? `0 8px 24px ${RC[role].glow}` : `0 4px 12px rgba(37,99,235,0.25)`,
                    transition: "transform 0.2s, box-shadow 0.2s, background 0.3s",
                    display: "flex", alignItems: "center", justifyContent: "center", gap: "10px",
                    fontFamily: "'DM Sans', sans-serif",
                  }}
                >
                  {loading ? (
                    <>
                      Signing in as {role === "owner" ? "Owner" : "Tenant"}
                      <span style={{ display:"flex", gap:"4px", alignItems:"center" }}>
                        <span className="dot1" style={{ width:"5px", height:"5px", borderRadius:"50%", background:"white", display:"inline-block" }} />
                        <span className="dot2" style={{ width:"5px", height:"5px", borderRadius:"50%", background:"white", display:"inline-block" }} />
                        <span className="dot3" style={{ width:"5px", height:"5px", borderRadius:"50%", background:"white", display:"inline-block" }} />
                      </span>
                    </>
                  ) : (
                    `Sign in as ${role === "owner" ? "Owner 🏠" : "Tenant 👤"} →`
                  )}
                </button>
              </div>
            </form>

            {/* Register link */}
            <p className="f5" style={{ marginTop:"22px", textAlign:"center", fontSize:"13px", color:"#475569" }}>
              Don&apos;t have an account?{" "}
              <Link href="/register" className="nav-link" style={{ color:"#3b82f6", textDecoration:"none", fontWeight:600 }}>
                Register here
              </Link>
            </p>

            {/* Bottom glow */}
            <div style={{ position:"absolute", bottom:0, left:"20%", right:"20%", height:"1px", background:`linear-gradient(90deg,transparent,${activeColor}80,transparent)`, transition:"background 0.3s" }} />
          </div>
        )}
      </main>
    </>
  );
}