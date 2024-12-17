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
