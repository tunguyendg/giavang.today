import { useState } from 'react';
import { BellRing, CheckCircle2 } from 'lucide-react';

import { TYPES } from '../services/goldApi.js';
import { API_URL } from '../config/api.js';

const options = TYPES.filter(
  ([code]) => code !== 'XAUUSD'
);

function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat(
    (4 - (base64String.length % 4)) % 4
  );

  const base64 = (base64String + padding)
    .replace(/-/g, "+")
    .replace(/_/g, "/");

  const rawData = window.atob(base64);

  return Uint8Array.from(
    [...rawData].map((char) => char.charCodeAt(0))
  );
}


export default function Alerts() {
  const [form, setForm] = useState({
    type: 'SJL1L10',
    condition: 'below',
    target: '145000000',
  });

  const [done, setDone] = useState(false);
  async function submit(e) {
    e.preventDefault();

    try {
      const token = localStorage.getItem("giavang_token");

      if (!token) {
        alert("Vui lòng đăng nhập trước.");
        return;
      }

      const permission =
        await Notification.requestPermission();

      if (permission !== "granted") {
        alert("Bạn chưa cho phép thông báo.");
        return;
      }

      const registration =
        await navigator.serviceWorker.ready;

      const subscription =
        await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey:
            urlBase64ToUint8Array(
              import.meta.env.VITE_VAPID_PUBLIC_KEY
            ),
        });

      const subscribeResponse = await fetch(
        `${API_URL}/api/push/subscribe`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(subscription),
        }
      );

      const subscribeData =
        await subscribeResponse.json();

      if (!subscribeResponse.ok) {
        throw new Error(
          subscribeData.message ||
          "Không thể lưu Push Subscription"
        );
      }

      const alertResponse = await fetch(
        `${API_URL}/api/alerts`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            type: form.type,
            condition: form.condition,
            targetPrice: Number(form.target),
          }),
        }
      );

      const alertData =
        await alertResponse.json();

      if (!alertResponse.ok) {
        throw new Error(
          alertData.message ||
          "Không thể tạo alert"
        );
      }

      setDone(true);
    } catch (error) {
      console.error(
        "Create alert error:",
        error
      );

      alert(
        error.message ||
        "Không thể tạo cảnh báo"
      );
    }
  }

  return <section className="container page-stack"><div className="page-title"><div><span className="eyebrow">WEB PUSH</span><h1>Cảnh báo giá vàng</h1><p>Theo dõi giá vàng và nhận thông báo khi giá chạm mức bạn quan tâm.</p></div></div><div className="two-col"><form className="section-card form-card" onSubmit={submit}><span className="eyebrow">TẠO CẢNH BÁO</span><h2>Báo khi giá chạm ngưỡng</h2><label>Loại vàng<select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>{options.map(([c, n]) => <option key={c} value={c}>{n}</option>)}</select></label><label>Điều kiện<select value={form.condition} onChange={e => setForm({ ...form, condition: e.target.value })}><option value="below">Giảm xuống ≤</option><option value="above">Tăng lên ≥</option></select></label><label>Mức giá<input type="number" value={form.target} onChange={e => setForm({ ...form, target: e.target.value })} /></label><button className="primary-btn"><BellRing size={17} /> Tạo cảnh báo</button>{done && <div className="success-box"><CheckCircle2 size={18} /> Cảnh báo đã được tạo thành công.</div>}</form><div className="section-card explainer"><div className="icon-bubble"><BellRing /></div><h2>Web Push hoạt động thế nào?</h2><ol>
    <li>Cho phép trình duyệt gửi thông báo.</li>
    <li>Chọn loại vàng và mức giá cần theo dõi.</li>
    <li>Hệ thống tự động kiểm tra giá theo định kỳ.</li>
    <li>Khi giá chạm ngưỡng, bạn sẽ nhận thông báo trên thiết bị.</li>
  </ol>

    <p className="muted">
      Bạn có thể tạo nhiều cảnh báo cho các mức giá khác nhau.
    </p></div></div></section>
}
