PRODUCT REQUIREMENTS DOCUMENT
Fisherchain.id
Platform Manajemen Nilai Ekonomi Rantai Pasok Perikanan Tangkap Terintegrasi

Versi 2.0  |  Juni 2026  |  Status: Kompetisi Esai & Prototype

1. EXECUTIVE SUMMARY
Fisherchain.id adalah platform manajemen rantai pasok perikanan berbasis data yang dirancang sebagai digital enabler ekosistem Kampung Nelayan Merah Putih. Platform ini bukan pengganti kelembagaan yang sudah ada, melainkan lapisan digital yang menutup tiga celah utama yang belum dijawab oleh solusi apapun saat ini:

•	Minimnya transparansi data stok dan harga secara real-time antara nelayan, koperasi, dan pasar
•	Tidak adanya monitoring mutu hasil tangkapan (cold chain) yang terintegrasi dari TPI ke konsumen
•	Ketidakefisienan distribusi akibat rantai pasok 5-7 lapis yang didominasi tengkulak

Positioning tunggal Fisherchain.id:
"Sistem preservasi nilai ekonomi ikan — dari palka kapal hingga meja makan konsumen, dengan AI, data real-time, dan tracking distribusi transparan."
Diferensiasi dari solusi existing (Aruna, eFishery, Laut Nusantara KKP): Fisherchain.id beroperasi sebagai B2B digital backbone bagi koperasi/Kampung Nelayan Merah Putih — bukan platform komersial B2C yang bersaing langsung. Ia mengisi data gap KNMP dan mengoptimalkan infrastruktur yang sudah dibangun pemerintah, bukan membangun paralel dari nol.

2. PROBLEM STATEMENT
2.1 Root Cause Terpilih
Belum adanya sistem yang mengintegrasikan data tangkapan, kualitas ikan, distribusi, dan informasi pasar secara real-time dalam satu rantai pasok yang transparan — sehingga kehilangan nilai ekonomi pascapanen (fish loss) masih terjadi meskipun sudah ada kebijakan Blue Economy, infrastruktur cold storage, dan platform pemasaran digital.

2.2 Data Pendukung
Indikator	Data	Sumber
Fish loss pascapanen	20-30% dari nilai tangkapan, kerugian Rp 63-83 triliun/tahun	Poernomo A, 2020; DJPT, 2022
Penerimaan nelayan	Hanya ~35% dari harga jual akhir konsumen	Nurhafiza, 2025 (Muara Angke)
Rantai distribusi	5-7 lapis dari nelayan ke konsumen akhir	BRID Jawa Tengah, 2025
Cold storage DAK	Utilisasi baru 47,5% dari target nasional	Sugilar, 2024
Penetrasi smartphone pesisir	61% di wilayah pesisir dan perdesaan	APJII, 2023
Pengguna internet usia 19-34 th	34,40% dari total pengguna internet Indonesia	APJII, 2024

2.3 Gap Analysis Solusi Existing
Solusi	Kekuatan	Gap yang Belum Dijawab
Kampung Nelayan Merah Putih	Infrastruktur cold storage, kelembagaan	Tidak ada sistem data digital, monitoring mutu, tracking distribusi
Aruna	Marketplace modern, B2C luas	Model bisnis komersial, tidak terintegrasi koperasi, tidak ada cold chain monitoring
Laut Nusantara (KKP)	Data cuaca & harga pasar	Tidak ada traceability, tidak ada stock management, tidak ada direct order
eFishery	IoT kuat, prediksi pakan	Fokus akuakultur/budidaya, bukan perikanan tangkap
Data KNMP	Basis data nasional nelayan	Data masih kasar, tidak real-time, tidak terhubung ke rantai pasok aktual
Fisherchain.id	Mengintegrasikan semua gap di atas dalam satu ekosistem koperasi	—

