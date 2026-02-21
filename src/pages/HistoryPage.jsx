// pages/HistoryPage.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ArrowLeft, Play, Trash2, Clock, Film, Calendar,
    ChevronRight, AlertCircle, X, Eye
} from 'lucide-react';
import { getHistory, removeFromHistory, clearHistory } from '../utils/history';

const HistoryPage = ({ onAnimeSelect }) => {
    const navigate = useNavigate();
    const [history, setHistory] = useState([]);
    const [selectedItems, setSelectedItems] = useState([]);
    const [selectMode, setSelectMode] = useState(false);

    // Load history
    useEffect(() => {
        setHistory(getHistory());
    }, []);

    const handleBack = () => {
        navigate(-1);
    };

    const handleRemove = (url) => {
        const newHistory = removeFromHistory(url);
        setHistory(newHistory);
        setSelectedItems(prev => prev.filter(item => item !== url));
    };

    const handleClearAll = () => {
        if (window.confirm('Are you sure you want to clear all watch history?')) {
            clearHistory();
            setHistory([]);
            setSelectMode(false);
        }
    };

    const toggleSelect = (url) => {
        setSelectedItems(prev => {
            if (prev.includes(url)) {
                return prev.filter(item => item !== url);
            } else {
                return [...prev, url];
            }
        });
    };

    const handleBulkRemove = () => {
        if (selectedItems.length === 0) return;

        if (window.confirm(`Remove ${selectedItems.length} item(s) from history?`)) {
            let newHistory = [...history];
            selectedItems.forEach(url => {
                newHistory = removeFromHistory(url);
            });
            setHistory(newHistory);
            setSelectedItems([]);
            setSelectMode(false);
        }
    };

    const handleItemClick = (item) => {
        // Langsung ke watch page
        navigate(`/${item.source === 'samehadaku' ? 'anime' : 'donghua'}/watch`, {
            state: {
                anime: {
                    title: item.title,
                    url: item.url,
                    image: item.image,
                    source: item.source,
                    category: item.category
                },
                episode: {
                    title: item.episodeTitle,
                    url: item.episodeUrl,
                    episode: item.episode
                },
                episodes: [] // Fetch nanti di StreamingPage
            }
        });
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInSeconds = Math.floor((now - date) / 1000);

        if (diffInSeconds < 60) return 'Just now';
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
        if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;

        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
        });
    };

    // Group history by date (today, yesterday, this week, older)
    const groupHistory = () => {
        const groups = {
            today: [],
            yesterday: [],
            thisWeek: [],
            older: []
        };

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        const weekAgo = new Date(today);
        weekAgo.setDate(weekAgo.getDate() - 7);

        history.forEach(item => {
            const itemDate = new Date(item.lastWatched);
            itemDate.setHours(0, 0, 0, 0);

            if (itemDate.getTime() === today.getTime()) {
                groups.today.push(item);
            } else if (itemDate.getTime() === yesterday.getTime()) {
                groups.yesterday.push(item);
            } else if (itemDate > weekAgo) {
                groups.thisWeek.push(item);
            } else {
                groups.older.push(item);
            }
        });

        return groups;
    };

    const groups = groupHistory();

    return (
        <div className="min-h-screen bg-dark-bg">
            {/* Header */}
            <div className="sticky top-0 z-30 bg-dark-bg/95 backdrop-blur-sm border-b border-dark-border">
                <div className="p-4">
                    <div className="flex items-center gap-3">
                        {/* <button
                            onClick={handleBack}
                            className="p-2 -ml-2 hover:bg-white/10 rounded-full transition-colors"
                        >
                            <ArrowLeft size={24} />
                        </button> */}

                        <div className="flex-1">
                            <h2 className="text-lg font-bold text-white">Watch History</h2>
                            {/* <p className="text-xs text-gray-500">
                                {history.length} {history.length === 1 ? 'item' : 'items'}
                            </p> */}
                        </div>

                        {history.length > 0 && (
                            <button
                                onClick={() => setSelectMode(!selectMode)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${selectMode
                                        ? 'bg-primary-400 text-black'
                                        : 'bg-dark-surface text-gray-400 border border-dark-border hover:text-white'
                                    }`}
                            >
                                {selectMode ? 'Cancel' : 'Select'}
                            </button>
                        )}
                    </div>

                    {/* Selection Mode Bar */}
                    {selectMode && (
                        <div className="flex items-center justify-between mt-3 pt-3 border-t border-dark-border">
                            <button
                                onClick={() => {
                                    if (selectedItems.length === history.length) {
                                        setSelectedItems([]);
                                    } else {
                                        setSelectedItems(history.map(item => item.url));
                                    }
                                }}
                                className="text-xs text-gray-400 hover:text-primary-400 transition-colors"
                            >
                                {selectedItems.length === history.length ? 'Deselect All' : 'Select All'}
                            </button>

                            <div className="flex items-center gap-2">
                                <span className="text-xs text-gray-400">
                                    {selectedItems.length} selected
                                </span>
                                {selectedItems.length > 0 && (
                                    <button
                                        onClick={handleBulkRemove}
                                        className="flex items-center gap-1 px-3 py-1 bg-red-500/10 text-red-400 rounded-lg text-xs font-medium hover:bg-red-500/20 transition-colors"
                                    >
                                        <Trash2 size={12} />
                                        <span>Remove</span>
                                    </button>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Content */}
            <div className="p-4">
                {history.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                        <div className="w-16 h-16 bg-dark-surface rounded-full flex items-center justify-center mb-4">
                            <Eye size={32} className="text-gray-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-white mb-2">No watch history</h3>
                        <p className="text-sm text-gray-500 mb-6 max-w-xs">
                            Start watching anime and they'll appear here for easy access
                        </p>
                        <button
                            onClick={handleBack}
                            className="px-4 py-2 bg-primary-400 text-black rounded-lg text-sm font-medium hover:bg-primary-300 transition-colors"
                        >
                            Browse Anime
                        </button>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {/* Today */}
                        {groups.today.length > 0 && (
                            <div>
                                <h3 className="text-xs font-semibold text-gray-400 mb-3 px-1">TODAY</h3>
                                <HistoryList
                                    items={groups.today}
                                    selectMode={selectMode}
                                    selectedItems={selectedItems}
                                    onToggleSelect={toggleSelect}
                                    onItemClick={handleItemClick}
                                    onRemove={handleRemove}
                                    formatDate={formatDate}
                                />
                            </div>
                        )}

                        {/* Yesterday */}
                        {groups.yesterday.length > 0 && (
                            <div>
                                <h3 className="text-xs font-semibold text-gray-400 mb-3 px-1">YESTERDAY</h3>
                                <HistoryList
                                    items={groups.yesterday}
                                    selectMode={selectMode}
                                    selectedItems={selectedItems}
                                    onToggleSelect={toggleSelect}
                                    onItemClick={handleItemClick}
                                    onRemove={handleRemove}
                                    formatDate={formatDate}
                                />
                            </div>
                        )}

                        {/* This Week */}
                        {groups.thisWeek.length > 0 && (
                            <div>
                                <h3 className="text-xs font-semibold text-gray-400 mb-3 px-1">THIS WEEK</h3>
                                <HistoryList
                                    items={groups.thisWeek}
                                    selectMode={selectMode}
                                    selectedItems={selectedItems}
                                    onToggleSelect={toggleSelect}
                                    onItemClick={handleItemClick}
                                    onRemove={handleRemove}
                                    formatDate={formatDate}
                                />
                            </div>
                        )}

                        {/* Older */}
                        {groups.older.length > 0 && (
                            <div>
                                <h3 className="text-xs font-semibold text-gray-400 mb-3 px-1">OLDER</h3>
                                <HistoryList
                                    items={groups.older}
                                    selectMode={selectMode}
                                    selectedItems={selectedItems}
                                    onToggleSelect={toggleSelect}
                                    onItemClick={handleItemClick}
                                    onRemove={handleRemove}
                                    formatDate={formatDate}
                                />
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

// Component untuk daftar history
const HistoryList = ({ items, selectMode, selectedItems, onToggleSelect, onItemClick, onRemove, formatDate }) => {
    return (
        <div className="space-y-2">
            {items.map((item) => (
                <div
                    key={item.id}
                    className={`group relative bg-dark-surface rounded-xl overflow-hidden border transition-all ${selectMode
                            ? selectedItems.includes(item.url)
                                ? 'border-primary-400'
                                : 'border-dark-border'
                            : 'border-dark-border hover:border-primary-400/50'
                        }`}
                >
                    {selectMode ? (
                        // Selection Mode
                        <div className="flex items-center p-3">
                            <button
                                onClick={() => onToggleSelect(item.url)}
                                className={`w-6 h-6 rounded-lg border-2 mr-3 flex items-center justify-center transition-colors ${selectedItems.includes(item.url)
                                        ? 'bg-primary-400 border-primary-400'
                                        : 'border-gray-600'
                                    }`}
                            >
                                {selectedItems.includes(item.url) && (
                                    <X size={14} className="text-black" />
                                )}
                            </button>

                            <div
                                className="flex-1 flex items-center gap-3 cursor-pointer"
                                onClick={() => onItemClick(item)}
                            >
                                <img
                                    src={item.image || 'https://via.placeholder.com/60x80/1a1a1a/666666?text=No+Image'}
                                    alt={item.title}
                                    className="w-16 h-20 object-cover rounded-lg"
                                />
                                <div className="flex-1 min-w-0">
                                    <h4 className="text-sm font-medium text-white mb-1 line-clamp-1">
                                        {item.title}
                                    </h4>
                                    <p className="text-xs text-primary-400 mb-1">
                                        {item.episodeTitle}
                                    </p>
                                    <p className="text-[10px] text-gray-500">
                                        {formatDate(item.lastWatched)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        // Normal Mode
                        <div
                            onClick={() => onItemClick(item)}
                            className="flex items-center gap-3 p-3 cursor-pointer"
                        >
                            <img
                                src={item.image || 'https://via.placeholder.com/60x80/1a1a1a/666666?text=No+Image'}
                                alt={item.title}
                                className="w-16 h-20 object-cover rounded-lg"
                            />

                            <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-2">
                                    <h4 className="text-sm font-medium text-white group-hover:text-primary-300 transition-colors line-clamp-1">
                                        {item.title}
                                    </h4>
                                    <span className={`px-1.5 py-0.5 text-[8px] font-bold rounded shrink-0 ${item.source === 'samehadaku' ? 'bg-blue-500/90' : 'bg-red-500/90'
                                        } text-white`}>
                                        {item.source === 'samehadaku' ? 'ANIME' : 'DONGHUA'}
                                    </span>
                                </div>

                                <p className="text-xs text-primary-400 mt-1 font-medium">
                                    {item.episodeTitle}
                                </p>

                                <div className="flex items-center justify-between mt-2">
                                    <div className="flex items-center gap-1 text-[10px] text-gray-500">
                                        <Calendar size={10} />
                                        <span>{formatDate(item.lastWatched)}</span>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        {/* Progress Bar */}
                                        <div className="w-16 h-1 bg-gray-700 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-primary-400"
                                                style={{ width: `${item.progress}%` }}
                                            />
                                        </div>

                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onRemove(item.url);
                                            }}
                                            className="p-1 hover:bg-white/10 rounded-full transition-colors opacity-0 group-hover:opacity-100"
                                        >
                                            <Trash2 size={12} className="text-gray-400" />
                                        </button>

                                        <ChevronRight size={14} className="text-gray-500" />
                                    </div>
                                </div>

                                {/* Total episodes info */}
                                {item.totalEpisodes > 0 && (
                                    <p className="text-[8px] text-gray-600 mt-1">
                                        {item.totalEpisodes} episodes total
                                    </p>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default HistoryPage;