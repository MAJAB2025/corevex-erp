import React, { useState } from 'react';
import { useApp } from '../App';
import { PageHeader, KpiCard, StatusBadge, ProgressBar, DaysChip, Modal, FormGrid, Field, DataCard, SearchInput, ActionBtn, EmptyState, useConfirm, fmt, fmtSAR, fmtDate } from '../components/UI';

const STATUSES = ['قيد التنفيذ','مكتمل','متأخر','مؤجل','متوقف'];

function ProjectForm({ initial, onSave, onClose }) {
  const [f, setF] = useState(initial || { code:'', name:'', client:'', manager:'', contractValue:'', expenses:'', startDate:'', endDate:'', status:'قيد التنفيذ', completion:'0', stars:'5', location:'', description:'' });
  const s = k => e => setF(p => ({ ...p, [k]: e.target.value }));
  return (
    <Modal title={initial ? '✏️ تعديل المشروع' : '➕ مشروع جديد'} onClose={onClose} width={720}>
      <FormGrid cols={3}>
        <Field label="رمز المشروع"><input className="form-input" value={f.code} onChange={s('code')} placeholder="P-001"/></Field>
        <Field label="اسم المشروع" span={2}><input className="form-input" value={f.name} onChange={s('name')} placeholder="اسم المشروع"/></Field>
        <Field label="العميل"><input className="form-input" value={f.client} onChange={s('client')} placeholder="اسم العميل"/></Field>
        <Field label="مدير المشروع"><input className="form-input" value={f.manager} onChange={s('manager')} placeholder="الاسم"/></Field>
        <Field label="الموقع"><input className="form-input" value={f.location} onChange={s('location')} placeholder="الرياض"/></Field>
        <Field label="قيمة العقد ر.س"><input className="form-input" type="number" value={f.contractValue} onChange={s('contractValue')}/></Field>
        <Field label="المصروفات المباشرة ر.س"><input className="form-input" type="number" value={f.expenses} onChange={s('expenses')}/></Field>
        <Field label="الحالة"><select className="form-input" value={f.status} onChange={s('status')}>{STATUSES.map(x=><option key={x}>{x}</option>)}</select></Field>
        <Field label="تاريخ البداية"><input className="form-input" type="date" value={f.startDate} onChange={s('startDate')}/></Field>
        <Field label="تاريخ التسليم"><input className="form-input" type="date" value={f.endDate} onChange={s('endDate')}/></Field>
        <Field label="نسبة الإنجاز %"><input className="form-input" type="number" min="0" max="100" value={f.completion} onChange={s('completion')}/></Field>
      </FormGrid>
      <FormGrid cols={1}>
        <Field label="وصف المشروع"><textarea className="form-input" style={{minHeight:80,resize:'vertical'}} value={f.description} onChange={s('description')}/></Field>
      </FormGrid>
      <div style={{display:'flex',gap:10}}>
        <button className="btn btn-gold" onClick={()=>f.name?onSave(f):alert('أدخل اسم المشروع')}>💾 حفظ</button>
        <button className="btn btn-outline" onClick={onClose}>إلغاء</button>
      </div>
    </Modal>
  );
}

