import React from 'react';
import Debug from '../frontend/src/Components/Debug/Debug';

export const BrazilianFormatData = ({ date, hour, showTime = true }) => {
  if (!date) {
    return <span>-</span>;
  }

  let dateObj = new Date(date.replace('Z', ''));

  if (hour) {
    dateObj = new Date(date + ' ' + hour);
  }

  return (
    <span>
      {dateObj.toLocaleDateString('pt-BR')}{' '}
      {showTime &&
        `${dateObj.getHours().toString().padStart(2, '0')}:${dateObj.getMinutes().toString().padStart(2, '0')}`
      }
    </span>
  );
};
