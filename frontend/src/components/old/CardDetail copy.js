import React from 'react';
import PropTypes from 'prop-types';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import { withStyles,useTheme } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import SwipeableViews from 'react-swipeable-views';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';

import Grid from '@material-ui/core/Grid';

import { DialogContent } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import {TabPanel} from './TabPanel';
const styles = (theme) => ({

  root:{
    minHeight: '80vh',
    maxHeight: '80vh',
  },
  title: {
    margin: 0,
    padding: theme.spacing(2), 
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
});

const useStyles = makeStyles( theme=> ({
  root:{
    minHeight: '80vh',
    maxHeight: '80vh',
  },
  grid: {
    width:'100%',
    minHeight: '80vh',
    maxHeight: '80vh',
    flexGrow: 1,
    direction:'row',
    alignItems:"flex-start",
    justifyContent:'center',
    margin:0,
    marginBottom:10,
  },
  media: {
    maxWidth:'100%',
  },}));
  

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});


const DialogTitle = withStyles(styles)((props) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.title} {...other}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>

  );
});


function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}



 export function CardDetail(props){
  
  const { onClose, value, open } = props;
  const classes = useStyles();
  const theme = useTheme();
  const [scroll, setScroll] = React.useState('paper');

  const [tabValue, setTabValue] = React.useState(0);
  const handleChange = (event, newValue) => {
    setTabValue(newValue);
  };
  const handleChangeIndex = (index) => {
    setTabValue(index);
  };

  const handleClose = () => {
    onClose();
  };

        return(    
          <Dialog scroll={scroll}  onClose={handleClose} aria-labelledby="simple-dialog-title" open={open} TransitionComponent={Transition}  fullWidth maxWidth={"md"} >
            <DialogTitle onClose={handleClose}>
            {"Dialog Title"}
            </DialogTitle>
          <DialogContent>
         
            <SwipeableViews
        axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
        index={tabValue}
        onChangeIndex={handleChangeIndex}
      >
           
            <TabPanel tabValue={tabValue} index={0}>
            <Grid item xs={12} md={4}>
            <img className={classes.media} src="/static/images/profiles/profile_placeholder.png"></img>
            </Grid>
            <Grid item xs={10}>
        Item One  </Grid>
      </TabPanel>
      <TabPanel tabValue={tabValue} index={1}>
        Item Two
      </TabPanel>
     </SwipeableViews>
             
          </DialogContent>
          <Tabs value={tabValue} onChange={handleChange} aria-label="cardTabs"  centered    variant="fullWidth" indicatorColor="secondary">
          <Tab label="Item One" {...a11yProps(0)} />
          <Tab label="Item Two" {...a11yProps(1)} />
        </Tabs>
          </Dialog>
          

   
        )
    
}

CardDetail.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  value: PropTypes.number
}