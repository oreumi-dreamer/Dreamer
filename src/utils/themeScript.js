export const themeScript = () => {
  return {
    __html: `(function() {
      try {
        const storedTheme = localStorage.getItem('userTheme');
        const getSystemTheme = () => window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        
        if (storedTheme) {
          const appliedTheme = storedTheme === 'device' ? getSystemTheme() : storedTheme;
          document.documentElement.setAttribute('data-theme', appliedTheme);
        } else {
          const systemTheme = getSystemTheme();
          document.documentElement.setAttribute('data-theme', systemTheme);
        }
      } catch (e) {
        console.error('Theme initialization error:', e);
      }
    })()`,
  };
};
