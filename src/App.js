import React, { useState, useEffect, createContext, useContext, useMemo } from 'react';
import { USERS, MODULES, ROLES, EMPTY_DB, CURRENCIES } from './config'; // firebase ready
import './styles.css';

// Pages
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import Workers from './pages/Workers';
import Expenses from './pages/Expenses';
import Accounting from './pages/Accounting';
import Purchases from './pages/Purchases';
import Suppliers from './pages/Suppliers';
import Inventory from './pages/Inventory';
import Equipment from './pages/Equipment';
import Salaries from './pages/Salaries';
import Attendance from './pages/Attendance';
import Leaves from './pages/Leaves';
import Contracts from './pages/Contracts';
import Variations from './pages/Variations';
import Extracts from './pages/Extracts';
import Subcontractors from './pages/Subcontractors';
import Tenders from './pages/Tenders';
import Treasury from './pages/Treasury';
import VAT from './pages/VAT';
import Zakat from './pages/Zakat';
import DailyReport from './pages/DailyReport';
import Safety from './pages/Safety';
import Documents from './pages/Documents';
import Alerts from './pages/Alerts';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import Approvals from './pages/Approvals';
import GenericPage from './pages/GenericPage';

export const AppContext = createContext(null);
export const useApp = () => useContext(AppContext);

