import { Bot, Check } from 'lucide-react';
import Seo from '../seo/Seo.jsx';

export default function Telegram() {
  return (
    <>
      <Seo
        title="Cảnh báo giá vàng qua Telegram"
        description="Tính năng cảnh báo giá vàng qua Telegram của giavang.today đang được phát triển."
        path="/telegram"
        noindex
      />
      <section className="container page-stack">
        <div className="telegram-card">
          <div className="bot-icon">
            <Bot size={42} />
          </div>

          <span className="eyebrow">
            SẮP RA MẮT
          </span>

          <h1>
            Nhận cảnh báo giá vàng qua Telegram
          </h1>

          <p>
            giavang.today đang phát triển kênh Telegram để
            bạn có thể nhận cảnh báo giá và xem giá vàng
            nhanh chóng ngay trong ứng dụng Telegram.
          </p>

          <div className="feature-list">
            {[
              'Nhận cảnh báo khi giá chạm ngưỡng',
              'Xem nhanh giá vàng hiện tại',
              'Theo dõi nhiều loại vàng',
              'Nhận thông báo trực tiếp trên Telegram',
            ].map((item) => (
              <div key={item}>
                <Check size={18} />
                {item}
              </div>
            ))}
          </div>

          <p className="muted">
            Hiện tại bạn có thể sử dụng cảnh báo Web Push
            để nhận thông báo ngay trên trình duyệt.
          </p>
        </div>
      </section>
    </>
  );
}