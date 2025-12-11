# Supabase Veritabani Kurulum Rehberi

Bu rehber, Family Home Hub uygulamasini Supabase veritabani ile calistirmanizi saglar.

---

## Adim 1: Supabase Hesabi Olusturma

1. https://supabase.com adresine gidin
2. **"Start your project"** veya **"Sign Up"** tiklayin
3. GitHub hesabinizla giris yapin (en kolay yol)

---

## Adim 2: Yeni Proje Olusturma

1. Dashboard'da **"New Project"** tiklayin
2. Organizasyon seciniz (yoksa yeni olusturun)
3. Proje bilgilerini girin:
   - **Name:** `family-home-hub`
   - **Database Password:** Guclu bir sifre girin (bunu kaydedin!)
   - **Region:** Size en yakin bolgeyi secin (ornegin Frankfurt)
4. **"Create new project"** tiklayin
5. Proje olusturulurken bekleyin (1-2 dakika)

---

## Adim 3: Veritabani Baglanti Bilgilerini Alma

1. Sol menuden **"Project Settings"** (dis simgesi) tiklayin
2. **"Database"** sekmesine tiklayin
3. **"Connection string"** bolumunde **"URI"** sekmesini secin
4. **Connection string**'i kopyalayin:
   ```
   postgresql://postgres.[proje-id]:[SIFRENIZ]@aws-0-[region].pooler.supabase.com:6543/postgres
   ```
5. `[SIFRENIZ]` yerine 2. adimda olusturdugununuz sifreyi yazin

---

## Adim 4: Tablolari Olusturma

Supabase'in **SQL Editor**'unu kullanarak tablolari olusturun:

1. Sol menuden **"SQL Editor"** tiklayin
2. **"New query"** tiklayin
3. Asagidaki SQL kodunu yapisririn:

```sql
-- Ritual completions table
CREATE TABLE IF NOT EXISTS ritual_completions (
  id SERIAL PRIMARY KEY,
  date VARCHAR(10) NOT NULL,
  step VARCHAR(20) NOT NULL,
  completed_at TIMESTAMP DEFAULT NOW()
);

-- Unique constraint for date + step
CREATE UNIQUE INDEX IF NOT EXISTS ritual_completions_date_step_idx 
ON ritual_completions(date, step);

-- Monster scans table
CREATE TABLE IF NOT EXISTS monster_scans (
  id SERIAL PRIMARY KEY,
  scanned_at TIMESTAMP DEFAULT NOW(),
  result VARCHAR(20) NOT NULL
);

-- Settings table
CREATE TABLE IF NOT EXISTS settings (
  id SERIAL PRIMARY KEY,
  key VARCHAR(100) UNIQUE NOT NULL,
  value TEXT NOT NULL
);
```

4. **"Run"** butonuna tiklayin (veya Ctrl+Enter)
5. "Success" mesaji gormeli siniz

---

## Adim 5: Render'da Ortam Degiskenini Ayarlama

Render'da uygulamanizi deploy ederken:

1. **Environment Variables** bolumune gidin
2. Yeni degisken ekleyin:
   - **Key:** `DATABASE_URL`
   - **Value:** 3. adimda kopyaladiginiz connection string

---

## Adim 6: Lokal Gelistirme Icin

Bilgisayarinizda test etmek istiyorsaniz, `.env` dosyasi olusturun:

```env
DATABASE_URL=postgresql://postgres.[proje-id]:[SIFRENIZ]@aws-0-[region].pooler.supabase.com:6543/postgres
SESSION_SECRET=gizli-anahtar-buraya
```

---

## Onemli Notlar

### Ucretsiz Plan Limitleri
- 500 MB veritabani alani
- 2 GB bant genisligi / ay
- 50,000 satir
- Bu uygulama icin fazlasiyla yeterli!

### Baglanti Havuzu (Connection Pooling)
Supabase otomatik olarak connection pooling saglar. Render gibi serverless platformlarda bu cok onemlidir.

### Guvenlik
- Veritabani sifrenizi asla paylarmayin
- `.env` dosyasini asla Git'e commit etmeyin (`.gitignore`'da zaten var)

---

## Sorun Giderme

### "Connection refused" hatasi
- Connection string'de `[SIFRENIZ]` kismini gercek sifrenizle degistirdiginizden emin olun
- Supabase projesinin aktif oldugunu kontrol edin

### "Relation does not exist" hatasi
- Adim 4'teki SQL komutlarini calistirdiginizdan emin olun
- SQL Editor'da tablolarin olusturuldugunu kontrol edin

### Tablolari Gormek
1. Sol menuden **"Table Editor"** tiklayin
2. Olusturdugunuz tablolari gorebilirsiniz:
   - `ritual_completions`
   - `monster_scans`
   - `settings`

---

## Tamamlandi!

Artik Supabase veritabaniniz hazir. Render'da deploy ederken `DATABASE_URL` ortam degiskenini ekleyerek uygulamanizi calistirabilirsiniz.
