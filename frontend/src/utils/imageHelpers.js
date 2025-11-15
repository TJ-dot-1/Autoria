/**
 * Get a consistent profile image URL with fallback to avatar
 * @param {object} user - User object with firstName, lastName, profileImage
 * @returns {string} - Valid image URL
 */
export const getProfileImage = (user) => {
  if (!user) {
    return `https://ui-avatars.com/api/?name=Admin+User&background=3B82F6&color=fff`;
  }

  // If user has a profile image, use it
  if (user.profileImage && user.profileImage.trim()) {
    // Handle Cloudinary URLs and other absolute URLs
    if (user.profileImage.startsWith('http://') || user.profileImage.startsWith('https://')) {
      return user.profileImage;
    }
    // Handle relative paths
    if (user.profileImage.startsWith('/')) {
      return `http://localhost:5000${user.profileImage}`;
    }
  }

  // Fallback to avatar with user initials
  const firstName = user.firstName || 'Admin';
  const lastName = user.lastName || 'User';
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(firstName)}+${encodeURIComponent(lastName)}&background=3B82F6&color=fff`;
};

/**
 * Get user initials for fallback display
 * @param {object} user - User object with firstName, lastName
 * @returns {string} - User initials (e.g., "JA" for John Admin)
 */
export const getUserInitials = (user) => {
  if (!user) return 'AU';
  
  const first = user.firstName?.[0]?.toUpperCase() || 'A';
  const last = user.lastName?.[0]?.toUpperCase() || 'U';
  
  return `${first}${last}`;
};

/**
 * Get full name from user object
 * @param {object} user - User object with firstName, lastName
 * @returns {string} - Full name or fallback
 */
export const getFullName = (user) => {
  if (!user) return 'Administrator';
  
  const first = user.firstName || 'Admin';
  const last = user.lastName || 'User';
  
  return `${first} ${last}`.trim();
};
