export const validateUrlInput = (url) => {
    const urlPattern = new RegExp('https?://');
    return urlPattern.test(url);
  };
  