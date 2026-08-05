const lkrFormatter = new Intl.NumberFormat('en-LK', {
    style: 'currency',
    currency: 'LKR',
    maximumFractionDigits: 0
});

export const formatLKR = (value) => lkrFormatter.format(Number(value || 0));
