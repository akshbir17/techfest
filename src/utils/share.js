/**
 * Spectrum 1.0 Share Utility
 * Handles native mobile sharing via Web Share API with graceful fallback to ShareModal
 */

export const FEST_SHARE_CONFIG = {
  title: 'SPECTRUM 1.0 | GNDEC Bidar',
  text: '🚀 Join SPECTRUM 1.0 — National Level Technical & Cultural Fest at Guru Nanak Dev Engineering College, Bidar! 24-Hour Hackathon (₹40,000 Prize Pool), Esports, TechQuiz & more. Register now:',
  url: 'https://spectrum10.vercel.app',
};

export const triggerShare = async (overrideData = {}) => {
  const shareData = {
    ...FEST_SHARE_CONFIG,
    ...overrideData,
    url: overrideData.url || (typeof window !== 'undefined' ? window.location.origin : FEST_SHARE_CONFIG.url),
  };

  // If on mobile device and Web Share API is available, invoke native share sheet directly
  const isMobile = typeof navigator !== 'undefined' && /mobile|android|iphone|ipad/i.test(navigator.userAgent || '');
  if (isMobile && typeof navigator.share === 'function') {
    try {
      await navigator.share(shareData);
      return;
    } catch (err) {
      // AbortError means user simply dismissed the sheet; don't open modal
      if (err?.name === 'AbortError') {
        return;
      }
    }
  }

  // Open custom Cyberpunk ShareModal
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('open-share-modal', { detail: shareData }));
  }
};
