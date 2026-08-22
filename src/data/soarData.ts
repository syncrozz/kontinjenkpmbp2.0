import { EventDetail, ContingentMemberGroup, ScheduleItem, ChecklistItem, RuleGuideline } from '../types';

export const SOAR_METADATA = {
  title: 'SOAR IPMA 2026',
  fullTitle: 'Sound and Rhythm IPMA 2026',
  contingentName: 'Kontinjen Kolej Profesional MARA Bandar Penawar (KPMBP)',
  theme: 'Where Rhythm Meets Revelation',
  dates: '15 – 18 Oktober 2026',
  durationDays: 4,
  venues: [
    {
      name: 'Kolej MARA Banting (KMB)',
      shortName: 'KMB',
      role: 'Pusat Penginapan & Acara Utama',
      location: 'Banting, Selangor'
    },
    {
      name: 'Auditorium D’Sury, Kompleks JKKN Seremban',
      shortName: 'JKKN Seremban',
      role: 'Pentas Pertandingan Teater Islamik',
      location: 'Seremban, Negeri Sembilan'
    }
  ],
  totalContingentPax: 41
};

export const EVENTS_DATA: EventDetail[] = [
  {
    id: 'teater-islamik',
    title: 'Teater',
    category: 'Teater Islamik',
    theme: 'Teater Masar Al-Masajid',
    participantsCount: '15 orang',
    venue: 'Auditorium D’Sury, Kompleks JKKN Seremban',
    dateStr: '17 Oktober 2026',
    submissionDeadline: '10 September 2026',
    description: 'Pertandingan teater Islamik yang mengangkat kisah sejarah masjid-masjid terawal di seluruh dunia melalui persembahan dramatik yang menggabungkan lakonan dengan elemen kerohanian seperti qasidah, syair, sajak, nyanyian dan potongan ayat Al-Quran.',
    backgroundHistory: 'Teater Masar Al-Masajid merupakan pertandingan Teater Islamik yang memberi ruang kepada pelajar untuk mengangkat kisah-kisah sejarah masjid-masjid terawal di seluruh dunia melalui persembahan dramatik yang menonjolkan kesinambungan tamadun Islam serta pembentukan identiti dan legasi umat Islam merentasi zaman dan geografi.\n\nPertandingan ini dahulunya berada di bawah Program Mind Of Medina dan pada tahun 2026 digabungkan bersama Program Sound And Rhythm (SOAR) 2026.\n\nProgram SOAR 2026 dianjurkan di bawah Bahagian Pendidikan Tinggi MARA, dengan Kolej MARA Banting sebagai tuan rumah serta kerjasama Jabatan Kebudayaan dan Kesenian Negara (JKKN) Negeri Sembilan dan Yayasan Dakwah Islamiah Malaysia (YADIM).',
    submissionItems: [
      'Skrip Teater',
      'Senarai Nama Peserta & Watak',
      'Keperluan Tambahan Produksi'
    ],
    elementsInfo: {
      mandatory: ['Lakonan — WAJIB'],
      additionalTitle: 'Lakonan + Minimum 2 Elemen Tambahan',
      additionalOptions: [
        'Qasidah',
        'Nyanyian Kerohanian',
        'Syair',
        'Sajak',
        'Potongan Ayat Al-Quran'
      ]
    },
    durationInfo: {
      performanceTime: '15 – 25 minit',
      setupCleanupTime: '15 minit (persiapan pentas & pembersihan)',
      totalTime: '40 minit',
      warning: 'Kumpulan yang tidak mengikut tempoh masa yang ditetapkan akan dipotong markah.'
    },
    eventTentative: [
      {
        date: '15 OKTOBER 2026 (KHAMIS)',
        items: [
          { time: '2.00 petang', title: 'Pendaftaran Kontinjen', venue: 'Kolej MARA Banting' },
          { time: '2.00 petang – 5.00 petang', title: 'Kemasukan Alatan Pentas / Props Teater', venue: 'Auditorium D’Sury, Kompleks JKKN Seremban' }
        ]
      },
      {
        date: '16 OKTOBER 2026 (JUMAAT)',
        items: [
          { time: '2.45 petang – 7.00 petang', title: 'Persiapan Pementasan Teater / Raptai Ringkas', venue: 'Auditorium D’Sury, Kompleks JKKN Seremban' }
        ]
      },
      {
        date: '17 OKTOBER 2026 (SABTU)',
        items: [
          { time: '8.30 pagi – 6.00 petang', title: 'PERTANDINGAN TEATER MASAR AL-MASAJID', venue: 'Auditorium D’Sury, Kompleks JKKN Seremban' }
        ]
      },
      {
        date: '18 OKTOBER 2026 (AHAD)',
        items: [
          { time: '9.30 pagi', title: 'Majlis Perasmian Penutupan', venue: 'Dewan Al-Khawarizmi, Kolej MARA Banting' }
        ]
      }
    ],
    importantReminder: {
      deadline: '10 SEPTEMBER 2026',
      items: [
        'Peserta, watak, skrip, keperluan produksi'
      ],
      competitionDate: '17 OKTOBER 2026',
      competitionTime: '8.30 PAGI – 6.00 PETANG',
      venue: 'AUDITORIUM D’SURY, KOMPLEKS JKKN SEREMBAN'
    },
    advisors: ['Muzlinda', 'Rabi', 'Nazhan', 'Nizam', 'Syifa', 'Afif'],
    leadAdvisor: 'Muzlinda',
    leadAdvisorPhone: '60192046144',
    leadAdvisorWhatsApp: 'https://wasap.my/60192046144',
    rules: [
      'Garis panduan rasmi menetapkan penyertaan maksimum 15 orang peserta merangkumi pelakon & krew produksi.',
      'Tema persembahan wajib berkisar tentang "Teater Masar Al-Masajid".',
      'DEADLINE PENGHANTARAN: 10 September 2026 (Wajib hantar Peserta, watak, skrip, keperluan produksi).',
      'Pementasan secara rasmi diadakan di Auditorium D’Sury, Kompleks JKKN Seremban pada 17 Oktober 2026 (8.30 pagi – 6.00 petang).',
      'Elemen pementasan WAJIB mengandungi Lakonan + Minimum 2 Elemen Tambahan (Qasidah, Nyanyian Kerohanian, Syair, Sajak, atau Potongan Ayat Al-Quran).',
      'Tempoh pementasan adalah 15–25 minit, persiapan/pembersihan 15 minit (Jumlah 40 minit). Kumpulan yang tidak mengikut tempoh masa ditetapkan akan dipotong markah.',
      'Penyediaan prop dan busana hendaklah mematuhi etika pakaian syariah dan etika IPMA MARA.',
      'Keputusan panel penilai profesional adalah MUKTAMAD.'
    ],
    rubric: [
      { component: 'Mesej & Penghayatan Islamik', percentage: 30, description: 'Kekuatan naratif, ketepatan fakta sejarah masjid dan nilai iktibar.' },
      { component: 'Kualiti Lakonan & Pengucapan', percentage: 25, description: 'Sebutan, kawalan vokal, artikulasi, dan lontaran emosi watak.' },
      { component: 'Pengarahan & Dramaturgi', percentage: 20, description: 'Kelancaran babak, pergerakan pentas, penggunaan ruang dan tempo.' },
      { component: 'Kreativiti Busana & Prop', percentage: 15, description: 'Kesesuaian kostum, tata rias, serta prop latar pentas.' },
      { component: 'Impak Keseluruhan & Disiplin Pentas', percentage: 10, description: 'Keserasian krew, ketepatan masa, dan etika kontinjen.' }
    ],
    notes: 'Dipentaskan secara rasmi di Auditorium D’Sury, Kompleks JKKN Seremban pada 17 Oktober 2026. PERINGATAN PENTING: Sediakan dan hantar Peserta, watak, skrip, keperluan produksi sebelum/pada 10 SEPTEMBER 2026.',
    iconName: 'Theater'
  },
  {
    id: 'symphonic-duo',
    title: 'Symphonic Duo',
    category: 'Symphonic Duo',
    theme: 'A Symphony of Two',
    participantsCount: '2 orang',
    venue: 'Dewan Utama Kolej MARA Banting (KMB)',
    dateStr: '16 Oktober 2026',
    description: 'Pertandingan persembahan muzik duet akustik/instrumen/vokal bermutu tinggi yang menekankan keharmonian, teknik susunan muzik, dan gubahan irama yang kreatif.',
    advisors: ['Khairi', 'Din'],
    leadAdvisor: 'Khairi',
    leadAdvisorPhone: '60145313756',
    leadAdvisorWhatsApp: 'https://wasap.my/60145313756',
    rules: [
      'Setiap kontinjen diwakili oleh 2 orang peserta sahaja.',
      'Bertemakan "A Symphony of Two".',
      'Instrumen muzik akustik/pemuzik penggiring dibenarkan mengikut ketetapan urus setia.',
      'Bahan lirik dan susunan lagu mestilah bersih daripada unsur negatif dan menyokong nilai murni.'
    ],
    rubric: [
      { component: 'Harmoni & Kawalan Vokal/Alatan', percentage: 35, description: 'Ketepatan nada, keserasian suara duet, dan kawalan intonasi.' },
      { component: 'Gubahan Muzik & Musikaliti', percentage: 30, description: 'Kreativiti dinamik, tempo, dan keunikan susunan muzik.' },
      { component: 'Penjiwaan & Persembahan Pentas', percentage: 20, description: 'Ekspresi muka, keyakinan, dan interaksi sesama penyanyi.' },
      { component: 'Keterampilan & Etika', percentage: 15, description: 'Kesesuaian pakaian dan kesopanan persembahan.' }
    ],
    notes: 'Memerlukan latihan intensif kawalan harmoni dan intonasi vokal/muzik secara duet.',
    iconName: 'Music'
  },
  {
    id: 'tarian-zapin',
    title: 'Tarian Zapin',
    category: 'Tarian Zapin',
    theme: 'Zapin Tradisional / Terbuka',
    participantsCount: '6 orang',
    venue: 'Dewan Gemilang Kolej MARA Banting (KMB)',
    dateStr: '16 Oktober 2026',
    description: 'Pertandingan tarian Zapin kategori terbuka yang mengangkat seni warisan Melayu, disiplin pergerakan, ketepatan ragam zapin, serta keanggunan busana tradisional.',
    advisors: ['Saba', 'Tam'],
    leadAdvisor: 'Saba',
    leadAdvisorPhone: '60127142990',
    leadAdvisorWhatsApp: 'https://wasap.my/60127142990',
    rules: [
      'Penyertaan terbuka kepada 6 orang penari bagi setiap kontinjen.',
      'Ragam zapin asli mestilah kekal terpelihara dengan gubahan kreatif yang sopan.',
      'Busana tradisional Melayu lengkap, kemas, dan mematuhi garis panduan etika pakaian IPMA.',
      'Muzik iringan dalam bentuk rakaman audio HD berkualiti tinggi.'
    ],
    rubric: [
      { component: 'Ketepatan Ragam & Teknik Zapin', percentage: 35, description: 'Ketepatan langkah, ragam asas zapin, dan kawalan postur.' },
      { component: 'Koordinasi & Keseragaman', percentage: 30, description: 'Kesepakatan langkah sesama penari dan keselarasan tempo.' },
      { component: 'Kreativiti Formasi Pentas', percentage: 20, description: 'Penggunaan ruang pentas, kelancaran transisi formasi.' },
      { component: 'Busana & Penampilan', percentage: 15, description: 'Ketepatan pakaian zapin, aksesori, dan kekemasan.' }
    ],
    notes: 'Latihan ragam dan kekemasan susunan formasi penting untuk markah keseragaman.',
    iconName: 'Sparkles'
  },
  {
    id: 'battle-of-the-band',
    title: 'BOTB',
    category: 'BOTB',
    theme: 'Dua Cabaran Lagu: Rock Malaya & Global Sonic',
    participantsCount: '7 orang',
    venue: 'Pentas Terbuka / Dewan KMB',
    dateStr: '16 - 17 Oktober 2026',
    description: 'Pertandingan kumpulan muzik band yang menguji kemahiran instrumental, vokal, dan variasi genre dalam dua cabaran lagu wajib.',
    advisors: ['Syafiq', 'Pip'],
    leadAdvisor: 'Syafiq',
    leadAdvisorPhone: '60133312425',
    leadAdvisorWhatsApp: 'https://wasap.my/60133312425',
    rules: [
      'Maksimum 7 orang ahli bagi setiap kumpulan band.',
      'Cabaran Lagu 1: Hits Rock Malaya (Tahun 80-an – 90-an).',
      'Cabaran Lagu 2: A Global Sonic Journey (Lagu antarabangsa berdasarkan negara yang diundi).',
      'Penggunaan alatan muzik elektrik & akustik mengikut spesifikasi teknikal pentas.',
      'Pengurusan maki/vokal dan stage presence yang dinamik.'
    ],
    rubric: [
      { component: 'Kemahiran Muzikaliti & Imbangan Alatan', percentage: 35, description: 'Kualiti bunyi, susunan dinamik, & keserasian instrumen.' },
      { component: 'Vokal & Kawalan Pentas', percentage: 25, description: 'Kekuatan vokal utama, harmoni vokal latar, & tenaga pentas.' },
      { component: 'Kreativiti Susunan Lagu', percentage: 20, description: 'Keunikan interpretasi lagu Rock Malaya & lagu antarabangsa.' },
      { component: 'Ketetapan Tema & Pakaian', percentage: 20, description: 'Kesesuaian konsep pakaian band & ketetapan masa.' }
    ],
    notes: 'Lagu antarabangsa akan ditentukan melalui proses undian rasmi oleh urus setia.',
    iconName: 'Guitar'
  },
  {
    id: 'street-dakwah',
    title: 'Street Dakwah',
    category: 'Street Dakwah',
    theme: 'From Chaos to Calm',
    participantsCount: '5 orang',
    venue: 'Penyerahan Dalam Talian & Saringan Video (KMB)',
    dateStr: '10 Sept & 1 Okt 2026',
    submissionDeadline: '10 Sept 2026 (Nama & ID) | 1 Okt 2026, sebelum 5.00 ptg (Video)',
    description: 'Penghasilan video dakwah kreatif bertemakan "From Chaos to Calm" (Dari Kekacauan kepada Ketenangan) yang menggambarkan proses transformasi jiwa daripada keadaan yang penuh kekeliruan, konflik, tekanan, dan ketidakstabilan kepada ketenangan, kedamaian serta keseimbangan hidup yang berpaksi kepada nilai-nilai murni dan petunjuk Ilahi.',
    backgroundHistory: 'Maksud Tema "From Chaos to Calm":\n“Chaos to Calm” – Dari Kekacauan kepada Ketenangan, menggambarkan sebuah proses transformasi jiwa.\n\nHuraian Tema:\nPerjalanan transformasi jiwa daripada keadaan yang penuh kekeliruan, konflik, tekanan, dan ketidakstabilan kepada ketenangan, kedamaian serta keseimbangan hidup yang berpaksi kepada nilai-nilai murni dan petunjuk Ilahi.\n\nSyarat & Elemen Wajib Video:\n1. Lokasi Penggambaran: Video mestilah dirakam di tempat umum / luar kawasan kolej.\n2. Responden: Wajib melibatkan minimum 3 responden.\n3. Rujukan: Wajib menyertakan dalil Al-Quran / Hadith yang sahih.',
    submissionItems: [
      'Penyerahan Nama Peserta: Nama & ID Pelajar (Due: 10 Sept 2026)',
      'Penyerahan Video Pertandingan (Due: 1 Okt 2026, sebelum jam 5.00 petang)'
    ],
    elementsInfo: {
      mandatory: [
        'Lokasi Penggambaran: Tempat umum / luar kawasan kolej — WAJIB',
        'Responden: Minimum 3 responden — WAJIB',
        'Rujukan: Dalil Al-Quran / Hadith yang sahih — WAJIB'
      ],
      additionalTitle: 'Tema Rasmi: “From Chaos to Calm”',
      additionalOptions: [
        'Maksud Tema: Transformasi Jiwa dari Kekacauan kepada Ketenangan',
        'Pendekatan Berhikmah, Berempati, Santai & Tidak Menghukum',
        'Kualiti Rakaman Full HD',
        'Karya Asli (AI Dilarang untuk Skrip & Visual Utama)'
      ]
    },
    importantReminder: {
      deadline: '10 SEPT 2026 & 1 OKT 2026 (SEBELUM 5.00 PTG)',
      items: [
        'Penyerahan Nama Peserta: Nama & ID Pelajar (10 September 2026)',
        'Penyerahan Video Pertandingan: 1 Oktober 2026 (Sebelum jam 5.00 petang)'
      ],
      competitionDate: '17 OKTOBER 2026',
      competitionTime: '2.30 PETANG – 5.30 PETANG (SHOWCASE & PENJURIAN)',
      venue: 'DEWAN KULIAH UTAMA, KOLEJ MARA BANTING'
    },
    advisors: ['Halimah'],
    leadAdvisor: 'Halimatul',
    leadAdvisorPhone: '60177804852',
    leadAdvisorWhatsApp: 'https://wasap.my/60177804852',
    rules: [
      'Maksimum 5 orang ahli dalam pasukan produksi video.',
      'PENYERAHAN NAMA PESERTA: Wajib hantar Nama & ID Pelajar selewat-lewatnya pada 10 September 2026.',
      'PENYERAHAN VIDEO: Tarikh akhir penyerahan video adalah pada 1 Oktober 2026, sebelum jam 5.00 petang.',
      'LOKASI PENGGAMBARAN: Video mestilah dirakam di tempat umum / luar kawasan kolej.',
      'RESPONDEN: Wajib melibatkan minimum 3 responden dalam rakaman video.',
      'RUJUKAN DALIL: Wajib menyertakan dalil Al-Quran / Hadith yang sahih dalam pengisian dakwah.',
      'TEMA RASMI: "From Chaos to Calm" (Dari Kekacauan kepada Ketenangan) – Perjalanan transformasi jiwa daripada kekeliruan, konflik, dan tekanan kepada ketenangan dan petunjuk Ilahi.',
      'Format video: Rakaman Full HD berkualiti tinggi diserahkan melalui pautan rasmi sebelum jam 5.00 petang pada 1 Oktober 2026.',
      'Syarat Ketat AI: AI TIDAK DIBENARKAN menghasilkan kandungan utama (skrip/visual). Hanya dibenarkan untuk penyuntingan teknikal seperti penstabilan video atau pengurangan bunyi audio (noise reduction).',
      'Mematuhi etika dakwah berhikmah, menghormati sensitiviti awam dan etika IPMA.'
    ],
    rubric: [
      { component: 'Kualiti Kandungan & Tema', percentage: 30, description: 'Kejelasan mesej "From Chaos to Calm", ketepatan dalil sahih Al-Quran/Hadith, jalan cerita, dan daya penarik.' },
      { component: 'Nilai Dakwah', percentage: 20, description: 'Pendekatan berhikmah, empati, penerapan ajaran Islam dengan minimum 3 responden di tempat umum tanpa nada menghukum.' },
      { component: 'Kreativiti & Sinematografi', percentage: 15, description: 'Keunikan sudut kamera luar kolej, penghayatan transformasi jiwa dari kekacauan kepada ketenangan, dan visual.' },
      { component: 'Interaksi Masyarakat', percentage: 15, description: 'Keberkesanan temubual responden tempat umum & impak mesej menyentuh jiwa penonton.' },
      { component: 'Kualiti Teknikal Audio & Video', percentage: 10, description: 'Kejelasan audio, suntingan, kejelasan gambar Full HD, & adunan bunyi.' },
      { component: 'Kerjasama Pasukan', percentage: 10, description: 'Disiplin penyediaan, penyerahan tepat sebelum 1 Okt 5.00 ptg, pematuhan garis panduan, & pengurusan.' }
    ],
    notes: 'Tarikh akhir penyerahan rasmi: (1) 10 September 2026 — Penyerahan Nama Peserta (Nama & ID Pelajar), (2) 1 Oktober 2026 (sebelum jam 5.00 petang) — Penyerahan Video Pertandingan. Elemen wajib: video dirakam di tempat umum/luar kolej, minimum 3 responden, dan dalil Al-Quran/Hadith sahih.',
    iconName: 'Video'
  }
];

