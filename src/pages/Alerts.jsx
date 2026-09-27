import {
  useEffect,
  useState,
} from 'react';

import {
  BellRing,
  CheckCircle2,
  Trash2,
} from 'lucide-react';

import {
  TYPES,
} from '../services/goldApi.js';

import {
  API_URL,
} from '../config/api.js';
import Seo from '../seo/Seo.jsx';

const options = TYPES.filter(
  ([code]) => code !== 'XAUUSD'
);

const vi = (number) =>
  new Intl.NumberFormat('vi-VN').format(
    Number(number || 0)
  );

function urlBase64ToUint8Array(
  base64String
) {
  const padding = '='.repeat(
    (4 - (base64String.length % 4)) % 4
  );

  const base64 = (
    base64String + padding
  )
    .replace(/-/g, '+')
    .replace(/_/g, '/');

  const rawData =
    window.atob(base64);

  return Uint8Array.from(
    [...rawData].map(
      (char) => char.charCodeAt(0)
    )
  );
}

export default function Alerts() {
  const [alerts, setAlerts] =
    useState([]);

  const [form, setForm] =
    useState({
      type: 'SJL1L10',
      condition: 'below',
      target: '145000000',
    });

  const [done, setDone] =
    useState(false);

  useEffect(() => {
    loadAlerts();
  }, []);

  async function loadAlerts() {
    try {
      const token =
        localStorage.getItem(
          'giavang_token'
        );

      if (!token) {
        return;
      }

      const response = await fetch(
        `${API_URL}/api/alerts`,
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        console.error(
          'Load alerts failed:',
          data.message
        );

        return;
      }

      setAlerts(data.alerts);
    } catch (error) {
      console.error(
        'Load alerts error:',
        error
      );
    }
  }

  async function submit(e) {
    e.preventDefault();

    try {
      const token =
        localStorage.getItem(
          'giavang_token'
        );

      if (!token) {
        alert(
          'Vui lòng đăng nhập trước.'
        );

        return;
      }

      const permission =
        await Notification.requestPermission();

      if (
        permission !== 'granted'
      ) {
        alert(
          'Bạn chưa cho phép thông báo.'
        );

        return;
      }

      const registration =
        await navigator
          .serviceWorker
          .ready;

      let subscription =
        await registration
          .pushManager
          .getSubscription();

      if (!subscription) {
        subscription =
          await registration
            .pushManager
            .subscribe({
              userVisibleOnly: true,

              applicationServerKey:
                urlBase64ToUint8Array(
                  import.meta.env
                    .VITE_VAPID_PUBLIC_KEY
                ),
            });
      }

      const subscribeResponse =
        await fetch(
          `${API_URL}/api/push/subscribe`,
          {
            method: 'POST',

            headers: {
              'Content-Type':
                'application/json',

              Authorization:
                `Bearer ${token}`,
            },

            body: JSON.stringify(
              subscription
            ),
          }
        );

      const subscribeData =
        await subscribeResponse.json();

      if (
        !subscribeResponse.ok
      ) {
        throw new Error(
          subscribeData.message ||
          'Không thể lưu Push Subscription'
        );
      }

      const alertResponse =
        await fetch(
          `${API_URL}/api/alerts`,
          {
            method: 'POST',

            headers: {
              'Content-Type':
                'application/json',

              Authorization:
                `Bearer ${token}`,
            },

            body: JSON.stringify({
              type: form.type,

              condition:
                form.condition,

              targetPrice:
                Number(
                  form.target
                ),
            }),
          }
        );

      const alertData =
        await alertResponse.json();

      if (!alertResponse.ok) {
        throw new Error(
          alertData.message ||
          'Không thể tạo cảnh báo'
        );
      }

      setAlerts(
        (currentAlerts) => [
          alertData.alert,
          ...currentAlerts,
        ]
      );

      setDone(true);

      setTimeout(() => {
        setDone(false);
      }, 3000);
    } catch (error) {
      console.error(
        'Create alert error:',
        error
      );

      alert(
        error.message ||
        'Không thể tạo cảnh báo'
      );
    }
  }

  async function removeAlert(id) {
    try {
      const token =
        localStorage.getItem(
          'giavang_token'
        );

      if (!token) {
        alert(
          'Vui lòng đăng nhập trước.'
        );

        return;
      }

      const response = await fetch(
        `${API_URL}/api/alerts/${id}`,
        {
          method: 'DELETE',

          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        alert(
          data.message ||
          'Không thể xóa cảnh báo.'
        );

        return;
      }

      setAlerts(
        (currentAlerts) =>
          currentAlerts.filter(
            (alert) =>
              alert._id !== id
          )
      );
    } catch (error) {
      console.error(
        'Delete alert error:',
        error
      );

      alert(
        'Không thể kết nối đến hệ thống.'
      );
    }
  }

  return (
    <>
      <Seo
        title="Cảnh báo giá vàng"
        description="Quản lý cảnh báo giá vàng cá nhân trên giavang.today."
        path="/alerts"
        noindex
      />

      <section className="container page-stack">
        <div className="page-title">
          <div>
            <span className="eyebrow">
              WEB PUSH
            </span>

            <h1>
              Cảnh báo giá vàng
            </h1>

            <p>
              Theo dõi giá vàng và nhận
              thông báo khi giá chạm mức
              bạn quan tâm.
            </p>
          </div>
        </div>

        <div className="two-col">
          <form
            className="section-card form-card"
            onSubmit={submit}
          >
            <span className="eyebrow">
              TẠO CẢNH BÁO
            </span>

            <h2>
              Báo khi giá chạm ngưỡng
            </h2>

            <label>
              Loại vàng

              <select
                value={form.type}
                onChange={(e) =>
                  setForm({
                    ...form,
                    type:
                      e.target.value,
                  })
                }
              >
                {options.map(
                  ([code, name]) => (
                    <option
                      key={code}
                      value={code}
                    >
                      {name}
                    </option>
                  )
                )}
              </select>
            </label>

            <label>
              Điều kiện

              <select
                value={
                  form.condition
                }
                onChange={(e) =>
                  setForm({
                    ...form,
                    condition:
                      e.target.value,
                  })
                }
              >
                <option value="below">
                  Giảm xuống ≤
                </option>

                <option value="above">
                  Tăng lên ≥
                </option>
              </select>
            </label>

            <label>
              Mức giá

              <input
                type="text"
                inputMode="numeric"
                required
                value={
                  form.target
                    ? vi(
                      form.target
                    )
                    : ''
                }
                onChange={(e) => {
                  const rawValue =
                    e.target.value.replace(
                      /\D/g,
                      ''
                    );

                  setForm({
                    ...form,
                    target:
                      rawValue,
                  });
                }}
              />
            </label>

            <button
              className="primary-btn"
              type="submit"
            >
              <BellRing
                size={17}
              />

              Tạo cảnh báo
            </button>

            {done && (
              <div className="success-box">
                <CheckCircle2
                  size={18}
                />

                Cảnh báo đã được
                tạo thành công.
              </div>
            )}
          </form>

          <div className="section-card">
            <div className="section-head">
              <div>
                <span className="eyebrow">
                  ĐANG THEO DÕI
                </span>

                <h2>
                  Cảnh báo của tôi
                </h2>
              </div>
            </div>

            {alerts.length === 0 ? (
              <div className="empty-state">
                <BellRing
                  size={38}
                />

                <h3>
                  Chưa có cảnh báo
                </h3>

                <p>
                  Tạo cảnh báo đầu tiên
                  để theo dõi mức giá
                  bạn quan tâm.
                </p>
              </div>
            ) : (
              <div className="alert-list">
                {alerts.map(
                  (alert) => {
                    const goldName =
                      options.find(
                        ([code]) =>
                          code ===
                          alert.type
                      )?.[1] ||
                      alert.type;

                    const conditionText =
                      alert.condition ===
                        'below'
                        ? '≤'
                        : '≥';

                    return (
                      <div
                        className="alert-item"
                        key={alert._id}
                      >
                        <div className="alert-info">
                          <strong>{goldName}</strong>

                          <small>
                            Giá {conditionText}{' '}
                            {vi(alert.targetPrice)}₫
                          </small>

                          <span
                            className={`alert-status ${alert.triggered
                              ? 'triggered'
                              : 'active'
                              }`}
                          >
                            {alert.triggered
                              ? 'Đã kích hoạt'
                              : 'Đang theo dõi'}
                          </span>
                        </div>

                        <button
                          type="button"
                          className="icon-btn danger"
                          aria-label="Xóa cảnh báo"
                          onClick={() =>
                            removeAlert(alert._id)
                          }
                        >
                          <Trash2 size={17} />
                        </button>
                      </div>
                    );
                  }
                )}
              </div>
            )}
          </div>
        </div>

        <div className="section-card explainer">
          <div className="icon-bubble">
            <BellRing />
          </div>

          <h2>
            Web Push hoạt động thế nào?
          </h2>

          <ol>
            <li>
              Cho phép trình duyệt gửi
              thông báo.
            </li>

            <li>
              Chọn loại vàng và mức giá
              cần theo dõi.
            </li>

            <li>
              Hệ thống tự động kiểm tra
              giá theo định kỳ.
            </li>

            <li>
              Khi giá chạm ngưỡng, bạn
              sẽ nhận thông báo trên
              thiết bị.
            </li>
          </ol>

          <p className="muted">
            Bạn có thể tạo nhiều cảnh báo
            cho các mức giá khác nhau.
          </p>
        </div>
      </section>
    </>
  );
}