export const calculateModalPosition = (elementRef, offsetX = 0, offsetY = 0) => {
    if (!elementRef?.current) return null;
  
    const elementRect = elementRef.current.getBoundingClientRect();
    return {
      position: "absolute",
      top: `${elementRect.top + window.scrollY + offsetY}px`,
      left: `${elementRect.left + window.scrollX + offsetX}px`,
    };
  };
  