export interface SubmissionDeadlineItem {
  priority: number;
  event: string;
  eventId: string;
  requirement: string;
  dueDate: string;
}

export const SUBMISSION_DEADLINES: SubmissionDeadlineItem[] = [
  {
    priority: 1,
    event: 'Short Film (Street Dakwah)',
    eventId: 'street-dakwah',
    requirement: 'Penyerahan Nama Peserta (Nama & ID Pelajar)',
    dueDate: '10 Sept 2026'
  },
  {
    priority: 2,
    event: 'Teater Islamik',
    eventId: 'teater-islamik',
    requirement: 'Peserta, watak, skrip, keperluan produksi',
    dueDate: '10 Sept 2026'
  },
  {
    priority: 3,
    event: 'Short Film (Street Dakwah)',
    eventId: 'street-dakwah',
    requirement: 'Penyerahan Video (sebelum jam 5.00 petang)',
    dueDate: '1 Okt 2026 (sebelum 5.00 ptg)'
  }
];

export const CONTINGENT_BREAKDOWN: ContingentMemberGroup[] = [
  {
    role: 'Pelajar (Peserta)',
    count: 35,
    description: 'Wakil pelajar KPMBP yang bergiat aktif dalam 5 acara pertandingan utama (Teater, Symphonic Duo, Zapin, BOTB & Street Dakwah).',
    icon: 'GraduationCap',
    responsibilities: [
      'Menjalani latihan intensif sebelum dan sepanjang festival.',
      'Menjaga disiplin, sahsiah, dan nama baik KPMBP.',
      'Mematuhi jadual pertandingan dan taklimat pegawai pengiring.'
    ]
  },
  {
    role: 'Pensyarah Pengiring',
    count: 4,
    description: 'Pegawai penasihat, jurulatih, dan pengurus kontinjen KPMBP yang menyelaraskan kebajikan, disiplin, dan keselamatan.',
    icon: 'UserCheck',
    responsibilities: [
      'Menyelaras logistik, penginapan, dan sajian makanan peserta.',
      'Penyeliaan keselamatan, kesihatan, dan kebajikan 35 pelajar.',
      'Menjadi penghubung rasmi antara Kontinjen KPMBP dan Urus Setia Induk SOAR 2026.'
    ]
  },
  {
    role: 'Pemandu',
    count: 2,
    description: 'Pemandu bas/van rasmi KPMBP yang memandu dan menguruskan pergerakan kontinjen sepanjang perjalanan Banting - Seremban.',
    icon: 'Bus',
    responsibilities: [
      'Memastikan pengangkutan kontinjen sentiasa selamat dan berada dalam keadaan terbaik.',
      'Menyelaras pergerakan kontinjen dari KMB ke JKKN Seremban mengikut jadual pementasan teater.',
      'Membantu logistik alatan muzik, prop teater, dan beg peserta.'
    ]
  }
];

export const SCHEDULE_DATA: ScheduleItem[] = [
  // Hari 1: 15 Oktober 2026
  {
    id: 's1',
    day: 1,
    date: 'Khamis, 15 Oktober 2026',
    time: '08:00 AM - 12:00 PM',
    title: 'Perjalanan Kontinjen KPMBP ke Kolej MARA Banting',
    venue: 'Bertolak dari KPM Bandar Penawar ke KMB Banting',
    category: 'Logistik',
    description: 'Pendaftaran bertolak kontinjen KPMBP (41 org). Taklimat keselamatan oleh Pegawai Pengiring sebelum pelepasan bas.'
  },
  {
    id: 's2',
    day: 1,
    date: 'Khamis, 15 Oktober 2026',
    time: '02:00 PM - 05:00 PM',
    title: 'Pendaftaran Kontinjen SOAR 2026 & Taklimat Pengurus',
    venue: 'Dewan Utama Kolej MARA Banting (KMB)',
    category: 'Logistik',
    description: 'Pendaftaran rasmi kontinjen KPMBP, penyerahan pas masuk, semakan bilik penginapan, dan Mesyuarat Pengurus Pasukan.'
  },
  {
    id: 's3',
    day: 1,
    date: 'Khamis, 15 Oktober 2026',
    time: '08:00 PM - 10:30 PM',
    title: 'Majlis Perasmian Pembukaan SOAR 2026',
    venue: 'Dewan Gemilang KMB',
    category: 'Majlis',
    description: 'Majlis pembukaan rasmi festival seni, budaya dan dakwah IPMA MARA 2026. Kehadiran penuh seluruh kontinjen KPMBP.'
  },

  // Hari 2: 16 Oktober 2026
  {
    id: 's4',
    day: 2,
    date: 'Jumaat, 16 Oktober 2026',
    time: '08:30 AM - 12:00 PM',
    title: 'Pertandingan Tarian Zapin & Symphonic Duo',
    venue: 'Dewan Utama & Dewan Gemilang KMB',
    category: 'Tarian',
    description: 'Persembahan Tarian Zapin (6 peserta KPMBP) dan Symphonic Duo (2 peserta KPMBP). Sesi penilaian juri profesional.'
  },
  {
    id: 's5',
    day: 2,
    date: 'Jumaat, 16 Oktober 2026',
    time: '03:00 PM - 06:30 PM',
    title: 'Peringkat Saringan Battle of the Band (BOTB) - Rock Malaya',
    venue: 'Pentas Terbuka KMB',
    category: 'Muzik',
    description: 'Peringkat saringan BOTB Cabaran 1: Hits Rock Malaya (80-an & 90-an). Pasukan BOTB KPMBP (7 peserta) beraksi.'
  },

  // Hari 3: 17 Oktober 2026
  {
    id: 's6',
    day: 3,
    date: 'Sabtu, 17 Oktober 2026',
    time: '08:00 AM - 01:00 PM',
    title: 'Pementasan Teater Islamik: Masar Al-Masajid',
    venue: 'Dewan JKKN Negeri Sembilan, Seremban',
    category: 'Teater',
    description: 'Pergerakan pasukan teater (15 peserta) ke Seremban. Pementasan rasmi Teater Islamik bertemakan sejarah masjid terawal dunia.'
  },
  {
    id: 's7',
    day: 3,
    date: 'Sabtu, 17 Oktober 2026',
    time: '02:30 PM - 05:30 PM',
    title: 'Tayangan & Penjurian Showcase Street Dakwah Video',
    venue: 'Dewan Kuliah Utama KMB',
    category: 'Dakwah',
    description: 'Tayangan rasmi karya video dakwah "From Chaos to Calm" (5 peserta KPMBP) & penilaian rubrik 6 komponen oleh juri.'
  },
  {
    id: 's8',
    day: 3,
    date: 'Sabtu, 17 Oktober 2026',
    time: '08:00 PM - 11:00 PM',
    title: 'Peringkat Akhir BOTB - A Global Sonic Journey',
    venue: 'Pentas Terbuka KMB',
    category: 'Muzik',
    description: 'Cabaran 2 Battle of the Band membawakan lagu antarabangsa mengikut undian negara. Persembahan puncak muzik band.'
  },

  // Hari 4: 18 Oktober 2026
  {
    id: 's9',
    day: 4,
    date: 'Ahad, 18 Oktober 2026',
    time: '09:00 AM - 12:30 PM',
    title: 'Majlis Penutupan, Penyampaian Hadiah & Anugerah Utama',
    venue: 'Dewan Gemilang Kolej MARA Banting',
    category: 'Majlis',
    description: 'Pengumuman pemenang 5 kategori pertandingan, penganugerahan Juara Keseluruhan SOAR IPMA 2026, & persembahan penutup.'
  },
  {
    id: 's10',
    day: 4,
    date: 'Ahad, 18 Oktober 2026',
    time: '02:00 PM - 07:00 PM',
    title: 'Pemeriksaan Bilik & Perjalanan Pulang ke KPMBP',
    venue: 'KMB Banting bertolak pulang ke Bandar Penawar',
    category: 'Logistik',
    description: 'Pembersihan penginapan, penyemakan logistik & perjalanan pulang kontinjen KPMBP dengan selamat.'
  }
];

