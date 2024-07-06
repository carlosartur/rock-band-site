import React from 'react';
import { CFooter } from '@coreui/react';

const AppFooter = () => {
  return (
    <CFooter>
      <div>
        Clã de Kali
        <span className='ms-1'>&copy; {(new Date()).getFullYear()} Carlos Artur.</span>
      </div>
    </CFooter>
  );
};

export default React.memo(AppFooter);
