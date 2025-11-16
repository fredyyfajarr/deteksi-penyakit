'use client'; // Diperlukan di Next.js untuk komponen interaktif

import React, { useState } from 'react';
import { Check, X, Stethoscope, RefreshCw } from 'lucide-react'; // Impor ikon

// --- Data Konsep Anda ---

// 1. Daftar semua gejala yang mungkin (Diambil dari Jurnal - Tabel 2)
const allSymptoms = [
  { id: 'G001', name: 'G001: Demam' },
  { id: 'G002', name: 'G002: Batuk-Batuk' },
  { id: 'G003', name: 'G003: Hidung Tersumbat/Pilek' },
  { id: 'G004', name: 'G004: Sakit Kepala/Pusing' },
  { id: 'G005', name: 'G005: Sakit Tenggorokan' },
  { id: 'G006', name: 'G006: Susah Menelan' },
  { id: 'G007', name: 'G007: Badan Lemas & Lesu' },
  { id: 'G008', name: 'G008: Sesak Nafas' },
  { id: 'G009', name: 'G009: Bersin-Bersin' },
  { id: 'G010', name: 'G010: Frekuensi Nafas Cepat' },
  { id: 'G011', name: 'G011: Suara Nafas Kasar' },
  { id: 'G012', name: 'G012: Nafsu Makan Berkurang' },
  { id: 'G013', name: 'G013: Suara Serak' },
  { id: 'G014', name: 'G014: Gelisah' },
  { id: 'G015', name: 'G015: Susah Tidur' },
  { id: 'G016', name: 'G016: Nyeri Di Dada' },
  { id: 'G017', name: 'G017: Berkurangnya Kemampuan Indra Penciuman' },
  { id: 'G018', name: 'G018: Wajah Terasa Nyeri Atau Tertekan' },
  { id: 'G019', name: 'G019: Bau Mulut' },
  { id: 'G020', name: 'G020: Sakit Gigi' },
  { id: 'G021', name: 'G021: Nyeri Sendi Atau Nyeri Otot' },
  { id: 'G022', name: 'G022: Berkeringat Dan Menggigil' },
  { id: 'G023', name: 'G023: Batuk Dengan Dahak Kental (Hijau/Kuning/Darah)' },
  { id: 'G024', name: 'G024: Diare' },
  { id: 'G025', name: 'G025: Mual Atau Muntah' },
  { id: 'G026', name: 'G026: Nyeri Bahu Dan Punggung' },
  { id: 'G027', name: 'G027: Hidung Berair' },
  { id: 'G028', name: 'G028: Nyeri Telinga' },
  { id: 'G029', name: 'G029: Mata Berair' },
  { id: 'G030', name: 'G030: Dehidrasi' },
];

