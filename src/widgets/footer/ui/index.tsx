import React from 'react';
import { IWithClass } from '@box/types';
import classNames from 'classnames';
import { Container } from '@box/shared/ui';
import Logo from '@assets/icons/logo_faded.svg';
import Telegram from '@assets/icons/24_telegram.svg';
import Youtube from '@assets/icons/24_youtube.svg';
import Vk from '@assets/icons/24_vkontakte.svg';
import Link from 'next/link';
import { links } from '../lib';
import s from './style.module.scss';

export const Footer: React.FC<IWithClass> = ({
  className
}) => (
  <div className={classNames('pt-14 pb-24', className)}>
    <Container>
      <div className={classNames('flex gap-20', s.footer)}>
        <div className={classNames(s.footer_right)}>
          <Logo />
          <p className="text-grey-40 mt-10">
            © 2018 - 2022 Все права защищены.
            Официальный сайт компании ВторПрайс.
            Информация на сайте не является публичной офертой и носит информационный характер.
          </p>
        </div>
        <div className={classNames('flex gap-20 justify-between shrink-0', s.footer_left)}>
          <div className={classNames(s.links)}>
            {links.map((link, num) => (
              // eslint-disable-next-line react/no-array-index-key
              <Link key={num} href={link.href}>
                <p className="font-medium text-sm">{link.title}</p>
              </Link>
            ))}
          </div>
          <div className={classNames('flex gap-4', s.footer_left_icons)}>
            <Link href="https://t.me/VtorPrice_official" target="_blank">
              <Telegram />
            </Link>
            <Link href="https://www.youtube.com/@VtorPrice" target="_blank">
              <Youtube />
            </Link>
            <Link href="https://vk.com/vtorprice" target="_blank">
              <Vk />
            </Link>
          </div>
        </div>
      </div>
    </Container>
  </div>
);
