import { useState } from "react";
import { SECTORS } from "./constants";

const API_BASE = import.meta.env.VITE_API_BASE;

export default function Onboarding() {
  const [email, setEmail] = useState("");
  const [sector, setSector] = useState("");
  const [keywords, setKeywords] = useState("");
  const [notify, setNotify] = useState("daily");
  const [step, setStep] = useState(1);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  async function saveEmail() {
    setErr(""); setMsg("");
    try {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setMsg("E-posta kaydedildi.");
      setStep(2);
      localStorage.setItem("mr_email", email);
    } catch (e) {
      console.error(e);
      setErr("E-posta kaydı başarısız. Adresi kontrol edin.");
    }
  }

  async function saveAll() {
    setErr(""); setMsg("");
    const kw = keywords.split(",").map(k => k.trim()).filter(Boolean);
    try {
      const res = await fetch(`${API_BASE}/onboarding`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          sector,
          keywords: kw,
          notify_pref: notify,
        }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setMsg("Onboarding tamamlandı! Tercihleriniz kaydedildi.");
    } catch (e) {
      console.error(e);
      setErr("Kaydetme sırasında hata oluştu.");
    }
  }

  return (
    <div className="space-y-3">
      <h2 className="text-xl font-semibold">Onboarding</h2>
      {msg && <div className="text-green-700 text-sm">{msg}</div>}
      {err && <div className="text-red-700 text-sm">{err}</div>}

      {step === 1 && (
        <div className="grid gap-2">
          <label className="text-sm">E-posta</label>
          <input
            className="border rounded p-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="ornek@firma.com"
          />
          <button
            onClick={saveEmail}
            className="px-3 py-2 rounded bg-blue-600 text-white w-fit"
          >
            Devam
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="grid gap-3">
          <div>
            <label className="text-sm">Sektör</label>
            <select
              className="border rounded p-2 w-full mt-1"
              value={sector}
              onChange={(e) => setSector(e.target.value)}
            >
              <option value="">Seçiniz</option>
              {SECTORS.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm">Anahtar Kelimeler (virgülle)</label>
            <input
              className="border rounded p-2 w-full mt-1"
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              placeholder="KDV, e-fatura, KVKK"
            />
          </div>

          <div>
            <label className="text-sm">Bildirim Tercihi</label>
            <select
              className="border rounded p-2 w-full mt-1"
              value={notify}
              onChange={(e) => setNotify(e.target.value)}
            >
              <option value="daily">Günlük Özet E-postası</option>
              <option value="instant">Yüksek Öncelikli İçin Anlık E-posta</option>
              <option value="web">Sadece Web Kontrol Paneli</option>
            </select>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setStep(1)}
              className="px-3 py-2 rounded border w-fit"
            >
              Geri
            </button>
            <button
              onClick={saveAll}
              className="px-3 py-2 rounded bg-green-600 text-white w-fit"
            >
              Kaydet
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
