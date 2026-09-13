import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../config/api.js';

export default function Account() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      const token = localStorage.getItem('giavang_token');

      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const response = await fetch(
          `${API_URL}/api/auth/me`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          localStorage.removeItem('giavang_token');
          navigate('/login');
          return;
        }

        setUser(data.user);
      } catch (error) {
        console.error('Load account error:', error);
      } finally {
        setLoading(false);
      }
    }

    loadUser();
  }, [navigate]);

  function handleLogout() {
    localStorage.removeItem('giavang_token');
    navigate('/login');
  }

  if (loading) {
    return (
      <section className="container page-stack">
        <p>Đang tải tài khoản...</p>
      </section>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <section className="container page-stack">
      <div className="page-title">
        <div>
          <span className="eyebrow">
            TÀI KHOẢN
          </span>

          <h1>{user.name || 'Tài khoản của bạn'}</h1>

          <p>
            Xem thông tin tài khoản và trạng thái xác minh của bạn.
          </p>
        </div>
      </div>

      <div className="section-card">
        <div className="user-menu">
          <div className="user-avatar">
            {user.name?.charAt(0).toUpperCase() || 'U'}
          </div>

          <div className="user-info">
            <strong>{user.name || 'Người dùng'}</strong>
            <small>{user.email}</small>
          </div>
        </div>

        <hr />

        <p>
          <strong>Email:</strong> {user.email}
        </p>

        <p>
          <strong>Xác minh email:</strong>{' '}
          {user.emailVerified
            ? 'Đã xác nhận ✅'
            : 'Chưa xác nhận'}
        </p>

        <p>
          <strong>Ngày tham gia:</strong>{' '}
          {user.createdAt
            ? new Date(user.createdAt).toLocaleString('vi-VN')
            : '—'}
        </p>

        <button
          type="button"
          className="primary-btn"
          onClick={handleLogout}
        >
          Đăng xuất
        </button>
      </div>
    </section>
  );
}