3. TARGET PENGGUNA (3 POV)
POV 1: NELAYAN TANGKAP
Atribut	Detail
Siapa	Nelayan tangkap tradisional, 25-55 tahun, pendidikan SMP/SMA
Perangkat	Smartphone Android entry-level, WhatsApp aktif
Akses Platform	WhatsApp Bot (utama) — TIDAK perlu install aplikasi
Kebutuhan Utama	Tahu harga ikan sebelum/saat mendarat; bukti setoran; laporan penghasilan
Pain Point Kritis	Tidak tahu harga pasar -> jual ke tengkulak harga rendah; tidak ada bukti transaksi
Job to be Done	Foto ikan + timbangan -> kirim WA -> sistem catat otomatis -> dapat harga & receipt

POV 2: ADMIN KOPERASI / KNMP
Atribut	Detail
Siapa	Pengurus Koperasi Merah Putih / staf KNMP, 30-50 tahun
Perangkat	Laptop/tablet dengan browser modern
Akses Platform	Web Dashboard (full-featured)
Kebutuhan Utama	Monitor stok real-time, kelola distribusi, generate laporan untuk KKP
Pain Point Kritis	Pencatatan manual di buku/Excel; tidak bisa track distribusi setelah ikan keluar TPI
Job to be Done	Satu dashboard: stok hari ini, pesanan aktif, status cold storage, laporan bulanan otomatis

POV 3: KONSUMEN / PEMBELI (Offtaker)
Atribut	Detail
Siapa	Restoran, UMKM pengolahan ikan, pedagang pasar, catering, 25-45 tahun
Perangkat	Smartphone iOS/Android atau browser desktop
Akses Platform	Mobile App atau Web
Kebutuhan Utama	Pesan ikan dengan spesifikasi jelas; jaminan kesegaran; bukti traceability untuk pasar premium
Pain Point Kritis	Kualitas tidak konsisten; tidak ada jaminan kesegaran; pemesanan via telepon informal
Job to be Done	Browse stok koperasi -> pesan -> tracking real-time -> terima dengan QR traceability card

4. ARSITEKTUR FITUR (MVP-FIRST)
Prinsip: 4 pilar fitur inti dirilis bertahap. Setiap fitur harus menjawab masalah spesifik yang terukur. Fitur yang hanya menjadi 'pajangan' tanpa menjawab fish loss atau distribusi langsung dieliminasi.

PILAR 1: AI FISH CAPTURE INPUT
Menjawab: Asimetri informasi + rendahnya literasi digital nelayan + data KNMP yang masih kasar

1A. Smart Photo Recognition (Fitur Unggulan)
Cara kerja:
1.	Nelayan foto ikan di atas timbangan (1 foto, kamera HP biasa)
2.	Foto dikirim ke WhatsApp Bot Fisherchain.id
3.	AI (Computer Vision) membaca: (a) jenis ikan dari visual, (b) angka pada timbangan via OCR
4.	Sistem konfirmasi ke nelayan: 'Terdeteksi: Kakap Merah 12,5 kg. Benar? Balas YA/TIDAK'
5.	Jika konfirmasi YA -> data masuk ke stok koperasi + database nasional secara otomatis

Teknologi:
•	Computer Vision: YOLOv8 atau Google Cloud Vision API untuk identifikasi jenis ikan
•	OCR: Tesseract OCR atau Google Vision OCR untuk baca angka timbangan analog/digital
•	WhatsApp: Twilio WhatsApp Business API
•	Database: PostgreSQL cloud (bukan blockchain - tidak perlu di fase ini)

Validasi realistis:
•	Model CV untuk identifikasi ikan sudah dikembangkan dan diuji di beberapa penelitian (Fish Recognition using Deep Learning, IEEE 2022)
•	Akurasi OCR timbangan digital >95%; timbangan analog perlu pencahayaan cukup (batasan yang harus diakui di esai)
•	Fallback: jika AI tidak yakin, admin koperasi konfirmasi secara manual di dashboard

Output untuk KNMP: setiap tangkapan yang diinput secara otomatis masuk ke laporan agregat nasional, mengisi kekosongan data KNMP yang selama ini masih kasar dan tidak real-time.

