import { useEffect, useState } from 'react';
import {
  Link,
  NavLink,
  useNavigate,
} from 'react-router-dom';

import {
  BellRing,
  Coins,
  LogIn,
  LogOut,
  Menu,
  User,
  WalletCards,
  X,
} from 'lucide-react';

import { API_URL } from '../config/api.js';

const nav = [
  ['/', 'Giá vàng'],
  ['/portfolio', 'Vàng của tôi'],
  ['/alerts', 'Cảnh báo'],
  ['/api', 'API'],
  ['/telegram', 'Telegram'],
];

export default function Layout({ children }) {
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [userMenuOpen, setUserMenuOpen] =
    useState(false);

  useEffect(() => {
    async function loadCurrentUser() {
      const token =
        localStorage.getItem('giavang_token');

      if (!token) {
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
          setUser(null);
          return;
        }

        setUser(data.user);
      } catch (error) {
        console.error(
          'Load current user error:',
          error
        );
      }
    }

    loadCurrentUser();
  }, []);

  function handleLogout() {
    localStorage.removeItem('giavang_token');

    setUser(null);
    setUserMenuOpen(false);
    setOpen(false);

    navigate('/login');
  }

  function closeMenus() {
    setOpen(false);
    setUserMenuOpen(false);
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="topbar-inner">
          <Link
            className="brand"
            to="/"
            onClick={closeMenus}
          >
            <span className="brand-icon">
              <Coins size={20} />
            </span>

            <div>
              <strong>giavang.today</strong>
              <small>Theo dõi giá vàng</small>
            </div>
          </Link>

          <nav className="desktop-nav">
            {nav.map(([to, label]) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  isActive ? 'active' : ''
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>

          <div className="header-actions">
            {user ? (
              <div className="user-menu-wrap">
                <button
                  type="button"
                  className="user-menu"
                  onClick={() =>
                    setUserMenuOpen(
                      (current) => !current
                    )
                  }
                >
                  <div className="user-avatar">
                    {user.name
                      ?.charAt(0)
                      .toUpperCase() || 'U'}
                  </div>

                  <div className="user-info">
                    <strong>{user.name}</strong>
                    <small>{user.email}</small>
                  </div>
                </button>

                {userMenuOpen && (
                  <div className="user-dropdown">
                    <Link
                      to="/portfolio"
                      onClick={closeMenus}
                    >
                      <WalletCards size={16} />
                      Vàng của tôi
                    </Link>

                    <Link
                      to="/alerts"
                      onClick={closeMenus}
                    >
                      <BellRing size={16} />
                      Cảnh báo
                    </Link>

                    <Link
                      to="/account"
                      onClick={closeMenus}
                    >
                      <User size={16} />
                      Tài khoản
                    </Link>

                    <div className="dropdown-divider" />

                    <button
                      type="button"
                      onClick={handleLogout}
                    >
                      <LogOut size={16} />
                      Đăng xuất
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                className="login-link"
                to="/login"
              >
                <LogIn size={17} />
                Đăng nhập
              </Link>
            )}

            <button
              type="button"
              className="icon-btn mobile-only"
              aria-label="Mở menu"
              onClick={() =>
                setOpen((current) => !current)
              }
            >
              {open ? <X /> : <Menu />}
            </button>
          </div>
        </div>

        {open && (
          <div className="mobile-nav">
            {nav.map(([to, label]) => (
              <NavLink
                key={to}
                to={to}
                onClick={closeMenus}
              >
                {label}
              </NavLink>
            ))}

            {user ? (
              <>
                <NavLink
                  to="/account"
                  onClick={closeMenus}
                >
                  Tài khoản
                </NavLink>

                <button
                  type="button"
                  onClick={handleLogout}
                >
                  Đăng xuất
                </button>
              </>
            ) : (
              <NavLink
                to="/login"
                onClick={closeMenus}
              >
                Đăng nhập
              </NavLink>
            )}
          </div>
        )}
      </header>

      <main>{children}</main>

      <footer className="footer">
        <div className="footer-inner">
          <div>
            <strong>giavang.today</strong>
            <p>
              Theo dõi giá vàng, danh mục và
              cảnh báo giá theo cách đơn giản,
              dễ sử dụng.
            </p>
          </div>

          <div className="footer-links">
            <Link to="/">Giá vàng</Link>

            <Link to="/portfolio">
              Vàng của tôi
            </Link>

            <Link to="/alerts">
              Cảnh báo
            </Link>

            {user ? (
              <Link to="/account">
                Tài khoản
              </Link>
            ) : (
              <Link to="/login">
                Đăng nhập
              </Link>
            )}
          </div>
        </div>
      </footer>
    </div>
  );
}