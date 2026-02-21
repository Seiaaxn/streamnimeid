// src/components/home/ContentGrid.jsx
import { Link, useNavigate } from 'react-router-dom';
import { Play, ChevronRight, Film, Tv, Globe } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const categories = [
    { id: 'all-anime', label: 'All Anime', icon: Tv },
    { id: 'all-donghua', label: 'All Donghua', icon: Film },
];

const CardSkeleton = () => (
    <div className="space-y-2">
        <div className="aspect-[3/4] rounded-xl bg-dark-card animate-pulse" />
        <div className="h-3.5 w-4/5 bg-dark-card rounded animate-pulse" />
        <div className="h-3 w-1/2 bg-dark-card rounded animate-pulse" />
    </div>
);

const AnimeCard = ({ item, onClick }) => {
    const episode = item.episode || item.info?.replace?.('Ep ', '') || item.latest_episode || null;
    const score = item.score;
    const type = item.type || item.info?.type || 'Anime';
    const status = item.status;

    return (
        <div onClick={() => onClick(item)} className="group cursor-pointer">
            <div className="relative aspect-[3/4] rounded-xl overflow-hidden mb-2 bg-dark-card">
                <img
                    src={item.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(item.title?.slice(0, 10))}&background=1a1a1a&color=ffaf2f&size=400`}
                    alt={item.title}
                    className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110"
                    loading="lazy"
                    onError={(e) => { e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(item.title?.slice(0, 10))}&background=1a1a1a&color=ffaf2f&size=400`; }}
                />
                {/* Dark gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300" />

                {/* Status badge top-left */}
                {status && (
                    <div className="absolute top-2 left-2">
                        <span className={`px-1.5 py-0.5 text-[9px] font-bold rounded-md ${
                            status === 'Ongoing' ? 'bg-emerald-500/90 text-white' :
                            status === 'Completed' ? 'bg-gray-500/90 text-white' :
                            'bg-yellow-500/90 text-white'
                        }`}>{status}</span>
                    </div>
                )}

                {/* Score top-right */}
                {score && (
                    <div className="absolute top-2 right-2">
                        <span className="px-1.5 py-0.5 bg-black/70 text-yellow-400 text-[9px] font-bold rounded-md flex items-center gap-0.5">
                            ★ {score}
                        </span>
                    </div>
                )}

                {/* Episode bottom */}
                {episode && (
                    <div className="absolute bottom-2 left-2 z-10">
                        <span className="px-1.5 py-0.5 bg-primary-400/90 text-black text-[9px] font-bold rounded-md">
                            EP {episode}
                        </span>
                    </div>
                )}

                {/* Play button hover */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 z-20">
                    <div className="w-11 h-11 bg-primary-400 rounded-full flex items-center justify-center shadow-lg shadow-primary-400/30 transform scale-90 group-hover:scale-100 transition-transform duration-300">
                        <Play size={20} className="text-black ml-0.5" fill="currentColor" />
                    </div>
                </div>
            </div>
            <h3 className="text-xs font-medium text-gray-200 line-clamp-2 group-hover:text-primary-300 transition-colors leading-snug">
                {item.title}
            </h3>
        </div>
    );
};

const DonghuaCard = ({ item, onClick }) => {
    const episode = item.episode || null;
    const score = item.score;

    return (
        <div onClick={() => onClick(item)} className="group cursor-pointer">
            <div className="relative aspect-[3/4] rounded-xl overflow-hidden mb-2 bg-dark-card">
                <img
                    src={item.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(item.title?.slice(0, 10))}&background=1a1a1a&color=ef4444&size=400`}
                    alt={item.title}
                    className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110"
                    loading="lazy"
                    onError={(e) => { e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(item.title?.slice(0, 10))}&background=1a1a1a&color=ef4444&size=400`; }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300" />

                {/* Score */}
                {score && (
                    <div className="absolute top-2 right-2">
                        <span className="px-1.5 py-0.5 bg-black/70 text-yellow-400 text-[9px] font-bold rounded-md flex items-center gap-0.5">
                            ★ {score}
                        </span>
                    </div>
                )}

                {/* Episode */}
                {episode && (
                    <div className="absolute bottom-2 left-2 z-10">
                        <span className="px-1.5 py-0.5 bg-red-500/90 text-white text-[9px] font-bold rounded-md">
                            EP {episode}
                        </span>
                    </div>
                )}

                {/* Play button */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 z-20">
                    <div className="w-11 h-11 bg-red-500 rounded-full flex items-center justify-center shadow-lg shadow-red-500/30 transform scale-90 group-hover:scale-100 transition-transform duration-300">
                        <Play size={20} className="text-white ml-0.5" fill="currentColor" />
                    </div>
                </div>
            </div>
            <h3 className="text-xs font-medium text-gray-200 line-clamp-2 group-hover:text-red-300 transition-colors leading-snug">
                {item.title}
            </h3>
        </div>
    );
};