export const INITIAL_CHECKLIST: ChecklistItem[] = [
  { id: 'c1', category: 'Dokumen', title: 'Surat Kelulusan Peserta oleh Pengarah Pusat KPMBP', targetRole: 'Pegawai', completed: true },
  { id: 'c2', category: 'Dokumen', title: 'Senarai Nama Rasmi 41 Ahli Kontinjen (35 Pelajar, 4 Pegawai, 2 Pemandu)', targetRole: 'Pegawai', completed: true },
  { id: 'c1_sd', category: 'Dokumen', title: 'Street Dakwah: Penyerahan Nama Peserta & ID Pelajar (Due: 10 Sept 2026)', targetRole: 'Pelajar', completed: true },
  { id: 'c2_ti', category: 'Teknikal', title: 'Teater Islamik: Penghantaran Peserta, Watak, Skrip & Keperluan Produksi (Due: 10 Sept 2026)', targetRole: 'Pelajar', completed: false },
  { id: 'c3', category: 'Teknikal', title: 'Street Dakwah: Penyerahan Video Pertandingan (Due: 1 Okt 2026, sebelum 5.00 ptg)', targetRole: 'Pelajar', completed: false },
  { id: 'c4', category: 'Peralatan', title: 'Pemeriksaan Set Alatan Muzik & Props Teater Islamik', targetRole: 'Pelajar', completed: false },
  { id: 'c5', category: 'Logistik', title: 'Penyelenggaraan & Pemeriksaan Bas Kontinjen KPMBP', targetRole: 'Pemandu', completed: true },
  { id: 'c6', category: 'Kebajikan', title: 'Peti Pertolongan Cemas (First Aid Kit) & Ubat-Ubatan Kontinjen', targetRole: 'Pegawai', completed: false },
  { id: 'c7', category: 'Peralatan', title: 'Pakaian & Kostum Zapin / Teater Mematuhi Etika Syariah IPMA', targetRole: 'Pelajar', completed: false },
  { id: 'c8', category: 'Dokumen', title: 'Borang Pengesahan Etika AI & Hak Cipta Video Street Dakwah', targetRole: 'Pelajar', completed: true },
  { id: 'c9', category: 'Logistik', title: 'Jadual Pergerakan Bas dari KMB ke JKKN Seremban (17 Okt)', targetRole: 'Pemandu', completed: false }
];

