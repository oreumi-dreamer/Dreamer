export const calculateModalPosition = (
  elementRef,
  offsetX = 0,
  offsetY = 0
) => {
  if (!elementRef?.current) return null;

  const rect = elementRef.current.getBoundingClientRect();
  const left = Math.max(rect.left + offsetX, 0);
  const top = Math.max(rect.top + offsetY, 0);

  return {
    position: "absolute",
    top: `${top}px`,
    left: `${left}px`,
    zIndex: "10",
  };
};

export const calculateMobileModalPosition = (
  elementRef,
  offsetX = 0,
  offsetY = 0
) => {
  if (!elementRef?.current) return null;

  return {
    position: "absolute",
    top: `${offsetY}px`,
    right: `${offsetX}px`,
    zIndex: "10",
  };
};
