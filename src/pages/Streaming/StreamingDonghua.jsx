import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

import {
    StreamingDonghuaNavbar,
    StreamingDonghuaVideoPlayer,
    StreamingDonghuaServerSelector,
    StreamingDonghuaInfoCard,
    StreamingDonghuaDownloadSection,
    StreamingDonghuaRelatedEpisodes,
    StreamingDonghuaNavigationButtons,
    StreamingDonghuaLoadingState,
    StreamingDonghuaErrorState
} from '../../components/streaming/donghua';

const API_BASE = 'https://anime-api-iota-beryl.vercel.app/api';

const StreamingDonghua = () => {
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
    const [showAdsWarning, setShowAdsWarning] = useState(false);

    const iframeRef = useRef(null);
    const playerContainerRef = useRef(null);

    // Fetch data dari endpoint /api/donghua/episode
    useEffect(() => {
        const fetchEpisodeDetail = async () => {
            if (!episodeUrl) {
                setError('No episode URL provided');
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                const response = await axios.get(`${API_BASE}/donghua/episode?url=${encodeURIComponent(episodeUrl)}`);

                if (response.data.success) {
                    setEpisodeData(response.data.data);

                    // Set server pertama sebagai default (prioritas server tanpa iklan)
                    const streams = response.data.data.streams || [];
                    const noAdsServer = streams.find(s => !s.hasAds);
                    setSelectedServer(noAdsServer || streams[0] || null);
                } else {
                    setError(response.data.error || 'Failed to load episode');
                }
            } catch (err) {
                console.error('Error fetching donghua episode detail:', err);
                setError('Failed to load episode data');
            } finally {
                setLoading(false);
            }
        };

        if (episodeUrl) {
            fetchEpisodeDetail();
        }
    }, [episodeUrl]);

    // Effect untuk menampilkan warning jika server mengandung iklan
    useEffect(() => {
        if (selectedServer?.hasAds) {
            setShowAdsWarning(true);
            const timer = setTimeout(() => setShowAdsWarning(false), 5000);
            return () => clearTimeout(timer);
        }
    }, [selectedServer]);

    const handleBack = () => navigate(-1);

    const handleServerChange = (server) => {
        setSelectedServer(server);
        setIsIframeLoading(true);
    };

    const handleEpisodeClick = (ep) => {
        navigate(`/donghua/watch?url=${encodeURIComponent(ep.url)}`);
    };

    const handlePrev = () => {
        if (episodeData?.navigation?.prev) {
            navigate(`/donghua/watch?url=${encodeURIComponent(episodeData.navigation.prev)}`);
        }
    };

    const handleNext = () => {
        if (episodeData?.navigation?.next) {
            navigate(`/donghua/watch?url=${encodeURIComponent(episodeData.navigation.next)}`);
        }
    };

    const handleGoHome = () => navigate('/');

    // Loading state
    if (loading) {
        return <StreamingDonghuaLoadingState onBack={handleBack} />;
    }

    // Error state
    if (error || !episodeData) {
        return (
            <StreamingDonghuaErrorState
                error={error}
                onGoHome={handleGoHome}
            />
        );
    }

    const { currentEpisode, donghua, streams, downloads, relatedEpisodes, navigation } = episodeData;

    return (
        <div className="min-h-screen bg-gradient-to-b from-dark-bg to-black">
            <StreamingDonghuaNavbar
                title={donghua?.title}
                episodeTitle={currentEpisode?.title}
                episodeNumber={currentEpisode?.number}
                onBack={handleBack}
            />

            {/* Video Player Container */}
            <div
                ref={playerContainerRef}
                className="relative w-full bg-black aspect-video"
            >
                <StreamingDonghuaVideoPlayer
                    ref={iframeRef}
                    selectedServer={selectedServer}
                    isLoading={isIframeLoading}
                    showAdsWarning={showAdsWarning}
                    onLoad={() => setIsIframeLoading(false)}
                    onError={() => {
                        setIsIframeLoading(false);
                        setError('Failed to load video player');
                    }}
                />
            </div>

            {/* Content Section */}
            <div className="max-w-7xl mx-auto px-4 py-6">
                <StreamingDonghuaServerSelector
                    streams={streams}
                    selectedServer={selectedServer}
                    onServerSelect={handleServerChange}
                />

                <StreamingDonghuaInfoCard donghua={donghua} />

                <StreamingDonghuaDownloadSection downloads={downloads} />

                <StreamingDonghuaRelatedEpisodes
                    episodes={relatedEpisodes}
                    onEpisodeClick={handleEpisodeClick}
                />

                <StreamingDonghuaNavigationButtons
                    onPrev={handlePrev}
                    onNext={handleNext}
                    onAllEpisodes={() => navigate(`/donghua/detail?url=${encodeURIComponent(donghua?.url)}`)}
                    hasPrev={!!navigation?.prev}
                    hasNext={!!navigation?.next}
                    allEpisodesUrl={`/donghua/detail?url=${encodeURIComponent(donghua?.url)}`}
                />
            </div>
        </div>
    );
};

export default StreamingDonghua;
