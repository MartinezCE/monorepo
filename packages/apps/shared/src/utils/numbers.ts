export const addPeriods = (num: number) => num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
export const calculateDiscount = (monthlyPrice: number, monthsAmount: number, percentage: number) => {
  const totalPrice = monthlyPrice * monthsAmount;
  return (totalPrice - totalPrice * percentage).toFixed(2);
};
