import React, { useState } from 'react';
import { useApp } from '../App';
import { PageHeader, KpiCard, StatusBadge, Modal, FormGrid, Field, DataCard, SearchInput, ActionBtn, EmptyState, useConfirm, fmt, fmtDate } from '../components/UI';

function VariationForm({ initial, projects, onSave, onClose, currencySymbol }) {
  const today = new Date().toISOString().split('T')[0];
  const [f, setF] = useState(initial||{date:today,voNo:'',project:'',type:'إضافة',description:'',valueChange:'',daysChange:'',reason:'',requestedBy:'',status:'بانتظار الموافقة',approvedBy:'',approvedDate:'',notes:''});
  const s = k => e => setF(p=>({...p,[k]:e.target.value}));
  return (
    <Modal title={initial?'✏️ تعديل أمر التغيير':'➕ أمر تغيير جديد'} onClose={onClose} width={720}>
      <div style={{background:'rgba(21,101,192,0.06)',borderRadius:10,padding:'10px 14px',marginBottom:16,fontSize:11,color:'#90CAF9'}}>
        ⚠️ أمر التغيير يؤثر على قيمة العقد والمدة الزمنية — تأكد من الموافقة الرسمية قبل التنفيذ
      </div>
      <FormGrid cols={3}>
        <Field label="رقم أمر التغيير"><input className="form-input" value={f.voNo} onChange={s('voNo')} placeholder="VO-001" style={{direction:'ltr',textAlign:'left'}}/></Field>
        <Field label="التاريخ"><input className="form-input" type="date" value={f.date} onChange={s('date')}/></Field>
        <Field label="المشروع"><select className="form-input" value={f.project} onChange={s('project')}>
          <option value="">اختر المشروع</option>
          {projects.map(p=><option key={p.id} value={p.code}>{p.code} - {p.name}</option>)}
        </select></Field>
        <Field label="نوع التغيير"><select className="form-input" value={f.type} onChange={s('type')}>
          {['إضافة','حذف','تعديل','بديل'].map(x=><option key={x}>{x}</option>)}
        </select></Field>
        <Field label={`التغيير في القيمة ${currencySymbol}`}><input className="form-input" type="number" value={f.valueChange} onChange={s('valueChange')} placeholder="+5000 أو -2000"/></Field>
        <Field label="التغيير في المدة (أيام)"><input className="form-input" type="number" value={f.daysChange} onChange={s('daysChange')} placeholder="+10 أو -5"/></Field>
        <Field label="طلب بواسطة"><input className="form-input" value={f.requestedBy} onChange={s('requestedBy')} placeholder="اسم الطالب"/></Field>
        <Field label="الحالة"><select className="form-input" value={f.status} onChange={s('status')}>
          {['بانتظار الموافقة','معتمد','مرفوض','ملغى'].map(x=><option key={x}>{x}</option>)}
        </select></Field>
        {f.status==='معتمد'&&<Field label="اعتمد بواسطة"><input className="form-input" value={f.approvedBy} onChange={s('approvedBy')}/></Field>}
      </FormGrid>
      <FormGrid cols={1}>
        <Field label="وصف التغيير"><textarea className="form-input" style={{minHeight:80,resize:'vertical'}} value={f.description} onChange={s('description')} placeholder="وصف تفصيلي للتغيير المطلوب"/></Field>
        <Field label="سبب التغيير"><textarea className="form-input" style={{minHeight:60,resize:'vertical'}} value={f.reason} onChange={s('reason')} placeholder="سبب هذا التغيير"/></Field>
      </FormGrid>
      <div style={{display:'flex',gap:10}}>
        <button className="btn btn-gold" onClick={()=>f.project?onSave(f):alert('اختر المشروع')}>💾 حفظ</button>
        <button className="btn btn-outline" onClick={onClose}>إلغاء</button>
      </div>
    </Modal>
  );
}

