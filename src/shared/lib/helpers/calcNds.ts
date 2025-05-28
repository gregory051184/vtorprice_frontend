export const calcNds = ({
  itemPrice,
  totalVolume,
  nds
}: {
  itemPrice: number, totalVolume: number, nds:number
}) => (itemPrice * totalVolume) * (nds / 100);
