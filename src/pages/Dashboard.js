import React, { useMemo } from 'react';
import { useApp } from '../App';
import { KpiCard, StatusBadge, ProgressBar, DaysChip, fmt, fmtDate } from '../components/UI';
import { EXPENSE_CATEGORIES, CURRENCIES } from '../config';

export default function Dashboard() {
  const { db, navigate, currencySymbol, currency } = useApp();

  const stats = useMemo(() => {
    const projects = db.projects||[], workers = db.workers||[];
    const purchases = db.purchases||[], expenses = db.expenses||[];
    const approvals = (db.approvals||[]).filter(a=>a.status==='بانتظار الموافقة');

    const totalContract = projects.reduce((a,p)=>a+(+p.contractValue||0),0);
    const totalPur = purchases.reduce((a,p)=>a+(+p.qty||1)*(+p.price||0),0);
    const totalSal = workers.reduce((a,w)=>a+(+w.salary||0),0);
    const totalExp = expenses.reduce((a,e)=>a+(+e.amount||0),0);
    const profit = totalContract - totalPur - totalSal - totalExp;

    const today = new Date(), d30 = new Date(today.getTime()+30*864e5);
    const expiring = [
      ...workers.filter(w=>w.iqamaExpiry&&new Date(w.iqamaExpiry)<=d30).map(w=>({type:'إقامة',name:w.name,date:w.iqamaExpiry,urgent:new Date(w.iqamaExpiry)<=today})),
      ...workers.filter(w=>w.passportExpiry&&new Date(w.passportExpiry)<=d30).map(w=>({type:'جواز',name:w.name,date:w.passportExpiry,urgent:new Date(w.passportExpiry)<=today})),
      ...workers.filter(w=>w.visaExpiry&&new Date(w.visaExpiry)<=d30).map(w=>({type:'تأشيرة',name:w.name,date:w.visaExpiry,urgent:new Date(w.visaExpiry)<=today})),
      ...(db.documents||[]).filter(d=>d.expiry&&new Date(d.expiry)<=d30).map(d=>({type:d.type||'وثيقة',name:d.name,date:d.expiry,urgent:new Date(d.expiry)<=today})),
    ].sort((a,b)=>new Date(a.date)-new Date(b.date));

    // Health score
    const lateRatio = projects.length>0?projects.filter(p=>p.status==='متأخر').length/projects.length:0;
    const expiringScore = expiring.filter(e=>e.urgent).length>0?0:expiring.length>5?0.5:1;
    const profitScore = profit>0?1:profit>-10000?0.5:0;
    const healthScore = Math.round((1-lateRatio)*40 + expiringScore*30 + profitScore*30);

    // Category expenses
    const catExp = EXPENSE_CATEGORIES.map(cat=>({
      ...cat,
      amount: expenses.filter(e=>e.category===cat.id).reduce((a,e)=>a+(+e.amount||0),0)
    })).filter(c=>c.amount>0).sort((a,b)=>b.amount-a.amount);

    return { totalContract,totalPur,totalSal,totalExp,profit,healthScore,expiring,approvals,catExp,
      activeProjects:projects.filter(p=>p.status==='قيد التنفيذ').length,
      lateProjects:projects.filter(p=>p.status==='متأخر').length,
      doneProjects:projects.filter(p=>p.status==='مكتمل').length,
      totalWorkers:workers.length,
    };
  },[db]);

  const healthColor = stats.healthScore>=80?'#4ADE80':stats.healthScore>=60?'#FB923C':'#F87171';
  const healthLabel = stats.healthScore>=80?'ممتاز 🟢':stats.healthScore>=60?'يحتاج انتباه 🟡':'تدخل عاجل 🔴';

  const quickLinks = [
    {icon:'🏗️',label:'مشروع',page:'projects',c:'#C48C0A'},{icon:'📄',label:'عقد',page:'contracts',c:'#1565C0'},
    {icon:'🧾',label:'مستخلص',page:'extracts',c:'#1B5E20'},{icon:'🛒',label:'شراء',page:'purchases',c:'#4A148C'},
    {icon:'👷',label:'عامل',page:'workers',c:'#E65100'},{icon:'💸',label:'مصروف',page:'expenses',c:'#7F0000'},
    {icon:'📊',label:'يومية',page:'daily_report',c:'#004D40'},{icon:'🔄',label:'تغيير',page:'variations',c:'#5A6A80'},
  ];

  return (
    <div>
      {/* KPI Row 1 */}
      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:16,marginBottom:16}}>
        <KpiCard icon="💰" label="إجمالى قيمة المشاريع" value={fmt(stats.totalContract)} sub={currencySymbol} color="gold" delta="العقود" deltaUp/>
        <KpiCard icon="▶️" label="مشاريع جارية" value={stats.activeProjects} sub="قيد التنفيذ" color="blue" delta="نشط" deltaUp/>
        <KpiCard icon="⚠️" label="مشاريع متأخرة" value={stats.lateProjects} sub="تحتاج تدخل" color="red" delta="متأخر"/>
        <KpiCard icon="📈" label="صافى الربح المتوقع" value={fmt(stats.profit)} sub={currencySymbol} color={stats.profit>=0?'teal':'red'} delta={stats.profit>=0?'▲ ربح':'▼ خسارة'} deltaUp={stats.profit>=0}/>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:16,marginBottom:24}}>
        <KpiCard icon="👷" label="إجمالى العمال" value={stats.totalWorkers} sub="عامل" color="orange" delta="HR" deltaUp/>
        <KpiCard icon="💸" label="إجمالى المصروفات" value={fmt(stats.totalExp)} sub={currencySymbol} color="purple" delta="مصروف"/>
        <KpiCard icon="✅" label="مشاريع مكتملة" value={stats.doneProjects} sub="تسليم" color="green" delta="مكتمل" deltaUp/>
        <KpiCard icon="⏳" label="موافقات معلقة" value={stats.approvals.length} sub="تحتاج قرارك" color={stats.approvals.length>0?'red':'green'} delta={stats.approvals.length>0?'عاجل':'لا شيء'} deltaUp={stats.approvals.length===0}/>
      </div>

      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:20,marginBottom:24}}>
        {/* Health Score */}
        <div style={{background:'linear-gradient(145deg,#0C1525,#111E30)',border:'1px solid rgba(212,146,10,0.12)',borderRadius:16,padding:24,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',textAlign:'center'}}>
          <div style={{fontSize:12,fontWeight:800,color:'#5A6A80',letterSpacing:1,marginBottom:16}}>📊 مؤشر صحة الشركة</div>
          <div style={{width:110,height:110,borderRadius:'50%',border:`6px solid ${healthColor}`,display:'flex',alignItems:'center',justifyContent:'center',marginBottom:16,boxShadow:`0 0 24px ${healthColor}44`,background:`${healthColor}11`}}>
            <div>
              <div style={{fontSize:32,fontWeight:900,color:healthColor,fontFamily:'Tajawal,Cairo',lineHeight:1}}>{stats.healthScore}</div>
              <div style={{fontSize:10,color:'#5A6A80'}}>من 100</div>
            </div>
          </div>
          <div style={{fontSize:13,fontWeight:800,color:healthColor}}>{healthLabel}</div>
          <div style={{fontSize:10,color:'#5A6A80',marginTop:6}}>يحسب من: التأخيرات، الربحية، الوثائق</div>
        </div>

        {/* Expense breakdown */}
        <div style={{background:'linear-gradient(145deg,#0C1525,#111E30)',border:'1px solid rgba(212,146,10,0.12)',borderRadius:16,overflow:'hidden'}}>
          <div style={{padding:'14px 18px',borderBottom:'1px solid rgba(212,146,10,0.1)',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
            <span style={{fontSize:13,fontWeight:800,color:'#E8D9B8'}}>💸 المصروفات بالأقسام</span>
            <button onClick={()=>navigate('expenses')} style={{fontSize:11,color:'#C48C0A',background:'none',border:'none',cursor:'pointer',fontFamily:'Cairo',fontWeight:700}}>تفاصيل ←</button>
          </div>
          <div style={{padding:'12px 18px'}}>
            {stats.catExp.length===0 ? <div style={{textAlign:'center',padding:'20px',color:'#5A6A80',fontSize:12}}>لا توجد مصروفات</div> :
              stats.catExp.slice(0,5).map((cat,i)=>{
                const total = stats.catExp.reduce((a,c)=>a+c.amount,0);
                const pct = total>0?Math.round(cat.amount/total*100):0;
                return (
                  <div key={i} style={{marginBottom:10}}>
                    <div style={{display:'flex',justifyContent:'space-between',marginBottom:4}}>
                      <span style={{fontSize:11,color:'#C4B99A'}}>{cat.icon} {cat.label}</span>
                      <span style={{fontSize:11,fontWeight:800,color:'#F5C842',fontFamily:'Tajawal,Cairo'}}>{fmt(cat.amount)}</span>
                    </div>
                    <div style={{height:5,background:'rgba(255,255,255,0.06)',borderRadius:3}}>
                      <div style={{width:`${pct}%`,height:'100%',background:'linear-gradient(90deg,#8B6000,#E8A820)',borderRadius:3,transition:'width .6s'}}/>
                    </div>
                  </div>
                );
              })
            }
          </div>
        </div>

        {/* Quick links */}
        <div style={{background:'linear-gradient(145deg,#0C1525,#111E30)',border:'1px solid rgba(212,146,10,0.12)',borderRadius:16,overflow:'hidden'}}>
          <div style={{padding:'14px 18px',borderBottom:'1px solid rgba(212,146,10,0.1)'}}>
            <span style={{fontSize:13,fontWeight:800,color:'#E8D9B8'}}>⚡ إضافة سريعة</span>
          </div>
          <div style={{padding:14,display:'grid',gridTemplateColumns:'1fr 1fr',gap:8}}>
            {quickLinks.map(q=>(
              <button key={q.page} onClick={()=>navigate(q.page)} style={{padding:'12px 8px',borderRadius:10,background:`${q.c}18`,border:`1px solid ${q.c}33`,color:'#C4B99A',cursor:'pointer',display:'flex',flexDirection:'column',alignItems:'center',gap:6,fontSize:11,fontWeight:700,fontFamily:'Cairo',transition:'all .2s'}}
                onMouseEnter={e=>{e.currentTarget.style.background=`${q.c}28`;e.currentTarget.style.transform='translateY(-2px)';}}
                onMouseLeave={e=>{e.currentTarget.style.background=`${q.c}18`;e.currentTarget.style.transform='translateY(0)';}}>
                <span style={{fontSize:20}}>{q.icon}</span>{q.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Alerts + Approvals */}
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:20,marginBottom:24}}>
        <div style={{background:'linear-gradient(145deg,#0C1525,#111E30)',border:'1px solid rgba(212,146,10,0.12)',borderRadius:16,overflow:'hidden'}}>
          <div style={{padding:'14px 18px',borderBottom:'1px solid rgba(212,146,10,0.1)',display:'flex',alignItems:'center',gap:10}}>
            <div style={{width:8,height:8,borderRadius:'50%',background:stats.expiring.length>0?'#F87171':'#4ADE80',animation:'pulse 2s infinite'}}/>
            <span style={{fontSize:13,fontWeight:800,color:'#E8D9B8'}}>🔔 تنبيهات الوثائق</span>
            {stats.expiring.length>0&&<span style={{marginRight:'auto',background:'rgba(183,28,28,0.15)',border:'1px solid rgba(183,28,28,0.25)',borderRadius:20,padding:'2px 10px',fontSize:10,fontWeight:800,color:'#F87171'}}>{stats.expiring.length}</span>}
          </div>
          <div style={{padding:14,maxHeight:240,overflowY:'auto'}}>
            {stats.expiring.length===0 ? <div style={{textAlign:'center',padding:'24px',color:'#5A6A80',fontSize:12}}>✅ كل الوثائق سارية المفعول</div> :
              stats.expiring.map((a,i)=>(
                <div key={i} style={{display:'flex',alignItems:'center',gap:10,padding:'9px 12px',borderRadius:10,marginBottom:6,background:a.urgent?'rgba(183,28,28,0.1)':'rgba(230,81,0,0.07)',border:`1px solid ${a.urgent?'rgba(183,28,28,0.2)':'rgba(230,81,0,0.12)'}`}}>
                  <span style={{fontSize:18}}>{a.urgent?'🚨':'⚠️'}</span>
                  <div style={{flex:1}}>
                    <div style={{fontSize:12,fontWeight:700,color:'#E8D9B8'}}>{a.name}</div>
                    <div style={{fontSize:10,color:'#5A6A80'}}>{a.type} — {fmtDate(a.date)}</div>
                  </div>
                  <span style={{fontSize:10,fontWeight:800,color:a.urgent?'#F87171':'#FB923C'}}>{a.urgent?'منتهية!':Math.round((new Date(a.date)-new Date())/864e5)+' يوم'}</span>
                </div>
              ))
            }
          </div>
        </div>

        <div style={{background:'linear-gradient(145deg,#0C1525,#111E30)',border:'1px solid rgba(212,146,10,0.12)',borderRadius:16,overflow:'hidden'}}>
          <div style={{padding:'14px 18px',borderBottom:'1px solid rgba(212,146,10,0.1)',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
            <span style={{fontSize:13,fontWeight:800,color:'#E8D9B8'}}>✔️ موافقات معلقة</span>
            <button onClick={()=>navigate('approvals')} style={{fontSize:11,color:'#C48C0A',background:'none',border:'none',cursor:'pointer',fontFamily:'Cairo',fontWeight:700}}>الكل ←</button>
          </div>
          <div style={{padding:14,maxHeight:240,overflowY:'auto'}}>
            {stats.approvals.length===0 ? <div style={{textAlign:'center',padding:'24px',color:'#5A6A80',fontSize:12}}>✅ لا توجد موافقات معلقة</div> :
              stats.approvals.map((a,i)=>(
                <div key={i} style={{display:'flex',alignItems:'center',gap:10,padding:'9px 12px',borderRadius:10,marginBottom:6,background:'rgba(230,81,0,0.08)',border:'1px solid rgba(230,81,0,0.15)'}}>
                  <span style={{fontSize:18}}>⏳</span>
                  <div style={{flex:1}}>
                    <div style={{fontSize:12,fontWeight:700,color:'#E8D9B8'}}>{a.title}</div>
                    <div style={{fontSize:10,color:'#5A6A80'}}>{a.type} · {a.requestedBy}</div>
                  </div>
                  <span style={{fontSize:13,fontWeight:800,color:'#F5C842',fontFamily:'Tajawal,Cairo'}}>{fmt(a.amount)} {currencySymbol}</span>
                </div>
              ))
            }
          </div>
        </div>
      </div>

      {/* Projects table */}
      <div style={{background:'linear-gradient(180deg,#111E30,#0C1525)',border:'1px solid rgba(212,146,10,0.12)',borderRadius:16,overflow:'hidden'}}>
        <div style={{padding:'14px 20px',borderBottom:'1px solid rgba(212,146,10,0.1)',display:'flex',justifyContent:'space-between',alignItems:'center',background:'linear-gradient(135deg,rgba(196,140,10,0.05),transparent)'}}>
          <div style={{display:'flex',alignItems:'center',gap:10,fontSize:14,fontWeight:800,color:'#E8D9B8'}}>
            <div style={{width:8,height:8,borderRadius:'50%',background:'#E8A820',animation:'pulse 2s infinite'}}/>
            🏗️ المشاريع الجارية
          </div>
          <button onClick={()=>navigate('projects')} style={{fontSize:12,color:'#C48C0A',background:'none',border:'none',cursor:'pointer',fontFamily:'Cairo',fontWeight:700}}>عرض الكل ←</button>
        </div>
        {(db.projects||[]).length===0 ? (
          <div style={{textAlign:'center',padding:'40px',color:'#5A6A80',fontSize:13}}>
            <div style={{fontSize:36,marginBottom:12}}>🏗️</div>
            لا توجد مشاريع — <button onClick={()=>navigate('projects')} style={{color:'#E8A820',background:'none',border:'none',cursor:'pointer',fontFamily:'Cairo',fontWeight:700,fontSize:13}}>أضف مشروعاً</button>
          </div>
        ) : (
          <div style={{overflowX:'auto'}}>
            <table className="data-table">
              <thead><tr><th>#</th><th>المشروع</th><th>العميل</th><th>قيمة العقد</th><th>الإنجاز</th><th>الحالة</th><th>الأيام المتبقية</th></tr></thead>
              <tbody>
                {(db.projects||[]).slice(0,8).map((p,i)=>(
                  <tr key={i} onClick={()=>navigate('projects')} style={{cursor:'pointer'}}>
                    <td><span style={{fontFamily:'monospace',color:'#60A5FA',fontSize:11}}>{p.code||i+1}</span></td>
                    <td style={{textAlign:'right'}}><div style={{fontWeight:800,color:'#fff'}}>{p.name}</div><div style={{fontSize:10,color:'#5A6A80'}}>{p.location}</div></td>
                    <td>{p.client}</td>
                    <td><span style={{fontFamily:'Tajawal,Cairo',fontWeight:800,color:'#F5C842'}}>{fmt(p.contractValue)} {currencySymbol}</span></td>
                    <td style={{minWidth:140}}><ProgressBar pct={+p.completion||0}/></td>
                    <td><StatusBadge status={p.status} small/></td>
                    <td><DaysChip endDate={p.endDate}/></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