1B. Price Intelligence Dashboard
Untuk: Nelayan (via WA) & Admin Koperasi (via dashboard)
•	Harga ikan per jenis di TPI terdekat, diperbarui 2x sehari oleh admin koperasi
•	Notifikasi otomatis ke nelayan via WA saat harga naik lebih dari 10%: 'Harga kakap naik jadi Rp 85.000/kg hari ini'
•	Tren harga 30 hari terakhir (grafik sederhana di dashboard admin)
•	Fase 2: integrasi otomatis dengan API harga pasar KKP/InfoHargaPangan

PILAR 2: STOCK MANAGEMENT & COLD CHAIN MONITOR
Menjawab: Fish loss akibat tidak ada monitoring mutu + utilisasi cold storage baru 47,5%

2A. Real-Time Stock Dashboard
•	Stok per jenis ikan (kakap, tuna, udang, cumi, dll) dalam kg, diperbarui setiap ada input tangkapan baru
•	Status kesegaran per batch: SEGAR (0-12 jam), PERLU SEGERA DIJUAL (12-24 jam), BERISIKO (>24 jam)
•	Alert otomatis ke admin jika ada stok yang sudah >20 jam belum terjual
•	Riwayat arus masuk-keluar dengan timestamp untuk audit koperasi

2B. Cold Storage Monitor
Implementasi realistis: sensor di cold storage TPI/gudang koperasi — BUKAN di kapal (tidak realistis secara teknis dan biaya)
•	Sensor suhu IoT sederhana (Rp 300.000-500.000/unit) terpasang di cold storage darat
•	Data suhu terekam setiap 30 menit ke dashboard
•	Alert WhatsApp ke admin jika suhu melewati batas aman (>4 derajat Celsius untuk ikan segar)
•	Riwayat suhu tersimpan dan menjadi dasar Traceability Card (Pilar 4)

PILAR 3: SMART DISTRIBUTION HUB
Menjawab: Rantai distribusi 5-7 lapis, ketergantungan tengkulak, tidak ada transparansi

3A. Direct Order & Matching System
•	Pembeli (restoran, UMKM, pasar) pasang permintaan: jenis ikan, volume, harga yang ditawarkan, tanggal butuh
•	Sistem cocokkan permintaan dengan stok koperasi yang tersedia secara otomatis
•	Admin koperasi konfirmasi order -> pembeli notifikasi -> proses pengiriman dimulai
•	Hasil: rantai distribusi dari 5-7 lapis menjadi 2 lapis: Koperasi -> Pembeli Akhir

3B. Live Distribution Tracker (OpenStreetMap)
Menggunakan OpenStreetMap (OSM) sebagai alternatif open-source dan gratis dari Google Maps:
•	Admin input: kurir berangkat -> sistem generate link tracking berbasis OSM
•	Pembeli dapat link tracking di notifikasi WA: pantau posisi pengiriman secara live
•	Route optimization: OSM + OSRM (Open Source Routing Machine) untuk rekomendasi rute distribusi terpendek ke pasar/pembeli
•	Tidak perlu hardware GPS di kendaraan: cukup smartphone kurir dengan aplikasi sederhana yang share lokasi
•	Keunggulan vs Google Maps: open-source, tidak ada biaya API per request, bisa dikustomisasi untuk tampilkan TPI dan gudang koperasi

3C. Profit & Income Calculator
•	Laporan penghasilan nelayan otomatis dikirim tiap akhir bulan via WA: total kg terjual, harga rata-rata, total pendapatan
•	Admin koperasi: dashboard omzet koperasi, biaya distribusi, margin per jenis ikan
•	Simulasi: 'Jika 50kg kakap dijual ke Restoran A (Rp 85.000/kg) vs Pasar B (Rp 78.000/kg), selisih pendapatan nelayan adalah Rp 350.000'

PILAR 4: TRACEABILITY & MARKET ACCESS
Menjawab: Tidak ada bukti asal-usul ikan untuk pasar premium + tidak ada transparansi untuk konsumen

4A. QR Traceability Card
•	Setiap batch ikan dapat QR Code unik saat diinput ke sistem
•	Pembeli scan QR -> lihat: nama nelayan, tanggal tangkap, lokasi TPI, riwayat suhu cold storage, nama koperasi
•	Ini yang membuka akses ke pasar premium: hotel bintang, restoran fine dining, pasar ekspor yang butuh dokumentasi asal produk
•	Teknologi Fase 1: QR Code + database cloud biasa (cukup, tanpa perlu blockchain)
•	Teknologi Fase 2: jika diperlukan audit eksternal, bisa diintegrasikan ke distributed ledger

