import React, { useState } from 'react';
import { useApp } from '../App';
import { PageHeader, KpiCard, StatusBadge, Modal, FormGrid, Field, DataCard, SearchInput, ActionBtn, EmptyState, useConfirm, fmt, fmtDate } from '../components/UI';

const NATIONALITIES = ['سعودي','مصري','يمني','سوداني','باكستاني','هندي','بنغلاديشي','فلبيني','سريلانكي','أخرى'];
const JOBS = ['عامل عام','نجار','حداد','مسلح','بناء','كهربائي','سباك','بلاط','دهان','مشرف','مهندس','سائق','أخرى'];

function WorkerForm({ initial, onSave, onClose }) {
  const [f, setF] = useState(initial || {
    name:'', nameEn:'', nationality:'', iqamaNo:'', iqamaExpiry:'',
    passportNo:'', passportExpiry:'', visaNo:'', visaExpiry:'',
    job:'', salary:'', phone:'', startDate:'', contractExpiry:'',
    healthInsurance:'', status:'نشط', notes:''
  });
  const s = k => e => setF(p => ({ ...p, [k]: e.target.value }));
  return (
    <Modal title={initial?'✏️ تعديل بيانات العامل':'➕ إضافة عامل جديد'} onClose={onClose} width={760}>
      <div style={{background:'rgba(196,140,10,0.06)',borderRadius:10,padding:'10px 14px',marginBottom:18,fontSize:11,color:'#C4B99A'}}>
        ⚠️ تأكد من إدخال تواريخ الانتهاء بدقة — سيتم تنبيهك قبل 30 و60 و90 يوم
      </div>
      <div style={{fontSize:12,fontWeight:800,color:'#E8A820',marginBottom:12}}>📋 البيانات الشخصية</div>
      <FormGrid cols={3}>
        <Field label="الاسم بالعربي" span={2}><input className="form-input" value={f.name} onChange={s('name')} placeholder="الاسم الكامل"/></Field>
        <Field label="الجنسية"><select className="form-input" value={f.nationality} onChange={s('nationality')}><option value="">اختر</option>{NATIONALITIES.map(x=><option key={x}>{x}</option>)}</select></Field>
        <Field label="الاسم بالإنجليزي" span={2}><input className="form-input" value={f.nameEn} onChange={s('nameEn')} placeholder="Full Name in English" style={{direction:'ltr',textAlign:'left'}}/></Field>
        <Field label="رقم الجوال"><input className="form-input" value={f.phone} onChange={s('phone')} placeholder="05XXXXXXXX"/></Field>
      </FormGrid>
      <div style={{fontSize:12,fontWeight:800,color:'#E8A820',marginBottom:12,marginTop:4}}>🪪 وثائق الإقامة والسفر</div>
      <FormGrid cols={3}>
        <Field label="رقم الإقامة"><input className="form-input" value={f.iqamaNo} onChange={s('iqamaNo')} style={{direction:'ltr',textAlign:'left'}}/></Field>
        <Field label="تاريخ انتهاء الإقامة"><input className="form-input" type="date" value={f.iqamaExpiry} onChange={s('iqamaExpiry')}/></Field>
        <Field label="رقم جواز السفر"><input className="form-input" value={f.passportNo} onChange={s('passportNo')} style={{direction:'ltr',textAlign:'left'}}/></Field>
        <Field label="تاريخ انتهاء الجواز"><input className="form-input" type="date" value={f.passportExpiry} onChange={s('passportExpiry')}/></Field>
        <Field label="رقم التأشيرة"><input className="form-input" value={f.visaNo} onChange={s('visaNo')} style={{direction:'ltr',textAlign:'left'}}/></Field>
        <Field label="تاريخ انتهاء التأشيرة"><input className="form-input" type="date" value={f.visaExpiry} onChange={s('visaExpiry')}/></Field>
      </FormGrid>
      <div style={{fontSize:12,fontWeight:800,color:'#E8A820',marginBottom:12,marginTop:4}}>💼 بيانات العمل</div>
      <FormGrid cols={3}>
        <Field label="المهنة"><select className="form-input" value={f.job} onChange={s('job')}><option value="">اختر</option>{JOBS.map(x=><option key={x}>{x}</option>)}</select></Field>
        <Field label="الراتب الأساسي ر.س"><input className="form-input" type="number" value={f.salary} onChange={s('salary')}/></Field>
        <Field label="تاريخ بداية العمل"><input className="form-input" type="date" value={f.startDate} onChange={s('startDate')}/></Field>
        <Field label="انتهاء العقد"><input className="form-input" type="date" value={f.contractExpiry} onChange={s('contractExpiry')}/></Field>
        <Field label="رقم التأمين الصحي"><input className="form-input" value={f.healthInsurance} onChange={s('healthInsurance')} style={{direction:'ltr',textAlign:'left'}}/></Field>
        <Field label="الحالة"><select className="form-input" value={f.status} onChange={s('status')}>{['نشط','إجازة','منتهى'].map(x=><option key={x}>{x}</option>)}</select></Field>
      </FormGrid>
      <FormGrid cols={1}>
        <Field label="ملاحظات"><textarea className="form-input" style={{minHeight:60,resize:'vertical'}} value={f.notes} onChange={s('notes')}/></Field>
      </FormGrid>
      <div style={{display:'flex',gap:10}}>
        <button className="btn btn-gold" onClick={()=>f.name?onSave(f):alert('أدخل اسم العامل')}>💾 حفظ</button>
        <button className="btn btn-outline" onClick={onClose}>إلغاء</button>
      </div>
    </Modal>
  );
}

