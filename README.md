# Family Home Hub

Raspberry Pi 5 touch display uygulamasi - cocuklar icin uyku rituel takibi, canavar dedektoru ve aile panosu.

## Ozellikler

1. **Uyku Ritueli** - Dis fircalama, tuvalet, pijama gibi uyku oncesi adimlari icin interaktif kontrol listesi
2. **Canavar Dedektoru** - Cocuklarin uyku kaygilarini yenmesine yardimci olan eglenceli tarama araci
3. **Aile Panosu** - Google Calendar etkinlikleri, hava durumu ve Home Assistant akilli ev durumu

## Teknolojiler

- **Frontend:** React, TypeScript, Tailwind CSS, Framer Motion
- **Backend:** Node.js, Express
- **Veritabani:** PostgreSQL (Supabase uyumlu)
- **API Entegrasyonlari:** Google Calendar, Open-Meteo Weather, Home Assistant

## Kurulum

### 1. Bagimliliklari yukle
```bash
npm install
```

### 2. Ortam degiskenlerini ayarla
`.env` dosyasi olusturun:
```env
DATABASE_URL=postgresql://...
SESSION_SECRET=gizli-anahtar
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
GOOGLE_REFRESH_TOKEN=...
```

### 3. Veritabanini hazirla
```bash
npm run db:push
```

### 4. Gelistirme modunda calistir
```bash
npm run dev
```

### 5. Production build
```bash
npm run build
npm run start
```

## Render Deployment

1. Render.com'da yeni Web Service olusturun
2. Bu repoyu baglayin
3. Environment variables ekleyin:
   - `DATABASE_URL` (Supabase connection string)
   - `SESSION_SECRET`
   - Google Calendar kimlik bilgileri (opsiyonel)

## Lisans

MIT
