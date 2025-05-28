import React, { useRef } from 'react';
import { AppShell, SidebarLayout } from '@box/layouts';
import { Header } from '@box/widgets/header';
import { Footer } from '@box/widgets/footer';
import { useEvent, useStore } from 'effector-react';
import {
  BackButton, Badge, Button, Paper, Rating, Table, Tip
} from '@box/shared/ui';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper';
import { applicationModel } from '@box/entities/application';
import 'swiper/css';
import Location from '@assets/icons/16_location.svg';
import s from './style.module.scss';
import classNames from 'classnames';

export const ApplicationVerificationInfo = () => {
  const application = useStore(applicationModel.$application);
  const paginationRef = useRef<HTMLDivElement | null>(null);
  const updateApplication = useEvent(applicationModel.updateApplicationEvent);
  const percentNDS = 20;
  const includeNDS: number = (application?.totalPrice || 0) * (percentNDS / 100)

  return (
    <AppShell
      header={<Header />}
      footer={<Footer />}
    >
      <SidebarLayout>
        <BackButton className='text-sm'>Вернуться к списку заявок</BackButton>
        {application && (
          <div className="mt-[20px]">
            <h1 className="text-2xl mb-[25px]">{application.recyclables.name}</h1>

            {application.images.length > 0
                && (
                  <div className="shrink-0">
                    <Swiper
                      className="w-full mr-[-50px]"
                      spaceBetween={20}
                      slidesPerView={2.2}
                      pagination={{
                        type: 'bullets',
                        el: paginationRef.current,
                      }}
                      navigation
                      modules={[Pagination]}

                    >
                      {application.images.map((image) => (
                        <SwiperSlide className="w-full rounded-[10px] overflow-hidden">
                          <img className="aspect-[16/9] object-cover" src={image.image} alt="" />
                        </SwiperSlide>
                      ))}
                    </Swiper>
                  </div>
                )}
            <div className={classNames("flex mt-[20px] justify-between items-end", s.companyHolder)}>
              <div className="">
                <p className="text-sm text-grey-40">Компания</p>
                <h2 className="text-base mt-[8px]">{application.company.name}</h2>
                <Rating className="mt-[8px]" rating={application.company.averageReviewRate} total={application.company.dealsCount || 0} />
              </div>
              <div className="flex h-full shrink-0 items-end">
                <div className="flex mt-[10px] gap-[10px] shrink-0">
                  {application.dealType.id === 2 && (
                    <Badge color="red">
                      Продажа
                    </Badge>
                  )}
                  {application.dealType.id === 1 && (
                    <Badge color="green">
                      Покупка
                    </Badge>
                  )}
                  {application.applicationRecyclableStatus.id === 1 && (
                      <Badge color="green">
                        Отходы
                      </Badge>
                  )}
                  {application.applicationRecyclableStatus.id === 2 && (
                      <Badge color="green">
                        Гранула
                      </Badge>
                  )}
                  {application.urgencyType.id === 1 && (
                    <Badge color="green">
                      Готово к отгрузке
                    </Badge>
                  )}
                  {application.urgencyType.id === 2 && (
                    <Badge color="red">
                      Контракт на поставку
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            <div className={classNames('grid grid-cols-2 gap-[30px]', s.tables)}>
              <Paper mode="light" className={classNames("mt-[20px] border-none", s.paper)}>
                <Table>
                  <Table.Body>
                    <Table.Row isHover={false} className="border-b border-b-grey-20">
                      <Table.Cell className={s.tableTd}>
                        <div className='flex flex-row items-center justify-between'>
                          <p className="text-sm text-grey-40">Цена</p>
                          <p className='font-semibold'>{application.price * 1000}{" "}{"₽ / т"}</p>
                        </div> 
                      </Table.Cell>
                    </Table.Row>
                    <Table.Row isHover={false} className="border-b border-b-grey-20">
                      <Table.Cell className={classNames('px-0 gap-[20px]', s.tableTd)}>
                        <div className='flex flex-row items-center justify-between'>
                          <p className="text-sm text-grey-40">Общая стоимость</p>
                          <p> {application.totalPrice}{' '}₽{' (Включая НДС '}{includeNDS}{' ₽)'}</p>
                        </div> 
                      </Table.Cell>
                    </Table.Row>
                    <Table.Row isHover={false} className="border-b border-b-grey-20">
                      <Table.Cell className={s.tableTd}>
                        <div className='flex flex-row items-center justify-between'>
                          <p className="text-sm text-grey-40">Вес</p>
                          <p>{(application.totalWeight / 1000).toFixed(1)}{" "}т</p>
                        </div>                  
                      </Table.Cell>
                    </Table.Row>
                    <Table.Row isHover={false} className="border-b border-b-grey-20">
                      <Table.Cell className={s.tableTd}>
                        <div className='flex flex-row items-center justify-between'>
                          <p className="text-sm text-grey-40">Кол–во кип</p>
                          <p className={application.urgencyType.id !== 2 ? "" : "px-[4px]"}>
                          {application.urgencyType.id !== 2 ? `${application.baleCount}` : `--`}
                          </p>
                        </div>
                      </Table.Cell>
                    </Table.Row>
                    <Table.Row isHover={false} className="border-b border-b-grey-20">
                      <Table.Cell className={s.tableTd}>
                      <div className='flex flex-row items-center justify-between'>
                        <p className="text-sm text-grey-40">Вес одной кипы</p>
                        <p className={application.urgencyType.id !== 2 ? "" : "px-[6px]"}>
                          {application.urgencyType.id !== 2 ? `${(application.baleWeight / 1000).toFixed(1)} т` : `--`}
                        </p>
                        </div>
                      </Table.Cell>
                    </Table.Row>
                  </Table.Body>
                </Table>
              </Paper>
              <Paper mode="light" className={classNames("mt-[20px] border-none", s.paper, s.tableCell)}>
                <Table>
                  <Table.Body>
                    <Table.Row isHover={false} className="border-b border-b-grey-20">
                      <Table.Cell className={s.tableTd}>
                        <div className='flex flex-row items-center justify-between'>
                          <p className="text-sm text-grey-40">Работа с НДС</p>
                          <p>{application.withNds ? 'Да' : 'Нет'}</p>
                        </div>
                      </Table.Cell>
                    </Table.Row>
                    <Table.Row isHover={false} className="border-b border-b-grey-20">
                      <Table.Cell className={s.tableTd}>
                        <div className='flex flex-row items-center justify-between'>
                          <p className="text-sm text-grey-40">Упаковка</p>
                          <p className={application.urgencyType.id !== 2 ? "" : "px-[6px]"}>
                          {application.urgencyType.id !== 2 ? `${application.isPackingDeduction ? 'Вычитается' : 'Не вычитается'}` : `--`}
                          </p>
                        </div>
                      </Table.Cell>
                    </Table.Row>
                    <Table.Row isHover={false} className="border-b border-b-grey-20">
                      <Table.Cell className={s.tableTd}>
                        <div className='flex flex-row items-center justify-between'>
                          <p className="text-sm text-grey-40">На упаковку с каждой кипы</p>
                          <p className={application.urgencyType.id !== 2 ? "" : "px-[6px]"}>
                          {application.urgencyType.id !== 2 ? `${application.packingDeductionValue} %` : `--`}
                          </p>
                        </div>
                      </Table.Cell>
                    </Table.Row>
                    <Table.Row isHover={false} >
                      <Table.Cell className={s.tableTd}>
                        <div className='flex flex-row items-center justify-between'>
                          <p className="text-sm text-grey-40 mr-[40px]">Комментарий</p>
                          <p>{application.comment || 'Нет'}</p>
                        </div>
                      </Table.Cell>
                    </Table.Row>
                  </Table.Body>
                </Table>
              </Paper>
            </div>

            <div className='flex justify-start items-center'>
              <div className="my-[12px] flex gap-[15px]">
                <Button onClick={() => updateApplication({
                  id: application.id,
                  status: 2
                })}
                >
                  Одобрить
                </Button>
                <Button
                  onClick={() => updateApplication({
                    id: application.id,
                    status: 4
                  })}
                  mode="light"
                >
                  Отклонить
                </Button>
              </div>
              <div className='flex ml-[40px] flex-row gap-[6px] w-1/3'>
                <Location style={{width: '30px', height: '30px', marginTop: '6px'}}/>
                <div>
                  <p className="text-sm text-grey-40">Адрес</p>
                  <p>{application.address}</p>
                </div>
              </div>
            </div>
            <div className="h-[40px] mt-[4px]">
              {application.status.id === 2 && <Tip>Заявка одобрена</Tip>}
              {application.status.id === 4 && <Tip>Заявка отклонена</Tip>}
            </div>
          </div>
        )}
      </SidebarLayout>
    </AppShell>
  );
};
