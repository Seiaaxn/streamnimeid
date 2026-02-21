// DonghuaEpisodesTab.jsx — grid pill layout, mobile-friendly
import { useState } from 'react';

const DonghuaEpisodesTab = ({ episodes = [], onEpisodeSelect }) => {
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
                    const num = ep.number || ep.episode || (ep.title?.match(/\d+/)?.[0]) || (i + 1);
                    const hasSub = ep.hasSubtitle;
                    return (
                        <button
                            key={i}
                            onClick={() => onEpisodeSelect(ep)}
                            className="relative flex flex-col items-center justify-center py-3 px-1 bg-dark-card border border-dark-border rounded-xl hover:border-red-500/60 hover:bg-red-500/8 active:scale-95 transition-all group"
                        >
                            {hasSub && (
                                <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-green-400 rounded-full" />
                            )}
                            <span className="text-sm font-bold text-white group-hover:text-red-400 transition-colors leading-none">
                                {num}
                            </span>
                            {ep.releaseDate && (
                                <span className="text-[9px] text-gray-700 mt-1 truncate w-full text-center px-1">
                                    {String(ep.releaseDate).slice(-5)}
                                </span>
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default DonghuaEpisodesTab;
