import React from 'react';

import CIcon from '@coreui/icons-react';
import * as icon from '@coreui/icons';
import { CCol, CWidgetStatsF } from '@coreui/react';

export const ReservationPersonCard = (info) => {
  const { person, index } = info;

  let personTypeIcon = {
    responsible: icon.cilCopy,
    guest: icon.cilBuilding,
    passenger: icon.cilAirplaneMode,
  }[person.type];

  let personType = {
    responsible: 'Fatura',
    guest: 'Hóspede',
    passenger: 'Passageiro',
  }[person.type];

  let color = (() => {
    switch (index % 8) {
      case 0:
        return 'primary';
      case 1:
        return 'secondary';
      case 2:
        return 'success';
      case 3:
        return 'danger';
      case 4:
        return 'warning';
      case 5:
        return 'info';
      case 6:
        return 'light';
      case 7:
        return 'dark';
    }
  })();

  return (
    <CCol xs={12} sm={6} lg={4} key={person.id}>
      <a
        style={{ textDecoration: 'none' }}
        target='_blank'
        href={'#/admin/reservation-people-form?id=' + person.id}
      >
        <CWidgetStatsF
          className='mb-3'
          icon={<CIcon width={24} icon={personTypeIcon} size='xl' />}
          padding={false}
          title={personType}
          value={person.name}
          color={color}
        />
      </a>
    </CCol>
  );
};
