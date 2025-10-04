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

  async function saveEmail() {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email })
    });
    if (res.ok) setStep(2);
    else setMsg("E-posta kaydı başarısız.");
  }

  async function saveAll() {
    const kw = keywords
      .split(",")
      .map(k => k.trim())
      .filter(Boolean);
    const res = await fetch(`${API_BASE}/onboarding`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, sector, keywords: kw, notify_pref: notify })
    });
    if (res.ok) setMsg("Onboarding tamam!");
    else setMsg("Kaydetmede sorun oldu.");
  }

  return (
    <div className="max-w-xl mx-auto bg-white rounded-2xl shadow p-6 space-y-4">
      <h2 className="text-2xl font-bold">Onboarding</h2>
      {msg && <div className="text-sm text-blue-700">{msg}</div>}

      {step === 1 && (
        <div className="space-y-3">
          <label className="block">
            <span className="text-sm">E-posta</span>
            <input className="mt-1 w-full border rounded p-2"
              value={email} onChange={e=>setEmail(e.target.value)} placeholder="ornek@firma.com" />
          </label>
          <button onClick={saveEmail} className="px-4 py-2 bg-blue-600 text-white rounded">Devam</button>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-3">
          <label className="block">
            <span className="text-sm">Sektör</span>
            <select className="mt-1 w-full border rounded p-2"
              value={sector} onChange={e=>setSector(e.target.value)}>
              <option value="">Seçiniz</option>
              {SECTORS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </label>

          <label className="block">
            <span className="text-sm">Anahtar Kelimeler (virgülle)</span>
            <input className="mt-1 w-full border rounded p-2"
              value={keywords} onChange={e=>setKeywords(e.target.value)} placeholder="KDV, e-fatura, KVKK" />
          </label>

          <label className="block">
            <span className="text-sm">Bildirim Tercihi</span>
            <select className="mt-1 w-full border rounded p-2"
              value={notify} onChange={e=>setNotify(e.target.value)}>
              <option value="daily">Günlük Özet E-postası</option>
              <option value="instant">Yüksek Öncelikli için Anlık E-posta</option>
              <option value="web">Sadece Web Kontrol Paneli</option>
            </select>
          </label>

          <div className="flex gap-2">
            <button onClick={()=>setStep(1)} className="px-4 py-2 border rounded">Geri</button>
            <button onClick={saveAll} className="px-4 py-2 bg-green-600 text-white rounded">Kaydet</button>
          </div>
        </div>
      )}
    </div>
  );
}
