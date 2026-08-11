const fs=require('fs');
const p='C:/Users/Arnab/Desktop/FocusGuardAI/FocusGuard-Frontend/src/organization-admin/pages';
fs.readdirSync(p).filter(f=>f.endsWith('.jsx')).forEach(f=>{
  let c=fs.readFileSync(p+'/'+f,'utf8');
  c=c.replace(/import\s+DashboardLayout\s+from\s+['"].*?DashboardLayout['"];?\r?\n?/g,'');
  c=c.replace(/<DashboardLayout>/g,'<>');
  c=c.replace(/<\/DashboardLayout>/g,'</>');
  fs.writeFileSync(p+'/'+f,c);
  console.log('Fixed '+f);
});
