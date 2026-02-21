// src/components/streaming/anime/StreamingAnimeCommentsSection.jsx
import { useState, useMemo, useEffect, useCallback } from 'react';
import { ThumbsUp, Send, ArrowUpDown, Trash2, LogIn } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contex/AuthContext';

// ── localStorage fallback ─────────────────────────────────────────────────────
const LOCAL_KEY = 'snid_comments';

const readLocal = (contentId) => {
  try {
    const all = JSON.parse(localStorage.getItem(LOCAL_KEY) || '{}');
    return (all[contentId] || []).map(c => ({ ...c, createdAt: new Date(c.createdAt) }));
  } catch { return []; }
};

const writeLocal = (contentId, list) => {
  try {
    const all = JSON.parse(localStorage.getItem(LOCAL_KEY) || '{}');
    all[contentId] = list.map(c => ({
      ...c,
      createdAt: c.createdAt instanceof Date ? c.createdAt.toISOString() : c.createdAt,
    }));
    localStorage.setItem(LOCAL_KEY, JSON.stringify(all));
  } catch {}
};

// ── helpers ───────────────────────────────────────────────────────────────────
const timeAgo = (date) => {
  if (!date) return '';
  const d = date instanceof Date ? date : new Date(date);
  const diff = Date.now() - d.getTime();
  if (isNaN(diff)) return '';
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'Baru saja';
  if (m < 60) return `${m}m lalu`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}j lalu`;
  return `${Math.floor(h / 24)}h lalu`;
};

const getInitial = (name) => (name || '?').charAt(0).toUpperCase();

// ── Main Component ─────────────────────────────────────────────────────────────
const StreamingAnimeCommentsSection = ({ contentId }) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [sortNewest, setSortNewest] = useState(true);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // ── try to import firebase comment service ────────────────────────────────
  const getFirebaseService = async () => {
    try {
      const mod = await import('../../../firebase/commentService.js');
      return mod;
    } catch {
      return null;
    }
  };

  // ── load ──────────────────────────────────────────────────────────────────
  const loadComments = useCallback(async () => {
    if (!contentId) { setLoading(false); return; }
    setLoading(true);
    try {
      const svc = await getFirebaseService();
      if (svc) {
        const data = await svc.getComments(contentId);
        setComments(data.map(c => ({
          ...c,
          createdAt: c.createdAt?.toDate ? c.createdAt.toDate() : new Date(c.createdAt || Date.now()),
        })));
      } else {
        setComments(readLocal(contentId));
      }
    } catch {
      setComments(readLocal(contentId));
    } finally {
      setLoading(false);
    }
  }, [contentId]);

  useEffect(() => { loadComments(); }, [loadComments]);

  // ── add ───────────────────────────────────────────────────────────────────
  const handleAddComment = async () => {
    if (!newComment.trim() || !user || submitting) return;
    setSubmitting(true);
    const commentUser = {
      uid: user.uid,
      displayName: user.username || user.displayName || 'Anon',
      photoURL: user.photoURL || null,
    };
    try {
      const svc = await getFirebaseService();
      if (svc) {
        await svc.addComment(contentId, commentUser, newComment.trim());
        await loadComments();
      } else {
        const c = {
          id: Date.now().toString(),
          uid: user.uid,
          username: commentUser.displayName,
          photoURL: commentUser.photoURL,
          text: newComment.trim(),
          likes: 0,
          likedBy: [],
          createdAt: new Date(),
        };
        const updated = [c, ...readLocal(contentId)];
        writeLocal(contentId, updated);
        setComments(updated);
      }
      setNewComment('');
    } catch (e) {
      console.error('Error adding comment:', e);
    } finally {
      setSubmitting(false);
    }
  };

  // ── like ──────────────────────────────────────────────────────────────────
  const handleLike = async (commentId) => {
    if (!user) return;
    try {
      const svc = await getFirebaseService();
      if (svc) {
        await svc.toggleLikeComment(commentId, user.uid);
        await loadComments();
      } else {
        const list = readLocal(contentId).map(c => {
          if (c.id !== commentId) return c;
          const liked = (c.likedBy || []).includes(user.uid);
          return {
            ...c,
            likes: liked ? c.likes - 1 : c.likes + 1,
            likedBy: liked
              ? c.likedBy.filter(id => id !== user.uid)
              : [...(c.likedBy || []), user.uid],
          };
        });
        writeLocal(contentId, list);
        setComments(list.map(c => ({ ...c, createdAt: new Date(c.createdAt) })));
      }
    } catch (e) { console.error(e); }
  };

  // ── delete ────────────────────────────────────────────────────────────────
  const handleDelete = async (commentId) => {
    if (!user) return;
    try {
      const svc = await getFirebaseService();
      if (svc) {
        await svc.deleteComment(commentId, user.uid);
        setComments(prev => prev.filter(c => c.id !== commentId));
      } else {
        const list = readLocal(contentId).filter(c => c.id !== commentId);
        writeLocal(contentId, list);
        setComments(list.map(c => ({ ...c, createdAt: new Date(c.createdAt) })));
      }
    } catch (e) { console.error(e); }
  };

  const sorted = useMemo(() =>
    [...comments].sort((a, b) =>
      sortNewest
        ? new Date(b.createdAt) - new Date(a.createdAt)
        : new Date(a.createdAt) - new Date(b.createdAt)
    ), [comments, sortNewest]);

  // ── render ────────────────────────────────────────────────────────────────
  return (
    <div className="mb-10 px-2">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-white">Komentar ({comments.length})</h3>
        <button
          onClick={() => setSortNewest(p => !p)}
          className="text-gray-400 hover:text-white transition"
          title={sortNewest ? 'Terbaru' : 'Terlama'}
        >
          <ArrowUpDown size={16} className={`transition-transform duration-300 ${!sortNewest ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {/* Input */}
      {user ? (
        <div className="mb-6 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full overflow-hidden bg-primary-400/20 flex-none flex items-center justify-center">
            {user.photoURL
              ? <img src={user.photoURL} alt="avatar" className="w-full h-full object-cover" />
              : <span className="text-xs font-bold text-primary-400">{getInitial(user.username)}</span>
            }
          </div>
          <div className="flex-1 flex items-center gap-2 bg-dark-surface border border-dark-border rounded-full px-4 py-2">
            <input
              value={newComment}
              onChange={e => setNewComment(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleAddComment()}
              placeholder={`Komentar sebagai ${user.username}...`}
              className="flex-1 bg-transparent text-sm text-white placeholder-gray-500 outline-none"
            />
            <button
              onClick={handleAddComment}
              disabled={!newComment.trim() || submitting}
              className="p-1.5 rounded-full bg-primary-400 text-black hover:opacity-90 transition disabled:opacity-40"
            >
              {submitting
                ? <div className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                : <Send size={14} />
              }
            </button>
          </div>
        </div>
      ) : (
        <div className="mb-6 flex items-center gap-3 bg-dark-surface border border-dark-border rounded-2xl px-4 py-3">
          <p className="flex-1 text-sm text-gray-500">Login untuk berkomentar</p>
          <button
            onClick={() => navigate('/login')}
            className="flex items-center gap-1.5 text-primary-400 text-sm font-medium"
          >
            <LogIn size={15} />
            Login
          </button>
        </div>
      )}

      {/* List */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="flex gap-3">
              <div className="w-9 h-9 rounded-full bg-dark-card animate-pulse flex-none" />
              <div className="flex-1 space-y-2">
                <div className="h-3 w-24 bg-dark-card rounded animate-pulse" />
                <div className="h-3 w-full bg-dark-card rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      ) : sorted.length === 0 ? (
        <p className="text-center text-gray-600 text-sm py-8">Belum ada komentar. Jadilah yang pertama!</p>
      ) : (
        <div className="space-y-6">
          {sorted.map(c => {
            const isOwner = user?.uid === c.uid;
            const hasLiked = (c.likedBy || []).includes(user?.uid);
            return (
              <div key={c.id} className="flex gap-3">
                <div className="w-9 h-9 rounded-full overflow-hidden bg-primary-400/20 flex-none flex items-center justify-center">
                  {c.photoURL
                    ? <img src={c.photoURL} alt={c.username} className="w-full h-full object-cover" onError={e => { e.target.style.display = 'none'; }} />
                    : <span className="text-sm font-bold text-primary-400">{getInitial(c.username)}</span>
                  }
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <p className="text-sm font-semibold text-white truncate">{c.username}</p>
                      <span className="text-xs text-gray-500 flex-none">{timeAgo(c.createdAt)}</span>
                    </div>
                    {isOwner && (
                      <button onClick={() => handleDelete(c.id)} className="text-gray-600 hover:text-red-400 transition flex-none">
                        <Trash2 size={13} />
                      </button>
                    )}
                  </div>
                  <p className="text-sm text-gray-300 mt-1 break-words">{c.text}</p>
                  <button
                    onClick={() => handleLike(c.id)}
                    className={`flex items-center gap-1 text-xs mt-2 transition ${hasLiked ? 'text-primary-400' : 'text-gray-500 hover:text-primary-400'}`}
                  >
                    <ThumbsUp size={13} fill={hasLiked ? 'currentColor' : 'none'} />
                    {c.likes || 0}
                  </button>
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
              
