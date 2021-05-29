import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import LockOpenTwoToneIcon from '@material-ui/icons/LockOpenTwoTone';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { CardDetail } from './CardDetail';
import { QuizCard } from './QuizCard';


const useStyles = makeStyles({
  root: {
    textAlign: "center",  
    '&:hover':{
      "box-shadow": "-1px 10px 50px 5px rgba(0,0,0,0.8)"
    }
  },
  media: {
    height: 240,
    maxHeight:"30vh"
  },
  
});


 export function MyCard(props){
  const classes = useStyles();
  const [openCard, setOpenCard] = useState(false);
  const [openQuizCard, setOpenQuizCard] = useState(false);
  const {user_id,name,gesammelt,beruf,currentUser} = props


  const handleClickOpen = () => {
    setOpenCard(true);
  };

  const handleClose = () => {
    setOpenCard(false);
  };

  const handleQuizClose =() =>{
    setOpenQuizCard(false);
  }

  const handleQuizOpen =() =>{
    setOpenQuizCard(true);
  }




        return(    
  
    <Card className={classes.root} elevation={2}> 
      <CardActionArea
      onClick={handleClickOpen}>
        <CardMedia className={classes.media}
          image={"/static/images/profiles/"+(user_id.toString())+".jpg"}
          title={name}>{(!gesammelt)?(<LockOpenTwoToneIcon style={{ fontSize: 100, marginTop:"25%"}} color="secondary"/>):<div/>}</CardMedia>
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">
          {name}
          </Typography>
          <Typography variant="body2" color="textSecondary" component="p">
            {beruf}
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardDetail user_id={user_id} username={name} open={openCard} onClose={handleClose} openQuiz={handleQuizOpen} {...props} />
      <QuizCard open={openQuizCard} onClose={handleQuizClose} user_id={user_id} updateUserState={props.updateUserState} collected={gesammelt} currentUser={currentUser} />
      </Card>

        )
    
}

MyCard.propTypes = {
  user_id: PropTypes.number,
  name: PropTypes.string,
  beruf: PropTypes.string,
  gesammelt: PropTypes.bool,
  updateUserState:PropTypes.func.isRequired,
  currentUser: PropTypes.number
}