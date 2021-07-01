import {
  Card,
  CardContent,
  CardMedia,
  Button,
  CircularProgress,
  Container,
  Grid,
  Typography,FormControl,
  MenuItem,Paper
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import axios from "axios";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import Select from "@material-ui/core/Select";

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

function renderLoading(classes) {
  return (
    <Grid
      container
      alignItems="center"
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
      </Container>
    </Grid>
  );
}

function renderStats(value){
 return( <Paper style={{height:"100%"}}>
   <Grid container justify="center" alignItems="center" style={{height:"100%"}}><Grid item>
  <Typography variant="h2">{value}%</Typography></Grid>
  </Grid>
</Paper>)

}

export function ErfolgVergleich(props) {
  const [results, setResults] = useState([]);
  const [collectedUser,setCollectedUser]= useState([]);
  const [compareResults, setCompareResults] = useState([]);
  const [achievementStats,setAchievementStats]=useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const classes = useStyles();
  const [compareValue,setCompareValue]=useState(0)
  const currentUser = props.currentUser;
  const setCompare = props.setCompare;

  useEffect(() => {
    const getResults = async () => {
      setLoading(true);

      try {
        const response = await axios.get(
          `http://localhost:8000/user/` + currentUser + `/get_achievements`
        );
        setResults(response.data);
        
        const collectedResponse= await axios.get(
          `http://localhost:8000/user/` + currentUser + `/collected`
        );
        setCollectedUser(collectedResponse.data)

        const resultAchievementStats= await axios.get(
          `http://localhost:8000/erfolge/stats`
        );
        setAchievementStats(resultAchievementStats.data)

      } catch (err) {
        console.log(err);
        setError(err.message);
      }

      setLoading(false);
    };

    getResults();
  }, [currentUser]);


  const getCompareUser = async (compareUserId) => {
    
      try {
        const response = await axios.get(
          `http://localhost:8000/user/` + compareUserId + `/get_achievements`
        );
        setCompareResults(response.data);

      } catch (err) {
        console.log(err);
        setError(err.message);
      }
      
    };

  const handleCompareSelectChange = event =>{
    var value = event.target.value;
    setCompareValue(value)
    if(value>0){
    getCompareUser(value)}
    else{setCompareResults([])}
  }




  return (
    <React.Fragment>
      {error != null && error}
      {loading && renderLoading(classes)}

      <Grid
        container
        spacing={2}
        alignItems="center"
        style={{ width: "100%", margin: 0, textAlign: "center" }}
      >
        <Grid
          container
          item
          justify="space-evenly"
          xs={12}
          style={{ margin: 0 }}
        >
          <Grid item xs={2} style={{fontSize:"1.5em"}}>
            <Button variant="outlined" fullWidth onClick={() => setCompare(false)}>
              Go back
            </Button>
          </Grid>
          <Grid item xs={2}>
          <FormControl className={classes.formControl}  fullWidth style={{margin:0}} >
                <Select
                  labelId="select-compare-label"
                  id="selectCompare"
                  name="selectCompare"
                  value={compareValue}
                  onChange={handleCompareSelectChange}
                >
                  <MenuItem value={0}>Alle</MenuItem>
                {collectedUser.map((x)=>(
                  <MenuItem value={x.user_id} key={"select_user_"+x.user_id}>{x.vorname+" "+x.nachname}</MenuItem>
                ))}
                </Select>
              </FormControl>
          </Grid>
        </Grid>
        {results.map((x,i) => (
          <Grid key={"row_erfolg_"+x.erfolg_id}
            container
            item
            justify="space-evenly"
            xs={12}
            style={{ margin: 0 }}
          >
            <Grid item xs={2}  >
              <Card >
                <CardMedia style={{ textAlign: "center" }} title={x.name}>
                  <img
                    style={{ height: 140, width: "auto" }}
                    src={
                      "./static/images/erfolge/" +
                      (x.gesammelt === 1 ? x.bildpfad : "erfolg0") +
                      ".png"
                    }
                    alt={x.name}
                  />
                </CardMedia>
                <CardContent style={{ textAlign: "center" }}>
                  <Typography variant="h5">{x.name}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={2}>
            {compareResults.length>0?(
            <Card>
                <CardMedia style={{ textAlign: "center" }} title={x.name} >
                  <img
                    style={{ height: 140, width: "auto" }}
                    src={
                      "./static/images/erfolge/" +
                      (compareResults[i].gesammelt === 1 ? x.bildpfad : "erfolg0") +
                      ".png"
                    }
                    alt={x.name}
                  />
                </CardMedia>
                <CardContent style={{ textAlign: "center" }}>
                  <Typography variant="h5">{x.name}</Typography>
                </CardContent>
              </Card>):achievementStats.length>0?renderStats(achievementStats[i].percent):null}
            </Grid>
          </Grid>
        ))}
      </Grid>

    </React.Fragment>
  );
}

ErfolgVergleich.propTypes = {
  currentUser: PropTypes.number.isRequired,
  setCompare: PropTypes.func.isRequired,
};
