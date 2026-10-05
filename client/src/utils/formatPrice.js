export const formatPrice = (amount) => {
  const num = Number(amount) || 0;
  const hasDecimals = num % 1 !== 0;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: hasDecimals ? 2 : 0
  }).format(num);
};
