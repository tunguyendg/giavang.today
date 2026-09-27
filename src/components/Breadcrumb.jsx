import { Link } from 'react-router-dom';

export default function Breadcrumb({
  current,
}) {
  return (
    <nav
      className="breadcrumb"
      aria-label="Breadcrumb"
    >
      <Link to="/">
        Trang chủ
      </Link>

      <span>/</span>

      <Link to="/">
        Giá vàng
      </Link>

      <span>/</span>

      <span aria-current="page">
        {current}
      </span>
    </nav>
  );
}