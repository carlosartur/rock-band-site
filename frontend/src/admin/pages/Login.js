import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
  CToast,
  CToastBody,
  CToastClose,
  CToaster,
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilLockLocked, cilUser } from '@coreui/icons';
import axios from 'axios';
import Cookies from 'js-cookie';
import '../scss/style.scss';

import { useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/api';

const Login = () => {
  const toaster = useRef();
  const [toastContent, setToastContent] = useState(false);
  const navigate = useNavigate();
  const { setLoginData } = useAuth();
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const redirectTo = params.get('redirectTo');

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    let { name, value } = e.target;

    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    if (e) {
      e.preventDefault();
    }
    
    api
    // axios
      .post(`${process.env.REACT_APP_API_URL}/admin-auth/login`, formData)
      .then((response) => {
        const newLoginData = response.data;
        setLoginData(newLoginData);
        if (redirectTo) {
          window.location.href = redirectTo;
          return;
        }
        navigate('/admin/dashboard');
      })
      .catch((err) => {
        lauchToast({
          visible: true,
          color: 'danger',
          message: 'Email ou senha incorretos. Por favor tente novamente.',
        });
      });
  };

  const lauchToast = (toastData) => {
    const toastInternal = (
      <CToast
        autohide={false}
        visible={toastData.visible}
        color={toastData.color}
        className='text-white align-items-center'
      >
        <div className='d-flex'>
          <CToastBody>{toastData.message}</CToastBody>
          <CToastClose className='me-2 m-auto' white />
        </div>
      </CToast>
    );

    setToastContent(toastInternal);
  };

  useEffect(() => {
    Cookies.remove('token');
    Cookies.remove('userEmail');
    Cookies.remove('userName');
    Cookies.remove('expiresAt');
    Cookies.remove('verifyValidTokenInterval');
  });

  return (
    <>
      <CToaster
        ref={toaster}
        placement='top-end'
        push={toastContent}
      ></CToaster>

      <div className='bg-light min-vh-100 d-flex flex-row align-items-center'>
        <CContainer>
          <CRow className='justify-content-center'>
            <CCol md={8}>
              <CCardGroup>
                <CCard className='p-4'>
                  <CCardBody>
                    <CForm onSubmit={handleSubmit}>
                      <h1>Login</h1>
                      <p className='text-medium-emphasis'>Entre na sua conta</p>
                      <CInputGroup className='mb-3'>
                        <CInputGroupText>
                          <CIcon icon={cilUser} />
                        </CInputGroupText>
                        <CFormInput
                          placeholder='Email'
                          autoComplete='email'
                          value={formData.email}
                          onChange={handleChange}
                          id='email'
                          name='email'
                        />
                      </CInputGroup>
                      <CInputGroup className='mb-4'>
                        <CInputGroupText>
                          <CIcon icon={cilLockLocked} />
                        </CInputGroupText>
                        <CFormInput
                          type='password'
                          placeholder='Senha'
                          autoComplete='current-password'
                          value={formData.password}
                          onChange={handleChange}
                          id='password'
                          name='password'
                        />
                      </CInputGroup>
                      <CRow>
                        <CCol xs={6}>
                          <CButton
                            type='submit'
                            color='primary'
                            className='px-4'
                          >
                            Entrar
                          </CButton>
                        </CCol>
                        {/* <CCol xs={6} className="text-right">
                          <CButton color="link" className="px-0">
                            Forgot password?
                          </CButton>
                        </CCol> */}
                      </CRow>
                    </CForm>
                  </CCardBody>
                </CCard>
                {/* <CCard className="text-white bg-primary py-5" style={{ width: '44%' }}>
                  <CCardBody className="text-center">
                    <div>
                      <h2>Sign up</h2>
                      <p>
                        Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
                        tempor incididunt ut labore et dolore magna aliqua.
                      </p>
                      <Link to="/register">
                        <CButton color="primary" className="mt-3" active tabIndex={-1}>
                          Register Now!
                        </CButton>
                      </Link>
                    </div>
                  </CCardBody>
                </CCard> */}
              </CCardGroup>
            </CCol>
          </CRow>
        </CContainer>
      </div>
    </>
  );
};

export default Login;
