import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import {
  CSidebar,
  CSidebarBrand,
  CSidebarNav,
  CSidebarToggler,
} from '@coreui/react';

import { AppSidebarNav } from './AppSidebarNav';

import SimpleBar from 'simplebar-react';
import 'simplebar/dist/simplebar.min.css';
import '../scss/sidebar.scss';

// sidebar nav config
import navigation from '../_nav';

const AppSidebar = () => {
  const dispatch = useDispatch();
  const unfoldable = useSelector((state) => state.sidebarUnfoldable);
  const sidebarShow = useSelector((state) => state.sidebarShow);

  return (
    <CSidebar
      position='fixed'
      unfoldable={unfoldable}
      visible={sidebarShow}
      onVisibleChange={(visible) => {
        dispatch({ type: 'set', sidebarShow: visible });
      }}
    >
      <CSidebarBrand className='d-none d-md-flex p-4 bg-[#303C54]' to='/'>
        {/* { configs && configs['logo-principal-claro'] && <img src={`${process.env.REACT_APP_API_URL}${configs['logo-principal-claro']['value_translated']}`} /> } */}
      </CSidebarBrand>
      <CSidebarNav className='bg-[#3C4B64]'>
        <SimpleBar>
          <AppSidebarNav items={navigation} />
        </SimpleBar>
      </CSidebarNav>
      <CSidebarToggler
        className='d-none d-lg-flex bg-[#303C54]'
        onClick={() =>
          dispatch({ type: 'set', sidebarUnfoldable: !unfoldable })
        }
      />
    </CSidebar>
  );
};

export default React.memo(AppSidebar);
