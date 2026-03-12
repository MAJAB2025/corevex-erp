import React from 'react';
import { useApp } from '../App';
import { MODULES } from '../config';

export default function GenericPage() {
  const { navigate } = useApp();
  return (
    <div style={{textAlign:'center',padding:'60px 20px'}}>
      <div style={{fontSize:50,marginBottom:16}}>🔧</div>
      <div style={{fontSize:18,fontWeight:800,color:'#E8D9B8',marginBottom:8}}>هذه الوحدة قيد التطوير</div>
      <div style={{fontSize:13,color:'#5A6A80',marginBottom:24}}>ستكون متاحة في التحديث القادم</div>
      <button className="btn btn-gold" onClick={()=>navigate('dashboard')}>← العودة للرئيسية</button>
    </div>
  );
}