export const RULES_GUIDELINES: RuleGuideline[] = [
  {
    title: 'Tadbir Urus & Pengurusan Kontinjen',
    category: 'Peraturan Umum',
    content: [
      'Setiap institusi IPMA MARA menghantar 1 kontinjen rasmi seramai 41 orang (35 Pelajar, 4 Pegawai Pengiring, 2 Pemandu).',
      'Penyertaan pelajar mestilah mendapat kelulusan bertulis rasmi daripada Pengarah Pusat.',
      'Semua tarikh penyerahan bahan pertandingan (seperti nama peserta sebelum 10 Sept 2026 dan video Street Dakwah sebelum 1 Okt 2026, 5.00 petang) yang ditetapkan oleh urus setia wajib dipatuhi.',
      'Keputusan panel penilai yang dilantik adalah MUKTAMAD dan tidak boleh diganggu gugat.'
    ]
  },
  {
    title: 'Etika & Sahsiah Peserta SOAR 2026',
    category: 'Nilai & Sahsiah',
    content: [
      'Menjaga tatasusila, etika berpakaian menutup aurat dan kemas, serta akhlak terpuji sepanjang festival.',
      'Menekankan nilai kerja berpasukan, disiplin, komunikasi berkesan, dan profesionalisme.',
      'Pendekatan dakwah (seperti Street Dakwah bertemakan "From Chaos to Calm") hendaklah secara berhikmah, berempati, santai, melibatkan minimum 3 responden di tempat umum, berlandaskan dalil Al-Quran/Hadith sahih, dan elakkan nada menghukum.'
    ]
  },
  {
    title: 'Penggunaan Teknologi & Etika AI',
    category: 'Syarat Teknologi',
    content: [
      'Video Street Dakwah hendaklah dirakam di tempat umum/luar kawasan kolej dalam kualiti Full HD dan diserahkan sebelum 1 Oktober 2026, jam 5.00 petang.',
      'PENGGUNAAN AI (Artificial Intelligence): AI TIDAK DIBENARKAN sama sekali untuk menghasilkan kandungan utama (skrip, visual, atau audio generated).',
      'Penggunaan AI hanya dibenarkan untuk tujuan pemprosesan teknikal khas seperti penstabilan video (video stabilization) atau pengurangan hingar audio (audio noise reduction).'
    ]
  }
];

