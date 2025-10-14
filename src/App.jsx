import { useEffect, useState } from "react";
import Onboarding from "./Onboarding.jsx";
import AdminForm from "./AdminForm.jsx";
import { SECTORS } from "./constants";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";

export default function App() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [q, setQ] = useState("");
  const [sector, setSector] = useState("");

  async function load() {
    setLoading(true);
    setErr("");
    try {
      const urlObj = new URL(`${API_BASE}/feed`);
      if (q) urlObj.searchParams.set("q", q);
      if (sector) urlObj.searchParams.set("sector", sector);
      const res = await fetch(urlObj.toString());
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setItems(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error("API Hatası:", e);
      setErr("Veri yüklenemedi. Birazdan tekrar deneyin.");
      setItems([]);
    } finally {
      setLoading(false);
    }
  }

  async function loadPersonal() {
    const email = localStorage.getItem("mr_email");
    if (!email) {
      alert("Önce Onboarding'de e-posta girin.");
      return;
    }
    setLoading(true);
    setErr("");
    try {
      const res = await fetch(
        `${API_BASE}/feed/personal?email=${encodeURIComponent(email)}`
      );
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setItems(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error("API Hatası (personal):", e);
      setErr("Kişisel akış yüklenemedi.");
      setItems([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <header className="max-w-4xl mx-auto mb-6">
        <h1 className="text-3xl font-bold text-blue-700">Mevzuat Radarı • v0.2</h1>
        <p className="text-gray-600">Sektöre göre filtrelenmiş son mevzuatlar.</p>
      </header>

      <main className="max-w-4xl mx-auto space-y-6">
        {/* Onboarding */}
        <section className="bg-white rounded-2xl shadow p-4">
          <Onboarding />
        </section>

        {/* Admin: Mevzuat Ekle (MVP) */}
        <section>
          <AdminForm onCreated={() => load()} />
        </section>

        {/* Akış */}
        <section className="bg-white rounded-2xl shadow p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xl font-semibold">Akış</h2>
            <div className="flex gap-2">
              <button
                onClick={load}
                className="px-3 py-1 rounded bg-blue-600 text-white"
              >
                Yenile
              </button>
              <button
                onClick={loadPersonal}
                className="px-3 py-1 rounded bg-emerald-600 text-white"
              >
                Kişisel Akış
              </button>
            </div>
          </div>

          {/* Arama + Sektör filtresi */}
          <div className="flex items-center gap-2 mb-4">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Ara: KDV, KVKK, e-fatura..."
              className="flex-1 border rounded p-2"
            />
            <select
              value={sector}
              onChange={(e) => setSector(e.target.value)}
              className="border rounded p-2"
            >
              <option value="">Sektör (hepsi)</option>
              {SECTORS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            <button
              onClick={load}
              className="px-3 py-2 rounded bg-blue-600 text-white"
            >
              Ara
            </button>
          </div>

          {loading && <div>Yükleniyor… (backend uyanıyor olabilir)</div>}
          {err && <div className="text-red-600 text-sm mb-2">{err}</div>}

          <ul>
            {items.map((m) => (
              <li key={m.id} className="border-b py-3">
                <div className="font-medium">📜 {m.baslik}</div>
                <div className="text-sm text-gray-600">{m.ozet}</div>
                {Array.isArray(m.sectors) && m.sectors.length > 0 && (
                  <div className="text-xs text-gray-500 mt-1">
                    Sektörler: {m.sectors.join(", ")}
                  </div>
                )}
                {m.kaynak && (
                  <a
                    className="text-blue-600 text-sm"
                    href={m.kaynak}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Orijinal Kaynak
                  </a>
                )}
              </li>
            ))}
            {items.length === 0 && !loading && !err && (
              <li className="text-gray-500">Gösterilecek kayıt yok.</li>
            )}
          </ul>
        </section>
      </main>
    </div>
  );
}
