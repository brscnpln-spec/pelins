# Family Home Hub - Raspberry Pi 5 Kurulum Rehberi

Bu rehber, Family Home Hub uygulamasini Raspberry Pi 5 uzerinde lokal olarak calistirmanizi saglar.

## Gereksinimler

- Raspberry Pi 5 (4GB veya 8GB RAM onerilen)
- Raspberry Pi OS (64-bit) yuklu microSD kart
- Touch ekran (800x480 veya 1024x600)
- Internet baglantisi (ilk kurulum ve Google Calendar icin)
- Klavye ve mouse (ilk kurulum icin)

---

## Adim 1: Raspberry Pi OS Guncelleme

Terminal acin ve su komutlari calistirin:

```bash
sudo apt update
sudo apt upgrade -y
```

---

## Adim 2: Node.js Kurulumu

```bash
# NodeSource repository ekle
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -

# Node.js kur
sudo apt-get install -y nodejs

# Kurulumu dogrula
node --version
npm --version
```

Node.js 20.x veya ustu gormeli siniz.

---

## Adim 3: PostgreSQL Veritabani Kurulumu

```bash
# PostgreSQL kur
sudo apt install postgresql postgresql-contrib -y

# PostgreSQL servisini baslat
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Veritabani ve kullanici olustur
sudo -u postgres psql -c "CREATE USER familyhub WITH PASSWORD 'familyhub123';"
sudo -u postgres psql -c "CREATE DATABASE familyhub OWNER familyhub;"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE familyhub TO familyhub;"
```

---

## Adim 4: Proje Dosyalarini Indirme

### Secenек A: Replit'ten ZIP Olarak Indir
1. Replit'te projenizi acin
2. Sol paneldeki uc nokta menusune tiklayin
3. "Download as zip" secin
4. ZIP dosyasini Raspberry Pi'ye transfer edin
5. Dosyayi cikartin:
```bash
cd ~
unzip family-home-hub.zip -d familyhub
cd familyhub
```

### Secenek B: Git ile Klonla (eger GitHub'a yuklediyseniz)
```bash
cd ~
git clone https://github.com/KULLANICI_ADINIZ/family-home-hub.git familyhub
cd familyhub
```

---

## Adim 5: Ortam Degiskenlerini Ayarlama

Proje klasorunde `.env` dosyasi olusturun:

```bash
cd ~/familyhub
nano .env
```

Asagidaki icerigi yapistirin ve kaydedin:

```env
# Veritabani baglantisi
DATABASE_URL=postgresql://familyhub:familyhub123@localhost:5432/familyhub

# Oturum guvenlik anahtari (rastgele bir metin girin)
SESSION_SECRET=buraya-gizli-bir-anahtar-yazin-rastgele-karakterler

# Home Assistant (opsiyonel - kullanmiyorsaniz bos birakin)
HOME_ASSISTANT_URL=
HOME_ASSISTANT_TOKEN=

# Sunucu portu
PORT=5000
```

Kaydetmek icin: `Ctrl+O`, Enter, sonra `Ctrl+X`

---

## Adim 6: Bagimliliklari Yukleme

```bash
cd ~/familyhub
npm install
```

Bu islem birkaç dakika surebilir.

---

## Adim 7: Veritabani Tablolarini Olusturma

```bash
npm run db:push
```

"Changes applied" mesaji gormeli siniz.

---

## Adim 8: Uygulamayi Calistirma (Test)

```bash
npm run dev
```

Tarayicida `http://localhost:5000` adresine gidin. Uygulama calisiyorsa devam edin.

Durdurmak icin: `Ctrl+C`

---

## Adim 9: Otomatik Baslatma Ayarlari (PM2)

Raspberry Pi her acildiginda uygulamanin otomatik baslamasi icin:

```bash
# PM2 kur
sudo npm install -g pm2

# Production build olustur
npm run build

# PM2 ile baslat
pm2 start npm --name "familyhub" -- run start

# Sistem baslangicinda otomatik calistir
pm2 startup
# Gosterilen komutu kopyalayip calistirin

pm2 save
```

---

## Adim 10: Chromium Kiosk Modu (Tam Ekran)

Touch ekranda tam ekran gosterim icin:

### A) Manuel Acma
```bash
chromium-browser --kiosk --noerrdialogs --disable-infobars http://localhost:5000
```

### B) Otomatik Acilma (Masaustu basladiginda)

Autostart dosyasi olusturun:
```bash
mkdir -p ~/.config/autostart
nano ~/.config/autostart/familyhub.desktop
```

Icerigi yapistirin:
```ini
[Desktop Entry]
Type=Application
Name=Family Hub
Exec=chromium-browser --kiosk --noerrdialogs --disable-infobars --disable-session-crashed-bubble http://localhost:5000
```

