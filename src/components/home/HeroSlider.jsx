// src/components/home/HeroSlider.jsx
import { useRef, useState, useEffect } from 'react';
import { Play, Info } from 'lucide-react';

const HeroSlider = ({ items = [], onAnimeSelect, autoPlayInterval = 4000, loading = false }) => {
    const sliderRef = useRef(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isHovered, setIsHovered] = useState(false);

    const handleScroll = () => {
        const slider = sliderRef.current;
        if (!slider) return;
        const index = Math.round(slider.scrollLeft / slider.clientWidth);
        setCurrentIndex(index);
    };

    const scrollToIndex = (index) => {
        const slider = sliderRef.current;
        if (!slider) return;
        slider.scrollTo({ left: index * slider.clientWidth, behavior: 'smooth' });
    };

    useEffect(() => {
        if (!items.length || isHovered || loading) return;
        const interval = setInterval(() => {
            const nextIndex = (currentIndex + 1) % items.length;
            scrollToIndex(nextIndex);
        }, autoPlayInterval);
        return () => clearInterval(interval);
    }, [currentIndex, items.length, isHovered, autoPlayInterval, loading]);

    if (loading) {
        return (
            <section className="relative w-full overflow-hidden">
                <div className="w-full h-[50vh] bg-dark-surface animate-pulse relative">
                    <div className="absolute inset-0 bg-gradient-to-t from-dark-bg via-dark-bg/60 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-5 pb-8 space-y-3">
                        <div className="w-16 h-5 bg-dark-card rounded-full" />
                        <div className="w-3/4 h-7 bg-dark-card rounded-lg" />
                        <div className="w-1/2 h-4 bg-dark-card rounded" />
                        <div className="w-28 h-9 bg-dark-card rounded-full mt-2" />
                    </div>
                </div>
            </section>
        );
    }

    if (!items.length) return null;

    return (
        <section
            className="relative w-full overflow-hidden"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div
                ref={sliderRef}
                onScroll={handleScroll}
                className="flex overflow-x-auto snap-x snap-mandatory scroll-smooth hide-scrollbar"
            >
                {items.map((item, index) => {
                    const isAnime = item.source === 'samehadaku' || item.type === 'Anime';
                    return (
                        <div
                            key={index}
                            className="snap-center shrink-0 w-screen h-[50vh] relative cursor-pointer"
                            onClick={() => onAnimeSelect(item)}
                        >
                            {/* Background image */}
                            <img
                                src={item.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(item.title)}&background=1a1a1a&color=fff&size=600`}
                                alt={item.title}
                                className="w-full h-full object-cover"
                                loading="lazy"
                                onError={(e) => { e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(item.title)}&background=1a1a1a&color=fff&size=600`; }}
                            />

                            {/* Gradients */}
                            <div className="absolute inset-0 bg-gradient-to-t from-dark-bg via-dark-bg/50 to-transparent" />
                            <div className="absolute inset-0 bg-gradient-to-r from-dark-bg/70 via-transparent to-transparent" />

                            {/* Content */}
                            <div className="absolute bottom-0 left-0 right-0 p-5 pb-7">
                                {/* Type badge */}
                                <div className="flex items-center gap-2 mb-2.5">
                                    <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                                        isAnime
                                            ? 'bg-primary-400/20 text-primary-400 border border-primary-400/30'
                                            : 'bg-red-500/20 text-red-400 border border-red-500/30'
                                    }`}>
                                        {isAnime ? 'ANIME' : 'DONGHUA'}
                                    </span>
                                    {item.episode && (
                                        <span className="text-gray-400 text-[10px]">
                                            EP {item.episode}
                                        </span>
                                    )}
                                </div>

                                {/* Title */}
                                <h1 className="text-lg font-bold text-white mb-1 line-clamp-1 leading-tight">
                                    {item.title}
                                </h1>

                                {/* Genre / Score */}
                                <div className="flex items-center gap-3 mb-4 text-xs text-gray-400">
                                    {item.score && (
                                        <span className="flex items-center gap-1">
                                            <span className="text-yellow-400">★</span>
                                            {item.score}
                                        </span>
                                    )}
                                    {item.status && <span>{item.status}</span>}
                                    {item.genres?.slice(0,2).map((g, i) => (
                                        <span key={i} className="truncate">{g}</span>
                                    ))}
                                </div>

                                {/* CTA */}
                                <button
                                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all active:scale-95 ${
                                        isAnime
                                            ? 'bg-primary-400 text-black'
                                            : 'bg-red-500 text-white'
                                    }`}
                                >
                                    <Play size={14} fill="currentColor" />
                                    <span>Watch Now</span>
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Dots indicator */}
            {items.length > 1 && (
                <div className="absolute bottom-3 right-4 flex items-center gap-1.5">
                    {items.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => scrollToIndex(index)}
                            className={`rounded-full transition-all duration-300 ${
                                index === currentIndex
                                    ? 'w-4 h-1.5 bg-primary-400'
                                    : 'w-1.5 h-1.5 bg-white/30 hover:bg-white/60'
                            }`}
                        />
                    ))}
                </div>
            )}
        </section>
    );
};

export default HeroSlider;
