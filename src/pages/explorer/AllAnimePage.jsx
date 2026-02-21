// src/pages/explorer/AllAnimePage.jsx
import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Search, ArrowLeft, ArrowUpDown, Loader2 } from 'lucide-react';
import axios from 'axios';

const API_BASE = 'https://anime-api-iota-beryl.vercel.app/api';
const PAGE_SIZE = 24;

const AllAnimePage = () => {
    const navigate = useNavigate();
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [sortLatest, setSortLatest] = useState(true);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);

    useEffect(() => {
        fetchAnime(1, true);
    }, []);

    const fetchAnime = async (pg = 1, reset = false) => {
        if (reset) setLoading(true);
        else setLoadingMore(true);
        try {
            const res = await axios.get(`${API_BASE}/anime/list?page=${pg}`);
            const data = res.data.anime || [];
            if (reset) {
                setItems(data);
            } else {
                setItems(prev => [...prev, ...data]);
            }
            setHasMore(res.data.nextPage !== null && data.length >= 20);
            setPage(pg);
        } catch (e) {
            // fallback: try shuffle endpoint
            try {
                const res2 = await axios.get(`${API_BASE}/latest/shuffle`);
                if (res2.data.success) {
                    const anime = res2.data.data.filter(i => i.source === 'samehadaku');
                    setItems(anime);
                    setHasMore(false);
                }
            } catch {}
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    };

    const loadMore = () => {
        if (!loadingMore && hasMore) fetchAnime(page + 1, false);
    };

    const handleClick = (item) => {
        let url = item.url || item.link;
        if (!url) return;
        url = url.replace(/\/+$/, '');
        navigate(`/detail/anime/${encodeURIComponent(url)}`);
    };

    const filtered = useMemo(() => {
        let result = items.filter(i => i.title?.toLowerCase().includes(search.toLowerCase()));
        if (sortLatest) {
            // items sudah dari API terbaru, reverse untuk oldest first
            return result;
        } else {
            return [...result].reverse();
        }
    }, [items, search, sortLatest]);

    return (
        <div className="min-h-screen bg-dark-bg pb-20">
            {/* Header */}
            <header className="sticky top-0 z-40 bg-dark-bg/95 backdrop-blur border-b border-dark-border">
                <div className="px-4 h-14 flex items-center gap-3">
                    <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-dark-card transition-colors">
                        <ArrowLeft size={20} className="text-gray-400" />
                    </button>
                    <h1 className="text-base font-bold text-white flex-1">Semua Anime</h1>
                    <button
                        onClick={() => setSortLatest(prev => !prev)}
                        className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border transition-colors ${sortLatest ? 'bg-primary-400/10 border-primary-400/30 text-primary-400' : 'bg-dark-card border-dark-border text-gray-400'}`}
                    >
                        <ArrowUpDown size={13} />
                        {sortLatest ? 'Terbaru' : 'Terlama'}
                    </button>
                </div>
                <div className="px-4 pb-3">
                    <div className="relative">
                        <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-600" />
                        <input
                            type="text"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            placeholder="Cari anime..."
                            className="w-full bg-dark-card border border-dark-border text-white text-sm rounded-xl pl-9 pr-4 py-2.5 outline-none focus:border-primary-400/60 transition-colors placeholder:text-gray-700"
                        />
                    </div>
                </div>
            </header>

            <div className="px-4 pt-3 pb-4">
                {loading ? (
                    <div className="grid grid-cols-3 gap-3">
                        {[...Array(12)].map((_, i) => (
                            <div key={i} className="space-y-2">
                                <div className="aspect-[3/4] rounded-xl bg-dark-card animate-pulse" />
                                <div className="h-3 w-3/4 bg-dark-card rounded animate-pulse" />
                            </div>
                        ))}
                    </div>
                ) : (
                    <>
                        <p className="text-xs text-gray-600 mb-3">{filtered.length} anime</p>
                        <div className="grid grid-cols-3 gap-3">
                            {filtered.map((item, i) => (
                                <div key={i} onClick={() => handleClick(item)} className="group cursor-pointer">
                                    <div className="relative aspect-[3/4] rounded-xl overflow-hidden mb-2 bg-dark-card">
                                        <img
                                            src={item.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(item.title?.slice(0,10))}&background=1a1a1a&color=ffaf2f&size=400`}
                                            alt={item.title}
                                            className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110"
                                            loading="lazy"
                                            onError={e => { e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(item.title?.slice(0,10))}&background=1a1a1a&color=ffaf2f&size=400`; }}
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                                        {item.status && (
                                            <div className="absolute top-1.5 left-1.5">
                                                <span className={`px-1.5 py-0.5 text-[8px] font-bold rounded-md ${item.status === 'Ongoing' ? 'bg-emerald-500/90 text-white' : 'bg-gray-500/90 text-white'}`}>{item.status}</span>
                                            </div>
                                        )}
                                        {(item.episode || item.info) && (
                                            <div className="absolute bottom-1.5 left-1.5 z-10">
                                                <span className="px-1.5 py-0.5 bg-primary-400/90 text-black text-[8px] font-bold rounded-md">EP {item.episode || item.info?.replace('Ep ','')}</span>
                                            </div>
                                        )}
                                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 z-20">
                                            <div className="w-9 h-9 bg-primary-400 rounded-full flex items-center justify-center">
                                                <Play size={16} className="text-black ml-0.5" fill="currentColor" />
                                            </div>
                                        </div>
                                    </div>
                                    <h3 className="text-[11px] font-medium text-gray-200 line-clamp-2 group-hover:text-primary-300 transition-colors leading-snug">{item.title}</h3>
                                </div>
                            ))}
                        </div>

                        {hasMore && !search && (
                            <button
                                onClick={loadMore}
                                disabled={loadingMore}
                                className="w-full mt-6 py-3 rounded-xl bg-dark-surface border border-dark-border text-sm text-gray-400 hover:text-white hover:border-primary-400/50 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {loadingMore ? <><Loader2 size={16} className="animate-spin" />Loading...</> : 'Muat Lebih Banyak'}
                            </button>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default AllAnimePage;
    
