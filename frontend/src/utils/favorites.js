// Utility to manage user favorites locally with event broadcasting

const FAVORITES_KEY = 'autoria_favorites';

export const getFavorites = () => {
  try {
    const saved = localStorage.getItem(FAVORITES_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch (e) {
    console.error('Error reading favorites:', e);
    return [];
  }
};

export const isFavorite = (carId) => {
  if (!carId) return false;
  const list = getFavorites();
  return list.some(item => (typeof item === 'string' ? item === carId : item?._id === carId));
};

export const toggleFavorite = (car) => {
  if (!car) return false;
  const carId = typeof car === 'string' ? car : car._id;
  let list = getFavorites();
  const exists = list.some(item => (typeof item === 'string' ? item === carId : item?._id === carId));

  if (exists) {
    list = list.filter(item => (typeof item === 'string' ? item !== carId : item?._id !== carId));
  } else {
    list.push(car);
  }

  try {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(list));
    window.dispatchEvent(new CustomEvent('autoria_favorites_updated', { detail: { list } }));
  } catch (e) {
    console.error('Error saving favorites:', e);
  }

  return !exists;
};
