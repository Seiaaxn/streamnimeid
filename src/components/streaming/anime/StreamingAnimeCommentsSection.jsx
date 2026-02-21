// StreamingAnimeCommentsSection.jsx - localStorage-based comments
import { useState, useEffect, useRef } from 'react';
import { Heart, Send, Trash2, ChevronDown, ChevronUp, MessageCircle, LogIn } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import {
  getComments, addComment,
  toggleLikeCommentLocal, deleteCommentFromContent
} from '../../../firebase/commentService';
import { Link } from 'react-router-dom';

const timeAgo = (ts) => {
  if (!ts) return '';
  const date = new Date(ts);
  const diff = (Date.now() - date.getTime()) / 1000;
  if (diff < 60) return 'Baru saja';
  if (diff < 3600) return `${Math.floor(diff / 60)}m lalu`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}j lalu`;
  return `${Math.floor(diff / 86400)}h lalu`;
};

const Avatar = ({ user, size = 8 }) => {
  const s = `w-${size} h-${size}`;
  if (user?.photoURL) {
    return <img src={user.photoURL} alt="" className={`${s} rounded-full object-cover flex-shrink-0`} />;
  }
  const initial = (user?.username || user?.displayName || '?')[0].toUpperCase();
  return (
    <div className={`${s} rounded-full bg-gradient-to-br from-primary-400 to-primary-300 flex items-center justify-center flex-shrink-0 text-black font-bold text-xs`}>
      {initial}
    </div>
  );
};

const StreamingAnimeCommentsSection = ({ contentId }) => {
  const { user, firebaseUser } = useAuth();
  const [comments, setComments] = useState([]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [sortNewest, setSortNewest] = useState(true);

  useEffect(() => {
    if (!contentId) return;
    loadComments();
  }, [contentId]);

  const loadComments = async () => {
    setLoading(true);
    const data = await getComments(contentId);
    setComments(data);
    setLoading(false);
  };

  const handleSubmit = async () => {
    if (!text.trim() || !user || submitting) return;
    setSubmitting(true);
    try {
      const userObj = {
        uid: user.uid,
        displayName: user.username || 'Anon',
        photoURL: user.photoURL || null,
        username: user.username,
      };
      await addComment(contentId, userObj, text.trim());
      setText('');
      await loadComments();
    } catch (err) {
      console.error('Error submitting comment:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleLike = (commentId) => {
    if (!user) return;
    toggleLikeCommentLocal(contentId, commentId, user.uid);
    setComments(prev => prev.map(c => {
      if (c.id !== commentId) return c;
      const hasLiked = (c.likedBy || []).includes(user.uid);
      return {
        ...c,
        likes: (c.likes || 0) + (hasLiked ? -1 : 1),
        likedBy: hasLiked
          ? c.likedBy.filter(id => id !== user.uid)
          : [...(c.likedBy || []), user.uid],
      };
    }));
  };

  const handleDelete = (commentId) => {
    if (!user) return;
    if (!window.confirm('Hapus komentar ini?')) return;
    deleteCommentFromContent(contentId, commentId, user.uid);
    setComments(prev => prev.filter(c => c.id !== commentId));
  };

  const sorted = [...comments].sort((a, b) => {
    const ta = new Date(a.createdAt || 0).getTime();
    const tb = new Date(b.createdAt || 0).getTime();
    return sortNewest ? tb - ta : ta - tb;
  });

  return (
    <div className="mt-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <MessageCircle size={16} className="text-primary-400" />
          <h3 className="text-sm font-bold text-white">Komentar</h3>
          <span className="text-xs text-gray-600 bg-dark-card px-2 py-0.5 rounded-full">{comments.length}</span>
        </div>
        <button
          onClick={() => setSortNewest(!sortNewest)}
          className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-300 transition-colors"
        >
          {sortNewest ? <ChevronDown size={13} /> : <ChevronUp size={13} />}
          {sortNewest ? 'Terbaru' : 'Terlama'}
        </button>
      </div>

      {/* Input */}
      {user ? (
        <div className="flex gap-2.5 mb-5">
          <Avatar user={user} size={8} />
          <div className="flex-1 flex items-center gap-2 bg-dark-card border border-dark-border rounded-2xl px-3 py-2">
            <input
              type="text"
              value={text}
              onChange={e => setText(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleSubmit()}
              placeholder="Tulis komentar..."
              className="flex-1 bg-transparent text-sm text-white placeholder:text-gray-700 outline-none"
              maxLength={300}
            />
            <button
              onClick={handleSubmit}
              disabled={!text.trim() || submitting}
              className="w-8 h-8 bg-primary-400 rounded-full flex items-center justify-center flex-shrink-0 disabled:opacity-40 transition-opacity"
            >
              <Send size={14} className="text-black" />
            </button>
          </div>
        </div>
      ) : (
        <Link
          to="/login"
          className="flex items-center justify-center gap-2 mb-5 py-2.5 bg-dark-card border border-dark-border rounded-2xl text-sm text-gray-400 hover:text-white hover:border-primary-400/40 transition-colors"
        >
          <LogIn size={15} />
          Login untuk berkomentar
        </Link>
      )}

      {/* Comments list */}
      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-dark-card animate-pulse flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-3 w-24 bg-dark-card rounded animate-pulse" />
                <div className="h-3 w-full bg-dark-card rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      ) : sorted.length === 0 ? (
        <div className="text-center py-8 text-gray-600">
          <MessageCircle size={28} className="mx-auto mb-2 opacity-30" />
          <p className="text-sm">Belum ada komentar. Jadilah yang pertama!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {sorted.map(comment => {
            const isLiked = (comment.likedBy || []).includes(user?.uid);
            const isOwner = comment.uid === user?.uid;
            return (
              <div key={comment.id} className="flex gap-3 group">
                <div className="flex-shrink-0">
                  <Avatar user={{ photoURL: comment.photoURL, username: comment.username }} size={8} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="bg-dark-card rounded-2xl rounded-tl-sm px-3 py-2.5">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-semibold text-white truncate">{comment.username}</span>
                      <span className="text-[10px] text-gray-600 flex-shrink-0">{timeAgo(comment.createdAt)}</span>
                    </div>
                    <p className="text-sm text-gray-300 leading-relaxed break-words">{comment.text}</p>
                  </div>
                  <div className="flex items-center gap-3 mt-1.5 px-1">
                    <button
                      onClick={() => handleLike(comment.id)}
                      className={`flex items-center gap-1 text-[11px] transition-colors ${isLiked ? 'text-red-400' : 'text-gray-600 hover:text-gray-400'}`}
                    >
                      <Heart size={12} className={isLiked ? 'fill-red-400' : ''} />
                      {comment.likes > 0 && <span>{comment.likes}</span>}
                    </button>
                    {isOwner && (
                      <button
                        onClick={() => handleDelete(comment.id)}
                        className="text-[11px] text-gray-700 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 size={11} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default StreamingAnimeCommentsSection;
    
