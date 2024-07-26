import React from 'react';

import WidgetsDropdown from '../widgets/WidgetsDropdown';
import { AuthComponent } from '../../components/AuthComponent';

const Dashboard = () => {
  return (
    <>
      <AuthComponent />
      <WidgetsDropdown />
    </>
  );
};

export default Dashboard;