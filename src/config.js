// ══════════════════════════════════════════
// COREVEX ERP — Master Configuration
// ══════════════════════════════════════════

export const USERS = [
  { id:'admin',       username:'admin',       password:'Corevex@2025',  nameAr:'المدير العام',         role:'admin',       avatar:'👑', color:'#F5C842', permissions:['all'] },
  { id:'accountant',  username:'accountant',  password:'Finance@2025',  nameAr:'المحاسب',              role:'accountant',  avatar:'💰', color:'#4ADE80', permissions:['dashboard','accounting','expenses','treasury','vat','zakat','salaries','reports'] },
  { id:'engineer',    username:'engineer',    password:'Project@2025',  nameAr:'مدير المشاريع',        role:'engineer',    avatar:'🏗️', color:'#60A5FA', permissions:['dashboard','projects','tenders','contracts','variations','extracts','subcontractors','rfi','correspondence','meetings','handover','warranty','quality','safety','reports'] },
  { id:'supervisor',  username:'supervisor',  password:'Site@2025',     nameAr:'مشرف الموقع',          role:'supervisor',  avatar:'🦺', color:'#FB923C', permissions:['dashboard','daily_report','workers','attendance','safety','concrete','inspection','ncr','material_approval','purchase_request'] },
  { id:'procurement', username:'procurement', password:'Purchase@2025', nameAr:'مدير المشتريات',       role:'procurement',  avatar:'🛒', color:'#D8B4FE', permissions:['dashboard','purchases','suppliers','inventory','equipment','material_approval','purchase_request','rfq'] },
  { id:'hr',          username:'hr',          password:'Human@2025',    nameAr:'مدير الموارد البشرية', role:'hr',          avatar:'👥', color:'#2DD4BF', permissions:['dashboard','workers','salaries','attendance','leaves','documents'] },
];

export const ROLES = {
  admin:       { label:'مدير عام',          color:'#F5C842', bg:'rgba(245,200,66,0.1)'  },
  accountant:  { label:'محاسب',             color:'#4ADE80', bg:'rgba(74,222,128,0.1)'  },
  engineer:    { label:'مدير مشاريع',       color:'#60A5FA', bg:'rgba(96,165,250,0.1)'  },
  supervisor:  { label:'مشرف موقع',         color:'#FB923C', bg:'rgba(251,146,60,0.1)'  },
  procurement: { label:'مدير مشتريات',      color:'#D8B4FE', bg:'rgba(216,180,254,0.1)' },
  hr:          { label:'موارد بشرية',       color:'#2DD4BF', bg:'rgba(45,212,191,0.1)'  },
};

