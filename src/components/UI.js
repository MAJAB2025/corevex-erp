import React, { useState } from 'react';
import { STATUS_COLORS } from '../config';

// ══════════════════════════════════════════
// SHARED UI COMPONENTS
// ══════════════════════════════════════════

// ── Page Header ──
export function PageHeader({ title, subtitle, icon, actions }) {
  return (
    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end', marginBottom:28 }}>
      <div>
        <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:6 }}>
          <div style={{ width:18, height:2, background:'linear-gradient(90deg,#C48C0A,#F5C842)', borderRadius:2 }}/>
          <span style={{ fontSize:10, fontWeight:800, letterSpacing:2, textTransform:'uppercase', color:'#C48C0A' }}>
            {subtitle || title}
          </span>
        </div>
        <div style={{ fontSize:26, fontWeight:900, color:'#fff' }}>
          {icon} <span style={{ background:'linear-gradient(135deg,#E8A820,#F5C842)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>{title}</span>
        </div>
      </div>
      <div style={{ display:'flex', gap:10 }}>{actions}</div>
    </div>
  );
}

// ── KPI Card ──
export function KpiCard({ icon, label, value, sub, color = 'gold', delta, deltaUp }) {
  const colors = {
    gold:   { bg:'linear-gradient(145deg,#1A1100,#261800)', border:'rgba(196,140,10,0.25)',   val:'#F5C842',  bar:'linear-gradient(90deg,transparent,#8B6000,#E8A820,transparent)' },
    blue:   { bg:'linear-gradient(145deg,#060F1E,#091A30)', border:'rgba(21,101,192,0.22)',   val:'#60A5FA',  bar:'linear-gradient(90deg,transparent,#1565C0,#60A5FA,transparent)' },
    green:  { bg:'linear-gradient(145deg,#031208,#05180B)', border:'rgba(27,94,32,0.22)',     val:'#4ADE80',  bar:'linear-gradient(90deg,transparent,#1B5E20,#4ADE80,transparent)' },
    red:    { bg:'linear-gradient(145deg,#160303,#200404)', border:'rgba(183,28,28,0.22)',    val:'#F87171',  bar:'linear-gradient(90deg,transparent,#B71C1C,#F87171,transparent)' },
    orange: { bg:'linear-gradient(145deg,#160800,#200C00)', border:'rgba(230,81,0,0.22)',     val:'#FB923C',  bar:'linear-gradient(90deg,transparent,#E65100,#FB923C,transparent)' },
    purple: { bg:'linear-gradient(145deg,#0C0315,#12041E)', border:'rgba(74,20,140,0.22)',    val:'#D8B4FE',  bar:'linear-gradient(90deg,transparent,#4A148C,#D8B4FE,transparent)' },
    teal:   { bg:'linear-gradient(145deg,#00100E,#001814)', border:'rgba(0,77,64,0.22)',      val:'#2DD4BF',  bar:'linear-gradient(90deg,transparent,#004D40,#2DD4BF,transparent)' },
  };
  const c = colors[color] || colors.gold;
  return (
    <div style={{
      background:c.bg, border:`1px solid ${c.border}`, borderRadius:16,
      padding:'20px 20px 24px', position:'relative', overflow:'hidden',
      transition:'all .25s cubic-bezier(0.34,1.56,0.64,1)', cursor:'pointer',
    }}
    onMouseEnter={e => { e.currentTarget.style.transform='translateY(-4px)'; e.currentTarget.style.boxShadow=`0 16px 40px ${c.border}`; }}
    onMouseLeave={e => { e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='none'; }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:14 }}>
        <div style={{ width:46,height:46,borderRadius:13,background:`rgba(255,255,255,0.06)`,border:`1px solid ${c.border}`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:22 }}>{icon}</div>
        {delta && <span style={{ fontSize:10,fontWeight:800,padding:'3px 9px',borderRadius:20,background:deltaUp?'rgba(74,222,128,0.1)':'rgba(248,113,113,0.1)',color:deltaUp?'#4ADE80':'#F87171',border:`1px solid ${deltaUp?'rgba(74,222,128,0.2)':'rgba(248,113,113,0.2)'}` }}>{delta}</span>}
      </div>
      <div style={{ fontSize:11,fontWeight:700,color:'#5A6A80',marginBottom:5,letterSpacing:.4 }}>{label}</div>
      <div style={{ fontSize:32,fontWeight:900,color:c.val,lineHeight:1,marginBottom:6,fontFamily:'Tajawal,Cairo',textShadow:`0 0 24px ${c.val}55` }}>{value}</div>
      <div style={{ fontSize:11,color:'#5A6A80' }}>{sub}</div>
      <div style={{ position:'absolute',bottom:0,left:0,right:0,height:3,background:c.bar,borderRadius:'0 0 16px 16px' }}/>
    </div>
  );
}