Kaydedin ve cikin.

---

## Adim 11: Ekran Ayarlari (Opsiyonel)

### Ekran Uyku Modunu Kapatma
```bash
sudo nano /etc/lightdm/lightdm.conf
```

`[Seat:*]` bolumune ekleyin:
```
xserver-command=X -s 0 -dpms
```

### Ekran Dondurmesi Kapatma
```bash
sudo nano /boot/config.txt
```

Dosyanin sonuna ekleyin:
```
display_rotate=0
```

---

## Faydali Komutlar

```bash
# Uygulamayi baslat
pm2 start familyhub

# Uygulamayi durdur
pm2 stop familyhub

# Uygulamayi yeniden baslat
pm2 restart familyhub

# Loglari gor
pm2 logs familyhub

# Durum kontrol
pm2 status
```

---

## Sorun Giderme

### "Cannot connect to database" hatasi
```bash
sudo systemctl status postgresql
sudo systemctl restart postgresql
```

### Port 5000 kullanimda hatasi
```bash
sudo lsof -i :5000
# PID'yi bulun ve durdurun
sudo kill -9 PID_NUMARASI
```

### Uygulama calismiyor
```bash
cd ~/familyhub
pm2 logs familyhub --lines 50
```

---

## Google Calendar Baglamak

Lokal kurulumda Google Calendar icin OAuth ayarlamasi gerekir. Asagidaki adimlari takip edin:

### Adim A: Google Cloud Projesi Olusturma

1. https://console.cloud.google.com adresine gidin
2. Ust menuden "Select a project" > "New Project" tiklayin
3. Proje adi: `FamilyHub` yazin ve "Create" tiklayin
4. Projeyi secin

### Adim B: Google Calendar API'yi Aktive Etme

1. Sol menuden "APIs & Services" > "Library" secin
2. "Google Calendar API" arayin
3. "Enable" butonuna tiklayin

### Adim C: OAuth Consent Screen Ayarlama

1. Sol menuden "APIs & Services" > "OAuth consent screen" secin
2. "External" secin ve "Create" tiklayin
3. App name: `Family Hub` yazin
4. User support email: kendi emailinizi secin
5. Developer contact: kendi emailinizi yazin
6. "Save and Continue" tiklayin
7. Scopes sayfasinda "Add or Remove Scopes" tiklayin
8. Asagidaki scope'lari ekleyin:
   - `https://www.googleapis.com/auth/calendar.readonly`
   - `https://www.googleapis.com/auth/calendar.events.readonly`
9. "Save and Continue" tiklayin
10. Test users sayfasinda "Add Users" tiklayin ve kendi Gmail adresinizi ekleyin
11. "Save and Continue" tiklayin

### Adim D: OAuth Kimlik Bilgileri Olusturma

1. Sol menuden "APIs & Services" > "Credentials" secin
2. "Create Credentials" > "OAuth client ID" tiklayin
3. Application type: "Web application" secin
4. Name: `Family Hub Local` yazin
5. "Authorized redirect URIs" bolumune ekleyin:
   ```
   http://localhost:5000/api/auth/google/callback
   ```
6. "Create" tiklayin
7. Acilan pencerede **Client ID** ve **Client Secret** degerlerini kopyalayin

### Adim E: Kimlik Bilgilerini .env Dosyasina Ekleme

```bash
nano ~/familyhub/.env
```

Asagidaki satirlari ekleyin (kendi degerlerinizle degistirin):

```env
GOOGLE_CLIENT_ID=123456789-abcdefg.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-xxxxxxxxxx
```

Kaydedin: `Ctrl+O`, Enter, `Ctrl+X`

### Adim F: Refresh Token Alma

1. Uygulamayi baslatin:
   ```bash
   cd ~/familyhub
   npm run dev
   ```

2. Tarayicida su adrese gidin:
   ```
   http://localhost:5000/api/auth/google
   ```

3. Google hesabinizla giris yapin ve izin verin

4. Ekranda gosterilen **GOOGLE_REFRESH_TOKEN** degerini kopyalayin

5. `.env` dosyasina ekleyin:
   ```bash
   nano ~/familyhub/.env
   ```
   
   Ekleyin:
   ```env
   GOOGLE_REFRESH_TOKEN=1//0xxxxxxxxxxxxxxxxx
   ```

6. Uygulamayi yeniden baslatin:
   ```bash
   pm2 restart familyhub
   ```

Artik takvim etkinlikleriniz Dashboard'da gorunecek!

---

## Tamamlandi!

Raspberry Pi'nizi yeniden baslatin ve uygulamanin otomatik olarak tam ekranda acildigini gorun:

```bash
sudo reboot
```
