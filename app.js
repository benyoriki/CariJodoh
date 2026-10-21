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
 $('#bg').onclick=()=>$('.m').classList.toggle('on');$$('.m a').forEach(x=>x.addEventListener('click',()=>$('.m').classList.remove('on')));
 $$('#mode').forEach(e=>e.textContent='Mode: '+DB.mode);
 const p=document.body.dataset.page;({home,daftar,admin}[p]||(()=>{}))()});
/* Beranda: katalog demo */
const DEMO=[['Anisa',28,'Wanita','Jakarta','Islam','Karyawan','Single','Membaca, kuliner'],['Rizky',32,'Pria','Bandung','Islam','Wiraswasta','Single','Hiking, kopi'],['Maya',26,'Wanita','Bogor','Islam','Guru','Single','Memasak, traveling'],['Budi',34,'Pria','Tangerang','Islam','Karyawan','Duda','Futsal, musik'],['Sinta',29,'Wanita','Depok','Kristen','Perawat','Single','Yoga, film'],['Andi',30,'Pria','Bekasi','Kristen','Wiraswasta','Single','Gowes, fotografi'],['Dewi',27,'Wanita','Bogor','Islam','Karyawan','Janda','Berkebun, baking'],['Fahmi',33,'Pria','Jakarta','Islam','PNS','Single','Buku, badminton']];
function home(){const fav=new Set(DB.adapter.get('fav')||[]);
 const av=(g,i)=>{const h=[340,20,200,350][i%4],w=g==='Wanita',k=['#e8b79b','#d9a47f','#f1c4a6'][i%3];return `<svg viewBox="0 0 80 100" preserveAspectRatio="xMidYMid slice" role="img" aria-label="Foto contoh"><rect width="80" height="100" fill="hsl(${h},55%,88%)"/><circle cx="62" cy="22" r="26" fill="hsl(${h},55%,94%)"/><path d="M8 100c0-22 12-32 32-32s32 10 32 32z" fill="hsl(${h},38%,34%)"/><rect x="35" y="56" width="10" height="16" rx="5" fill="${k}"/>${w?'<path d="M23 46c0-17 7-27 17-27s17 10 17 27c0 12-4 21-6 26H29c-2-5-6-14-6-26z" fill="#8D2944"/><ellipse cx="40" cy="46" rx="9" ry="11" fill="'+k+'"/>':'<ellipse cx="40" cy="42" rx="11" ry="13" fill="'+k+'"/><path d="M28 40c0-12 6-18 12-18s12 6 12 18c-3-6-8-8-12-8s-9 2-12 8z" fill="#2a1a1a"/>'}</svg>`};
 const draw=()=>{const q=$('#q').value.toLowerCase(),g=$('#fg').value,c=$('#fc').value,a=$('#fa').value;
  const r=DEMO.filter(d=>(!g||d[2]===g)&&(!c||d[3]===c)&&(!a||(a==='1'?d[1]<28:a==='2'?d[1]<=35:d[1]>35))&&(d[0]+d[7]+d[5]).toLowerCase().includes(q));
  $('#cat').innerHTML=r.length?r.map((d,i)=>`<article class="pc"><div class="ph">${av(d[2],i)}<span class="badge sim">Contoh simulasi</span></div><div class="pb"><b>${esc(d[0])}, ${d[1]}</b><small>${esc(d[3])} · ${esc(d[5])}</small><small>${esc(d[7])}</small><div class="ra"><button class="btn o vp">Profil</button><button class="fv" data-n="${esc(d[0])}" aria-label="Favorit">${fav.has(d[0])?'♥':'♡'}</button></div></div></article>`).join(''):'<p class="empty" style="grid-column:1/-1">Tidak ada profil yang cocok. Coba ubah filter.</p>';
  $$('.vp').forEach(b=>b.onclick=()=>toast('Ini profil contoh simulasi. Profil asli tampil setelah disetujui peserta.'));
  $$('.fv').forEach(b=>b.onclick=()=>{fav.has(b.dataset.n)?fav.delete(b.dataset.n):fav.add(b.dataset.n);DB.adapter.set('fav',[...fav]);draw()})};
 ['q','fg','fc','fa'].forEach(i=>$('#'+i).oninput=draw);draw();
 const BEN=[['Seleksi berdasarkan kriteria','Pendampingan tim','Rekomendasi prioritas'],['Rekomendasi pasangan','Pendampingan dasar','Konsultasi awal'],['Profil dipublikasikan atas izin','Peluang rekomendasi','Privasi terkontrol'],['Jadwal &amp; lokasi diatur','Konfirmasi kedua pihak','Prosedur keamanan']];
 const ck='<svg class="i"><use href="#i-check"/></svg>';
 $('#pg').innerHTML=PROGRAMS.map((p,i)=>`<div class="card pr${i?'':' feat'}">${i?'':'<span class="rb">Unggulan</span>'}<h3>${p[0]}</h3><b>${p[1]}</b><p class="pc2">${p[2]}</p><ul>${BEN[i].map(b=>`<li>${ck}${b}</li>`).join('')}</ul><span class="pc2">Harga ditentukan admin</span><a class="btn${i?' o':''}" href="daftar.html?p=${p[0]}">Pilih Program</a></div>`).join('')}
