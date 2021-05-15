import React from "react";
import PropTypes from "prop-types";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import Dialog from "@material-ui/core/Dialog";
import { withStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Slide from "@material-ui/core/Slide";
import Typography from "@material-ui/core/Typography";
import Avatar from "@material-ui/core/Avatar";
import Grid from "@material-ui/core/Grid";
import { Chip, DialogContent } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import WorkIcon from "@material-ui/icons/Work";
import CodeIcon from '@material-ui/icons/Code';
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Button from '@material-ui/core/Button';
import VideogameAssetIcon from '@material-ui/icons/VideogameAsset';
import { useState, useEffect } from 'react';
import axios from 'axios';

const styles = (theme) => ({
  root: {
    minHeight: "80vh",
    maxHeight: "80vh",
  },
  title: {
    margin: 0,
    padding: theme.spacing(2),
  },
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
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
    direction: "row",
    alignItems: "stretch",
    justifyContent: "center",
    margin: 0,
    marginBottom: 10,
  },
  media: {
    maxWidth: "100%",
  },
  avatar: {
    width: "100%",
    height: "auto",
  },
  quizButton:{
    fontSize:"1.5em"
  },
  right:{
    // maxHeight:"60vh",
    // overflow:"auto",
     maxWidth:"80vw"
  }
}));

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const DialogTitle = withStyles(styles)((props) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.title} {...other}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton
          aria-label="close"
          className={classes.closeButton}
          onClick={onClose}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const DetailList = ((props) => { 
  const username = props.username;
  const steckbrief = props.steckbrief

  return(<List>
  <ListItem>
    <Typography variant="h3">{username}</Typography>
  </ListItem>
  <ListItem>
    <ListItemAvatar>
      <WorkIcon fontSize="large" />
    </ListItemAvatar>
    <ListItemText
      primary={<Typography variant="h5">Abteilung</Typography>}
      secondary={
        <Typography variant="subtitle1" gutterBottom>
          <Chip
            label="Marketing"
            color="secondary"
          />
        </Typography>
      }
    />
  </ListItem>
  {steckbrief.map((item)=>(
    <ListItem key={item.frage_id}>
      <ListItemAvatar>
      <CodeIcon fontSize="large" />
    </ListItemAvatar>
    <ListItemText
      primary={<Typography variant="h5">{item.frage}</Typography>}
      secondary={
        <Typography variant="subtitle1" gutterBottom>
          <Chip
            label={item.antwort}
            color="secondary"
          />
        </Typography>
      }
    />
    </ListItem>
))}
</List> 
)})

export function CardDetail(props) {
  const [steckbrief, setSteckbrief] = useState([])
  const [error, setError] = useState(null)
  const { onClose, openQuiz, user_id,open, username } = props;
  const classes = useStyles();
  
  const [scroll] = React.useState("paper");

  const handleClose = () => {
    onClose();
  };
  
  const handleQuizStart= () =>{
    onClose();
    openQuiz();
  }

  useEffect(() => {
    const getResults = async () => {
     
  
      try {
        const response = await axios.get(`http://localhost:8000/user/`+user_id+`/steckbrief`);
        console.log(response)
        setSteckbrief(response.data)
      } catch (err) {
        setError(err)
      }
  
    
    };
  
    getResults();
  }, [user_id])

  return (
    <Dialog
      scroll={scroll}
      onClose={handleClose}
      aria-labelledby="simple-dialog-title"
      open={open}
      TransitionComponent={Transition}
      fullWidth
      maxWidth={"lg"}
    >
      {error!=null?console.log(error):null}
      <DialogTitle onClose={handleClose}>{}</DialogTitle>
      <DialogContent>
        <Grid container className={classes.grid}>
          <Grid
            container item
            className={classes.left}
            alignItems="center"
            justify="center"
            spacing={0}
            md={5}
            xs={12}
          >
            <Grid item>
              <Avatar
                alt="testavatar"
                src={"/static/images/profiles/"+((user_id<11)?user_id.toString():"profile_placeholder")+".jpg"}
                className={classes.avatar}
              ></Avatar>
            </Grid>
          </Grid>
          <Grid
            container item
            className={classes.right}
            alignItems="center"
            justify="flex-start"
            direction="column"
            padding={3}
            md={6}
            xs={12}
          >
            <Grid item>
            {(user_id<6)?
             <DetailList username={username} steckbrief={steckbrief}/>:<div/>}
            </Grid>
            <Grid item>
              <Button variant="contained" color="primary" startIcon={<VideogameAssetIcon />} className={classes.quizButton} onClick={handleQuizStart}>Quiz jetzt starten</Button>
            </Grid>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
}

CardDetail.propTypes = {
  user_id: PropTypes.number,
  onClose: PropTypes.func.isRequired,
  openQuiz : PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  username: PropTypes.string,
};
