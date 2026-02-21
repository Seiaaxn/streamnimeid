// DetailAnime.jsx - Redesigned
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ChevronLeft, Play, Bookmark, Share2, Star, Tv, Calendar,
  Hash, Flag, ChevronDown, ChevronUp, Heart
} from 'lucide-react';
import { useDetailData } from '../../hooks/useDetailData';
import { AnimeLoadingState, AnimeErrorState } from '../../components/detailPage/anime';
import { useAuth } from '../../context/AuthContext';
import { addToFirebaseHistory } from '../../firebase/historyService';

const DetailAnime = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { detail, loading, error } = useDetailData();
  const [activeTab, setActiveTab] = useState('episodes');
  const [bookmarked, setBookmarked] = useState(false);
  const [synopsisExpanded, setSynopsisExpanded] = useState(false);
  const [sortOrder, setSortOrder] = useState('latest');

  useEffect(() => { window.scrollTo(0, 0); }, []);

  const handleWatchEpisode = (episode) => {
    if (!detail || !episode?.url) return;
    navigate(`/anime/watch?url=${encodeURIComponent(episode.url)}`);
  };

  const sortedEpisodes = [...(detail?.episodes || [])].sort((a, b) => {
    const na = parseFloat(a.number ?? a.episode ?? 0) || 0;
    const nb = parseFloat(b.number ?? b.episode ?? 0) || 0;
    return sortOrder === 'latest' ? nb - na : na - nb;
  });

  if (loading) return <AnimeLoadingState onGoBack={() => navigate(-1)} />;
  if (error || !detail) return <AnimeErrorState error={error} onGoBack={() => navigate(-1)} />;

  const firstEp = detail.episodes?.[detail.episodes.length - 1] || detail.episodes?.[0];

  return (
    <div className="min-h-screen bg-[#0a0a0a] pb-8">
      {/* Hero Banner */}
      <div className="relative w-full" style={{height: '55vw', maxHeight: 320}}>
        <img
          src={detail.image || ''}
          alt={detail.title}
          className="w-full h-full object-cover"
          onError={e => { e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(detail.title)}&background=1a1a1a&color=fff&size=600`; }}
        />
        {/* Gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a]/60 to-transparent" />

        {/* Top nav */}
        <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-3 pt-12">
          <button onClick={() => navigate(-1)} className="p-2 bg-black/40 backdrop-blur rounded-full">
            <ChevronLeft size={20} className="text-white" />
          </button>
          <div className="flex gap-2">
            <button onClick={() => setBookmarked(!bookmarked)} className="p-2 bg-black/40 backdrop-blur rounded-full">
              <Bookmark size={18} className={bookmarked ? 'fill-primary-400 text-primary-400' : 'text-white'} />
            </button>
            <button className="p-2 bg-black/40 backdrop-blur rounded-full">
              <Share2 size={18} className="text-white" />
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 -mt-8 relative z-10">
        {/* Title & Thumbnail row */}
        <div className="flex gap-3 mb-4">
          <div className="w-20 h-28 rounded-xl overflow-hidden shadow-2xl flex-shrink-0 border border-dark-border">
            <img
              src={detail.image}
              alt={detail.title}
              className="w-full h-full object-cover"
              onError={e => { e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(detail.title)}&background=1a1a1a&color=fff&size=200`; }}
            />
          </div>
          <div className="flex-1 pt-2">
            <div className="mb-1">
              <span className="px-2 py-0.5 bg-primary-400/15 text-primary-400 text-[10px] font-bold rounded-md">ANIME</span>
            </div>
            <h1 className="text-base font-bold text-white leading-snug mb-1">{detail.title}</h1>
            {detail.altTitles?.length > 0 && (
              <p className="text-[11px] text-gray-600 line-clamp-1">{detail.altTitles[0]}</p>
            )}
            {detail.score && (
              <div className="flex items-center gap-1 mt-1">
                <Star size={12} className="text-yellow-400 fill-yellow-400" />
                <span className="text-xs font-bold text-yellow-400">{detail.score}</span>
              </div>
            )}
          </div>
        </div>

        {/* Info badges */}
        <div className="flex flex-wrap gap-2 mb-4">
          {detail.status && (
            <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold ${detail.status === 'Ongoing' ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20' : 'bg-gray-500/15 text-gray-400 border border-gray-500/20'}`}>
              {detail.status}
            </span>
          )}
          {detail.type && (
            <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-blue-500/15 text-blue-400 border border-blue-500/20">
              {detail.type}
            </span>
          )}
          {detail.totalEpisodes > 0 && (
            <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-dark-card text-gray-400 border border-dark-border">
              {detail.totalEpisodes} Ep
            </span>
          )}
          {detail.released && (
            <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-dark-card text-gray-400 border border-dark-border">
              {detail.released}
            </span>
          )}
        </div>

        {/* Genres */}
        {detail.genres?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {detail.genres.map((g, i) => (
              <span key={i} className="px-2.5 py-1 bg-dark-card rounded-full text-[10px] text-gray-500 border border-dark-border">{g}</span>
            ))}
          </div>
        )}

        {/* CTA Buttons */}
        <div className="flex gap-2.5 mb-5">
          <button
            onClick={() => firstEp && handleWatchEpisode(firstEp)}
            className="flex-1 flex items-center justify-center gap-2 py-3 bg-primary-400 text-black rounded-xl font-bold text-sm shadow-lg shadow-primary-400/20 active:scale-95 transition-transform"
          >
            <Play size={16} fill="currentColor" />
            Tonton Sekarang
          </button>
          <button
            onClick={() => setBookmarked(!bookmarked)}
            className={`px-4 py-3 rounded-xl border font-medium text-sm transition-colors ${bookmarked ? 'bg-primary-400/15 border-primary-400/40 text-primary-400' : 'bg-dark-card border-dark-border text-gray-400 hover:border-gray-500'}`}
          >
            <Heart size={16} className={bookmarked ? 'fill-primary-400' : ''} />
          </button>
        </div>

        {/* Synopsis */}
        {detail.synopsis && (
          <div className="mb-5">
            <p className={`text-sm text-gray-400 leading-relaxed ${synopsisExpanded ? '' : 'line-clamp-3'}`}>
              {detail.synopsis}
            </p>
            <button onClick={() => setSynopsisExpanded(!synopsisExpanded)} className="text-xs text-primary-400 mt-1 flex items-center gap-1">
              {synopsisExpanded ? <><ChevronUp size={12} />Lebih sedikit</> : <><ChevronDown size={12} />Selengkapnya</>}
            </button>
          </div>
        )}

        {/* Tabs */}
        <div className="flex border-b border-dark-border mb-4">
          {['episodes', 'details'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-2.5 px-1 mr-5 text-sm font-semibold transition-colors relative ${activeTab === tab ? 'text-primary-400' : 'text-gray-500 hover:text-gray-300'}`}
            >
              {tab === 'episodes' ? `Episode (${detail.episodes?.length || 0})` : 'Detail'}
              {activeTab === tab && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-400 rounded-full" />}
            </button>
          ))}
        </div>

        {/* Episodes Tab */}
        {activeTab === 'episodes' && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-gray-600">{detail.episodes?.length} episode tersedia</span>
              <select
                value={sortOrder}
                onChange={e => setSortOrder(e.target.value)}
                className="bg-dark-card border border-dark-border rounded-lg px-2 py-1 text-xs text-gray-400 outline-none"
              >
                <option value="latest">Terbaru</option>
                <option value="oldest">Terlama</option>
              </select>
            </div>
            {/* Grid pill episodes — rapi di HP */}
            <div className="grid grid-cols-4 gap-2 sm:grid-cols-5">
              {sortedEpisodes.map((ep, i) => {
                const num = ep.number || ep.episode || (i + 1);
                return (
                  <button
                    key={i}
                    onClick={() => handleWatchEpisode(ep)}
                    className="flex flex-col items-center justify-center py-3 px-1 bg-dark-card border border-dark-border rounded-xl hover:border-primary-400/60 hover:bg-primary-400/8 active:scale-95 transition-all group"
                  >
                    <span className="text-sm font-bold text-white group-hover:text-primary-400 transition-colors leading-none">
                      {num}
                    </span>
                    {ep.date && (
                      <span className="text-[9px] text-gray-700 mt-1 truncate w-full text-center">
                        {ep.date.replace(/\d{4}/, '').trim().replace(/^[,\-\s]+/, '')}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Details Tab */}
        {activeTab === 'details' && (
          <div className="space-y-4">
            {detail.synopsis && (
              <div>
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Sinopsis</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{detail.synopsis}</p>
              </div>
            )}
            <div className="bg-dark-card rounded-2xl border border-dark-border overflow-hidden">
              {[
                { label: 'Status', value: detail.status },
                { label: 'Type', value: detail.type },
                { label: 'Total Episode', value: detail.totalEpisodes > 0 ? detail.totalEpisodes : null },
                { label: 'Rilis', value: detail.released },
                { label: 'Studio', value: detail.studio },
                { label: 'Durasi', value: detail.duration },
              ].filter(r => r.value).map((row, i, arr) => (
                <div key={row.label} className={`flex items-center px-4 py-3 ${i < arr.length-1 ? 'border-b border-dark-border' : ''}`}>
                  <span className="text-xs text-gray-600 w-32">{row.label}</span>
                  <span className="text-sm text-white font-medium">{row.value}</span>
                </div>
              ))}
            </div>
            {detail.genres?.length > 0 && (
              <div>
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Genre</h3>
                <div className="flex flex-wrap gap-2">
                  {detail.genres.map((g, i) => (
                    <span key={i} className="px-3 py-1.5 bg-dark-card border border-dark-border rounded-full text-xs text-gray-300">{g}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DetailAnime;
    
