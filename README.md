# Cari Jodoh (prototipe)
Upload semua file ke root repo GitHub → Settings → Pages → Deploy from branch (main, / root).
Tambahkan sendiri: favicon.png dan preview.jpg (1200×630).
## Batasan
- localStorage hanya di browser/origin yang sama; tidak sinkron antarperangkat.
- PIN admin (hash SHA-256) hanya simulasi, BUKAN keamanan produksi.
- Tombol WhatsApp hanya membuka wa.me dengan pesan terisi; pengguna harus menekan Kirim.
## Migrasi Firebase
Ganti `LocalStorageAdapter` di app.js dengan `FirebaseAdapter` (Firestore) → Auth untuk akun/role, Storage untuk foto, Cloud Functions + WhatsApp Cloud API untuk pesan, Security Rules & App Check untuk akses.

## Redesign 2026
Ganti `hero.svg` dengan foto berlisensi (mis. `hero.jpg`, rasio 4:5) dan ubah `src` di index.html. Tambahkan favicon.png dan preview.jpg (1200×630).
Tautan program: `daftar.html?p=Platinum` memilih program otomatis.

## Login admin (demo)
Email + kata sandi membuat akun admin lokal (hash SHA-256 + salt, hanya di browser ini). Tombol "Masuk Demo Admin" membuka dasbor langsung. Ini simulasi, bukan autentikasi produksi.
Kompatibilitas: tanpa color-mix/backdrop-filter agar ringan di Chrome 109 / Firefox ESR pada Windows 7.

## Halaman tambahan
kebijakan-privasi.html, syarat-ketentuan.html (draf templat, wajib ditinjau hukum), 404.html (memakai base URL GitHub Pages; ubah bila memakai custom domain).
Admin > Cari Kecocokan: kandidat dengan alasan kecocokan transparan; rekomendasi tersimpan dengan status Draft → Selesai.

## PWA & logo
manifest.json + sw.js (network-first, cadangan offline). Instal: Chrome/Edge (Windows & Android) lewat tombol "Pasang Aplikasi" atau menu browser; iPhone: Share > Add to Home Screen. Wajib HTTPS (GitHub Pages sudah). Setelah update, naikkan nama cache `V` di sw.js.
Logo: logo.png (transparan) dan ikon icon-*.png dibuat dari gambar ikon Cari Jodoh (bingkai 5%).
## Foto
Foto peserta & hero hasil upload hanya di browser ini (IndexedDB, diperkecil, EXIF terhapus). Untuk hero permanen, ganti hero.svg dengan foto berlisensi.

## Foto
Foto peserta/hero dipotong (crop, gaya foto profil WhatsApp) lalu otomatis dikonversi ke WebP (cadangan JPEG bila browser tidak mendukung).

## Catatan
- Loading screen hanya tampil saat website dibuka pertama kali dalam sesi atau dimuat ulang (reload), bukan saat berpindah halaman.
- Profil peserta tampil di katalog beranda hanya bila status Disetujui/Aktif dan peserta mengizinkan publikasi (browser yang sama).
- Halaman Syarat/Privasi punya tombol Kembali dan Saya Setuju (mengisi centang persetujuan di formulir).

## Hero & preview WhatsApp
Hero: hero-1200.webp (1200×800) dan hero-800.webp (HP). Ganti keduanya untuk foto baru (rasio 3:2).
preview.jpg 1200×630 (<300 KB). Meta OG memakai ?v=2; naikkan angkanya (v=3, dst.) bila preview diganti agar cache WhatsApp ter-refresh. Uji ulang lewat Facebook Sharing Debugger.