export const MODULES = [
  // Dashboard
  { id:'dashboard',         icon:'🏠', label:'لوحة التحكم',            group:null },
  // Projects
  { id:'projects',          icon:'🏗️', label:'المشاريع',               group:'المشاريع' },
  { id:'tenders',           icon:'📋', label:'المناقصات',              group:'المشاريع' },
  { id:'contracts',         icon:'📄', label:'العقود',                 group:'المشاريع' },
  { id:'variations',        icon:'🔄', label:'أوامر التغيير',          group:'المشاريع' },
  { id:'extracts',          icon:'🧾', label:'المستخلصات',             group:'المشاريع' },
  { id:'retention',         icon:'🔒', label:'الدفعة المقدمة والضمان', group:'المشاريع' },
  { id:'claims',            icon:'⚖️', label:'المطالبات',              group:'المشاريع' },
  { id:'rfi',               icon:'❓', label:'طلبات المعلومات RFI',    group:'المشاريع' },
  { id:'correspondence',    icon:'📧', label:'المراسلات',              group:'المشاريع' },
  { id:'meetings',          icon:'🤝', label:'محاضر الاجتماعات',       group:'المشاريع' },
  { id:'handover',          icon:'🏁', label:'محاضر التسليم',          group:'المشاريع' },
  { id:'warranty',          icon:'🛡️', label:'الضمان وعيوب التسليم',   group:'المشاريع' },
  // Subcontractors
  { id:'subcontractors',    icon:'🤝', label:'المقاولون بالباطن',      group:'المقاولون بالباطن' },
  { id:'work_orders',       icon:'📝', label:'تفويض العمل',            group:'المقاولون بالباطن' },
  { id:'snag_list',         icon:'🔍', label:'قائمة العيوب',           group:'المقاولون بالباطن' },
  // Finance
  { id:'accounting',        icon:'💰', label:'المحاسبة',               group:'المالية' },
  { id:'expenses',          icon:'💸', label:'المصروفات',              group:'المالية' },
  { id:'treasury',          icon:'🏦', label:'الخزينة والبنك',         group:'المالية' },
  { id:'vat',               icon:'🧾', label:'ضريبة VAT',              group:'المالية' },
  { id:'zakat',             icon:'☪️', label:'الزكاة',                 group:'المالية' },
  // Procurement
  { id:'purchases',         icon:'🛒', label:'المشتريات',              group:'المشتريات' },
  { id:'material_approval', icon:'✅', label:'الموافقة على المواد',     group:'المشتريات' },
  { id:'purchase_request',  icon:'📤', label:'طلب شراء من الموقع',     group:'المشتريات' },
  { id:'suppliers',         icon:'🏭', label:'الموردون',               group:'المشتريات' },
  { id:'inventory',         icon:'📦', label:'المخزون',                group:'المشتريات' },
  { id:'equipment',         icon:'⚙️', label:'المعدات والأصول',        group:'المشتريات' },
  // HR
  { id:'workers',           icon:'👷', label:'العمال',                 group:'الموارد البشرية' },
  { id:'salaries',          icon:'💵', label:'الرواتب',                group:'الموارد البشرية' },
  { id:'attendance',        icon:'✅', label:'الحضور والغياب',         group:'الموارد البشرية' },
  { id:'leaves',            icon:'🌴', label:'الإجازات',               group:'الموارد البشرية' },
  // Site
  { id:'daily_report',      icon:'📊', label:'يومية الموقع',           group:'الموقع والجودة' },
  { id:'concrete',          icon:'🏗️', label:'تقرير الخرسانة',         group:'الموقع والجودة' },
  { id:'inspection',        icon:'🔎', label:'طلب التفتيش',            group:'الموقع والجودة' },
  { id:'ncr',               icon:'⛔', label:'عدم المطابقة NCR',       group:'الموقع والجودة' },
  { id:'itp',               icon:'📋', label:'خطة الجودة ITP',         group:'الموقع والجودة' },
  { id:'safety',            icon:'⛑️', label:'السلامة',                group:'الموقع والجودة' },
  // Docs
  { id:'documents',         icon:'📁', label:'الوثائق والرخص',         group:'الوثائق' },
  // Reports
  { id:'reports',           icon:'📈', label:'التقارير',               group:'التقارير' },
  { id:'approvals',         icon:'✔️', label:'الموافقات',              group:'التقارير' },
  { id:'alerts',            icon:'🔔', label:'التنبيهات',              group:'التقارير' },
  // Settings
  { id:'settings',          icon:'⚙️', label:'الإعدادات',              group:'الإعدادات' },
];

export const EXPENSE_CATEGORIES = [
  { id:'vehicles',    icon:'🚗', label:'المركبات',          sub:['بترول','صيانة','تأمين','مخالفات','استئجار'] },
  { id:'admin',       icon:'👥', label:'الرواتب الإدارية',  sub:['راتب مدير','راتب محاسب','راتب سكرتير','مكافآت'] },
  { id:'office',      icon:'🏢', label:'المكتب',            sub:['إيجار','كهرباء','ماء','إنترنت','قرطاسية','أثاث'] },
  { id:'marketing',   icon:'📣', label:'التسويق',           sub:['إعلانات','هدايا عملاء','عروض تقديمية','موقع إلكتروني'] },
  { id:'maintenance', icon:'🔧', label:'الصيانة العامة',    sub:['صيانة معدات','صيانة أجهزة','قطع غيار'] },
  { id:'banking',     icon:'🏦', label:'البنك والمصاريف',   sub:['عمولات بنكية','رسوم حسابات','ضمانات بنكية'] },
  { id:'other',       icon:'🌐', label:'أخرى',              sub:['مصاريف متنوعة'] },
];

