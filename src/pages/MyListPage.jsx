// pages/MyListPage.jsx
import { useState, useEffect } from 'react';
import {
    Trash2,
    Play,
    Calendar,
    Clock,
    BookmarkX,
    ArrowRight
} from 'lucide-react';

const MyListPage = ({ onAnimeSelect }) => {
    const [bookmarks, setBookmarks] = useState([]);
    const [filter, setFilter] = useState('all'); // all, anime, donghua

    useEffect(() => {
        loadBookmarks();

        // Listen for bookmark updates
        const handleUpdate = () => loadBookmarks();
        window.addEventListener('bookmarksUpdated', handleUpdate);

        return () => window.removeEventListener('bookmarksUpdated', handleUpdate);
    }, []);

    const loadBookmarks = () => {
        const saved = JSON.parse(localStorage.getItem('bookmarks') || '[]');
        setBookmarks(saved);
    };

    const removeBookmark = (url) => {
        const newBookmarks = bookmarks.filter(item => item.url !== url);
        localStorage.setItem('bookmarks', JSON.stringify(newBookmarks));
        setBookmarks(newBookmarks);
        window.dispatchEvent(new Event('bookmarksUpdated'));
    };

    const clearAll = () => {
        if (confirm('Are you sure you want to remove all bookmarks?')) {
            localStorage.removeItem('bookmarks');
            setBookmarks([]);
            window.dispatchEvent(new Event('bookmarksUpdated'));
        }
    };

    const filteredBookmarks = bookmarks.filter(item => {
        if (filter === 'all') return true;
        const isAnime = item.source === 'samehadaku' || item.category === 'anime';
        return filter === 'anime' ? isAnime : !isAnime;
    });

    return (
        <div className="min-h-screen bg-dark-bg pb-20">
            {/* Header */}
            <header className="sticky top-0 z-40 glass border-b border-dark-border">
                <div className="px-4 h-14 flex items-center justify-between">
                    <div>
                        <h1 className="text-lg font-bold text-white">My List</h1>
                        {/* <p className="text-xs text-gray-500">{bookmarks.length} saved</p> */}
                    </div>
                    {bookmarks.length > 0 && (
                        <button
                            onClick={clearAll}
                            className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                            title="Clear all"
                        >
                            <Trash2 size={20} />
                        </button>
                    )}
                </div>

                {/* Filter Tabs */}
                <div className="px-4 pb-3 flex gap-2">
                    {[
                        { id: 'all', label: 'All' },
                        { id: 'anime', label: 'Anime' },
                        { id: 'donghua', label: 'Donghua' }
                    ].map((f) => (
                        <button
                            key={f.id}
                            onClick={() => setFilter(f.id)}
                            className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${filter === f.id
                                    ? 'bg-primary-400 text-black'
                                    : 'bg-dark-surface text-gray-400 border border-dark-border hover:border-primary-400/50'
                                }`}
                        >
                            {f.label}
                        </button>
                    ))}
                </div>
            </header>

            {/* Content */}
            <div className="p-4">
                {filteredBookmarks.length === 0 ? (
                    <div className="text-center py-12">
                        <BookmarkX size={48} className="text-gray-600 mx-auto mb-4" />
                        <p className="text-gray-500 mb-2">
                            {bookmarks.length === 0 ? 'Your list is empty' : 'No items in this filter'}
                        </p>
                        <p className="text-xs text-gray-600">
                            {bookmarks.length === 0 ? 'Bookmark anime to see them here' : 'Try a different filter'}
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-6 gap-2">
                        {filteredBookmarks.map((item, index) => {
                            const isAnime = item.source === 'samehadaku' || item.category === 'anime';

                            return (
                                <div
                                    key={item.url}
                                    className="group relative"
                                    style={{ animationDelay: `${index * 50}ms` }}
                                >
                                    {/* Card */}
                                    <div
                                        onClick={() => onAnimeSelect(item)}
                                        className="cursor-pointer"
                                    >
                                        <div className="relative aspect-[3/4] rounded-[7px] overflow-hidden mb-2 bg-dark-card">
                                            <img
                                                src={item.image || item.detailData?.image}
                                                alt={item.title}
                                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                            />

                                            {/* Hover Overlay */}
                                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                                <button className="p-3 bg-primary-400 rounded-full text-black hover:scale-110 transition-transform">
                                                    <Play size={20} fill="currentColor" />
                                                </button>
                                            </div>

                                            {/* Type Badge */}
                                            <div className="absolute top-2 left-2">
                                                <span className={`px-2 py-0.5 text-[10px] font-bold rounded ${isAnime ? 'bg-blue-500 text-white' : 'bg-red-500 text-white'
                                                    }`}>
                                                    {isAnime ? 'ANIME' : 'DONGHUA'}
                                                </span>
                                            </div>

                                            {/* Remove Button */}
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    removeBookmark(item.url);
                                                }}
                                                className="absolute top-2 right-2 p-1.5 bg-black/50 rounded-lg text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500/80"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>

                                        <h3 className="text-sm font-medium text-white line-clamp-2 group-hover:text-primary-300 transition-colors">
                                            {item.title}
                                        </h3>

                                        <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                                            <Calendar size={12} />
                                            <span>{new Date(item.addedAt).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyListPage;