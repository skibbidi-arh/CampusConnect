// Get or create a unique anonymous user ID
export const getAnonymousUserId = () => {
    const STORAGE_KEY = 'anonymous_user_id';
    let userId = localStorage.getItem(STORAGE_KEY);
    
    if (!userId) {
        // Generate a unique ID using timestamp and random string
        userId = `anon_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        localStorage.setItem(STORAGE_KEY, userId);
    }
    
    return userId;
};
