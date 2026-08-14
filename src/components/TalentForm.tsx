import React, { useState } from 'react';
import { addTalentSubmissionToFirestore } from '../lib/firebase';
import { 
  User, 
  FileText, 
  CheckSquare, 
  Award, 
  Sparkles, 
  Video, 
  Link as LinkIcon, 
  Send, 
  CheckCircle2, 
  AlertCircle,
  HelpCircle,
  ArrowRight,
  RotateCcw,
  Music,
  Theater,
  Flame,
  Tv,
  Share2,
  Copy,
  Download
} from 'lucide-react';

export interface TalentFormData {
  // Bahagian A
  namaPenuh: string;
  noIc: string;
  noIdPelajar: string;
  programPengajian: string;
  semester: string;
  noTelefon: string;
  email: string;

  // Bahagian B
  acaraDiminati: string[]; // ['Teater Islamik', 'Battle of the Band', 'Symphonic Duo', 'Tarian Zapin', 'Street Dakwah']

  // Bahagian C
  bakatUtama: string;
  ringkasanBakat: string;
  tempohPenglibatan: string;

  // Bahagian D
  pernahPertandingan: string; // 'Ya' | 'Tidak'
  namaPertandingan: string;
  tahunPertandingan: string;
  peringkatPertandingan: string;
  pencapaianPertandingan: string;
  pernahMewakili: string[]; // ['Sekolah', 'Kolej', 'Daerah', 'Negeri', 'Kebangsaan', 'Antarabangsa']
  ceritaPengalaman: string;

  // Bahagian E - Teater Islamik
  teaterPernahBerlakon: string;
  teaterWatakBiasa: string;
  teaterPeranan: string[];
  teaterPengalaman: string;

  // Bahagian E - Battle of the Band
  botbInstrumen: string[];
  botbGenre: string;

  // Bahagian E - Symphonic Duo
  duoInstrumenUtama: string;
  duoInstrumenKedua: string;
  duoTahapPenguasaan: string;

  // Bahagian E - Tarian Zapin
  zapinPernahMenari: string;
  zapinTahunPengalaman: string;

  // Bahagian E - Street Dakwah
  dakwahPenglibatan: string[];
  dakwahPengalaman: string;

  // Bahagian E - Media Links
  linkVideo: string;
  linkSosial: string;

  // Bahagian F - Komitmen
  komitmenUjiBakat: boolean;
  komitmenLatihanBerkala: boolean;
  komitmenLatihanHujungMinggu: boolean;
  komitmenMenyertai: boolean;

  // Bahagian G - Akuan
  akuanBersetuju: boolean;
}

const initialFormData: TalentFormData = {
  namaPenuh: '',
  noIc: '',
  noIdPelajar: '',
  programPengajian: '',
  semester: 'Semester 1',
  noTelefon: '',
  email: '',

  acaraDiminati: [],

  bakatUtama: '',
  ringkasanBakat: '',
  tempohPenglibatan: '1-3 tahun',

  pernahPertandingan: 'Tidak',
  namaPertandingan: '',
  tahunPertandingan: '',
  peringkatPertandingan: '',
  pencapaianPertandingan: '',
  pernahMewakili: [],
  ceritaPengalaman: '',

  teaterPernahBerlakon: 'Tidak',
  teaterWatakBiasa: 'Hero',
  teaterPeranan: [],
  teaterPengalaman: '',

  botbInstrumen: [],
  botbGenre: 'Rock',

  duoInstrumenUtama: '',
  duoInstrumenKedua: '',
  duoTahapPenguasaan: 'Pertengahan',

  zapinPernahMenari: 'Tidak',
  zapinTahunPengalaman: '',

  dakwahPenglibatan: [],
  dakwahPengalaman: '',

  linkVideo: '',
  linkSosial: '',

  komitmenUjiBakat: false,
  komitmenLatihanBerkala: false,
  komitmenLatihanHujungMinggu: false,
  komitmenMenyertai: false,

  akuanBersetuju: false,
};

// ==================== AUTO FORMAT / INPUT MASKING UTILITIES ====================

/**
 * Auto format No. Kad Pengenalan / No. Isi (XXXXXX-XX-XXXX)
 * Supports live typing, backspace handling, and paste handling without duplicate dashes.
 */
export function formatNoIc(input: string, prevValue: string = ''): string {
  // If user deleted trailing dash
  if (prevValue.endsWith('-') && input === prevValue.slice(0, -1)) {
    const rawPrev = prevValue.replace(/\D/g, '');
    const trimmed = rawPrev.slice(0, -1);
    return formatNoIcRaw(trimmed, false);
  }

  const isDeleting = input.length < prevValue.length;
  const raw = input.replace(/\D/g, '').slice(0, 12);
  return formatNoIcRaw(raw, !isDeleting);
}

function formatNoIcRaw(raw: string, appendDash: boolean): string {
  if (!raw) return '';
  if (raw.length < 6) return raw;
  if (raw.length === 6) return appendDash ? `${raw}-` : raw;
  if (raw.length < 8) return `${raw.slice(0, 6)}-${raw.slice(6)}`;
  if (raw.length === 8) return appendDash ? `${raw.slice(0, 6)}-${raw.slice(6, 8)}-` : `${raw.slice(0, 6)}-${raw.slice(6, 8)}`;
  return `${raw.slice(0, 6)}-${raw.slice(6, 8)}-${raw.slice(8, 12)}`;
}

/**
 * Auto format No. ID Pelajar (XXX-XXXX-XXX)
 * Accepts any 3 letters (A-Z), automatically uppercase, inserts dashes after 3 letters and 4 digits.
 */
export function formatIdPelajar(input: string, prevValue: string = ''): string {
  const upper = input.toUpperCase();

  // If user deleted trailing dash
  if (prevValue.endsWith('-') && upper === prevValue.slice(0, -1).toUpperCase()) {
    const cleanPrev = prevValue.toUpperCase().replace(/[^A-Z0-9]/g, '');
    const trimmed = cleanPrev.slice(0, -1);
    return formatIdPelajarRaw(trimmed, false);
  }

  const isDeleting = input.length < prevValue.length;
  const clean = upper.replace(/[^A-Z0-9]/g, '');
  return formatIdPelajarRaw(clean, !isDeleting);
}

function formatIdPelajarRaw(clean: string, appendDash: boolean): string {
  if (!clean) return '';
  const lettersMatch = clean.match(/^[A-Z]{0,3}/);
  const letters = lettersMatch ? lettersMatch[0] : '';
  const rest = clean.slice(letters.length).replace(/\D/g, '');

  if (letters.length < 3) {
    return letters;
  }

  if (letters.length === 3 && rest.length === 0) {
    return appendDash ? `${letters}-` : letters;
  }

  const part2 = rest.slice(0, 4);
  const part3 = rest.slice(4, 7);

  if (part2.length < 4) {
    return `${letters}-${part2}`;
  }

  if (part2.length === 4 && part3.length === 0) {
    return appendDash ? `${letters}-${part2}-` : `${letters}-${part2}`;
  }

  return `${letters}-${part2}-${part3}`;
}

/**
 * Auto format No. Telefon (e.g. 014-5313756, 6014-5313756)
 * Supports live typing, backspace handling, and paste handling without duplicate dashes.
 */
export function formatNoTelefon(input: string, prevValue: string = ''): string {
  // If user deleted trailing dash
  if (prevValue.endsWith('-') && input === prevValue.slice(0, -1)) {
    const rawPrev = prevValue.replace(/\D/g, '');
    const trimmed = rawPrev.slice(0, -1);
    return formatNoTelefonRaw(trimmed, false);
  }

  const isDeleting = input.length < prevValue.length;
  const raw = input.replace(/\D/g, '').slice(0, 13);
  return formatNoTelefonRaw(raw, !isDeleting);
}

function formatNoTelefonRaw(raw: string, appendDash: boolean): string {
  if (!raw) return '';

  let prefixLen = 3;
  if (raw.startsWith('601')) {
    prefixLen = 4; // e.g. 6014-
  } else if (raw.startsWith('60')) {
    prefixLen = 3; // e.g. 603-
  } else if (raw.startsWith('01')) {
    prefixLen = 3; // e.g. 014-
  } else if (raw.startsWith('0')) {
    if (raw.startsWith('08')) {
      prefixLen = 3; // 082-, 088-
    } else {
      prefixLen = 2; // 03-, 07-, 09-
    }
  }

  if (raw.length < prefixLen) {
    return raw;
  }

  if (raw.length === prefixLen) {
    return appendDash ? `${raw}-` : raw;
  }

  const prefix = raw.slice(0, prefixLen);
  const suffix = raw.slice(prefixLen);
  return `${prefix}-${suffix}`;
}