export function getEventDeadlines(event: EventDetail): { label: string; dueDate: string; requirement?: string }[] {
  let allDeadlines: SubmissionDeadlineItem[] = SUBMISSION_DEADLINES;
  try {
    const saved = localStorage.getItem('kpmbp_soar_deadlines');
    if (saved) {
      const parsed: SubmissionDeadlineItem[] = JSON.parse(saved);
      // Auto-migrate if local storage contains outdated dates
      const hasOutdated = parsed.some(
        (item) =>
          item.dueDate.includes('1 Sept 2026') ||
          item.dueDate.includes('15 Sept 2026') ||
          item.dueDate.includes('1 September') ||
          item.dueDate.includes('15 September')
      );
      if (hasOutdated) {
        allDeadlines = SUBMISSION_DEADLINES;
        localStorage.setItem('kpmbp_soar_deadlines', JSON.stringify(SUBMISSION_DEADLINES));
      } else {
        allDeadlines = parsed;
      }
    }
  } catch (e) {
    console.error(e);
  }

  // Filter for this event
  const matches = allDeadlines.filter(
    (d) =>
      d.eventId === event.id ||
      d.event.toLowerCase() === event.title.toLowerCase() ||
      (event.id === 'street-dakwah' && (d.event.includes('Street Dakwah') || d.eventId === 'street-dakwah'))
  );

  if (matches.length > 0) {
    return matches.map((m) => ({
      dueDate: m.dueDate,
      requirement: m.requirement,
      label: `Deadline: ${m.dueDate}${m.requirement ? ` (${m.requirement})` : ''}`
    }));
  }

  if (event.submissionDeadline) {
    const parts = event.submissionDeadline.split('|').map((p) => p.trim());
    return parts.map((part) => ({
      dueDate: part,
      label: part.startsWith('Deadline:') ? part : `Deadline: ${part}`
    }));
  }

  return [];
}

