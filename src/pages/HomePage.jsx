// src/pages/HomePage.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/home/Header';
import HeroSlider from '../components/home/HeroSlider';
import ContentGrid from '../components/home/ContentGrid';
import { useHomeData } from '../hooks/useHomeData';
import LatestAnimeSection from '../components/home/LatestAnimeSection';
import AnimeMovieSection from '../components/home/AnimeMovieSection';
import LatestDonghuaSection from '../components/home/LatestDonghuaSection';

const HomePage = () => {
  const navigate = useNavigate();
  const [headerScrolled, setHeaderScrolled] = useState(false);

  const { animeData, donghuaData, loading } = useHomeData();

  useEffect(() => {
    const handleScroll = () => setHeaderScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleAnimeSelect = (item) => {
    const category = item.source === 'samehadaku' || item.type === 'Anime' ? 'anime' : 'donghua';
    let itemUrl = item.url || item.link;
    if (!itemUrl) return;
    itemUrl = itemUrl.replace(/\/+$/, '');
    const encodedUrl = encodeURIComponent(itemUrl);
    navigate(`/detail/${category}/${encodedUrl}`);
  };

  const getHeroItems = () => {
    if (loading) return [];
    const combined = [
      ...(Array.isArray(animeData) ? animeData.slice(0, 3) : []),
      ...(Array.isArray(donghuaData) ? donghuaData.slice(0, 2) : [])
    ];
    for (let i = combined.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [combined[i], combined[j]] = [combined[j], combined[i]];
    }
    return combined.slice(0, 5);
  };

  const heroItems = getHeroItems();

  return (
    <div className="min-h-screen bg-dark-bg">
      <Header scrolled={headerScrolled} />

      <div className="pt-14">
        <HeroSlider
          items={heroItems}
          onAnimeSelect={handleAnimeSelect}
          autoPlayInterval={4000}
          loading={loading}
        />

        {/* Latest Anime */}
        <LatestAnimeSection items={animeData} loading={loading} onItemClick={handleAnimeSelect} />

        {/* Anime Movies */}
        <AnimeMovieSection />

        {/* Latest Donghua */}
        <LatestDonghuaSection items={donghuaData} loading={loading} onItemClick={handleAnimeSelect} />

        {/* All Anime / All Donghua Grid */}
        <ContentGrid onItemClick={handleAnimeSelect} />
      </div>
    </div>
  );
};

export default HomePage;
