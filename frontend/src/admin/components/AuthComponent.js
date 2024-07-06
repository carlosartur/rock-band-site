import React, { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';
import Cookies from 'js-cookie';

export const AuthComponent = () => {
  const { getToken, getExpiresAt, setLoginData } = useAuth();

  const token = getToken();
  const expiresAt = getExpiresAt();

  const navigate = useNavigate();

  const minutesUntilDate = (date) => {
    const currentDate = new Date();
    const timeDifferenceInMilliseconds = date - currentDate;
    const minutesRemaining = Math.ceil(
      timeDifferenceInMilliseconds / (1000 * 60)
    );
    return minutesRemaining;
  };

  if (!Cookies.get('verifyValidTokenInterval')) {
    Cookies.set(
      'verifyValidTokenInterval',
      setInterval(() => {
        let minutesToUpdate = minutesUntilDate(expiresAt);

        if (minutesToUpdate > 5 || isNaN(minutesToUpdate)) {
          return;
        }

        api
          .post(`${process.env.REACT_APP_API_URL}/admin-auth/refresh`)
          .then((refreshResponse) => setLoginData(refreshResponse))
          .catch((err) => {
            console.log(err);
            if (window.location.href.includes(`/login`)) {
              return navigate(`/login`);  
            }
            return navigate(`/login?redirectTo=${encodeURIComponent(window.location.href)}`);
          });
      }, 60000)
    );
  }

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (!token || expiresAt < new Date()) {
        const currentUrl = window.location.href;
        const loginUrl = `/login`;

        if (currentUrl.includes(loginUrl) && !currentUrl.includes(`redirectTo`)) {
          return;
        }

        if (currentUrl.includes(loginUrl)) {
          return navigate(loginUrl);
        }
        
        return navigate(`${loginUrl}?redirectTo=${encodeURIComponent(currentUrl)}`);
      }
    }, 100);

    return () => clearInterval(intervalId);
  }, [token, expiresAt, navigate]);

  return (
    <>
      <input value={token} type='hidden' name='jwt_token' id='jwt_token' />
      {/* <input value={expiresAt.toISOString()} type='hidden' name='jwt_token_expires_at' id="jwt_token_expires_at" /> */}
    </>
  );
};
