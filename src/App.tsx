import React from 'react';
import {
  HashRouter,
  Switch,
  Route,
} from "react-router-dom";
import Home from './page/home'
const App: React.FC = () => {
  return (
    <Home />
    // <HashRouter>
    //   <Switch>
    //     <Route path="/" component={Home} />
    //   </Switch>
    // </HashRouter>
  )
}

export default App;
