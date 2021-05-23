
import './App.css';
import {Sammelalbum} from './components/Sammelalbum/Sammelalbum';
import React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import {Login} from './components/Login/Login'
import {useState} from 'react'
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";

import { NavigationBar } from './components/Navigation/NavigationBar';
import red from '@material-ui/core/colors/red';


function App(props) {
  const[pagename,setPagename] = React.useState("Test")
  const [token, setToken] = useState(true);
  const [currentUser, setCurrentUser] = useState(2);

  const darkTheme = createMuiTheme({
    palette: {
      background: {
        default: "#121212"
      },
      appbarColor: "#212121",
      type: 'dark',
      primary: red,
      secondary: red,
    },
  });

  if(!token) {
   
    return  <ThemeProvider theme={darkTheme}><Login setToken={setToken} setCurrentUser={setCurrentUser} /></ThemeProvider>
  }


return (   
<ThemeProvider theme={darkTheme}>
<Router>
    <div className="App">
    <React.Fragment>
    <CssBaseline />

    <NavigationBar pagename={pagename}/>
     {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
        <Switch>
          <Route path="/statistics">
          <p>Statistiken</p>
          </Route>
          <Route path="/achievements">
            <p>Erfolge</p>
          </Route>
          <Route path="/">
            <Sammelalbum updatePagename={setPagename} currentUser={currentUser}/>
          </Route>
        </Switch>
    </React.Fragment>
    </div></Router>
    </ThemeProvider> 
  );}

export default App;
