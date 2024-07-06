import React from 'react';
import {
  CAvatar,
  CBadge,
  CDropdown,
  CDropdownDivider,
  CDropdownHeader,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
} from '@coreui/react';
import { cilAccountLogout } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const AppHeaderDropdown = () => {
  const { getUserEmail, getUserName, logout } = useAuth();

  const navigate = useNavigate();

  const logoutAction = () => {
    logout();
    navigate('/login');
  };

  const styleOfText = {
    color: 'white',
  };

  return (
    <CDropdown variant='nav-item'>
      <CDropdownToggle placement='bottom-end' className='py-0' caret={false}>
        <CAvatar size='md' color='dark'>
          <span style={styleOfText}>
            {getUserName() ? getUserName()[0].toUpperCase() : 'U'}
          </span>
        </CAvatar>
      </CDropdownToggle>
      <CDropdownMenu className='pt-0' placement='bottom-end'>
        <CDropdownHeader className='bg-light fw-semibold py-2'>
          Conta {getUserEmail()}
        </CDropdownHeader>
        <CDropdownItem onClick={logoutAction}>
          <CIcon icon={cilAccountLogout} className='me-2' />
          Logout
          {/* <CBadge color="info" className="ms-2">
            42
          </CBadge> */}
        </CDropdownItem>
      </CDropdownMenu>
    </CDropdown>
  );
};

export default AppHeaderDropdown;
