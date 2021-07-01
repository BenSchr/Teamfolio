import { Card, CardContent, CardMedia, CircularProgress, Container, Grid, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import axios from "axios";
import PropTypes from "prop-types";
import {Button} from "@material-ui/core"
import React, { useEffect, useState } from "react";
import {ErfolgVergleich} from "./ErfolgVergleich"

const useStyles = makeStyles((theme) => ({
  body: { background: "#121212" },
  root: {
    background: theme.palette.background.default,
  },
  grid: {
    flexGrow: 1,
    width: "100%",
    margin: 0,
  },
  paper: {
    textAlign: "center",
    padding: theme.spacing(1),
    color: "white",
    margin: 0,
  },
  control: {
    padding: theme.spacing(2),
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 180,
  },
}));

function renderAchievements(results){
  return( 
        <Grid
        container
        alignItems="center"
        justify="space-around"
        spacing={2}
        style={{ height: "80vh", width: "100vw", margin: 0 }}
      >
    
    {
    results.map((x) => (
      <Grid item xs={2} key={x.erfolg_id}>
        <Card>
          <CardMedia
            style={{textAlign:"center"}}
            title={x.name}
          ><img  style={{height:240,width:"auto"}} src={
            "./static/images/erfolge/" +
            (x.gesammelt === 1 ? x.bildpfad : "erfolg0") +
            ".png"
          } alt={x.name}/></CardMedia>
          <CardContent style={{textAlign:"center"}}>
            <Typography variant="h5">{x.name}</Typography>
          </CardContent>
        </Card>
      </Grid>))}</Grid>
  
    )}

function renderLoading(classes){
  return(
    <Grid
    container
    alignItems="center"
    justify="space-around"
    spacing={2}
    style={{ height: "80vh", width: "100vw", margin: 0 }}
  >
    <Container maxWidth="xl">
    <Grid
      container
      className={classes.grid}
      spacing={2}
      justify="center"
      alignItems="center"
      style={{ height: "80vh" }}
    >
      <Grid item xs={2} style={{ textAlign: "center" }}>
        <p>Content loading...</p>
        <CircularProgress />
      </Grid>
    </Grid>
  </Container></Grid>
  )
}


export function Erfolge(props) {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [compare,setCompare] = useState(false);
  const classes = useStyles();
  const updatePagename = props.updatePagename;
  const currentUser = props.currentUser;

  useEffect(() => {
    const getResults = async () => {
      setLoading(true);

      try {
        const response = await axios.get(
          `http://localhost:8000/user/` + currentUser + `/get_achievements`
        );
        setResults(response.data);
      } catch (err) {
        console.log(err)
        setError(err.message);
      
      }

      setLoading(false);
    };

    updatePagename("Erfolge");
    document.title = "teamfolio";

    getResults();
  }, [updatePagename, currentUser]);




  return (
    <React.Fragment>
  
      {error!=null && error}
      {loading && renderLoading(classes)}
      {compare && <ErfolgVergleich currentUser={currentUser} setCompare={setCompare}/>}
      {!compare && renderAchievements(results)}
      {!compare &&   <Grid item xs={12} style={{textAlign:"center"}}><Button variant="outlined" onClick={()=>setCompare(true)} >Erfolge vergleichen</Button></Grid>}
    </React.Fragment>
  );
}

Erfolge.propTypes = {
  updatePagename: PropTypes.func.isRequired,
  currentUser: PropTypes.number.isRequired,
};