// ── Status Badge ──
export function StatusBadge({ status, small }) {
  const s = STATUS_COLORS[status] || { bg:'linear-gradient(135deg,#212121,#616161)', dot:'#BDBDBD' };
  return (
    <span style={{
      display:'inline-flex', alignItems:'center', gap:6,
      background:s.bg, borderRadius:20,
      padding: small ? '4px 10px' : '5px 14px',
      fontSize: small ? 10 : 11, fontWeight:800, color:'#fff',
      boxShadow:'0 3px 10px rgba(0,0,0,0.3)', whiteSpace:'nowrap',
    }}>
      <span style={{ width:6,height:6,borderRadius:'50%',background:s.dot,display:'inline-block' }}/>
      {status}
    </span>
  );
}

// ── Progress Bar ──
export function ProgressBar({ pct }) {
  const clr = pct>=80 ? 'linear-gradient(90deg,#1B5E20,#4ADE80)' : pct>=50 ? 'linear-gradient(90deg,#7C3000,#FB923C)' : 'linear-gradient(90deg,#7F0000,#F87171)';
  const txtClr = pct>=80 ? '#4ADE80' : pct>=50 ? '#FB923C' : '#F87171';
  return (
    <div style={{ display:'flex',alignItems:'center',gap:10,direction:'ltr' }}>
      <div style={{ flex:1,height:7,background:'rgba(255,255,255,0.07)',borderRadius:4,overflow:'hidden',minWidth:80 }}>
        <div style={{ width:`${pct}%`,height:'100%',background:clr,borderRadius:4,transition:'width .6s ease' }}/>
      </div>
      <span style={{ fontSize:12,fontWeight:800,minWidth:36,color:txtClr,fontFamily:'Tajawal,Cairo' }}>{pct}%</span>
    </div>
  );
}

// ── Days Chip ──
export function DaysChip({ endDate }) {
  if (!endDate) return <span style={{ color:'#5A6A80', fontSize:11 }}>—</span>;
  const days = Math.round((new Date(endDate) - new Date()) / 864e5);
  if (days < 0)  return <span style={{ background:'rgba(248,113,113,0.08)',color:'#F87171',border:'1px solid rgba(248,113,113,0.18)',borderRadius:8,padding:'4px 10px',fontSize:10,fontWeight:800 }}>⚠ {Math.abs(days)} يوم تأخير</span>;
  if (days === 0) return <span style={{ background:'rgba(74,222,128,0.08)',color:'#4ADE80',border:'1px solid rgba(74,222,128,0.18)',borderRadius:8,padding:'4px 10px',fontSize:10,fontWeight:800 }}>✓ اليوم</span>;
  if (days < 30)  return <span style={{ background:'rgba(251,146,60,0.08)',color:'#FB923C',border:'1px solid rgba(251,146,60,0.18)',borderRadius:8,padding:'4px 10px',fontSize:10,fontWeight:800 }}>⏰ {days} يوم</span>;
  return <span style={{ background:'rgba(74,222,128,0.06)',color:'#4ADE80',border:'1px solid rgba(74,222,128,0.14)',borderRadius:8,padding:'4px 10px',fontSize:10,fontWeight:800 }}>📅 {days} يوم</span>;
}

