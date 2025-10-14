// frontend/src/AdminForm.jsx
import { useState } from "react";
import { SECTORS } from "./constants";

const API_BASE = import.meta.env.VITE_API_BASE;

export default function AdminForm({ onCreated }) {
  const [baslik, setBaslik] = useState("");
  const [ozet, setOzet] = useState("");
  const [kaynak, setKaynak] = useState("https://www.resmigazete.gov.tr/");
  const [sectors, setSectors] = useState([]);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");
  const [open, setOpen] = useState(true); // istersen kapat/aç

  function toggleSector(s) {
    setSectors((prev) => (prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]));
  }

  async function submit() {
    setMsg("");
    setErr("");
    if (!baslik.trim()) {
      setErr("Başlık zorunludur.");
      return;
    }
    try {
      const res = await fetch(`${API_BASE}/admin/mevzuat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ baslik, ozet, kaynak, sectors }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setMsg(`Eklendi: ${data.baslik} (#${data.id})`);
      setBaslik("");
      setOzet("");
      setSectors([]);
      if (onCreated) onCreated(data);
    } catch (e) {
      console.error(e);
      setErr("Kayıt eklenemedi.");
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow p-4 space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Admin: Mevzuat Ekle (MVP)</h3>
        <button
          onClick={() => setOpen((v) => !v)}
          className="text-sm px-2 py-1 rounded border"
        >
          {open ? "Gizle" : "Göster"}
        </button>
      </div>

      {msg && <div className="text-green-700 text-sm">{msg}</div>}
      {err && <div className="text-red-700 text-sm">{err}</div>}

      {open && (
        <>
          <div className="grid gap-2">
            <input
              className="border rounded p-2 w-full"
              placeholder="Başlık"
              value={baslik}
              onChange={(e) => setBaslik(e.target.value)}
            />
            <textarea
              className="border rounded p-2 w-full"
              rows={3}
              placeholder="Özet"
              value={ozet}
              onChange={(e) => setOzet(e.target.value)}
            />
            <input
              className="border rounded p-2 w-full"
              placeholder="Kaynak URL"
              value={kaynak}
              onChange={(e) => setKaynak(e.target.value)}
            />
          </div>

          <div>
            <div className="text-sm mb-1">Sektörler:</div>
            <div className="flex flex-wrap gap-2">
              {SECTORS.map((s) => (
                <label
                  key={s}
                  className="inline-flex items-center gap-1 border rounded px-2 py-1"
                >
                  <input
                    type="checkbox"
                    checked={sectors.includes(s)}
                    onChange={() => toggleSector(s)}
                  />
                  <span>{s}</span>
                </label>
              ))}
            </div>
          </div>

          <button onClick={submit} className="px-3 py-2 rounded bg-emerald-600 text-white">
            Kaydet
          </button>
        </>
      )}
    </div>
  );
}
