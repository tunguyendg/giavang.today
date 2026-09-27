import { useEffect, useState } from 'react';

import {
  Link,
  NavLink,
  useLocation,
  useNavigate,
} from 'react-router-dom';

import {
  BellRing,
  ChevronDown,
  Coins,
  LogIn,
  LogOut,
  Menu,
  User,
  WalletCards,
  X,
} from 'lucide-react';

import { API_URL } from '../config/api.js';

const goldNav = [
  ['/gia-vang-sjc', 'Giá vàng SJC'],
  ['/gia-vang-nhan-9999', 'Vàng nhẫn 9999'],
  ['/gia-vang-pnj', 'Giá vàng PNJ'],
  ['/gia-vang-doji', 'Giá vàng DOJI'],
  ['/gia-vang-the-gioi', 'Vàng thế giới'],
  ['/gia-vang-24k', 'Vàng 24K'],
  ['/gia-vang-18k', 'Vàng 18K'],
];

const utilityNav = [
  ['/portfolio', 'Vàng của tôi'],
  ['/alerts', 'Cảnh báo'],
  ['/api', 'API'],
  ['/telegram', 'Telegram'],
];

export default function Layout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();

  const [open, setOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [userMenuOpen, setUserMenuOpen] =
    useState(false);

  const isGoldSection =
    location.pathname === '/' ||
    goldNav.some(
      ([path]) =>
        location.pathname === path
    );

  useEffect(() => {
    async function loadCurrentUser() {
      const token =
        localStorage.getItem('giavang_token');

      if (!token) {
        setUser(null);
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
          localStorage.removeItem(
            'giavang_token'
          );

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

    window.addEventListener(
      'auth-changed',
      loadCurrentUser
    );

    return () => {
      window.removeEventListener(
        'auth-changed',
        loadCurrentUser
      );
    };
  }, []);

  function handleLogout() {
    localStorage.removeItem(
      'giavang_token'
    );

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
          {/* BRAND */}
          <Link
            className="brand"
            to="/"
            onClick={closeMenus}
          >
            <span className="brand-icon">
              <Coins size={20} />
            </span>

            <div>
              <strong>
                giavang.today
              </strong>

              <small>
                Theo dõi giá vàng
              </small>
            </div>
          </Link>

          {/* DESKTOP NAV */}
          <nav className="desktop-nav">
            <div className="nav-dropdown">
              <Link
                to="/"
                className={
                  isGoldSection
                    ? 'nav-dropdown-trigger active'
                    : 'nav-dropdown-trigger'
                }
              >
                Giá vàng

                <ChevronDown
                  size={15}
                />
              </Link>

              <div className="nav-dropdown-menu">
                <Link
                  to="/"
                  onClick={closeMenus}
                >
                  Giá vàng hôm nay
                </Link>

                {goldNav.map(
                  ([to, label]) => (
                    <NavLink
                      key={to}
                      to={to}
                      onClick={
                        closeMenus
                      }
                    >
                      {label}
                    </NavLink>
                  )
                )}
              </div>
            </div>

            {utilityNav.map(
              ([to, label]) => (
                <NavLink
                  key={to}
                  to={to}
                  className={({
                    isActive,
                  }) =>
                    isActive
                      ? 'active'
                      : ''
                  }
                >
                  {label}
                </NavLink>
              )
            )}
          </nav>

          {/* HEADER ACTIONS */}
          <div className="header-actions">
            {user ? (
              <div className="user-menu-wrap">
                <button
                  type="button"
                  className="user-menu"
                  onClick={() =>
                    setUserMenuOpen(
                      (current) =>
                        !current
                    )
                  }
                >
                  <div className="user-avatar">
                    {user.name
                      ?.charAt(0)
                      .toUpperCase() ||
                      'U'}
                  </div>

                  <div className="user-info">
                    <strong>
                      {user.name}
                    </strong>

                    <small>
                      {user.email}
                    </small>
                  </div>
                </button>

                {userMenuOpen && (
                  <div className="user-dropdown">
                    <Link
                      to="/portfolio"
                      onClick={
                        closeMenus
                      }
                    >
                      <WalletCards
                        size={16}
                      />

                      Vàng của tôi
                    </Link>

                    <Link
                      to="/alerts"
                      onClick={
                        closeMenus
                      }
                    >
                      <BellRing
                        size={16}
                      />

                      Cảnh báo
                    </Link>

                    <Link
                      to="/account"
                      onClick={
                        closeMenus
                      }
                    >
                      <User
                        size={16}
                      />

                      Tài khoản
                    </Link>

                    <div className="dropdown-divider" />

                    <button
                      type="button"
                      onClick={
                        handleLogout
                      }
                    >
                      <LogOut
                        size={16}
                      />

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
                setOpen(
                  (current) =>
                    !current
                )
              }
            >
              {open
                ? <X />
                : <Menu />}
            </button>
          </div>
        </div>

        {/* MOBILE NAV */}
        {open && (
          <div className="mobile-nav">
            <span className="mobile-nav-title">
              GIÁ VÀNG
            </span>

            <NavLink
              to="/"
              onClick={closeMenus}
            >
              Giá vàng hôm nay
            </NavLink>

            {goldNav.map(
              ([to, label]) => (
                <NavLink
                  key={to}
                  to={to}
                  onClick={
                    closeMenus
                  }
                >
                  {label}
                </NavLink>
              )
            )}

            <div className="mobile-nav-divider" />

            <span className="mobile-nav-title">
              TIỆN ÍCH
            </span>

            {utilityNav.map(
              ([to, label]) => (
                <NavLink
                  key={to}
                  to={to}
                  onClick={
                    closeMenus
                  }
                >
                  {label}
                </NavLink>
              )
            )}

            {user ? (
              <>
                <NavLink
                  to="/account"
                  onClick={
                    closeMenus
                  }
                >
                  Tài khoản
                </NavLink>

                <button
                  type="button"
                  onClick={
                    handleLogout
                  }
                >
                  Đăng xuất
                </button>
              </>
            ) : (
              <NavLink
                to="/login"
                onClick={
                  closeMenus
                }
              >
                Đăng nhập
              </NavLink>
            )}
          </div>
        )}
      </header>

      <main>
        {children}
      </main>

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-inner footer-grid">
          <div className="footer-brand">
            <strong>
              giavang.today
            </strong>

            <p>
              Theo dõi giá vàng,
              lịch sử và biến động
              thị trường theo cách
              đơn giản, trực quan.
            </p>
          </div>

          <div className="footer-column">
            <strong>
              Giá vàng
            </strong>

            <Link to="/gia-vang-sjc">
              Giá vàng SJC
            </Link>

            <Link to="/gia-vang-nhan-9999">
              Vàng nhẫn 9999
            </Link>

            <Link to="/gia-vang-pnj">
              Giá vàng PNJ
            </Link>

            <Link to="/gia-vang-doji">
              Giá vàng DOJI
            </Link>
          </div>

          <div className="footer-column">
            <strong>
              Thị trường
            </strong>

            <Link to="/gia-vang-the-gioi">
              Vàng thế giới
            </Link>

            <Link to="/gia-vang-24k">
              Vàng 24K
            </Link>

            <Link to="/gia-vang-18k">
              Vàng 18K
            </Link>

            <Link to="/">
              Giá vàng hôm nay
            </Link>
          </div>

          <div className="footer-column">
            <strong>
              Công cụ
            </strong>

            <Link to="/api">
              API giá vàng
            </Link>

            <Link to="/portfolio">
              Vàng của tôi
            </Link>

            <Link to="/alerts">
              Cảnh báo giá
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