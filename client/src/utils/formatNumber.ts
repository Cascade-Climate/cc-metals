export const formatNumber = (num: number): string => {
  if (num < 1) return num.toFixed(2);
  if (num < 10) return num.toFixed(1);
  return num.toFixed(0);
}; 