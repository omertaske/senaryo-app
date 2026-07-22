Auteur Studio - Gelecek Geliştirme Yol Haritası (TODO)
Bu belge, Auteur Studio projesinin performans, işlevsellik ve kullanıcı deneyimini bir üst seviyeye taşımak için planlanan gelecekteki geliştirmeleri içerir.

1. Bulut Entegrasyonu ve Otomatik Senkronizasyon (Google Drive / Dropbox)
Açıklama: Verilerin tamamen tarayıcının yerelinde (IndexedDB) saklanması hız ve gizlilik için harika olsa da tarayıcı verilerinin silinmesi riskine karşı bir güvence sağlamalıdır.

Detay: Kullanıcının kendi Google Drive veya Dropbox hesabına OAuth2 ile bağlanarak *.senaryo proje dosyalarını buluta tek tıkla yedeklemesi veya her değişiklikte arka planda otomatik senkronize etmesi sağlanacak.

2. Sektör Standardı Final Draft (.fdx) Dışa Aktarım Desteği
Açıklama: Profesyonel prodüksiyon şirketleri, yapımcılar ve yönetmenler genellikle .fdx formatını talep etmektedir.

Detay: Mevcut PDF, Fountain ve Proje Dosyası formatlarına ek olarak, senaryo verilerini doğrudan Final Draft XML yapısına (.fdx) dönüştürüp indirebilecek bir export motoru eklenecek.

3. Kapsamlı Karakter ve Mekan İstatistik Paneli
Açıklama: Senaristin hikaye dengesini ve karakter ağırlıklarını ölçebilmesi için veri analitiğine ihtiyacı vardır.

Detay: Hangi karakterin toplam kaç sahnesi ve diyalog satırı olduğunu, hangi mekanların senaryoda en çok kullanıldığını (İÇ/DIŞ dağılımlarıyla birlikte) pasta ve sütun grafiklerle gösteren yeni bir istatistik sekmesi eklenecek.

4. Dikkat Dağıtmayan "Daktilo / Odak Modu" (Zen Mode)
Açıklama: Uzun yazım seanslarında senaristin dış dünyayla bağını koparıp sadece metne odaklanması gerekir.

Detay: Tek tuşla (örn: F11 veya özel bir ikonla) sol menünün, üst barın ve tüm arayüz unsurlarının gizlendiği, ekranın ortasında sadece daktilo kağıdı gibi süzülen tam ekran siyah/odaklanma modu tasarlanacak.

5. Gelişmiş Metin İçi Arama ve Bul/Değiştir (Find & Replace)
Açıklama: Yüzlerce sayfalık bir senaryoda bir karakterin ismini veya bir mekan adını toplu değiştirmek veya aramak zor olabiliyor.

Detay: Proje genelinde veya aktif bölümde çalışacak, Regex destekli, büyük/küçük harf duyarlı gelişmiş bir "Bul ve Değiştir" (Ctrl+F / Ctrl+H) modal penceresi entegre edilecek.

6. Sahneler Arası Sürükle-Bırak (Drag & Drop) Özelliği
Açıklama: Mantar Pano (Story Board / Beats) veya bölüm içerisindeki sahnelerin sırasını değiştirmek şu an kısıtlı olabilir.

Detay: HTML5 Drag and Drop veya @dnd-kit kütüphanesi kullanılarak sahnelerin sırasının mouse ile tutulup kolayca yukarı/aşağı taşınabilmesi sağlanacak.

7. Otomatik Senaryo Format Denetimi ve Hata Kontrolü (Linting)
Açıklama: Hollywood standartlarında format hataları (örneğin arka arkaya gelen iki aksiyon bloğu veya eksik parantezler) senaryo okunabilirliğini düşürür.

Detay: Yazım esnasında arka planda çalışan ve "Eyvah, burada karakter adı unutulmuş" veya "Mekan formatı hatalı" gibi uyarıları hafifçe belirten akıllı bir format denetim mekanizması kurulacak.

