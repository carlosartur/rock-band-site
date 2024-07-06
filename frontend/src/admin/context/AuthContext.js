import { createContext, useContext, useEffect, useState } from 'react';
import Cookies from 'js-cookie';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const setToken = (value, expiresAt) =>
    Cookies.set('token', value, { expires: expiresAt });
  const setUserEmail = (value, expiresAt) =>
    Cookies.set('userEmail', value, { expires: expiresAt });
  const setUserName = (value, expiresAt) =>
    Cookies.set('userName', value, { expires: expiresAt });
  const setExpiresAt = (value, expiresAt) =>
    Cookies.set('expiresAt', value, { expires: expiresAt });

  const getToken = () => Cookies.get('token');
  const getUserEmail = () => Cookies.get('userEmail');
  const getUserName = () => Cookies.get('userName');
  const getExpiresAt = () => new Date(Cookies.get('expiresAt'));

  useEffect(() => {}, []);

  const logout = () => {
    Cookies.remove('token');
    Cookies.remove('userEmail');
    Cookies.remove('userName');
    Cookies.remove('expiresAt');

    document.location.href = '#/login';
  };

  const setLoginData = (data) => {
    let expiresAtDate = new Date(new Date().getTime() + data.expires_in * 1000);

    setExpiresAt(expiresAtDate, expiresAtDate);

    if (data.access_token) {
      setToken(data.access_token, expiresAtDate);
    }

    if (data.email) {
      setUserEmail(data.email, expiresAtDate);
    }

    if (data.name) {
      setUserName(data.name, expiresAtDate);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        setToken,
        setUserEmail,
        setUserName,
        setExpiresAt,
        getToken,
        getUserEmail,
        getUserName,
        getExpiresAt,
        setLoginData,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
