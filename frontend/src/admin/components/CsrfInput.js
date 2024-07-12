import axios from 'axios';
import React, { useState, useEffect } from 'react';

export const CsrfInput = () => {
  const [csrfToken, setCsrfToken] = useState('');

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/csrf-token`)
      .then((response) => {
        setCsrfToken(response.data.csrf_token);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  return <input type='hidden' name='_token' value={csrfToken} />;
};
