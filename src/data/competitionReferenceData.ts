/**
 * SISTEM RUJUKAN BERSTRUKTUR DOKUMEN PERTANDINGAN SOAR IPMA 2026
 * 
 * SUMBER RUJUKAN UTAMA:
 * - Buku Panduan Syarat & Peraturan Rasmi Festival Sound & Rhythm (SOAR) IPMA 2026
 *   (Bahagian Pendidikan Tinggi MARA, Kolej MARA Banting, JKKN Negeri Sembilan & YADIM)
 * - Garis Panduan Tatatertib & Pengurusan Kontinjen Kolej Profesional MARA Bandar Penawar (KPMBP)
 * - Prosedur Operasi Standard (SOP) Urus Setia & Penyelaras Kontinjen KPMBP
 * 
 * 8 ELEMEN PEMATUHAN RASMI:
 * 1. Event-specific competition rules
 * 2. Official document reference
 * 3. Document version
 * 4. Publication date
 * 5. Updated document status
 * 6. Official submission deadlines
 * 7. Event-specific requirements
 * 8. Relevant checklist items with explicit source document / operational requirement traceability
 */

import { 
  ReferenceCategory, 
  ReferenceClause, 
  StructuredReferenceSection,
  StructuredReferenceItem,
  TraceableChecklistItem,
  SubmissionDeadlineInfo,
  EventSpecificRequirements,
  ProvenanceSourceType
} from '../types';

export type { 
  ReferenceCategory, 
  ReferenceClause, 
  StructuredReferenceSection,
  StructuredReferenceItem,
  TraceableChecklistItem,
  SubmissionDeadlineInfo,
  EventSpecificRequirements,
  ProvenanceSourceType
};

