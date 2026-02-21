// src/pages/explorer/AllDonghuaPage.jsx
import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Search, ArrowLeft, ArrowUpDown } from 'lucide-react';
import axios from 'axios';

const cleanDonghuaUrl = (url) => {
    if (!url) return url;
    let clean = url.replace(/\/+$/, '');
    const parts = clean.split('/');
    parts[parts.length-1] = parts[parts.length-1].replace(/-episode-\d+(-subtitle-indonesia)?/g, '');
    return parts.join('/');
};

const AllDonghuaPage = () => {
    const navigate = useNavigate();
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [sortLatest, setSortLatest] = useState(true);

    useEffect(() => {
        fetchDonghua();
    }, []);

    const fetchDonghua = async () => {
        try {
            setLoading(true);
            const res = await axios.get('https://anime-api-iota-beryl.vercel.app/api/latest/shuffle');
            if (res.data.success) {
                const donghua = res.data.data
                    .filter(i => i.source === 'anichin')
                    .map(i => ({ ...i, url: cleanDonghuaUrl(i.url), originalUrl: i.url }));
                setItems(donghua);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const handleClick = (item) => {
        let url = item.url;
        if (!url) return;
        url = url.replace(/\/+$/, '');
        navigate(`/detail/donghua/${encodeURIComponent(url)}`);
    };

    const filtered = useMemo(() => {
        let result = items.filter(i => i.title?.toLowerCase().includes(search.toLowerCase()));
        return sortLatest ? result : [...result].reverse();
    }, [items, search, sortLatest]);

    return (
        <div className="min-h-screen bg-dark-bg pb-20">
            <header className="sticky top-0 z-40 bg-dark-bg/95 backdrop-blur border-b border-dark-border">
                <div className="px-4 h-14 flex items-center gap-3">
                    <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-dark-card transition-colors">
                        <ArrowLeft size={20} className="text-gray-400" />
                    </button>
                    <h1 className="text-base font-bold text-white flex-1">Semua Donghua</h1>
                    <button
                        onClick={() => setSortLatest(prev => !prev)}
                        className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border transition-colors ${sortLatest ? 'bg-red-500/10 border-red-500/30 text-red-400' : 'bg-dark-card border-dark-border text-gray-400'}`}
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
                            placeholder="Cari donghua..."
                            className="w-full bg-dark-card border border-dark-border text-white text-sm rounded-xl pl-9 pr-4 py-2.5 outline-none focus:border-red-500/60 transition-colors placeholder:text-gray-700"
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
                        <p className="text-xs text-gray-600 mb-3">{filtered.length} donghua</p>
                        <div className="grid grid-cols-3 gap-3">
                            {filtered.map((item, i) => (
                                <div key={i} onClick={() => handleClick(item)} className="group cursor-pointer">
                                    <div className="relative aspect-[3/4] rounded-xl overflow-hidden mb-2 bg-dark-card">
                                        <img
                                            src={item.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(item.title?.slice(0,10))}&background=1a1a1a&color=ef4444&size=400`}
                                            alt={item.title}
                                            className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110"
                                            loading="lazy"
                                            onError={e => { e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(item.title?.slice(0,10))}&background=1a1a1a&color=ef4444&size=400`; }}
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                                        <div className="absolute top-1.5 right-1.5">
                                            <span className="px-1.5 py-0.5 bg-black/60 text-red-400 text-[8px] font-bold rounded-md border border-red-500/30">CN</span>
                                        </div>
                                        {item.episode && (
                                            <div className="absolute bottom-1.5 left-1.5 z-10">
                                                <span className="px-1.5 py-0.5 bg-red-500/90 text-white text-[8px] font-bold rounded-md">EP {item.episode}</span>
                                            </div>
                                        )}
                                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 z-20">
                                            <div className="w-9 h-9 bg-red-500 rounded-full flex items-center justify-center">
                                                <Play size={16} className="text-white ml-0.5" fill="currentColor" />
                                            </div>
                                        </div>
                                    </div>
                                    <h3 className="text-[11px] font-medium text-gray-200 line-clamp-2 group-hover:text-red-300 transition-colors leading-snug">{item.title}</h3>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default AllDonghuaPage;
                            
