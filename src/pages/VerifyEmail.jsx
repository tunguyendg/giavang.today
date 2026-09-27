import { useEffect, useRef, useState } from 'react';
import {
  useNavigate,
  useSearchParams,
} from 'react-router-dom';
import Seo from '../seo/Seo.jsx';
import { API_URL } from '../config/api.js';

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const hasVerified = useRef(false);

  const [status, setStatus] =
    useState('loading');

  const [message, setMessage] = useState(
    'Đang xác nhận email...'
  );

  useEffect(() => {
    const token = searchParams.get('token');

    if (hasVerified.current) {
      return;
    }

    hasVerified.current = true;

    if (!token) {
      setStatus('error');
      setMessage(
        'Liên kết xác nhận không hợp lệ hoặc đã thiếu thông tin cần thiết.'
      );
      return;
    }

    async function verifyEmail() {
      try {
        const response = await fetch(
          `${API_URL}/api/auth/verify-email?token=${encodeURIComponent(
            token
          )}`
        );

        const data = await response.json();

        if (!response.ok) {
          setStatus('error');
          setMessage(
            data.message ||
            'Không thể xác nhận email. Liên kết có thể đã hết hạn hoặc không còn hợp lệ.'
          );
          return;
        }

        setStatus('success');
        setMessage(
          'Email của bạn đã được xác nhận thành công. Bạn có thể đăng nhập ngay bây giờ.'
        );
      } catch (error) {
        console.error(
          'Verify email error:',
          error
        );

        setStatus('error');
        setMessage(
          'Không thể kết nối đến hệ thống. Vui lòng thử lại.'
        );
      }
    }

    verifyEmail();
  }, [searchParams]);

  const title =
    status === 'loading'
      ? 'Đang xác nhận...'
      : status === 'success'
        ? 'Xác nhận thành công'
        : 'Xác nhận thất bại';

  return (
    <>
      <Seo
        title="Xác nhận email"
        description="Trang xác nhận email cho tài khoản giavang.today."
        path="/verify-email"
        noindex
      />
      <section className="auth-page">
        <div className="auth-card">
          <div className="auth-heading">
            <span className="eyebrow">
              XÁC NHẬN EMAIL
            </span>

            <h1>{title}</h1>
          </div>

          <div
            className={
              status === 'success'
                ? 'success-box'
                : ''
            }
          >
            {message}
          </div>

          {status === 'success' && (
            <button
              type="button"
              className="primary-btn"
              onClick={() =>
                navigate('/login')
              }
            >
              Đăng nhập
            </button>
          )}

          {status === 'error' && (
            <button
              type="button"
              className="primary-btn"
              onClick={() =>
                navigate('/login')
              }
            >
              Quay lại đăng nhập
            </button>
          )}
        </div>
      </section>
    </>
  );
}