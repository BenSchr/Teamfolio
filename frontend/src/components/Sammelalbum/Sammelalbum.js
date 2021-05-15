import React from "react";
import axios from 'axios';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import { useState, useEffect } from 'react';
import {MyCard} from './MyCard';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from "prop-types";
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles((theme) => ({
    body:{background: "#121212"},
    root: {
      background: theme.palette.background.default,
  },
    grid: {
      flexGrow: 1,
      width:"100%",
      margin:0,
    },
    paper: {
      textAlign: 'center',
      padding: theme.spacing(1),
      color: "white",
      margin:0,
    },
    control: {
      padding: theme.spacing(2),
    },
  }));




  

export function Sammelalbum(props) {
    const [results, setResults] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [spacing]= useState(3);
    const [openSnackbar,setOpenSnackbar]=useState({open:false,state:"success",message:"Snackbar message"})
    const classes = useStyles();
    const updatePagename = props.updatePagename;
    const currentUser = 2

    const createEntry = async () => {
      try {
        const response = await axios.post(`http://localhost:8000/collection/create`,{user_id_aktiv:2,user_id_passiv:1});
        if(response.status===200){ updateUserState(1,true);
          console.log(response);
        setOpenSnackbar({open:true,state:"success",message:"User added to database"})}
      } catch (error) {
        setOpenSnackbar({open:true,state:"error",message:error.response.data.detail})
      }
    }

    const resetEntry = async () => {
      try {
        const response = await axios.delete(`http://localhost:8000/collection/delete`,{data:{user_id_aktiv:2,user_id_passiv:1}});
        if(response.status===200&&response.data.numDelRows>0){updateUserState(1,false);
          setOpenSnackbar({open:true,state:"success",message:response.data.numDelRows+" Entries deleted from database"})}
          else{setOpenSnackbar({open:true,state:"error",message:response.data.numDelRows+" Entries deleted from database"})}
      } catch (error) {
        console.log(error)
        setOpenSnackbar({open:true,state:"error",message:error.message})}
      }
    

    const updateUserState = (id,state)=>{
      results.forEach(row => {if(row.user_id===id){row.gesammelt=state}})
      setResults([...results])
    };

    useEffect(() => {
      const getResults = async () => {
        setLoading(true)
        
        try {
          const response = await axios.get(`http://localhost:8000/user/`+currentUser+`/collection`);
          setResults(response.data)
        } catch (err) {
          setError(err)
        }
  
        setLoading(false)
      };

      updatePagename("Sammelalbum")
      document.title = "Teamfolio | Sammelalbum"
  
      getResults();
    }, [updatePagename,currentUser])

    

    return ( <React.Fragment>{loading ? (<Container maxWidth="xl">
      <Grid container className={classes.grid} spacing={spacing} justify="center" alignItems="center"   style={{height:"80vh"}} >
        <Grid item xs={2} style={{textAlign:"center"}}><p>Content loading...</p>
        <CircularProgress /></Grid>
        </Grid></Container>
        ) : (<Container maxWidth="xl">
          <Grid container className={classes.grid} spacing={spacing}>
            <Grid item xs={12}></Grid>
              {results.map((result) => (
                <Grid key={"MyCard_"+result.user_id} item  xs={6} xl={2} >
                  <MyCard  user_id={result.user_id} name={result.vorname+" "+result.nachname} beruf={result.beruf} gesammelt={result.gesammelt} updateUserState={updateUserState} />
                </Grid>
              ))}

<Grid item xs={2}><Button variant="contained" onClick={createEntry} color="primary">Add User 1</Button></Grid>
<Grid item xs={2}><Button variant="contained" onClick={resetEntry} color="primary">Remove User 1</Button></Grid>
            </Grid>
            <Snackbar open={openSnackbar.open} autoHideDuration={3000} onClose={()=>setOpenSnackbar({...openSnackbar,open:false})} >
            <Alert onClose={()=>setOpenSnackbar({...openSnackbar,open:false})} severity={openSnackbar.state}>
          {openSnackbar.message}
        </Alert>
            </Snackbar>
            </Container>
            
            
        )}
      {error && <div>{error.message}</div>}
      </React.Fragment>)
  }

  Sammelalbum.propTypes = {
    updatePagename : PropTypes.func.isRequired,
  };