4B. Fisher Marketplace (Consumer-Facing)
•	Listing produk koperasi: foto ikan, jenis, berat tersedia, grade kualitas, harga, nama koperasi
•	Filter: jenis ikan, lokasi koperasi, ketersediaan hari ini
•	Tombol 'Lacak Asal': buka Traceability Card (diferensiasi utama dari marketplace biasa)
•	Chat langsung dengan admin koperasi untuk spesifikasi khusus (pesanan partai besar)

5. FITUR YANG DIELIMINASI & ALASAN
Fitur	Alasan Eliminasi	Alternatif
Blockchain untuk pencatatan	Tidak perlu di fase ini; biaya gas fee, kompleksitas tidak sepadan; database cloud sudah cukup untuk integritas data koperasi	PostgreSQL cloud dengan audit log
IoT sensor di kapal/palka	Kapal tradisional tidak punya listrik stabil; konektivitas di laut sangat terbatas; biaya hardware tidak realistis untuk nelayan kecil	Sensor di cold storage TPI/gudang darat (lebih terkontrol, 10x lebih murah)
Fisher Community Forum in-app	Nelayan sudah punya WhatsApp Group; membangun forum baru berarti masalah adopsi ganda; tidak menjawab masalah fish loss secara langsung	WhatsApp Group terstruktur dengan admin koperasi sebagai moderator
GPS tracking kapal di laut	Hardware GPS kapal mahal (Rp 2-5 juta/unit); konektivitas di laut tidak stabil; tidak menjawab masalah distribusi darat	OSM tracking hanya untuk distribusi darat (kurir ke pembeli)
AI prediksi tangkapan/musim	Membutuhkan data historis minimal 2-3 tahun; kompleksitas ML tinggi; bukan masalah utama yang menyebabkan fish loss	Fase 3 setelah data terkumpul; di Fase 1 cukup rekomendasi manual dari admin

6. ARSITEKTUR SISTEM
6.1 Stack Teknologi
Layer	Teknologi	Alasan Pemilihan
WhatsApp Bot	Twilio WhatsApp Business API + Node.js	Paling matang, dokumentasi lengkap, support media (foto)
AI Photo Recognition	YOLOv8 (lokal) atau Google Cloud Vision API	YOLOv8 open-source; Google Vision lebih akurat tapi berbayar per request
OCR Timbangan	Tesseract OCR (open-source) + pre-processing OpenCV	Gratis, bisa dijalankan on-premise, akurasi tinggi untuk angka jelas
Backend API	Node.js + Express atau Python FastAPI	Performa baik untuk real-time; komunitas besar
Database	PostgreSQL (AWS RDS atau Supabase)	Relasional, cocok untuk data transaksi dan stok; gratis tier tersedia
Web Dashboard	React.js + Tailwind CSS	Cepat, responsive, ekosistem luas
Mobile App (Pembeli)	React Native atau Flutter	Cross-platform; satu codebase untuk iOS dan Android
Peta & Routing	OpenStreetMap + Leaflet.js + OSRM	Open-source, gratis, bisa dikustomisasi, tidak ada biaya API
IoT Cold Storage	Sensor suhu ESP32 + MQTT + AWS IoT Core	ESP32 murah (~Rp 100-200rb), MQTT protokol ringan untuk IoT
Hosting	AWS atau Supabase (Fase 1)	Tier gratis untuk awal; scalable saat ekspansi

6.2 Diagram Alur Sistem
[NELAYAN] --> WhatsApp Bot --> AI Photo Recognition --> Validasi Admin --> [DATABASE STOK]
[DATABASE STOK] --> Price Intelligence --> Notif WA ke Nelayan
[DATABASE STOK] --> Stock Dashboard (Admin) --> Order Matching --> [DISTRIBUTOR/KURIR]
[DISTRIBUTOR] --> Live Tracking OSM --> Notif WA ke Pembeli --> [KONSUMEN]
[KONSUMEN] --> Scan QR Traceability Card --> Lihat Riwayat Asal & Suhu
[SEMUA DATA] --> Laporan Agregat --> Optimalisasi Data KNMP

