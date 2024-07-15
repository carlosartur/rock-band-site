import React from 'react';
import CIcon from '@coreui/icons-react';
import {
  cilLibraryBuilding,
  cilUser,
  cilCalendarCheck,
  cilPhone,
  cilCamera,
  cilNewspaper,
  cilCog,
} from '@coreui/icons';
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react';
import { NavItem } from 'react-bootstrap';

const _nav = [
  {
    component: CNavItem,
    name: 'Usuários',
    to: '/admin/users',
    icon: <CIcon icon={cilUser} customClassName='nav-icon' />,
  },
  {
    component: CNavItem,
    name: 'Cidades',
    to: '/admin/cities',
    icon: <CIcon icon={cilLibraryBuilding} customClassName='nav-icon' />,
  },
  {
    component: CNavItem,
    name: 'Eventos',
    to: '/admin/events',
    icon: <CIcon icon={cilCalendarCheck} customClassName='nav-icon' />,
  },
  {
    component: CNavItem,
    name: 'Informações de contato',
    to: '/admin/contact-info',
    icon: <CIcon icon={cilPhone} customClassName='nav-icon' />,
  },
  {
    component: CNavItem,
    name: 'Galeria',
    to: '/admin/gallery',
    icon: <CIcon icon={cilCamera} customClassName='nav-icon' />,
  },
  // {
  //   component: CNavGroup,
  //   name: 'Banner',
  //   to: '/admin',
  //   icon: <CIcon icon={cilImagePlus} customClassName='nav-icon' />,
  //   items: [
  //     {
  //       component: CNavItem,
  //       name: 'Banners',
  //       to: '/admin/banners',
  //     },
  //     {
  //       component: CNavItem,
  //       name: 'Grupos de banners',
  //       to: '/admin/banners-groups',
  //     },
  //   ],
  // },
  {
    component: CNavGroup,
    name: 'Contatos',
    to: '/admin',
    icon: <CIcon icon={cilUser} customClassName='nav-icon' />,
    items: [
      {
        component: CNavItem,
        name: 'Fale conosco',
        to: '/admin/contact',
      },
      {
        component: CNavItem,
        name: 'Newsletters',
        to: '/admin/newsletters',
      },
    ],
  },
  {
    component: CNavItem,
    name: 'Configuraçoes',
    to: '/admin/configurations',
    icon: <CIcon icon={cilCog} customClassName='nav-icon' />,
  },
  {
    component: CNavItem,
    name: 'Páginas',
    to: '/admin/pages',
    icon: <CIcon icon={cilNewspaper} customClassName='nav-icon' />,
  },
];

export default _nav;
