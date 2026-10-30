import { useEffect } from 'react';

let lockCount = 0;
let prevOverflow = '';
let prevPaddingRight = '';

export const lockScroll = () => {
  if (typeof document === 'undefined') return;

  if (lockCount === 0) {
    if (window.lenis) {
      try {
        window.lenis.stop();
      } catch (err) {
        console.error('Error stopping Lenis:', err);
      }
    }

    prevOverflow = document.body.style.overflow;
    prevPaddingRight = document.body.style.paddingRight;

    // Prevent layout shift if a vertical scrollbar was visible
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    document.body.style.overflow = 'hidden';
    document.body.classList.add('modal-open');
  }
  lockCount++;
};

export const unlockScroll = () => {
  if (typeof document === 'undefined') return;

  lockCount = Math.max(0, lockCount - 1);
  if (lockCount === 0) {
    document.body.style.overflow = prevOverflow || '';
    document.body.style.paddingRight = prevPaddingRight || '';
    document.body.classList.remove('modal-open');

    if (window.lenis) {
      try {
        window.lenis.start();
      } catch (err) {
        console.error('Error starting Lenis:', err);
      }
    }
  }
};

export const useScrollLock = (isLocked = true) => {
  useEffect(() => {
    if (!isLocked) return;
    lockScroll();
    return () => {
      unlockScroll();
    };
  }, [isLocked]);
};
