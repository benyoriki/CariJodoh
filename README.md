# BIRO JODOH INDONESIA (prototipe)
Upload semua file ke root repo GitHub → Settings → Pages → Deploy from branch (main, / root).
Tambahkan sendiri: favicon.png dan preview.jpg (1200×630).
## Batasan
- localStorage hanya di browser/origin yang sama; tidak sinkron antarperangkat.
- PIN admin (hash SHA-256) hanya simulasi, BUKAN keamanan produksi.
- Tombol WhatsApp hanya membuka wa.me dengan pesan terisi; pengguna harus menekan Kirim.
## Migrasi Firebase
Ganti `LocalStorageAdapter` di app.js dengan `FirebaseAdapter` (Firestore) → Auth untuk akun/role, Storage untuk foto, Cloud Functions + WhatsApp Cloud API untuk pesan, Security Rules & App Check untuk akses.
