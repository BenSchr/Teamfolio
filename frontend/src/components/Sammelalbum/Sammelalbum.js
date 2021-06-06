import {
  AppBar,
  Checkbox,
  FormControlLabel,
  MenuItem,
  Toolbar
} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import CircularProgress from "@material-ui/core/CircularProgress";
import Container from "@material-ui/core/Container";
import FormControl from "@material-ui/core/FormControl";
import Grid from "@material-ui/core/Grid";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import Snackbar from "@material-ui/core/Snackbar";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import LockOpenTwoToneIcon from "@material-ui/icons/LockOpenTwoTone";
import MuiAlert from "@material-ui/lab/Alert";
import axios from "axios";
import _ from "lodash";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { MyCard } from "./MyCard";

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

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

const DummyCard = (props) => {
  return (
    <Card elevation={2} styles={{ textAlign: "center" }}>
      <CardActionArea>
        <CardMedia
          style={{ height: 240, maxHeight: "30vh", textAlign: "center" }}
          image={"/static/images/profiles/profile_placeholder.jpg"}
          title={"Dummy User"}
        >
          <LockOpenTwoToneIcon
            style={{
              fontSize: 100,
              height: 240,
              maxHeight: "30vh",
            }}
            color="secondary"
          />
        </CardMedia>
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">
            {"Dummy User"}
          </Typography>
          <Typography variant="body2" color="textSecondary" component="p">
            {"DummyBeruf"}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export function Sammelalbum(props) {
  const [results, setResults] = useState([]);
  const [filteredResults, setFilteredResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dummyUser, setDummyUser] = useState(true);

  const [filterState, setFilterState] = React.useState({
    filterGesammelt: "",
    filterAbteilung: "",
    filterName: "",
  });
  const [spacing] = useState(3);
  const [openSnackbar, setOpenSnackbar] = useState({
    open: false,
    state: "success",
    message: "Snackbar message",
    duration: null,
  });
  const classes = useStyles();
  const updatePagename = props.updatePagename;
  const currentUser = props.currentUser;
  const abteilungen = ["Marketing", "Controlling", "UI/UX", "IT", "Admins"];

  const handleFilterChange = (event) => {
    var tmpResults = [...results];
    var tmpFilterState = filterState;
    tmpFilterState[event.target.name] = event.target.value;
    setFilterState({ ...filterState, [event.target.name]: event.target.value });
    tmpResults = filterCollected(tmpFilterState.filterGesammelt, tmpResults);
    tmpResults = filterAbteilung(tmpFilterState.filterAbteilung, tmpResults);
    tmpResults = filterName(tmpFilterState.filterName, tmpResults);
    setFilteredResults(tmpResults);
  };

  function filterCollected(state, objects) {
    if (state === "") {
      return objects;
    } else {
      return objects.filter(
        (entry) => entry.gesammelt === (state === "true" ? true : false)
      );
    }
  }

  function filterAbteilung(state, objects) {
    if (state === "") {
      return objects;
    } else {
      return objects.filter((entry) => entry.abteilung === state);
    }
  }

  function filterName(state, objects) {
    if (state === "") {
      return objects;
    } else {
      return objects.filter((entry) => entry.vorname.includes(state));
    }
  }

  function filterReset() {
    setFilterState({
      filterGesammelt: "",
      filterAbteilung: "",
      filterName: "",
    });
    setFilteredResults([...results]);
  }
 
  const resetEntry = async () => {
    try {
      const response = await axios.delete(
        `http://localhost:8000/collection/delete`,
        { data: { user_id_aktiv: 2, user_id_passiv: 1 } }
      );
      const response2 = await axios.delete(
        `http://localhost:8000/erfolg/delete`,
        { data: { user_id: 2, erfolg_id: 2 } }
      );
      if (response.status === 200 && response.data.numDelRows > 0 && response2.status === 200) {
        updateUserState(1, false);
        setOpenSnackbar({
          open: true,
          state: "success",
          message: response.data.numDelRows + " Entries deleted from database",
          duration: 3000,
        });
      } else {
        setOpenSnackbar({
          open: true,
          state: "error",
          message: response.data.numDelRows + " Entries deleted from database",
        });
      }
    } catch (error) {
      console.log(error);
      setOpenSnackbar({
        open: true,
        state: "error",
        message: error.message,
        duration: 3000,
      });
    }
  };

  const updateUserState = (id, state) => {
    results.forEach((row) => {
      if (row.user_id === id) {
        row.gesammelt = state;
      }
    });
    setResults([...results]);
  };

  useEffect(() => {
    const getResults = async () => {
      setLoading(true);

      try {
        console.log("CurrentUser: " + currentUser);
        const response = await axios.get(
          `http://localhost:8000/user/` + currentUser + `/collection`
        );
        setResults(response.data);
        setFilteredResults(response.data);
      } catch (err) {
        setError(err.message);
      }

      setLoading(false);
    };

    updatePagename("Sammelalbum");
    document.title = "teamfolio";

    getResults();
  }, [updatePagename, currentUser]);

  return (
    <React.Fragment>
      <AppBar color="inherit" position="sticky">
        <Toolbar>
          <Grid container alignItems="center">
            <Grid item xs={2} style={{ textAlign: "center" }}>
              <FormControl className={classes.formControl}>
                <InputLabel id="sammel-filter-label">
                  Gesammelte Karten
                </InputLabel>
                <Select
                  labelId="sammel-filter-label"
                  id="filterGesammelt"
                  name="filterGesammelt"
                  value={filterState.filterGesammelt}
                  onChange={handleFilterChange}
                >
                  <MenuItem value={""}>Alle</MenuItem>
                  <MenuItem value={"true"}>Gesammelt</MenuItem>
                  <MenuItem value={"false"}>Nicht Gesammelt</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={2} style={{ textAlign: "center" }}>
              <FormControl className={classes.formControl}>
                <InputLabel id="abteilung-filter-label">Abteilung</InputLabel>
                <Select
                  labelId="abteilung-filter-label"
                  id="filterAbteilung"
                  name="filterAbteilung"
                  value={filterState.filterAbteilung}
                  onChange={handleFilterChange}
                >
                  <MenuItem value={""}>Alle</MenuItem>
                  {abteilungen.map((entry, index) => {
                    return (
                      <MenuItem key={index} value={entry}>
                        {entry}
                      </MenuItem>
                    );
                  })}
                  ;
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={2} style={{ textAlign: "center" }}>
              <FormControl className={classes.formControl}>
                <InputLabel htmlFor="filterName">Name</InputLabel>
                <Input
                  type="text"
                  id="filterName"
                  name="filterName"
                  label="name"
                  value={filterState.filterName}
                  onChange={handleFilterChange}
                  autoComplete="off"
                />
              </FormControl>
            </Grid>
            <Grid
              item
              xs={2}
              style={{ textAlign: "left", alignSelf: "center" }}
            >
              <Button onClick={filterReset} variant="outlined" color="default">
                Reset Filters
              </Button>
            </Grid>
            <Grid item xs={2} style={{ textAlign: "right" }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={dummyUser}
                    onChange={(event) => setDummyUser(event.target.checked)}
                    name="checkedDummyUser"
                    color="primary"
                  />
                }
                label="DummyUser"
              />
            </Grid>
            <Grid item xs={1} style={{ textAlign: "right" }}>
              <Button variant="contained" onClick={resetEntry} color="primary">
                Reset Demo
              </Button>
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>

      {loading ? (
        <Container maxWidth="xl">
          <Grid
            container
            className={classes.grid}
            spacing={spacing}
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
      ) : (
        <Container maxWidth="xl">
          <Grid container className={classes.grid} spacing={spacing}>
            <Grid item xs={12}></Grid>
            {filteredResults.map((result) => (
              <Grid key={"MyCard_" + result.user_id} item xs={6} xl={2}>
                <MyCard
                  user_id={result.user_id}
                  name={result.vorname + " " + result.nachname}
                  beruf={result.beruf}
                  gesammelt={result.gesammelt}
                  updateUserState={updateUserState}
                  currentUser={currentUser}
                  setOpenAchievementBar={setOpenSnackbar}
                  {...result}
                />
              </Grid>
            ))}

            {dummyUser
              ? _.times(20, (i) => (
                  <Grid key={"Dummy_" + i} item xs={6} xl={2}>
                    <DummyCard />
                  </Grid>
                ))
              : null}
          </Grid>
          <Snackbar
            open={openSnackbar.open}
            autoHideDuration={openSnackbar.duration}
            onClose={() => setOpenSnackbar({ ...openSnackbar, open: false })}
          >
            <Alert
              onClose={() => setOpenSnackbar({ ...openSnackbar, open: false })}
              severity={openSnackbar.state}
            >
              {openSnackbar.message}
            </Alert>
          </Snackbar>
        </Container>
      )}
      {error && <div>{error.message}</div>}
    </React.Fragment>
  );
}

Sammelalbum.propTypes = {
  updatePagename: PropTypes.func.isRequired,
  currentUser: PropTypes.number.isRequired,
};