// 2. Aturan diagnosis penyakit (Rule Base) (Diambil dari Jurnal - Tabel 1 & 3)
const diseaseRules = [
  // R1 -> P001 (Bronkitis)
  {
    name: 'Bronkitis (P001)',
    symptoms: ['G001', 'G002', 'G003', 'G007', 'G008', 'G011', 'G023', 'G027'],
    description:
      'Berdasarkan aturan R1 dari jurnal. Segera konsultasikan dengan dokter untuk diagnosis profesional.',
  },
  // R2 -> P002 (Sinusitis)
  {
    name: 'Sinusitis (P002)',
    symptoms: [
      'G001',
      'G002',
      'G003',
      'G004',
      'G008',
      'G009',
      'G010',
      'G013',
      'G015',
      'G017',
      'G018',
      'G019',
      'G020',
    ],
    description:
      'Berdasarkan aturan R2 dari jurnal. Segera konsultasikan dengan dokter untuk diagnosis profesional.',
  },
  // R3 -> P003 (Bronkiolitis)
  {
    name: 'Bronkiolitis (P003)',
    symptoms: [
      'G001',
      'G002',
      'G007',
      'G008',
      'G010',
      'G011',
      'G012',
      'G015',
      'G030',
    ],
    description:
      'Berdasarkan aturan R3 dari jurnal. Segera konsultasikan dengan dokter untuk diagnosis profesional.',
  },
  // R4 -> P004 (Pneumonia)
  {
    name: 'Pneumonia (P004)',
    symptoms: [
      'G001',
      'G002',
      'G004',
      'G008',
      'G010',
      'G012',
      'G016',
      'G023',
      'G024',
      'G025',
    ],
    description:
      'Berdasarkan aturan R4 dari jurnal. Segera konsultasikan dengan dokter untuk diagnosis profesional.',
  },
  // R5 -> P005 (Faringitis)
  {
    name: 'Faringitis (P005)',
    symptoms: [
      'G001',
      'G002',
      'G004',
      'G005',
      'G006',
      'G007',
      'G009',
      'G012',
      'G013',
      'G025',
    ],
    description:
      'Berdasarkan aturan R5 dari jurnal. Segera konsultasikan dengan dokter untuk diagnosis profesional.',
  },
  // R6 -> P006 (Epiglotitis)
  {
    name: 'Epiglotitis (P006)',
    symptoms: ['G001', 'G004', 'G005', 'G006', 'G011', 'G013', 'G014'],
    description:
      'Berdasarkan aturan R6 dari jurnal. Segera konsultasikan dengan dokter untuk diagnosis profesional.',
  },
  // R7 -> P007 (Pleuritis)
  {
    name: 'Pleuritis (P007)',
    symptoms: [
      'G001',
      'G002',
      'G008',
      'G010',
      'G016',
      'G021',
      'G022',
      'G023',
      'G026',
    ],
    description:
      'Berdasarkan aturan R7 dari jurnal. Segera konsultasikan dengan dokter untuk diagnosis profesional.',
  },
  // R8 -> P008 (Common Cold)
  {
    name: 'Common Cold (P008)',
    symptoms: [
      'G001',
      'G002',
      'G003',
      'G004',
      'G009',
      'G013',
      'G017',
      'G027',
      'G029',
    ],
    description:
      'Berdasarkan aturan R8 dari jurnal. Segera konsultasikan dengan dokter untuk diagnosis profesional.',
  },
  // R9 -> P009 (ILI / Influenza Like Illness)
  {
    name: 'ILI (Influenza Like Illness) (P009)',
    symptoms: [
      'G001',
      'G002',
      'G003',
      'G004',
      'G005',
      'G006',
      'G007',
      'G008',
      'G009',
      'G010',
      'G011',
      'G012',
      'G013',
      'G017',
      'G022',
      'G029',
    ],
    description:
      'Berdasarkan aturan R9 dari jurnal. Segera konsultasikan dengan dokter untuk diagnosis profesional.',
  },
];

// --- Komponen Utama Aplikasi ---

