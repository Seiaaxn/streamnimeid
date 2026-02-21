// src/App.jsx
import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import HomePage from './pages/HomePage';
import DetailPage from './pages/DetailPage/index';
import StreamingAnime from './pages/Streaming/StreamingAnime';
import StreamingDonghua from './pages/Streaming/StreamingDonghua';
import ExplorerPage from './pages/ExplorerPage';
import MyListPage from './pages/MyListPage';
import ProfilePage from './pages/ProfilePage';
import AutoToTop from './components/AutoToTop';
import Search from './pages/Search';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import AllAnimePage from './pages/explorer/AllAnimePage';
import AllDonghuaPage from './pages/explorer/AllDonghuaPage';
import { AuthProvider } from './contex/AuthContext';

function App() {
  return (
    <AuthProvider>
      <AutoToTop />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/detail/:category/:id" element={<DetailPage />} />
        <Route path="/anime/watch" element={<StreamingAnime />} />
        <Route path="/donghua/watch" element={<StreamingDonghua />} />
        <Route path="/explore/all-anime" element={<AllAnimePage />} />
        <Route path="/explore/all-donghua" element={<AllDonghuaPage />} />

        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/explore" element={<ExplorerPage />} />
          <Route path="/mylist" element={<MyListPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/search" element={<Search />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;
        
