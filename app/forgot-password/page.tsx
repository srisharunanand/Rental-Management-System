"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type Step = "email" | "otp" | "reset" | "done";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [step,     setStep]     = useState<Step>("email");
  const [email,    setEmail]    = useState("");
  const [otp,      setOtp]      = useState(["","","","","",""]);
  const [password, setPassword] = useState("");
  const [confirm,  setConfirm]  = useState("");
  const [loading,  setLoading]  = useState(false);
  const [showPw,   setShowPw]   = useState(false);

  const handleSend = () => {
    if (!email) return;
    setLoading(true);
    setTimeout(() => { setLoading(false); setStep("otp"); }, 1200);
  };

  const handleOtp = () => {
    if (otp.join("").length < 6) return;
    setLoading(true);
    setTimeout(() => { setLoading(false); setStep("reset"); }, 1000);
  };

  const handleReset = () => {
    if (!password || password !== confirm) return;
    setLoading(true);
    setTimeout(() => { setLoading(false); setStep("done"); }, 1200);
  };

  const handleOtpChange = (i: number, val: string) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...otp]; next[i] = val;
    setOtp(next);
    if (val && i < 5) {
      const el = document.getElementById(`otp-${i+1}`);
      if (el) (el as HTMLInputElement).focus();
    }
  };

  const handleOtpKey = (i: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[i] && i > 0) {
      const el = document.getElementById(`otp-${i-1}`);
      if (el) (el as HTMLInputElement).focus();
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        html,body{height:100%;font-family:'Plus Jakarta Sans',sans-serif;background:#080e1a;color:#e2e8f0}
        @keyframes fadeUp{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}}
        @keyframes pulse-ring{0%{transform:scale(1);opacity:.5}100%{transform:scale(1.7);opacity:0}}
        @keyframes blobFloat1{0%,100%{transform:translate(0,0)}50%{transform:translate(40px,-30px)}}
        @keyframes blobFloat2{0%,100%{transform:translate(0,0)}50%{transform:translate(-40px,30px)}}
        @keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
        @keyframes checkPop{0%{transform:scale(0)}80%{transform:scale(1.2)}100%{transform:scale(1)}}
        .card{animation:fadeUp .45s ease both .05s;background:#0d1526;border:1px solid #1e2d47;border-radius:20px;padding:clamp(24px,4vw,36px);width:100%;max-width:420px;position:relative}
        .card::before{content:'';position:absolute;top:-1px;left:20%;right:20%;height:1px;background:linear-gradient(90deg,transparent,rgba(6,182,212,0.5),transparent)}
        .inp{width:100%;padding:11px 14px;background:rgba(255,255,255,0.04);border:1px solid #1e2d47;border-radius:10px;color:#e2e8f0;font-size:14px;font-family:inherit;outline:none;transition:border-color .2s,box-shadow .2s}
        .inp:focus{border-color:rgba(6,182,212,0.6);box-shadow:0 0 0 3px rgba(6,182,212,0.08)}
        .inp::placeholder{color:#2d4060}
        .submit-btn{width:100%;padding:13px;background:linear-gradient(135deg,#06b6d4,#8b5cf6);border:none;border-radius:11px;font-size:14px;font-weight:700;color:white;cursor:pointer;font-family:inherit;transition:transform .15s,box-shadow .15s;position:relative;overflow:hidden}
        .submit-btn:hover:not(:disabled){transform:translateY(-1px);box-shadow:0 8px 24px rgba(6,182,212,0.35)}
        .submit-btn:disabled{opacity:0.7;cursor:not-allowed}
        .otp-input{width:46px;height:54px;border-radius:12px;background:rgba(255,255,255,0.04);border:1px solid #1e2d47;color:#e2e8f0;font-size:22px;font-weight:700;text-align:center;font-family:inherit;outline:none;transition:border-color .2s,box-shadow .2s}
        .otp-input:focus{border-color:rgba(6,182,212,0.6);box-shadow:0 0 0 3px rgba(6,182,212,0.08)}
        .step-dot{width:8px;height:8px;border-radius:50%;transition:all .3s}
        .check-pop{animation:checkPop .4s ease both}
        .spinner{width:18px;height:18px;border:2.5px solid rgba(255,255,255,0.3);border-top-color:white;border-radius:50%;animation:spin .7s linear infinite;display:inline-block}
      `}</style>

      {/* Background */}
      <div style={{position:"fixed",inset:0,overflow:"hidden",pointerEvents:"none"}}>
        <div style={{position:"absolute",width:"clamp(300px,40vw,500px)",height:"clamp(300px,40vw,500px)",borderRadius:"50%",background:"radial-gradient(circle,rgba(6,182,212,0.12),transparent 70%)",top:"-10%",left:"-15%",animation:"blobFloat1 10s ease-in-out infinite"}}/>
        <div style={{position:"absolute",width:"clamp(250px,35vw,450px)",height:"clamp(250px,35vw,450px)",borderRadius:"50%",background:"radial-gradient(circle,rgba(139,92,246,0.1),transparent 70%)",bottom:"-10%",right:"-10%",animation:"blobFloat2 13s ease-in-out infinite"}}/>
        <div style={{position:"absolute",inset:0,backgroundImage:"linear-gradient(rgba(6,182,212,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(6,182,212,0.03) 1px,transparent 1px)",backgroundSize:"40px 40px"}}/>
      </div>

      <div style={{position:"relative",zIndex:1,minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"24px"}}>

        {/* Logo */}
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:28}}>
          <div style={{position:"relative",width:36,height:36,borderRadius:10,background:"linear-gradient(135deg,#06b6d4,#8b5cf6)",display:"grid",placeItems:"center",fontSize:18,boxShadow:"0 0 20px rgba(6,182,212,0.3)"}}>
            🏠<div style={{position:"absolute",inset:-4,borderRadius:14,border:"1.5px solid rgba(6,182,212,0.3)",animation:"pulse-ring 2s ease-out infinite",pointerEvents:"none"}}/>
          </div>
          <div>
            <div style={{fontSize:16,fontWeight:700,color:"#e2e8f0",letterSpacing:"-0.02em"}}>RentManager</div>
            <div style={{fontSize:9,color:"#4a6080",textTransform:"uppercase",letterSpacing:"0.1em"}}>Property OS</div>
          </div>
        </div>

        {/* Step dots */}
        <div style={{display:"flex",gap:8,marginBottom:24}}>
          {(["email","otp","reset","done"] as Step[]).map((s,i)=>{
            const stepIdx = ["email","otp","reset","done"].indexOf(step);
            const thisIdx = i;
            const isActive = thisIdx === stepIdx;
            const isDone   = thisIdx < stepIdx;
            return (
              <div key={s} className="step-dot" style={{
                width: isActive ? 24 : 8,
                background: isDone ? "#22c55e" : isActive ? "#06b6d4" : "#1e2d47",
                borderRadius: 4,
              }}/>
            );
          })}
        </div>

        <div className="card">

          {/* ── STEP 1: Email ── */}
          {step==="email"&&(
            <>
              <div style={{textAlign:"center",marginBottom:26}}>
                <div style={{fontSize:36,marginBottom:10}}>🔐</div>
                <div style={{fontSize:22,fontWeight:800,color:"#e2e8f0",letterSpacing:"-0.02em",marginBottom:6}}>Forgot Password?</div>
                <div style={{fontSize:13,color:"#4a6080",lineHeight:1.6}}>No worries! Enter your registered email and we'll send you a reset code.</div>
              </div>
              <div style={{marginBottom:16}}>
                <div style={{fontSize:11,fontWeight:600,color:"#94a3b8",textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:7}}>Email Address</div>
                <input className="inp" type="email" placeholder="you@example.com" value={email} onChange={e=>setEmail(e.target.value)}
                  onKeyDown={e=>e.key==="Enter"&&handleSend()}/>
              </div>
              <button className="submit-btn" onClick={handleSend} disabled={loading||!email}>
                {loading ? <span className="spinner"/> : "Send Reset Code →"}
              </button>
              <div style={{textAlign:"center",marginTop:18}}>
                <Link href="/login" style={{fontSize:13,color:"#4a6080",textDecoration:"none",transition:"color .15s"}}
                  onMouseEnter={e=>(e.currentTarget as HTMLAnchorElement).style.color="#06b6d4"}
                  onMouseLeave={e=>(e.currentTarget as HTMLAnchorElement).style.color="#4a6080"}>
                  ← Back to login
                </Link>
              </div>
            </>
          )}

          {/* ── STEP 2: OTP ── */}
          {step==="otp"&&(
            <>
              <div style={{textAlign:"center",marginBottom:26}}>
                <div style={{fontSize:36,marginBottom:10}}>📱</div>
                <div style={{fontSize:22,fontWeight:800,color:"#e2e8f0",letterSpacing:"-0.02em",marginBottom:6}}>Enter OTP</div>
                <div style={{fontSize:13,color:"#4a6080",lineHeight:1.6}}>We've sent a 6-digit code to <span style={{color:"#06b6d4",fontWeight:600}}>{email}</span></div>
              </div>
              <div style={{display:"flex",gap:8,justifyContent:"center",marginBottom:22}}>
                {otp.map((v,i)=>(
                  <input key={i} id={`otp-${i}`} className="otp-input" maxLength={1} value={v}
                    onChange={e=>handleOtpChange(i,e.target.value)}
                    onKeyDown={e=>handleOtpKey(i,e)}/>
                ))}
              </div>
              <button className="submit-btn" onClick={handleOtp} disabled={loading||otp.join("").length<6}>
                {loading ? <span className="spinner"/> : "Verify Code →"}
              </button>
              <div style={{textAlign:"center",marginTop:16,fontSize:13,color:"#4a6080"}}>
                Didn't receive it?{" "}
                <button onClick={()=>setOtp(["","","","","",""])} style={{background:"none",border:"none",color:"#06b6d4",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>
                  Resend
                </button>
              </div>
            </>
          )}

          {/* ── STEP 3: New password ── */}
          {step==="reset"&&(
            <>
              <div style={{textAlign:"center",marginBottom:26}}>
                <div style={{fontSize:36,marginBottom:10}}>🔑</div>
                <div style={{fontSize:22,fontWeight:800,color:"#e2e8f0",letterSpacing:"-0.02em",marginBottom:6}}>New Password</div>
                <div style={{fontSize:13,color:"#4a6080",lineHeight:1.6}}>Choose a strong password for your account.</div>
              </div>
              <div style={{marginBottom:14}}>
                <div style={{fontSize:11,fontWeight:600,color:"#94a3b8",textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:7}}>New Password</div>
                <div style={{position:"relative"}}>
                  <input className="inp" type={showPw?"text":"password"} placeholder="Min. 8 characters" value={password} onChange={e=>setPassword(e.target.value)} style={{paddingRight:44}}/>
                  <button onClick={()=>setShowPw(p=>!p)} style={{position:"absolute",right:12,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",color:"#4a6080",cursor:"pointer",fontSize:16,fontFamily:"inherit",lineHeight:1}}>
                    {showPw?"🙈":"👁️"}
                  </button>
                </div>
              </div>
              <div style={{marginBottom:18}}>
                <div style={{fontSize:11,fontWeight:600,color:"#94a3b8",textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:7}}>Confirm Password</div>
                <input className="inp" type={showPw?"text":"password"} placeholder="Repeat password" value={confirm} onChange={e=>setConfirm(e.target.value)}/>
                {confirm && password !== confirm && (
                  <div style={{fontSize:11,color:"#f43f5e",marginTop:5}}>⚠ Passwords do not match</div>
                )}
              </div>
              {/* Strength bar */}
              {password && (
                <div style={{marginBottom:18}}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}>
                    <span style={{fontSize:11,color:"#4a6080"}}>Strength</span>
                    <span style={{fontSize:11,color:password.length>=8?"#22c55e":password.length>=5?"#f59e0b":"#f43f5e",fontWeight:600}}>
                      {password.length>=8?"Strong":password.length>=5?"Fair":"Weak"}
                    </span>
                  </div>
                  <div style={{height:4,background:"#1e2d47",borderRadius:2,overflow:"hidden"}}>
                    <div style={{height:"100%",width:`${Math.min(100,(password.length/10)*100)}%`,background:password.length>=8?"#22c55e":password.length>=5?"#f59e0b":"#f43f5e",borderRadius:2,transition:"width .3s,background .3s"}}/>
                  </div>
                </div>
              )}
              <button className="submit-btn" onClick={handleReset} disabled={loading||!password||password!==confirm||password.length<8}>
                {loading ? <span className="spinner"/> : "Reset Password →"}
              </button>
            </>
          )}

          {/* ── STEP 4: Done ── */}
          {step==="done"&&(
            <div style={{textAlign:"center",padding:"10px 0"}}>
              <div className="check-pop" style={{width:72,height:72,borderRadius:"50%",background:"rgba(34,197,94,0.12)",border:"2px solid rgba(34,197,94,0.3)",display:"grid",placeItems:"center",margin:"0 auto 18px",fontSize:34}}>
                ✅
              </div>
              <div style={{fontSize:22,fontWeight:800,color:"#e2e8f0",letterSpacing:"-0.02em",marginBottom:8}}>Password Reset!</div>
              <div style={{fontSize:13,color:"#4a6080",lineHeight:1.7,marginBottom:28}}>
                Your password has been updated successfully. You can now log in with your new password.
              </div>
              <button className="submit-btn" onClick={()=>router.push("/login")}>
                Go to Login →
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}