// src/components/home/LatestAnimeSection.jsx
import { useNavigate } from 'react-router-dom';
import { Play, ChevronRight, Tv, Star } from 'lucide-react';

const CardSkeleton = () => (
    <div className="flex-none w-32 space-y-2">
        <div className="aspect-[3/4] rounded-xl bg-dark-card animate-pulse" />
        <div className="h-3 w-4/5 bg-dark-card rounded animate-pulse" />
        <div className="h-2.5 w-1/2 bg-dark-card rounded animate-pulse" />
    </div>
);

const LatestAnimeSection = ({ items = [], loading = false, onItemClick }) => {
    const navigate = useNavigate();

    if (loading) {
        return (
            <section className="px-4 mt-6 pb-2">
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                        <div className="w-5 h-5 bg-dark-card rounded animate-pulse" />
                        <div className="h-5 w-28 bg-dark-card rounded animate-pulse" />
                    </div>
                    <div className="w-14 h-4 bg-dark-card rounded animate-pulse" />
                </div>
                <div className="flex gap-3 overflow-x-hidden">
                    {[...Array(5)].map((_, i) => <CardSkeleton key={i} />)}
                </div>
            </section>
        );
    }

    if (!items.length) return null;

    return (
        <section className="px-4 mt-6 pb-2">
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                    <div className="p-1 bg-primary-400/15 rounded-lg">
                        <Tv size={14} className="text-primary-400" />
                    </div>
                    <h2 className="text-sm font-semibold text-white tracking-wide">Latest Anime</h2>
                </div>
                <button
                    onClick={() => navigate('/explore/all-anime')}
                    className="flex items-center gap-0.5 text-[11px] text-primary-400 hover:text-primary-300 transition-colors"
                >
                    <span>See All</span>
                    <ChevronRight size={13} />
                </button>
            </div>

            <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-1">
                {items.map((item, index) => (
                    <div
                        key={index}
                        onClick={() => onItemClick(item)}
                        className="flex-none w-32 cursor-pointer group"
                    >
                        <div className="relative aspect-[3/4] rounded-xl overflow-hidden mb-2 bg-dark-card">
                            <img
                                src={item.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(item.title?.slice(0, 10))}&background=1a1a1a&color=ffaf2f&size=400`}
                                alt={item.title}
                                className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110"
                                loading="lazy"
                                onError={(e) => { e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(item.title?.slice(0, 10))}&background=1a1a1a&color=ffaf2f&size=400`; }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-300" />

                            {/* Episode */}
                            {(item.episode || item.info) && (
                                <div className="absolute bottom-1.5 left-1.5 z-10">
                                    <span className="px-1.5 py-0.5 bg-primary-400/90 text-black text-[8px] font-bold rounded-md">
                                        EP {item.episode || item.info?.replace('Ep ', '')}
                                    </span>
                                </div>
                            )}

                            {/* Status */}
                            {item.status && (
                                <div className="absolute top-1.5 left-1.5">
                                    <span className={`px-1.5 py-0.5 text-[8px] font-bold rounded-md ${item.status === 'Ongoing' ? 'bg-emerald-500/90 text-white' : 'bg-gray-500/90 text-white'}`}>
                                        {item.status}
                                    </span>
                                </div>
                            )}

                            {/* Play */}
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 z-20">
                                <div className="w-9 h-9 bg-primary-400 rounded-full flex items-center justify-center shadow-lg transform scale-90 group-hover:scale-100 transition-transform duration-300">
                                    <Play size={16} className="text-black ml-0.5" fill="currentColor" />
                                </div>
                            </div>
                        </div>
                        <h3 className="text-[11px] font-medium text-gray-200 line-clamp-2 group-hover:text-primary-300 transition-colors leading-snug">
                            {item.title}
                        </h3>
                        {item.score && (
                            <div className="flex items-center gap-1 mt-0.5">
                                <Star size={9} className="text-yellow-400 fill-yellow-400" />
                                <span className="text-[10px] text-gray-500">{item.score}</span>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </section>
    );
};

export default LatestAnimeSection;
                                
