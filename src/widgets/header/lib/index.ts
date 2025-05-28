import {v4 as uuidv4} from 'uuid';


export const headersMain = (isMobile: boolean) => {
    const headerLinks_1 = [
        {
            title: 'Каталог компаний',
            href: '/companies',
            sublinks: [
                {
                    title: 'Заготовщики',
                    href: '/companies',
                },
                {
                    title: 'Переработчики',
                    href: '/companies',
                },
                {
                    title: 'Продавцы',
                    href: '/companies',
                },
            ]
        },
        {
            title: 'Биржа',
            href: '/exchange',
        },
        {
            title: 'Статистика',
            href: '/statistics',
        },
        {
            title: 'Оборудование',
            href: '/equip-apps',
        },
        {
            title: 'Логистика',
            href: '/logistics',
        },
        {
            title: 'Подписка',
            href: '/subscribes',
        },
        {
            title: 'Реклама',
            href: '/',
        },
        {
            title: 'FAQ',
            href: '/faq',
        },
        {
            title: 'О компании',
            href: '/about',
        }
    ].map((el) => {
        const newEl = {
            id: uuidv4(),
            ...el
        };
        return newEl;
    });
    const headerLinks_2 = [
        {
            title: 'Каталог компаний',
            href: '/companies',
            sublinks: [
                {
                    title: 'Заготовщики',
                    href: '/companies',
                },
                {
                    title: 'Переработчики',
                    href: '/companies',
                },
                {
                    title: 'Продавцы',
                    href: '/companies',
                },
            ]
        },
        {
            title: 'Биржа',
            href: '/exchange',
        },
        {
            title: 'Статистика',
            href: '/statistics',
        },
        {
            title: 'Оборудование',
            href: '/equip-apps',
        },
        {
            title: 'FAQ',
            href: '/faq',
        },
        {
            title: 'О компании',
            href: '/about',
        }
    ].map((el) => {
        const newEl = {
            id: uuidv4(),
            ...el
        };
        return newEl;
    });
    if (isMobile) {
        return headerLinks_1;
    } else {
        return headerLinks_2;
    }
}
export const marketLinks = [
    {
        title: 'Подписка',
        href: '/subscribes',
    },
    {
      title: 'Спец. объявления',
      href: '/special-applications'
    },
    {
        title: 'Реклама',
        href: '/',
    }
].map((el) => {
    const newEl = {
        id: uuidv4(),
        ...el
    };
    return newEl;
});
