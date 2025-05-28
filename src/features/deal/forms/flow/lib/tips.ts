import { DealStatus } from '@box/entities/deal/model';

export const tips: Record<DealStatus, Array<string>> = {
  [DealStatus.NEW]: [],
  [DealStatus.AGREEMENT]: ['Не забудьте отправить договор–заявку на транспорт'],
  [DealStatus.LOGIST_ASSIGNMENT]: [],
  [DealStatus.LOADED]: ['Не забудьте отправить: Транспортную накладную УПД, Доверенность на водителя, Фото загрузки, Подтверждающие данные с весов, Покиповку, Документы по оплате'],
  [DealStatus.UNLOADED]: ['Не забудьте отправить подтверждающие данные с весов'],
  [DealStatus.FINAL]: ['Не забудьте отправить подписанный УПД'],
  [DealStatus.CLOSED]: [],
  [DealStatus.ARGUMENT]: [],
  [DealStatus.REJECTED]: []
};
