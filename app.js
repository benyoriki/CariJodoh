const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
/* ===== Lapisan data: ganti LocalStorageAdapter dengan FirebaseAdapter saat migrasi ===== */
const LocalStorageAdapter={get(k){try{return JSON.parse(localStorage.getItem('bji_'+k))}catch{return null}},set(k,v){localStorage.setItem('bji_'+k,JSON.stringify(v))}};
const DB={adapter:LocalStorageAdapter,mode:'Demo Lokal',
 list(k){return this.adapter.get(k)||[]},
 createRegistration(d){const r=this.list('registrations');const id='BJI-'+new Date().toISOString().slice(0,10).replace(/-/g,'')+'-'+Math.random().toString(36).slice(2,6).toUpperCase();
  const o={...d,id,status:'Menunggu pemeriksaan',createdAt:Date.now(),updatedAt:Date.now(),history:[]};r.push(o);this.adapter.set('registrations',r);
  this.createNotification({regId:id,text:`Pendaftaran baru: ${d.nick||d.name} (${(d.programs||[]).join(', ')||'-'})`});this.log('Pendaftaran '+id);return o},
 getRegistrations(){return this.list('registrations')},
 updateRegistration(id,p){const r=this.list('registrations'),i=r.findIndex(x=>x.id===id);if(i<0)return;r[i].history.push({at:Date.now(),from:r[i].status,to:p.status});Object.assign(r[i],p,{updatedAt:Date.now()});this.adapter.set('registrations',r);this.log(`Status ${id} → ${p.status}`)},
 createNotification(n){const l=this.list('notifications');l.unshift({...n,nid:Date.now(),read:false,at:Date.now(),wa:'Siap dikirim'});this.adapter.set('notifications',l)},
 markNotificationAsRead(nid){const l=this.list('notifications');l.forEach(n=>{if(n.nid===nid)n.read=true});this.adapter.set('notifications',l)},
 log(t){const l=this.list('activityLogs');l.unshift({t,at:Date.now()});this.adapter.set('activityLogs',l.slice(0,100))},
 settings(){return{wa:'6281200000000',...(this.adapter.get('settings')||{})}}};
const PROGRAMS=[['Platinum','Program Dipertemukan','Seleksi kriteria, pendampingan tim, rekomendasi prioritas.'],['Bronze','Program Dikenalkan','Rekomendasi pasangan dan pendampingan dasar.'],['Silver','Program Berkenalan','Profil dipublikasikan atas persetujuan, peluang rekomendasi.'],['Exclusive','Dinner Berdua 1 on 1','Jadwal & lokasi diatur, konfirmasi kedua pihak.']];
const waLink=(num,msg)=>`https://wa.me/${String(num).replace(/\D/g,'')}?text=${encodeURIComponent(msg)}`;
const toast=m=>{const t=$('#toast');t.textContent=m;t.classList.add('on');setTimeout(()=>t.classList.remove('on'),2600)};
/* Tema & loading */
const th=localStorage.getItem('bji_theme')||(matchMedia('(prefers-color-scheme:dark)').matches?'dark':'light');document.documentElement.dataset.theme=th;
addEventListener('DOMContentLoaded',()=>{
 setTimeout(()=>{$('#loader').classList.add('off')},3000);
 $('#tt').onclick=()=>{const d=document.documentElement,n=d.dataset.theme==='dark'?'light':'dark';d.dataset.theme=n;localStorage.setItem('bji_theme',n)};
 $('#bg').onclick=()=>$('.m').classList.toggle('on');
 $$('#mode').forEach(e=>e.textContent='Mode: '+DB.mode);
 const p=document.body.dataset.page;({home,daftar,admin}[p]||(()=>{}))()});
