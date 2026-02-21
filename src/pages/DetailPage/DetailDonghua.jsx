// DetailDonghua.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Play, Bookmark, Share2, Star, Heart, ChevronDown, ChevronUp } from 'lucide-react';
import { useDetailData } from '../../hooks/useDetailData';
import { useAuth } from '../../context/AuthContext';
import { addToFirebaseHistory } from '../../firebase/historyService';
import {
    DonghuaLoadingState,
    DonghuaErrorState
} from '../../components/detailPage/donghua';
import DonghuaEpisodesTab from '../../components/detailPage/donghua/DonghuaEpisodesTab';
import DonghuaDetailsTab from '../../components/detailPage/donghua/DonghuaDetailsTab';
import DonghuaCharactersTab from '../../components/detailPage/donghua/DonghuaCharactersTab';

const DetailDonghua = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { detail, loading, error } = useDetailData();
    const [activeTab, setActiveTab] = useState('episodes');
    const [bookmarked, setBookmarked] = useState(false);
    const [synopsisExpanded, setSynopsisExpanded] = useState(false);

    useEffect(() => { window.scrollTo(0, 0); }, []);

    const handleWatchEpisode = (episode) => {
        if (!detail || !episode?.url) return;

        if (user) {
            addToFirebaseHistory(user.uid, {
                title: detail.title,
                image: detail.image,
                url: detail.url || '',
                episodeUrl: episode.url,
                episodeTitle: episode.title || `Episode ${episode.number || episode.episode}`,
                episode: episode.number || episode.episode,
                category: 'donghua',
                source: 'anichin',
            });
        }

        navigate(`/donghua/watch?url=${encodeURIComponent(episode.url)}`);
    };

    if (loading) return <DonghuaLoadingState onGoBack={() => navigate(-1)} />;
    if (error || !detail) return <DonghuaErrorState error={error} onGoBack={() => navigate(-1)} />;

    const firstEp = detail.episodes?.[0];
    const tabs = [
        { id: 'episodes', label: `Episode (${detail.episodes?.length || 0})` },
        { id: 'details', label: 'Detail' },
        ...(detail.characters?.length > 0 ? [{ id: 'characters', label: 'Karakter' }] : []),
    ];

    return (
        <div className="min-h-screen bg-[#0a0a0a] pb-8">
            {/* Hero Banner */}
            <div className="relative w-full" style={{ height: '55vw', maxHeight: 320 }}>
                <img
                    src={detail.image || ''}
                    alt={detail.title}
                    className="w-full h-full object-cover"
                    onError={e => { e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(detail.title)}&background=1a1a1a&color=fff&size=600`; }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/40 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a]/60 to-transparent" />

                <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-3 pt-12">
                    <button onClick={() => navigate(-1)} className="p-2 bg-black/40 backdrop-blur rounded-full">
                        <ChevronLeft size={20} className="text-white" />
                    </button>
                    <div className="flex gap-2">
                        <button onClick={() => setBookmarked(!bookmarked)} className="p-2 bg-black/40 backdrop-blur rounded-full">
                            <Bookmark size={18} className={bookmarked ? 'fill-red-400 text-red-400' : 'text-white'} />
                        </button>
                        <button className="p-2 bg-black/40 backdrop-blur rounded-full">
                            <Share2 size={18} className="text-white" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="px-4 -mt-8 relative z-10">
                {/* Title row */}
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
                            <span className="px-2 py-0.5 bg-red-500/15 text-red-400 text-[10px] font-bold rounded-md">DONGHUA</span>
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
                        <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-red-500/15 text-red-400 border border-red-500/20">
                            {detail.type}
                        </span>
                    )}
                    {detail.totalEpisodes > 0 && (
                        <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-dark-card text-gray-400 border border-dark-border">
                            {detail.totalEpisodes} Ep
                        </span>
                    )}
                    {detail.country && (
                        <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-dark-card text-gray-400 border border-dark-border">
                            {detail.country}
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
                        className="flex-1 flex items-center justify-center gap-2 py-3 bg-red-500 text-white rounded-xl font-bold text-sm shadow-lg shadow-red-500/20 active:scale-95 transition-transform"
                    >
                        <Play size={16} fill="currentColor" />
                        Tonton Sekarang
                    </button>
                    <button
                        onClick={() => setBookmarked(!bookmarked)}
                        className={`px-4 py-3 rounded-xl border font-medium text-sm transition-colors ${bookmarked ? 'bg-red-500/15 border-red-500/40 text-red-400' : 'bg-dark-card border-dark-border text-gray-400'}`}
                    >
                        <Heart size={16} className={bookmarked ? 'fill-red-400' : ''} />
                    </button>
                </div>

                {/* Synopsis */}
                {(detail.synopsis || detail.description) && (
                    <div className="mb-5">
                        <p className={`text-sm text-gray-400 leading-relaxed ${synopsisExpanded ? '' : 'line-clamp-3'}`}>
                            {detail.synopsis || detail.description}
                        </p>
                        <button onClick={() => setSynopsisExpanded(!synopsisExpanded)} className="text-xs text-red-400 mt-1 flex items-center gap-1">
                            {synopsisExpanded ? <><ChevronUp size={12} />Lebih sedikit</> : <><ChevronDown size={12} />Selengkapnya</>}
                        </button>
                    </div>
                )}

                {/* Tabs */}
                <div className="flex border-b border-dark-border mb-4">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`pb-2.5 px-1 mr-5 text-sm font-semibold transition-colors relative ${activeTab === tab.id ? 'text-red-400' : 'text-gray-500 hover:text-gray-300'}`}
                        >
                            {tab.label}
                            {activeTab === tab.id && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-500 rounded-full" />}
                        </button>
                    ))}
                </div>

                {activeTab === 'episodes' && (
                    <DonghuaEpisodesTab
                        episodes={detail.episodes}
                        onEpisodeSelect={handleWatchEpisode}
                    />
                )}
                {activeTab === 'details' && (
                    <DonghuaDetailsTab
                        description={detail.description || detail.synopsis}
                        status={detail.status}
                        type={detail.type}
                        totalEpisodes={detail.totalEpisodes}
                        studio={detail.studio}
                        network={detail.network}
                        released={detail.released}
                        duration={detail.duration}
                        season={detail.season}
                        country={detail.country}
                        fansub={detail.fansub}
                        postedBy={detail.postedBy}
                        postedOn={detail.postedOn}
                        updatedOn={detail.updatedOn}
                        genres={detail.genres}
                        rating={detail.rating}
                    />
                )}
                {activeTab === 'characters' && (
                    <DonghuaCharactersTab characters={detail.characters} />
                )}
            </div>
        </div>
    );
};

export default DetailDonghua;
                                
