import * as icon from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import React from 'react';
import styled from 'styled-components';

const ComponentWrapper = styled.span`
  /* Estilos padrão do componente aqui */

  &:hover {
    cursor: pointer;
  }
`;

export const Caret = ({ columnName, sortData }) => {
  if (sortData.order_by != columnName) {
    return (
      <ComponentWrapper>
        &nbsp;
        <CIcon
          size='sm'
          className='text-secondary'
          icon={icon.cilSortAscending}
        ></CIcon>
      </ComponentWrapper>
    );
  }

  if ('asc' == sortData.order_by_direction) {
    return (
      <ComponentWrapper>
        &nbsp;
        <CIcon
          size='sm'
          style={{ '--ci-primary-color': 'black' }}
          icon={icon.cilSortAscending}
        ></CIcon>
      </ComponentWrapper>
    );
  }

  return (
    <ComponentWrapper>
      &nbsp;
      <CIcon
        size='sm'
        style={{ '--ci-primary-color': 'black' }}
        icon={icon.cilSortDescending}
      ></CIcon>
    </ComponentWrapper>
  );
};
