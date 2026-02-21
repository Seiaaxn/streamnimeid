import { useState, useMemo, useEffect } from "react";
import { ThumbsUp, Send, ArrowUpDown } from "lucide-react";
import commentsData from "../../../data/comments.json";

const StreamingAnimeCommentsSection = () => {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [sortNewest, setSortNewest] = useState(true);

    // Shuffle
    const shuffleArray = (array) => {
        return [...array].sort(() => Math.random() - 0.5);
    };

    // Load & randomize comments
    useEffect(() => {
        const shuffled = shuffleArray(commentsData);

        const min = 3;
        const max = shuffled.length;
        const randomCount =
            Math.floor(Math.random() * (max - min + 1)) + min;

        const selected = shuffled.slice(0, randomCount);

        const formatted = selected.map((c) => ({
            ...c,
            createdAt: new Date(
                c.createdAt.endsWith("Z")
                    ? c.createdAt
                    : c.createdAt + "Z"
            )
        }));

        setComments(formatted);
    }, []);

    // Time Ago (accept Date object)
    const timeAgo = (date) => {
        const diff = Date.now() - date.getTime();

        if (isNaN(diff)) return "Unknown";

        const minutes = Math.floor(diff / 60000);
        if (minutes < 1) return "Just now";
        if (minutes < 60) return `${minutes}m ago`;

        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours}h ago`;

        const days = Math.floor(hours / 24);
        return `${days}d ago`;
    };

    const sortedComments = useMemo(() => {
        return [...comments].sort((a, b) =>
            sortNewest
                ? b.createdAt - a.createdAt
                : a.createdAt - b.createdAt
        );
    }, [comments, sortNewest]);

    const handleAddComment = () => {
        if (!newComment.trim()) return;

        const comment = {
            id: Date.now(),
            name: "You",
            comment: newComment,
            createdAt: new Date(),
            likes: 0
        };

        setComments((prev) => [comment, ...prev]);
        setNewComment("");
    };

    const handleLike = (id) => {
        setComments((prev) =>
            prev.map((c) =>
                c.id === id ? { ...c, likes: c.likes + 1 } : c
            )
        );
    };

    const getInitial = (name) =>
        name?.charAt(0).toUpperCase();

    return (
        <div className="mb-10 px-2">

            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-white">
                    Comments ({comments.length})
                </h3>

                <button
                    onClick={() => setSortNewest(!sortNewest)}
                    className="text-gray-400 hover:text-white transition"
                >
                    <ArrowUpDown
                        size={16}
                        className={`transition-transform duration-300 ${sortNewest ? "rotate-0" : "rotate-180"
                            }`}
                    />
                </button>
            </div>

            {/* Input */}
            <div className="mb-6 flex items-center gap-3 bg-dark-surface border border-dark-border rounded-full px-4 py-2">
                <input
                    value={newComment}
                    onChange={(e) =>
                        setNewComment(e.target.value)
                    }
                    placeholder="Write a comment..."
                    className="flex-1 bg-transparent text-sm text-white placeholder-gray-500 outline-none"
                />
                <button
                    onClick={handleAddComment}
                    className="p-2 rounded-full bg-primary-400 text-black hover:opacity-90 transition"
                >
                    <Send size={16} />
                </button>
            </div>

            {/* Comments */}
            <div className="space-y-6">
                {sortedComments.map((c) => (
                    <div key={c.id} className="flex gap-3">
                        {/* Avatar */}
                        <div className="w-9 h-9 rounded-full bg-primary-400/20 flex items-center justify-center text-sm font-bold text-primary-400">
                            {getInitial(c.name)}
                        </div>

                        {/* Content */}
                        <div className="flex-1">
                            <div className="flex items-center gap-2">
                                <p className="text-sm font-medium text-white">
                                    {c.name}
                                </p>
                                <span className="text-xs text-gray-500">
                                    {timeAgo(c.createdAt)}
                                </span>
                            </div>

                            <p className="text-sm text-gray-300 mt-1">
                                {c.comment}
                            </p>

                            <div className="flex items-center gap-4 mt-2">
                                <button
                                    onClick={() =>
                                        handleLike(c.id)
                                    }
                                    className="flex items-center gap-1 text-xs text-gray-400 hover:text-primary-400 transition"
                                >
                                    <ThumbsUp size={14} />
                                    {c.likes}
                                </button>

                                <button className="text-xs text-gray-400 hover:text-white transition">
                                    Reply
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default StreamingAnimeCommentsSection;
