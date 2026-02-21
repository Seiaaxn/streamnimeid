// src/components/home/PopularTodaySection.jsx
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Play, ChevronRight, TrendingUp, ChevronLeft, Flame } from 'lucide-react';
import axios from 'axios';

const PopularTodaySection = () => {
    const navigate = useNavigate();
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [scrollPosition, setScrollPosition] = useState(0);
    const [showLeftArrow, setShowLeftArrow] = useState(false);
    const [showRightArrow, setShowRightArrow] = useState(true);

    useEffect(() => {
        fetchPopularToday();
    }, []);

    const fetchPopularToday = async () => {
        try {
            setLoading(true);
            const response = await axios.get('https://anime-api-iota-beryl.vercel.app/api/donghua/popular-today');

            if (response.data.success) {
                setItems(response.data.data);
            } else {
                setError('Failed to load popular today');
            }
        } catch (err) {
            console.error('Error fetching popular today:', err);
            setError('Failed to load popular today');
        } finally {
            setLoading(false);
        }
    };

    const handleScroll = (direction) => {
        const container = document.getElementById('popular-horizontal-scroll');
        if (container) {
            const scrollAmount = 400;
            const newPosition = direction === 'left'
                ? scrollPosition - scrollAmount
                : scrollPosition + scrollAmount;

            container.scrollTo({
                left: newPosition,
                behavior: 'smooth'
            });

            setScrollPosition(newPosition);
        }
    };

    const handleScrollCheck = () => {
        const container = document.getElementById('popular-horizontal-scroll');
        if (container) {
            setShowLeftArrow(container.scrollLeft > 0);
            setShowRightArrow(
                container.scrollLeft < container.scrollWidth - container.clientWidth - 10
            );
        }
    };

    const handleItemClick = (item) => {
        const category = 'donghua';

        let itemUrl = item.url;

        if (!itemUrl) {
            console.error('No URL found for item:', item);
            return;
        }

        // Bersihkan URL dengan menghapus bagian episode
        // Contoh: https://anichin.moe/swallowed-star-episode-211-subtitle-indonesia/
        // Menjadi: https://anichin.moe/swallowed-star

        // Hapus trailing slash dulu
        itemUrl = itemUrl.replace(/\/+$/, '');

        // Split URL menjadi parts
        const urlParts = itemUrl.split('/');

        // Ambil slug terakhir
        let lastSlug = urlParts[urlParts.length - 1];

        // Hapus pattern "-episode-XXX-subtitle-indonesia" atau "-episode-XXX"
        // Pattern: -episode-{angka}-subtitle-indonesia atau -episode-{angka}
        const cleanSlug = lastSlug.replace(/-episode-\d+(-subtitle-indonesia)?/g, '');

        // Ganti slug terakhir dengan yang sudah dibersihkan
        urlParts[urlParts.length - 1] = cleanSlug;

        // Gabungkan kembali
        itemUrl = urlParts.join('/');

        console.log('Original URL:', item.url);
        console.log('Cleaned URL:', itemUrl);

        const encodedUrl = encodeURIComponent(itemUrl);
        navigate(`/detail/${category}/${encodedUrl}`);
    };

    if (loading) {
        return (
            <section className="px-4 mt-6 pb-2">
                {/* Header skeleton */}
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-dark-card rounded-full animate-pulse" />
                        <div className="h-6 w-32 bg-dark-card rounded animate-pulse" />
                        <div className="w-16 h-5 bg-dark-card rounded-full animate-pulse" />
                    </div>
                    <div className="w-20 h-5 bg-dark-card rounded animate-pulse" />
                </div>

                {/* Horizontal scroll skeleton */}
                <div className="flex gap-3 overflow-x-hidden">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="flex-none w-40 space-y-2">
                            <div className="aspect-[3/4] rounded-xl bg-dark-card animate-pulse" />
                            <div className="h-4 w-3/4 bg-dark-card rounded animate-pulse" />
                            <div className="h-3 w-1/2 bg-dark-card rounded animate-pulse" />
                        </div>
                    ))}
                </div>
            </section>
        );
    }

    if (error || !items.length) {
        return null;
    }

    return (
        <section className="px-4 mt-1 pb-5">
            {/* Header dengan icon dan title */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    {/* <div className="p-1.5 bg-orange-500/20 rounded-lg">
                        <Flame size={18} className="text-orange-400" />
                    </div> */}
                    <h2 className="text-base font-medium text-white">Popular Today</h2>
                    {/* <span className="text-xs bg-orange-500/20 text-orange-400 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <TrendingUp size={10} />
                        {items.length} Items
                    </span> */}
                </div>

                <Link
                    to="/explore?type=popular"
                    className="flex items-center gap-1 text-xs text-orange-400 hover:text-orange-300 transition-colors"
                >
                    <span>See All</span>
                    <ChevronRight size={14} />
                </Link>
            </div>

            {/* Horizontal Scroll Container dengan Navigation Arrows */}
            <div className="relative group">
                {/* Left Navigation Arrow */}
                {showLeftArrow && (
                    <button
                        onClick={() => handleScroll('left')}
                        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-black/80 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-orange-400 transition-all opacity-0 group-hover:opacity-100 -ml-3"
                        aria-label="Scroll left"
                    >
                        <ChevronLeft size={18} />
                    </button>
                )}

                {/* Right Navigation Arrow */}
                {showRightArrow && (
                    <button
                        onClick={() => handleScroll('right')}
                        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-black/80 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-orange-400 transition-all opacity-0 group-hover:opacity-100 -mr-3"
                        aria-label="Scroll right"
                    >
                        <ChevronRight size={18} />
                    </button>
                )}

                {/* Horizontal Scroll Container */}
                <div
                    id="popular-horizontal-scroll"
                    className="flex gap-3 overflow-x-auto hide-scrollbar pb-2 scroll-smooth"
                    onScroll={handleScrollCheck}
                >
                    {items.map((item, index) => {
                        // Extract episode number dari string "Ep 149"
                        const episodeNumber = item.episode?.replace('Ep ', '') || '?';

                        return (
                            <div
                                key={index}
                                onClick={() => handleItemClick(item)}
                                className="flex-none w-40 cursor-pointer group/card"
                            >
                                {/* Poster Container */}
                                <div className="relative aspect-[3/4] rounded-xl overflow-hidden mb-2 bg-dark-card">
                                    <img
                                        src={item.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(item.title?.slice(0, 10))}&background=333&color=fff&size=400`}
                                        alt={item.title}
                                        className="w-full h-full object-cover transition-all duration-500 group-hover/card:scale-110"
                                        loading="lazy"
                                        onError={(e) => {
                                            e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(item.title?.slice(0, 10))}&background=333&color=fff&size=400`;
                                        }}
                                    />

                                    {/* Overlay gradient */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover/card:opacity-100 transition-all duration-300" />

                                    {/* Popular Badge dengan nomor peringkat */}
                                    <div className="absolute top-2 left-2">
                                        <span className="px-2 py-1 bg-orange-500 text-white text-[10px] font-bold rounded flex items-center gap-1">
                                            <Flame size={10} />
                                            #{index + 1}
                                        </span>
                                    </div>

                                    {/* Type Badge */}
                                    <div className="absolute top-2 right-2">
                                        <span className="px-2 py-1 bg-red-500/80 text-white text-[10px] font-bold rounded">
                                            {item.type || 'Donghua'}
                                        </span>
                                    </div>

                                    {/* Episode Badge */}
                                    <div className="absolute bottom-2 left-2 z-10">
                                        <span className="px-2 py-1 bg-black/80 backdrop-blur text-orange-400 text-[10px] font-bold rounded border border-orange-500/30">
                                            {item.episode}
                                        </span>
                                    </div>

                                    {/* Play Button on Hover */}
                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/card:opacity-100 transition-all duration-300 z-20">
                                        <button className="w-10 h-10 bg-orange-400 rounded-full flex items-center justify-center transform scale-90 group-hover/card:scale-100 transition-transform duration-300">
                                            <Play size={18} className="text-black ml-0.5" fill="currentColor" />
                                        </button>
                                    </div>
                                </div>

                                {/* Title */}
                                <h3 className="text-sm font-medium text-white line-clamp-2 group-hover/card:text-orange-300 transition-colors">
                                    {item.title}
                                </h3>

                                {/* Additional Info */}
                                <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                                    <span className="flex items-center gap-1">
                                        <span className="text-orange-400">▶</span>
                                        Episode {episodeNumber}
                                    </span>
                                    {item.source && (
                                        <span className="truncate bg-dark-surface px-1.5 py-0.5 rounded text-[9px]">
                                            {item.source}
                                        </span>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default PopularTodaySection;