7. DESIGN SYSTEM & UI SPECIFICATION
Referensi visual: Mallku/Holiday Market App — bold, energetik, mobile-first, aksen warna terang di background gelap.

7.1 Color Palette
Token	Hex	Penggunaan
--primary	#1A56FF	CTA utama, header, aktif navigation, link
--accent	#ADFF2F	Badge, highlight, tombol sekunder, notifikasi sukses
--background	#FFFFFF	Background utama (light mode)
--surface	#F5F7FA	Card, input background, tabel baris genap
--text-primary	#0D0D0D	Body text, judul, konten utama
--text-secondary	#6B7280	Subtext, label, hint, placeholder
--success	#22C55E	Stok segar, transaksi sukses, suhu aman
--warning	#F59E0B	Alert stok mendekati habis, suhu mendekati batas
--danger	#EF4444	Error, suhu kritis, stok kosong, fish loss alert
--hero-bg	#1A56FF	Splash screen, hero section, sidebar aktif

7.2 Typography
Role	Font	Weight	Size	Penggunaan
Display / Hero	Inter	900 (Black)	32-40px	Heading splash, hero section
Heading	Inter	700 (Bold)	20-24px	Judul halaman, judul card
Subheading	Inter	600 (SemiBold)	16-18px	Label seksi, nama produk
Body	Inter	400 (Regular)	14-15px	Deskripsi, konten, paragraf
Caption	Inter	500 (Medium)	11-12px	Badge, tag, timestamp, label
Price/KPI	Inter	800 (ExtraBold)	18-28px	Harga, angka dashboard — menonjol

7.3 Screen Inventory Lengkap
Untuk Nelayan (WhatsApp Bot — Tidak ada UI)
•	Interaksi 100% via WhatsApp. Tidak ada aplikasi terpisah untuk nelayan di Fase 1.
•	Bot response menggunakan template pesan WhatsApp Business yang terstruktur

Untuk Admin Koperasi (Web Dashboard)
•	Screen 1 — Login: Background #1A56FF, logo, form email+password, CTA 'Masuk' putih
•	Screen 2 — Overview Dashboard: KPI cards (Stok Hari Ini, Pesanan Aktif, Pendapatan Bulan Ini, Anggota Aktif), grafik tren tangkapan 7 hari, alert cold storage
•	Screen 3 — Manajemen Stok: Filter tab per jenis ikan, list card per item (foto+nama+berat+grade+status suhu), action edit/update
•	Screen 4 — Distribusi & Pesanan: Tab Pesanan Masuk / Dalam Pengiriman / Selesai, tracking OSM terintegrasi
•	Screen 5 — Price Monitor: Tabel harga harian, grafik tren 30 hari, tombol Update Harga
•	Screen 6 — Laporan KNMP: Export otomatis laporan bulanan, data agregat untuk dikirim ke KKP

Untuk Konsumen/Pembeli (Mobile App)
•	Screen 1 — Splash/Onboarding: Background #1A56FF, hero text bold putih, stacked foto ikan, CTA 'Mulai' #ADFF2F
•	Screen 2 — Home Discovery: Search bar, hero banner promo, filter tab jenis ikan, grid produk 2 kolom, bottom navigation
•	Screen 3 — Detail Produk: Foto besar atas, nama koperasi+verified badge, nama ikan+harga, tombol 'Lacak Asal', quantity selector, CTA 'Tambah ke Keranjang'
•	Screen 4 — Traceability Card: Background #1A56FF, timeline journey ikan (tangkap->TPI->cold storage->distribusi->pembeli), grafik suhu
•	Screen 5 — Live Tracking: Peta OSM dengan posisi kurir real-time, estimasi tiba
•	Screen 6 — Keranjang & Checkout: List item, ringkasan harga, pilih pembayaran (Transfer/QRIS), CTA 'Pesan Sekarang'