// ── Login ──
function LoginScreen({ onLogin }) {
  const [u, setU] = useState(''); const [p, setP] = useState('');
  const [err, setErr] = useState(''); const [loading, setLoading] = useState(false);
  const [showP, setShowP] = useState(false);

  const login = () => {
    if (!u||!p) { setErr('أدخل اسم المستخدم وكلمة المرور'); return; }
    setLoading(true);
    setTimeout(() => {
      const user = USERS.find(x => x.username===u && x.password===p);
      if (user) { localStorage.setItem('cvx_user', JSON.stringify(user)); onLogin(user); }
      else { setErr('اسم المستخدم أو كلمة المرور غير صحيحة'); setLoading(false); }
    }, 600);
  };

  return (
    <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',background:'linear-gradient(135deg,#040A14,#060D18,#080F1A)',padding:20,position:'relative'}}>
      <div style={{position:'absolute',inset:0,background:'radial-gradient(ellipse 700px 500px at 30% 30%,rgba(196,140,10,0.07) 0%,transparent 70%),radial-gradient(ellipse 500px 400px at 70% 70%,rgba(21,101,192,0.07) 0%,transparent 70%)',pointerEvents:'none'}}/>
      <div style={{width:'100%',maxWidth:420,background:'linear-gradient(145deg,#0C1525,#111E30)',border:'1px solid rgba(212,146,10,0.2)',borderRadius:24,padding:'40px 32px',boxShadow:'0 30px 80px rgba(0,0,0,0.7)',position:'relative',zIndex:1,animation:'fadeUp .5s ease'}}>
        <div style={{textAlign:'center',marginBottom:32}}>
          <img src="/logo.png" alt="Corevex" style={{height:65,marginBottom:12,filter:'drop-shadow(0 0 16px rgba(212,146,10,0.5))'}} onError={e=>e.target.style.display='none'}/>
          <div style={{fontSize:26,fontWeight:900,color:'#E8A820',letterSpacing:1}}>COREVEX ERP</div>
          <div style={{fontSize:11,color:'#5A6A80',letterSpacing:2,marginTop:4}}>نظام إدارة المقاولات المتكامل</div>
        </div>
        <div style={{height:1,background:'linear-gradient(90deg,transparent,#8B6000,#E8A820,#8B6000,transparent)',marginBottom:28,opacity:.5}}/>
        <div style={{marginBottom:16}}>
          <label className="form-label">Username</label>
          <input className="form-input" value={u} onChange={e=>{setU(e.target.value);setErr('');}} placeholder="admin" style={{direction:'ltr',textAlign:'left'}} onKeyDown={e=>e.key==='Enter'&&login()}/>
        </div>
        <div style={{marginBottom:8,position:'relative'}}>
          <label className="form-label">Password</label>
          <input className="form-input" type={showP?'text':'password'} value={p} onChange={e=>{setP(e.target.value);setErr('');}} placeholder="••••••••" style={{direction:'ltr',textAlign:'left',paddingLeft:44}} onKeyDown={e=>e.key==='Enter'&&login()}/>
          <button onClick={()=>setShowP(!showP)} style={{position:'absolute',left:12,bottom:11,background:'none',border:'none',color:'#5A6A80',cursor:'pointer',fontSize:16}}>{showP?'🙈':'👁️'}</button>
        </div>
        {err && <div style={{background:'rgba(183,28,28,0.15)',border:'1px solid rgba(183,28,28,0.3)',borderRadius:10,padding:'10px 14px',fontSize:12,fontWeight:700,color:'#F87171',marginBottom:16,textAlign:'center',animation:'fadeUp .3s ease'}}>⚠️ {err}</div>}
        <button onClick={login} disabled={loading} style={{width:'100%',padding:14,borderRadius:12,border:'none',background:loading?'rgba(139,96,0,0.5)':'linear-gradient(135deg,#8B6000,#D4920A 50%,#E8A820)',color:'#060D18',fontSize:15,fontWeight:900,cursor:loading?'not-allowed':'pointer',marginTop:8,boxShadow:'0 6px 24px rgba(196,140,10,0.4)',display:'flex',alignItems:'center',justifyContent:'center',gap:10}}>
          {loading?<><div className="spinner" style={{width:20,height:20,borderWidth:2}}/>جارى...</>:'🔐 تسجيل الدخول'}
        </button>
        <div style={{marginTop:20,padding:14,background:'rgba(255,255,255,0.03)',borderRadius:10,border:'1px solid rgba(255,255,255,0.05)'}}>
          <div style={{fontSize:10,fontWeight:800,color:'#5A6A80',letterSpacing:1,marginBottom:8,textAlign:'center'}}>ACCOUNTS</div>
          {USERS.map(usr=>(
            <div key={usr.id} onClick={()=>{setU(usr.username);setP(usr.password);setErr('');}} style={{display:'flex',alignItems:'center',gap:8,padding:'6px 8px',borderRadius:8,cursor:'pointer',marginBottom:3,transition:'all .15s'}}
              onMouseEnter={e=>e.currentTarget.style.background='rgba(196,140,10,0.08)'}
              onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
              <span style={{fontSize:16}}>{usr.avatar}</span>
              <div style={{flex:1}}>
                <div style={{fontSize:11,fontWeight:700,color:'#C4B99A',direction:'ltr'}}>{usr.username}</div>
                <div style={{fontSize:10,color:'#5A6A80'}}>{usr.nameAr}</div>
              </div>
              <div style={{fontSize:9,color:'#5A6A80',direction:'ltr',fontFamily:'monospace'}}>{usr.password}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Sidebar ──
function Sidebar({ user, page, onNav, onLogout, collapsed, onToggle }) {
  const allowed = m => user.permissions.includes('all') || user.permissions.includes(m.id);
  const groups = {};
  MODULES.filter(allowed).forEach(m => {
    const g = m.group || '__top__';
    if (!groups[g]) groups[g] = [];
    groups[g].push(m);
  });

  return (
    <aside style={{position:'fixed',top:0,right:0,width:collapsed?64:248,height:'100vh',background:'linear-gradient(180deg,#080F1A,#0C1525)',borderLeft:'1px solid rgba(212,146,10,0.1)',display:'flex',flexDirection:'column',zIndex:100,transition:'width .25s ease',overflow:'hidden',boxShadow:'-4px 0 40px rgba(0,0,0,0.5)'}}>
      {/* Logo */}
      <div style={{padding:collapsed?'14px 0':'14px 16px',borderBottom:'1px solid rgba(212,146,10,0.1)',display:'flex',alignItems:'center',gap:10,minHeight:64,justifyContent:collapsed?'center':'flex-start'}}>
        {!collapsed && <img src="/logo.png" alt="Corevex" style={{height:34,filter:'drop-shadow(0 0 8px rgba(212,146,10,0.4))'}} onError={e=>e.target.style.display='none'}/>}
        {collapsed && <span style={{fontSize:22}}>🏗</span>}
        {!collapsed && <div><div style={{fontSize:9,color:'#5A6A80',letterSpacing:1}}>CONTRACTING ERP</div></div>}
        <button onClick={onToggle} style={{marginRight:'auto',marginLeft:collapsed?'auto':0,background:'none',border:'none',color:'#5A6A80',cursor:'pointer',fontSize:14,padding:4,flexShrink:0}}>{collapsed?'◀':'▶'}</button>
      </div>
      {/* Nav */}
      <nav style={{flex:1,overflowY:'auto',padding:'8px 0'}}>
        {Object.entries(groups).map(([group, mods]) => (
          <div key={group}>
            {!collapsed && group !== '__top__' && (
              <div style={{fontSize:9,fontWeight:800,color:'rgba(196,140,10,0.4)',letterSpacing:1.5,padding:'12px 18px 5px',textTransform:'uppercase'}}>{group}</div>
            )}
            {mods.map(m => {
              const active = page === m.id;
              return (
                <div key={m.id} onClick={()=>onNav(m.id)} title={collapsed?m.label:''} style={{display:'flex',alignItems:'center',gap:10,padding:collapsed?'10px 0':'9px 16px',justifyContent:collapsed?'center':'flex-start',cursor:'pointer',transition:'all .15s',borderRight:active?'3px solid #D4920A':'3px solid transparent',background:active?'rgba(196,140,10,0.1)':'transparent',margin:'1px 0'}}
                  onMouseEnter={e=>{if(!active)e.currentTarget.style.background='rgba(255,255,255,0.04)';}}
                  onMouseLeave={e=>{if(!active)e.currentTarget.style.background='transparent';}}>
                  <span style={{fontSize:15,flexShrink:0}}>{m.icon}</span>
                  {!collapsed && <span style={{fontSize:12,fontWeight:active?800:600,color:active?'#E8A820':'#5A6A80',whiteSpace:'nowrap'}}>{m.label}</span>}
                </div>
              );
            })}
          </div>
        ))}
      </nav>
      {/* User */}
      <div style={{padding:collapsed?'12px 0':'14px 16px',borderTop:'1px solid rgba(212,146,10,0.1)',display:'flex',alignItems:'center',gap:10,justifyContent:collapsed?'center':'flex-start'}}>
        <div style={{width:34,height:34,borderRadius:'50%',background:'linear-gradient(135deg,#8B6000,#D4920A)',border:'2px solid #C48C0A',display:'flex',alignItems:'center',justifyContent:'center',fontSize:16,flexShrink:0}}>{user.avatar}</div>
        {!collapsed && <>
          <div style={{flex:1,minWidth:0}}>
            <div style={{fontSize:12,fontWeight:700,color:'#C4B99A',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{user.nameAr}</div>
            <div style={{fontSize:10,color:'#5A6A80'}}>{ROLES[user.role]?.label}</div>
          </div>
          <button onClick={onLogout} style={{background:'rgba(183,28,28,0.1)',border:'1px solid rgba(183,28,28,0.2)',borderRadius:8,color:'#F87171',cursor:'pointer',padding:'6px 8px',fontSize:12}}>↩</button>
        </>}
      </div>
    </aside>
  );
}

// ── Topbar ──
function Topbar({ user, page, sw, alertCount, currency, onCurrencyChange }) {
  const mod = MODULES.find(m=>m.id===page);
  const now = new Date().toLocaleDateString('ar-EG',{weekday:'long',year:'numeric',month:'long',day:'numeric'});
  return (
    <header style={{position:'fixed',top:0,right:sw,left:0,height:64,zIndex:99,background:'rgba(6,13,24,0.97)',backdropFilter:'blur(20px)',borderBottom:'1px solid rgba(212,146,10,0.1)',display:'flex',alignItems:'center',justifyContent:'space-between',padding:'0 24px',boxShadow:'0 4px 28px rgba(0,0,0,0.5)'}}>
      <div style={{position:'absolute',bottom:0,left:0,right:0,height:1,background:'linear-gradient(90deg,transparent,#8B6000 20%,#E8A820 50%,#8B6000 80%,transparent)',opacity:.45}}/>
      <div>
        <div style={{display:'flex',alignItems:'center',gap:8}}>
          <span style={{fontSize:18}}>{mod?.icon}</span>
          <span style={{fontSize:16,fontWeight:900,color:'#E8D9B8'}}>{mod?.label}</span>
        </div>
        <div style={{fontSize:10,color:'#5A6A80',marginTop:1}}>📅 {now}</div>
      </div>
      <div style={{display:'flex',alignItems:'center',gap:10}}>
        {/* Currency */}
        <select value={currency} onChange={e=>onCurrencyChange(e.target.value)} style={{background:'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.08)',borderRadius:8,color:'#C4B99A',padding:'6px 10px',fontSize:12,fontFamily:'Cairo',cursor:'pointer',outline:'none'}}>
          {Object.values(CURRENCIES).map(c=><option key={c.code} value={c.code}>{c.flag} {c.code}</option>)}
        </select>
        {/* Bell */}
        <div style={{position:'relative',cursor:'pointer'}}>
          <div style={{width:38,height:38,borderRadius:10,background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.06)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:17}}>🔔</div>
          {alertCount>0 && <div style={{position:'absolute',top:-4,left:-4,width:18,height:18,borderRadius:'50%',background:'#C62828',fontSize:9,fontWeight:900,color:'#fff',display:'flex',alignItems:'center',justifyContent:'center'}}>{alertCount}</div>}
        </div>
        {/* User */}
        <div style={{display:'flex',alignItems:'center',gap:8,background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.06)',borderRadius:20,padding:'5px 14px 5px 6px'}}>
          <div style={{width:28,height:28,borderRadius:'50%',background:'linear-gradient(135deg,#8B6000,#D4920A)',border:'2px solid #C48C0A',display:'flex',alignItems:'center',justifyContent:'center',fontSize:13}}>{user.avatar}</div>
          <div>
            <div style={{fontSize:11,fontWeight:700,color:'#C4B99A'}}>{user.nameAr}</div>
            <div style={{fontSize:9,color:'#5A6A80'}}>{ROLES[user.role]?.label}</div>
          </div>
        </div>
      </div>
    </header>
  );
}

// ── Main App ──
export default function App() {
  const [user, setUser] = useState(null);
  const [page, setPage] = useState('dashboard');
  const [collapsed, setCollapsed] = useState(false);
  const [db, setDb] = useState(() => { try { return JSON.parse(localStorage.getItem('cvx_db')||'null')||{...EMPTY_DB}; } catch { return {...EMPTY_DB}; }});
  const [toast, setToast] = useState(null);

  useEffect(() => { const s = localStorage.getItem('cvx_user'); if(s) { try { setUser(JSON.parse(s)); } catch{} } },[]);
  useEffect(() => { localStorage.setItem('cvx_db', JSON.stringify(db)); }, [db]);

  const currency = db.settings?.currency || 'SAR';
  const setCurrency = c => setDb(prev=>({...prev,settings:{...prev.settings,currency:c}}));

  const saveDB = updates => setDb(prev=>({...prev,...updates}));
  const showToast = (msg,type='ok') => { setToast({msg,type}); setTimeout(()=>setToast(null),3000); };
  const handleLogout = () => { localStorage.removeItem('cvx_user'); setUser(null); };

  const alertCount = useMemo(() => {
    let n=0;
    const d30 = new Date(Date.now()+30*864e5);
    (db.workers||[]).forEach(w=>{
      if(w.iqamaExpiry&&new Date(w.iqamaExpiry)<=d30)n++;
      if(w.passportExpiry&&new Date(w.passportExpiry)<=d30)n++;
      if(w.visaExpiry&&new Date(w.visaExpiry)<=d30)n++;
    });
    (db.documents||[]).forEach(d=>{ if(d.expiry&&new Date(d.expiry)<=d30)n++; });
    (db.approvals||[]).filter(a=>a.status==='بانتظار الموافقة').forEach(()=>n++);
    return n;
  }, [db]);

  const sw = collapsed ? 64 : 248;

  const PAGE_MAP = {
    dashboard:Dashboard, projects:Projects, workers:Workers,
    expenses:Expenses, accounting:Accounting, purchases:Purchases,
    suppliers:Suppliers, inventory:Inventory, equipment:Equipment,
    salaries:Salaries, attendance:Attendance, leaves:Leaves,
    contracts:Contracts, variations:Variations, extracts:Extracts,
    subcontractors:Subcontractors, tenders:Tenders, treasury:Treasury,
    vat:VAT, zakat:Zakat, daily_report:DailyReport, safety:Safety,
    documents:Documents, alerts:Alerts, reports:Reports,
    settings:Settings, approvals:Approvals,
  };
  const PageComp = PAGE_MAP[page] || GenericPage;

  const ctx = { user, db, saveDB, showToast, navigate:setPage, currency, currencySymbol: CURRENCIES[currency]?.symbol || 'ر.س' };

  if (!user) return <LoginScreen onLogin={setUser}/>;

  return (
    <AppContext.Provider value={ctx}>
      <div style={{position:'relative',zIndex:1}}>
        <Sidebar user={user} page={page} onNav={setPage} onLogout={handleLogout} collapsed={collapsed} onToggle={()=>setCollapsed(!collapsed)}/>
        <Topbar user={user} page={page} sw={sw} alertCount={alertCount} currency={currency} onCurrencyChange={setCurrency}/>
        <main style={{marginRight:sw,marginTop:64,padding:28,minHeight:'calc(100vh - 64px)',transition:'margin-right .25s'}}>
          <div style={{animation:'fadeUp .35s ease'}} key={page}>
            <PageComp/>
          </div>
        </main>
        {toast && (
          <div style={{position:'fixed',bottom:28,left:'50%',transform:'translateX(-50%)',background:toast.type==='ok'?'linear-gradient(135deg,#1B5E20,#2E7D32)':'linear-gradient(135deg,#7F0000,#C62828)',borderRadius:12,padding:'14px 24px',display:'flex',alignItems:'center',gap:12,fontSize:14,fontWeight:700,color:'#fff',zIndex:9999,boxShadow:'0 8px 30px rgba(0,0,0,0.6)',animation:'fadeUp .3s ease',whiteSpace:'nowrap'}}>
            {toast.type==='ok'?'✅':'❌'} {toast.msg}
          </div>
        )}
      </div>
    </AppContext.Provider>
  );
}
