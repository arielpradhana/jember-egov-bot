# 🌹 JemberBot AI: Prototype Portal & Chatbot E-Government Kabupaten Jember

**JemberBot AI** adalah prototype aplikasi portal web pemerintah daerah terintegrasi dengan asisten cerdas berbasis Artificial Intelligence. Proyek ini dirancang khusus untuk memodernisasi layanan publik di Kabupaten Jember dengan semangat jargon **"Semua Karena Cinta"**.

![React](https://img.shields.io/badge/React-Vite-61DAFB?logo=react) ![Tailwind](https://img.shields.io/badge/Tailwind_CSS-v3-06B6D4?logo=tailwindcss) ![Groq](https://img.shields.io/badge/Groq_AI-llama--3.1--8b--instant-F55036?logo=groq) ![Vercel](https://img.shields.io/badge/Deploy-Vercel-black?logo=vercel)

---

## 🌐 Live Demo

Coba langsung aplikasinya tanpa perlu instalasi:

**👉 [pemkabjember.vercel.app](https://pemkabjember.vercel.app)**

> Akses melalui browser di HP maupun desktop — tampilan sudah fully responsive!

---

## ✨ Fitur Utama

- 🤖 **JemberBot AI Integration:** Asisten virtual cerdas menggunakan **Groq AI** (model `llama-3.1-8b-instant`) untuk menjawab pertanyaan warga seputar administrasi publik dengan respons yang cepat dan akurat.
- 📱 **Responsive UI:** Tampilan web modern dan premium yang optimal di perangkat mobile, tablet, maupun desktop.
- 🆔 **E-Government Services Info:** Akses cepat informasi layanan kependudukan (Dukcapil), Izin Usaha (UMKM), dan bantuan sosial.
- 🎨 **Premium Aesthetic:** Desain dengan tema warna Rose/Pink khas Jember dengan efek glassmorphism dan tekstur geometris.

---

## 🚀 Teknologi yang Digunakan

| Teknologi | Keterangan |
|-----------|-----------|
| [React.js](https://reactjs.org/) (Vite) | Frontend framework utama |
| [Tailwind CSS](https://tailwindcss.com/) | Utility-first CSS styling |
| [Lucide React](https://lucide.dev/) | Icon library modern |
| [Groq AI API](https://console.groq.com/) | AI engine untuk chatbot (model: `llama-3.1-8b-instant`) |
| [Vercel](https://vercel.com/) | Platform deployment |

---

## 🛠️ Instalasi Lokal

### 1. Clone Repository

```bash
git clone https://github.com/arielpradhana/jember-egov-bot.git
cd jember-egov-bot
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Konfigurasi Environment Variable

Buat file `.env` di root folder dan masukkan API Key Groq Anda:

```env
VITE_GROQ_API_KEY=Masukan_API_Key_Anda_Di_Sini
```

> **Catatan:** Dapatkan API Key Groq secara gratis di [console.groq.com](https://console.groq.com/)

### 4. Jalankan Aplikasi

```bash
npm run dev
```

Aplikasi akan berjalan di `http://localhost:5173`

---

## 🌍 Panduan Deploy ke Vercel

Aplikasi ini sudah dikonfigurasi untuk langsung di-deploy ke Vercel melalui integrasi GitHub.

1. **Push ke GitHub:** Pastikan semua kode terbaru sudah di-push ke repo GitHub Anda.
2. **Koneksikan ke Vercel:** Di dashboard Vercel, pilih **"New Project"** dan impor repository GitHub Anda.
3. **Set Environment Variable** *(PENTING):*
   - Pada proses setup di Vercel, buka bagian **Environment Variables**
   - Tambahkan key: `VITE_GROQ_API_KEY`
   - Tambahkan value: *(Masukkan API Key Groq Anda)*
4. **Deploy:** Klik tombol deploy dan tunggu hingga selesai!

> Setiap kali kamu push ke branch `main`, Vercel akan otomatis melakukan re-deploy.

---

## 📁 Struktur Folder

```
jember-egov-bot/
├── src/
│   └── App.jsx          # Logika utama aplikasi dan UI
├── public/
│   ├── logo.png         # Logo Kabupaten Jember
│   ├── bg-jember.jpg    # Background utama website
│   └── ...              # Aset gambar lainnya (IKD, Bansos, dll)
├── .env                 # API Key (jangan di-commit!)
├── .gitignore
├── package.json
└── vite.config.js
```

---

## ❗ Troubleshooting

| Masalah | Solusi |
|---------|--------|
| `VITE_GROQ_API_KEY is not defined` | Pastikan file `.env` sudah dibuat dan diisi dengan API Key Groq yang valid |
| Bot tidak merespons | Periksa koneksi internet dan pastikan API Key Groq masih aktif/belum habis kuota |
| Halaman kosong setelah deploy | Periksa kembali konfigurasi Environment Variable di dashboard Vercel |
| Error saat `npm install` | Pastikan Node.js versi ≥18 sudah terinstall |

---

## ✒️ Identitas

| | |
|-|-|
| Proyek | Tugas Akhir E-Government |
| Universitas | Universitas Jember (UNEJ) |
| Tema | Modernisasi Layanan Publik Berbasis AI |

---

> *"Bersama mewujudkan Jember yang lebih baik. **Semua Karena Cinta.**"* 🌹
