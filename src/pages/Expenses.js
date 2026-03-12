import React, { useState, useMemo } from 'react';
import { useApp } from '../App';
import { PageHeader, KpiCard, Modal, FormGrid, Field, DataCard, SearchInput, ActionBtn, EmptyState, useConfirm, StatusBadge, fmt } from '../components/UI';
import { EXPENSE_CATEGORIES } from '../config';

function ExpenseForm({ initial, projects, onSave, onClose }) {
  const today = new Date().toISOString().split('T')[0];
  const [f, setF] = useState(initial || { date:today, category:'vehicles', subcategory:'', description:'', amount:'', project:'', paymentMethod:'نقد', receipt:'', notes:'' });
  const s = k => e => setF(p=>({...p,[k]:e.target.value}));
  const cat = EXPENSE_CATEGORIES.find(c=>c.id===f.category);
  return (
    <Modal title={initial?'✏️ تعديل مصروف':'➕ إضافة مصروف'} onClose={onClose}>
      <FormGrid cols={2}>
        <Field label="التاريخ"><input className="form-input" type="date" value={f.date} onChange={s('date')}/></Field>
        <Field label="القسم"><select className="form-input" value={f.category} onChange={s('category')}>
          {EXPENSE_CATEGORIES.map(c=><option key={c.id} value={c.id}>{c.icon} {c.label}</option>)}
        </select></Field>
        <Field label="البند"><select className="form-input" value={f.subcategory} onChange={s('subcategory')}>
          <option value="">اختر البند</option>
          {cat?.sub.map(s=><option key={s}>{s}</option>)}
        </select></Field>
        <Field label="المبلغ"><input className="form-input" type="number" value={f.amount} onChange={s('amount')} placeholder="0"/></Field>
        <Field label="الوصف"><input className="form-input" value={f.description} onChange={s('description')} placeholder="وصف المصروف"/></Field>
        <Field label="طريقة الدفع"><select className="form-input" value={f.paymentMethod} onChange={s('paymentMethod')}>
          {['نقد','تحويل بنكي','شيك','بطاقة'].map(x=><option key={x}>{x}</option>)}
        </select></Field>
        <Field label="المشروع (اختياري)"><select className="form-input" value={f.project} onChange={s('project')}>
          <option value="">مصروف عام</option>
          {projects.map(p=><option key={p.id} value={p.code}>{p.code} - {p.name}</option>)}
        </select></Field>
        <Field label="رقم الإيصال"><input className="form-input" value={f.receipt} onChange={s('receipt')} style={{direction:'ltr',textAlign:'left'}}/></Field>
      </FormGrid>
      <Field label="ملاحظات"><textarea className="form-input" style={{minHeight:60,resize:'vertical'}} value={f.notes} onChange={s('notes')}/></Field>
      <div style={{display:'flex',gap:10,marginTop:4}}>
        <button className="btn btn-gold" onClick={()=>f.amount?onSave(f):alert('أدخل المبلغ')}>💾 حفظ</button>
        <button className="btn btn-outline" onClick={onClose}>إلغاء</button>
      </div>
    </Modal>
  );
}

