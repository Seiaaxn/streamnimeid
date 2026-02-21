import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

import {
    StreamingAnimeNavbar,
    StreamingAnimeVideoPlayer,
    StreamingAnimeServerSelector,
    StreamingAnimeInfoCard,
    StreamingAnimeDownloadSection,
    StreamingAnimeEpisodesGrid,
    StreamingAnimeNavigationButtons,
    StreamingAnimeErrorState,
    StreamingAnimeCommentsSection
} from '../../components/streaming/anime';

const API_BASE = 'https://anime-api-iota-beryl.vercel.app/api';

const StreamingAnime = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // Ambil URL dari query parameter
    const searchParams = new URLSearchParams(location.search);
    const episodeUrl = searchParams.get('url');

    const [episodeData, setEpisodeData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [selectedServer, setSelectedServer] = useState(null);
    const [isIframeLoading, setIsIframeLoading] = useState(false);

    const iframeRef = useRef(null);

    // Fetch data dari endpoint
    useEffect(() => {
        const fetchEpisodeDetail = async () => {
            if (!episodeUrl) {
                setError('No episode URL provided');
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                console.log('Fetching episode from:', `${API_BASE}/anime/episode?url=${encodeURIComponent(episodeUrl)}`);

                const response = await axios.get(`${API_BASE}/anime/episode?url=${encodeURIComponent(episodeUrl)}`);

                console.log('Episode data response:', response.data);

                if (response.data.success) {
                    setEpisodeData(response.data.data);

                    // Set server pertama sebagai default
                    if (response.data.data.streams?.length > 0) {
                        setSelectedServer(response.data.data.streams[0]);
                        // Set iframe loading true saat pertama load
                        setIsIframeLoading(true);
                    }
                } else {
                    setError(response.data.error || 'Failed to load episode');
                }
            } catch (err) {
                console.error('Error fetching episode detail:', err);
                setError('Failed to load episode data');
            } finally {
                setLoading(false);
            }
        };

        if (episodeUrl) {
            fetchEpisodeDetail();
        }
    }, [episodeUrl]);

    const handleBack = () => navigate(-1);

    const handleEpisodeClick = (ep) => {
        navigate(`/anime/watch?url=${encodeURIComponent(ep.url)}`);
    };

    const handleNext = () => {
        if (episodeData?.navigation?.next) {
            navigate(`/anime/watch?url=${encodeURIComponent(episodeData.navigation.next)}`);
        }
    };

    const handlePrev = () => {
        if (episodeData?.navigation?.prev) {
            navigate(`/anime/watch?url=${encodeURIComponent(episodeData.navigation.prev)}`);
        }
    };

    const handleServerChange = (server) => {
        setSelectedServer(server);
        setIsIframeLoading(true);
    };

    const handleGoHome = () => navigate('/');

    // Loading state - tampilkan spinner di video player, navbar tetap muncul
    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-dark-bg to-black">
                <StreamingAnimeNavbar
                    title="Loading..."
                    episodeTitle="Please wait"
                    episodeNumber="?"
                    onBack={handleBack}
                />

                {/* Video Player Container dengan loading spinner */}
                <div className="relative w-full bg-black aspect-video">
                    <div className="absolute inset-0 flex items-center justify-center bg-dark-bg">
                        <div className="text-center">
                            <div className="w-10 h-10 border-4 border-primary-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                            <p className="text-gray-400">Loading episode...</p>
                        </div>
                    </div>
                </div>

                {/* Content Section - skeleton loading */}
                <div className="max-w-7xl mx-auto px-4 py-6">
                    {/* StreamingAnimeInfoCard skeleton */}
                    <div className="mb-6">
                        <div className="flex items-start gap-4">
                            <div className="flex-1">
                                {/* Episode Badge skeleton */}
                                <div className="mb-2">
                                    <div className="h-4 w-20 bg-dark-card rounded animate-pulse" />
                                </div>

                                {/* Title skeleton */}
                                <div className="h-7 w-3/4 bg-dark-card rounded animate-pulse mb-2" />

                                {/* Sinopsis skeleton - 3 lines */}
                                <div className="space-y-2 mb-1">
                                    <div className="h-4 w-full bg-dark-card rounded animate-pulse" />
                                    <div className="h-4 w-full bg-dark-card rounded animate-pulse" />
                                    <div className="h-4 w-2/3 bg-dark-card rounded animate-pulse" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* StreamingAnimeActionBar skeleton */}
                    <div className="mb-6 overflow-x-auto hide-scrollbar">
                        <div className="flex items-center gap-3 min-w-max">
                            {[...Array(6)].map((_, i) => (
                                <div
                                    key={i}
                                    className="w-24 h-10 bg-dark-surface rounded-full animate-pulse"
                                />
                            ))}
                        </div>
                    </div>

                    {/* StreamingAnimeEpisodesGrid skeleton */}
                    <div className="mb-6">
                        {/* Header */}
                        <div className="flex items-center justify-between mb-4">
                            <div className="h-5 w-20 bg-dark-card rounded animate-pulse" />
                            <div className="w-8 h-8 bg-dark-surface rounded-lg animate-pulse" />
                        </div>

                        {/* Episodes grid skeleton - horizontal */}
                        <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-2">
                            {[...Array(8)].map((_, i) => (
                                <div
                                    key={i}
                                    className="w-28 h-16 bg-dark-surface rounded-xl animate-pulse"
                                />
                            ))}
                        </div>
                    </div>

                    {/* StreamingAnimeCommentsSection skeleton */}
                    <div className="mb-10 px-2">
                        {/* Header */}
                        <div className="flex items-center justify-between mb-4">
                            <div className="h-5 w-24 bg-dark-card rounded animate-pulse" />
                            <div className="w-8 h-8 bg-dark-surface rounded-lg animate-pulse" />
                        </div>

                        {/* Input skeleton */}
                        <div className="mb-6 flex items-center gap-3 bg-dark-surface border border-dark-border rounded-full px-4 py-2">
                            <div className="flex-1 h-5 bg-dark-card rounded animate-pulse" />
                            <div className="w-8 h-8 bg-primary-400/30 rounded-full animate-pulse" />
                        </div>

                        {/* Comments skeleton - 3 comments */}
                        <div className="space-y-6">
                            {[...Array(3)].map((_, i) => (
                                <div key={i} className="flex gap-3">
                                    {/* Avatar skeleton */}
                                    <div className="w-9 h-9 rounded-full bg-primary-400/20 animate-pulse" />

                                    {/* Content skeleton */}
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            <div className="h-4 w-20 bg-dark-card rounded animate-pulse" />
                                            <div className="h-3 w-12 bg-dark-card rounded animate-pulse" />
                                        </div>
                                        <div className="space-y-2 mb-2">
                                            <div className="h-3 w-full bg-dark-card rounded animate-pulse" />
                                            <div className="h-3 w-3/4 bg-dark-card rounded animate-pulse" />
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="h-5 w-12 bg-dark-card rounded animate-pulse" />
                                            <div className="h-5 w-12 bg-dark-card rounded animate-pulse" />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Error state
    if (error || !episodeData) {
        return (
            <StreamingAnimeErrorState
                error={error}
                onGoHome={handleGoHome}
            />
        );
    }

    const { currentEpisode, anime, episodes, streams, downloads, navigation } = episodeData;

    return (
        <div className="min-h-screen bg-gradient-to-b from-dark-bg to-black">
            <StreamingAnimeNavbar
                title={anime?.title}
                episodeTitle={currentEpisode?.title}
                episodeNumber={currentEpisode?.number}
                onBack={handleBack}
            />

            {/* Video Player Container */}
            <div className="relative w-full bg-black aspect-video">
                <StreamingAnimeVideoPlayer
                    ref={iframeRef}
                    selectedServer={selectedServer}
                    isLoading={isIframeLoading}
                    onLoad={() => setIsIframeLoading(false)}
                    onError={() => {
                        setIsIframeLoading(false);
                        setError('Failed to load video player');
                    }}
                />
            </div>

            {/* Content Section */}
            <div className="max-w-7xl mx-auto px-4 py-3">
                <StreamingAnimeInfoCard 
                    episodeNumber={currentEpisode?.number}
                    anime={anime} 
                />

                <StreamingAnimeServerSelector
                    streams={streams}
                    selectedServer={selectedServer}
                    downloads={downloads}
                    onServerSelect={handleServerChange}
                />


                {/* <StreamingAnimeDownloadSection downloads={downloads} /> */}

                <StreamingAnimeEpisodesGrid
                    episodes={episodes}
                    currentEpisodeNumber={currentEpisode?.number}
                    onEpisodeClick={handleEpisodeClick}
                />

                {/* <StreamingAnimeNavigationButtons
                    onPrev={handlePrev}
                    onNext={handleNext}
                    onAllEpisodes={() => navigate(`/anime/detail?url=${encodeURIComponent(anime?.url)}`)}
                    hasPrev={!!navigation?.prev}
                    hasNext={!!navigation?.next}
                    allEpisodesUrl={`/anime/detail?url=${encodeURIComponent(anime?.url)}`}
                /> */}

                <StreamingAnimeCommentsSection/>
            </div>
        </div>
    );
};

export default StreamingAnime;