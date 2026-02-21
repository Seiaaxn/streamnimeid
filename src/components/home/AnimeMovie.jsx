// src/components/home/AnimeMovieSection.jsx
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Play, ChevronRight, Film, Star } from 'lucide-react';
import axios from 'axios';

const AnimeMovieSection = () => {
    const navigate = useNavigate();
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchAnimeMovies();
    }, []);

    const fetchAnimeMovies = async () => {
        try {
            setLoading(true);
            const response = await axios.get('https://anime-api-iota-beryl.vercel.app/api/anime-movie');

            if (response.data.success) {
                setMovies(response.data.data);
            } else {
                setError('Failed to load anime movies');
            }
        } catch (err) {
            console.error('Error fetching anime movies:', err);
            setError('Failed to load anime movies');
        } finally {
            setLoading(false);
        }
    };

    const handleMovieClick = (movie) => {
        // Semua movie dari endpoint ini adalah dari source samehadaku
        const category = 'anime';

        let itemUrl = movie.url;

        if (!itemUrl) {
            console.error('No URL found for movie:', movie);
            return;
        }

        itemUrl = itemUrl.replace(/\/+$/, '');

        console.log('Navigating to detail with URL:', itemUrl);
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
                    </div>
                    <div className="w-20 h-5 bg-dark-card rounded animate-pulse" />
                </div>

                {/* Grid skeleton 3 kolom */}
                <div className="grid grid-cols-3 gap-3">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="space-y-2">
                            <div className="aspect-[3/4] rounded-xl bg-dark-card animate-pulse" />
                            <div className="h-4 w-3/4 bg-dark-card rounded animate-pulse" />
                            <div className="h-3 w-1/2 bg-dark-card rounded animate-pulse" />
                        </div>
                    ))}
                </div>
            </section>
        );
    }

    if (error || !movies.length) {
        return null;
    }

    return (
        <section className="px-4 mt-1 pb-2">
            {/* Header dengan icon dan title */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    {/* <div className="p-1.5 bg-primary-400/20 rounded-lg">
                        <Film size={18} className="text-primary-400" />
                    </div> */}
                    <h2 className="text-base font-medium text-white">Anime Movies</h2>
                    {/* <span className="text-xs bg-primary-400/20 text-primary-400 px-2 py-0.5 rounded-full">
                        {movies.length}
                    </span> */}
                </div>

                <Link
                    to="/explore?type=movie"
                    className="flex items-center gap-1 text-xs text-primary-400 hover:text-primary-300 transition-colors"
                >
                    <span>See All</span>
                    <ChevronRight size={14} />
                </Link>
            </div>

            {/* Grid 3 kolom untuk anime movies */}
            <div className="grid grid-cols-3 gap-3">
                {movies.map((movie, index) => (
                    <div
                        key={index}
                        onClick={() => handleMovieClick(movie)}
                        className="cursor-pointer group/card"
                    >
                        {/* Poster Container */}
                        <div className="relative aspect-[3/4] rounded-xl overflow-hidden mb-2 bg-dark-card">
                            <img
                                src={movie.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(movie.title?.slice(0, 10))}&background=333&color=fff&size=400`}
                                alt={movie.title}
                                className="w-full h-full object-cover transition-all duration-500 group-hover/card:scale-110"
                                loading="lazy"
                                onError={(e) => {
                                    e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(movie.title?.slice(0, 10))}&background=333&color=fff&size=400`;
                                }}
                            />

                            {/* Overlay gradient */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover/card:opacity-100 transition-all duration-300" />

                            {/* Type Badge */}
                            <div className="absolute top-2 left-2">
                                <span className="px-2 py-1 bg-red-500/80 text-white text-[10px] font-bold rounded">
                                    Movie
                                </span>
                            </div>

                            {/* Score Badge */}
                            {movie.score && movie.score !== 'N/A' && (
                                <div className="absolute top-2 right-2">
                                    <span className="px-2 py-1 bg-black/80 backdrop-blur text-yellow-400 text-[10px] font-bold rounded flex items-center gap-1">
                                        <Star size={10} className="fill-yellow-400" />
                                        {movie.score}
                                    </span>
                                </div>
                            )}

                            {/* Play Button on Hover */}
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/card:opacity-100 transition-all duration-300 z-20">
                                <button className="w-10 h-10 bg-primary-400 rounded-full flex items-center justify-center transform scale-90 group-hover/card:scale-100 transition-transform duration-300">
                                    <Play size={18} className="text-black ml-0.5" fill="currentColor" />
                                </button>
                            </div>
                        </div>

                        {/* Title */}
                        <h3 className="text-sm font-medium text-white line-clamp-2 group-hover/card:text-primary-300 transition-colors">
                            {movie.title}
                        </h3>

                        {/* Additional Info */}
                        <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                            {movie.views && (
                                <span className="flex items-center gap-1">
                                    <span>👁️</span>
                                    {movie.views.replace(' Views', '')}
                                </span>
                            )}
                            {movie.genres && movie.genres.length > 0 && (
                                <span className="truncate">
                                    {movie.genres[0]}
                                </span>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default AnimeMovieSection;