/* Beranda: katalog demo */
const DEMO=[['Anisa',28,'Wanita','Jakarta','Islam','Karyawan','Single','Membaca, kuliner'],['Rizky',32,'Pria','Bandung','Islam','Wiraswasta','Single','Hiking, kopi'],['Maya',26,'Wanita','Bogor','Islam','Guru','Single','Memasak, traveling'],['Budi',34,'Pria','Tangerang','Islam','Karyawan','Duda','Futsal, musik'],['Sinta',29,'Wanita','Depok','Kristen','Perawat','Single','Yoga, film'],['Andi',30,'Pria','Bekasi','Kristen','Wiraswasta','Single','Gowes, fotografi'],['Dewi',27,'Wanita','Bogor','Islam','Karyawan','Janda','Berkebun, baking'],['Fahmi',33,'Pria','Jakarta','Islam','PNS','Single','Buku, badminton']];
function home(){const fav=new Set(DB.adapter.get('fav')||[]);
 const draw=()=>{const q=$('#q').value.toLowerCase(),g=$('#fg').value,c=$('#fc').value;
  const r=DEMO.filter(d=>(!g||d[2]===g)&&(!c||d[3]===c)&&(d[0]+d[7]+d[5]).toLowerCase().includes(q));
  $('#cat').innerHTML=r.length?r.map(d=>`<div class="card"><div class="av" style="background:hsl(${d[0].length*47},45%,48%)">${esc(d[0][0])}</div><b>${esc(d[0])}, ${d[1]}</b> <span class="badge">Contoh</span><br><small>${esc(d[3])} · ${esc(d[4])} · ${esc(d[5])}</small><p><small>${esc(d[7])}</small></p><button class="btn o fv" data-n="${d[0]}">${fav.has(d[0])?'♥ Favorit':'♡ Favorit'}</button></div>`).join(''):'<p>Tidak ada profil yang cocok. Coba ubah filter.</p>';
  $$('.fv').forEach(b=>b.onclick=()=>{fav.has(b.dataset.n)?fav.delete(b.dataset.n):fav.add(b.dataset.n);DB.adapter.set('fav',[...fav]);draw()})};
 ['q','fg','fc'].forEach(i=>$('#'+i).oninput=draw);draw();
 $('#pg').innerHTML=PROGRAMS.map(p=>`<div class="card"><h3>${p[0]}</h3><b>${p[1]}</b><p>${p[2]}</p></div>`).join('')}
/* Pendaftaran bertahap */
function daftar(){let s=0,sent=false;const f=$('#f'),S=$$('.step');
 $('#pp').innerHTML=PROGRAMS.map(p=>`<label class="chk"><input type="checkbox" name="programs" value="${p[0]}"> <span><b>${p[0]}</b> — ${p[1]}</span></label>`).join('');
 const draft=DB.adapter.get('draft');if(draft)Object.entries(draft).forEach(([k,v])=>{const e=f.elements[k];if(e&&e.type!=='checkbox'&&e.type!=='file'&&!(e instanceof RadioNodeList))e.value=v});
 const data=()=>{const d=Object.fromEntries(new FormData(f));d.programs=new FormData(f).getAll('programs');return d};
 const age=v=>v?Math.floor((Date.now()-new Date(v))/31557600000):0;
 const show=()=>{S.forEach((e,i)=>e.classList.toggle('on',i===s));$$('.steps i').forEach((e,i)=>e.classList.toggle('on',i<=s));$('#bk').style.visibility=s?'visible':'hidden';$('#nx').hidden=s===S.length-1;$('#sb').hidden=s!==S.length-1;
  if(s===S.length-1){const d=data();$('#sum').innerHTML=`<table>${[['Nama',d.name],['Panggilan',d.nick],['Usia',age(d.dob)],['Domisili',d.city],['Agama',d.religion],['Status',d.marital],['Cari usia',d.amin+'–'+d.amax],['Program',d.programs.join(', ')||'-']].map(r=>`<tr><th>${r[0]}</th><td>${esc(r[1])}</td></tr>`).join('')}</table>`}};
 f.oninput=()=>{DB.adapter.set('draft',data());$('#ag').textContent=age(f.dob.value)?age(f.dob.value)+' tahun':'';$('#cc').textContent=f.about.value.length+'/300'};
 $('#nx').onclick=()=>{const bad=[...S[s].querySelectorAll('[required]')].find(e=>!e.checkValidity());if(bad){bad.reportValidity();return}
  if(s===0&&age(f.dob.value)<18){toast('Usia minimal pendaftar 18 tahun.');return}s++;show()};
 $('#bk').onclick=()=>{s--;show()};$('#ds').onclick=()=>{DB.adapter.set('draft',data());toast('Draf disimpan di browser ini.')};
 f.onsubmit=e=>{e.preventDefault();if(sent)return;if(!f.c1.checked||!f.c2.checked||!f.c3.checked){toast('Setujui ketentuan, privasi, dan pemrosesan data.');return}
  sent=true;$('#sb').disabled=true;const d=data();d.publish=f.c4.checked;const r=DB.createRegistration(d);DB.adapter.set('draft',null);
  const msg=`Halo Admin BIRO JODOH INDONESIA, saya ingin mendaftar layanan perkenalan pasangan. Nomor registrasi saya: ${r.id}. Mohon informasi mengenai langkah selanjutnya.`;
  $('#wiz').innerHTML=`<h2>Pendaftaran Tersimpan ✓</h2><p style="text-align:center">Nomor registrasi: <b>${esc(r.id)}</b><br>Status: ${esc(r.status)}<br><small>Data tersimpan di browser ini (simulasi). Pesan WhatsApp baru terkirim setelah Anda menekan Kirim di aplikasi WhatsApp.</small></p><p style="text-align:center"><a class="btn" target="_blank" rel="noopener" href="${waLink(DB.settings().wa,msg)}">Hubungi Admin via WhatsApp</a></p>`};
 show()}