8. ROADMAP IMPLEMENTASI
Fase	Periode	Deliverable	Target KPI
Fase 1 — Foundation	Bulan 1-6	WhatsApp bot + AI photo recognition, web dashboard admin, price monitoring manual, database cloud, cold storage sensor di 1 TPI pilot	80% nelayan aktif input via WA bot; 1 koperasi pilot (50-100 nelayan)
Fase 2 — Scale & Quality	Bulan 7-18	Mobile app konsumen, OSM live tracking, Direct order matching, Traceability QR, integrasi API harga otomatis, 5-10 koperasi	Fish loss turun 15% di koperasi pilot; 500+ transaksi/bulan
Fase 3 — Intelligence	Bulan 19-36	ML prediksi harga & permintaan, integrasi data KNMP nasional, ekspansi ke perikanan budidaya, 30+ koperasi	Fish loss turun 25%; data KNMP dari Fisherchain.id mencakup 10+ wilayah

9. METRIK KEBERHASILAN (KPI)
Metrik	Baseline Saat Ini	Target Fase 1	Target Fase 2
Fish loss nilai ekonomi	20-30% dari nilai tangkapan	Turun ke 15-20%	Turun ke 10-15%
% tangkapan tercatat digital	~5% (manual/tidak tercatat)	60% di koperasi pilot	85%
Selisih harga nelayan vs pasar	65% margin ke perantara	Nelayan terima 50%+	Nelayan terima 60%+
Waktu distribusi rata-rata	Tidak terukur (tidak ada data)	Baseline terukur	Berkurang 30% dari baseline
Kepuasan pembeli (rating)	Tidak ada sistem rating	4.0/5.0+	4.3/5.0+
Data KNMP yang dioptimalisasi	Data kasar, tidak real-time	1 wilayah pilot real-time	5 wilayah real-time

10. RISIKO & MITIGASI
Risiko	Probabilitas	Dampak	Mitigasi
Akurasi AI photo recognition rendah untuk ikan kotor/bercampur	Sedang	Tinggi	Fallback manual konfirmasi admin; training model dengan dataset ikan Indonesia spesifik; minimum 3 foto dari sudut berbeda
Konektivitas internet tidak stabil di area pesisir	Tinggi	Sedang	Mode offline WhatsApp bot dengan sync saat koneksi tersedia; input manual sebagai fallback selalu tersedia
Resistensi nelayan terhadap teknologi baru	Tinggi	Tinggi	Onboarding via WhatsApp (tidak perlu install app); peran Karang Taruna sebagai agen sosialisasi dan pendampingan; insentif: laporan penghasilan otomatis yang langsung terasa manfaatnya
Ketergantungan pada Kampung Nelayan Merah Putih yang belum matang	Sedang	Tinggi	Pilot di koperasi yang sudah berjalan >2 tahun; tidak eksklusif ke KNMP — bisa dipakai koperasi nelayan manapun
Data manipulation oleh oknum (input palsu)	Rendah	Tinggi	Multi-level approval: bot -> konfirmasi nelayan -> validasi admin; audit log tidak bisa dihapus; AI cross-check foto vs data input
Persaingan atau duplikasi dengan program KKP	Rendah	Sedang	Posisi sebagai data partner/enabler KKP, bukan pengganti; aktif komunikasikan sebagai pengoptimal data KNMP

11. STITCH PROMPT GUIDE
Gunakan prompt berikut secara berurutan di Stitch untuk generate desain. Warna dan style mengikuti referensi Mallku/Holiday Market App.

PROMPT 1 — Splash Screen (Pembeli)
Design a mobile app splash screen for 'Fisherchain.id' — a fish supply chain platform. Style reference: bold energetic marketplace app. Background: solid royal blue #1A56FF. Large bold white headline (Inter Black 36px): 'IKAN SEGAR LANGSUNG DARI NELAYAN'. Subtext white smaller: 'Tahu persis asal ikan Anda sebelum membelinya.' Stacked product photo cards showing fresh fish slightly rotated at center-bottom (like clothing stacked in reference). Green neon CTA button at bottom: 'Mulai Sekarang' — color #ADFF2F, black text, pill-shaped border-radius 40px, full width with margin. Small oval pill badge at top center: 'Fisherchain.id' white outline on blue.

