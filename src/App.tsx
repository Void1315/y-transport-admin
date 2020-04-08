import React from 'react';
import {
  HashRouter,
  Switch,
  Route,
} from "react-router-dom";
import { SnackbarProvider } from 'notistack';
import Home from './page/home'
const App: React.FC = () => {
  return (
    <SnackbarProvider maxSnack={3}>
      <Home />
    </SnackbarProvider>
    
  // <HashRouter>
  //   <Switch>
  //     <Route path="/" component={Home} />
  //   </Switch>
  // </HashRouter>
  )
}

export default App;