export const STRUCTURED_COMPETITION_DOCUMENTS: StructuredReferenceSection[] = [
  // =========================================================================
  // 1. OFFICIAL ORGANIZER RULES (Syarat & Peraturan Rasmi Penganjur MARA)
  // =========================================================================
  {
    id: 'category-organizer-rules',
    category: 'official_organizer_rules',
    categoryLabel: 'Syarat Rasmi Penganjur',
    categoryEnglish: 'Official Organizer Rules',
    authoritySource: 'Bahagian Pendidikan Tinggi MARA (BPT) & Jawatankuasa Induk Festival SOAR IPMA 2026',
    documentRef: 'Buku Panduan Syarat & Peraturan Rasmi Festival SOAR IPMA 2026 (Ref: MARA.BPT.600-4/1/14 Jld.3)',
    documentVersion: 'Versi 2.4 (Edisi Kemas Kini Penyelarasan JKKN & YADIM)',
    publicationDate: '1 Ogos 2026',
    documentStatus: 'Rasmi & Berkuat Kuasa',
    description: 'Syarat rasmi, had kuota, format teknikal, ketetapan masa, dan dasar pematuhan yang dikeluarkan oleh penganjur festival (BPT MARA & KMB). Pematuhan adalah mandatori dan kegagalan mematuhi peraturan membawa implikasi pemotongan markah atau pembatalan penyertaan.',
    badgeColor: 'bg-rose-100 text-rose-900 border-rose-300',
    accentColor: 'rose',
    iconName: 'ShieldAlert',
    items: [
      {
        sectionId: 'org-gen-01',
        sectionTitle: 'Tadbir Urus Am Kontinjen & Kelayakan Institusi IPMA',
        targetEvent: 'Umum Kontinjen',
        targetRole: 'Semua Kontinjen',
        officialDocumentRef: 'Buku Panduan Festival SOAR IPMA 2026 — Fasal 1.0 (Tadbir Urus Am)',
        documentVersion: 'Versi 2.4',
        publicationDate: '1 Ogos 2026',
        documentStatus: 'Rasmi & Berkuat Kuasa',
        submissionDeadlines: [
          {
            item: 'Borang Pengesahan Penyertaan & Senarai 41 Pax',
            date: '10 September 2026',
            time: '11:59 Malam',
            submissionChannel: 'Portal Pendaftaran Rasmi BPT MARA / Emel Urus Setia KMB',
            penaltyIfLate: 'Penyertaan institusi tidak akan dimasukkan ke dalam buku program rasmi dan bilik penginapan tidak dijamin.'
          },
          {
            item: 'Pendaftaran Fizikal & Semakan Dokumen di KMB Banting',
            date: '15 Oktober 2026',
            time: '2:00 Petang - 5:00 Petang',
            submissionChannel: 'Kaunter Urus Setia Utama, Dewan Gemilang Kolej MARA Banting',
            penaltyIfLate: 'Kelewatan mendaftar boleh menjejaskan giliran taklimat pengurus dan undian giliran persembahan.'
          }
        ],
        eventRequirements: {
          quotaRule: 'Maksimum 41 orang: Tepat 35 Pelajar, 4 Pegawai Pengiring, dan 2 Pemandu Rasmi.',
          durationLimits: '15–18 Oktober 2026 (4 Hari 3 Malam)',
          stagingOrVenue: 'Kolej MARA Banting (Pusat Penginapan & Acara Muzik) & Auditorium JKKN Seremban (Pentas Teater)',
          syariahAttireRule: 'Etika pemakaian sopan dan patuh syariah sepanjang festival, mematuhi kod pakaian rasmi IPMA MARA.',
          disqualificationPenalties: [
            'Penyertaan pelajar bukan aktif IPMA MARA akan dibatalkan serta-merta.',
            'Bantahan terhadap keputusan panel juri profesional yang dilantik BPT MARA/JKKN/YADIM adalah dilarang dan keputusan juri adalah muktamad.'
          ]
        },
        clauses: [
          {
            id: 'org-c1',
            clauseNumber: 'Fasal 1.1',
            heading: 'Kuota Rasmi Kontinjen IPMA',
            text: 'Setiap institusi IPMA yang mengambil bahagian layak menghantar SATU (1) kontinjen rasmi dengan jumlah maksimum 41 orang (35 Pelajar bertanding, 4 Pegawai Pengiring, 2 Pemandu pengangkutan rasmi).',
            details: [
              '35 orang Pelajar peserta bertanding pelbagai acara',
              '4 orang Pegawai Pengiring / Pensyarah Penasihat',
              '2 orang Pemandu rasmi pengangkutan kontinjen kolej'
            ],
            mandatory: true,
            penaltyNote: 'Sebarang lebihan peserta tanpa kelulusan bertulis Jawatankuasa Induk tidak akan disediakan penginapan dan makan minum rasmi.',
            sourceType: 'official_organizer_rule',
            sourceDocument: 'Buku Panduan Festival SOAR IPMA 2026 — Fasal 1.1'
          },
          {
            id: 'org-c2',
            clauseNumber: 'Fasal 1.2',
            heading: 'Pengesahan Status Pelajar Aktif & Kelulusan Pengarah',
            text: 'Semua pelajar yang mewakili kontinjen mestilah berstatus pelajar aktif berdaftar di IPMA MARA dan mendapat pengesahan serta kelulusan bertulis daripada Pengarah Kolej masing-masing.',
            mandatory: true,
            sourceType: 'official_organizer_rule',
            sourceDocument: 'Buku Panduan Festival SOAR IPMA 2026 — Fasal 1.2'
          },
          {
            id: 'org-c3',
            clauseNumber: 'Fasal 1.3',
            heading: 'Keputusan Panel Penilai Profesional Adalah Muktamad',
            text: 'Penjurian dijalankan oleh barisan panel juri profesional bebas yang dilantik rasmi oleh BPT MARA, JKKN, dan YADIM. Keputusan panel penilai adalah MUKTAMAD dan sebarang bantahan atau rayuan terhadap markah tidak akan dilayan.',
            mandatory: true,
            sourceType: 'official_organizer_rule',
            sourceDocument: 'Buku Panduan Festival SOAR IPMA 2026 — Fasal 1.3'
          }
        ],
        checklistItems: [
          {
            id: 'chk-org-gen-1',
            taskText: 'Serahkan senarai nama lengkap 41 ahli kontinjen kepada penganjur BPT MARA sebelum tarikh tutup.',
            sourceType: 'official_organizer_rule',
            sourceDocument: 'Buku Panduan Festival SOAR IPMA 2026',
            sourceClause: 'Fasal 1.1 & 1.2',
            deadline: '10 September 2026',
            responsibleRole: 'Penyelaras Kontinjen / Urus Setia',
            mandatory: true
          },
          {
            id: 'chk-org-gen-2',
            taskText: 'Bawa salinan bercetak surat kelulusan Pengarah Kolej dan senarai MyKad pelajar ke kaunter pendaftaran KMB.',
            sourceType: 'official_organizer_rule',
            sourceDocument: 'Buku Panduan Festival SOAR IPMA 2026',
            sourceClause: 'Fasal 1.2',
            deadline: '15 Oktober 2026, 2:00 Petang',
            responsibleRole: 'Pegawai Pengiring',
            mandatory: true
          }
        ]
      },
      {
        sectionId: 'org-teater-02',
        sectionTitle: 'Peraturan Rasmi Acara: Teater Islamik (Masar Al-Masajid)',
        targetEvent: 'Teater Islamik',
        targetRole: 'Pasukan Teater KPMBP (15 Pax)',
        officialDocumentRef: 'Buku Syarat Pertandingan Teater Masar Al-Masajid SOAR 2026 — Fasal 3.0',
        documentVersion: 'Versi 2.4 (Pindaan Format Pentas JKKN)',
        publicationDate: '1 Ogos 2026',
        documentStatus: 'Rasmi & Berkuat Kuasa',
        submissionDeadlines: [
          {
            item: 'Penyerahan Skrip Penuh, Sinopsis & Senarai Pelakon/Krew (15 Pax)',
            date: '10 September 2026',
            time: '11:59 Malam',
            submissionChannel: 'Google Form Rasmi Jawatankuasa Teater SOAR 2026 (Format PDF)',
            penaltyIfLate: 'Pemotongan 5 markah daripada komponen Pengurusan & Dokumentasi Skrip.'
          },
          {
            item: 'Kemasukan Props Fizikal ke Ruang Menunggu Pentas',
            date: '15 Oktober 2026',
            time: '2:00 Petang - 5:00 Petang',
            submissionChannel: 'Pintu Punggah Props, Auditorium D’Sury JKKN Seremban',
            penaltyIfLate: 'Props yang lewat hanya dibenarkan dibawa masuk pada pagi acara dan tidak diuji semasa raptai teknikal.'
          }
        ],
        eventRequirements: {
          quotaRule: 'Maksimum 15 orang peserta (merangkumi pelakon utama, pelakon watak sampingan, dan krew teknikal pentas).',
          durationLimits: 'Tempoh lakonan 15–25 minit. Persiapan dan pembersihan pentas 15 minit (Jumlah keseluruhan: Tepat 40 minit).',
          technicalSpecifications: [
            'Elemen Lakonan: Wajib Utama.',
            'Elemen Tambahan Wajib: Minimum DUA (2) daripada [Qasidah, Nyanyian Kerohanian, Syair, Sajak, Ayat Al-Quran].',
            'Sistem Pencahayaan & Audio: Menggunakan sistem teknikal sedia ada Auditorium D’Sury JKKN Seremban.',
            'Format Audio Sandaran: Thumbdrive USB mengandungi trek WAV/MP3 320kbps.'
          ],
          stagingOrVenue: 'Auditorium D’Sury, Kompleks JKKN Seremban, Negeri Sembilan.',
          syariahAttireRule: 'Pakaian watak mestilah menutup aurat, bersesuaian dengan konsep sejarah masjid tamadun Islam dan mematuhi etika persembahan JKKN.',
          disqualificationPenalties: [
            'Kumpulan yang tidak mengikut ketetapan masa (kurang 15 minit atau melebihi 25 minit lakonan) akan dipotong markah teknikal secara automatik.',
            'Pementasan yang mengandungi elemen provokasi agama atau menyentuh sensitiviti 3R akan dibatalkan penyertaan.'
          ]
        },
        clauses: [
          {
            id: 'org-t1',
            clauseNumber: 'Fasal 3.1',
            heading: 'Kuota Peserta & Komposisi Produksi Teater',
            text: 'Penyertaan dihadkan kepada maksimum 15 orang peserta merangkumi pelakon utama, pelakon pembantu, dan krew teknikal produksi pentas.',
            mandatory: true,
            sourceType: 'official_organizer_rule',
            sourceDocument: 'Buku Syarat Pertandingan Teater Masar Al-Masajid — Fasal 3.1'
          },
          {
            id: 'org-t2',
            clauseNumber: 'Fasal 3.2',
            heading: 'Tema Rasmi Pementasan: Masar Al-Masajid',
            text: 'Pementasan wajib bertemakan "Teater Masar Al-Masajid", mengangkat kisah-kisah sejarah masjid-masjid terawal di seluruh dunia yang menonjolkan kesinambungan tamadun Islam serta pembentukan identiti ummah.',
            mandatory: true,
            sourceType: 'official_organizer_rule',
            sourceDocument: 'Buku Syarat Pertandingan Teater Masar Al-Masajid — Fasal 3.2'
          },
          {
            id: 'org-t3',
            clauseNumber: 'Fasal 3.3',
            heading: 'Elemen Persembahan Wajib & Minimum 2 Elemen Kerohanian Tambahan',
            text: 'Pementasan WAJIB mengandungi elemen Lakonan berserta MINIMUM DUA (2) Elemen Tambahan daripada senarai rasmi: Qasidah, Nyanyian Kerohanian, Syair, Sajak, atau Potongan Ayat Suci Al-Quran.',
            details: [
              'Lakonan (Utama) — MANDATORI',
              'Pilihan 1: Qasidah',
              'Pilihan 2: Nyanyian Kerohanian',
              'Pilihan 3: Syair',
              'Pilihan 4: Sajak',
              'Pilihan 5: Potongan Ayat Suci Al-Quran'
            ],
            mandatory: true,
            penaltyNote: 'Kumpulan yang mempersembahkan kurang daripada dua (2) elemen tambahan akan dipotong markah teknikal secara automatik.',
            sourceType: 'official_organizer_rule',
            sourceDocument: 'Buku Syarat Pertandingan Teater Masar Al-Masajid — Fasal 3.3'
          },
          {
            id: 'org-t4',
            clauseNumber: 'Fasal 3.4',
            heading: 'Ketetapan Masa Pementasan & Penalti Pemotongan Markah',
            text: 'Tempoh persembahan lakonan di atas pentas mestilah antara 15 hingga 25 minit. Masa persiapan pentas dan pembersihan adalah 15 minit (Jumlah keseluruhan masa di pentas: Tepat 40 minit).',
            mandatory: true,
            penaltyNote: 'Kumpulan yang tidak mengikut ketetapan masa (kurang 15 minit atau lebih 25 minit) akan dipotong markah pada rubrik Disiplin & Masa.',
            sourceType: 'official_organizer_rule',
            sourceDocument: 'Buku Syarat Pertandingan Teater Masar Al-Masajid — Fasal 3.4'
          }
        ],
        checklistItems: [
          {
            id: 'chk-org-tea-1',
            taskText: 'Hantar skrip penuh, sinopsis drama dan senarai 15 pelakon/krew dalam format PDF ke pautan Google Drive penganjur.',
            sourceType: 'official_organizer_rule',
            sourceDocument: 'Buku Syarat Pertandingan Teater Masar Al-Masajid',
            sourceClause: 'Fasal 3.5 (Penyerahan Dokumen)',
            deadline: '10 September 2026',
            responsibleRole: 'Lead Advisor Teater (Pn. Muzlinda)',
            mandatory: true
          },
          {
            id: 'chk-org-tea-2',
            taskText: 'Sahkan gabungan minimum 2 elemen tambahan kerohanian (Qasidah/Sajak/Syair/Quran) termaktub dalam skrip lakonan.',
            sourceType: 'official_organizer_rule',
            sourceDocument: 'Buku Syarat Pertandingan Teater Masar Al-Masajid',
            sourceClause: 'Fasal 3.3 (Elemen Wajib)',
            responsibleRole: 'Pengarah Teater Pelajar & Lead Advisor',
            mandatory: true
          },
          {
            id: 'chk-org-tea-3',
            taskText: 'Pastikan "run-through" lakonan pentas berada dalam julat masa selamat 18–22 minit (tidak kurang 15 dan tidak lebih 25 minit).',
            sourceType: 'official_organizer_rule',
            sourceDocument: 'Buku Syarat Pertandingan Teater Masar Al-Masajid',
            sourceClause: 'Fasal 3.4 (Had Masa)',
            responsibleRole: 'Pengurus Pentas Teater KPMBP',
            mandatory: true
          }
        ]
      },
      {
        sectionId: 'org-dakwah-03',
        sectionTitle: 'Peraturan Rasmi Acara: Street Dakwah (Short Film Video)',
        targetEvent: 'Street Dakwah',
        targetRole: 'Pasukan Street Dakwah (5 Pax)',
        officialDocumentRef: 'Buku Syarat Pertandingan Street Dakwah SOAR 2026 — Fasal 5.0',
        documentVersion: 'Versi 2.4 (Klausa AI Kemas Kini YADIM)',
        publicationDate: '1 Ogos 2026',
        documentStatus: 'Rasmi & Berkuat Kuasa',
        submissionDeadlines: [
          {
            item: 'Penyerahan Senarai Nama 5 Peserta & No Kad Pelajar',
            date: '10 September 2026',
            time: '11:59 Malam',
            submissionChannel: 'Portal Pendaftaran SOAR 2026',
            penaltyIfLate: 'Penyertaan video tidak akan diindeks untuk penjurian awal.'
          },
          {
            item: 'Penyerahan Video Penuh Resolusi Full HD 1080p',
            date: '1 Oktober 2026',
            time: 'Tepat Jam 5:00 Petang (Ketat)',
            submissionChannel: 'Pautan Rasmi Google Drive / Cloud Penganjur',
            penaltyIfLate: 'Pautan penghantaran ditutup jam 5:00 petang. Karya yang dihantar selepas waktu ini TIDAK AKAN DITERIMA untuk diadili.'
          }
        ],
        eventRequirements: {
          quotaRule: 'Maksimum 5 orang pelajar bagi setiap produksi video Street Dakwah.',
          durationLimits: 'Tempoh video antara 5 hingga 7 minit termasuk montaj pembukaan dan kredit akhir.',
          technicalSpecifications: [
            'Resolusi Wajib: Full HD 1080p (1920x1080) format MP4 (Codec H.264 / AAC).',
            'Tiga Elemen Mandatori: (1) Lokasi penggambaran di tempat awam/luar kolej, (2) Melibatkan minimum 3 responden umum, (3) Disertakan dalil Al-Quran / Hadith sahih bertulis.',
            'Sarikata: Dwi-bahasa (Bahasa Melayu & Bahasa Inggeris) disyorkan untuk kefahaman umum.'
          ],
          stagingOrVenue: 'Kolej MARA Banting (Tayangan & Penilaian Penjuri)',
          aiPolicyRule: 'LARANGAN KERAS: Kandungan generatif AI TIDAK DIBENARKAN untuk menjana skrip, watak, babak video, atau suara sintetik. Hanya dibenarkan bagi penstabilan video dan pengurangan hingar audio teknikal.',
          disqualificationPenalties: [
            'Penyertaan yang menggunakan janaan video atau skrip berasaskan Generative AI akan DIBATALKAN (DISQUALIFIED) serta-merta tanpa rayuan.',
            'Video yang lewat dihantar selepas jam 5:00 petang pada 1 Oktober 2026 tidak akan diadili.'
          ]
        },
        clauses: [
          {
            id: 'org-d1',
            clauseNumber: 'Fasal 5.1',
            heading: 'Tema Rasmi: “From Chaos to Calm”',
            text: 'Tema rasmi ialah "From Chaos to Calm" (Dari Kekacauan kepada Ketenangan) – menggambarkan perjalanan transformasi jiwa daripada keadaan kekeliruan, konflik, dan tekanan kepada ketenangan hidup yang berpaksi kepada petunjuk Ilahi.',
            mandatory: true,
            sourceType: 'official_organizer_rule',
            sourceDocument: 'Buku Syarat Pertandingan Street Dakwah — Fasal 5.1'
          },
          {
            id: 'org-d2',
            clauseNumber: 'Fasal 5.2',
            heading: 'Tiga (3) Elemen Mandatori Karya Video Dakwah',
            text: 'Karya video Street Dakwah WAJIB memenuhi 3 syarat utama: (1) Lokasi rakaman di tempat awam luar kolej, (2) Minimum 3 responden daripada masyarakat awam, dan (3) Teks dalil Al-Quran atau Hadith sahih sebagai panduan mesej.',
            mandatory: true,
            penaltyNote: 'Kegagalan mematuhi mana-mana daripada 3 elemen wajib ini akan mengakibatkan kehilangan markah secara signifikan.',
            sourceType: 'official_organizer_rule',
            sourceDocument: 'Buku Syarat Pertandingan Street Dakwah — Fasal 5.2'
          },
          {
            id: 'org-d3',
            clauseNumber: 'Fasal 5.3',
            heading: 'POLISI KETAT LARANGAN KECERDASAN BUATAN GENERATIF (AI POLICY)',
            text: 'Kandungan generatif AI TIDAK DIBENARKAN SAMA SEKALI untuk menghasilkan skrip, naratif, watak janaan komputer, babak video, mahupun suara sintetik AI. Penggunaan AI hanya dibenarkan secara teknikal terhad untuk video stabilization dan noise reduction.',
            details: [
              'DILARANG: AI Video Generator (Sora, Runway, Pika, Kling, Luma) untuk visual penceritaan',
              'DILARANG: AI Voice Clone / TTS Sintetik bagi watak atau narasi dakwah',
              'DILARANG: Penjanaan skrip dakwah automatik sepenuhnya oleh AI tanpa sentuhan asli pelajar',
              'DIBENARKAN HANYA: Penstabilan rakaman video (video stabilization) & penapisan hingar audio (noise gate/suppression)'
            ],
            mandatory: true,
            penaltyNote: 'Penyertaan yang melanggar dasar AI generatif akan DIBATALKAN (DISQUALIFIED) serta-merta tanpa kompromi.',
            sourceType: 'official_organizer_rule',
            sourceDocument: 'Buku Syarat Pertandingan Street Dakwah — Fasal 5.3'
          }
        ],
        checklistItems: [
          {
            id: 'chk-org-dak-1',
            taskText: 'Daftarkan nama 5 peserta Street Dakwah dan nombor matrik kolej sebelum 10 September 2026.',
            sourceType: 'official_organizer_rule',
            sourceDocument: 'Buku Syarat Pertandingan Street Dakwah',
            sourceClause: 'Fasal 5.4 (Tarikh 1)',
            deadline: '10 September 2026',
            responsibleRole: 'Lead Advisor Dakwah (Pn. Halimatul)',
            mandatory: true
          },
          {
            id: 'chk-org-dak-2',
            taskText: 'Pastikan rakaman melibatkan temu bual minimum 3 responden masyarakat awam di luar perkarangan kolej.',
            sourceType: 'official_organizer_rule',
            sourceDocument: 'Buku Syarat Pertandingan Street Dakwah',
            sourceClause: 'Fasal 5.2 (Syarat Lokasi & Responden)',
            responsibleRole: 'Krew Penggambaran Pelajar',
            mandatory: true
          },
          {
            id: 'chk-org-dak-3',
            taskText: 'Audit kandungan video untuk memastikan sifar unsur generatif AI (visual/skrip/suara) sebelum serahan akhir.',
            sourceType: 'official_organizer_rule',
            sourceDocument: 'Buku Syarat Pertandingan Street Dakwah',
            sourceClause: 'Fasal 5.3 (AI Strict Prohibition)',
            deadline: 'Sebelum 1 Oktober 2026',
            responsibleRole: 'Lead Advisor Dakwah & Editor Video',
            mandatory: true
          },
          {
            id: 'chk-org-dak-4',
            taskText: 'Muat naik fail video Full HD 1080p MP4 ke pautan penganjur dan sahkan penerimaan sebelum jam 5:00 petang.',
            sourceType: 'official_organizer_rule',
            sourceDocument: 'Buku Syarat Pertandingan Street Dakwah',
            sourceClause: 'Fasal 5.4 (Tarikh 2 Penyerahan Akhir)',
            deadline: '1 Oktober 2026, Jam 5:00 Petang Tepat',
            responsibleRole: 'Lead Advisor & Urus Setia',
            mandatory: true
          }
        ]
      },
      {
        sectionId: 'org-muzik-04',
        sectionTitle: 'Peraturan Rasmi Acara: Muzik (Symphonic Duo & Battle of the Band)',
        targetEvent: 'Muzik (Duo & BOTB)',
        targetRole: 'Pasukan Muzik Kontinjen',
        officialDocumentRef: 'Buku Syarat Pertandingan Muzik SOAR IPMA 2026 — Fasal 4.0 & 6.0',
        documentVersion: 'Versi 2.4',
        publicationDate: '1 Ogos 2026',
        documentStatus: 'Rasmi & Berkuat Kuasa',
        submissionDeadlines: [
          {
            item: 'Penyerahan Tajuk Lagu, Lirik & Susunan Instrumen',
            date: '10 September 2026',
            time: '11:59 Malam',
            submissionChannel: 'Borang Teknikal Muzik SOAR 2026',
            penaltyIfLate: 'Kelewatan menyukarkan penyelarasan juruaudio pentas Kolej MARA Banting.'
          },
          {
            item: 'Sesi Sound Check & Penalaan Alatan di Dewan Gemilang KMB',
            date: '16 Oktober 2026',
            time: '8:30 Pagi - 12:00 Tengah Hari',
            submissionChannel: 'Pentas Dewan Gemilang KMB',
            penaltyIfLate: 'Band yang terlepas sesi sound check hanya dibenarkan "line check" ringkas 3 minit sebelum giliran.'
          }
        ],
        eventRequirements: {
          quotaRule: 'Symphonic Duo: Tepat 2 orang peserta. Battle of the Band (BOTB): Maksimum 7 orang peserta.',
          durationLimits: 'Duo: 5–7 minit persembahan. BOTB: Maksimum 12 minit untuk dua cabaran lagu.',
          technicalSpecifications: [
            'Symphonic Duo: Bertemakan "A Symphony of Two". Instrumen akustik dan vokal harmoni.',
            'BOTB Cabaran 1: Rock Malaya (Karya rock klasik Malaysia era 80-an hingga 90-an).',
            'BOTB Cabaran 2: A Global Sonic Journey (Karya antarabangsa mengikut negara undian taklimat teknikal).',
            'Penganjur menyediakan drum kit standard dan amplifier asas; pemuzik membawa instrumen peribadi & pedal kesan bunyi.'
          ],
          stagingOrVenue: 'Dewan Gemilang Kolej MARA Banting',
          syariahAttireRule: 'Pakaian pentas kemas, sopan, bersesuaian dengan imej pelajar MARA, bebas daripada simbolisme kesat atau negatif.',
          disqualificationPenalties: [
            'Lirik lagu yang mengandungi kata-kata lucah, maki hamun, atau provokasi moral dilarang dan akan dibatalkan.'
          ]
        },
        clauses: [
          {
            id: 'org-m1',
            clauseNumber: 'Fasal 4.1',
            heading: 'Symphonic Duo: Kuota 2 Orang & Keselarasan Harmoni',
            text: 'Penyertaan Symphonic Duo dihadkan kepada tepat DUA (2) orang peserta. Persembahan dinilai atas keharmonian vokal, dinamik akustik, dan kesepaduan persembahan pentas.',
            mandatory: true,
            sourceType: 'official_organizer_rule',
            sourceDocument: 'Buku Syarat Pertandingan Muzik SOAR 2026 — Fasal 4.1'
          },
          {
            id: 'org-m2',
            clauseNumber: 'Fasal 6.1',
            heading: 'Battle of the Band: Kuota 7 Pax & Dua Cabaran Wajib',
            text: 'Kumpulan band dihadkan kepada maksimum TUJUH (7) orang peserta. Setiap band wajib mempersembahkan DUA (2) cabaran lagu: Cabaran 1 (Hits Rock Malaya 80/90-an) dan Cabaran 2 (Global Sonic Journey).',
            mandatory: true,
            sourceType: 'official_organizer_rule',
            sourceDocument: 'Buku Syarat Pertandingan Muzik SOAR 2026 — Fasal 6.1'
          }
        ],
        checklistItems: [
          {
            id: 'chk-org-muz-1',
            taskText: 'Hantar senarai tajuk lagu dan salinan lirik kedua-dua cabaran lagu BOTB dan Duo sebelum tarikh akhir.',
            sourceType: 'official_organizer_rule',
            sourceDocument: 'Buku Syarat Pertandingan Muzik SOAR 2026',
            sourceClause: 'Fasal 4.2 & 6.2 (Pengesahan Repertoire)',
            deadline: '10 September 2026',
            responsibleRole: 'Lead Advisor Muzik (En. Khairi & En. Syafiq)',
            mandatory: true
          },
          {
            id: 'chk-org-muz-2',
            taskText: 'Hadir ke sesi sound check rasmi di Dewan Gemilang KMB tepat mengikut jadual giliran penganjur.',
            sourceType: 'official_organizer_rule',
            sourceDocument: 'Buku Syarat Pertandingan Muzik SOAR 2026',
            sourceClause: 'Fasal 6.4 (Sound Check Pentas)',
            deadline: '16 Oktober 2026, 8:30 Pagi',
            responsibleRole: 'Pengurus Pasukan Muzik KPMBP',
            mandatory: true
          }
        ]
      },
      {
        sectionId: 'org-zapin-05',
        sectionTitle: 'Peraturan Rasmi Acara: Tarian Zapin Tradisional',
        targetEvent: 'Tarian Zapin',
        targetRole: 'Pasukan Zapin KPMBP (6 Penari)',
        officialDocumentRef: 'Buku Syarat Pertandingan Tarian Zapin SOAR IPMA 2026 — Fasal 7.0',
        documentVersion: 'Versi 2.4',
        publicationDate: '1 Ogos 2026',
        documentStatus: 'Rasmi & Berkuat Kuasa',
        submissionDeadlines: [
          {
            item: 'Penyerahan Sinopsis Tarian, Nama 6 Penari & Fail Audio Master',
            date: '10 September 2026',
            time: '11:59 Malam',
            submissionChannel: 'Portal Rasmi Kebudayaan SOAR 2026',
            penaltyIfLate: 'Sinopsis tarian tidak akan dimasukkan ke dalam risalah penjurian JKKN.'
          },
          {
            item: 'Serahan Thumbdrive Fizikal Trek Lagu di Kaunter Pendaftaran',
            date: '15 Oktober 2026',
            time: 'Semasa Pendaftaran Kontinjen',
            submissionChannel: 'Kaunter Pendaftaran Teknikal Muzik KMB',
            penaltyIfLate: 'Penggunaan fail audio sandaran kecemasan penganjur.'
          }
        ],
        eventRequirements: {
          quotaRule: 'Maksimum ENAM (6) orang penari bagi setiap institusi.',
          durationLimits: 'Tempoh persembahan antara 5 hingga 7 minit.',
          technicalSpecifications: [
            'Ragam Zapin: Ragam zapin asli Melayu Johor/Nusantara mestilah terpelihara.',
            'Format Audio: WAV atau MP3 bitrate 320kbps tanpa vokal penyanyi latar secara langsung.',
            'Formasi: Pergerakan pentas kreatif beradab sopan tanpa aksi akrobatik berbahaya.'
          ],
          stagingOrVenue: 'Dewan Gemilang Kolej MARA Banting',
          syariahAttireRule: 'Busana tarian Melayu lengkap bertutup sopan mengikut etika syariah (baju melayu/kurung songket, samping labuh melepasi lutut, tanjak/tudung kemas).',
          disqualificationPenalties: [
            'Pemotongan markah busana sekiranya pakaian mendedahkan aurat atau ketat melanggar kod kesopanan IPMA.'
          ]
        },
        clauses: [
          {
            id: 'org-z1',
            clauseNumber: 'Fasal 7.1',
            heading: 'Kuota Rasmi 6 Penari Zapin',
            text: 'Penyertaan dibuka kepada ENAM (6) orang penari. Ragam zapin asli Melayu hendaklah dikekalkan sebagai teras tarian.',
            mandatory: true,
            sourceType: 'official_organizer_rule',
            sourceDocument: 'Buku Syarat Pertandingan Tarian Zapin — Fasal 7.1'
          },
          {
            id: 'org-z2',
            clauseNumber: 'Fasal 7.3',
            heading: 'Etika Busana Patuh Syariah IPMA',
            text: 'Busana tarian mestilah lengkap, sopan, menutup aurat, dan menepati tatasusila kebudayaan Melayu-Islam.',
            mandatory: true,
            sourceType: 'official_organizer_rule',
            sourceDocument: 'Buku Syarat Pertandingan Tarian Zapin — Fasal 7.3'
          }
        ],
        checklistItems: [
          {
            id: 'chk-org-zap-1',
            taskText: 'Hantar nama 6 penari zapin, sinopsis tarian dan salinan fail lagu berkualiti master sebelum 10 September.',
            sourceType: 'official_organizer_rule',
            sourceDocument: 'Buku Syarat Pertandingan Tarian Zapin',
            sourceClause: 'Fasal 7.2 & 7.4',
            deadline: '10 September 2026',
            responsibleRole: 'Lead Advisor Zapin (Pn. Saba)',
            mandatory: true
          },
          {
            id: 'chk-org-zap-2',
            taskText: 'Pastikan busana tarian dan aksesori songket mematuhi kod etika pakaian syariah IPMA sebelum sesi raptai.',
            sourceType: 'official_organizer_rule',
            sourceDocument: 'Buku Syarat Pertandingan Tarian Zapin',
            sourceClause: 'Fasal 7.3',
            responsibleRole: 'Pengurus Busana Zapin KPMBP',
            mandatory: true
          }
        ]
      }
    ]
  },

  // =========================================================================
  // 2. CONTINGENT INTERNAL GUIDELINES (Garis Panduan Dalaman Kontinjen KPMBP)
  // =========================================================================
  {
    id: 'category-contingent-guidelines',
    category: 'contingent_internal_guidelines',
    categoryLabel: 'Garis Panduan Dalaman Kontinjen',
    categoryEnglish: 'Contingent Internal Guidelines',
    authoritySource: 'Pengurusan Kolej & Jawatankuasa Induk Kontinjen KPM Bandar Penawar',
    documentRef: 'Buku Panduan Tatatertib, Sahsiah & Pengurusan Kontinjen KPMBP SOAR 2026 (Ref: KPMBP/HEP/KONTINJEN/2026/02)',
    documentVersion: 'Versi 3.1 (Edisi Khas Pengurusan Kontinjen)',
    publicationDate: '15 Ogos 2026',
    documentStatus: 'Rasmi & Berkuat Kuasa',
    description: 'Dasar dalaman kolej mengenai kod etika sahsiah, disiplin masa, pakaian korporat, curfew asrama, dan tatacara keselamatan warga kontinjen KPMBP.',
    badgeColor: 'bg-blue-100 text-blue-900 border-blue-300',
    accentColor: 'blue',
    iconName: 'ShieldCheck',
    items: [
      {
        sectionId: 'kpmbp-etika-01',
        sectionTitle: 'Kod Etika Busana, Sahsiah & Kebajikan Kontinjen KPMBP',
        targetEvent: 'Semua Acara',
        targetRole: 'Semua 35 Pelajar & 4 Pegawai',
        officialDocumentRef: 'Buku Sahsiah & Disiplin Pelajar KPMBP — Bab 4 (Kontinjen Luar Kampus)',
        documentVersion: 'Versi 3.1',
        publicationDate: '15 Ogos 2026',
        documentStatus: 'Rasmi & Berkuat Kuasa',
        submissionDeadlines: [
          {
            item: 'Penyerahan Surat Kebenaran Waris & Deklarasi Kesihatan',
            date: '1 Oktober 2026',
            time: '5:00 Petang',
            submissionChannel: 'Unit Hal Ehwal Pelajar (HEP) KPM Bandar Penawar',
            penaltyIfLate: 'Pelajar tidak dibenarkan menaiki bas kontinjen tanpa surat akuan waris yang lengkap.'
          }
        ],
        eventRequirements: {
          quotaRule: '41 orang warga KPMBP (35 pelajar terpilih, 4 pensyarah pengiring, 2 pemandu bas).',
          syariahAttireRule: 'Wajib memakai Baju Rasmi Kontinjen KPMBP semasa majlis rasmi. Kasut bertutup penuh hitam dan berstoking gelap sepanjang masa di dewan/pentas.',
          disqualificationPenalties: [
            'Pelanggaran disiplin berat (ingkar arahan pengiring / keluar malam tanpa izin) akan dirujuk ke Jawatankuasa Tatatertib Kolej.'
          ]
        },
        clauses: [
          {
            id: 'kpmbp-e1',
            clauseNumber: 'Kod 1.1',
            heading: 'Pakaian Rasmi Majlis Pembukaan & Penutupan',
            text: 'Semua ahli kontinjen WAJIB memakai Baju Rasmi Kontinjen KPMBP / Baju Korporat KPM lengkap berseluar slack gelap bagi lelaki dan baju kurung korporat bagi wanita semasa Majlis Pembukaan dan Penutupan.',
            mandatory: true,
            sourceType: 'internal_operational_requirement',
            sourceDocument: 'Garis Panduan Dalaman Kontinjen KPMBP — Kod 1.1'
          },
          {
            id: 'kpmbp-e2',
            clauseNumber: 'Kod 1.2',
            heading: 'Kasut Bertutup Penuh & Kekemasan Diri',
            text: 'Kasut bertutup hitam dan berstoking gelap adalah mandatori. Selipar hanya dibenarkan di dalam bilik penginapan asrama.',
            mandatory: true,
            sourceType: 'internal_operational_requirement',
            sourceDocument: 'Garis Panduan Dalaman Kontinjen KPMBP — Kod 1.2'
          },
          {
            id: 'kpmbp-e3',
            clauseNumber: 'Kod 2.1',
            heading: 'Waktu Panggilan Balik (Curfew) Jam 11:00 Malam',
            text: 'Semua pelajar kontinjen KPMBP wajib berada di bilik penginapan asrama masing-masing selewat-lewatnya jam 11:00 malam setiap hari sepanjang tempoh 15–18 Oktober 2026.',
            mandatory: true,
            sourceType: 'internal_operational_requirement',
            sourceDocument: 'Garis Panduan Dalaman Kontinjen KPMBP — Kod 2.1'
          }
        ],
        checklistItems: [
          {
            id: 'chk-int-etik-1',
            taskText: 'Pastikan setiap pelajar memiliki 2 helai Baju Rasmi Kontinjen KPMBP dan sepasang kasut bertutup hitam.',
            sourceType: 'internal_operational_requirement',
            sourceDocument: 'Garis Panduan Dalaman Kontinjen KPMBP',
            sourceClause: 'Kod 1.1 & 1.2 (Etika Pakaian)',
            deadline: '5 Oktober 2026',
            responsibleRole: 'Pegawai Pengiring & Pelajar',
            mandatory: true
          },
          {
            id: 'chk-int-etik-2',
            taskText: 'Laksanakan semakan kehadiran (roll-call) harian jam 10:30 malam di blok asrama Kolej MARA Banting.',
            sourceType: 'internal_operational_requirement',
            sourceDocument: 'Garis Panduan Dalaman Kontinjen KPMBP',
            sourceClause: 'Kod 2.1 (Kawalan Curfew)',
            responsibleRole: 'Ketua Kontinjen Pelajar & Pegawai Pengiring',
            mandatory: true
          }
        ]
      }
    ]
  },

  // =========================================================================
  // 3. ADMIN OPERATIONAL INSTRUCTIONS (Arahan Operasi Urus Setia & Penyelaras)
  // =========================================================================
  {
    id: 'category-admin-instructions',
    category: 'admin_operational_instructions',
    categoryLabel: 'Arahan Operasi Urus Setia',
    categoryEnglish: 'Admin Operational Instructions',
    authoritySource: 'Urus Setia Operasi, Penyelaras Kontinjen & Pegawai Pengiring KPMBP',
    documentRef: 'Manual Standard Operating Procedure (SOP) Pengurusan Kontinjen SOAR KPMBP (Ref: SOP-KONTINJEN-V4.5)',
    documentVersion: 'Versi 4.5 (SES Framework)',
    publicationDate: '20 Ogos 2026',
    documentStatus: 'Operasi Aktif',
    description: 'Prosedur operasi standard (SOP) pengurusan fasa sistem SES, verifikasi rekod, koordinasi dua buah bas rasmi, protokol penamaan fail digital, dan tindakan kecemasan perubatan.',
    badgeColor: 'bg-emerald-100 text-emerald-900 border-emerald-300',
    accentColor: 'emerald',
    iconName: 'ClipboardList',
    items: [
      {
        sectionId: 'adm-fasa-01',
        sectionTitle: 'Pengurusan Fasa Operasi SES v4.5 & Penyelarasan Sistem',
        targetEvent: 'Semua Acara',
        targetRole: 'Penyelaras & Urus Setia Admin',
        officialDocumentRef: 'Manual Operasi SES v4.5 KPMBP — Bahagian 1 (Sistem Berfasa)',
        documentVersion: 'Versi 4.5',
        publicationDate: '20 Ogos 2026',
        documentStatus: 'Operasi Aktif',
        submissionDeadlines: [
          {
            item: 'Peralihan Fasa Sistem: Phase 03 ke Phase 04 (Mobilisasi Kontinjen)',
            date: '14 Oktober 2026',
            time: '12:00 Tengah Hari',
            submissionChannel: 'Konsol Kawalan Fasa Admin Portal',
            penaltyIfLate: 'Kelewatan mengaktifkan fasa menyebabkan dashboard ahli tidak memaparkan logistik pelepasan bas.'
          }
        ],
        eventRequirements: {
          quotaRule: 'Pengurusan aliran maklumat bagi 41 orang kontinjen KPMBP.',
          technicalSpecifications: [
            'Format penamaan fail standard: KPMBP_[ACARA]_[DOKUMEN]_[TAHUN].ext',
            'Dua set sandaran fizikal (thumbdrive 64GB) disediakan oleh urus setia kolej.'
          ]
        },
        clauses: [
          {
            id: 'adm-p1',
            clauseNumber: 'SOP 1.1',
            heading: 'Kawalan Berpusat Penukaran Fasa Operasi',
            text: 'Penukaran Fasa Operasi (Phase 01 hingga Phase 06) diuruskan secara rasmi oleh Penyelaras Kontinjen melalui Pusat Operasi Admin dan disegerakkan secara masa nyata ke Firestore.',
            mandatory: true,
            sourceType: 'internal_operational_requirement',
            sourceDocument: 'Manual Operasi SES v4.5 — SOP 1.1'
          },
          {
            id: 'adm-p2',
            clauseNumber: 'SOP 3.1',
            heading: 'Pelepasan 2 Buah Bas Rasmi (No. Plat JTC 4811 & JTD 2045)',
            text: 'Dua buah bas bertolak dari perkarangan KPM Bandar Penawar pada jam 7:30 pagi, 15 Oktober 2026. Pemeriksaan kehadiran dan muatan props pentas dijalankan jam 6:45 pagi.',
            mandatory: true,
            sourceType: 'internal_operational_requirement',
            sourceDocument: 'Manual Operasi SES v4.5 — SOP 3.1'
          },
          {
            id: 'adm-p3',
            clauseNumber: 'SOP 4.1',
            heading: 'Format Penamaan Fail Rasmi Kontinjen',
            text: 'Semua fail yang dimuat naik wajib mematuhi skema penamaan rasmi: KPMBP_[ACARA]_[JENIS_DOKUMEN]_[TAHUN]. Contoh: KPMBP_TEATER_SKRIP_2026.pdf dan KPMBP_STREETDAKWAH_VIDEO_2026.mp4.',
            mandatory: true,
            sourceType: 'internal_operational_requirement',
            sourceDocument: 'Manual Operasi SES v4.5 — SOP 4.1'
          }
        ],
        checklistItems: [
          {
            id: 'chk-adm-ops-1',
            taskText: 'Laksanakan audit surat kebenaran ibu bapa dan rekod MyKad 35 orang pelajar sebelum tarikh pelepasan.',
            sourceType: 'internal_operational_requirement',
            sourceDocument: 'Manual Operasi SES v4.5',
            sourceClause: 'SOP 2.1 (Verifikasi Rekod)',
            deadline: '12 Oktober 2026',
            responsibleRole: 'Pegawai Pengiring Kebajikan',
            mandatory: true
          },
          {
            id: 'chk-adm-ops-2',
            taskText: 'Sediakan dua unit pemacu USB 64GB mengandungi salinan penuh trek lagu zapin, video dakwah, dan skrip teater.',
            sourceType: 'internal_operational_requirement',
            sourceDocument: 'Manual Operasi SES v4.5',
            sourceClause: 'SOP 4.2 (Sandaran Luar Talian)',
            deadline: '14 Oktober 2026',
            responsibleRole: 'Pegawai Teknologi Maklumat / Urus Setia',
            mandatory: true
          },
          {
            id: 'chk-adm-ops-3',
            taskText: 'Selaraskan jadual pergerakan Bas No. 1 membawa 15 peserta teater dari KMB ke Kompleks JKKN Seremban jam 6:30 pagi (17 Okt).',
            sourceType: 'internal_operational_requirement',
            sourceDocument: 'Manual Operasi SES v4.5',
            sourceClause: 'SOP 3.2 (Logistik Transit Seremban)',
            deadline: '16 Oktober 2026',
            responsibleRole: 'Pemandu Bas & Pegawai Logistik',
            mandatory: true
          }
        ]
      }
    ]
  },

  // =========================================================================
  // 4. EVENT PREPARATION TASKS (Tugasan Persediaan Acara Mengikut Pasukan)
  // =========================================================================
  {
    id: 'category-preparation-tasks',
    category: 'event_preparation_tasks',
    categoryLabel: 'Tugasan Persediaan Acara',
    categoryEnglish: 'Event Preparation Tasks',
    authoritySource: 'Ketua Pensyarah Penasihat (Lead Advisors) & PIC Acara Kontinjen KPMBP',
    documentRef: 'Pelan Tindakan Persediaan & Latihan Acara KPMBP SOAR 2026 (Ref: KPMBP/SOAR-LATIHAN/2026)',
    documentVersion: 'Versi 2.1 (Kemas Kini Jadual Raptai Fasa 3)',
    publicationDate: '25 Ogos 2026',
    documentStatus: 'Operasi Aktif',
    description: 'Tugasan teknikal, latihan intensif, pemantapan rubrik penjurian, dan penyerahan bahan yang mesti diselesaikan oleh setiap pasukan acara bersama penasihat.',
    badgeColor: 'bg-purple-100 text-purple-900 border-purple-300',
    accentColor: 'purple',
    iconName: 'Target',
    items: [
      {
        sectionId: 'task-teater-01',
        sectionTitle: 'Pelan Persediaan: Teater Islamik (Lead: Pn. Muzlinda)',
        targetEvent: 'Teater Islamik',
        targetRole: 'Pasukan Teater KPMBP (15 Pax)',
        officialDocumentRef: 'Pelan Tindakan Teater Masar Al-Masajid KPMBP — Siri Latihan Pentas',
        documentVersion: 'Versi 2.1',
        publicationDate: '25 Ogos 2026',
        documentStatus: 'Operasi Aktif',
        submissionDeadlines: [
          {
            item: 'Penyerahan Skrip Lengkap & Senarai Props ke Urus Setia',
            date: '10 September 2026',
            time: '11:59 Malam',
            submissionChannel: 'Portal Penganjur MARA / Penyelaras Kontinjen',
            penaltyIfLate: 'Pemotongan markah pengurusan skrip rasmi.'
          }
        ],
        eventRequirements: {
          quotaRule: '15 orang peserta produksi.',
          durationLimits: "15-25 minit lakonan (Jumlah 40 minit di pentas Auditorium D'Sury).",
          technicalSpecifications: [
            'Elemen Lakonan Utama.',
            'Minimum 2 Elemen Tambahan Kerohanian (Qasidah & Sajak/Syair).',
            'Props mudah tanggal dalam 15 minit tanpa calar pentas.'
          ]
        },
        clauses: [
          {
            id: 'tsk-t1',
            clauseNumber: 'Tugasan T.1',
            heading: 'Pemuktamadan Skrip & Pembahagian Watak',
            text: 'Menyempurnakan penulisan skrip penuh berkonsepkan Masjid terawal di dunia Islam, semakan fakta sejarah, dan melengkapkan senarai 15 peserta.',
            mandatory: true,
            sourceType: 'official_organizer_rule',
            sourceDocument: 'Buku Syarat Pertandingan Teater Masar Al-Masajid — Fasal 3.2 & 3.5'
          },
          {
            id: 'tsk-t2',
            clauseNumber: 'Tugasan T.2',
            heading: 'Latihan Simulasi Masa Pementasan (Dry-Run 40 Minit)',
            text: 'Menjalankan latihan simulasi masa pementasan: 15–25 minit lakonan dan 15 minit pasang/kemas props bagi mengelakkan penalti pemotongan markah.',
            mandatory: true,
            sourceType: 'official_organizer_rule',
            sourceDocument: 'Buku Syarat Pertandingan Teater Masar Al-Masajid — Fasal 3.4'
          }
        ],
        checklistItems: [
          {
            id: 'chk-tsk-tea-1',
            taskText: 'Sahkan skrip mematuhi tema sejarah masjid dan mengandungi sekurang-kurangnya 2 elemen kerohanian tambahan.',
            sourceType: 'official_organizer_rule',
            sourceDocument: 'Buku Syarat Pertandingan Teater Masar Al-Masajid',
            sourceClause: 'Fasal 3.2 & 3.3',
            deadline: '5 September 2026',
            responsibleRole: 'Lead Advisor Teater (Pn. Muzlinda)',
            mandatory: true
          },
          {
            id: 'chk-tsk-tea-2',
            taskText: 'Uji masa pemasangan dan penurunan prop pentas agar selesai dalam tempoh kurang daripada 15 minit.',
            sourceType: 'internal_operational_requirement',
            sourceDocument: 'Pelan Tindakan Teater Masar Al-Masajid KPMBP',
            sourceClause: 'Tugasan T.3 (Pengurusan Pentas)',
            responsibleRole: 'Krew Teknikal Pentas Teater',
            mandatory: true
          }
        ]
      },
      {
        sectionId: 'task-dakwah-02',
        sectionTitle: 'Pelan Persediaan: Street Dakwah (Lead: Pn. Halimatul)',
        targetEvent: 'Street Dakwah',
        targetRole: 'Pasukan Street Dakwah (5 Pax)',
        officialDocumentRef: 'Pelan Tindakan Produksi Video Dakwah KPMBP',
        documentVersion: 'Versi 2.1',
        publicationDate: '25 Ogos 2026',
        documentStatus: 'Operasi Aktif',
        submissionDeadlines: [
          {
            item: 'Tarikh Tutup Penghantaran Video Full HD 1080p MP4',
            date: '1 Oktober 2026',
            time: '5:00 Petang (Ketetapan Mutlak)',
            submissionChannel: 'Pautan Cloud Penganjur SOAR 2026',
            penaltyIfLate: 'Sistem penganjur ditutup tepat 5:00 petang dan video tidak diadili.'
          }
        ],
        clauses: [
          {
            id: 'tsk-d1',
            clauseNumber: 'Tugasan D.1',
            heading: 'Rakaman Luar Kampus & Temu Bual 3 Responden Awam',
            text: 'Menjalankan rakaman video di kawasan awam, menemu bual minimum 3 responden berbeza dengan pendekatan empati bertemakan "From Chaos to Calm".',
            mandatory: true,
            sourceType: 'official_organizer_rule',
            sourceDocument: 'Buku Syarat Pertandingan Street Dakwah — Fasal 5.2'
          },
          {
            id: 'tsk-d2',
            clauseNumber: 'Tugasan D.2',
            heading: 'Semakan Kesahihan Dalil & Larangan AI Generatif',
            text: 'Mendapatkan pengesahan dalil daripada pensyarah Pendidikan Islam serta memastikan sifar kandungan visual atau skrip janaan AI.',
            mandatory: true,
            sourceType: 'official_organizer_rule',
            sourceDocument: 'Buku Syarat Pertandingan Street Dakwah — Fasal 5.2 & 5.3'
          }
        ],
        checklistItems: [
          {
            id: 'chk-tsk-dak-1',
            taskText: 'Lengkapkan temu bual bersama 3 responden awam di lokasi luar kolej (Bandar Penawar / Desaru).',
            sourceType: 'official_organizer_rule',
            sourceDocument: 'Buku Syarat Pertandingan Street Dakwah',
            sourceClause: 'Fasal 5.2',
            deadline: '20 September 2026',
            responsibleRole: 'Krew Penggambaran Video',
            mandatory: true
          },
          {
            id: 'chk-tsk-dak-2',
            taskText: 'Jalankan semakan integriti AI untuk memastikan tiada visual atau audio janaan kecerdasan buatan.',
            sourceType: 'official_organizer_rule',
            sourceDocument: 'Buku Syarat Pertandingan Street Dakwah',
            sourceClause: 'Fasal 5.3',
            deadline: '28 September 2026',
            responsibleRole: 'Lead Advisor & Editor Video',
            mandatory: true
          }
        ]
      }
    ]
  }
];

