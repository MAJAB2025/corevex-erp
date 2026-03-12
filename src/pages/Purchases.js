import React, { useState } from 'react';
import { useApp } from '../App';
import { PageHeader, KpiCard, StatusBadge, Modal, FormGrid, Field, DataCard, SearchInput, ActionBtn, EmptyState, useConfirm, fmt, fmtDate } from '../components/UI';

function PurchaseForm({ initial, projects, suppliers, onSave, onClose, currencySymbol }) {
  const today = new Date().toISOString().split('T')[0];
  const [f, setF] = useState(initial||{date:today,invoiceNo:'',project:'',supplier:'',type:'مواد',description:'',qty:'1',price:'',paymentStatus:'معلق',notes:''});
  const s = k => e => setF(p=>({...p,[k]:e.target.value}));
  const total = (+f.qty||1)*(+f.price||0);
  return (
    <Modal title={initial?'✏️ تعديل فاتورة':'➕ فاتورة مشتريات جديدة'} onClose={onClose}>
      <FormGrid cols={2}>
        <Field label="التاريخ"><input className="form-input" type="date" value={f.date} onChange={s('date')}/></Field>
        <Field label="رقم الفاتورة"><input className="form-input" value={f.invoiceNo} onChange={s('invoiceNo')} placeholder="INV-001" style={{direction:'ltr',textAlign:'left'}}/></Field>
        <Field label="المشروع"><select className="form-input" value={f.project} onChange={s('project')}>
          <option value="">اختر المشروع</option>
          {projects.map(p=><option key={p.id} value={p.code}>{p.code} - {p.name}</option>)}
        </select></Field>
        <Field label="المورد"><select className="form-input" value={f.supplier} onChange={s('supplier')}>
          <option value="">اختر المورد</option>
          {suppliers.map(s=><option key={s.id} value={s.name}>{s.name}</option>)}
          <option value="__other__">مورد آخر</option>
        </select></Field>
        <Field label="النوع"><select className="form-input" value={f.type} onChange={s('type')}>
          {['مواد','معدات','خدمات','عمالة خارجية','أخرى'].map(x=><option key={x}>{x}</option>)}
        </select></Field>
        <Field label="الوصف"><input className="form-input" value={f.description} onChange={s('description')} placeholder="وصف البند"/></Field>
        <Field label="الكمية"><input className="form-input" type="number" value={f.qty} onChange={s('qty')}/></Field>
        <Field label={`السعر ${currencySymbol}`}><input className="form-input" type="number" value={f.price} onChange={s('price')}/></Field>
        <Field label="حالة الدفع"><select className="form-input" value={f.paymentStatus} onChange={s('paymentStatus')}>
          {['مدفوع','معلق','مرفوض'].map(x=><option key={x}>{x}</option>)}
        </select></Field>
      </FormGrid>
      <div style={{marginBottom:16,padding:12,background:'rgba(196,140,10,0.08)',borderRadius:10,border:'1px solid rgba(196,140,10,0.15)',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <span style={{fontSize:13,color:'#C4B99A',fontWeight:700}}>الإجمالى:</span>
        <span style={{fontSize:18,fontWeight:900,color:'#F5C842',fontFamily:'Tajawal,Cairo'}}>{fmt(total)} {currencySymbol}</span>
      </div>
      <div style={{display:'flex',gap:10}}>
        <button className="btn btn-gold" onClick={()=>onSave(f)}>💾 حفظ</button>
        <button className="btn btn-outline" onClick={onClose}>إلغاء</button>
      </div>
    </Modal>
  );
}

export default function Purchases() {
  const { db, saveDB, showToast, currencySymbol } = useApp();
  const [modal, setModal] = useState(null);
  const [search, setSearch] = useState('');
  const [flt, setFlt] = useState('');
  const { confirm, Dialog } = useConfirm();

  const items = (db.purchases||[]).filter(p=>{
    const q=search.toLowerCase();
    return(!q||p.description?.includes(q)||p.supplier?.includes(q)||p.invoiceNo?.includes(q))&&(!flt||p.paymentStatus===flt);
  });

  const total = (db.purchases||[]).reduce((a,p)=>a+(+p.qty||1)*(+p.price||0),0);
  const paid = (db.purchases||[]).filter(p=>p.paymentStatus==='مدفوع').reduce((a,p)=>a+(+p.qty||1)*(+p.price||0),0);
  const pending = (db.purchases||[]).filter(p=>p.paymentStatus==='معلق').reduce((a,p)=>a+(+p.qty||1)*(+p.price||0),0);

  const save = data => {
    const list=[...(db.purchases||[])];
    if(modal?.idx>=0) list[modal.idx]={...data,id:list[modal.idx].id};
    else list.push({...data,id:Date.now()});
    saveDB({purchases:list}); setModal(null); showToast('✅ تم حفظ الفاتورة');
  };
  const del = i => confirm('حذف هذه الفاتورة؟',()=>{ const l=[...(db.purchases||[])]; l.splice(i,1); saveDB({purchases:l}); showToast('تم الحذف','er'); });

  return (
    <div>
      {Dialog}
      <PageHeader title="المشتريات" icon="🛒" subtitle="فواتير المشتريات" actions={
        <button className="btn btn-gold" onClick={()=>setModal({})}>➕ فاتورة جديدة</button>
      }/>
      <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:16,marginBottom:24}}>
        <KpiCard icon="🛒" label="إجمالى المشتريات" value={fmt(total)} sub={currencySymbol} color="purple" delta="إجمالى"/>
        <KpiCard icon="✅" label="مدفوع" value={fmt(paid)} sub={currencySymbol} color="green" delta="مدفوع" deltaUp/>
        <KpiCard icon="⏳" label="معلق الدفع" value={fmt(pending)} sub={currencySymbol} color="orange" delta="معلق"/>
      </div>
      <DataCard title="قائمة الفواتير" icon="🛒" actions={
        <><SearchInput value={search} onChange={setSearch}/>
        {['','مدفوع','معلق','مرفوض'].map(s=><button key={s} onClick={()=>setFlt(s)} style={{padding:'6px 14px',borderRadius:20,border:`1px solid ${flt===s?'#D4920A':'rgba(255,255,255,0.06)'}`,background:flt===s?'rgba(196,140,10,0.15)':'rgba(255,255,255,0.03)',color:flt===s?'#E8A820':'#5A6A80',fontSize:11,fontWeight:700,fontFamily:'Cairo',cursor:'pointer'}}>{s||'الكل'}</button>)}
        <button className="btn btn-gold btn-sm" onClick={()=>setModal({})}>➕</button></>
      } footer={<span style={{fontSize:11,color:'#5A6A80'}}>إجمالى: <strong style={{color:'#E8A820'}}>{fmt(items.reduce((a,p)=>a+(+p.qty||1)*(+p.price||0),0))} {currencySymbol}</strong></span>}>
        {items.length===0?<EmptyState icon="🛒" title="لا توجد فواتير" subtitle='اضغط "فاتورة جديدة" للبدء' action={<button className="btn btn-gold" onClick={()=>setModal({})}>➕ فاتورة جديدة</button>}/>:(
          <div style={{overflowX:'auto'}}>
            <table className="data-table">
              <thead><tr><th>التاريخ</th><th>رقم الفاتورة</th><th>المورد</th><th>المشروع</th><th>النوع</th><th>الوصف</th><th>الإجمالى</th><th>الحالة</th><th>إجراءات</th></tr></thead>
              <tbody>
                {items.map((p,i)=>{
                  const ri=(db.purchases||[]).indexOf(p);
                  return <tr key={i}>
                    <td style={{fontSize:11,color:'#5A6A80'}}>{p.date}</td>
                    <td style={{fontFamily:'monospace',color:'#60A5FA',fontSize:11}}>{p.invoiceNo}</td>
                    <td style={{fontWeight:700,color:'#E8D9B8'}}>{p.supplier}</td>
                    <td style={{color:'#60A5FA',fontSize:11}}>{p.project||'—'}</td>
                    <td>{p.type}</td>
                    <td>{p.description}</td>
                    <td><span style={{fontFamily:'Tajawal,Cairo',fontWeight:800,color:'#F5C842'}}>{fmt((+p.qty||1)*(+p.price||0))} {currencySymbol}</span></td>
                    <td><StatusBadge status={p.paymentStatus} small/></td>
                    <td><div style={{display:'flex',gap:4,justifyContent:'center'}}>
                      <ActionBtn type="edit" onClick={()=>setModal({data:p,idx:ri})} small/>
                      <ActionBtn type="delete" onClick={()=>del(ri)} small/>
                    </div></td>
                  </tr>;
                })}
              </tbody>
            </table>
          </div>
        )}
      </DataCard>
      {modal&&<PurchaseForm initial={modal.data} projects={db.projects||[]} suppliers={db.suppliers||[]} onSave={save} onClose={()=>setModal(null)} currencySymbol={currencySymbol}/>}
    </div>
  );
}
