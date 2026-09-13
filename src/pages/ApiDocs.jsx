const supported = [
  ['XAUUSD', 'Vàng Thế Giới (XAU/USD)'],
  ['SJL1L10', 'SJC 9999'],
  ['SJ9999', 'Nhẫn SJC'],
  ['DOHNL', 'DOJI Hà Nội'],
  ['DOHCML', 'DOJI HCM'],
  ['DOJINHTV', 'DOJI Nữ Trang'],
  ['BTSJC', 'Bảo Tín SJC'],
  ['BT9999NTT', 'Bảo Tín 9999'],
  ['PQHNVM', 'PNJ Hà Nội'],
  ['PQHN24NTT', 'PNJ 24K'],
  ['VNGSJC', 'VN Gold SJC'],
  ['VIETTINMSJC', 'Viettin SJC'],
];

const endpoints = [
  {
    path: '/api/gold',
    description: 'Lấy giá hiện tại của tất cả loại vàng.',
  },
  {
    path: '/api/gold/{type}',
    description: 'Lấy giá hiện tại của một loại vàng cụ thể.',
  },
  {
    path: '/api/gold/{type}/history?days={n}',
    description: 'Lấy lịch sử giá của một loại vàng theo số ngày.',
  },
];

export default function ApiDocs() {
  return (
    <section className="container page-stack">
      <div className="api-hero">
        <span className="eyebrow">
          DÀNH CHO NHÀ PHÁT TRIỂN
        </span>

        <h1>API giá vàng</h1>

        <p>
          Truy cập dữ liệu giá vàng hiện tại và lịch sử
          thông qua các endpoint của giavang.today.
        </p>
      </div>

      <div className="docs-card">
        <h2>Endpoints</h2>

        {endpoints.map((endpoint) => (
          <div
            className="endpoint"
            key={endpoint.path}
          >
            <span>GET</span>

            <code>{endpoint.path}</code>

            <p>{endpoint.description}</p>
          </div>
        ))}
      </div>

      <div className="docs-card">
        <h2>Tham số</h2>

        <table className="docs-table">
          <thead>
            <tr>
              <th>Tham số</th>
              <th>Kiểu</th>
              <th>Mô tả</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td>
                <code>type</code>
              </td>

              <td>string</td>

              <td>
                Mã loại vàng cần truy vấn.
              </td>
            </tr>

            <tr>
              <td>
                <code>days</code>
              </td>

              <td>integer</td>

              <td>
                Số ngày lịch sử cần lấy.
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="docs-card">
        <h2>Các loại vàng hỗ trợ</h2>

        <div className="code-grid">
          {supported.map(([code, name]) => (
            <div key={code}>
              <code>{code}</code>
              <span>{name}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="docs-card">
        <h2>Lưu ý</h2>

        <p className="muted">
          API hiện phục vụ dữ liệu cho các tính năng của
          giavang.today. Cấu trúc endpoint có thể được cập
          nhật khi hệ thống tiếp tục phát triển.
        </p>
      </div>
    </section>
  );
}