/* Pendaftaran bertahap */
function daftar(){let s=0,sent=false;const f=$('#f'),S=$$('.step');
 $('#pp').innerHTML=PROGRAMS.map(p=>`<label class="chk"><input type="checkbox" name="programs" value="${p[0]}"> <span><b>${p[0]}</b> — ${p[1]}</span></label>`).join('');
 const draft=DB.adapter.get('draft');if(draft)Object.entries(draft).forEach(([k,v])=>{const e=f.elements[k];if(e&&e.type!=='checkbox'&&e.type!=='file'&&!(e instanceof RadioNodeList))e.value=v});
 const pq=new URLSearchParams(location.search).get('p');if(PROGRAMS.some(p=>p[0]===pq)){const c=[...f.querySelectorAll('input[name=programs]')].find(x=>x.value===pq);if(c)c.checked=true}
 const data=()=>{const d=Object.fromEntries(new FormData(f));d.programs=new FormData(f).getAll('programs');return d};
 const age=v=>v?Math.floor((Date.now()-new Date(v))/31557600000):0;
 const show=()=>{S.forEach((e,i)=>e.classList.toggle('on',i===s));$$('.steps i').forEach((e,i)=>e.classList.toggle('on',i<=s));$('#bk').style.visibility=s?'visible':'hidden';$('#nx').hidden=s===S.length-1;$('#sb').hidden=s!==S.length-1;
  if(s===S.length-1){const d=data();$('#sum').innerHTML=`<table>${[['Nama',d.name],['Panggilan',d.nick],['Usia',age(d.dob)],['Domisili',d.city],['Agama',d.religion],['Status',d.marital],['Cari usia',d.amin+'–'+d.amax],['Program',d.programs.join(', ')||'-']].map(r=>`<tr><th>${r[0]}</th><td>${esc(r[1])}</td></tr>`).join('')}</table>`}};
 f.oninput=()=>{DB.adapter.set('draft',data());$('#ag').textContent=age(f.dob.value)?age(f.dob.value)+' tahun':'';$('#cc').textContent=f.about.value.length+'/300'};
 $('#nx').onclick=()=>{$$('.err',S[s]).forEach(e=>e.remove());let bad=null;
  [...S[s].querySelectorAll('[required]')].forEach(e=>{if(!e.checkValidity()){bad=bad||e;e.insertAdjacentHTML('afterend','<div class="err">'+(e.name==='wa'?'Nomor WhatsApp tidak valid (contoh 08123456789).':'Kolom ini wajib diisi.')+'</div>')}});
  if(s===0&&!bad&&age(f.dob.value)<18){bad=f.dob;f.dob.insertAdjacentHTML('afterend','<div class="err">Usia minimal pendaftar 18 tahun.</div>')}
  if(s===1&&+f.amin.value>+f.amax.value){bad=f.amin;f.amax.insertAdjacentHTML('afterend','<div class="err">Usia minimum tidak boleh melebihi maksimum.</div>')}
  if(bad){bad.focus();return}s++;show()};
 $('#bk').onclick=()=>{s--;show()};$('#ds').onclick=()=>{DB.adapter.set('draft',data());toast('Draf disimpan di browser ini.')};
 f.onsubmit=e=>{e.preventDefault();if(sent)return;if(!f.c1.checked||!f.c2.checked||!f.c3.checked){toast('Setujui ketentuan, privasi, dan pemrosesan data.');return}
  sent=true;$('#sb').disabled=true;const d=data();d.publish=f.c4.checked;const r=DB.createRegistration(d);DB.adapter.set('draft',null);
  const msg=`Halo Admin BIRO JODOH INDONESIA, saya ingin mendaftar layanan perkenalan pasangan. Nomor registrasi saya: ${r.id}. Mohon informasi mengenai langkah selanjutnya.`;
  $('#wiz').innerHTML=`<h2>Pendaftaran Tersimpan ✓</h2><p style="text-align:center">Nomor registrasi: <b>${esc(r.id)}</b><br>Status: ${esc(r.status)}<br><small>Data tersimpan di browser ini (simulasi). Pesan WhatsApp baru terkirim setelah Anda menekan Kirim di aplikasi WhatsApp.</small></p><p style="text-align:center"><a class="btn" target="_blank" rel="noopener" href="${waLink(DB.settings().wa,msg)}">Hubungi Admin via WhatsApp</a></p>`};
 show()}