PROMPT 2 — Home Discovery Screen (Pembeli)
Design a mobile marketplace home screen for 'Fisherchain.id'. White background, bold blue #1A56FF accents. Top bar: avatar left, search bar center ('Cari ikan segar...'), notification bell + cart right. Hero banner: blue #1A56FF background, white bold text 'STOK KAKAP MELIMPAH HARI INI', green button 'Lihat Sekarang' #ADFF2F. Filter tabs below: [Semua] [Kakap] [Tuna] [Udang] [Cumi] — active tab blue pill #1A56FF white text. Section 'Paling Dicari' with 2-column product card grid: rounded corners 16px, photo top, star rating, product name bold, price blue bold. Bottom navigation: Home (active blue pill), Stok, Pesanan, Profil.

PROMPT 3 — Product Detail Screen (Pembeli)
Design mobile product detail screen for Fisherchain.id fresh fish marketplace. Top 60%: large fish product photo, back arrow top-left, heart icon top-right. White card sliding up: Seller row (avatar + 'Koperasi Nelayan Indramayu' + blue verified checkmark + 3-dot menu). Product name bold large: 'KAKAP MERAH SEGAR'. Strikethrough grey price then current price large blue bold: 'Rp 78.000/kg'. Star rating + reviews. Blue outlined button: 'Lacak Asal Ikan' full width. Quantity selector: minus-circle, '1', plus-circle. Full-width blue #1A56FF pill CTA: 'Tambah ke Keranjang' with cart icon.

PROMPT 4 — Traceability Card Screen
Design mobile fish traceability card for Fisherchain.id. Blue gradient background #1A56FF to #0D3BCC. White text throughout. Title: 'Lacak Asal Ikan' with QR icon. Vertical timeline showing journey: 1) Fish icon 'Ditangkap - Nelayan Pak Ahmad, Indramayu, 12 Juni 2026' 2) Building icon 'TPI Pendaratan - Karangsong, 2 derajat C checked' 3) Snowflake icon 'Cold Storage Koperasi - 18 jam, avg 1.8 derajat C checked' 4) Truck icon 'Dalam Pengiriman - Estimasi 2 jam' 5) Plate icon 'Diterima Pembeli'. Green checkmark for completed steps, grey for upcoming. Mini temperature line graph below (green line below 4 derajat threshold). Share button and Download button at bottom.

PROMPT 5 — Admin Dashboard Web
Design web dashboard for Fisherchain.id cooperative admin. Dark navy sidebar #0D1B4B with white icons and text, active item highlighted blue #1A56FF. Main area white. Top: greeting 'Selamat Pagi, Pak Budi' + date + bell icon. 4 KPI cards in a row: 'Total Stok (kg)', 'Pesanan Aktif', 'Pendapatan Bulan Ini', 'Anggota Aktif' — each with icon, big bold number, percentage change indicator (green up or red down). Line chart 'Tren Tangkapan 7 Hari' blue line clean grid. Right sidebar 'Pesanan Terbaru' list with status chips (green 'Diproses', blue 'Dikirim', grey 'Selesai'). Orange alert banner at top if cold storage temperature abnormal.

PROMPT 6 — Live Tracking Map Screen (Pembeli)
Design mobile live delivery tracking screen for Fisherchain.id. Top half: full-width map (OpenStreetMap style, clean minimal) showing route line from TPI origin to destination, fish icon marker for courier current position, blue destination pin. Bottom half: white card with 'Pengiriman Aktif' header. Order summary: photo thumbnail + 'Kakap Merah 5kg' + order number. Status bar: 3 steps (Dikonfirmasi checked, Dalam Perjalanan active, Diterima pending). ETA: 'Estimasi tiba: 45 menit' in bold. Courier info: avatar + name + phone call button. Bottom: blue pill button 'Hubungi Kurir'.

Fisherchain.id PRD v2.0 | Juni 2026
Dikembangkan untuk Kompetisi Esai Peneliti Muda | Tema: Ekonomi Kreatif dan Berkelanjutan