export const CURRENCIES = {
  SAR: { code:'SAR', symbol:'ر.س', nameAr:'ريال سعودى',   flag:'🇸🇦' },
  AED: { code:'AED', symbol:'د.إ', nameAr:'درهم إماراتى', flag:'🇦🇪' },
  USD: { code:'USD', symbol:'$',   nameAr:'دولار أمريكى', flag:'🇺🇸' },
  SDG: { code:'SDG', symbol:'ج.س', nameAr:'جنيه سودانى',  flag:'🇸🇩' },
};

export const STATUS_COLORS = {
  'قيد التنفيذ': { bg:'linear-gradient(135deg,#1565C0,#1976D2)', dot:'#90CAF9' },
  'مكتمل':       { bg:'linear-gradient(135deg,#1B5E20,#2E7D32)', dot:'#A5D6A7' },
  'متأخر':       { bg:'linear-gradient(135deg,#7F0000,#C62828)', dot:'#EF9A9A' },
  'مؤجل':        { bg:'linear-gradient(135deg,#7C3000,#E65100)', dot:'#FFCC80' },
  'متوقف':       { bg:'linear-gradient(135deg,#212121,#616161)', dot:'#BDBDBD' },
  'مفتوح':       { bg:'linear-gradient(135deg,#1565C0,#1976D2)', dot:'#90CAF9' },
  'مغلق':        { bg:'linear-gradient(135deg,#1B5E20,#2E7D32)', dot:'#A5D6A7' },
  'ملغى':        { bg:'linear-gradient(135deg,#7F0000,#C62828)', dot:'#EF9A9A' },
  'مدفوع':       { bg:'linear-gradient(135deg,#1B5E20,#2E7D32)', dot:'#A5D6A7' },
  'معلق':        { bg:'linear-gradient(135deg,#7C3000,#E65100)', dot:'#FFCC80' },
  'مرفوض':       { bg:'linear-gradient(135deg,#7F0000,#C62828)', dot:'#EF9A9A' },
  'نشط':         { bg:'linear-gradient(135deg,#1B5E20,#2E7D32)', dot:'#A5D6A7' },
  'منتهى':       { bg:'linear-gradient(135deg,#7F0000,#C62828)', dot:'#EF9A9A' },
  'حاضر':        { bg:'linear-gradient(135deg,#1B5E20,#2E7D32)', dot:'#A5D6A7' },
  'غائب':        { bg:'linear-gradient(135deg,#7F0000,#C62828)', dot:'#EF9A9A' },
  'إجازة':       { bg:'linear-gradient(135deg,#7C3000,#E65100)', dot:'#FFCC80' },
  'معتمد':       { bg:'linear-gradient(135deg,#1B5E20,#2E7D32)', dot:'#A5D6A7' },
  'بانتظار الموافقة': { bg:'linear-gradient(135deg,#7C3000,#E65100)', dot:'#FFCC80' },
  'مرفوع':       { bg:'linear-gradient(135deg,#1565C0,#1976D2)', dot:'#90CAF9' },
};

export const EMPTY_DB = {
  projects:[], tenders:[], contracts:[], variations:[], extracts:[],
  retentions:[], claims:[], rfis:[], correspondence:[], meetings:[],
  handovers:[], warranties:[], subcontractors:[], work_orders:[],
  snag_lists:[], transactions:[], expenses:[], treasury:[],
  bank_accounts:[], vat_records:[], zakat_records:[],
  purchases:[], material_approvals:[], purchase_requests:[],
  suppliers:[], inventory:[], equipment:[], workers:[],
  salaries:[], attendance:[], leaves:[], daily_reports:[],
  concrete_reports:[], inspections:[], ncrs:[], itps:[],
  safety_records:[], documents:[], reports:[], approvals:[], alerts:[],
  settings:{
    companyName:'Corevex Contracting LLC',
    companyNameAr:'شركة كوريفيكس للمقاولات',
    cr:'', vat:'', phone:'', email:'', address:'',
    currency:'SAR', healthScore:0,
    approvalLimit: 5000,
  }
};
