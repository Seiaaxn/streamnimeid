// StreamingAnime.jsx - Redesigned with Firebase history + comments + no ads
import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ChevronLeft, MonitorPlay, Download, Share2, Bookmark, ExternalLink, X, Check, ChevronDown } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { addToFirebaseHistory } from '../../firebase/historyService';
import StreamingAnimeVideoPlayer from '../../components/streaming/anime/StreamingAnimeVideoPlayer';
import StreamingAnimeCommentsSection from '../../components/streaming/anime/StreamingAnimeCommentsSection';

const API_BASE = 'https://anime-api-iota-beryl.vercel.app/api';

const StreamingAnime = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const searchParams = new URLSearchParams(location.search);
  const episodeUrl = searchParams.get('url');

  const [episodeData, setEpisodeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedServer, setSelectedServer] = useState(null);
  const [isIframeLoading, setIsIframeLoading] = useState(false);
  const [showServerSheet, setShowServerSheet] = useState(false);
  const [showDownloadSheet, setShowDownloadSheet] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [historyAdded, setHistoryAdded] = useState(false);
  const iframeRef = useRef(null);

  useEffect(() => {
    if (!episodeUrl) { setError('No episode URL'); setLoading(false); return; }
    fetchEpisode();
  }, [episodeUrl]);

  const fetchEpisode = async () => {
    try {
      setLoading(true);
      setHistoryAdded(false);
      const res = await axios.get(`${API_BASE}/anime/episode?url=${encodeURIComponent(episodeUrl)}`);
      if (res.data.success) {
        setEpisodeData(res.data.data);
        if (res.data.data.streams?.length > 0) {
          setSelectedServer(res.data.data.streams[0]);
          setIsIframeLoading(true);
        }
      } else {
        setError(res.data.error || 'Gagal memuat episode');
      }
    } catch (err) {
      setError('Gagal memuat data episode');
    } finally {
      setLoading(false);
    }
  };

  // Save to history when video loads
  useEffect(() => {
    if (!episodeData || historyAdded || !user) return;
    const { currentEpisode, anime } = episodeData;
    if (!anime) return;

    setHistoryAdded(true);
    const histItem = {
      title: anime.title || '',
      image: anime.image || '',
      url: anime.url || '',
      episodeUrl: episodeUrl,
      episodeTitle: currentEpisode?.title || `Episode ${currentEpisode?.number || '?'}`,
      episode: currentEpisode?.number || '',
      category: 'anime',
      source: 'samehadaku',
    };
    addToFirebaseHistory(user.uid, histItem);
  }, [episodeData, user]);

  const handleEpisodeClick = (ep) => {
    navigate(`/anime/watch?url=${encodeURIComponent(ep.url)}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a]">
        <div className="sticky top-0 z-50 border-b border-dark-border" style={{background:'rgba(10,10,10,0.97)',backdropFilter:'blur(20px)'}}>
          <div className="flex items-center h-14 px-4">
            <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-dark-card transition-colors">
              <ChevronLeft size={20} className="text-gray-400" />
            </button>
            <div className="ml-3 flex-1">
              <div className="h-4 w-40 bg-dark-card rounded animate-pulse" />
              <div className="h-3 w-24 bg-dark-card rounded animate-pulse mt-1" />
            </div>
          </div>
        </div>
        <div className="w-full bg-black" style={{aspectRatio:'16/9'}}>
          <div className="w-full h-full flex items-center justify-center bg-[#0d0d0d]">
            <div className="w-10 h-10 border-[3px] border-primary-400 border-t-transparent rounded-full animate-spin" />
          </div>
        </div>
        <div className="px-4 pt-4 space-y-3">
          <div className="h-6 w-3/4 bg-dark-card rounded animate-pulse" />
          <div className="h-4 w-full bg-dark-card rounded animate-pulse" />
          <div className="h-4 w-4/5 bg-dark-card rounded animate-pulse" />
        </div>
      </div>
    );
  }

  if (error || !episodeData) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center px-6 text-center">
        <MonitorPlay size={48} className="text-gray-700 mb-4" />
        <h2 className="text-white font-bold text-lg mb-2">Gagal Memuat Episode</h2>
        <p className="text-gray-500 text-sm mb-6">{error}</p>
        <button onClick={() => navigate(-1)} className="px-6 py-3 bg-primary-400 text-black rounded-full font-bold text-sm">
          Kembali
        </button>
      </div>
    );
  }

  const { currentEpisode, anime, episodes, streams, downloads, navigation } = episodeData;
  const contentId = `anime_${encodeURIComponent(anime?.url || episodeUrl).slice(0, 80)}`;

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Navbar */}
      <div className="sticky top-0 z-50 border-b border-dark-border" style={{background:'rgba(10,10,10,0.97)',backdropFilter:'blur(20px)'}}>
        <div className="flex items-center h-14 px-3">
          <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-dark-card transition-colors">
            <ChevronLeft size={20} className="text-gray-400" />
          </button>
          <div className="flex-1 mx-2 min-w-0">
            <h1 className="text-sm font-bold text-white truncate leading-tight">{anime?.title || 'Anime'}</h1>
            <p className="text-[11px] text-primary-400 truncate">
              {currentEpisode?.title || `Episode ${currentEpisode?.number || '?'}`}
            </p>
          </div>
          <div className="flex items-center gap-0.5">
            <button
              onClick={() => setBookmarked(!bookmarked)}
              className="p-2 hover:bg-dark-card rounded-full transition-colors"
            >
              <Bookmark size={18} className={bookmarked ? 'fill-primary-400 text-primary-400' : 'text-gray-500'} />
            </button>
          </div>
        </div>
      </div>

      {/* Video Player */}
      <StreamingAnimeVideoPlayer
        ref={iframeRef}
        selectedServer={selectedServer}
        isLoading={isIframeLoading}
        onLoad={() => setIsIframeLoading(false)}
        onError={() => setIsIframeLoading(false)}
      />

      <div className="px-4 pt-4 pb-20">
        {/* Info */}
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2 py-0.5 bg-primary-400/15 text-primary-400 text-[10px] font-bold rounded-md">
              Episode {currentEpisode?.number}
            </span>
            {anime?.status && (
              <span className={`px-2 py-0.5 text-[10px] font-bold rounded-md ${anime.status === 'Ongoing' ? 'bg-emerald-500/15 text-emerald-400' : 'bg-gray-500/15 text-gray-400'}`}>
                {anime.status}
              </span>
            )}
          </div>
          <h2 className="text-base font-bold text-white leading-snug mb-1">{anime?.title}</h2>
          {anime?.synopsis && (
            <SynopsisText text={anime.synopsis} />
          )}
        </div>

        {/* Server + Download controls */}
        <div className="flex gap-2 mb-5">
          <button
            onClick={() => { setShowServerSheet(true); setShowDownloadSheet(false); }}
            className="flex items-center gap-2 px-3 py-2 bg-dark-card border border-dark-border rounded-xl text-xs text-white font-medium hover:border-primary-400/40 transition-colors"
          >
            <MonitorPlay size={14} className="text-primary-400" />
            <span>{selectedServer?.server || 'Server'}</span>
            <ChevronDown size={13} className="text-gray-500" />
          </button>
          <button
            onClick={() => { setShowDownloadSheet(true); setShowServerSheet(false); }}
            className="flex items-center gap-2 px-3 py-2 bg-dark-card border border-dark-border rounded-xl text-xs text-gray-300 font-medium hover:border-gray-600 transition-colors"
          >
            <Download size={14} />
            Download
          </button>
          <button className="flex items-center gap-2 px-3 py-2 bg-dark-card border border-dark-border rounded-xl text-xs text-gray-300 font-medium hover:border-gray-600 transition-colors ml-auto">
            <Share2 size={14} />
          </button>
        </div>

        {/* Episodes Grid */}
        {episodes?.length > 0 && (
          <div className="mb-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-white">Episode List</h3>
              <span className="text-xs text-gray-600">{episodes.length} ep</span>
            </div>
            <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-1">
              {episodes.map((ep, i) => {
                const isCurrent = ep.number == currentEpisode?.number || ep.episode == currentEpisode?.number;
                return (
                  <button
                    key={i}
                    onClick={() => handleEpisodeClick(ep)}
                    className={`flex-none rounded-xl text-xs font-semibold transition-all duration-200 ${
                      isCurrent
                        ? 'bg-primary-400 text-black px-3 py-2 shadow-lg shadow-primary-400/20'
                        : 'bg-dark-card border border-dark-border text-gray-400 hover:border-primary-400/40 hover:text-white px-3 py-2'
                    }`}
                  >
                    Ep {ep.number || ep.episode || (i+1)}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Prev / Next navigation */}
        {(navigation?.prev || navigation?.next) && (
          <div className="flex gap-3 mb-6">
            <button
              onClick={() => navigation?.prev && navigate(`/anime/watch?url=${encodeURIComponent(navigation.prev)}`)}
              disabled={!navigation?.prev}
              className="flex-1 py-2.5 bg-dark-card border border-dark-border rounded-xl text-xs font-semibold text-gray-400 disabled:opacity-30 hover:border-primary-400/40 hover:text-white transition-colors"
            >
              ← Episode Sebelumnya
            </button>
            <button
              onClick={() => navigation?.next && navigate(`/anime/watch?url=${encodeURIComponent(navigation.next)}`)}
              disabled={!navigation?.next}
              className="flex-1 py-2.5 bg-primary-400/10 border border-primary-400/30 rounded-xl text-xs font-semibold text-primary-400 disabled:opacity-30 hover:bg-primary-400/20 transition-colors"
            >
              Episode Berikutnya →
            </button>
          </div>
        )}

        {/* Comments */}
        <StreamingAnimeCommentsSection contentId={contentId} />
      </div>

      {/* Server Sheet */}
      <BottomSheet open={showServerSheet} onClose={() => setShowServerSheet(false)} title="Pilih Server">
        <div className="space-y-2">
          {streams?.map((server, i) => (
            <button
              key={i}
              onClick={() => { setSelectedServer(server); setIsIframeLoading(true); setShowServerSheet(false); }}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${
                selectedServer?.url === server.url
                  ? 'bg-primary-400/15 border border-primary-400/40'
                  : 'bg-dark-card border border-dark-border hover:border-gray-600'
              }`}
            >
              <div className="flex items-center gap-3">
                <MonitorPlay size={16} className={selectedServer?.url === server.url ? 'text-primary-400' : 'text-gray-500'} />
                <span className={`text-sm font-medium ${selectedServer?.url === server.url ? 'text-white' : 'text-gray-400'}`}>
                  {server.server || `Server ${i+1}`}
                </span>
              </div>
              {selectedServer?.url === server.url && <Check size={14} className="text-primary-400" />}
            </button>
          ))}
        </div>
      </BottomSheet>

      {/* Download Sheet */}
      <BottomSheet open={showDownloadSheet} onClose={() => setShowDownloadSheet(false)} title="Download Episode">
        {!downloads?.length ? (
          <p className="text-center text-gray-600 py-6 text-sm">Download tidak tersedia</p>
        ) : (
          <div className="space-y-4">
            {downloads.map((dl, i) => (
              <div key={i} className="bg-dark-card rounded-xl border border-dark-border p-3">
                <h4 className="text-xs font-bold text-gray-400 mb-2">{dl.format}</h4>
                <div className="space-y-2">
                  {dl.qualities?.map((q, qi) => (
                    <div key={qi} className="flex items-start gap-2">
                      <span className="text-xs font-bold text-primary-400 w-14 flex-shrink-0">{q.quality}</span>
                      <div className="flex flex-wrap gap-1.5">
                        {q.links?.map((link, li) => (
                          <a key={li} href={link.url} target="_blank" rel="noopener noreferrer"
                            className="flex items-center gap-1 px-2 py-1 bg-dark-surface rounded text-xs text-gray-300 hover:text-primary-400 transition-colors border border-dark-border">
                            <ExternalLink size={10} />
                            {link.name}
                          </a>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </BottomSheet>
    </div>
  );
};

// Synopsis with expand
const SynopsisText = ({ text }) => {
  const [expanded, setExpanded] = useState(false);
  if (!text) return null;
  return (
    <div>
      <p className={`text-xs text-gray-500 leading-relaxed ${expanded ? '' : 'line-clamp-2'}`}>{text}</p>
      <button onClick={() => setExpanded(!expanded)} className="text-[10px] text-primary-400 mt-0.5">
        {expanded ? 'Lebih sedikit' : 'Selengkapnya'}
      </button>
    </div>
  );
};

// Reusable bottom sheet
const BottomSheet = ({ open, onClose, title, children }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-end" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60" />
      <div className="relative w-full bg-dark-surface rounded-t-3xl border-t border-dark-border p-5 pb-8 max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="w-10 h-1 bg-dark-border rounded-full mx-auto mb-4" />
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-white">{title}</h3>
          <button onClick={onClose} className="p-1.5 hover:bg-dark-card rounded-full transition-colors">
            <X size={16} className="text-gray-500" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

export default StreamingAnime;
         
