import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDetailData } from '../../hooks/useDetailData';
import { addToHistory } from '../../utils/history';

// Import komponen-komponen dari components/detailPage/anime
import {
    AnimeHeader,
    AnimeCover,
    AnimeTitleSection,
    AnimeActionButtons,
    AnimeInfoBadges,
    AnimeTabs,
    AnimeEpisodesTab,
    AnimeDetailsTab,
    AnimeLoadingState,
    AnimeErrorState
} from '../../components/detailPage/anime';

const DetailAnime = () => {
    const navigate = useNavigate();
    const { detail, loading, error } = useDetailData();
    const [activeTab, setActiveTab] = useState('episodes');
    const [bookmarked, setBookmarked] = useState(false);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const handleWatchEpisode = (episode) => {
        if (!detail) return;

        addToHistory(
            {
                title: detail.title,
                image: detail.image,
                url: detail.url || window.location.href,
                source: detail.source,
                category: detail.category
            },
            {
                title: episode.title || `Episode ${episode.number || episode.episode}`,
                url: episode.url,
                episode: episode.number || episode.episode
            }
        );

        navigate(`/anime/watch?url=${encodeURIComponent(episode.url)}`);
    };

    const handleGoBack = () => navigate(-1);
    const handleBookmarkToggle = () => setBookmarked(!bookmarked);
    const handleShare = () => {
        // Implement share functionality
        console.log('Share clicked');
    };

    if (loading) {
        return <AnimeLoadingState onGoBack={handleGoBack} />;
    }

    if (error || !detail) {
        return (
            <AnimeErrorState
                error={error}
                onGoBack={handleGoBack}
            />
        );
    }

    return (
        <div className="min-h-screen bg-dark-bg pb-6">
            <AnimeHeader
                title={detail.title}
                bookmarked={bookmarked}
                onGoBack={handleGoBack}
                onBookmark={handleBookmarkToggle}
                onShare={handleShare}
            />

            <AnimeCover
                image={detail.image}
                title={detail.title}
                category="Anime"
            />

            <div className="px-4 -mt-20 relative z-10">
                <AnimeTitleSection
                    title={detail.title}
                    image={detail.image}
                    altTitles={detail.altTitles}
                />

                <AnimeActionButtons
                    onWatchNow={() => handleWatchEpisode(detail.episodes?.[0])}
                    onBookmark={handleBookmarkToggle}
                    bookmarked={bookmarked}
                />

                <AnimeInfoBadges
                    status={detail.status}
                    type={detail.type}
                    totalEpisodes={detail.totalEpisodes}
                    released={detail.released}
                />

                <AnimeTabs
                    activeTab={activeTab}
                    onTabChange={setActiveTab}
                    episodeCount={detail.episodes?.length || 0}
                />

                {activeTab === 'episodes' && (
                    <AnimeEpisodesTab
                        episodes={detail.episodes}
                        onEpisodeSelect={handleWatchEpisode}
                    />
                )}

                {activeTab === 'details' && (
                    <AnimeDetailsTab
                        description={detail.description}
                        status={detail.status}
                        type={detail.type}
                        totalEpisodes={detail.totalEpisodes}
                        released={detail.released}
                        genres={detail.genres}
                    />
                )}
            </div>
        </div>
    );
};

export default DetailAnime;