export default function Projects() {
  const { db, saveDB, showToast } = useApp();
  const [modal, setModal] = useState(null);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('');
  const { confirm, Dialog } = useConfirm();

  const projects = (db.projects || []).filter(p => {
    const q = search.toLowerCase();
    const match = !q || p.name?.includes(q) || p.client?.includes(q) || p.code?.includes(q);
    return match && (!filter || p.status === filter);
  });

  const save = (data) => {
    const list = [...(db.projects || [])];
    if (modal?.idx >= 0) list[modal.idx] = { ...data, id: list[modal.idx].id };
    else list.push({ ...data, id: Date.now() });
    saveDB({ projects: list });
    setModal(null);
    showToast('✅ تم حفظ المشروع');
  };

  const del = (i) => confirm('حذف هذا المشروع؟', () => {
    const list = [...(db.projects || [])];
    list.splice(i, 1);
    saveDB({ projects: list });
    showToast('تم الحذف', 'er');
  });

  const total = (db.projects||[]).reduce((a,p)=>a+(p.contractValue||0),0);
  const active = (db.projects||[]).filter(p=>p.status==='قيد التنفيذ').length;
  const late   = (db.projects||[]).filter(p=>p.status==='متأخر').length;
  const done   = (db.projects||[]).filter(p=>p.status==='مكتمل').length;

  return (
    <div>
      {Dialog}
      <PageHeader title="المشاريع" icon="🏗️" subtitle="إدارة المشاريع" actions={
        <button className="btn btn-gold" onClick={()=>setModal({})}>➕ مشروع جديد</button>
      }/>
      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:16,marginBottom:24}}>
        <KpiCard icon="💼" label="إجمالى العقود" value={fmt(total)} sub="ريال" color="gold" delta="إجمالى" deltaUp/>
        <KpiCard icon="▶️" label="جارية" value={active} sub="مشروع" color="blue" delta="نشط" deltaUp/>
        <KpiCard icon="⚠️" label="متأخرة" value={late} sub="مشروع" color="red" delta="تأخير"/>
        <KpiCard icon="✅" label="مكتملة" value={done} sub="مشروع" color="green" delta="تسليم" deltaUp/>
      </div>
      <DataCard title="قائمة المشاريع" icon="🏗️" actions={
        <>
          <SearchInput value={search} onChange={setSearch}/>
          <div style={{display:'flex',gap:6}}>
            {['','قيد التنفيذ','مكتمل','متأخر','مؤجل'].map(s=>(
              <button key={s} onClick={()=>setFilter(s)} style={{padding:'7px 14px',borderRadius:20,border:`1px solid ${filter===s?'#D4920A':'rgba(255,255,255,0.06)'}`,background:filter===s?'rgba(196,140,10,0.15)':'rgba(255,255,255,0.03)',color:filter===s?'#E8A820':'#5A6A80',fontSize:11,fontWeight:700,fontFamily:'Cairo',cursor:'pointer'}}>
                {s||'الكل'}
              </button>
            ))}
          </div>
          <button className="btn btn-gold btn-sm" onClick={()=>setModal({})}>➕</button>
        </>
      } footer={<span style={{fontSize:11,color:'#5A6A80'}}>إجمالى: <strong style={{color:'#E8A820'}}>{projects.length}</strong> مشروع</span>}>
        {projects.length === 0 ? <EmptyState icon="🏗️" title="لا توجد مشاريع" subtitle='اضغط "مشروع جديد" للبدء' action={<button className="btn btn-gold" onClick={()=>setModal({})}>➕ مشروع جديد</button>}/> : (
          <div style={{overflowX:'auto'}}>
            <table className="data-table">
              <thead><tr>
                <th>#</th><th>المشروع</th><th>العميل</th><th>قيمة العقد</th><th>الإنجاز</th><th>الحالة</th><th>البداية</th><th>التسليم</th><th>الأيام</th><th>إجراءات</th>
              </tr></thead>
              <tbody>
                {projects.map((p,i)=>(
                  <tr key={i}>
                    <td><span style={{fontFamily:'monospace',color:'#60A5FA',fontSize:11}}>{p.code||i+1}</span></td>
                    <td style={{textAlign:'right'}}><div style={{fontWeight:800,color:'#fff'}}>{p.name}</div><div style={{fontSize:10,color:'#5A6A80'}}>{p.location}</div></td>
                    <td>{p.client}</td>
                    <td><span style={{fontFamily:'Tajawal,Cairo',fontWeight:800,color:'#F5C842'}}>{fmt(p.contractValue)} ر.س</span></td>
                    <td style={{minWidth:140}}><ProgressBar pct={+p.completion||0}/></td>
                    <td><StatusBadge status={p.status} small/></td>
                    <td style={{fontSize:11,color:'#5A6A80'}}>{fmtDate(p.startDate)}</td>
                    <td style={{fontSize:11,color:'#5A6A80'}}>{fmtDate(p.endDate)}</td>
                    <td><DaysChip endDate={p.endDate}/></td>
                    <td><div style={{display:'flex',gap:4,justifyContent:'center'}}>
                      <ActionBtn type="edit" onClick={()=>setModal({data:p,idx:(db.projects||[]).indexOf(p)})} small/>
                      <ActionBtn type="delete" onClick={()=>del((db.projects||[]).indexOf(p))} small/>
                    </div></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </DataCard>
      {modal && <ProjectForm initial={modal.data} onSave={save} onClose={()=>setModal(null)}/>}
    </div>
  );
}
