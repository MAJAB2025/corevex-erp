import React, { useState } from 'react';
import { useApp } from '../App';
import { PageHeader, DataCard, EmptyState, SearchInput } from '../components/UI';

export default function Alerts() {
  const { db, saveDB, showToast } = useApp();
  const [search, setSearch] = useState('');

  return (
    <div>
      <PageHeader title="التنبيهات" icon="🔔" subtitle="التنبيهات والإشعارات" actions={
        <button className="btn btn-gold">&#xFF0B; إضافة جديد</button>
      }/>
      <DataCard title="التنبيهات" icon="🔔" actions={
        <SearchInput value={search} onChange={setSearch}/>
      }>
        <EmptyState icon="🔔" title="هذه الوحدة ستكتمل قريباً" subtitle="تواصل مع المطور لإكمال هذه الوحدة"/>
      </DataCard>
    </div>
  );
}
