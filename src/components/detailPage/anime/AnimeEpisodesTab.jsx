import { Play } from 'lucide-react';
import { useState } from 'react';

const AnimeEpisodesTab = ({ episodes = [], onEpisodeSelect }) => {
    const [sortOrder, setSortOrder] = useState('latest');

    const sortedEpisodes = [...episodes].sort((a, b) => {
        const numA = a.number || a.episode || 0;
        const numB = b.number || b.episode || 0;
        return sortOrder === 'latest' ? numB - numA : numA - numB;
    });

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-white font-semibold">
                    {episodes.length || 0} Episodes
                </h3>
                <select
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value)}
                    className="bg-dark-surface border border-dark-border rounded-lg px-3 py-1.5 text-sm text-gray-300"
                >
                    <option value="latest">Latest First</option>
                    <option value="oldest">Oldest First</option>
                </select>
            </div>

            <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2">
                {sortedEpisodes.map((episode, index) => {
                    const episodeNumber = episode.number ||
                        episode.episode ||
                        (episode.title?.match(/\d+/) || [index + 1])[0];
                    const episodeTitle = episode.title || `Episode ${episodeNumber}`;
                    const episodeDate = episode.date || '';

                    return (
                        <button
                            key={index}
                            onClick={() => onEpisodeSelect(episode)}
                            className="w-full flex items-center justify-between p-3 bg-dark-surface rounded-lg border border-dark-border hover:border-primary-400/50 transition group"
                        >
                            <div className="flex items-center gap-3 flex-1">
                                <div className="w-8 h-8 bg-primary-400/10 rounded-full flex items-center justify-center flex-shrink-0">
                                    <span className="text-primary-400 font-semibold text-sm">
                                        {episodeNumber}
                                    </span>
                                </div>
                                <div className="text-left flex-1">
                                    <h4 className="text-sm font-medium text-white group-hover:text-primary-400 transition">
                                        {episodeTitle}
                                    </h4>
                                    {episodeDate && (
                                        <p className="text-xs text-gray-500">{episodeDate}</p>
                                    )}
                                </div>
                            </div>
                            <Play size={16} className="text-gray-500 group-hover:text-primary-400 transition flex-shrink-0" />
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default AnimeEpisodesTab;