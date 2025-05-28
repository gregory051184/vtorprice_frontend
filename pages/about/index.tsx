import React from 'react';
import { Button, Container } from '@box/shared/ui';
import classNames from 'classnames';
import { AppShell } from '@box/layouts';
import Error from '@assets/icons/error_green.svg';
import Boss from '@assets/images/boss.png';
import FullTeam from '@assets/images/team/full_team.png';
import { InfoCards, Team } from '@box/widgets/about';
import Image from 'next/image';
import { Header } from '@box/widgets/header';
import { Footer } from '@box/widgets/footer';
import { Contacts } from '@box/widgets/contacts';
import s from './style.module.scss';
import { Address } from '@box/features/address';
import Head from 'next/head';

function Index() {
  return (
    <AppShell
      header={<Header />}
      footer={<Footer />}
    >
      <Head>
        <title>О Компании</title>
      </Head>
      <Container>
        <div className={classNames('flex mt-[80px] mb-[100px] info_banner')}>
          <div className={classNames('w-6/12', s.banner_stats, s.bottom_banner_stats)}>
            <h2 className={`info_banner_title ${s.textAdaptive}`}>
              ВторПрайс – первое в России

              агентство по продажам

              вторичных ресурсов
            </h2>
            <Button onClick={() => {window.open(`https://wa.me/79274155888`, '_blank');}} className={`mt-14 ${s.buttonAdaptive}`}>
              Связаться
            </Button>
          </div>
        </div>
        <InfoCards />
      </Container>
      <div className={classNames('mt-24 bg-grey-10', s.boss_wrapper)}>
        <Container className={classNames(s.boss, 'flex gap-6')}>
          <div className={classNames(s.boss_info, 'w-6/12', s.adaptive)}>
            <p className={classNames("text-primaryGreen-main text-lg", s.textAdaptive)}>Добрый день! Меня зовут</p>
            <h4 className={classNames("font-normal text-4xl mt-5 mb-8", s.textAdaptive)}>Вадим Кушнер</h4>
            <div className={classNames("hidden", s.forAdaptive)}>
              <Image className={"mx-auto mb-[40px] w-6/12"} width={352} height={598} src={Boss.src} alt="Вадим Кушнер" />
            </div>
            <div className="text-lg font-light   ">
              <p>
                Я основатель и директор нашего агентства.
                Я собрал команду и запустил деятельность агентства после
                10 лет опыта работы в сфере вторсырья. Ключевой
                причиной создания стало то, что на рынке
                существует множество тонкостей и проблем
                из-за которых возникают трудности
                у добросовестных предпринимателей и компаний. Среди этих проблем:
              </p>
              <br />
              <ul className="list-disc list-inside">
                <li>постоянно меняющаяся цена на продукцию</li>
                <li>отсутствие гарантий на соответствие продукции согласованному качеству</li>
                <li>частые задержки по поставке необходимых объемов</li>
                <li>обман и недобросовестные поставщики/покупатели</li>
                <li>одна маленькая сделка купли/продажи иногда съедает все время и нервы</li>
              </ul>
              <br />
              <p>
                Именно решение этих проблем и трудностей
                для наших клиентов стало для нас основной задачей.
                Мы работаем уже три года и знаем 90% участников рынка лично.
                За это время мы научились:
              </p>
              <br />
              <ul className="list-disc list-inside">
                <li>
                  быстро находить покупателя/продавца под вашу заявку
                </li>
                <li>
                  делать предварительную проверку отгружаемого товара
                </li>
                <li>проводить подготовку всех организационных и бюрократических вопросов</li>
                <li>
                  обеспечивать своевременную доставку и проверку продукции
                </li>
              </ul>
              <br />
              <p>Сегодня, имея этот опыт, мы можем:</p>
              <br />
              <ul className="list-disc list-inside">
                <li>дать консультацию по любым вопросам</li>
                <li>обеспечить вас поставками/продажей вторсырья</li>
                <li>
                  снять всю сопутствующую головную боль
                </li>
              </ul>
              <br />
              <p>
                Рад нашему знакомству, если вдруг, мы еще не знакомы! Приглашаю к сотрудничеству
              </p>
              <br />
            </div>

          </div>
          <div className={classNames(s.boss_image_wrapper, 'w-6/12', s.notForAdaptive)}>
            <Image className={s.boss_image} width={352} height={598} src={Boss.src} alt="Вадим Кушнер" />
          </div>
        </Container>
      </div>
      <Container>
        <Team />
        <Image className="mt-24" width={1240} height={720} src={FullTeam.src} alt="Команда VtorPrice" />
      </Container>
      <div className={classNames('mb-20 mt-16')}>
        <Container className={classNames('flex-col flex items-center')}>
          <div className="flex items-center gap-2">
            <Error />
            <p className="text-2xl text-primaryGreen-main">Наша миссия</p>

          </div>
          <p className="font-light text-black text-xl mt-3 text-center leading-snug">
            Спасти мир от экологической
            <br />
            {' '}
            катастрофы и заработать на этом
          </p>
        </Container>
      </div>

  


    <Address latitude={55.783013} longitude={49.193766} />
    <Contacts/>
    </AppShell>
  );
}

export default Index;
