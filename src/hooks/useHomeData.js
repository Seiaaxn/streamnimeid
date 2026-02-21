// src/hooks/useHomeData.js
import { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE = 'https://anime-api-iota-beryl.vercel.app/api';

const cleanDonghuaUrl = (url) => {
  if (!url) return url;
  let cleanUrl = url.replace(/\/+$/, '');
  if (cleanUrl.includes('-episode-')) {
    cleanUrl = cleanUrl.split('-episode-')[0];
  }
  return cleanUrl + '/';
};

const cleanDonghuaTitle = (title) => {
  if (!title) return title;
  return title.replace(/\s+Episode\s+\d+.*$/, '').trim();
};

export const useHomeData = () => {
  const [animeData, setAnimeData] = useState([]);
  const [donghuaData, setDonghuaData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const [animeRes, donghuaRes] = await Promise.allSettled([
          axios.get(`${API_BASE}/anime/latest`),
          axios.get(`${API_BASE}/donghua/latest-release`)
        ]);

        if (animeRes.status === 'fulfilled') {
          const data = animeRes.value.data || [];
          setAnimeData(Array.isArray(data) ? data : []);
        }

        if (donghuaRes.status === 'fulfilled') {
          const rawData = donghuaRes.value.data?.data || donghuaRes.value.data || [];
          const cleaned = (Array.isArray(rawData) ? rawData : [])
            .map(item => ({
              ...item,
              title: cleanDonghuaTitle(item.title),
              url: cleanDonghuaUrl(item.url),
              episodeUrl: item.url,
              episode: item.episode
            }))
            .filter((item, index, self) =>
              index === self.findIndex(i => i.url === item.url)
            );
          setDonghuaData(cleaned);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return {
    animeData,
    donghuaData,
    loading,
  };
};
          