export default function App() {
  // State untuk melacak gejala yang diceklis (menggunakan Set agar lebih efisien)
  const [checkedSymptoms, setCheckedSymptoms] = useState(new Set());

  // State untuk menyimpan hasil diagnosis
  const [diagnosis, setDiagnosis] = useState(null);

  // State untuk menandai jika tidak ada aturan yang cocok
  const [noMatch, setNoMatch] = useState(false);

  /**
   * Menangani perubahan pada checkbox.
   * @param {string} symptomId - ID dari gejala yang di-klik
   */
  const handleCheckboxChange = (symptomId) => {
    // Buat salinan baru dari Set untuk memicu re-render
    const newChecked = new Set(checkedSymptoms);

    if (newChecked.has(symptomId)) {
      newChecked.delete(symptomId); // Hapus jika sudah ada (uncheck)
    } else {
      newChecked.add(symptomId); // Tambah jika belum ada (check)
    }

    setCheckedSymptoms(newChecked);

    // Reset hasil diagnosis setiap kali ada perubahan
    setDiagnosis(null);
    setNoMatch(false);
  };

  /**
   * Menjalankan proses diagnosis berdasarkan gejala yang diceklis.
   */
  const handleDiagnose = () => {
    // Ambil semua ID gejala yang diceklis dan urutkan
    const selectedIds = Array.from(checkedSymptoms).sort();

    // Ubah array ID menjadi string unik untuk perbandingan
    const selectedKey = selectedIds.join('+');

    let foundRule = null;

    // Cari aturan yang cocok
    for (const rule of diseaseRules) {
      // Urutkan gejala di aturan dan buat key
      const ruleKey = [...rule.symptoms].sort().join('+');

      // Bandingkan apakah gejala yang dipilih SAMA PERSIS dengan aturan
      if (selectedKey === ruleKey) {
        foundRule = rule;
        break; // Hentikan pencarian jika sudah ketemu
      }
    }

    if (foundRule) {
      setDiagnosis(foundRule);
      setNoMatch(false);
    } else if (selectedIds.length > 0) {
      // Jika ada gejala dipilih tapi tidak ada aturan cocok
      setDiagnosis(null);
      setNoMatch(true);
    } else {
      // Jika tidak ada gejala dipilih
      setDiagnosis(null);
      setNoMatch(false);
    }
  };

  /**
   * Mereset semua pilihan dan hasil.
   */
  const handleReset = () => {
    setCheckedSymptoms(new Set());
    setDiagnosis(null);
    setNoMatch(false);
  };

  return (
    <div className="flex justify-center items-start min-h-screen bg-gray-100 p-4 sm:p-8 font-inter">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* --- Header --- */}
        <div className="p-6 sm:p-8 bg-gradient-to-r from-blue-600 to-blue-500 text-white">
          <div className="flex items-center space-x-4">
            <Stethoscope size={40} />
            <div>
              <h1 className="text-3xl font-bold">Pendeteksi Penyakit (Demo)</h1>
              <p className="text-blue-100 mt-1">
                Pilih gejala yang Anda rasakan untuk melihat kemungkinan
                diagnosis.
              </p>
            </div>
          </div>
        </div>

        {/* --- Konten Utama --- */}
        <div className="p-6 sm:p-8">
          {/* --- Peringatan --- */}
          <div className="mb-6 p-4 bg-yellow-100 border-l-4 border-yellow-500 rounded-r-lg">
            <p className="text-yellow-800 font-semibold">
              <span className="font-bold">Perhatian:</span> Ini adalah aplikasi
              demo berdasarkan aturan sederhana.
              <span className="font-bold">
                {' '}
                Jangan gunakan untuk diagnosis medis sungguhan.
              </span>
              Selalu konsultasikan dengan dokter profesional.
            </p>
          </div>

          {/* --- Daftar Gejala --- */}
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            1. Pilih Gejala
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            {allSymptoms.map((symptom) => (
              <label
                key={symptom.id}
                className={`flex items-center space-x-3 p-4 rounded-lg border-2 transition-all cursor-pointer ${
                  checkedSymptoms.has(symptom.id)
                    ? 'border-blue-500 bg-blue-50 shadow-md'
                    : 'border-gray-200 bg-white hover:bg-gray-50'
                }`}
              >
                <input
                  type="checkbox"
                  checked={checkedSymptoms.has(symptom.id)}
                  onChange={() => handleCheckboxChange(symptom.id)}
                  className="w-5 h-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                />
                <span className="text-gray-700 font-medium select-none">
                  {symptom.name}
                </span>
              </label>
            ))}
          </div>

          {/* --- Tombol Aksi --- */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <button
              onClick={handleDiagnose}
              disabled={checkedSymptoms.size === 0}
              className="flex-1 flex justify-center items-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-all disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              <Check size={20} />
              Cek Diagnosis
            </button>
            <button
              onClick={handleReset}
              className="flex-1 flex justify-center items-center gap-2 px-6 py-3 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300 transition-all"
            >
              <RefreshCw size={18} />
              Reset
            </button>
          </div>

          {/* --- Hasil Diagnosis --- */}
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            2. Hasil Diagnosis
          </h2>

          {/* Jika ada diagnosis */}
          {diagnosis && (
            <div className="p-6 bg-green-100 border-l-4 border-green-500 rounded-r-lg shadow-md animate-fade-in">
              <h3 className="text-xl font-bold text-green-800">
                Kemungkinan Penyakit:
              </h3>
              <p className="text-3xl font-extrabold text-green-900 mt-1 mb-3">
                {diagnosis.name}
              </p>
              <p className="text-green-700">{diagnosis.description}</p>
            </div>
          )}

          {/* Jika tidak ada aturan yang cocok */}
          {noMatch && (
            <div className="p-6 bg-yellow-100 border-l-4 border-yellow-500 rounded-r-lg shadow-md animate-fade-in">
              <h3 className="text-xl font-bold text-yellow-800">
                Tidak Ditemukan
              </h3>
              <p className="text-yellow-700 mt-1">
                Kombinasi gejala yang Anda pilih tidak cocok dengan aturan
                penyakit manapun yang ada di sistem kami. Coba kombinasi lain
                atau konsultasikan dengan dokter.
              </p>
            </div>
          )}

          {/* Jika belum ada aksi */}
          {!diagnosis && !noMatch && (
            <div className="p-6 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg text-center">
              <p className="text-gray-500">
                Hasil diagnosis akan muncul di sini setelah Anda memilih gejala
                dan menekan tombol "Cek Diagnosis".
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// CSS untuk animasi sederhana (opsional, tapi disarankan)
// Anda bisa tambahkan ini di file CSS global Anda (misal: app/globals.css)
/*
@keyframes fade-in {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-fade-in {
  animation: fade-in 0.3s ease-out;
}
*/