// Helper to count total statistics across all sections
export function getStructuredReferenceStats() {
  let totalSections = 0;
  let totalClauses = 0;
  let mandatoryClauses = 0;
  let deadlineClauses = 0;
  let totalChecklistItems = 0;
  let officialOrganizerChecklistItems = 0;
  let internalOperationalChecklistItems = 0;

  STRUCTURED_COMPETITION_DOCUMENTS.forEach((category) => {
    totalSections += category.items.length;
    category.items.forEach((item) => {
      totalClauses += item.clauses.length;
      item.clauses.forEach((clause) => {
        if (clause.mandatory) mandatoryClauses++;
        if (clause.deadline) deadlineClauses++;
      });
      if (item.checklistItems) {
        totalChecklistItems += item.checklistItems.length;
        item.checklistItems.forEach((chk) => {
          if (chk.sourceType === 'official_organizer_rule') {
            officialOrganizerChecklistItems++;
          } else {
            internalOperationalChecklistItems++;
          }
        });
      }
    });
  });

  return {
    totalCategories: STRUCTURED_COMPETITION_DOCUMENTS.length,
    totalSections,
    totalClauses,
    mandatoryClauses,
    deadlineClauses,
    totalChecklistItems,
    officialOrganizerChecklistItems,
    internalOperationalChecklistItems
  };
}