export const TalentForm: React.FC = () => {
  const [formData, setFormData] = useState<TalentFormData>(initialFormData);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');

  const handleCheckboxArray = (key: keyof TalentFormData, value: string) => {
    setFormData((prev) => {
      const currentList = (prev[key] as string[]) || [];
      const updated = currentList.includes(value)
        ? currentList.filter((item) => item !== value)
        : [...currentList, value];
      return { ...prev, [key]: updated };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    // 1. Normalization prior to validation and database/sheet storage
    const normalizedNama = formData.namaPenuh.trim().replace(/\s+/g, ' ').toUpperCase();
    const normalizedProgram = formData.programPengajian.trim().toUpperCase();
    const normalizedIdPelajar = formatIdPelajar(formData.noIdPelajar).toUpperCase();
    const normalizedNoIc = formatNoIc(formData.noIc);
    const normalizedTelefon = formatNoTelefon(formData.noTelefon);

    // 2. Required fields validation
    if (!normalizedNama || !normalizedNoIc || !normalizedIdPelajar || !normalizedTelefon) {
      setErrorMsg('Sila lengkapkan Maklumat Peribadi (Nama Penuh, No. Kad Pengenalan / No. Isi, No. ID Pelajar, No. Telefon).');
      window.scrollTo({ top: 300, behavior: 'smooth' });
      return;
    }

    // 3. ID Pelajar Validation (Format: XXX-XXXX-XXX)
    const idPelajarRegex = /^[A-Z]{3}-[0-9]{4}-[0-9]{3}$/;
    if (!idPelajarRegex.test(normalizedIdPelajar)) {
      setErrorMsg('Format ID tidak sah. Sila gunakan format XXX-XXXX-XXX.');
      window.scrollTo({ top: 300, behavior: 'smooth' });
      return;
    }

    // 4. No. Isi / No. Kad Pengenalan Validation (Format: XXXXXX-XX-XXXX)
    const noIcRegex = /^[0-9]{6}-[0-9]{2}-[0-9]{4}$/;
    if (!noIcRegex.test(normalizedNoIc)) {
      setErrorMsg('Format No. Isi tidak sah. Sila gunakan format XXXXXX-XX-XXXX.');
      window.scrollTo({ top: 300, behavior: 'smooth' });
      return;
    }

    // 5. Acara selection validation
    if (formData.acaraDiminati.length === 0) {
      setErrorMsg('Sila pilih sekurang-kurangnya SATU Acara yang diminati di Bahagian B.');
      window.scrollTo({ top: 300, behavior: 'smooth' });
      return;
    }

    // 6. Bakat Utama validation
    if (!formData.bakatUtama) {
      setErrorMsg('Sila pilih Bidang Bakat Utama anda di Bahagian C.');
      window.scrollTo({ top: 300, behavior: 'smooth' });
      return;
    }

    // 7. Akuan validation
    if (!formData.akuanBersetuju) {
      setErrorMsg('Sila tandakan pengesahan Akuan di Bahagian G untuk meneruskan hantaran.');
      window.scrollTo({ top: 300, behavior: 'smooth' });
      return;
    }

    // Synchronize normalized state
    setFormData((prev) => ({
      ...prev,
      namaPenuh: normalizedNama,
      programPengajian: normalizedProgram,
      noIdPelajar: normalizedIdPelajar,
      noIc: normalizedNoIc,
      noTelefon: normalizedTelefon,
    }));

    const submissionPayload = {
      ...formData,
      namaPenuh: normalizedNama,
      programPengajian: normalizedProgram,
      noIdPelajar: normalizedIdPelajar,
      noIc: normalizedNoIc,
      noTelefon: normalizedTelefon,
      submittedAt: new Date().toISOString(),
    };

    // Save to Firestore real-time cloud database
    try {
      addTalentSubmissionToFirestore(submissionPayload).catch((e) => {
        console.warn('Firestore async save warning:', e);
      });
    } catch (err) {
      console.error('Failed to submit to Firestore:', err);
    }

    // Save to localStorage as backup
    try {
      const existing = JSON.parse(localStorage.getItem('kpmbp_talent_submissions') || '[]');
      existing.unshift(submissionPayload);
      localStorage.setItem('kpmbp_talent_submissions', JSON.stringify(existing));
    } catch (err) {
      console.error('Failed to save submission locally', err);
    }

    setIsSubmitted(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCopySummary = () => {
    const text = `
*BORANG PENCARIAN BAKAT KONTINJEN KPMBP (SOAR IPMA 2026)*
--------------------------------------------
*Nama:* ${formData.namaPenuh}
*ID Pelajar:* ${formData.noIdPelajar}
*No. IC:* ${formData.noIc}
*Program/Sem:* ${formData.programPengajian} (${formData.semester})
*No. Tel:* ${formData.noTelefon}
*Email:* ${formData.email}

*Acara Diminati:*
${formData.acaraDiminati.map(a => `- ${a}`).join('\n')}

*Bakat Utama:* ${formData.bakatUtama}
*Tempoh Penglibatan:* ${formData.tempohPenglibatan}
*Ringkasan Bakat:* ${formData.ringkasanBakat}

*Pernah Pertandingan:* ${formData.pernahPertandingan}
${formData.pernahPertandingan === 'Ya' ? `*Butiran:* ${formData.namaPertandingan} (${formData.tahunPertandingan}) - ${formData.peringkatPertandingan} [${formData.pencapaianPertandingan}]` : ''}
*Pernah Mewakili:* ${formData.pernahMewakili.join(', ') || 'Tiada'}

*Link Video:* ${formData.linkVideo || 'Tiada'}
*Link Sosial:* ${formData.linkSosial || 'Tiada'}

*Akuan Pengesahan:* DIPERSETUJUI
    `.trim();

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  if (isSubmitted) {
    return (
      <section className="py-10 bg-slate-50 min-h-[70vh] flex items-center justify-center px-4">
        <div className="max-w-2xl w-full bg-white rounded-3xl border border-blue-100 p-6 sm:p-8 shadow-xl text-center space-y-6">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              Pendaftaran Berjaya Hantar
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display">
              Terima Kasih, {formData.namaPenuh.split(' ')[0]}!
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto leading-relaxed">
              Pendaftaran anda untuk <strong>Pencarian Bakat Kontinjen KPMBP SOAR IPMA 2026</strong> telah direkodkan. Jawatankuasa SOAR KPMBP akan menghubungi anda untuk sesi uji bakat (audition).
            </p>
          </div>

          {/* Submission Recap Card */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-left text-xs space-y-2 text-slate-700">
            <div className="font-bold text-slate-900 border-b border-slate-200 pb-2 flex justify-between items-center">
              <span>Ringkasan Borang Pendaftaran</span>
              <span className="text-[10px] text-blue-600 bg-blue-50 px-2 py-0.5 rounded font-mono">
                {formData.noIdPelajar}
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
              <div><strong>Nama:</strong> {formData.namaPenuh}</div>
              <div><strong>Program:</strong> {formData.programPengajian} ({formData.semester})</div>
              <div><strong>No Tel:</strong> {formData.noTelefon}</div>
              <div><strong>Acara:</strong> {formData.acaraDiminati.join(', ')}</div>
              <div><strong>Bakat Utama:</strong> {formData.bakatUtama}</div>
              <div><strong>Link Video:</strong> {formData.linkVideo || 'Tiada'}</div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <a
              href={`https://wasap.my/60145313756?text=${encodeURIComponent(
                `*NOTIFIKASI PERMOHONAN BARU BAKAT KPMBP (SOAR 2026)*\n\n` +
                `*Nama:* ${formData.namaPenuh}\n` +
                `*ID Pelajar:* ${formData.noIdPelajar}\n` +
                `*Program/Sem:* ${formData.programPengajian} (${formData.semester})\n` +
                `*No. Tel:* ${formData.noTelefon}\n` +
                `*Email:* ${formData.email}\n` +
                `*Acara Diminati:* ${formData.acaraDiminati.join(', ')}\n` +
                `*Bakat Utama:* ${formData.bakatUtama}\n` +
                `*Ringkasan Bakat:* ${formData.ringkasanBakat}\n` +
                `${formData.linkVideo ? `*Link Video:* ${formData.linkVideo}\n` : ''}` +
                `\n_Permohonan ini telah dimasukkan ke dalam pangkalan data Firestore Portal SOAR KPMBP._`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs sm:text-sm shadow-md shadow-emerald-600/20 transition-all hover:scale-[1.02] cursor-pointer"
            >
              <Send className="w-4 h-4 text-emerald-200" />
              <span>Hantar Notifikasi WhatsApp ke Urusetia</span>
            </a>

            <button
              onClick={handleCopySummary}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
            >
              <Copy className="w-4 h-4" />
              <span>{copied ? 'Disalin!' : 'Salin Ringkasan'}</span>
            </button>

            <button
              onClick={() => {
                setFormData(initialFormData);
                setIsSubmitted(false);
              }}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs border border-slate-200 transition-all cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Isi Borang Baru</span>
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-8 sm:py-12 bg-slate-50 border-b border-slate-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Form Header / Intro Banner */}
        <div className="bg-gradient-to-br from-blue-700 via-indigo-700 to-blue-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden mb-8">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none -mr-16 -mt-16"></div>
          
          <div className="relative z-10 space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 border border-white/20 text-blue-100 text-xs font-bold backdrop-blur-sm">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>BORANG PENCARIAN BAKAT SOAR 2026</span>
            </div>

            <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight uppercase leading-tight text-white">
              PENCARIAN BAKAT KONTINJEN KPMBP <br />
              <span className="text-cyan-300">SOUND & RHYTHM (SOAR) IPMA 2026</span>
            </h1>

            <div className="bg-white/10 border border-white/15 rounded-2xl p-4 text-xs sm:text-sm text-blue-50 leading-relaxed space-y-2 backdrop-blur-sm">
              <p>
                Kolej Profesional MARA Bandar Penawar (KPMBP) sedang mencari pelajar yang mempunyai bakat, kemahiran dan pengalaman dalam bidang seni persembahan untuk mewakili kolej ke <strong>Sound & Rhythm (SOAR) IPMA 2026</strong>.
              </p>
              <p>
                Semua pelajar yang mempunyai minat dan bakat adalah dialu-alukan untuk mengisi borang ini. Pemilihan akhir akan dibuat melalui sesi saringan, uji bakat (audition) dan temu duga oleh Jawatankuasa SOAR KPMBP.
              </p>
            </div>
          </div>
        </div>

        {/* Error Alert Box */}
        {errorMsg && (
          <div className="mb-6 bg-rose-50 border border-rose-200 rounded-2xl p-4 text-xs text-rose-800 flex items-start gap-3 shadow-xs">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-rose-900 text-sm">Sila Semak Borang</div>
              <div>{errorMsg}</div>
            </div>
          </div>
        )}

        {/* Actual Form */}
        <form onSubmit={handleSubmit} className="space-y-8">

          {/* BAHAGIAN A: Maklumat Peribadi */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-7 shadow-xs space-y-5">
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
              <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm">
                A
              </div>
              <h2 className="font-bold text-base sm:text-lg text-slate-900">
                Maklumat Peribadi
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              {/* Nama Penuh */}
              <div className="sm:col-span-2 space-y-1">
                <label className="font-bold text-slate-700 block">Nama Penuh <span className="text-rose-500">*</span></label>
                <input
                  type="text"
                  required
                  placeholder="e.g. NUR AINA BATRISYIA BINTI ZULHILMI"
                  value={formData.namaPenuh}
                  onChange={(e) => setFormData({ ...formData, namaPenuh: e.target.value.toUpperCase() })}
                  onBlur={(e) => setFormData({ ...formData, namaPenuh: e.target.value.trim().replace(/\s+/g, ' ').toUpperCase() })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 uppercase focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* No IC */}
              <div className="space-y-1">
                <label className="font-bold text-slate-700 block">No. Kad Pengenalan / No. Isi <span className="text-rose-500">*</span></label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 861115-46-5305"
                  value={formData.noIc}
                  onChange={(e) => {
                    const formatted = formatNoIc(e.target.value, formData.noIc);
                    setFormData((prev) => ({ ...prev, noIc: formatted }));
                  }}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* No ID Pelajar */}
              <div className="space-y-1">
                <label className="font-bold text-slate-700 block">No. ID Pelajar <span className="text-rose-500">*</span></label>
                <input
                  type="text"
                  required
                  placeholder="e.g. PDA-2502-011"
                  value={formData.noIdPelajar}
                  onChange={(e) => {
                    const formatted = formatIdPelajar(e.target.value, formData.noIdPelajar);
                    setFormData((prev) => ({ ...prev, noIdPelajar: formatted }));
                  }}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 uppercase font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Program Pengajian */}
              <div className="space-y-1">
                <label className="font-bold text-slate-700 block">Program Pengajian <span className="text-rose-500">*</span></label>
                <input
                  type="text"
                  required
                  placeholder="e.g. DLM / DIA"
                  value={formData.programPengajian}
                  onChange={(e) => setFormData({ ...formData, programPengajian: e.target.value.toUpperCase() })}
                  onBlur={(e) => setFormData({ ...formData, programPengajian: e.target.value.trim().toUpperCase() })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 uppercase focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Semester */}
              <div className="space-y-1">
                <label className="font-bold text-slate-700 block">Semester <span className="text-rose-500">*</span></label>
                <select
                  value={formData.semester}
                  onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Semester 1">Semester 1</option>
                  <option value="Semester 2">Semester 2</option>
                  <option value="Semester 3">Semester 3</option>
                  <option value="Semester 4">Semester 4</option>
                  <option value="Semester 5">Semester 5</option>
                  <option value="Semester 6">Semester 6</option>
                </select>
              </div>

              {/* No Telefon */}
              <div className="space-y-1">
                <label className="font-bold text-slate-700 block">No. Telefon <span className="text-rose-500">*</span></label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. 014-5313756"
                  value={formData.noTelefon}
                  onChange={(e) => {
                    const formatted = formatNoTelefon(e.target.value, formData.noTelefon);
                    setFormData((prev) => ({ ...prev, noTelefon: formatted }));
                  }}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Email bpenawar */}
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Email bpenawar <span className="text-rose-500">*</span></label>
                <input
                  type="email"
                  required
                  placeholder="e.g. student@bpenawar.kpm.edu.my"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* BAHAGIAN B: Acara Yang Diminati */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-7 shadow-xs space-y-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
              <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm">
                B
              </div>
              <div>
                <h2 className="font-bold text-base sm:text-lg text-slate-900">
                  Acara Yang Diminati
                </h2>
                <p className="text-xs text-slate-500">Boleh pilih lebih daripada satu acara yang anda mahu sertai.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {[
                { name: 'Teater Islamik (Masar Al-Masajid)', desc: 'Lakonan, pengarahan, skrip & produksi teater', color: 'border-blue-200 bg-blue-50/50' },
                { name: 'Battle of the Band', desc: 'Gitar, bass, drum, keyboard, vokal band', color: 'border-purple-200 bg-purple-50/50' },
                { name: 'Symphonic Duo', desc: 'Duet muzik & vokal akustik/instrumen', color: 'border-cyan-200 bg-cyan-50/50' },
                { name: 'Tarian Zapin', desc: 'Tarian tradisional Zapin warisan', color: 'border-amber-200 bg-amber-50/50' },
                { name: 'Street Dakwah', desc: 'Public speaking, video kreatif, forum & dakwah', color: 'border-emerald-200 bg-emerald-50/50' }
              ].map((item) => {
                const checked = formData.acaraDiminati.includes(item.name);
                return (
                  <label
                    key={item.name}
                    onClick={() => handleCheckboxArray('acaraDiminati', item.name)}
                    className={`flex items-start gap-3 p-3.5 rounded-2xl border cursor-pointer transition-all ${
                      checked
                        ? 'border-blue-600 bg-blue-50/90 ring-2 ring-blue-500/20'
                        : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => {}} // handled by parent label onClick
                      className="mt-0.5 rounded text-blue-600 focus:ring-blue-500"
                    />
                    <div>
                      <div className="font-bold text-slate-900">{item.name}</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">{item.desc}</div>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>

          {/* BAHAGIAN C: Profil Bakat */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-7 shadow-xs space-y-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
              <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-sm">
                C
              </div>
              <h2 className="font-bold text-base sm:text-lg text-slate-900">
                Profil Bakat
              </h2>
            </div>

            <div className="space-y-4 text-xs">
              {/* 1. Bidang Bakat Utama */}
              <div className="space-y-1">
                <label className="font-bold text-slate-700">1. Apakah bidang bakat utama anda? <span className="text-rose-500">*</span></label>
                <select
                  required
                  value={formData.bakatUtama}
                  onChange={(e) => setFormData({ ...formData, bakatUtama: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">-- Pilih Bidang Utama --</option>
                  {[
                    'Lakonan',
                    'Nyanyian',
                    'Bermain Alat Muzik',
                    'Menari',
                    'Pengacaraan',
                    'Dakwah / Public Speaking',
                    'Penulisan Skrip',
                    'Pengarahan',
                    'Koreografi',
                    'Produksi',
                    'Multimedia / Video Editing',
                    'Fotografi',
                    'Lain-lain'
                  ].map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>

              {/* 2. Nyatakan Secara Ringkas */}
              <div className="space-y-1">
                <label className="font-bold text-slate-700">2. Nyatakan secara ringkas bakat atau kemahiran yang anda miliki.</label>
                <textarea
                  rows={3}
                  placeholder="Contoh: Boleh menyanyi bahagian vokal tinggi, bermain gitar akustik & keyboard, berpengalaman mengarahkan teater ringkas..."
                  value={formData.ringkasanBakat}
                  onChange={(e) => setFormData({ ...formData, ringkasanBakat: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* 3. Tempoh Penglibatan */}
              <div className="space-y-1">
                <label className="font-bold text-slate-700">3. Sudah berapa lama anda berkecimpung dalam bidang tersebut?</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                  {['Kurang 1 tahun', '1-3 tahun', '3-5 tahun', 'Lebih 5 tahun'].map((opt) => (
                    <label
                      key={opt}
                      className={`flex items-center gap-2 p-2.5 rounded-xl border cursor-pointer text-xs transition-all ${
                        formData.tempohPenglibatan === opt
                          ? 'border-blue-600 bg-blue-50 font-bold text-blue-900'
                          : 'border-slate-200 bg-slate-50 text-slate-700'
                      }`}
                    >
                      <input
                        type="radio"
                        name="tempohPenglibatan"
                        checked={formData.tempohPenglibatan === opt}
                        onChange={() => setFormData({ ...formData, tempohPenglibatan: opt })}
                        className="text-blue-600 focus:ring-blue-500"
                      />
                      <span>{opt}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* BAHAGIAN D: Pengalaman */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-7 shadow-xs space-y-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
              <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-sm">
                D
              </div>
              <h2 className="font-bold text-base sm:text-lg text-slate-900">
                Pengalaman Pertandingan & Persembahan
              </h2>
            </div>

            <div className="space-y-4 text-xs">
              {/* Pernah menyertai pertandingan */}
              <div className="space-y-1">
                <label className="font-bold text-slate-700">1. Pernah menyertai pertandingan?</label>
                <div className="flex gap-4 pt-1">
                  {['Ya', 'Tidak'].map((val) => (
                    <label key={val} className="flex items-center gap-2 cursor-pointer font-semibold text-slate-800">
                      <input
                        type="radio"
                        name="pernahPertandingan"
                        checked={formData.pernahPertandingan === val}
                        onChange={() => setFormData({ ...formData, pernahPertandingan: val })}
                        className="text-blue-600 focus:ring-blue-500"
                      />
                      <span>{val}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Conditional If Ya */}
              {formData.pernahPertandingan === 'Ya' && (
                <div className="p-4 bg-amber-50/60 border border-amber-200 rounded-2xl space-y-3">
                  <div className="font-bold text-amber-900 text-xs">Butiran Pertandingan Yang Pernah Disertai:</div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="Nama Pertandingan (e.g. Festival Teater Sekolah)"
                      value={formData.namaPertandingan}
                      onChange={(e) => setFormData({ ...formData, namaPertandingan: e.target.value })}
                      className="bg-white border border-amber-200 rounded-xl px-3 py-2 text-xs text-slate-800"
                    />
                    <input
                      type="text"
                      placeholder="Tahun (e.g. 2023)"
                      value={formData.tahunPertandingan}
                      onChange={(e) => setFormData({ ...formData, tahunPertandingan: e.target.value })}
                      className="bg-white border border-amber-200 rounded-xl px-3 py-2 text-xs text-slate-800"
                    />
                    <input
                      type="text"
                      placeholder="Peringkat (e.g. Kebangsaan / Daerah)"
                      value={formData.peringkatPertandingan}
                      onChange={(e) => setFormData({ ...formData, peringkatPertandingan: e.target.value })}
                      className="bg-white border border-amber-200 rounded-xl px-3 py-2 text-xs text-slate-800"
                    />
                    <input
                      type="text"
                      placeholder="Pencapaian (e.g. Johan / Naib Johan)"
                      value={formData.pencapaianPertandingan}
                      onChange={(e) => setFormData({ ...formData, pencapaianPertandingan: e.target.value })}
                      className="bg-white border border-amber-200 rounded-xl px-3 py-2 text-xs text-slate-800"
                    />
                  </div>
                </div>
              )}

              {/* 2. Pernah Mewakili */}
              <div className="space-y-1">
                <label className="font-bold text-slate-700">2. Pernah mewakili:</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1">
                  {['Sekolah', 'Kolej', 'Daerah', 'Negeri', 'Kebangsaan', 'Antarabangsa'].map((level) => {
                    const checked = formData.pernahMewakili.includes(level);
                    return (
                      <label
                        key={level}
                        onClick={() => handleCheckboxArray('pernahMewakili', level)}
                        className={`flex items-center gap-2 p-2.5 rounded-xl border cursor-pointer text-xs transition-all ${
                          checked
                            ? 'border-blue-600 bg-blue-50 font-bold text-blue-900'
                            : 'border-slate-200 bg-slate-50 text-slate-700'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => {}}
                          className="rounded text-blue-600"
                        />
                        <span>{level}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* 3. Ceritakan pengalaman anda */}
              <div className="space-y-1">
                <label className="font-bold text-slate-700">3. Ceritakan pengalaman anda secara ringkas.</label>
                <textarea
                  rows={3}
                  placeholder="Contoh: Pernah memegang watak utama dalam teater. Pernah menjadi pemain keyboard dalam Battle of the Band. Pernah menyertai pertandingan Zapin."
                  value={formData.ceritaPengalaman}
                  onChange={(e) => setFormData({ ...formData, ceritaPengalaman: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* BAHAGIAN E: Maklumat Mengikut Acara */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-7 shadow-xs space-y-6">
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
              <div className="w-8 h-8 rounded-xl bg-cyan-100 text-cyan-700 flex items-center justify-center font-bold text-sm">
                E
              </div>
              <div>
                <h2 className="font-bold text-base sm:text-lg text-slate-900">
                  Maklumat Mengikut Acara Yang Dipilih
                </h2>
                <p className="text-xs text-slate-500">Sila isi bahagian berkaitan mengikut acara yang anda pilih di Bahagian B.</p>
              </div>
            </div>

            {/* Sub-section: Teater Islamik */}
            {(formData.acaraDiminati.includes('Teater Islamik (Masar Al-Masajid)') || formData.acaraDiminati.length === 0) && (
              <div className="bg-blue-50/50 border border-blue-200 rounded-2xl p-4 sm:p-5 space-y-3">
                <div className="font-extrabold text-blue-900 text-sm flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                  Teater Islamik (Masar Al-Masajid)
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="font-bold text-slate-700">Pernah berlakon?</label>
                    <div className="flex gap-4 pt-1">
                      {['Ya', 'Tidak'].map((val) => (
                        <label key={val} className="flex items-center gap-2 cursor-pointer text-slate-800">
                          <input
                            type="radio"
                            name="teaterPernahBerlakon"
                            checked={formData.teaterPernahBerlakon === val}
                            onChange={() => setFormData({ ...formData, teaterPernahBerlakon: val })}
                            className="text-blue-600"
                          />
                          <span>{val}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="font-bold text-slate-700">Watak yang biasa dibawa:</label>
                    <select
                      value={formData.teaterWatakBiasa}
                      onChange={(e) => setFormData({ ...formData, teaterWatakBiasa: e.target.value })}
                      className="w-full bg-white border border-blue-200 rounded-xl px-3 py-1.5 text-xs mt-1"
                    >
                      {['Hero', 'Heroine', 'Antagonis', 'Komedi', 'Watak Pembantu', 'Lain-lain'].map((w) => (
                        <option key={w} value={w}>{w}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="text-xs space-y-1">
                  <label className="font-bold text-slate-700">Pernah menjadi:</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1">
                    {['Pelakon', 'Pengarah', 'Penulis Skrip', 'Stage Manager', 'Props', 'Multimedia', 'Makeup', 'Lighting', 'Sound'].map((role) => {
                      const checked = formData.teaterPeranan.includes(role);
                      return (
                        <label
                          key={role}
                          onClick={() => handleCheckboxArray('teaterPeranan', role)}
                          className={`flex items-center gap-2 p-2 rounded-xl border cursor-pointer text-xs ${
                            checked ? 'bg-blue-600 text-white font-bold border-blue-600' : 'bg-white border-blue-200 text-slate-700'
                          }`}
                        >
                          <input type="checkbox" checked={checked} onChange={() => {}} className="rounded" />
                          <span>{role}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                <textarea
                  rows={2}
                  placeholder="Nyatakan pengalaman teater secara terperinci (jika ada)..."
                  value={formData.teaterPengalaman}
                  onChange={(e) => setFormData({ ...formData, teaterPengalaman: e.target.value })}
                  className="w-full bg-white border border-blue-200 rounded-xl px-3 py-2 text-xs"
                />
              </div>
            )}

            {/* Sub-section: Battle of the Band */}
            {(formData.acaraDiminati.includes('Battle of the Band') || formData.acaraDiminati.length === 0) && (
              <div className="bg-purple-50/50 border border-purple-200 rounded-2xl p-4 sm:p-5 space-y-3">
                <div className="font-extrabold text-purple-900 text-sm flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-purple-600"></span>
                  Battle of the Band
                </div>

                <div className="text-xs space-y-1">
                  <label className="font-bold text-slate-700">Instrumen yang dimainkan:</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1">
                    {['Guitar Lead', 'Guitar Rhythm', 'Bass', 'Drum', 'Keyboard', 'Vocal', 'Rap', 'Cajon', 'Lain-lain'].map((inst) => {
                      const checked = formData.botbInstrumen.includes(inst);
                      return (
                        <label
                          key={inst}
                          onClick={() => handleCheckboxArray('botbInstrumen', inst)}
                          className={`flex items-center gap-2 p-2 rounded-xl border cursor-pointer text-xs ${
                            checked ? 'bg-purple-600 text-white font-bold border-purple-600' : 'bg-white border-purple-200 text-slate-700'
                          }`}
                        >
                          <input type="checkbox" checked={checked} onChange={() => {}} className="rounded" />
                          <span>{inst}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                <div className="text-xs space-y-1">
                  <label className="font-bold text-slate-700">Genre kegemaran:</label>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {['Rock', 'Pop', 'Jazz', 'Ballad', 'Acoustic', 'Metal', 'Indie'].map((g) => (
                      <label
                        key={g}
                        className={`px-3 py-1.5 rounded-xl border text-xs cursor-pointer font-semibold ${
                          formData.botbGenre === g ? 'bg-purple-600 text-white border-purple-600' : 'bg-white border-purple-200 text-slate-700'
                        }`}
                      >
                        <input
                          type="radio"
                          name="botbGenre"
                          checked={formData.botbGenre === g}
                          onChange={() => setFormData({ ...formData, botbGenre: g })}
                          className="hidden"
                        />
                        <span>{g}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Sub-section: Symphonic Duo */}
            {(formData.acaraDiminati.includes('Symphonic Duo') || formData.acaraDiminati.length === 0) && (
              <div className="bg-cyan-50/50 border border-cyan-200 rounded-2xl p-4 sm:p-5 space-y-3">
                <div className="font-extrabold text-cyan-900 text-sm flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-cyan-600"></span>
                  Symphonic Duo
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <input
                    type="text"
                    placeholder="Instrumen Pertama (e.g. Vokal / Gitar / Biola)"
                    value={formData.duoInstrumenUtama}
                    onChange={(e) => setFormData({ ...formData, duoInstrumenUtama: e.target.value })}
                    className="bg-white border border-cyan-200 rounded-xl px-3 py-2"
                  />
                  <input
                    type="text"
                    placeholder="Instrumen Kedua (jika ada, e.g. Ukulele)"
                    value={formData.duoInstrumenKedua}
                    onChange={(e) => setFormData({ ...formData, duoInstrumenKedua: e.target.value })}
                    className="bg-white border border-cyan-200 rounded-xl px-3 py-2"
                  />
                </div>

                <div className="text-xs space-y-1">
                  <label className="font-bold text-slate-700">Tahap Penguasaan:</label>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {['Pemula', 'Pertengahan', 'Mahir', 'Profesional'].map((lvl) => (
                      <label
                        key={lvl}
                        className={`px-3 py-1.5 rounded-xl border text-xs cursor-pointer font-semibold ${
                          formData.duoTahapPenguasaan === lvl ? 'bg-cyan-600 text-white border-cyan-600' : 'bg-white border-cyan-200 text-slate-700'
                        }`}
                      >
                        <input
                          type="radio"
                          name="duoTahapPenguasaan"
                          checked={formData.duoTahapPenguasaan === lvl}
                          onChange={() => setFormData({ ...formData, duoTahapPenguasaan: lvl })}
                          className="hidden"
                        />
                        <span>{lvl}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Sub-section: Tarian Zapin */}
            {(formData.acaraDiminati.includes('Tarian Zapin') || formData.acaraDiminati.length === 0) && (
              <div className="bg-amber-50/50 border border-amber-200 rounded-2xl p-4 sm:p-5 space-y-3">
                <div className="font-extrabold text-amber-900 text-sm flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-600"></span>
                  Tarian Zapin
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="font-bold text-slate-700">Pernah menari Zapin?</label>
                    <div className="flex gap-4 pt-1">
                      {['Ya', 'Tidak'].map((val) => (
                        <label key={val} className="flex items-center gap-2 cursor-pointer text-slate-800">
                          <input
                            type="radio"
                            name="zapinPernahMenari"
                            checked={formData.zapinPernahMenari === val}
                            onChange={() => setFormData({ ...formData, zapinPernahMenari: val })}
                            className="text-amber-600"
                          />
                          <span>{val}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <input
                    type="text"
                    placeholder="Berapa tahun pengalaman? (e.g. 2 tahun)"
                    value={formData.zapinTahunPengalaman}
                    onChange={(e) => setFormData({ ...formData, zapinTahunPengalaman: e.target.value })}
                    className="bg-white border border-amber-200 rounded-xl px-3 py-2"
                  />
                </div>
              </div>
            )}

            {/* Sub-section: Street Dakwah */}
            {(formData.acaraDiminati.includes('Street Dakwah') || formData.acaraDiminati.length === 0) && (
              <div className="bg-emerald-50/50 border border-emerald-200 rounded-2xl p-4 sm:p-5 space-y-3">
                <div className="font-extrabold text-emerald-900 text-sm flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                  Street Dakwah
                </div>

                <div className="text-xs space-y-1">
                  <label className="font-bold text-slate-700">Pernah terlibat dengan:</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1">
                    {[
                      'Pengucapan Awam',
                      'Debat',
                      'Forum',
                      'Dakwah',
                      'Penhhasilan Video',
                      'Content Creator',
                      'Pengacaraan'
                    ].map((item) => {
                      const checked = formData.dakwahPenglibatan.includes(item);
                      return (
                        <label
                          key={item}
                          onClick={() => handleCheckboxArray('dakwahPenglibatan', item)}
                          className={`flex items-center gap-2 p-2 rounded-xl border cursor-pointer text-xs ${
                            checked ? 'bg-emerald-600 text-white font-bold border-emerald-600' : 'bg-white border-emerald-200 text-slate-700'
                          }`}
                        >
                          <input type="checkbox" checked={checked} onChange={() => {}} className="rounded" />
                          <span>{item}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                <textarea
                  rows={2}
                  placeholder="Nyatakan pengalaman Street Dakwah / Pengucapan Awam anda..."
                  value={formData.dakwahPengalaman}
                  onChange={(e) => setFormData({ ...formData, dakwahPengalaman: e.target.value })}
                  className="w-full bg-white border border-emerald-200 rounded-xl px-3 py-2 text-xs"
                />
              </div>
            )}

            {/* Media & Social Links */}
            <div className="pt-3 border-t border-slate-100 space-y-3 text-xs">
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 flex items-center gap-1.5">
                  <Video className="w-4 h-4 text-blue-600" />
                  <span>Link Video Persembahan / Bakat</span>
                </label>
                <input
                  type="url"
                  placeholder="e.g. https://www.youtube.com/watch?v=..."
                  value={formData.linkVideo}
                  onChange={(e) => setFormData({ ...formData, linkVideo: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800"
                />
                
                {/* Instruction Box as specified */}
                <div className="p-3 bg-blue-50/80 border border-blue-200 rounded-xl text-[11px] text-blue-900 leading-relaxed space-y-1">
                  <div className="font-bold text-blue-950 flex items-center gap-1">
                    <HelpCircle className="w-3.5 h-3.5 text-blue-600" />
                    <span>Cadangan Arahan Video:</span>
                  </div>
                  <p>
                    Muat naik video bakat anda ke YouTube dan tetapkan sebagai <strong>Unlisted</strong>. Salin pautan (URL) video tersebut dan tampalkan di ruang ini. Video boleh berupa nyanyian, lakonan, tarian, permainan alat muzik, pengucapan awam atau apa-apa persembahan yang berkaitan dengan acara yang dipilih.
                  </p>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 flex items-center gap-1.5">
                  <LinkIcon className="w-4 h-4 text-slate-500" />
                  <span>Link TikTok / Instagram / Facebook / YouTube (jika ada)</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. @nama_akaun atau link profil anda"
                  value={formData.linkSosial}
                  onChange={(e) => setFormData({ ...formData, linkSosial: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800"
                />
              </div>
            </div>
          </div>

          {/* BAHAGIAN F: Komitmen */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-7 shadow-xs space-y-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
              <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm">
                F
              </div>
              <h2 className="font-bold text-base sm:text-lg text-slate-900">
                Komitmen Pelajar
              </h2>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="font-bold text-slate-700">Saya bersedia:</div>
              {[
                { key: 'komitmenUjiBakat', label: 'Menghadiri sesi uji bakat' },
                { key: 'komitmenLatihanBerkala', label: 'Menghadiri latihan berkala' },
                { key: 'komitmenLatihanHujungMinggu', label: 'Menghadiri latihan hujung minggu jika diperlukan' },
                { key: 'komitmenMenyertai', label: 'Menyertai SOAR 2026 sekiranya dipilih' }
              ].map((item) => {
                const checked = formData[item.key as keyof TalentFormData] as boolean;
                return (
                  <label
                    key={item.key}
                    className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                      checked ? 'border-emerald-500 bg-emerald-50/80 font-bold text-emerald-950' : 'border-slate-200 bg-slate-50 text-slate-700'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={(e) => setFormData({ ...formData, [item.key]: e.target.checked })}
                      className="rounded text-emerald-600 focus:ring-emerald-500"
                    />
                    <span>{item.label}</span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* BAHAGIAN G: Akuan */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-7 shadow-xs space-y-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
              <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center font-bold text-sm">
                G
              </div>
              <h2 className="font-bold text-base sm:text-lg text-slate-900">
                Akuan & Pengesahan
              </h2>
            </div>

            <div className="space-y-3 text-xs">
              <p className="text-slate-600 leading-relaxed">
                Saya mengesahkan bahawa semua maklumat yang diberikan dalam borang pencarian bakat ini adalah benar dan sahih.
              </p>

              <label className={`flex items-center gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                formData.akuanBersetuju ? 'border-blue-600 bg-blue-50 font-bold text-blue-950 ring-2 ring-blue-500/20' : 'border-slate-200 bg-slate-50 text-slate-700'
              }`}>
                <input
                  type="checkbox"
                  required
                  checked={formData.akuanBersetuju}
                  onChange={(e) => setFormData({ ...formData, akuanBersetuju: e.target.checked })}
                  className="rounded text-blue-600 focus:ring-blue-500"
                />
                <span>Saya bersetuju & mengesahkan maklumat di atas.</span>
              </label>
            </div>
          </div>

          {/* Submit Error Message if any */}
          {errorMsg && (
            <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 text-xs text-rose-800 flex items-start gap-3 shadow-xs">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <div className="font-bold text-rose-900 text-sm">Sila Semak Borang</div>
                <div>{errorMsg}</div>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className="pt-2 text-center">
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-extrabold text-sm sm:text-base shadow-lg shadow-blue-600/30 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer w-full sm:w-auto"
            >
              <Send className="w-5 h-5" />
              <span>Hantar Borang Pencarian Bakat</span>
            </button>
          </div>

        </form>
      </div>
    </section>
  );
};