/* Admin demo */
async function sha(t){return[...new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(t)))].map(b=>b.toString(16).padStart(2,'0')).join('')}
function admin(){const gate=$('#gate'),app=$('#app');const AC=DB.adapter.get('adminacct');$('#gt').textContent=AC?'Masuk ke Dasbor Admin':'Buat Akun Admin Lokal';$('#gb').textContent=AC?'Masuk':'Buat Akun & Masuk';$('#gs').textContent=AC?'Gunakan email dan kata sandi akun lokal Anda.':'Belum ada akun di browser ini. Buat akun admin lokal (simulasi).';
 const ST=['Menunggu pemeriksaan','Perlu perbaikan','Disetujui','Aktif','Ditolak','Ditangguhkan'],T=['dashboard','peserta','notif','set','soon'];
const enter=()=>{sessionStorage.setItem('bji_sess','1');gate.hidden=true;app.hidden=false;render()};
 const hs=(p,s)=>sha(s+p);
 $('#gf').onsubmit=async e=>{e.preventDefault();const em=$('#em').value.trim().toLowerCase(),pw=$('#pw').value;
  if(!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(em))return toast('Format email tidak valid');
  if(!AC){if(pw.length<8)return toast('Kata sandi minimal 8 karakter');const salt=Math.random().toString(36).slice(2);DB.adapter.set('adminacct',{em:em,salt:salt,h:await hs(pw,salt)});return enter()}
  if(em!==AC.em||await hs(pw,AC.salt)!==AC.h)return toast('Email atau kata sandi salah');enter()};
 $('#demo').onclick=()=>{DB.log('Masuk demo admin');enter()};
 $('#rs').onclick=()=>{if(confirm('Hapus akun admin lokal di browser ini?')){DB.adapter.set('adminacct',null);location.reload()}};
 $('#sp').onclick=()=>{const p=$('#pw');p.type=p.type==='password'?'text':'password'};
 $$('.side a[href="admin.html"]').forEach(x=>x.onclick=()=>sessionStorage.removeItem('bji_sess'));
 const show=(v,f)=>{$$('.vw').forEach(e=>e.hidden=e.id!=='v-'+v);if(f!==undefined)$('#fs').value=f;$('.m').classList.remove('on');render()};
 $$('.side a[data-v]').forEach(a=>a.onclick=e=>{e.preventDefault();$$('.side a').forEach(x=>x.classList.remove('act'));a.classList.add('act');$('#ttl').textContent=a.querySelector('span').textContent;show(a.dataset.v,a.dataset.f||'')});
 const wa=(r)=>waLink('62'+String(r.wa||'').replace(/^0/,''),`Halo ${r.nick||r.name}, pendaftaran Anda (${r.id}) berstatus: ${r.status}.`);
 const detail=id=>{const r=DB.getRegistrations().find(x=>x.id===id);if(!r)return;const t=(a,b)=>`<tr><th>${a}</th><td>${esc(b)}</td></tr>`;
  $('#dt').innerHTML=`<h3>${esc(r.name)}</h3><small>${esc(r.id)}</small><div class="tw"><table>${t('Data diri',[r.gender,r.dob,r.marital,r.religion,r.tribe,r.city,r.job].filter(Boolean).join(' · '))}${t('Preferensi',`${r.pg||'-'}, usia ${r.amin}–${r.amax}, agama ${r.pr||'-'}, tujuan ${r.goal||'-'}`)}${t('Tentang diri',r.about)}${t('Program',(r.programs||[]).join(', ')||'-')}${t('Publikasi profil',r.publish?'Diizinkan':'Tidak diizinkan')}${t('Status',r.status)}</table></div><b>Riwayat</b>${r.history.map(x=>`<div class="sim">${new Date(x.at).toLocaleString('id-ID')}: ${esc(x.from)} → ${esc(x.to)}</div>`).join('')||'<div class="sim">Belum ada perubahan.</div>'}`;$('#dlg').showModal()};
 const render=()=>{const R=DB.getRegistrations(),N=DB.list('notifications');
  $('#st').innerHTML=[['Total Peserta',R.length],['Pendaftaran Baru',R.filter(r=>Date.now()-r.createdAt<864e5).length],['Menunggu Verifikasi',R.filter(r=>r.status===ST[0]).length],['Peserta Aktif',R.filter(r=>r.status==='Aktif').length],['Notifikasi Belum Dibaca',N.filter(n=>!n.read).length],['Rekomendasi Pasangan',DB.list('matchRecommendations').length]].map((a,i)=>`<div class="card sc"><svg class="i"><use href="#i-${['users','heart','shield','check','bell','search'][i]}"/></svg><div><div class="stat">${a[1]}</div>${a[0]}</div></div>`).join('');
  const days=[...Array(7)].map((_,i)=>{const d=new Date(Date.now()-(6-i)*864e5);return[d.toLocaleDateString('id-ID',{weekday:'short'}),R.filter(r=>new Date(r.createdAt).toDateString()===d.toDateString()).length]}),mx=Math.max(1,...days.map(d=>d[1]));
  $('#ch').innerHTML=R.length?days.map(d=>`<div><i style="height:${d[1]/mx*100}px"></i>${d[0]}<br>${d[1]}</div>`).join(''):'<p class="empty">Belum ada data pendaftaran.</p>';
  $('#ac').innerHTML=DB.list('activityLogs').slice(0,6).map(l=>`<div class="sim">${new Date(l.at).toLocaleString('id-ID')} — ${esc(l.t)}</div>`).join('')||'<p class="empty">Belum ada aktivitas.</p>';
  const st=$('#fs').value,q=$('#sq').value.toLowerCase(),rows=R.filter(r=>(!st||r.status===st)&&(r.name+r.id).toLowerCase().includes(q));
  $('#tb').innerHTML=rows.length?rows.map(r=>`<tr><td>${esc(r.id)}</td><td>${esc(r.name)}</td><td>${new Date(r.createdAt).toLocaleDateString('id-ID')}</td><td>${esc((r.programs||[]).join(', '))}</td><td><span class="bd2 s${ST.indexOf(r.status)}">${esc(r.status)}</span><select data-id="${r.id}" style="margin-top:6px" aria-label="Status">${ST.map(o=>`<option ${o===r.status?'selected':''}>${o}</option>`).join('')}</select></td><td><button class="btn o dd" data-d="${r.id}">Detail</button> <a class="btn o" target="_blank" rel="noopener" href="${wa(r)}">WA</a></td></tr>`).join(''):'<tr><td colspan=6 class="empty">Belum ada data. Isi formulir di halaman Daftar.</td></tr>';
  $$('.dd').forEach(b=>b.onclick=()=>detail(b.dataset.d));
  $$('#tb select').forEach(s=>s.onchange=()=>{if(['Ditolak','Ditangguhkan'].includes(s.value)&&!confirm('Yakin mengubah status menjadi '+s.value+'?'))return render();DB.updateRegistration(s.dataset.id,{status:s.value});render()});
  $('#nl').innerHTML=N.map(n=>`<div class="card" style="margin:8px 0;${n.read?'opacity:.6':''}">${esc(n.text)}<br><small class="sim">${esc(n.regId)} · ${new Date(n.at).toLocaleString('id-ID')} · WhatsApp: ${esc(n.wa)}</small><div class="ra" style="max-width:300px"><button class="btn o dd" data-d="${esc(n.regId)}">Lihat Detail</button>${n.read?'':`<button class="btn o rd" data-n="${n.nid}">Tandai Dibaca</button>`}</div></div>`).join('')||'<div class="card empty">Belum ada notifikasi.</div>';
  $$('#nl .dd').forEach(b=>b.onclick=()=>detail(b.dataset.d));$$('.rd').forEach(b=>b.onclick=()=>{DB.markNotificationAsRead(+b.dataset.n);render()});$('#wn').value=DB.settings().wa};
 $('#fs').onchange=$('#sq').oninput=()=>render();
 $('#sw').onclick=()=>{DB.adapter.set('settings',{wa:$('#wn').value.replace(/\D/g,'')});toast('Nomor WhatsApp disimpan')};
 $('#ex').onclick=()=>{const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([JSON.stringify({registrations:DB.getRegistrations(),notifications:DB.list('notifications')},null,2)],{type:'application/json'}));a.download='bji-backup.json';a.click()};
 if(sessionStorage.getItem('bji_sess'))enter()}
