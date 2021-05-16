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
import {  DialogContent } from "@material-ui/core";
import Button from '@material-ui/core/Button';
import LinearProgress from '@material-ui/core/LinearProgress';
import Box from '@material-ui/core/Box';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Divider from '@material-ui/core/Divider';

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
  questionGrid:{
      height:"60vh",
      direction:"row",
      alignItems:"center",
      justifyContent:"space-evenly",
      textAlign:"center",
      spacing:3,
  },
  quizButton:{
    height:"100%",
    width:"100%",
    fontSize:"1.5em",
    color:"lightblack"
  }
});





const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
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

function LinearProgressWithLabel(props) {
  const { progress, maxStep,currentStep} = props;
  return (
    <Box display="flex" alignItems="center">
      <Box width="100%" mr={1}>
        <LinearProgress variant="determinate"  value={progress} style={{height:"5px"}}/>
      </Box>
      <Box minWidth={35}>
        <Typography variant="body1" color="primary">{currentStep} / {maxStep}</Typography>
      </Box>
    </Box>
  );
}

const QuizQuestion = withStyles(styles)((props) => {
  const { question , catalog, nextStep, classes } = props;
  return (
    <Grid container justify="center" alignItems="center" spacing={3}>
      <Grid item xs={12}>
        <Typography variant="h4" align="center" gutterBottom>
          {question}
        </Typography>
      </Grid>
     
      <Grid container item className={classes.questionGrid}>
      {catalog.map((option)=> (
          <Grid key={"option_"+option} item xs={12} md={5} style={{ height: "40%" }}>
          <Button
            variant="contained"
            onClick={nextStep.bind(this,option)}
            className={classes.quizButton}
          >
           {option}
          </Button>
        </Grid>
      ))}
      </Grid>
    </Grid>
  );
});


export function QuizCard(props) {
  const [quizList, setQuizlist] = useState([]);
  const { onClose, open, user_id,updateUserState,collected } = props;
  const [scroll] = useState("paper");
  const [activeStep, setActiveStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [numCorrect,setNumCorrect] = useState(0);
  const progressInc = 100/quizList.length;
  

  useEffect(() => {
    const getResults = async () => {
  
      try {
        const response = await axios.get(`http://localhost:8000/user/`+user_id+`/quiz`);
        setQuizlist(response.data)
      } catch (err) {
        console.log(err)
      }
  
      
    };
  
    getResults();
  }, [user_id])

  const createEntry = async () => {
    try {
      const response = await axios.post(`http://localhost:8000/collection/create`,{user_id_aktiv:props.currentUser,user_id_passiv:user_id});
      if(response.status===200){updateUserState(1,true);
        console.log(response);}
    } catch (error) {
      console.log(error)
    }
  }

  function getStepContent(step) {
    const quiz_item = quizList[step]
    return <QuizQuestion question={quiz_item.frage} catalog={quiz_item.catalog} nextStep={handleNext}></QuizQuestion>;
  }

  const checkCorrectAnswer = (answer) =>{
    if(quizList[activeStep].antwort_original===answer){setNumCorrect((prevNumCorrect)=> prevNumCorrect+1)}
  };

  const checkWin = () => {
      const win=(numCorrect/quizList.length)>= 0.8;
      if(!collected&&win&&quizList.length>0){createEntry()}
      return win
  }

  const handleReset = () => {
    setActiveStep(0);
    setProgress(0);
    setNumCorrect(0);
  };

  const handleNext = (answer) => {
    checkCorrectAnswer(answer)
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setProgress(progress+progressInc)
  };

  const handleClose = () => {
    onClose();
  };
  
  return (
    open?(   
    <Dialog
      scroll={scroll}
      onClose={handleClose}
      aria-labelledby="simple-dialog-title"
      open={open}
      TransitionComponent={Transition}
      fullWidth
      maxWidth={"lg"}
    >
      <DialogTitle onClose={handleClose}></DialogTitle>
      <DialogContent>
         
        {/* Quizlist Finished */}
        {activeStep === quizList.length ?(
           <Grid container justify="center" style={{textAlign:"center"}}>
          {checkWin()?(
            <Grid item xs={12} >
                <Typography variant={'h2'}>Super!<span style={{position:"absolute"}}>🎉</span></Typography>
            </Grid>
          ):(<Grid item xs={12} >
            <Typography variant={'h2'}>Schade! <span style={{position:"absolute"}}>😓</span></Typography>
        </Grid>)} 
        <Grid item xs={7}><Divider variant="middle" style={{margin:"10px",height: "3px"}}/></Grid>
          <Grid item xs={12}>
            <Typography variant={'h1'} display="inline" color="primary" >{numCorrect} </Typography> 
            <Typography variant={'h1'} display="inline" style={{color:"rgba(255, 255, 255, 0.2)"}}> / </Typography> 
            <Typography variant={'h1'} display="inline" color="primary" >{quizList.length}</Typography> 
            <Typography variant={'h3'} > Fragen korrekt beantwortet!</Typography></Grid>
        <Button onClick={handleReset}>Reset</Button>
          </Grid>
        ) 
        : (
            <Typography component={'span'}>{getStepContent(activeStep)}</Typography>
        )}
           <LinearProgressWithLabel progress={progress} currentStep={activeStep} maxStep={quizList.length} />
      </DialogContent>
    </Dialog>):null
  );

        }
QuizCard.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  user_id: PropTypes.number,
  updateUserState:PropTypes.func.isRequired,
  collected: PropTypes.bool,
  currentUser:PropTypes.number
};