export default function Variations() {
  const { db, saveDB, showToast, currencySymbol } = useApp();
  const [modal, setModal] = useState(null);
  const [search, setSearch] = useState('');
  const { confirm, Dialog } = useConfirm();

  const items = (db.variations||[]).filter(v=>!search||v.description?.includes(search)||v.voNo?.includes(search)||v.project?.includes(search));
  const totalAdd = items.filter(v=>v.status==='معتمد'&&+v.valueChange>0).reduce((a,v)=>a+(+v.valueChange||0),0);
  const totalDed = items.filter(v=>v.status==='معتمد'&&+v.valueChange<0).reduce((a,v)=>a+Math.abs(+v.valueChange||0),0);
  const pending = items.filter(v=>v.status==='بانتظار الموافقة').length;

  const save = data => {
    const list=[...(db.variations||[])];
    if(modal?.idx>=0) list[modal.idx]={...data,id:list[modal.idx].id};
    else list.push({...data,id:Date.now()});
    saveDB({variations:list}); setModal(null); showToast('✅ تم حفظ أمر التغيير');
  };
  const del = i => confirm('حذف أمر التغيير؟',()=>{ const l=[...(db.variations||[])]; l.splice(i,1); saveDB({variations:l}); showToast('تم الحذف','er'); });

  return (
    <div>
      {Dialog}
      <PageHeader title="أوامر التغيير" icon="🔄" subtitle="Variation Orders" actions={
        <button className="btn btn-gold" onClick={()=>setModal({})}>➕ أمر تغيير جديد</button>
      }/>
      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:16,marginBottom:24}}>
        <KpiCard icon="🔄" label="إجمالى أوامر التغيير" value={items.length} sub="أمر" color="blue" delta="إجمالى" deltaUp/>
        <KpiCard icon="⏳" label="بانتظار الموافقة" value={pending} sub="أمر معلق" color={pending>0?'red':'green'} delta={pending>0?'عاجل':'لا شيء'} deltaUp={pending===0}/>
        <KpiCard icon="➕" label="إضافات معتمدة" value={fmt(totalAdd)} sub={currencySymbol} color="green" delta="إضافة" deltaUp/>
        <KpiCard icon="➖" label="تخفيضات معتمدة" value={fmt(totalDed)} sub={currencySymbol} color="red" delta="خصم"/>
      </div>
      <DataCard title="قائمة أوامر التغيير" icon="🔄" actions={
        <><SearchInput value={search} onChange={setSearch}/><button className="btn btn-gold btn-sm" onClick={()=>setModal({})}>➕</button></>
      }>
        {items.length===0?<EmptyState icon="🔄" title="لا توجد أوامر تغيير" subtitle="اضغط ➕ لإضافة أمر تغيير جديد"/>:(
          <div style={{overflowX:'auto'}}>
            <table className="data-table">
              <thead><tr><th>رقم VO</th><th>التاريخ</th><th>المشروع</th><th>النوع</th><th>الوصف</th><th>التغيير المالي</th><th>الأيام</th><th>الحالة</th><th>إجراءات</th></tr></thead>
              <tbody>
                {items.map((v,i)=>{
                  const ri=(db.variations||[]).indexOf(v);
                  return <tr key={i}>
                    <td style={{fontFamily:'monospace',color:'#60A5FA',fontSize:11}}>{v.voNo}</td>
                    <td style={{fontSize:11,color:'#5A6A80'}}>{v.date}</td>
                    <td style={{color:'#60A5FA',fontSize:11}}>{v.project}</td>
                    <td>{v.type}</td>
                    <td style={{maxWidth:200,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{v.description}</td>
                    <td><span style={{fontFamily:'Tajawal,Cairo',fontWeight:800,color:+v.valueChange>=0?'#4ADE80':'#F87171'}}>{+v.valueChange>=0?'+':''}{fmt(v.valueChange)} {currencySymbol}</span></td>
                    <td><span style={{color:+v.daysChange>=0?'#FB923C':'#4ADE80'}}>{+v.daysChange>=0?'+':''}{v.daysChange||0} يوم</span></td>
                    <td><StatusBadge status={v.status} small/></td>
                    <td><div style={{display:'flex',gap:4,justifyContent:'center'}}>
                      <ActionBtn type="edit" onClick={()=>setModal({data:v,idx:ri})} small/>
                      <ActionBtn type="delete" onClick={()=>del(ri)} small/>
                    </div></td>
                  </tr>;
                })}
              </tbody>
            </table>
          </div>
        )}
      </DataCard>
      {modal&&<VariationForm initial={modal.data} projects={db.projects||[]} onSave={save} onClose={()=>setModal(null)} currencySymbol={currencySymbol}/>}
    </div>
  );
}
