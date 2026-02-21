// History service menggunakan localStorage (tidak pakai Firebase)
const getKey = (uid) => `snid_history_${uid}`;

export const addToFirebaseHistory = (uid, item) => {
  if (!uid) return;
  try {
    const key = getKey(uid);
    const existing = JSON.parse(localStorage.getItem(key) || '[]');
    // Deduplicate by episodeUrl
    const filtered = existing.filter(h => h.episodeUrl !== item.episodeUrl);
    const newItem = {
      ...item,
      id: btoa(item.episodeUrl || item.url || Date.now().toString()).replace(/[^a-zA-Z0-9]/g, '').slice(0, 40),
      watchedAt: new Date().toISOString(),
    };
    // Keep max 100 items, newest first
    const updated = [newItem, ...filtered].slice(0, 100);
    localStorage.setItem(key, JSON.stringify(updated));
  } catch (err) {
    console.error('Error saving history:', err);
  }
};

export const getFirebaseHistory = async (uid) => {
  if (!uid) return [];
  try {
    return JSON.parse(localStorage.getItem(getKey(uid)) || '[]');
  } catch {
    return [];
  }
};

export const removeFromFirebaseHistory = async (uid, docId) => {
  if (!uid) return;
  try {
    const key = getKey(uid);
    const existing = JSON.parse(localStorage.getItem(key) || '[]');
    localStorage.setItem(key, JSON.stringify(existing.filter(h => h.id !== docId)));
  } catch (err) {
    console.error('Error removing history item:', err);
  }
};

export const clearFirebaseHistory = async (uid) => {
  if (!uid) return;
  localStorage.removeItem(getKey(uid));
};
                  
