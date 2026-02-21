// src/pages/explorer/AllAnimePage.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Search } from 'lucide-react';
import axios from 'axios';

const AllAnimePage = () => {
    const navigate = useNavigate();
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    useEffect(() => {
        fetchAnime();
    }, []);

    const fetchAnime = async () => {
        try {
            setLoading(true);
            const res = await axios.get('https://anime-api-iota-beryl.vercel.app/api/latest/shuffle');
            if (res.data.success) {
                const anime = res.data.data.filter(i => i.source === 'samehadaku');
                setItems(anime);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const handleClick = (item) => {
        let url = item.url || item.link;
        if (!url) return;
        url = url.replace(/\/+$/, '');
        navigate(`/detail/anime/${encodeURIComponent(url)}`);
    };

    const filtered = items.filter(i => i.title?.toLowerCase().includes(search.toLowerCase()));

    return (
        <div className="px-4 pt-4 pb-4">
            {/* Search bar */}
            <div className="relative mb-4">
                <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-600" />
                <input
                    type="text"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="Cari anime..."
                    className="w-full bg-dark-card border border-dark-border text-white text-sm rounded-xl pl-9 pr-4 py-2.5 outline-none focus:border-primary-400/60 transition-colors placeholder:text-gray-700"
                />
            </div>

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
                    <p className="text-xs text-gray-600 mb-3">{filtered.length} anime ditemukan</p>
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
                </>
            )}
        </div>
    );
};

export default AllAnimePage;
          
