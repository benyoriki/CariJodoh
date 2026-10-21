# BIRO JODOH INDONESIA (prototipe)
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
