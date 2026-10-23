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

/**
 * Convert any image file (PNG, JPG, BMP, etc.) to optimized WebP format
 * in the browser before upload, drastically reducing file size and accelerating page load.
 * 
 * @param {File} file - Original image file
 * @param {object} options - Quality, maxWidth, maxHeight
 * @returns {Promise<File>} - Optimized WebP file
 */
export const convertImageToWebP = (file, options = {}) => {
  const {
    quality = 0.85,
    maxWidth = 1920,
    maxHeight = 1200
  } = options;

  return new Promise((resolve) => {
    // If not a file or browser doesn't support canvas, fallback safely
    if (!file || !(file instanceof Blob) || typeof window === 'undefined' || !window.FileReader || !window.HTMLCanvasElement) {
      return resolve(file);
    }

    // If already webp and reasonably sized (< 1.5MB), don't re-encode
    if (file.type === 'image/webp' && file.size < 1.5 * 1024 * 1024) {
      return resolve(file);
    }

    const reader = new FileReader();
    reader.onerror = () => resolve(file); // Fallback to original file on read error
    reader.onload = (e) => {
      const img = new Image();
      img.onerror = () => resolve(file); // Fallback to original file on decode error
      img.onload = () => {
        try {
          let { width, height } = img;

          // Scale down proportionally if larger than maximum bounds
          if (width > maxWidth || height > maxHeight) {
            if (width / height > maxWidth / maxHeight) {
              height = Math.round((height * maxWidth) / width);
              width = maxWidth;
            } else {
              width = Math.round((width * maxHeight) / height);
              height = maxHeight;
            }
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          if (!ctx) return resolve(file);

          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          ctx.drawImage(img, 0, 0, width, height);

          // Convert to WebP blob
          canvas.toBlob(
            (blob) => {
              if (!blob) {
                return resolve(file);
              }

              // Replace extension with .webp
              const originalName = file.name || 'car-image.jpg';
              const baseName = originalName.replace(/\.[^/.]+$/, '');
              const webpFileName = `${baseName}.webp`;

              const webpFile = new File([blob], webpFileName, {
                type: 'image/webp',
                lastModified: Date.now()
              });

              console.log(
                `[ImageOptimizer] Converted "${originalName}" (${(file.size / 1024).toFixed(1)} KB) -> "${webpFileName}" (${(webpFile.size / 1024).toFixed(1)} KB WebP)`
              );

              resolve(webpFile);
            },
            'image/webp',
            quality
          );
        } catch (err) {
          console.warn('[ImageOptimizer] Conversion fallback to original:', err);
          resolve(file);
        }
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
};
