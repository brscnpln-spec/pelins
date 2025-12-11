# Render Deployment Rehberi

Bu rehber, Family Home Hub uygulamasini Render.com uzerinde ucretsiz olarak yayinlamanizi saglar.

---

## On Kosullar

1. GitHub reponuz hazir olmali: https://github.com/brscnpln-spec/pi
2. Supabase veritabaniniz olusturulmus olmali (SUPABASE_KURULUM.md'ye bakin)

---

## Adim 1: Render Hesabi Olusturma

1. https://render.com adresine gidin
2. **"Get Started"** tiklayin
3. **"GitHub"** ile giris yapin (en kolay yol)
4. Render'in GitHub reponuza erismesine izin verin

---

## Adim 2: Yeni Web Service Olusturma

1. Dashboard'da **"New +"** > **"Web Service"** tiklayin
2. **"Build and deploy from a Git repository"** secin
3. GitHub reponuzu secin: `brscnpln-spec/pi`
4. **"Connect"** tiklayin

---

## Adim 3: Servis Ayarlari

Asagidaki ayarlari yapin:

| Alan | Deger |
|------|-------|
| **Name** | `family-home-hub` |
| **Region** | Frankfurt (EU Central) - veya size yakin olan |
| **Branch** | `main` |
| **Runtime** | `Node` |
| **Build Command** | `npm install && npm run build` |
| **Start Command** | `npm run start` |
| **Instance Type** | `Free` |

---

## Adim 4: Ortam Degiskenlerini Ekleme

**"Environment Variables"** bolumune asagidaki degiskenleri ekleyin:

### Zorunlu Degiskenler

| Key | Value |
|-----|-------|
| `DATABASE_URL` | Supabase connection string'iniz |
| `SESSION_SECRET` | Rastgele guclu bir sifre (ornegin: `mySecretKey123!@#`) |
| `NODE_ENV` | `production` |

### Opsiyonel Degiskenler (Google Calendar icin)

| Key | Value |
|-----|-------|
| `GOOGLE_CLIENT_ID` | Google OAuth Client ID |
| `GOOGLE_CLIENT_SECRET` | Google OAuth Client Secret |
| `GOOGLE_REFRESH_TOKEN` | Google OAuth Refresh Token |

### Opsiyonel Degiskenler (Home Assistant icin)

| Key | Value |
|-----|-------|
| `HOME_ASSISTANT_URL` | Home Assistant URL'niz |
| `HOME_ASSISTANT_TOKEN` | Home Assistant token'iniz |

---

## Adim 5: Deploy Etme

1. Tum ayarlari yaptiktan sonra **"Create Web Service"** tiklayin
2. Render otomatik olarak build islemini baslatacak
3. Build tamamlaninca uygulamaniz canli olacak!

Build suresi: Yaklasik 3-5 dakika

---

## Adim 6: Uygulamaniza Erisme

Deploy tamamlandiktan sonra:

1. Render size bir URL verecek: `https://family-home-hub.onrender.com`
2. Bu URL'yi tarayicinizda acin
3. Uygulamaniz calisiyor olmali!

---

## Onemli Notlar

### Ucretsiz Plan Limitleri

- Uygulama 15 dakika aktif degilse uyku moduna gecer
- Ilk istek yavas olabilir (uyanma suresi)
- Ayda 750 saat calisma suresi
- Bu uygulama icin yeterli!

### Uyku Modunu Onleme (Opsiyonel)

Uygulamanin surekli aktif kalmasini istiyorsaniz:
- UptimeRobot gibi ucretsiz servisler kullanabilirsiniz
- Her 10 dakikada bir ping atar ve uygulamayi uyandirirsiniz

### Otomatik Deploy

- GitHub'a push yaptiginizda Render otomatik olarak yeniden deploy eder
- Bu ozelligi kapatmak icin Settings > Build & Deploy > Auto-Deploy'u kapatin

---

## Sorun Giderme

### Build Hatasi

1. Render Dashboard'da **"Logs"** sekmesine tiklayin
2. Hata mesajlarini okuyun
3. Genellikle eksik ortam degiskeni veya yanlis komut kaynaklidir

### Veritabani Baglanti Hatasi

- `DATABASE_URL` dogru ayarlandigindan emin olun
- Supabase'deki sifreyi dogru girdiginizden emin olun
- Connection string'de `[YOUR-PASSWORD]` kismini degistirdiginizden emin olun

### Sayfa Yuklenmiyorsa

1. Logs'a bakin
2. `npm run build` komutunun basarili oldugundan emin olun
3. `npm run start` komutunun calisiyor oldugundan emin olun

---

## Google Calendar Ayarlari (Render icin)

Google Calendar'i Render'da kullanmak icin OAuth redirect URI'yi guncellemeniz gerekir:

1. Google Cloud Console'a gidin
2. Credentials > OAuth Client'inizi secin
3. **Authorized redirect URIs** bolumune ekleyin:
   ```
   https://family-home-hub.onrender.com/api/auth/google/callback
   ```
   (URL'yi kendi Render URL'nizle degistirin)

4. Ilk seferlik refresh token almak icin:
   ```
   https://family-home-hub.onrender.com/api/auth/google
   ```
   adresine gidin ve yetkilendirme yapin.

---

## Tamamlandi!

Uygulamaniz artik internette yayinda:
- **URL:** `https://family-home-hub.onrender.com`
- **Veritabani:** Supabase (ucretsiz)
- **Hosting:** Render (ucretsiz)

Toplam maliyet: **0 TL / ay**
