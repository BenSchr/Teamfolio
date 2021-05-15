import React from 'react';
import PropTypes from 'prop-types';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import { makeStyles} from '@material-ui/core/styles';
import {CardDetail} from './CardDetail';
import {QuizCard} from './QuizCard';
import LockOpenTwoToneIcon from '@material-ui/icons/LockOpenTwoTone';
import { useState } from 'react';


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
  const {user_id,name,gesammelt,beruf} = props
//   const [gesammelt,setGesammelt]=useState(false)
//   const [beruf,setBeruf]=useState(props.beruf)

//   // This will launch only if propName value has chaged.
// useEffect(() => { setGesammelt(props.gesammelt); setBeruf(props.beruf); console.log("Gesammelt!") }, [props.gesammelt,props.beruf]);


  const handleClickOpen = () => {
    console.log("Hello");
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
          image={"/static/images/profiles/"+((user_id<11)?user_id.toString():"profile_placeholder")+".jpg"}
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
      <CardDetail user_id={user_id} username={name} open={openCard} onClose={handleClose} openQuiz={handleQuizOpen} />
      <QuizCard open={openQuizCard} onClose={handleQuizClose} user_id={user_id} updateUserState={props.updateUserState} />
      </Card>
      



        )
    
}

MyCard.propTypes = {
  user_id: PropTypes.number,
  name: PropTypes.string,
  beruf: PropTypes.string,
  gesammelt: PropTypes.bool,
  updateUserState:PropTypes.func.isRequired,
}