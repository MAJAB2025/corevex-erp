import React, { useState } from 'react';
import { useApp } from '../App';
import { PageHeader, KpiCard, DataCard, StatusBadge, ActionBtn, EmptyState, fmt } from '../components/UI';

export default function Approvals() {
  const { db, saveDB, showToast, user, currencySymbol } = useApp();
  const approvals = db.approvals || [];
  const pending = approvals.filter(a=>a.status==='بانتظار الموافقة');
  const approved = approvals.filter(a=>a.status==='معتمد');
  const rejected = approvals.filter(a=>a.status==='مرفوض');

  const decide = (id, decision, note='') => {
    const updated = approvals.map(a => a.id===id ? {...a, status:decision, decidedBy:user.nameAr, decidedAt:new Date().toISOString().split('T')[0], note} : a);
    saveDB({approvals:updated});
    showToast(decision==='معتمد'?'✅ تمت الموافقة':'❌ تم الرفض', decision==='معتمد'?'ok':'er');
  };

  return (
    <div>
      <PageHeader title="الموافقات" icon="✔️" subtitle="نظام الموافقات الإلكترونية"/>
      <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:16,marginBottom:24}}>
        <KpiCard icon="⏳" label="بانتظار الموافقة" value={pending.length} sub="طلب معلق" color={pending.length>0?'red':'green'} delta={pending.length>0?'عاجل':'لا شيء'} deltaUp={pending.length===0}/>
        <KpiCard icon="✅" label="تمت الموافقة" value={approved.length} sub="طلب معتمد" color="green" delta="معتمد" deltaUp/>
        <KpiCard icon="❌" label="مرفوض" value={rejected.length} sub="طلب مرفوض" color="red" delta="مرفوض"/>
      </div>

      {pending.length>0 && (
        <DataCard title="⚠️ طلبات تنتظر موافقتك" icon="⏳" style={{marginBottom:20}}>
          <div style={{padding:16}}>
            {pending.map((a,i)=>(
              <div key={i} style={{background:'rgba(230,81,0,0.08)',border:'1px solid rgba(230,81,0,0.2)',borderRadius:12,padding:16,marginBottom:10}}>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:10}}>
                  <div>
                    <div style={{fontSize:14,fontWeight:800,color:'#fff'}}>{a.title}</div>
                    <div style={{fontSize:11,color:'#5A6A80'}}>{a.type} · طلب بواسطة: {a.requestedBy} · {a.date}</div>
                    {a.description && <div style={{fontSize:12,color:'#C4B99A',marginTop:4}}>{a.description}</div>}
                  </div>
                  <div style={{textAlign:'left'}}>
                    <div style={{fontSize:18,fontWeight:900,color:'#F5C842',fontFamily:'Tajawal,Cairo'}}>{fmt(a.amount)} {currencySymbol}</div>
                  </div>
                </div>
                <div style={{display:'flex',gap:10}}>
                  <button onClick={()=>decide(a.id,'معتمد')} style={{flex:1,padding:'10px',borderRadius:10,border:'none',background:'linear-gradient(135deg,#1B5E20,#2E7D32)',color:'#fff',fontSize:13,fontWeight:700,fontFamily:'Cairo',cursor:'pointer'}}>✅ موافقة</button>
                  <button onClick={()=>decide(a.id,'مرفوض')} style={{flex:1,padding:'10px',borderRadius:10,border:'none',background:'linear-gradient(135deg,#7F0000,#C62828)',color:'#fff',fontSize:13,fontWeight:700,fontFamily:'Cairo',cursor:'pointer'}}>❌ رفض</button>
                </div>
              </div>
            ))}
          </div>
        </DataCard>
      )}

      <DataCard title="سجل الموافقات" icon="📋">
        {approvals.length===0 ? <EmptyState icon="✔️" title="لا توجد طلبات موافقة" subtitle="ستظهر هنا طلبات الصرف والمشتريات"/> : (
          <div style={{overflowX:'auto'}}>
            <table className="data-table">
              <thead><tr><th>الطلب</th><th>النوع</th><th>المبلغ</th><th>مقدم الطلب</th><th>التاريخ</th><th>الحالة</th><th>القرار بواسطة</th></tr></thead>
              <tbody>
                {[...approvals].reverse().map((a,i)=>(
                  <tr key={i}>
                    <td style={{textAlign:'right',fontWeight:700,color:'#fff'}}>{a.title}</td>
                    <td>{a.type}</td>
                    <td><span style={{fontFamily:'Tajawal,Cairo',fontWeight:800,color:'#F5C842'}}>{fmt(a.amount)} {currencySymbol}</span></td>
                    <td>{a.requestedBy}</td>
                    <td style={{fontSize:11,color:'#5A6A80'}}>{a.date}</td>
                    <td><StatusBadge status={a.status} small/></td>
                    <td style={{fontSize:11,color:'#5A6A80'}}>{a.decidedBy||'—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </DataCard>
    </div>
  );
}
