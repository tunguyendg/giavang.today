import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Seo from '../seo/Seo.jsx';
import { API_URL } from '../config/api.js';

export default function Auth() {
  const navigate = useNavigate();

  const [mode, setMode] = useState('login');
  const [registerSuccess, setRegisterSuccess] = useState('');

  const [loginForm, setLoginForm] = useState({
    email: '',
    password: '',
  });

  const [registerForm, setRegisterForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  async function handleLogin() {
    try {
      const response = await fetch(
        `${API_URL}/api/auth/login`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: loginForm.email,
            password: loginForm.password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(
          data.message ||
            'Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.'
        );
        return;
      }

      localStorage.setItem(
        'giavang_token',
        data.token
      );

      window.dispatchEvent(
        new Event('auth-changed')
      );

      navigate('/portfolio');
    } catch (error) {
      console.error('Login error:', error);

      alert(
        'Không thể kết nối đến hệ thống. Vui lòng thử lại.'
      );
    }
  }

  async function handleRegister() {
    if (
      registerForm.password !==
      registerForm.confirmPassword
    ) {
      alert('Mật khẩu xác nhận không khớp.');
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/api/auth/register`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: registerForm.name,
            email: registerForm.email,
            password: registerForm.password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(
          data.message ||
            'Đăng ký thất bại. Vui lòng thử lại.'
        );
        return;
      }

      setRegisterSuccess(
        `Đăng ký thành công. Vui lòng kiểm tra email ${registerForm.email} để xác nhận tài khoản.`
      );

      setLoginForm({
        email: registerForm.email,
        password: '',
      });

      setRegisterForm({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
      });

      setMode('login');
    } catch (error) {
      console.error('Register error:', error);

      alert(
        'Không thể kết nối đến hệ thống. Vui lòng thử lại.'
      );
    }
  }

  function submitLogin(e) {
    e.preventDefault();
    handleLogin();
  }

  function submitRegister(e) {
    e.preventDefault();
    handleRegister();
  }

  return (
    <>
      <Seo
        title="Đăng nhập"
        description="Đăng nhập hoặc đăng ký tài khoản giavang.today để quản lý danh mục vàng và cảnh báo giá."
        path="/login"
        noindex
      />

      <section className="auth-page">
        <div className="auth-card">
          <div className="auth-heading">
            <span className="eyebrow">
              KHU VỰC THÀNH VIÊN
            </span>

            <h1>
              Đăng nhập để quản lý vàng của bạn
            </h1>

            <p>
              Lưu danh mục, theo dõi lãi/lỗ và
              tạo cảnh báo giá theo tài khoản
              của bạn.
            </p>
          </div>

          <div className="auth-tabs">
            <button
              type="button"
              className={
                mode === 'login'
                  ? 'active'
                  : ''
              }
              onClick={() =>
                setMode('login')
              }
            >
              Đăng nhập
            </button>

            <button
              type="button"
              className={
                mode === 'register'
                  ? 'active'
                  : ''
              }
              onClick={() =>
                setMode('register')
              }
            >
              Đăng ký
            </button>
          </div>

          {mode === 'login' ? (
            <form
              className="auth-form"
              onSubmit={submitLogin}
            >
              <label>
                Email

                <input
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="your@email.com"
                  value={loginForm.email}
                  onChange={(e) =>
                    setLoginForm({
                      ...loginForm,
                      email: e.target.value,
                    })
                  }
                />
              </label>

              <label>
                Mật khẩu

                <input
                  type="password"
                  required
                  autoComplete="current-password"
                  placeholder="Nhập mật khẩu"
                  value={loginForm.password}
                  onChange={(e) =>
                    setLoginForm({
                      ...loginForm,
                      password:
                        e.target.value,
                    })
                  }
                />
              </label>

              {registerSuccess && (
                <div className="success-box">
                  {registerSuccess}
                </div>
              )}

              <button
                className="primary-btn"
                type="submit"
              >
                Đăng nhập
              </button>
            </form>
          ) : (
            <form
              className="auth-form"
              onSubmit={submitRegister}
            >
              <label>
                Tên của bạn

                <input
                  type="text"
                  required
                  autoComplete="name"
                  placeholder="Nhập tên của bạn"
                  value={registerForm.name}
                  onChange={(e) =>
                    setRegisterForm({
                      ...registerForm,
                      name: e.target.value,
                    })
                  }
                />
              </label>

              <label>
                Email

                <input
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="your@gmail.com"
                  value={registerForm.email}
                  onChange={(e) =>
                    setRegisterForm({
                      ...registerForm,
                      email: e.target.value,
                    })
                  }
                />
              </label>

              <label>
                Mật khẩu

                <input
                  type="password"
                  required
                  minLength={6}
                  autoComplete="new-password"
                  placeholder="Tối thiểu 6 ký tự"
                  value={
                    registerForm.password
                  }
                  onChange={(e) =>
                    setRegisterForm({
                      ...registerForm,
                      password:
                        e.target.value,
                    })
                  }
                />
              </label>

              <label>
                Xác nhận mật khẩu

                <input
                  type="password"
                  required
                  minLength={6}
                  autoComplete="new-password"
                  placeholder="Nhập lại mật khẩu"
                  value={
                    registerForm.confirmPassword
                  }
                  onChange={(e) =>
                    setRegisterForm({
                      ...registerForm,
                      confirmPassword:
                        e.target.value,
                    })
                  }
                />
              </label>

              <button
                className="primary-btn"
                type="submit"
              >
                Đăng ký
              </button>

              <small>
                Sau khi đăng ký, bạn cần xác nhận
                email để kích hoạt tài khoản.
              </small>
            </form>
          )}
        </div>
      </section>
    </>
  );
}