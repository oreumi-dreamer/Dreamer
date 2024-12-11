export const calculateModalPosition = (elementRef, offsetX = 0, offsetY = 0) => {
  if (!elementRef?.current) return null;

  const rect = elementRef.current.getBoundingClientRect();
  const left = Math.max(rect.left + window.scrollX + offsetX, 0);
  const top = Math.max(rect.top + window.scrollY + offsetY, 0); 

  return {
    position: "absolute",
    top: `${top}px`,
    left: `${left}px`,
  };
};