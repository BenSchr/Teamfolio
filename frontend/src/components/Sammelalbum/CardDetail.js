import { Box, Chip, DialogContent, useTheme } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Slide from "@material-ui/core/Slide";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import ApartmentIcon from "@material-ui/icons/Apartment";
import CakeIcon from "@material-ui/icons/Cake";
import CloseIcon from "@material-ui/icons/Close";
import HomeIcon from "@material-ui/icons/Home";
import VideogameAssetIcon from "@material-ui/icons/VideogameAsset";
import WorkIcon from "@material-ui/icons/Work";
import axios from "axios";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
const styles = (theme) => ({
  title: {
    margin: 0,
    padding: theme.spacing(1),
  },
  closeButton: {
    color: theme.palette.grey[500],
  },
  list:{
    '&::-webkit-scrollbar': {
      width: '0.4em'
    },
    '&::-webkit-scrollbar-track': {
      boxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)',
      webkitBoxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)'
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: 'rgba(0,0,0,.2)',
      outline: '0px solid slategrey'
    },
    overflowY:"auto",maxHeight:"60vh"
  }
});

const useStyles = makeStyles((theme) => ({
  root: {
    minHeight: "80vh",
    maxHeight: "80vh",
  },
  grid: {
    width: "100%",
    minHeight: "60vh",
    maxHeight: "80vh",
    flexGrow: 1,
    margin: 0,
    padding: 0,
    marginBottom: 10,
  },
  media: {
    maxWidth: "100%",
  },
  avatar: {
    height: "100%",
    width: "auto",
    borderRadius: 180,
    padding: "5px",
  },
  quizButton: {
    fontSize: "1.5em",
  },
  right: {
    margin: 0,
  },
  leftDetail: {
    backgroundColor: "#616161",
    borderRadius: "5px",
    padding: "5px",
    boxShadow:
      "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
    maxHeight: "70vh",
    minHeight: "70vh",
  },
  table: {
    "& *": { border: "none" },
  },
  leftChipBox: {
    display: "flex",
    justifyContent: "center",
    flexWrap: "wrap",
    "& > *": {
      margin: theme.spacing(0.5),
    },
    fontSize: "0.8rem",
    [theme.breakpoints.up("md")]: {
      fontSize: "0.9rem",
    },
  },
  nameBox: {
    fontSize: "2rem",
    [theme.breakpoints.up("md")]: {
      fontSize: "3rem",
    },
  },
}));

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const DialogTitle = withStyles(styles)((props) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.title} {...other}>
      <Grid container justify="space-between">
        <Grid item>
          <Typography variant="h6">{children}</Typography>
        </Grid>
        <Grid item>
          {onClose ? (
            <IconButton
              aria-label="close"
              className={classes.closeButton}
              onClick={onClose}
            >
              <CloseIcon />
            </IconButton>
          ) : null}
        </Grid>
      </Grid>
    </MuiDialogTitle>
  );
});

const DetailList = withStyles(styles)((props) => {
  const steckbrief = props.steckbrief;
  const classes = props.classes
  return (
    <List className={classes.list}>
      {steckbrief.map((item) => (
        <ListItem key={item.frage_id}>
          {/* <ListItemAvatar>
            <HelpIcon fontSize="large" />
          </ListItemAvatar> */}
          <ListItemText
            primary={<Typography variant="h6">{item.frage}</Typography>}
            secondary={
              <Typography variant="h5" color="primary" gutterBottom>
                {item.antwort}
              
              </Typography>
            }
          />
        </ListItem>
      ))}
    </List>
  );
});