export default function Expenses() {
  const { db, saveDB, showToast, currencySymbol } = useApp();
  const [modal, setModal] = useState(null);
  const [search, setSearch] = useState('');
  const [selCat, setSelCat] = useState('');
  const { confirm, Dialog } = useConfirm();

  const expenses = (db.expenses||[]).filter(e => {
    const q = search.toLowerCase();
    return (!q || e.description?.includes(q) || e.subcategory?.includes(q)) && (!selCat || e.category===selCat);
  });

  // Stats per category
  const catStats = useMemo(() => {
    const all = db.expenses || [];
    const total = all.reduce((a,e)=>a+(+e.amount||0),0);
    return EXPENSE_CATEGORIES.map(cat => {
      const items = all.filter(e=>e.category===cat.id);
      const amount = items.reduce((a,e)=>a+(+e.amount||0),0);
      return { ...cat, amount, count:items.length, pct: total>0?Math.round(amount/total*100):0 };
    }).sort((a,b)=>b.amount-a.amount);
  }, [db.expenses]);

  const totalGeneral = (db.expenses||[]).filter(e=>!e.project).reduce((a,e)=>a+(+e.amount||0),0);
  const totalProject = (db.expenses||[]).filter(e=>e.project).reduce((a,e)=>a+(+e.amount||0),0);
  const total = totalGeneral + totalProject;

  const save = data => {
    const list = [...(db.expenses||[])];
    if (modal?.idx>=0) list[modal.idx]={...data,id:list[modal.idx].id};
    else list.push({...data,id:Date.now()});
    saveDB({expenses:list}); setModal(null); showToast('✅ تم حفظ المصروف');
  };

  const del = i => confirm('حذف هذا المصروف؟',()=>{ const l=[...(db.expenses||[])]; l.splice(i,1); saveDB({expenses:l}); showToast('تم الحذف','er'); });

  return (
    <div>
      {Dialog}
      <PageHeader title="المصروفات" icon="💸" subtitle="تفصيل المصروفات بالأقسام" actions={
        <button className="btn btn-gold" onClick={()=>setModal({})}>➕ إضافة مصروف</button>
      }/>

      {/* KPIs */}
      <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:16,marginBottom:24}}>
        <KpiCard icon="💸" label="إجمالى المصروفات" value={fmt(total)} sub={currencySymbol} color="red" delta="إجمالى"/>
        <KpiCard icon="🏢" label="مصروفات الشركة العامة" value={fmt(totalGeneral)} sub={currencySymbol} color="orange" delta="عام"/>
        <KpiCard icon="🏗️" label="مصروفات المشاريع" value={fmt(totalProject)} sub={currencySymbol} color="purple" delta="مشاريع"/>
      </div>

      {/* Category breakdown — the main visual */}
      <DataCard title="توزيع المصروفات حسب القسم" icon="📊" style={{marginBottom:24}}>
        <div style={{padding:20}}>
          {catStats.map((cat,i)=>(
            <div key={cat.id} style={{marginBottom:16,cursor:'pointer'}} onClick={()=>setSelCat(selCat===cat.id?'':cat.id)}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:6}}>
                <div style={{display:'flex',alignItems:'center',gap:10}}>
                  <span style={{fontSize:20}}>{cat.icon}</span>
                  <div>
                    <div style={{fontSize:13,fontWeight:700,color:selCat===cat.id?'#E8A820':'#E8D9B8'}}>{cat.label}</div>
                    <div style={{fontSize:10,color:'#5A6A80'}}>{cat.count} عملية</div>
                  </div>
                </div>
                <div style={{textAlign:'left'}}>
                  <div style={{fontSize:15,fontWeight:900,color:'#F5C842',fontFamily:'Tajawal,Cairo'}}>{fmt(cat.amount)} <span style={{fontSize:10,opacity:.6}}>{currencySymbol}</span></div>
                  <div style={{fontSize:10,color:'#5A6A80',textAlign:'center'}}>{cat.pct}%</div>
                </div>
              </div>
              {/* Progress bar */}
              <div style={{height:8,background:'rgba(255,255,255,0.06)',borderRadius:4,overflow:'hidden'}}>
                <div style={{
                  width:`${cat.pct}%`, height:'100%', borderRadius:4,
                  background: i===0?'linear-gradient(90deg,#7F0000,#F87171)':
                               i===1?'linear-gradient(90deg,#7C3000,#FB923C)':
                               i===2?'linear-gradient(90deg,#7C4000,#F5C842)':
                               i===3?'linear-gradient(90deg,#4A148C,#D8B4FE)':
                               i===4?'linear-gradient(90deg,#1565C0,#60A5FA)':
                               'linear-gradient(90deg,#1B5E20,#4ADE80)',
                  transition:'width .8s ease',
                  boxShadow:`0 0 8px rgba(255,255,255,0.1)`,
                }}/>
              </div>
            </div>
          ))}
          {total===0 && <div style={{textAlign:'center',padding:'30px',color:'#5A6A80',fontSize:13}}>لا توجد مصروفات مسجلة</div>}
        </div>
      </DataCard>

      {/* Expense list */}
      <DataCard title={selCat ? `${EXPENSE_CATEGORIES.find(c=>c.id===selCat)?.icon} ${EXPENSE_CATEGORIES.find(c=>c.id===selCat)?.label}` : 'جميع المصروفات'} icon="💸" actions={
        <>
          <SearchInput value={search} onChange={setSearch}/>
          <div style={{display:'flex',gap:6,flexWrap:'wrap'}}>
            <button onClick={()=>setSelCat('')} style={{padding:'5px 12px',borderRadius:20,border:`1px solid ${!selCat?'#D4920A':'rgba(255,255,255,0.06)'}`,background:!selCat?'rgba(196,140,10,0.15)':'rgba(255,255,255,0.03)',color:!selCat?'#E8A820':'#5A6A80',fontSize:11,fontWeight:700,fontFamily:'Cairo',cursor:'pointer'}}>الكل</button>
            {EXPENSE_CATEGORIES.map(c=>(
              <button key={c.id} onClick={()=>setSelCat(selCat===c.id?'':c.id)} style={{padding:'5px 12px',borderRadius:20,border:`1px solid ${selCat===c.id?'#D4920A':'rgba(255,255,255,0.06)'}`,background:selCat===c.id?'rgba(196,140,10,0.15)':'rgba(255,255,255,0.03)',color:selCat===c.id?'#E8A820':'#5A6A80',fontSize:11,fontWeight:700,fontFamily:'Cairo',cursor:'pointer',whiteSpace:'nowrap'}}>{c.icon} {c.label}</button>
            ))}
          </div>
          <button className="btn btn-gold btn-sm" onClick={()=>setModal({})}>➕</button>
        </>
      } footer={<span style={{fontSize:11,color:'#5A6A80'}}>إجمالى: <strong style={{color:'#E8A820'}}>{fmt(expenses.reduce((a,e)=>a+(+e.amount||0),0))} {currencySymbol}</strong></span>}>
        {expenses.length===0 ? <EmptyState icon="💸" title="لا توجد مصروفات" subtitle="اضغط ➕ لإضافة مصروف جديد" action={<button className="btn btn-gold" onClick={()=>setModal({})}>➕ إضافة مصروف</button>}/> : (
          <div style={{overflowX:'auto'}}>
            <table className="data-table">
              <thead><tr><th>التاريخ</th><th>القسم</th><th>البند</th><th>الوصف</th><th>المبلغ</th><th>المشروع</th><th>طريقة الدفع</th><th>إجراءات</th></tr></thead>
              <tbody>
                {expenses.map((e,i)=>{
                  const cat = EXPENSE_CATEGORIES.find(c=>c.id===e.category);
                  const realIdx = (db.expenses||[]).indexOf(e);
                  return (
                    <tr key={i}>
                      <td style={{fontSize:11,color:'#5A6A80'}}>{e.date}</td>
                      <td><span style={{fontSize:13}}>{cat?.icon}</span> {cat?.label}</td>
                      <td style={{color:'#C4B99A'}}>{e.subcategory}</td>
                      <td>{e.description}</td>
                      <td><span style={{fontFamily:'Tajawal,Cairo',fontWeight:800,color:'#F87171'}}>{fmt(e.amount)} {currencySymbol}</span></td>
                      <td>{e.project ? <span style={{color:'#60A5FA',fontFamily:'monospace',fontSize:11}}>{e.project}</span> : <span style={{color:'#5A6A80',fontSize:11}}>عام</span>}</td>
                      <td><StatusBadge status={e.paymentMethod||'نقد'} small/></td>
                      <td><div style={{display:'flex',gap:4,justifyContent:'center'}}>
                        <ActionBtn type="edit" onClick={()=>setModal({data:e,idx:realIdx})} small/>
                        <ActionBtn type="delete" onClick={()=>del(realIdx)} small/>
                      </div></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </DataCard>
      {modal && <ExpenseForm initial={modal.data} projects={db.projects||[]} onSave={save} onClose={()=>setModal(null)}/>}
    </div>
  );
}
