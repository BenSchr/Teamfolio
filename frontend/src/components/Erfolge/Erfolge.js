import { makeStyles } from "@material-ui/core/styles";
import MuiAlert from "@material-ui/lab/Alert";
import axios from "axios";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";

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

export function Erfolge(props) {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const classes = useStyles();
  const updatePagename = props.updatePagename;
  const currentUser = props.currentUser;
  






  useEffect(() => {
    const getResults = async () => {
      setLoading(true);

      try {
        console.log("CurrentUser: " + currentUser);
        const response = await axios.get(
          `http://localhost:8000/user/` + currentUser + `/collection`
        );
        setResults(response.data);
      } catch (err) {
        setError(err);
      }

      setLoading(false);
    };

    updatePagename("Erfolge");
    document.title = "teamfolio";

    getResults();
  }, [updatePagename, currentUser]);

  return (
    <React.Fragment>
            <p>Erfolge</p>
    </React.Fragment>
  );
}

Erfolge.propTypes = {
  updatePagename: PropTypes.func.isRequired,
  currentUser: PropTypes.number.isRequired,
};
