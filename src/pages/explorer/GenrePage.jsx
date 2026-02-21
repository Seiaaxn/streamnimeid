// pages/explorer/GenrePage.jsx
import { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Play, Loader2, Star, ArrowUpDown,
    Wand2, Sword, Heart, Zap, Ghost, Laugh, Drama, Rocket,
    Target, Music, School, Skull, Coffee, Brain, Eye, Sparkles
} from 'lucide-react';
import axios from 'axios';
import { getAnimeByGenre } from '../../data/genreAnime';

const API_BASE = 'https://anime-api-iota-beryl.vercel.app/api';

const GENRE_LIST = [
    { name: 'Romance', value: 'romance' },
    { name: 'Action', value: 'action' },
    { name: 'Fantasy', value: 'fantasy' },
    { name: 'Isekai', value: 'isekai' },
    { name: 'Comedy', value: 'comedy' },
    { name: 'Shounen', value: 'shounen' },
    { name: 'Adventure', value: 'adventure' },
    { name: 'Drama', value: 'drama' },
    { name: 'Supernatural', value: 'supernatural' },
    { name: 'Mystery', value: 'mystery' },
    { name: 'Sci-Fi', value: 'sci-fi' },
    { name: 'Seinen', value: 'seinen' },
    { name: 'Reincarnation', value: 'reincarnation' },
    { name: 'Super Power', value: 'super-power' },
    { name: 'Historical', value: 'historical' },
    { name: 'Horror', value: 'horror' },
    { name: 'Thriller', value: 'thriller' },
    { name: 'Magic', value: 'magic' },
    { name: 'Psychological', value: 'psychological' },
    { name: 'Martial Arts', value: 'martial-arts' },
    { name: 'School', value: 'school' },
    { name: 'Slice of Life', value: 'slice-of-life' },
    { name: 'Sports', value: 'sports' },
    { name: 'Music', value: 'music' },
    { name: 'Military', value: 'military' },
    { name: 'Mecha', value: 'mecha' },
    { name: 'Vampire', value: 'vampire' },
    { name: 'Game', value: 'game' },
    { name: 'Harem', value: 'harem' },
    { name: 'Ecchi', value: 'ecchi' },
];

const getGenreIcon = (genreName) => {
    const iconMap = {
        'Romance': Heart, 'Action': Sword, 'Fantasy': Wand2, 'Isekai': Sparkles,
        'Comedy': Laugh, 'Shounen': Zap, 'Adventure': Rocket, 'Drama': Drama,
        'Supernatural': Ghost, 'Mystery': Eye, 'Sci-Fi': Rocket, 'Seinen': Brain,
        'Reincarnation': Sparkles, 'Super Power': Zap, 'Historical': Sword,
        'Horror': Skull, 'Thriller': Eye, 'Magic': Wand2, 'Psychological': Brain,
        'Martial Arts': Sword, 'School': School, 'Slice of Life': Coffee,
        'Sports': Target, 'Music': Music, 'Military': Target,
        'Mecha': Rocket, 'Vampire': Skull, 'Game': Zap, 'Harem': Heart, 'Ecchi': Heart,
    };
    return iconMap[genreName] || Sparkles;
};

const getGenreColor = (genreName) => {
    const colorMap = {
        'Romance': 'from-rose-500 to-pink-500',
        'Action': 'from-red-500 to-orange-500',
        'Fantasy': 'from-violet-500 to-purple-500',
        'Isekai': 'from-cyan-400 to-blue-500',
        'Comedy': 'from-yellow-500 to-amber-500',
        'Shounen': 'from-orange-500 to-yellow-500',
        'Adventure': 'from-blue-500 to-cyan-500',
        'Drama': 'from-pink-500 to-rose-500',
        'Supernatural': 'from-violet-600 to-purple-600',
        'Mystery': 'from-purple-700 to-indigo-700',
        'Sci-Fi': 'from-cyan-500 to-blue-600',
        'Seinen': 'from-gray-600 to-gray-700',
        'Reincarnation': 'from-purple-400 to-pink-400',
        'Super Power': 'from-yellow-400 to-orange-400',
        'Historical': 'from-amber-600 to-yellow-600',
        'Horror': 'from-gray-900 to-red-900',
        'Thriller': 'from-slate-700 to-gray-800',
        'Magic': 'from-violet-400 to-fuchsia-500',
        'Psychological': 'from-indigo-500 to-purple-700',
        'Martial Arts': 'from-red-600 to-orange-600',
        'School': 'from-blue-400 to-cyan-400',
        'Slice of Life': 'from-green-400 to-emerald-400',
        'Sports': 'from-orange-400 to-red-400',
        'Music': 'from-pink-400 to-purple-500',
        'Military': 'from-green-700 to-emerald-800',
        'Mecha': 'from-zinc-500 to-slate-600',
        'Vampire': 'from-red-900 to-purple-900',
        'Game': 'from-cyan-500 to-blue-500',
        'Harem': 'from-rose-400 to-pink-500',
        'Ecchi': 'from-pink-400 to-rose-400',
    };
    return colorMap[genreName] || 'from-primary-400 to-primary-500';
};