// Helper to collect all traceable checklist items across all categories
export function getAllTraceableChecklistItems(targetEventFilter?: string): TraceableChecklistItem[] {
  const items: TraceableChecklistItem[] = [];
  STRUCTURED_COMPETITION_DOCUMENTS.forEach((cat) => {
    cat.items.forEach((sec) => {
      if (targetEventFilter && targetEventFilter !== 'Semua Acara') {
        const target = (sec.targetEvent || '').toLowerCase();
        const filter = targetEventFilter.toLowerCase();
        const matches = target.includes(filter) || 
          (filter.includes('battle') && target.includes('muzik')) ||
          (filter.includes('symphonic') && target.includes('muzik'));
        if (!matches) return;
      }
      if (sec.checklistItems) {
        items.push(...sec.checklistItems);
      }
    });
  });
  return items;
}

// Helper to collect all submission deadlines
export function getAllSubmissionDeadlines(): {
  sectionTitle: string;
  targetEvent: string;
  deadline: SubmissionDeadlineInfo;
}[] {
  const deadlines: {
    sectionTitle: string;
    targetEvent: string;
    deadline: SubmissionDeadlineInfo;
  }[] = [];

  STRUCTURED_COMPETITION_DOCUMENTS.forEach((cat) => {
    cat.items.forEach((sec) => {
      if (sec.submissionDeadlines) {
        sec.submissionDeadlines.forEach((d) => {
          deadlines.push({
            sectionTitle: sec.sectionTitle,
            targetEvent: sec.targetEvent || 'Umum',
            deadline: d
          });
        });
      }
    });
  });

  return deadlines;
}
