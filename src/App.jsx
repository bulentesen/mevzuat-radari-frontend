import { useEffect, useState } from "react";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";

export default function App() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/mevzuatlar`);
      const data = await res.json();
      setItems(data);
    } catch (e) {
      console.error("API Hatası:", e);
      setItems([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <header className="max-w-4xl mx-auto mb-6">
        <h1 className="text-3xl font-bold text-blue-700">Mevzuat Radarı</h1>
        <p className="text-gray-600">Sektöre göre filtrelenmiş son mevzuatlar.</p>
      </header>

      <main className="max-w-4xl mx-auto bg-white rounded-2xl shadow p-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xl font-semibold">Akış</h2>
          <button onClick={load} className="px-3 py-1 rounded bg-blue-600 text-white">
            Yenile
          </button>
        </div>

        {loading && <div>Yükleniyor…</div>}

        <ul>
          {items.map((m) => (
            <li key={m.id} className="border-b py-3">
              <div className="font-medium">📜 {m.baslik}</div>
              <div className="text-sm text-gray-600">{m.ozet}</div>
              {m.kaynak && (
                <a className="text-blue-600 text-sm" href={m.kaynak} target="_blank" rel="noreferrer">
                  Orijinal Kaynak
                </a>
              )}
            </li>
          ))}
          {items.length === 0 && !loading && (
            <li className="text-gray-500">Gösterilecek kayıt yok (şimdilik mock veri bekleniyor).</li>
          )}
        </ul>
      </main>
    </div>
  );
}
