import { Avatar } from '@box/entities/user';
import {
  BackButton,
  Button, Paper, Tip
} from '@box/shared/ui';
import { useEvent, useStore } from 'effector-react';
import React from 'react';
import Head from 'next/head';
import Varified from '@assets/icons/16_verified.svg';
import Reliable from '@assets/icons/16_reliable.svg';
import classNames from 'classnames';
import { Header } from '@box/widgets/header';
import { Footer } from '@box/widgets/footer';
import { AppShell, SidebarLayout } from '@box/layouts';
import { CompanyRejectDrawer } from '@box/widgets/companies';
import { useBoolean } from '@box/shared/hooks';
import { companyVerificationModel } from '@box/entities/companyVerification';
import s from './style.module.scss';
import FileIcon from '@assets/icons/24_file.svg';

import dotenv from 'dotenv';

dotenv.config();

export const CompanyVerificationInfo: React.FC = () => {
  const companyVerification = useStore(companyVerificationModel.$companyVerification);
  const company = companyVerification?.company;
  const setVerificationStatus = useEvent(companyVerificationModel.updateCompanyVerificationEvent);
  
  const companyVerified = [2, 3].includes(companyVerification?.status?.id as number);
  const companyReliable = companyVerification?.status.id === 3;
  
  const { value: rejectDrawerVisible, toggle } = useBoolean(false);
  const onRejectSubmit = (message:string) => {
    if (companyVerification) {
      setVerificationStatus({
        id: companyVerification.id,
        status: 4,
        comment: message
      });
    }

    toggle();
  };
  
  return (
    <AppShell
      header={<Header />}
      footer={<Footer />}
    >
      <SidebarLayout>
        <div>
          {company && (
            <>
              <Head>
                <title>{company.name}</title>
              </Head>
              <CompanyRejectDrawer 
                visible={rejectDrawerVisible} 
                close={toggle} 
                onSubmit={onRejectSubmit} 
              />
              <BackButton className='text-sm'>Вернуться к списку компаний</BackButton>
              <div className="flex mt-[30px] items-center gap-[20px]">
                <Avatar size="lg" url={company.image ? process.env.NEXT_PUBLIC_API_URL + '/' + company.image : null} />
                <div className="flex items-center gap-[10px]">
                  <h1 className={s.block_title}>{company.name}</h1>
                  {companyVerified && <Varified className="scale-150" />}
                  {companyReliable && <Reliable className="scale-150" />}

                </div>
              </div>
              <div className={classNames("mt-[24px] flex gap-[16px]", s.buttons)}>
                {companyVerification.status.id !== 4 ? (
                  <>
                    <Button
                      onClick={() => {
                        if (companyVerified) {
                          setVerificationStatus({
                            id: companyVerification.id,
                            status: 1
                          });
                          return;
                        }
                        setVerificationStatus({
                          id: companyVerification.id,
                          status: 2
                        });
                      }}
                      className={classNames(
                        {
                          [s.orange_button]: companyVerified
                        }
                      )}
                    >
                      {!companyVerified ? 'Верифицировать' : 'Снять верификацию'}

                    </Button>
                    <Button
                      onClick={() => {
                        if (!companyReliable) {
                          setVerificationStatus({
                            id: companyVerification.id,
                            status: 3
                          });
                          return;
                        }
                        setVerificationStatus({
                          id: companyVerification.id,

                          status: 2
                        });
                      }}
                      className={classNames(
                        {
                          [s.orange_button]: companyReliable
                        }
                      )}
                    >
                      {!companyReliable ? 'Сделать надежной' : 'Снять надежный'}
                    </Button>
                    {companyVerification.status.id === 1 && (
                      <Button onClick={toggle} mode="light">
                        Отклонить
                      </Button>
                    )}

                  </>
                )
                  : <Tip className="w-full">Заявка отклонена</Tip>}

              </div>
              <Paper mode="light" className="mt-[26px]">
                <div>
                  <h3 className={s.block_title}>Основная информация</h3>
                  <div className={s.block_content}>
                    <table className={s.table}>
                      <tbody>
                        {companyVerification.employee && (
                          <tr>
                            <td>
                              <p className={s.field_label}>ФИО сотрудника</p>
                              <p className={s.field_text}>
                                {companyVerification.employee.last_name}
                                {' '}
                                {companyVerification.employee.first_name}
                                {' '}
                                {companyVerification.employee.middle_name}
                              </p>
                            </td>
                            <div className={s.adaptive}>
                              <td>
                                <p className={s.field_label}>Должность</p>
                                <p className={s.field_text}>
                                  {companyVerification.employee.position}
                                </p>
                              </td>
                              <td>
                                <p className={s.field_label}>Телефон</p>
                                <p className={s.field_text}>{companyVerification.employee.phone}</p>
                              </td>
                            </div>
                          </tr>
                        )}

                        {/* Kostil */}

                        <tr className={classNames('hidden', s.kostil)}>
                          <td>
                            <p className={s.field_label}>Должность</p>
                            <p className={s.field_text}>
                              {companyVerification.employee.position}
                            </p>
                          </td>
                          <td>
                            <p className={s.field_label}>Телефон</p>
                            <p className={s.field_text}>{companyVerification.employee.phone}</p>
                          </td>
                        </tr>
                        <tr className={classNames('hidden', s.kostil2)}>
                          <td>
                            <p className={s.field_label}>Должность</p>
                            <p className={s.field_text}>
                              {companyVerification.employee.position}
                            </p>
                          </td>
                        </tr>
                        <tr className={classNames('hidden', s.kostil2)}>
                          <td>
                            <p className={s.field_label}>Телефон</p>
                            <p className={s.field_text}>{companyVerification.employee.phone}</p>
                          </td>
                        </tr>


                        <tr>
                          <td>
                            <p className={s.field_label}>Адрес</p>
                            <p className={s.field_text}>{company.address}</p>
                          </td>
                          <td className={s.adaptiveXXSM}>
                            <p className={s.field_label}>С НДС</p>
                            <p className={s.field_text}>{company.withNds ? 'Да' : "Нет"}</p>
                          </td>
                        </tr>
                        <tr className={classNames('hidden', s.kostil2)}>
                          <td>
                            <p className={s.field_label}>С НДС</p>
                            <p className={s.field_text}>{company.withNds ? 'Да' : "Нет"}</p>
                          </td>
                        </tr>
                        <tr>
                          <td className={s.table_description}>
                            <p className={s.field_label}>Краткая информация о компании</p>
                            <p className={classNames('break-all', s.field_text)}>{company.description}</p>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className="mt-[22px]">
                  <h3 className={s.block_title}>Документы</h3>
                  <div className={s.block_content}>
                    <div className={classNames("grid grid-cols-3 gap-[16px]", s.fileButtons)}>
                      {company.documents.filter((el) => el.docType).map((document) => 
                      <Button
                        key={document.id}
                        onClick={() => {
                            {/* if bug here delete ${process.env.NEXT_PUBLIC_API_URL} */}
                            window.open(`${process.env.NEXT_PUBLIC_API_URL}${document?.file}`, '_blank');
                        }}
                        className={classNames('grow shadow flex', s.myButton)}
                        mode="notFilled"
                        iconLeft={<FileIcon />}
                        >
                        {document.docType?.label || ''}
                      </Button>)}
                      {company.documents.filter((el) => el.docType).length === 0 && <p className="text-2xl">-</p>}
                    </div>
                  </div>
                </div>
                <div className="mt-[32px]">
                  <h3 className={s.block_title}>Покупает</h3>
                  <div className={s.block_content}>
                    <table className={s.table}>
                      <tbody>
                        {company.recyclables
                          .filter((el) => el.action.id === 1)
                          .map((recyclable) => (
                            <tr key={recyclable.id}>
                              <td>
                                <p className={s.field_label}>Тип вторсырья</p>
                                <p className={s.field_text}>{recyclable.recyclables.name}</p>
                              </td>
                              <td>
                                <p className={s.field_label}>Ежемес. объем, т (примерно)</p>
                                <p className={s.field_text}>{(recyclable.monthlyVolume / 1000).toFixed(1)}</p>
                              </td>
                              <td>
                                <p className={s.field_label}>Цена за 1 т, руб</p>
                                <p className={s.field_text}>{recyclable.price * 1000}</p>
                              </td>
                            </tr>
                          ))}
                      </tbody>

                    </table>
                    {company.recyclables.filter((el) => el.action.id === 1).length === 0 && <p className="text-2xl">-</p>}

                  </div>
                </div>
                <div className="mt-[22px]">
                  <h3 className={s.block_title}>Продает</h3>
                  <div className={s.block_content}>
                    <table className={s.table}>
                      <tbody>
                        {company.recyclables
                          .filter((el) => el.action.id === 2)
                          .map((recyclable) => (
                            <tr key={recyclable.id}>
                              <td>
                                <p className={s.field_label}>Тип вторсырья</p>
                                <p className={s.field_text}>{recyclable.recyclables.name}</p>
                              </td>
                              <td>
                                <p className={s.field_label}>Ежемес. объем, т (примерно)</p>
                                <p className={s.field_text}>{(recyclable.monthlyVolume / 1000).toFixed(1)}</p>
                              </td>
                              <td>
                                <p className={s.field_label}>Цена за 1 т, руб</p>
                                <p className={s.field_text}>{recyclable.price * 1000}</p>
                              </td>
                            </tr>
                          ))}
                      </tbody>

                    </table>
                    {company.recyclables.filter((el) => el.action.id === 2).length === 0 && <p className="text-2xl">-</p>}

                  </div>
                </div>
                <div className="mt-[22px]">
                  <h3 className={s.block_title}>Тип компании</h3>
                  {company.activityTypes.map((activity) => (
                    <div key={activity.id} className={s.block_content}>
                      <div className="flex items-center gap-[26px]">
                        <h5 className="text-base font-semibold">
                          {(() => {
                            switch (activity.activity.id) {
                              case 1:
                                return 'Поставщик';
                              case 2:
                                return 'Переработчик';
                              case 3:
                                return 'Покупатель';
                              default:
                                return '';
                            }
                          })()}
                        </h5>
                        <div className="flex gap-[10px]">
                          {activity.advantages.map((advantage) => (
                            <div key={advantage.id} className="px-[12px] py-[4px] rounded-full bg-grey-10">
                              <p className="text-xs">{advantage.name}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                      <table className={s.table}>
                        <tbody>
                          {activity.recColTypes.map((recColType) => (
                            <tr key={recColType.id}>
                              <td>
                                <p className={s.field_label}>Тип сбора/переработки</p>
                                <p className={s.field_text}>{recColType.name}</p>
                              </td>
                            </tr>
                          ))}
                        </tbody>

                      </table>
                    </div>
                  ))}
                  {company.activityTypes.length === 0 && <p className="text-2xl">-</p>}
                </div>
                <div className="mt-[22px]">
                  <h3 className={s.block_title}>Дополнительные документы</h3>
                  <div className={s.block_content}>
                    <div className={classNames("grid grid-cols-3 gap-[16px]", s.fileButtons)}>
                      {company.documents.filter((el) => !el.docType).map((document) =>
                      <Button
                       key={document.id}
                       onClick={() => {
                           {/* if bug here delete ${process.env.NEXT_PUBLIC_API_URL} */}
                           window.open(`${process.env.NEXT_PUBLIC_API_URL}${document?.file}`, '_blank');
                       }}
                       className={classNames('grow shadow flex', s.myButton)}
                       mode="notFilled"
                       iconLeft={<FileIcon />}
                       >
                       {document.comment || ''}
                     </Button>)}
                    </div>
                    {company.documents.filter((el) => !el.docType).length === 0 && <p className="text-2xl">-</p>}

                  </div>
                </div>
              </Paper>
            </>
          )}
        </div>
      </SidebarLayout>
    </AppShell>
   
  );
};
