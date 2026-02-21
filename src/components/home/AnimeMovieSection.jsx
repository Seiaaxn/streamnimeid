// src/components/home/AnimeMovieSection.jsx
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Play, ChevronRight, Film, Star } from 'lucide-react';
import axios from 'axios';

const AnimeMovieSection = () => {
    const navigate = useNavigate();
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            try {
                setLoading(true);
                const response = await axios.get('https://anime-api-iota-beryl.vercel.app/api/anime-movie');
                if (response.data.success) setMovies(response.data.data);
            } catch (err) {
                console.error('Error fetching anime movies:', err);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    const handleMovieClick = (movie) => {
        let itemUrl = movie.url;
        if (!itemUrl) return;
        itemUrl = itemUrl.replace(/\/+$/, '');
        navigate(`/detail/anime/${encodeURIComponent(itemUrl)}`);
    };

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
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="flex-none w-32 space-y-2">
                            <div className="aspect-[3/4] rounded-xl bg-dark-card animate-pulse" />
                            <div className="h-3 w-4/5 bg-dark-card rounded animate-pulse" />
                        </div>
                    ))}
                </div>
            </section>
        );
    }

    if (!movies.length) return null;

    return (
        <section className="px-4 mt-6 pb-2">
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                    <div className="p-1 bg-purple-500/15 rounded-lg">
                        <Film size={14} className="text-purple-400" />
                    </div>
                    <h2 className="text-sm font-semibold text-white tracking-wide">Anime Movies</h2>
                </div>
                <Link
                    to="/explore?type=movie"
                    className="flex items-center gap-0.5 text-[11px] text-purple-400 hover:text-purple-300 transition-colors"
                >
                    <span>See All</span>
                    <ChevronRight size={13} />
                </Link>
            </div>

            <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-1">
                {movies.map((movie, index) => (
                    <div
                        key={index}
                        onClick={() => handleMovieClick(movie)}
                        className="flex-none w-32 cursor-pointer group"
                    >
                        <div className="relative aspect-[3/4] rounded-xl overflow-hidden mb-2 bg-dark-card">
                            <img
                                src={movie.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(movie.title?.slice(0, 10))}&background=1a1a1a&color=a855f7&size=400`}
                                alt={movie.title}
                                className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110"
                                loading="lazy"
                                onError={(e) => { e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(movie.title?.slice(0, 10))}&background=1a1a1a&color=a855f7&size=400`; }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-300" />

                            {/* Movie badge */}
                            <div className="absolute top-1.5 left-1.5">
                                <span className="px-1.5 py-0.5 bg-purple-600/90 text-white text-[8px] font-bold rounded-md">
                                    Movie
                                </span>
                            </div>

                            {/* Score */}
                            {movie.score && movie.score !== 'N/A' && (
                                <div className="absolute bottom-1.5 left-1.5 z-10">
                                    <span className="px-1.5 py-0.5 bg-black/70 text-yellow-400 text-[8px] font-bold rounded-md flex items-center gap-0.5">
                                        <Star size={8} className="fill-yellow-400" />
                                        {movie.score}
                                    </span>
                                </div>
                            )}

                            {/* Play */}
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 z-20">
                                <div className="w-9 h-9 bg-purple-500 rounded-full flex items-center justify-center shadow-lg transform scale-90 group-hover:scale-100 transition-transform duration-300">
                                    <Play size={16} className="text-white ml-0.5" fill="currentColor" />
                                </div>
                            </div>
                        </div>
                        <h3 className="text-[11px] font-medium text-gray-200 line-clamp-2 group-hover:text-purple-300 transition-colors leading-snug">
                            {movie.title}
                        </h3>
                        {movie.genres?.length > 0 && (
                            <span className="text-[10px] text-gray-600 truncate block mt-0.5">{movie.genres[0]}</span>
                        )}
                    </div>
                ))}
            </div>
        </section>
    );
};

export default AnimeMovieSection;
