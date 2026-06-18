const fs=require('fs');

const fixes=[
  {file:'src/components/landing/Hero.tsx',replaces:[{find:'bg-primary- ring-4',replace:'bg-primary-600 ring-4'}]},
  {file:'src/components/landing/DashboardMockup.tsx',replaces:[{find:'bg-primary- flex items-center',replace:'bg-primary-500 flex items-center'},{find:'bg-primary-/20 text-primary- text-[10px]',replace:'bg-primary-500/20 text-primary-300 text-[10px]'}]},
  {file:'src/components/app/Sidebar.tsx',replaces:[{find:'bg-primary- flex',replace:'bg-primary-500 flex'},{find:'shadow-primary-/20',replace:'shadow-primary-500/20'}]},
  {file:'src/components/app/RemindersTable.tsx',replaces:[{find:'text-primary-',replace:'text-primary-400'}]},
  {file:'src/components/app/ReminderOverlay.tsx',replaces:[{find:'bg-primary- text-white hover:bg-primary- transition-colors',replace:'bg-primary-600 text-white hover:bg-primary-500 transition-colors'},{find:'bg-primary- text-white hover:bg-primary-',replace:'bg-primary-600 text-white hover:bg-primary-500'}]},
  {file:'src/components/app/LiveQueue.tsx',replaces:[{find:'border-l-primary- hover',replace:'border-l-primary-500 hover'},{find:'text-primary- font-medium',replace:'text-primary-400 font-medium'},{find:'bg-primary-/20 text-primary- text-xs',replace:'bg-primary-500/20 text-primary-300 text-xs'}]},
  {file:'src/components/app/InboxView.tsx',replaces:[{find:'focus:ring-primary-/50',replace:'focus:ring-primary-500/50'}]},
  {file:'src/components/app/DashboardView.tsx',replaces:[{find:'bg-primary- flex items-center',replace:'bg-primary-500 flex items-center'},{find:'shadow-primary-/20',replace:'shadow-primary-500/20'}]},
  {file:'src/components/app/ControlPanel.tsx',replaces:[
    {find:'bg-primary-/20 flex items-center',replace:'bg-primary-500/20 flex items-center'},
    {find:'text-primary-" />',replace:'text-primary-400" />'},
    {find:'focus:ring-primary-/50 focus:border-primary-/50',replace:'focus:ring-primary-500/50 focus:border-primary-500/50'},
    {find:"bg-primary- text-white hover:bg-primary-'",replace:"bg-primary-500 text-white hover:bg-primary-600'"},
    {find:'bg-primary- hover:bg-primary- hover:shadow-lg',replace:'bg-primary-600 hover:bg-primary-500 hover:shadow-lg'},
    {find:'shadow-primary-/25',replace:'shadow-primary-500/25'},
    {find:'text-primary-400" />', replace:'text-primary-400" />'}
  ]}
];

fixes.forEach(f=>{
  let c=fs.readFileSync(f.file,'utf8');
  f.replaces.forEach(r=>{
    c=c.split(r.find).join(r.replace);
  });
  fs.writeFileSync(f.file,c);
});
console.log('Fixed!');
