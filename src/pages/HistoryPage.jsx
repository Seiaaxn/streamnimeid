// HistoryPage.jsx - Firebase-powered watch history
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Play, Trash2, Clock, X, RefreshCw, LogIn } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getFirebaseHistory, removeFromFirebaseHistory, clearFirebaseHistory } from '../firebase/historyService';

const HistoryPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [clearing, setClearing] = useState(false);

  useEffect(() => {
    if (user) loadHistory();
    else setLoading(false);
  }, [user]);

  const loadHistory = async () => {
    setLoading(true);
    const data = await getFirebaseHistory(user.uid);
    setHistory(data);
    setLoading(false);
  };

  const handleRemove = async (docId) => {
    await removeFromFirebaseHistory(user.uid, docId);
    setHistory(prev => prev.filter(h => h.id !== docId));
  };

  const handleClearAll = async () => {
    if (!window.confirm('Hapus semua riwayat tontonan?')) return;
    setClearing(true);
    await clearFirebaseHistory(user.uid);
    setHistory([]);
    setClearing(false);
  };

  const handleContinue = (item) => {
    const path = item.category === 'donghua' ? '/donghua/watch' : '/anime/watch';
    navigate(`${path}?url=${encodeURIComponent(item.episodeUrl || item.url)}`);
  };

  const timeAgo = (ts) => {
    if (!ts) return '';
    const date = ts.toDate ? ts.toDate() : new Date(ts);
    const diff = (Date.now() - date.getTime()) / 1000;
    if (diff < 60) return 'Baru saja';
    if (diff < 3600) return `${Math.floor(diff/60)} menit lalu`;
    if (diff < 86400) return `${Math.floor(diff/3600)} jam lalu`;
    if (diff < 604800) return `${Math.floor(diff/86400)} hari lalu`;
    return date.toLocaleDateString('id-ID');
  };

  // Not logged in
  if (!user && !loading) {
    return (
      <div className="min-h-screen bg-dark-bg pb-20">
        <header className="sticky top-0 z-40 border-b border-dark-border" style={{background:'rgba(10,10,10,0.95)',backdropFilter:'blur(20px)'}}>
          <div className="px-4 h-14 flex items-center">
            <Clock size={18} className="text-primary-400 mr-2" />
            <h1 className="text-base font-bold text-white">Riwayat</h1>
          </div>
        </header>
        <div className="flex flex-col items-center justify-center min-h-[60vh] px-6 text-center">
          <div className="w-16 h-16 rounded-full bg-dark-card flex items-center justify-center mb-4">
            <Clock size={28} className="text-gray-600" />
          </div>
          <h2 className="text-base font-bold text-white mb-2">Belum Login</h2>
          <p className="text-gray-500 text-sm mb-6">Login untuk menyimpan riwayat tontonanmu</p>
          <Link to="/login" className="px-6 py-3 bg-primary-400 text-black font-bold rounded-xl text-sm">
            Login Sekarang
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-bg pb-20">
      <header className="sticky top-0 z-40 border-b border-dark-border" style={{background:'rgba(10,10,10,0.95)',backdropFilter:'blur(20px)'}}>
        <div className="px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock size={17} className="text-primary-400" />
            <h1 className="text-base font-bold text-white">Riwayat Tontonan</h1>
          </div>
          {history.length > 0 && (
            <button
              onClick={handleClearAll}
              disabled={clearing}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg text-xs font-medium disabled:opacity-60"
            >
              {clearing ? <RefreshCw size={12} className="animate-spin" /> : <Trash2 size={12} />}
              Hapus Semua
            </button>
          )}
        </div>
      </header>

      <div className="px-4 pt-4">
        {loading ? (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex gap-3 p-3 bg-dark-card rounded-2xl border border-dark-border animate-pulse">
                <div className="w-16 h-20 rounded-xl bg-dark-surface flex-shrink-0" />
                <div className="flex-1 space-y-2 py-1">
                  <div className="h-4 w-3/4 bg-dark-surface rounded" />
                  <div className="h-3 w-1/2 bg-dark-surface rounded" />
                  <div className="h-3 w-1/3 bg-dark-surface rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : history.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
            <div className="w-16 h-16 rounded-full bg-dark-card flex items-center justify-center mb-4">
              <Clock size={28} className="text-gray-700" />
            </div>
            <h2 className="text-base font-bold text-white mb-2">Belum Ada Riwayat</h2>
            <p className="text-gray-500 text-sm mb-6">Anime yang kamu tonton akan muncul di sini</p>
            <button onClick={() => navigate('/')} className="px-6 py-3 bg-primary-400 text-black font-bold rounded-xl text-sm">
              Jelajahi Anime
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-xs text-gray-600 mb-2">{history.length} episode ditonton</p>
            {history.map(item => (
              <div
                key={item.id}
                className="flex gap-3 p-3 bg-dark-card border border-dark-border rounded-2xl group hover:border-primary-400/30 transition-colors"
              >
                {/* Thumbnail */}
                <div
                  className="w-16 h-20 rounded-xl overflow-hidden bg-dark-surface flex-shrink-0 cursor-pointer"
                  onClick={() => handleContinue(item)}
                >
                  <img
                    src={item.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(item.title?.slice(0,5))}&background=1a1a1a&color=fff`}
                    alt={item.title}
                    className="w-full h-full object-cover"
                    onError={e => { e.target.src = `https://ui-avatars.com/api/?name=A&background=1a1a1a&color=fff`; }}
                  />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h3
                    className="text-sm font-semibold text-white line-clamp-1 cursor-pointer hover:text-primary-300 transition-colors"
                    onClick={() => handleContinue(item)}
                  >
                    {item.title}
                  </h3>
                  <p className="text-xs text-primary-400 mt-0.5">
                    {item.episodeTitle || `Episode ${item.episode || '?'}`}
                  </p>
                  <p className="text-[10px] text-gray-600 mt-1">{timeAgo(item.watchedAt)}</p>

                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() => handleContinue(item)}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-primary-400/15 text-primary-400 rounded-lg text-[11px] font-semibold hover:bg-primary-400/25 transition-colors"
                    >
                      <Play size={11} fill="currentColor" />
                      Lanjutkan
                    </button>
                    <span className={`px-2 py-1 rounded-md text-[10px] font-bold ${item.category === 'donghua' ? 'bg-red-500/15 text-red-400' : 'bg-blue-500/15 text-blue-400'}`}>
                      {item.category === 'donghua' ? 'Donghua' : 'Anime'}
                    </span>
                  </div>
                </div>

                {/* Remove */}
                <button
                  onClick={() => handleRemove(item.id)}
                  className="p-1.5 text-gray-700 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100 self-start"
                >
                  <X size={15} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoryPage;
                
