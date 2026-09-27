import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import Home from './pages/Home.jsx';
import Portfolio from './pages/Portfolio.jsx';
import Alerts from './pages/Alerts.jsx';
import Auth from './pages/Auth.jsx';
import ApiDocs from './pages/ApiDocs.jsx';
import Telegram from './pages/Telegram.jsx';
import VerifyEmail from './pages/VerifyEmail.jsx';
import Account from './pages/Account.jsx';
import GoldDetail from './pages/GoldDetail.jsx';
import WorldGoldConverter from "./pages/WorldGoldConverter";

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/portfolio" element={<Portfolio />} />
        <Route path="/alerts" element={<Alerts />} />
        <Route path="/login" element={<Auth />} />
        <Route path="/api" element={<ApiDocs />} />
        <Route path="/telegram" element={<Telegram />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/account" element={<Account />} />
        <Route path="/:slug" element={<GoldDetail />} />
        <Route
          path="/quy-doi-gia-vang-the-gioi"
          element={<WorldGoldConverter />}
        />
      </Routes>
    </Layout>
  );
}