// ── Stars ──
export function Stars({ count }) {
  return (
    <span>
      {Array.from({length:5},(_,i) => (
        <span key={i} style={{ color: i < count ? '#F5C842' : '#1A2A40', fontSize:14 }}>★</span>
      ))}
    </span>
  );
}

// ── Modal ──
export function Modal({ title, onClose, children, width = 680 }) {
  return (
    <div style={{
      position:'fixed', inset:0, background:'rgba(0,0,0,0.8)', backdropFilter:'blur(8px)',
      zIndex:500, display:'flex', alignItems:'center', justifyContent:'center', padding:20,
    }} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{
        background:'linear-gradient(145deg,#0C1525,#111E30)',
        border:'1px solid rgba(212,146,10,0.15)',
        borderRadius:20, width:'100%', maxWidth:width,
        maxHeight:'88vh', overflowY:'auto',
        padding:28, boxShadow:'0 30px 80px rgba(0,0,0,0.7)',
        animation:'fadeUp .35s cubic-bezier(0.34,1.56,0.64,1)',
      }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:22, paddingBottom:18, borderBottom:'1px solid rgba(212,146,10,0.12)' }}>
          <div style={{ fontSize:18, fontWeight:900, color:'#E8D9B8' }}>{title}</div>
          <button onClick={onClose} style={{ width:36,height:36,borderRadius:10,border:'1px solid rgba(255,255,255,0.06)',background:'rgba(255,255,255,0.04)',color:'#5A6A80',fontSize:18,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',transition:'all .2s' }}
            onMouseEnter={e=>{e.currentTarget.style.background='rgba(183,28,28,0.15)';e.currentTarget.style.color='#F87171';}}
            onMouseLeave={e=>{e.currentTarget.style.background='rgba(255,255,255,0.04)';e.currentTarget.style.color='#5A6A80';}}>✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}

// ── Form Grid ──
export function FormGrid({ children, cols = 2 }) {
  return (
    <div style={{ display:'grid', gridTemplateColumns:`repeat(${cols},1fr)`, gap:16, marginBottom:20 }}>
      {children}
    </div>
  );
}

// ── Form Field ──
export function Field({ label, children, span }) {
  return (
    <div style={{ gridColumn: span ? `span ${span}` : undefined }}>
      <label className="form-label">{label}</label>
      {children}
    </div>
  );
}

// ── Card with header ──
export function DataCard({ title, icon, actions, children, footer }) {
  return (
    <div className="card">
      <div style={{ padding:'18px 22px', display:'flex', alignItems:'center', justifyContent:'space-between', borderBottom:'1px solid rgba(212,146,10,0.12)', background:'linear-gradient(135deg,rgba(196,140,10,0.05),transparent)' }}>
        <div style={{ display:'flex', alignItems:'center', gap:10, fontSize:14, fontWeight:800, color:'#E8D9B8' }}>
          <div style={{ width:8,height:8,borderRadius:'50%',background:'#E8A820',boxShadow:'0 0 0 3px rgba(232,168,32,0.18)',animation:'pulse 2s infinite' }}/>
          {icon} {title}
        </div>
        <div style={{ display:'flex', gap:8, alignItems:'center' }}>{actions}</div>
      </div>
      <div style={{ height:1, background:'linear-gradient(90deg,transparent,#8B6000 20%,#E8A820 50%,#8B6000 80%,transparent)', opacity:.45 }}/>
      {children}
      {footer && (
        <div style={{ padding:'14px 22px', borderTop:'1px solid rgba(212,146,10,0.08)', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          {footer}
        </div>
      )}
    </div>
  );
}

// ── Search Input ──
export function SearchInput({ value, onChange, placeholder = '🔍 بحث...' }) {
  return (
    <input
      className="form-input"
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      style={{ width:220 }}
    />
  );
}

// ── Action Buttons ──
export function ActionBtn({ onClick, type = 'edit', small }) {
  const configs = {
    edit:   { bg:'rgba(196,140,10,0.12)',  color:'#E8A820', border:'rgba(196,140,10,0.22)',  icon:'✏️' },
    delete: { bg:'rgba(183,28,28,0.12)',   color:'#F87171', border:'rgba(183,28,28,0.22)',   icon:'🗑️' },
    view:   { bg:'rgba(21,101,192,0.12)',  color:'#60A5FA', border:'rgba(21,101,192,0.22)',  icon:'👁️' },
    print:  { bg:'rgba(27,94,32,0.12)',    color:'#4ADE80', border:'rgba(27,94,32,0.22)',    icon:'🖨️' },
    approve:{ bg:'rgba(27,94,32,0.12)',    color:'#4ADE80', border:'rgba(27,94,32,0.22)',    icon:'✅' },
    reject: { bg:'rgba(183,28,28,0.12)',   color:'#F87171', border:'rgba(183,28,28,0.22)',   icon:'❌' },
  };
  const c = configs[type] || configs.edit;
  const size = small ? 28 : 32;
  return (
    <button onClick={e => { e.stopPropagation(); onClick(); }} style={{
      width:size, height:size, borderRadius:8,
      border:`1px solid ${c.border}`, background:c.bg,
      color:c.color, fontSize: small ? 12 : 14,
      cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center',
      transition:'all .18s',
    }}
    onMouseEnter={e => e.currentTarget.style.transform='translateY(-2px)'}
    onMouseLeave={e => e.currentTarget.style.transform='translateY(0)'}>
      {c.icon}
    </button>
  );
}

// ── Confirm Delete ──
export function useConfirm() {
  const [state, setState] = useState(null);
  const confirm = (msg, onYes) => setState({ msg, onYes });
  const Dialog = state ? (
    <div style={{ position:'fixed',inset:0,background:'rgba(0,0,0,0.75)',zIndex:600,display:'flex',alignItems:'center',justifyContent:'center' }}>
      <div style={{ background:'linear-gradient(145deg,#0C1525,#111E30)',border:'1px solid rgba(183,28,28,0.3)',borderRadius:16,padding:28,maxWidth:360,width:'90%',textAlign:'center',animation:'fadeUp .3s ease' }}>
        <div style={{ fontSize:36, marginBottom:16 }}>⚠️</div>
        <div style={{ fontSize:15,fontWeight:700,color:'#E8D9B8',marginBottom:8 }}>{state.msg}</div>
        <div style={{ fontSize:12,color:'#5A6A80',marginBottom:24 }}>لا يمكن التراجع عن هذا الإجراء</div>
        <div style={{ display:'flex',gap:12,justifyContent:'center' }}>
          <button onClick={() => { state.onYes(); setState(null); }} style={{ padding:'10px 24px',borderRadius:10,border:'none',background:'linear-gradient(135deg,#7F0000,#C62828)',color:'#fff',fontSize:13,fontWeight:700,cursor:'pointer' }}>نعم، احذف</button>
          <button onClick={() => setState(null)} style={{ padding:'10px 24px',borderRadius:10,border:'1px solid rgba(255,255,255,0.06)',background:'rgba(255,255,255,0.04)',color:'#C4B99A',fontSize:13,fontWeight:700,cursor:'pointer' }}>إلغاء</button>
        </div>
      </div>
    </div>
  ) : null;
  return { confirm, Dialog };
}

// ── Empty State ──
export function EmptyState({ icon, title, subtitle, action }) {
  return (
    <div style={{ textAlign:'center', padding:'60px 20px', color:'#5A6A80' }}>
      <div style={{ fontSize:50, marginBottom:16 }}>{icon}</div>
      <div style={{ fontSize:16,fontWeight:700,color:'#C4B99A',marginBottom:8 }}>{title}</div>
      <div style={{ fontSize:12,marginBottom:action?24:0 }}>{subtitle}</div>
      {action}
    </div>
  );
}

// ── Number formatter ──
export const fmt = n => (n || 0).toLocaleString('ar-EG');
export const fmtSAR = n => `${fmt(n)} ر.س`;
export const fmtDate = d => d ? new Date(d).toLocaleDateString('ar-EG') : '—';