8. Çoklu Dil Desteği (Localization - i18n)
Açıklama: Uygulamanın uluslararası pazara açılabilmesi için arayüz dillerinin çeşitlendirilmesi gerekir.

Detay: i18next altyapısı kurularak başlangıçta Türkçe ve İngilizce olmak üzere arayüz dilinin dinamik olarak değiştirilebilmesi sağlanacak.

9. Sayfa Başına Düşen Süre / Sayfa Sayacı Tahmini (Page-Count Metric)
Açıklama: Sinema sektöründe 1 sayfa senaryo ortalama 1 dakikalık ekrandaki sahneye denk gelir.

Detay: Senaryodaki standart blok uzunluklarını ve satır sayılarını analiz ederek sağ alt köşede canlı olarak "Tahmini Süre: 94 Dakika (94 Sayfa)" gösteren akıllı bir sayaç eklenecek.

10. Karakter İlişki Ağı ve Web Diyagramı (Character Web)
Açıklama: Karmaşık suç veya dram serilerinde (örn: ARAF) karakterler arası bağların görselleştirilmesi hikaye kurgusunu kolaylaştırır.

Detay: Karakterler sekmesine eklenecek interaktif bir tuval (canvas) üzerinden karakterlerin birbirleriyle olan bağlarının (düşman, ortak, akraba vb.) çizgilerle birbirine bağlanabildiği bir ilişki haritası yapılacak.

11. Canlı İşbirliği Altyapısı (Real-time Collaboration - WebSocket / CRDT)
Açıklama: Senaryoyu bir ortak yazarla veya yönetmenle aynı anda eşzamanlı düzenleyebilmek büyük bir avantajdır.

Detay: YJS veya Firebase / Supabase altyapısı entegre edilerek, Google Docs benzeri çoklu kullanıcının aynı senaryoyu aynı anda canlı yazabilmesi sağlanacak.

12. Ses Efekti ve Görsel Referans Panosu (Moodboard / Audio Cue)
Açıklama: Senaristler yazarken o anki atmosferi yakalamak için müzik veya görsel referanslara ihtiyaç duyar.

Detay: Mekan veya sekans detaylarına yüklenen görsellerin yanına, yazım esnasında arka planda çalabilecek telifsiz ambient/gerilim sesleri veya yağmur sesleri oynatabilen mini bir ses paneli eklenecek.

13. Sürüm Geçmişi ve Geri Alma Noktaları (Version History / Snapshots)
Açıklama: "Dünkü yazdığım sahneler daha iyiydi, keşke o hâline dönebilsem" durumları için güvenlik ağı gerekir.

Detay: IndexedDB içinde her günün sonunda veya önemli export işlemlerinde projenin otomatik anlık yedeğini (snapshot) alan ve istenen eski versiyona tek tıkla geri dönmeyi sağlayan zaman tüneli özelliği eklenecek.

14. Akıllı Karakter Diyalog Sesi Analizi (Voice Profiling)
Açıklama: Her karakterin kendine has bir konuşma dili (slang, akademik, kısa cümleler vb.) olmalıdır.

Detay: Yapay zeka veya metin analitiği yardımıyla seçilen karakterin diyaloglarını tarayıp "Bu karakter son sahnelerde çok uzun cümleler kurmuş, karakter dışına çıkıyor" gibi uyarılar veren mini bir analiz aracı geliştirilecek.

15. PWA (Progressive Web App) ve Çevrimdışı Masaüstü Uygulama Desteği (Tauri / Electron)
Açıklama: Kullanıcıların tarayıcı sekmesine bağımlı kalmadan bilgisayarlarında doğrudan bağımsız bir uygulama (.exe / .dmg) olarak çalıştırması deneyimi uçurur.

Detay: Proje yapısı Tauri veya Electron altyapısına taşınarak Windows, macOS ve Linux için yerel masaüstü uygulama paketleri derlenecek.