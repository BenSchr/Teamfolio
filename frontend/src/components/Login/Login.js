
import { makeStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";
import {CssBaseline, useTheme} from "@material-ui/core"
import React from "react";
import { Paper, Grid, TextField, Button, FormControlLabel, Checkbox } from '@material-ui/core';
import { Face, Fingerprint } from '@material-ui/icons'
import {useState} from "react"

const useStyles = makeStyles(theme =>({
        login:{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
        },
        margin: {
          margin: theme.spacing(2)
      },
      padding: {
          padding: theme.spacing(1)
      }
  }));





export function Login(props) {
  const theme = useTheme();
  const classes = useStyles(theme);
  const [userId,setUserId] = useState()

  function login(){
    const user = Number(userId);
    if(user>=1){
    props.setCurrentUser(user);
    props.setToken(true);}
  }

  function handleUserChange(event){
    setUserId(event.target.value)
  }
    return (
        <React.Fragment>
        <CssBaseline/>
        <Grid
  container
  spacing={0}
  direction="column"
  alignItems="center"
  justify="center"
  style={{ minHeight: '100vh', background:"linear-gradient(90deg, rgba(253,29,29,1) 7%, rgba(168,29,253,1) 100%, rgba(252,176,69,1) 100%)" }}
>
       <Paper className={classes.padding}>
                <div className={classes.margin}>

                <Grid container spacing={1} alignItems="center" >
                        <Grid item style={{textAlign:"center",marginBottom:"10px"}} xs={true}>
                          <img src="/static/images/logo/teamfolio_logo.png" alt="teamfolio logo" style={{width:"200px",maxWidth:"60vw",height:"auto"}}></img>
                        </Grid>
                    </Grid>


                    <Grid container spacing={1} alignItems="flex-end">
                        <Grid item>
                            <Face />
                        </Grid>
                        <Grid item md={true} sm={true} xs={true}>
                            <TextField id="username" label="Username" type="email" fullWidth autoFocus required onChange={handleUserChange} autoComplete="off"/>
                        </Grid>
                    </Grid>
                    <Grid container spacing={1} alignItems="flex-end">
                        <Grid item>
                            <Fingerprint />
                        </Grid>
                        <Grid item md={true} sm={true} xs={true}>
                            <TextField id="password" label="Password" type="password" fullWidth required />
                        </Grid>
                    </Grid>
                    <Grid container alignItems="center" justify="space-between">
                        <Grid item>
                            <FormControlLabel control={
                                <Checkbox
                                    color="primary"
                                />
                            } label="Remember me" />
                        </Grid>
                        <Grid item>
                            <Button disableFocusRipple disableRipple style={{ textTransform: "none" }} variant="text" color="primary">Forgot password ?</Button>
                        </Grid>
                    </Grid>
                    <Grid container justify="center" style={{ marginTop: '10px' }}>
                          <Button variant="contained"  disableElevation color="primary" style={{ textTransform: "none" }} onClick={login}>Login</Button>
                    </Grid>
                </div>
            </Paper></Grid>
       </React.Fragment>
    );
      
  }
  Login.propTypes = {
    setToken: PropTypes.func,
    setCurrentUser: PropTypes.func,
  }