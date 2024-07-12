import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

const CsrfContext = createContext();

export const fetchCsrfToken = async () => {
  try {
    const response = await axios.get(`${process.env.REACT_APP_API_URL}/csrf-token`, {
      withCredentials: true, // Ensure cookies are included in the request
    });
    const token = response.data.csrf_token;
    // setCsrfToken(token);
    Cookies.set('XSRF-TOKEN', token); // Store the token in a cookie
  } catch (error) {
    console.error('Error fetching CSRF token:', error);
  }
};

export const CsrfProvider = ({ children }) => {
  const [csrfToken, setCsrfToken] = useState('');

  useEffect(() => {
    fetchCsrfToken();
  }, []);

  return (
    <CsrfContext.Provider value={csrfToken}>
      {children}
    </CsrfContext.Provider>
  );
};

export const useCsrf = () => {
  return useContext(CsrfContext);
};