/* Admin demo */
async function sha(t){return[...new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(t)))].map(b=>b.toString(16).padStart(2,'0')).join('')}
function admin(){const gate=$('#gate'),app=$('#app');
 const h=DB.adapter.get('adminhash');$('#gt').textContent=h?'Masukkan PIN admin demo':'Buat PIN admin demo (simulasi lokal)';
 $('#gf').onsubmit=async e=>{e.preventDefault();const x=await sha($('#pin').value);if(!h){if($('#pin').value.length<6)return toast('PIN minimal 6 karakter');DB.adapter.set('adminhash',x)}else if(x!==h)return toast('PIN salah');gate.hidden=true;app.hidden=false;render()};
 const render=()=>{const R=DB.getRegistrations(),N=DB.list('notifications');
  $('#st').innerHTML=[['Total Peserta',R.length],['Menunggu',R.filter(r=>r.status==='Menunggu pemeriksaan').length],['Aktif',R.filter(r=>r.status==='Aktif').length],['Notifikasi baru',N.filter(n=>!n.read).length]].map(a=>`<div class="card"><div class="stat">${a[1]}</div>${a[0]}</div>`).join('');
  const st=$('#fs').value,q=$('#sq').value.toLowerCase();
  const rows=R.filter(r=>(!st||r.status===st)&&(r.name+r.id).toLowerCase().includes(q));
  $('#tb').innerHTML=rows.length?rows.map(r=>`<tr><td>${esc(r.id)}</td><td>${esc(r.name)}</td><td>${esc(r.programs.join(', '))}</td><td><select data-id="${r.id}">${['Menunggu pemeriksaan','Perlu perbaikan','Disetujui','Aktif','Ditolak','Ditangguhkan'].map(o=>`<option ${o===r.status?'selected':''}>${o}</option>`).join('')}</select></td><td><a class="btn o" target="_blank" rel="noopener" href="${waLink('62'+String(r.wa||'').replace(/^0/,''),`Halo ${r.nick||r.name}, pendaftaran Anda (${r.id}) berstatus: ${r.status}.`)}">WA</a></td></tr>`).join(''):'<tr><td colspan=5>Belum ada data pendaftaran. Isi formulir di halaman Daftar.</td></tr>';
  $$('#tb select').forEach(s=>s.onchange=()=>{if(['Ditolak','Ditangguhkan'].includes(s.value)&&!confirm('Yakin mengubah status menjadi '+s.value+'?'))return render();DB.updateRegistration(s.dataset.id,{status:s.value});render()});
  $('#nl').innerHTML=N.slice(0,8).map(n=>`<div class="card" style="margin:6px 0;${n.read?'opacity:.6':''}">${esc(n.text)}<br><small>${new Date(n.at).toLocaleString('id-ID')} · WA: ${esc(n.wa)}</small> ${n.read?'':`<button class="btn o rd" data-n="${n.nid}">Tandai dibaca</button>`}</div>`).join('')||'<p>Belum ada notifikasi.</p>';
  $$('.rd').forEach(b=>b.onclick=()=>{DB.markNotificationAsRead(+b.dataset.n);render()});$('#wn').value=DB.settings().wa};
 $('#fs').onchange=$('#sq').oninput=()=>render();
 $('#sw').onclick=()=>{DB.adapter.set('settings',{wa:$('#wn').value.replace(/\D/g,'')});toast('Nomor WhatsApp disimpan')};
 $('#ex').onclick=()=>{const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([JSON.stringify({registrations:DB.getRegistrations(),notifications:DB.list('notifications')},null,2)],{type:'application/json'}));a.download='bji-backup.json';a.click()}}
