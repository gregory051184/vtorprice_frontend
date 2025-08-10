import { applicationModel } from '@box/entities/application';

export const useLastSaleInfo = (lastSale:
applicationModel.IRecyclableApplication | undefined, prevSale:
applicationModel.IRecyclableApplication | undefined) => {
  if (!lastSale) {
    return null;
  }
  if (lastSale && !prevSale) {
    return {
      price: lastSale.price,
      direction: 'grow',
      percentage: 100
    };
  }
  if (lastSale && prevSale) {
    return {
      price: lastSale.price,
      direction: prevSale.price < lastSale.price ? 'grow' : 'drop',
      //percentage: (1 - prevSale.price / lastSale.price) * 100
      percentage: (lastSale.price - prevSale.price) / prevSale.price * 100
    };
  }
};
