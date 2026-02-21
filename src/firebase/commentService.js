// Comments service menggunakan localStorage (tidak pakai Firebase)
const getKey = (contentId) => `snid_comments_${contentId}`;

export const getComments = async (contentId) => {
  try {
    return JSON.parse(localStorage.getItem(getKey(contentId)) || '[]');
  } catch {
    return [];
  }
};

export const addComment = async (contentId, user, text) => {
  if (!text.trim() || !user?.uid) return null;
  try {
    const comments = JSON.parse(localStorage.getItem(getKey(contentId)) || '[]');
    const newComment = {
      id: 'c_' + Date.now() + '_' + Math.random().toString(36).slice(2, 7),
      contentId,
      uid: user.uid,
      username: user.displayName || user.username || 'Anon',
      photoURL: user.photoURL || null,
      text: text.trim(),
      likes: 0,
      likedBy: [],
      createdAt: new Date().toISOString(),
    };
    const updated = [newComment, ...comments];
    localStorage.setItem(getKey(contentId), JSON.stringify(updated));
    return newComment.id;
  } catch (err) {
    console.error('Error adding comment:', err);
    return null;
  }
};

export const toggleLikeComment = async (commentId, uid) => {
  // Will be handled optimistically in the component
};

export const deleteComment = async (commentId, uid) => {
  // Find and delete from all content keys - handled in component
};

export const deleteCommentFromContent = (contentId, commentId, uid) => {
  try {
    const comments = JSON.parse(localStorage.getItem(getKey(contentId)) || '[]');
    const updated = comments.filter(c => !(c.id === commentId && c.uid === uid));
    localStorage.setItem(getKey(contentId), JSON.stringify(updated));
  } catch (err) {
    console.error('Error deleting comment:', err);
  }
};

export const toggleLikeCommentLocal = (contentId, commentId, uid) => {
  try {
    const comments = JSON.parse(localStorage.getItem(getKey(contentId)) || '[]');
    const updated = comments.map(c => {
      if (c.id !== commentId) return c;
      const hasLiked = (c.likedBy || []).includes(uid);
      return {
        ...c,
        likes: (c.likes || 0) + (hasLiked ? -1 : 1),
        likedBy: hasLiked ? c.likedBy.filter(id => id !== uid) : [...(c.likedBy || []), uid],
      };
    });
    localStorage.setItem(getKey(contentId), JSON.stringify(updated));
    return updated.find(c => c.id === commentId);
  } catch {
    return null;
  }
};
  
