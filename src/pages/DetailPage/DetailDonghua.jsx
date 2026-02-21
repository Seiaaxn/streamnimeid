import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDetailData } from '../../hooks/useDetailData';
import { addToHistory } from '../../utils/history';

// Import komponen-komponen donghua
import {
    DonghuaHeader,
    DonghuaCover,
    DonghuaTitleSection,
    DonghuaActionButtons,
    DonghuaInfoBadges,
    DonghuaTabs,
    DonghuaEpisodesTab,
    DonghuaDetailsTab,
    DonghuaCharactersTab,
    DonghuaLoadingState,
    DonghuaErrorState
} from '../../components/detailPage/donghua';

const DetailDonghua = () => {
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

        navigate(`/donghua/watch?url=${encodeURIComponent(episode.url)}`);
    };

    const handleGoBack = () => navigate(-1);
    const handleBookmarkToggle = () => setBookmarked(!bookmarked);
    const handleShare = () => {
        // Implement share functionality
        console.log('Share clicked');
    };

    if (loading) {
        return <DonghuaLoadingState onGoBack={handleGoBack} />;
    }

    if (error || !detail) {
        return (
            <DonghuaErrorState
                error={error}
                onGoBack={handleGoBack}
            />
        );
    }

    return (
        <div className="min-h-screen bg-dark-bg pb-6">
            <DonghuaHeader
                title={detail.title}
                bookmarked={bookmarked}
                onGoBack={handleGoBack}
                onBookmark={handleBookmarkToggle}
                onShare={handleShare}
            />

            <DonghuaCover
                image={detail.image}
                title={detail.title}
                category="Donghua"
            />

            <div className="px-4 -mt-20 relative z-10">
                <DonghuaTitleSection
                    title={detail.title}
                    image={detail.image}
                    altTitles={detail.altTitles}
                />

                <DonghuaActionButtons
                    onWatchNow={() => handleWatchEpisode(detail.episodes?.[0])}
                    onBookmark={handleBookmarkToggle}
                    bookmarked={bookmarked}
                />

                <DonghuaInfoBadges
                    status={detail.status}
                    type={detail.type}
                    totalEpisodes={detail.totalEpisodes}
                    duration={detail.duration}
                    released={detail.released}
                    country={detail.country}
                    followers={detail.followers}
                />

                <DonghuaTabs
                    activeTab={activeTab}
                    onTabChange={setActiveTab}
                    episodeCount={detail.episodes?.length || 0}
                    hasCharacters={detail.characters?.length > 0}
                />

                {activeTab === 'episodes' && (
                    <DonghuaEpisodesTab
                        episodes={detail.episodes}
                        onEpisodeSelect={handleWatchEpisode}
                    />
                )}

                {activeTab === 'details' && (
                    <DonghuaDetailsTab
                        description={detail.description || detail.synopsis}
                        status={detail.status}
                        type={detail.type}
                        totalEpisodes={detail.totalEpisodes}
                        studio={detail.studio}
                        network={detail.network}
                        released={detail.released}
                        duration={detail.duration}
                        season={detail.season}
                        country={detail.country}
                        fansub={detail.fansub}
                        postedBy={detail.postedBy}
                        postedOn={detail.postedOn}
                        updatedOn={detail.updatedOn}
                        genres={detail.genres}
                        rating={detail.rating}
                    />
                )}

                {activeTab === 'characters' && (
                    <DonghuaCharactersTab
                        characters={detail.characters}
                    />
                )}
            </div>
        </div>
    );
};

export default DetailDonghua;