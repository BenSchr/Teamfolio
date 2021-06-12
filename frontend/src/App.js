
import red from '@material-ui/core/colors/red';
import CssBaseline from '@material-ui/core/CssBaseline';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import React, { useState } from 'react';
import {
  HashRouter as Router,

  Route, Switch
} from "react-router-dom";
import './App.css';
import { Erfolge } from './components/Erfolge/Erfolge';
import { Login } from './components/Login/Login';
import { NavigationBar } from './components/Navigation/NavigationBar';
import { Sammelalbum } from './components/Sammelalbum/Sammelalbum';



function App(props) {
  const[pagename,setPagename] = React.useState("Test")
  const [token, setToken] = useState();
  const [currentUser, setCurrentUser] = useState();

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

  if(!token||currentUser===null) {
   
    return  <ThemeProvider theme={darkTheme}><Login setToken={setToken} setCurrentUser={setCurrentUser} /></ThemeProvider>
  }


return (   
<ThemeProvider theme={darkTheme}>
<Router>
    <div className="App">
    <React.Fragment>
    <CssBaseline />
    <NavigationBar pagename={pagename} currentUser={currentUser}  setCurrentUser={setCurrentUser}/>
     {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
        <Switch>
          <Route path="/statistics">
          <p>Statistiken</p>
          </Route>
          <Route path="/achievements">
            <Erfolge updatePagename={setPagename} currentUser={currentUser}/>
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
