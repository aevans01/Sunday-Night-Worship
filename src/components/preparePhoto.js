export const MAX_SOURCE_BYTES = 25 * 1024 * 1024;
export function isPhoto(file) {
  return /^image\/(jpeg|png|webp|heic|heif|heic-sequence|heif-sequence)$/i.test(file.type) || ((!file.type || file.type === 'application/octet-stream') && /\.(jpe?g|png|webp|heic|heif)$/i.test(file.name));
}
function loadPhoto(blob) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(blob), image = new Image();
    const cleanup = () => {URL.revokeObjectURL(url); image.onload = null; image.onerror = null;};
    image.onload = () => {cleanup(); resolve(image);};
    image.onerror = () => {cleanup(); reject(new Error('This photo could not be opened.'));};
    image.src = url;
  });
}
export async function preparePhoto(file) {
  if (!isPhoto(file)) throw new Error('Choose a JPG, PNG, WebP, or supported phone photo.');
  if (file.size > MAX_SOURCE_BYTES) throw new Error('Choose photos smaller than 25 MB each.');
  let image, canvas;
  try {
    try {
      image = await loadPhoto(file);
    } catch (nativeError) {
      if (!/\.(heic|heif)$/i.test(file.name) && !/^image\/hei[cf]/i.test(file.type)) throw nativeError;
      try {
        const {heicTo} = await import('heic-to/csp');
        const converted = await heicTo({blob: file, type: 'image/jpeg', quality: 0.9});
        image = await loadPhoto(converted);
      } catch (conversionError) {
        throw new Error('This HEIC photo could not be converted. Try selecting it again from Photos, or choose another photo.');
      }
    }
    const width = image.naturalWidth, height = image.naturalHeight;
    if (!width || !height) throw new Error('This photo could not be read. Try another copy.');
    canvas = document.createElement('canvas');
    const scale = Math.min(1, 1600 / Math.max(width, height));
    canvas.width = Math.max(1, Math.round(width * scale));
    canvas.height = Math.max(1, Math.round(height * scale));
    const context = canvas.getContext('2d');
    if (!context) throw new Error('Your browser could not prepare the photo. Try another browser.');
    context.fillStyle = '#ffffff';
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.drawImage(image, 0, 0, canvas.width, canvas.height);
    for (const quality of [0.86, 0.72, 0.55, 0.4]) {
      const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/jpeg', quality));
      if (blob && blob.type === 'image/jpeg' && blob.size <= 1.5 * 1024 * 1024) {
        return new File([blob], `${file.name.replace(/\.[^.]+$/, '').slice(0, 170) || 'photo'}.jpg`, {type: 'image/jpeg'});
      }
    }
    throw new Error('This photo is still too large after resizing. Choose a smaller copy.');
  } finally {
    if (canvas) {canvas.width = 0; canvas.height = 0;}
  }
}
