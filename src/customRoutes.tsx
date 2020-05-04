import React from 'react';
import { Route } from 'react-router-dom';
import UserPage from './page/user'
export default [
  // eslint-disable-next-line react/jsx-key
  <Route exact noLayout path="/buy" component={UserPage} />,
];