const ContentGrid = ({
    onItemClick,
    limit = 12
}) => {
    const navigate = useNavigate();
    const [activeCategory, setActiveCategory] = useState('all-anime');
    const [allAnimeItems, setAllAnimeItems] = useState([]);
    const [allDonghuaItems, setAllDonghuaItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const fetchedRef = useRef(false);

    useEffect(() => {
        if (!fetchedRef.current) {
            fetchedRef.current = true;
            fetchAllItems();
        }
    }, []);

    const fetchAllItems = async () => {
        try {
            setLoading(true);
            const response = await axios.get('https://anime-api-iota-beryl.vercel.app/api/latest/shuffle');
            if (response.data.success) {
                const data = response.data.data;
                
                const anime = data
                    .filter(item => item.source === 'samehadaku')
                    .map(item => item);
                
                const donghua = data
                    .filter(item => item.source === 'anichin')
                    .map(item => {
                        if (item.url) {
                            let cleanUrl = item.url.replace(/\/+$/, '');
                            const urlParts = cleanUrl.split('/');
                            let lastSlug = urlParts[urlParts.length - 1];
                            const cleanSlug = lastSlug.replace(/-episode-\d+(-subtitle-indonesia)?/g, '');
                            urlParts[urlParts.length - 1] = cleanSlug;
                            cleanUrl = urlParts.join('/');
                            return { ...item, originalUrl: item.url, url: cleanUrl };
                        }
                        return item;
                    });

                setAllAnimeItems(anime);
                setAllDonghuaItems(donghua);
            }
        } catch (err) {
            console.error('Error fetching all items:', err);
        } finally {
            setLoading(false);
        }
    };

    const displayItems = activeCategory === 'all-anime'
        ? allAnimeItems.slice(0, limit)
        : allDonghuaItems.slice(0, limit);

    const isAnimeTab = activeCategory === 'all-anime';

    return (
        <section className="px-4 mt-6 pb-6">
            {/* Section Header */}
            <div className="flex items-center justify-between mb-4">
                {/* Tabs */}
                <div className="flex items-center gap-1 bg-dark-card rounded-xl p-1">
                    {categories.map((cat) => {
                        const isActive = activeCategory === cat.id;
                        const Icon = cat.icon;
                        return (
                            <button
                                key={cat.id}
                                onClick={() => setActiveCategory(cat.id)}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                                    isActive
                                        ? cat.id === 'all-anime'
                                            ? 'bg-primary-400 text-black shadow-sm'
                                            : 'bg-red-500 text-white shadow-sm'
                                        : 'text-gray-500 hover:text-gray-300'
                                }`}
                            >
                                <Icon size={13} />
                                <span>{cat.label}</span>
                            </button>
                        );
                    })}
                </div>

                <button
                    onClick={() => navigate('/explore')}
                    className="text-xs text-gray-500 hover:text-gray-300 flex items-center gap-0.5 transition-colors"
                >
                    <span>See All</span>
                    <ChevronRight size={13} />
                </button>
            </div>

            {/* Grid */}
            {loading ? (
                <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                    {[...Array(12)].map((_, i) => <CardSkeleton key={i} />)}
                </div>
            ) : displayItems.length === 0 ? (
                <div className="text-center py-12 text-gray-600 text-sm">
                    No content available
                </div>
            ) : (
                <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                    {displayItems.map((item, index) =>
                        isAnimeTab
                            ? <AnimeCard key={index} item={item} onClick={onItemClick} />
                            : <DonghuaCard key={index} item={item} onClick={onItemClick} />
                    )}
                </div>
            )}
        </section>
    );
};

export default ContentGrid;