export function CardDetail(props) {
  const [steckbrief, setSteckbrief] = useState([]);
  const [error, setError] = useState(null);
  const {
    onClose,
    openQuiz,
    user_id,
    open,
    username,
    abteilung,
    wohnort,
    geburtsdatum,
    gesammelt,
  } = props;
  const classes = useStyles();
  const theme = useTheme();
  const [scroll] = React.useState("paper");

  const handleClose = () => {
    onClose();
  };

  const handleQuizStart = () => {
    onClose();
    openQuiz();
  };

  useEffect(() => {
    const getResults = async () => {
      try {
        if (open) {
          const response = await axios.get(
            `http://localhost:8000/user/` + user_id + `/steckbrief`
          );
          setSteckbrief(response.data);
        }
      } catch (err) {
        setError(err);
      }
    };

    getResults();
  }, [user_id, open]);

  

  return open ? (
    <Dialog
      scroll={scroll}
      onClose={handleClose}
      aria-labelledby="simple-dialog-title"
      open={open}
      TransitionComponent={Transition}
      fullWidth
      maxWidth={"lg"}
    >
      {error != null ? console.log(error) : null}
      <DialogTitle onClose={handleClose}></DialogTitle>
      <DialogContent>
        <Grid container className={classes.grid} spacing={1}>
          <Grid
            container
            item
            justify="center"
            alignItems="center"
            xs={12}
            md={4}
            spacing={0}
            className={classes.leftDetail}
          >
            <Grid
              item
              xs={12}
              style={{
                height: "55%",
                minHeight: "55%",
                maxHeight: "55%",
                textAlign: "center",
              }}
            >
              <img
                src={
                  "/static/images/profiles/" +
                  user_id.toString() +
                  ".jpg"
                }
                alt={username}
                className={classes.avatar}
              />
            </Grid>
            <Grid
              item
              xs={12}
              style={{
                height: "40%",
                minHeight: "40%",
                maxHeight: "40%",
                textAlign: "center",
              }}
            >
              <List>
                <ListItem style={{ display: "flex", justifyContent: "center" }}>
                  <Typography variant="body1" className={classes.nameBox}>
                    {username}
                  </Typography>
                </ListItem>
                {gesammelt ? (
                  <ListItem className={classes.leftChipBox}>
                    <Chip
                      color="secondary"
                      icon={<ApartmentIcon />}
                      label={abteilung}
                      style={{
                        padding: "5px",
                        height: "40px",
                        fontSize: "1.5em",
                      }}
                    />
                    <Chip
                      color="secondary"
                      icon={<WorkIcon />}
                      label="Grafiker"
                      style={{
                        padding: "5px",
                        height: "40px",
                        fontSize: "1.5em",
                      }}
                    />
                    {wohnort !== null ? (
                      <Chip
                        color="secondary"
                        icon={<HomeIcon />}
                        label={wohnort}
                        style={{
                          padding: "5px",
                          height: "40px",
                          fontSize: "1.5em",
                        }}
                      />
                    ) : null}
                    {geburtsdatum !== null ? (
                      <Chip
                        color="secondary"
                        icon={<CakeIcon />}
                        label={geburtsdatum}
                        style={{
                          padding: "5px",
                          height: "40px",
                          fontSize: "1.5em",
                        }}
                      />
                    ) : null}
                  </ListItem>
                ) : null}
              </List>
            </Grid>
          </Grid>
          <Grid item xs={1}></Grid>
          <Grid
            container
            item
            className={classes.right}
            alignItems="center"
            justify="center"
            md={6}
            xs={12}
          >
            {gesammelt ? (
              <Grid container item xs={12} justify="center">
                <DetailList username={username} steckbrief={steckbrief} />
              </Grid>
            ) : (
              <Grid item xs={12}>
                <Typography variant="h4">
                  Du hast  <Box color={theme.palette.primary.main} display="inline">{username}</Box> noch nicht gesammelt, starte jetzt das
                   <Box color={theme.palette.primary.main} display="inline"> Quiz</Box> !
                </Typography>
              </Grid>
            )}
            <Grid item container xs={12} justify="space-around">
              <Grid item>
              <Button
                variant="contained"
                color="primary"
                size="large"
                startIcon={<VideogameAssetIcon />}
                className={classes.quizButton2}
                onClick={handleQuizStart}
              >
                Quiz jetzt starten
              </Button></Grid>
            </Grid>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  ) : null;
}

CardDetail.propTypes = {
  user_id: PropTypes.number,
  onClose: PropTypes.func.isRequired,
  openQuiz: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  username: PropTypes.string,
};
