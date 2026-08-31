import React, { FC } from 'react';
import { NavLink, Link } from 'react-router-dom';
import styles from './app-header.module.css';
import { TAppHeaderUIProps } from './type';
import {
  BurgerIcon,
  ListIcon,
  Logo,
  ProfileIcon
} from '@zlden/react-developer-burger-ui-components';

export const AppHeaderUI: FC<TAppHeaderUIProps> = ({ userName }) => (
  <header className={styles.header}>
    <nav className={`${styles.menu} p-4`}>
      <div className={styles.menu_part_left}>
        <NavLink
          to='/'
          className={({ isActive }) =>
            `text text_type_main-default ml-2 mr-10 ${styles.link} ${isActive ? styles.link_active : ''}`
          }
        >
          <BurgerIcon type={'primary'} />
          <span className='ml-2'>Конструктор</span>
        </NavLink>
        <NavLink
          to='/feed'
          className={({ isActive }) =>
            `text text_type_main-default ml-2 ${styles.link} ${isActive ? styles.link_active : ''}`
          }
        >
          <ListIcon type={'primary'} />
          <span className='ml-2'>Лента заказов</span>
        </NavLink>
      </div>
      <div className={styles.logo}>
        <Link to='/'>
          <Logo className='' />
        </Link>
      </div>
      <div className={styles.link_position_last}>
        <NavLink
          to='/profile'
          className={({ isActive }) =>
            `text text_type_main-default ml-2 ${styles.link} ${isActive ? styles.link_active : ''}`
          }
        >
          <ProfileIcon type={'primary'} />
          <span className='ml-2'>{userName || 'Личный кабинет'}</span>
        </NavLink>
      </div>
    </nav>
  </header>
);
