'use client';

import { useState, useEffect } from 'react';

export function useKeyboardSpacer() {
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    const handleResize = () => {
      const viewportHeight = window.visualViewport?.height || window.innerHeight;
      const windowHeight = window.innerHeight;
      const height = windowHeight - viewportHeight;

      setKeyboardHeight(height > 0 ? height : 0);
    };

    // 监听视觉视口变化
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', handleResize);
    } else {
      window.addEventListener('resize', handleResize);
    }

    // 监听焦点事件
    const handleFocusIn = () => {
      setTimeout(handleResize, 100);
    };

    const handleFocusOut = () => {
      setTimeout(handleResize, 100);
    };

    document.addEventListener('focusin', handleFocusIn);
    document.addEventListener('focusout', handleFocusOut);

    // 初始检查
    handleResize();

    return () => {
      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', handleResize);
      } else {
        window.removeEventListener('resize', handleResize);
      }
      document.removeEventListener('focusin', handleFocusIn);
      document.removeEventListener('focusout', handleFocusOut);
    };
  }, []);

  return {
    keyboardHeight,
    style: {
      marginBottom: `${keyboardHeight}px`,
    },
  };
}