function DocStatus({ date, label }) {
  if (!date) return <span style={{color:'#5A6A80',fontSize:10}}>—</span>;
  const days = Math.round((new Date(date)-new Date())/864e5);
  const clr = days < 0 ? '#F87171' : days < 30 ? '#FB923C' : days < 90 ? '#F5C842' : '#4ADE80';
  return (
    <div style={{fontSize:10}}>
      <div style={{color:clr,fontWeight:800}}>{days<0?'منتهية':days<30?`${days} يوم`:fmtDate(date)}</div>
      <div style={{color:'#5A6A80'}}>{label}</div>
    </div>
  );
}

export default function Workers() {
  const { db, saveDB, showToast } = useApp();
  const [modal, setModal] = useState(null);
  const [search, setSearch] = useState('');
  const { confirm, Dialog } = useConfirm();

  const workers = (db.workers||[]).filter(w => {
    const q = search.toLowerCase();
    return !q || w.name?.includes(q) || w.job?.includes(q) || w.nationality?.includes(q) || w.iqamaNo?.includes(q);
  });

  const save = (data) => {
    const list = [...(db.workers||[])];
    if (modal?.idx >= 0) list[modal.idx] = { ...data, id: list[modal.idx].id };
    else list.push({ ...data, id: Date.now() });
    saveDB({ workers: list });
    setModal(null);
    showToast('✅ تم حفظ بيانات العامل');
  };

  const del = (i) => confirm('حذف بيانات هذا العامل؟', () => {
    const list = [...(db.workers||[])]; list.splice(i,1);
    saveDB({ workers: list }); showToast('تم الحذف','er');
  });

  const today = new Date();
  const days30 = new Date(today.getTime()+30*864e5);
  const expiring = (db.workers||[]).filter(w =>
    (w.iqamaExpiry && new Date(w.iqamaExpiry)<=days30) ||
    (w.passportExpiry && new Date(w.passportExpiry)<=days30) ||
    (w.visaExpiry && new Date(w.visaExpiry)<=days30)
  ).length;

  return (
    <div>
      {Dialog}
      <PageHeader title="العمال" icon="👷" subtitle="إدارة الموارد البشرية" actions={
        <button className="btn btn-gold" onClick={()=>setModal({})}>➕ إضافة عامل</button>
      }/>
      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:16,marginBottom:24}}>
        <KpiCard icon="👷" label="إجمالى العمال" value={(db.workers||[]).length} sub="عامل مسجل" color="blue" delta="إجمالى" deltaUp/>
        <KpiCard icon="✅" label="عمال نشطون" value={(db.workers||[]).filter(w=>w.status==='نشط').length} sub="في العمل" color="green" delta="نشط" deltaUp/>
        <KpiCard icon="⚠️" label="وثائق تنتهي" value={expiring} sub="خلال 30 يوم" color={expiring>0?'red':'green'} delta={expiring>0?'عاجل':'آمن'} deltaUp={expiring===0}/>
        <KpiCard icon="💵" label="إجمالى الرواتب" value={fmt((db.workers||[]).reduce((a,w)=>a+(+w.salary||0),0))} sub="ريال / شهر" color="gold" delta="شهري"/>
      </div>
      <DataCard title="سجل العمال" icon="👷" actions={
        <><SearchInput value={search} onChange={setSearch}/><button className="btn btn-gold btn-sm" onClick={()=>setModal({})}>➕</button></>
      } footer={<span style={{fontSize:11,color:'#5A6A80'}}>إجمالى: <strong style={{color:'#E8A820'}}>{workers.length}</strong> عامل</span>}>
        {workers.length===0 ? <EmptyState icon="👷" title="لا يوجد عمال" subtitle='اضغط "إضافة عامل" للبدء' action={<button className="btn btn-gold" onClick={()=>setModal({})}>➕ إضافة عامل</button>}/> : (
          <div style={{overflowX:'auto'}}>
            <table className="data-table">
              <thead><tr>
                <th>الاسم</th><th>الجنسية</th><th>المهنة</th><th>الإقامة</th><th>الجواز</th><th>التأشيرة</th><th>العقد</th><th>الراتب</th><th>الحالة</th><th>إجراءات</th>
              </tr></thead>
              <tbody>
                {workers.map((w,i)=>{
                  const realIdx = (db.workers||[]).indexOf(w);
                  return (
                    <tr key={i}>
                      <td style={{textAlign:'right'}}><div style={{fontWeight:800,color:'#fff'}}>{w.name}</div><div style={{fontSize:10,color:'#5A6A80',direction:'ltr'}}>{w.nameEn}</div></td>
                      <td>{w.nationality}</td>
                      <td>{w.job}</td>
                      <td><DocStatus date={w.iqamaExpiry} label="إقامة"/></td>
                      <td><DocStatus date={w.passportExpiry} label="جواز"/></td>
                      <td><DocStatus date={w.visaExpiry} label="تأشيرة"/></td>
                      <td><DocStatus date={w.contractExpiry} label="عقد"/></td>
                      <td><span style={{fontFamily:'Tajawal,Cairo',fontWeight:700,color:'#4ADE80'}}>{fmt(w.salary)} ر.س</span></td>
                      <td><StatusBadge status={w.status||'نشط'} small/></td>
                      <td><div style={{display:'flex',gap:4,justifyContent:'center'}}>
                        <ActionBtn type="edit" onClick={()=>setModal({data:w,idx:realIdx})} small/>
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
      {modal && <WorkerForm initial={modal.data} onSave={save} onClose={()=>setModal(null)}/>}
    </div>
  );
}