const GenrePage = ({ onAnimeSelect }) => {
    const navigate = useNavigate();
    const [selectedGenre, setSelectedGenre] = useState(null);
    const [animeList, setAnimeList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(false);
    const [apiList, setApiList] = useState([]);  // tambahan dari API
    const [sortLatest, setSortLatest] = useState(true);

    // Ketika genre berubah, langsung tampilkan data lokal
    useEffect(() => {
        if (selectedGenre) {
            const localData = getAnimeByGenre(selectedGenre.value);
            setAnimeList(localData);
            setApiList([]);
            setPage(1);
            setHasMore(true); // Bisa load more dari API
            // Coba fetch dari API juga
            fetchFromAPI(selectedGenre.value, 1, true);
        } else {
            setAnimeList([]);
            setApiList([]);
            setHasMore(false);
        }
    }, [selectedGenre]);

    const fetchFromAPI = async (genreValue, pg, reset = false) => {
        if (reset) setLoading(true);
        else setLoadingMore(true);
        try {
            const res = await axios.get(`${API_BASE}/anime/genre/${genreValue}?page=${pg}`);
            const fetched = res.data.anime || [];
            if (reset) {
                setApiList(fetched);
            } else {
                setApiList(prev => [...prev, ...fetched]);
            }
            setHasMore(res.data.nextPage !== null && fetched.length > 0);
        } catch {
            setHasMore(false);
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    };

    const loadMore = () => {
        if (!loadingMore && hasMore && selectedGenre) {
            const next = page + 1;
            setPage(next);
            fetchFromAPI(selectedGenre.value, next, false);
        }
    };

    // Gabungkan data lokal + API, hilangkan duplikat by title
    const merged = useMemo(() => {
        const map = new Map();
        [...animeList, ...apiList].forEach(a => {
            if (a.title && !map.has(a.title)) map.set(a.title, a);
        });
        const arr = Array.from(map.values());
        return sortLatest ? arr : [...arr].reverse();
    }, [animeList, apiList, sortLatest]);

    const handleClick = (item) => {
        if (onAnimeSelect) {
            onAnimeSelect(item);
        } else {
            const category = item.source === 'anichin' ? 'donghua' : 'anime';
            const url = (item.url || item.link || '').replace(/\/+$/, '');
            if (url) navigate(`/detail/${category}/${encodeURIComponent(url)}`);
        }
    };

    // === GENRE GRID VIEW ===
    if (!selectedGenre) {
        return (
            <div className="p-4">
                <h2 className="text-sm font-semibold text-gray-400 mb-4 uppercase tracking-widest">Pilih Genre</h2>
                <div className="grid grid-cols-3 gap-2.5">
                    {GENRE_LIST.map((genre) => {
                        const Icon = getGenreIcon(genre.name);
                        const gradient = getGenreColor(genre.name);
                        const count = getAnimeByGenre(genre.value).length;
                        return (
                            <button
                                key={genre.value}
                                onClick={() => setSelectedGenre(genre)}
                                className={`relative overflow-hidden rounded-2xl p-3.5 text-left bg-gradient-to-br ${gradient} transition-all active:scale-95 shadow-md`}
                            >
                                <Icon size={20} className="text-white/90 mb-2" />
                                <p className="text-white font-bold text-xs leading-tight">{genre.name}</p>
                                {count > 0 && (
                                    <p className="text-white/60 text-[10px] mt-0.5">{count}+ anime</p>
                                )}
                                {/* shine effect */}
                                <div className="absolute top-0 right-0 w-12 h-12 bg-white/10 rounded-full -translate-y-4 translate-x-4" />
                            </button>
                        );
                    })}
                </div>
            </div>
        );
    }

    // === GENRE DETAIL VIEW ===
    return (
        <div className="min-h-screen bg-dark-bg">
            {/* Genre Header */}
            <div className="sticky top-0 z-30 bg-dark-bg/95 backdrop-blur-sm border-b border-dark-border">
                <div className="px-4 py-3 flex items-center gap-3">
                    <button
                        onClick={() => setSelectedGenre(null)}
                        className="text-xs text-gray-400 hover:text-white transition flex items-center gap-1"
                    >
                        ← Genre
                    </button>
                    <span className="text-gray-600">/</span>
                    <h2 className="text-base font-bold text-white flex-1">{selectedGenre.name}</h2>
                    <button
                        onClick={() => setSortLatest(p => !p)}
                        className={`flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg border transition-colors ${
                            sortLatest ? 'bg-primary-400/10 border-primary-400/30 text-primary-400' : 'bg-dark-card border-dark-border text-gray-400'
                        }`}
                    >
                        <ArrowUpDown size={12} />
                        {sortLatest ? 'Terbaru' : 'Terlama'}
                    </button>
                </div>
            </div>

            <div className="p-4 pt-3">
                {loading && merged.length === 0 ? (
                    <div className="grid grid-cols-3 gap-2">
                        {[...Array(12)].map((_, i) => (
                            <div key={i} className="space-y-2">
                                <div className="aspect-[3/4] rounded-xl bg-dark-card animate-pulse" />
                                <div className="h-3 w-3/4 bg-dark-card rounded animate-pulse" />
                            </div>
                        ))}
                    </div>
                ) : merged.length > 0 ? (
                    <>
                        <p className="text-xs text-gray-600 mb-3">{merged.length} anime ditemukan</p>
                        <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
                            {merged.map((anime, index) => (
                                <div
                                    key={index}
                                    onClick={() => handleClick(anime)}
                                    className="group cursor-pointer"
                                >
                                    <div className="relative aspect-[3/4] rounded-[10px] overflow-hidden mb-2 bg-dark-card">
                                        <img
                                            src={anime.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(anime.title?.slice(0,10))}&background=1a1a1a&color=ffaf2f&size=400`}
                                            alt={anime.title}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                            loading="lazy"
                                            onError={e => { e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(anime.title?.slice(0,10))}&background=1a1a1a&color=ffaf2f&size=400`; }}
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                                        {/* Score Badge */}
                                        {anime.score && anime.score !== 'N/A' && (
                                            <div className="absolute top-1.5 right-1.5 flex items-center gap-0.5 bg-black/70 px-1.5 py-0.5 rounded-md">
                                                <Star size={8} className="text-yellow-400 fill-yellow-400" />
                                                <span className="text-[9px] font-semibold text-white">{anime.score}</span>
                                            </div>
                                        )}

                                        {/* Status badge */}
                                        {anime.status && (
                                            <div className="absolute bottom-1.5 left-1.5">
                                                <span className={`px-1.5 py-0.5 text-[8px] font-bold rounded-md ${
                                                    anime.status === 'Ongoing' ? 'bg-emerald-500/90 text-white' : 'bg-gray-500/80 text-white'
                                                }`}>{anime.status}</span>
                                            </div>
                                        )}

                                        {/* Play overlay */}
                                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 z-20">
                                            <div className="w-9 h-9 bg-primary-400 rounded-full flex items-center justify-center shadow-lg">
                                                <Play size={16} className="text-black ml-0.5" fill="currentColor" />
                                            </div>
                                        </div>
                                    </div>

                                    <h3 className="text-[11px] font-medium text-gray-200 line-clamp-2 group-hover:text-primary-300 transition-colors leading-snug">
                                        {anime.title}
                                    </h3>
                                    <p className="text-[10px] text-gray-600 mt-0.5">
                                        {anime.type || anime.status || ''}
                                    </p>
                                </div>
                            ))}
                        </div>

                        {/* Load More */}
                        {hasMore && (
                            <button
                                onClick={loadMore}
                                disabled={loadingMore}
                                className="w-full mt-6 py-3 rounded-xl bg-dark-surface border border-dark-border text-sm text-gray-400 hover:text-white hover:border-primary-400/50 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {loadingMore ? (
                                    <><Loader2 size={16} className="animate-spin" />Loading...</>
                                ) : (
                                    'Muat Lebih Banyak'
                                )}
                            </button>
                        )}
                    </>
                ) : (
                    <div className="text-center py-12">
                        <p className="text-gray-500 mb-2">Tidak ada anime ditemukan</p>
                        <button onClick={() => setSelectedGenre(null)} className="text-primary-400 text-sm">
                            ← Kembali ke genre
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default GenrePage;
