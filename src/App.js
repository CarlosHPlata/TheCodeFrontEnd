import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

import Home from "./src/screens/home";
import NewUser from './src/screens/newUser';

import 'materialize-css/dist/css/materialize.min.css';

export default function App() {
  return (
    <Router>
      <div className="Ap">
       <nav>
         <div className="container">
            <ul id="nav-mobile" class="right hide-on-med-and-down">
               <li><Link to="/">Home</Link></li>
            </ul>
         </div>
       </nav>

       <Switch>
          <Route path="/user/:id">
            <NewUser />
          </Route>
          <Route path="/user">
            <NewUser />
          </Route>
          <Route path="/">
            <Home />
          </Route>
        </Switch>
    </div>
    </Router>
  );
}

