import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  CContainer,
  CHeader,
  CHeaderBrand,
  CHeaderDivider,
  CHeaderNav,
  CHeaderToggler,
  CNavLink,
  CNavItem,
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilMenu } from '@coreui/icons';

import { AppBreadcrumb } from './index';
import { AppHeaderDropdown } from './header/index';
// import { logo } from '../src/assets/brand/logo';

const AppHeader = () => {
  const dispatch = useDispatch();
  const sidebarShow = useSelector((state) => state.sidebarShow);

  return (
    <CHeader position='sticky' className='mb-4'>
      <CContainer fluid>
        <CHeaderToggler
          className='ps-1'
          onClick={() => dispatch({ type: 'set', sidebarShow: !sidebarShow })}
        >
          <CIcon icon={cilMenu} size='lg' />
        </CHeaderToggler>
        <CHeaderBrand className='mx-auto d-md-none' to='/'>
          <CIcon icon='../assets/brand/logo.jpeg' height={48} alt='Logo' />
        </CHeaderBrand>
        <CHeaderNav className='d-none d-md-flex me-auto'>
          <CNavItem>
            <CNavLink to='/dashboard' as={NavLink}>
              Dashboard
            </CNavLink>
          </CNavItem>
          <CNavItem>
            <CNavLink href='#/admin/users'>Usuários</CNavLink>
          </CNavItem>
          <CNavItem>
            <CNavLink href='#/admin/configurations'>Configurações</CNavLink>
          </CNavItem>
        </CHeaderNav>

        <CHeaderNav className='ms-3'>
          <AppHeaderDropdown />
        </CHeaderNav>
      </CContainer>
      <CHeaderDivider />
      <CContainer fluid>
        <AppBreadcrumb />
      </CContainer>
    </CHeader>
  );
};

export default AppHeader;
