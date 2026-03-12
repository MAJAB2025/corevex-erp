import React, { useState, useMemo } from 'react';
import { useApp } from '../App';
import { PageHeader, KpiCard, DataCard, fmt } from '../components/UI';

export default function Zakat() {
  const { db, saveDB, showToast, currencySymbol } = useApp();
  const [inputs, setInputs] = useState({ capital:0, profits:0, receivables:0, inventory:0, cash:0, debts:0 });
  const s = k => e => setInputs(p=>({...p,[k]:+e.target.value||0}));

  const zakatBase = useMemo(() => {
    const assets = inputs.capital + inputs.profits + inputs.receivables + inputs.inventory + inputs.cash;
    const base = Math.max(0, assets - inputs.debts);
    return { base, amount: base * 0.025 };
  }, [inputs]);

  const history = db.zakat_records || [];

  const saveRecord = () => {
    const rec = { ...inputs, base: zakatBase.base, amount: zakatBase.amount, year: new Date().getFullYear(), date: new Date().toISOString().split('T')[0], id: Date.now() };
    saveDB({ zakat_records: [...history, rec] });
    showToast('✅ تم حفظ سجل الزكاة');
  };

  const inputRow = (label, key, icon) => (
    <div style={{display:'flex',alignItems:'center',gap:16,padding:'14px 0',borderBottom:'1px solid rgba(255,255,255,0.04)'}}>
      <span style={{fontSize:20,width:32,textAlign:'center'}}>{icon}</span>
      <div style={{flex:1,fontSize:13,fontWeight:700,color:'#E8D9B8'}}>{label}</div>
      <input className="form-input" type="number" value={inputs[key]||''} onChange={s(key)} placeholder="0" style={{width:180,direction:'ltr',textAlign:'left'}}/>
      <span style={{fontSize:11,color:'#5A6A80',width:30}}>{currencySymbol}</span>
    </div>
  );

  return (
    <div>
      <PageHeader title="حاسبة الزكاة" icon="☪️" subtitle="زكاة الشركة السنوية"/>
      <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:16,marginBottom:24}}>
        <KpiCard icon="📊" label="وعاء الزكاة" value={fmt(zakatBase.base)} sub={currencySymbol} color="gold" delta="الأصول - الديون" deltaUp/>
        <KpiCard icon="☪️" label="مبلغ الزكاة المستحق" value={fmt(zakatBase.amount)} sub={`${currencySymbol} (2.5%)`} color="green" delta="واجب" deltaUp/>
        <KpiCard icon="📅" label="سجلات الزكاة" value={history.length} sub="سنوات مسجلة" color="blue" delta="تاريخ"/>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:20}}>
        {/* Calculator */}
        <DataCard title="حساب الزكاة" icon="☪️" actions={
          <button className="btn btn-gold btn-sm" onClick={saveRecord}>💾 حفظ هذا العام</button>
        }>
          <div style={{padding:'0 20px 20px'}}>
            <div style={{fontSize:11,fontWeight:800,color:'rgba(74,222,128,0.6)',letterSpacing:1,padding:'14px 0 8px'}}>➕ الأصول الزكوية</div>
            {inputRow('رأس المال العامل','capital','💼')}
            {inputRow('الأرباح الصافية','profits','📈')}
            {inputRow('الذمم المدينة (ديون العملاء)','receivables','📋')}
            {inputRow('المخزون','inventory','📦')}
            {inputRow('النقد في الخزينة والبنك','cash','🏦')}
            <div style={{fontSize:11,fontWeight:800,color:'rgba(248,113,113,0.6)',letterSpacing:1,padding:'14px 0 8px'}}>➖ الخصوم</div>
            {inputRow('الديون على الشركة','debts','💳')}
            {/* Result */}
            <div style={{marginTop:20,background:'linear-gradient(135deg,rgba(196,140,10,0.1),rgba(196,140,10,0.05))',border:'1px solid rgba(196,140,10,0.2)',borderRadius:14,padding:20}}>
              <div style={{display:'flex',justifyContent:'space-between',marginBottom:12,paddingBottom:12,borderBottom:'1px solid rgba(196,140,10,0.12)'}}>
                <span style={{fontSize:13,color:'#5A6A80'}}>وعاء الزكاة</span>
                <span style={{fontSize:15,fontWeight:800,color:'#E8D9B8',fontFamily:'Tajawal,Cairo'}}>{fmt(zakatBase.base)} {currencySymbol}</span>
              </div>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                <span style={{fontSize:14,fontWeight:800,color:'#E8D9B8'}}>الزكاة المستحقة (2.5%)</span>
                <span style={{fontSize:24,fontWeight:900,color:'#F5C842',fontFamily:'Tajawal,Cairo',textShadow:'0 0 20px rgba(245,200,66,0.4)'}}>{fmt(zakatBase.amount)} {currencySymbol}</span>
              </div>
            </div>
          </div>
        </DataCard>
        {/* History */}
        <DataCard title="سجل الزكاة السنوي" icon="📅">
          <div style={{padding:20}}>
            {history.length===0 ? (
              <div style={{textAlign:'center',padding:'40px 0',color:'#5A6A80'}}>
                <div style={{fontSize:36,marginBottom:12}}>☪️</div>
                <div style={{fontSize:13}}>لا يوجد سجل زكاة بعد</div>
              </div>
            ) : [...history].reverse().map((r,i)=>(
              <div key={i} style={{background:'rgba(255,255,255,0.03)',border:'1px solid rgba(212,146,10,0.1)',borderRadius:12,padding:16,marginBottom:10}}>
                <div style={{display:'flex',justifyContent:'space-between',marginBottom:10}}>
                  <div style={{fontSize:14,fontWeight:800,color:'#E8D9B8'}}>سنة {r.year}</div>
                  <div style={{fontSize:12,color:'#5A6A80'}}>{r.date}</div>
                </div>
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8}}>
                  {[
                    {l:'وعاء الزكاة',v:fmt(r.base),c:'#E8D9B8'},
                    {l:'الزكاة المستحقة',v:fmt(r.amount),c:'#F5C842'},
                  ].map(x=>(
                    <div key={x.l} style={{background:'rgba(255,255,255,0.03)',borderRadius:8,padding:'8px 10px'}}>
                      <div style={{fontSize:10,color:'#5A6A80',marginBottom:3}}>{x.l}</div>
                      <div style={{fontSize:13,fontWeight:800,color:x.c,fontFamily:'Tajawal,Cairo'}}>{x.v} {currencySymbol}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </DataCard>
      </div>
    </div>
  );
}
