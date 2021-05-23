import React from "react";
import PropTypes from "prop-types";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import Dialog from "@material-ui/core/Dialog";
import { withStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Slide from "@material-ui/core/Slide";
import Typography from "@material-ui/core/Typography";
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
import HomeIcon from '@material-ui/icons/Home';
import ApartmentIcon from '@material-ui/icons/Apartment';
import CakeIcon from '@material-ui/icons/Cake';

const styles = (theme) => ({
  title: {
    margin: 0,
    padding: theme.spacing(1),
  },
  closeButton: {

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
    margin: 0,
    padding:0,
    marginBottom: 10,
  },
  media: {
    maxWidth: "100%",
  },
  avatar: {
    height:"100%",
    width:"auto",
    borderRadius:180,
    padding:"5px"
  },
  quizButton:{
    fontSize:"1.5em"
  },
  right:{
    margin:0,    
  },
  leftDetail:{
    backgroundColor:"#616161",
    borderRadius:"5px",
    padding:"5px",
    boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
    maxHeight:"70vh",
    minHeight:"70vh",
  },
  table:{
   "& *":{border:"none"}
  },
  leftChipBox:{
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
    '& > *': {
      margin: theme.spacing(0.5),
    },
    fontSize:"0.8rem",
    [theme.breakpoints.up('md')]: {
      fontSize: '0.9rem',
    },
  },
  nameBox:{
    fontSize:"2rem",
    [theme.breakpoints.up('md')]: {
      fontSize: '3rem',
    },
  }

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
      <Typography variant="h6">{children}</Typography></Grid>
      <Grid item>
      {onClose ? (
        <IconButton
          aria-label="close"
          className={classes.closeButton}
          onClick={onClose}
        >
          <CloseIcon />
        </IconButton>
      ) : null}</Grid></Grid>
    </MuiDialogTitle>
  );
});

const DetailList = ((props) => { 
  const steckbrief = props.steckbrief

  return(<List>
  {steckbrief.map((item)=>(
    <ListItem key={item.frage_id}>
      <ListItemAvatar>
      <CodeIcon fontSize="large" />
    </ListItemAvatar>
    <ListItemText
      primary={<Typography variant="h6">{item.frage}</Typography>}
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
  const { onClose, openQuiz, user_id,open, username,abteilung,wohnort,geburtsdatum,gesammelt } = props;
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
     
  
      try {if(open){
        const response = await axios.get(`http://localhost:8000/user/`+user_id+`/steckbrief`);
        setSteckbrief(response.data)}
      } catch (err) {
        setError(err)
      }
  
    
    };
  
    getResults();
  }, [user_id,open])

  return (open?(
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
      <DialogTitle onClose={handleClose} ></DialogTitle>
      <DialogContent>

        <Grid container className={classes.grid}>

          <Grid container item justify="center" alignItems="center"  xs={12} md={4} spacing={1} className={classes.leftDetail}>
              <Grid item xs={12}  style={{height:"55%",minHeight:"55%",maxHeight:"55%",textAlign:"center"}}>
             
                <img src={"/static/images/profiles/"+((user_id<11)?user_id.toString():"profile_placeholder")+".jpg"} alt={username} className={classes.avatar} />
     
              </Grid>
              <Grid item xs={12} style={{height:"40%",minHeight:"40%",maxHeight:"40%",textAlign:"center"}}>
              <List>
  <ListItem style={{display:'flex', justifyContent:'center'}}>
    <Typography variant="body1" className={classes.nameBox}>{username}</Typography>
  </ListItem>
  <ListItem className={classes.leftChipBox}>
  <Chip color="secondary" icon={<ApartmentIcon />} label={abteilung} style={{padding:"5px", height:"40px",fontSize:"1.5em"}}/>
  <Chip color="secondary" icon={<WorkIcon />} label="Grafiker" style={{padding:"5px", height:"40px",fontSize:"1.5em"}}/>
  {(wohnort!== null)?(<Chip color="secondary" icon={<HomeIcon />} label={wohnort} style={{padding:"5px", height:"40px",fontSize:"1.5em"}}/> ):null}
  {(geburtsdatum!== null)?(<Chip color="secondary" icon={<CakeIcon />} label={geburtsdatum} style={{padding:"5px", height:"40px",fontSize:"1.5em"}}/> ):null}
  </ListItem></List>
              </Grid>
          </Grid>
            {/* <Grid item>
              <Avatar
                alt="testavatar"
                src={"/static/images/profiles/"+((user_id<11)?user_id.toString():"profile_placeholder")+".jpg"}
                className={classes.avatar}
              ></Avatar>
            </Grid>
          </Grid> */}
          <Grid
            container item
            className={classes.right}
            alignItems="center"
            justify="center"
            margin={0}
            md={6}
            xs={12}
          >{(gesammelt)?
            <Grid container item xs={12} justify="center">
            
             <DetailList username={username} steckbrief={steckbrief}/>
            </Grid>:<div/>}
            <Grid item>
              <Button variant="contained" color="primary" startIcon={<VideogameAssetIcon />} className={classes.quizButton} onClick={handleQuizStart}>Quiz jetzt starten</Button>
            </Grid>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  ):null);
}

CardDetail.propTypes = {
  user_id: PropTypes.number,
  onClose: PropTypes.func.isRequired,
  openQuiz : PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  username: PropTypes.string,
  
};
