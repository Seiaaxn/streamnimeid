// AnimeEpisodesTab.jsx — grid pill layout, mobile-friendly
import { useState } from 'react';

const AnimeEpisodesTab = ({ episodes = [], onEpisodeSelect }) => {
    const [sortOrder, setSortOrder] = useState('latest');

    const sortedEpisodes = [...episodes].sort((a, b) => {
        const numA = parseFloat(a.number ?? a.episode ?? 0) || 0;
        const numB = parseFloat(b.number ?? b.episode ?? 0) || 0;
        return sortOrder === 'latest' ? numB - numA : numA - numB;
    });

    if (!episodes.length) {
        return <div className="text-center py-8 text-gray-600 text-sm">Belum ada episode</div>;
    }

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <span className="text-xs text-gray-600">{episodes.length} episode</span>
                <select
                    value={sortOrder}
                    onChange={e => setSortOrder(e.target.value)}
                    className="bg-dark-card border border-dark-border rounded-lg px-2 py-1 text-xs text-gray-400 outline-none"
                >
                    <option value="latest">Terbaru</option>
                    <option value="oldest">Terlama</option>
                </select>
            </div>

            <div className="grid grid-cols-4 gap-2 sm:grid-cols-5">
                {sortedEpisodes.map((ep, i) => {
                    const num = ep.number || ep.episode || (i + 1);
                    return (
                        <button
                            key={i}
                            onClick={() => onEpisodeSelect(ep)}
                            className="flex flex-col items-center justify-center py-3 px-1 bg-dark-card border border-dark-border rounded-xl hover:border-primary-400/60 hover:bg-primary-400/8 active:scale-95 transition-all group"
                        >
                            <span className="text-sm font-bold text-white group-hover:text-primary-400 transition-colors leading-none">
                                {num}
                            </span>
                            {ep.date && (
                                <span className="text-[9px] text-gray-700 mt-1 truncate w-full text-center px-1">
                                    {ep.date.slice(-5)}
                                </span>
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default AnimeEpisodesTab;
