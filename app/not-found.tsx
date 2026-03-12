"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function NotFound() {
  const router = useRouter();
  const [count, setCount] = useState(10);

useEffect(() => {
  const t = setInterval(() => {
    setCount(c => {
      if (c <= 1) { clearInterval(t); return 0; }
      return c - 1;
    });
  }, 1000);
  return () => clearInterval(t);
}, []);

useEffect(() => {
  if (count === 0) router.push("/login");
}, [count]);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        html,body{height:100%;font-family:'Plus Jakarta Sans',sans-serif;background:#080e1a;color:#e2e8f0}
        @keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
        @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-16px)}}
        @keyframes pulse-ring{0%{transform:scale(1);opacity:.5}100%{transform:scale(1.8);opacity:0}}
        @keyframes blobFloat1{0%,100%{transform:translate(0,0)}50%{transform:translate(40px,-30px)}}
        @keyframes blobFloat2{0%,100%{transform:translate(0,0)}50%{transform:translate(-40px,30px)}}
        .a1{animation:fadeUp .5s ease both .1s}.a2{animation:fadeUp .5s ease both .2s}
        .a3{animation:fadeUp .5s ease both .3s}.a4{animation:fadeUp .5s ease both .4s}
        .float-anim{animation:float 3s ease-in-out infinite}
        .btn-primary{background:linear-gradient(135deg,#06b6d4,#8b5cf6);border:none;border-radius:12px;padding:13px 28px;font-size:14px;font-weight:700;color:white;cursor:pointer;font-family:inherit;transition:transform .15s,box-shadow .15s;text-decoration:none;display:inline-flex;align-items:center;gap:8px}
        .btn-primary:hover{transform:translateY(-2px);box-shadow:0 8px 24px rgba(6,182,212,0.35)}
        .btn-secondary{background:rgba(255,255,255,0.04);border:1px solid #1e2d47;border-radius:12px;padding:13px 28px;font-size:14px;font-weight:600;color:#94a3b8;cursor:pointer;font-family:inherit;transition:all .15s;text-decoration:none;display:inline-flex;align-items:center;gap:8px}
        .btn-secondary:hover{background:rgba(255,255,255,0.07);color:#e2e8f0;border-color:#334155}
      `}</style>

      <div style={{position:"fixed",inset:0,overflow:"hidden",pointerEvents:"none",zIndex:0}}>
        <div style={{position:"absolute",width:"clamp(300px,40vw,500px)",height:"clamp(300px,40vw,500px)",borderRadius:"50%",background:"radial-gradient(circle,rgba(6,182,212,0.12),transparent 70%)",top:"-10%",left:"-10%",animation:"blobFloat1 10s ease-in-out infinite"}}/>
        <div style={{position:"absolute",width:"clamp(250px,35vw,450px)",height:"clamp(250px,35vw,450px)",borderRadius:"50%",background:"radial-gradient(circle,rgba(139,92,246,0.1),transparent 70%)",bottom:"-10%",right:"-10%",animation:"blobFloat2 13s ease-in-out infinite"}}/>
        <div style={{position:"absolute",inset:0,backgroundImage:"linear-gradient(rgba(6,182,212,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(6,182,212,0.03) 1px,transparent 1px)",backgroundSize:"40px 40px"}}/>
      </div>

      <div style={{position:"relative",zIndex:1,minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"24px",textAlign:"center"}}>

        <div className="float-anim a1" style={{marginBottom:32,position:"relative"}}>
          <div style={{position:"absolute",inset:-16,borderRadius:"50%",border:"1.5px solid rgba(6,182,212,0.2)",animation:"pulse-ring 2.5s ease-out infinite"}}/>
          <div style={{position:"absolute",inset:-32,borderRadius:"50%",border:"1px solid rgba(139,92,246,0.1)",animation:"pulse-ring 2.5s ease-out infinite .8s"}}/>
          <div style={{width:100,height:100,borderRadius:"50%",background:"linear-gradient(135deg,rgba(6,182,212,0.15),rgba(139,92,246,0.15))",border:"1.5px solid rgba(6,182,212,0.3)",display:"grid",placeItems:"center",fontSize:44,boxShadow:"0 0 40px rgba(6,182,212,0.15)"}}>
            🔍
          </div>
        </div>

        <div className="a1" style={{fontSize:"clamp(72px,15vw,140px)",fontWeight:800,letterSpacing:"-0.04em",lineHeight:1,marginBottom:8,background:"linear-gradient(135deg,#06b6d4,#8b5cf6)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text"}}>
          404
        </div>

        <div className="a2" style={{fontSize:"clamp(18px,3vw,26px)",fontWeight:700,color:"#e2e8f0",marginBottom:10,letterSpacing:"-0.02em"}}>
          Page Not Found
        </div>

        <div className="a2" style={{fontSize:"clamp(13px,1.8vw,15px)",color:"#4a6080",marginBottom:36,maxWidth:400,lineHeight:1.7}}>
          The page you're looking for doesn't exist or may have been moved. Let's get you back on track.
        </div>

        <div className="a3" style={{display:"flex",gap:12,flexWrap:"wrap",justifyContent:"center",marginBottom:40}}>
          <Link href="/login" className="btn-primary">🏠 Go to Login</Link>
          <button onClick={()=>router.back()} className="btn-secondary">← Go Back</button>
        </div>

        <div className="a4" style={{display:"flex",flexDirection:"column",alignItems:"center",gap:10}}>
          <div style={{position:"relative",width:64,height:64}}>
            <svg width={64} height={64} viewBox="0 0 100 100" style={{transform:"rotate(-90deg)"}}>
              <circle cx={50} cy={50} r={45} fill="none" stroke="#1e2d47" strokeWidth={6}/>
              <circle cx={50} cy={50} r={45} fill="none" stroke="#06b6d4" strokeWidth={6}
                strokeDasharray={283} strokeDashoffset={283-(count/10)*283} strokeLinecap="round"
                style={{transition:"stroke-dashoffset 1s linear"}}/>
            </svg>
            <div style={{position:"absolute",inset:0,display:"grid",placeItems:"center",fontSize:18,fontWeight:800,color:"#06b6d4"}}>{count}</div>
          </div>
          <div style={{fontSize:12,color:"#4a6080"}}>Redirecting to login in {count}s</div>
        </div>

        <div className="a4" style={{marginTop:44,display:"flex",gap:24,flexWrap:"wrap",justifyContent:"center"}}>
          {[
            {label:"Owner Dashboard",href:"/owner/dashboard",icon:"⚡"},
            {label:"Tenant Dashboard",href:"/tenant/dashboard",icon:"🏠"},
            {label:"Register",href:"/register",icon:"📝"},
          ].map(l=>(
            <Link key={l.href} href={l.href} style={{fontSize:12,color:"#4a6080",textDecoration:"none",display:"flex",alignItems:"center",gap:5,transition:"color .15s"}}
              onMouseEnter={e=>(e.currentTarget as HTMLAnchorElement).style.color="#06b6d4"}
              onMouseLeave={e=>(e.currentTarget as HTMLAnchorElement).style.color="#4a6080"}>
              <span>{l.icon}</span>{l.label}
            </Link>
          ))}
        </div>

        <div className="a4" style={{marginTop:44,display:"flex",alignItems:"center",gap:8}}>
          <div style={{width:28,height:28,borderRadius:7,background:"linear-gradient(135deg,#06b6d4,#8b5cf6)",display:"grid",placeItems:"center",fontSize:13}}>🏠</div>
          <span style={{fontSize:13,fontWeight:700,color:"#4a6080"}}>RentManager</span>
        </div>
      </div>
    </>
  );
}