import { Typography } from "@material-ui/core";
import AppBar from '@material-ui/core/AppBar';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import Grid from "@material-ui/core/Grid";
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Slide from '@material-ui/core/Slide';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import useScrollTrigger from '@material-ui/core/useScrollTrigger';
import DateRangeIcon from '@material-ui/icons/DateRange';
import EqualizerIcon from '@material-ui/icons/Equalizer';
import LocalActivityIcon from '@material-ui/icons/LocalActivity';
import MenuIcon from '@material-ui/icons/Menu';
import RecentActorsIcon from '@material-ui/icons/RecentActors';
import PropTypes from 'prop-types';
import React, { useState } from "react";
import { Link } from "react-router-dom";


const useStyles = makeStyles(theme =>({
    drawer:{
        width:"10vw",
        minWidth:"250px",
        maxWidth:"100vw"
    },
    appBar:{
      backgroundColor:theme.palette.appbarColor,
    }
    
  }));

  function HideOnScroll(props) {
    const { children} = props;
    // Note that you normally won't need to set the window ref as useScrollTrigger
    // will default to window.
    // This is only being set here because the demo is in an iframe.
    const trigger = useScrollTrigger();
  
    return (
      <Slide appear={false} direction="down" in={!trigger}>
        {children}
      </Slide>
    );
  }
  HideOnScroll.propTypes = {
    children: PropTypes.element.isRequired,
  };


export function NavigationBar(props) {
  const theme = useTheme();
  const classes = useStyles(theme);
  const [isOpen,setOpen] = useState(false);
  const pagename = props.pagename;
    
  const toggleDrawer = (open) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
          return;
        }
        setOpen(open);
      };

      const list = (          
        <div
          role="presentation"
          onClick={toggleDrawer(false)}
          onKeyDown={toggleDrawer(false)}
          className={classes.drawer}
        >

        <Typography  variant="h4" gutterBottom style={{margin:20}}>Hello World</Typography>
            <Divider></Divider>
          <List>
              <ListItem button component={Link} to="/">
              <ListItemIcon>  <RecentActorsIcon/></ListItemIcon>
                <ListItemText primary={"Sammelalbum"} />
              </ListItem>
              <ListItem button component={Link} to="/statistics">
              <ListItemIcon>   <EqualizerIcon/></ListItemIcon>
                <ListItemText primary={"Statistiken"} />
              </ListItem>
              <ListItem button component={Link} to="/achievements">
              <ListItemIcon> <LocalActivityIcon/></ListItemIcon>
                <ListItemText primary={"Erfolge"} />
              </ListItem>
              <ListItem button>
              <ListItemIcon>  <DateRangeIcon/></ListItemIcon>
                <ListItemText primary={"Lunchdate"} />
              </ListItem>
          </List>
        </div>
          
      );
    


    return (
        <React.Fragment>
          <HideOnScroll {...props}>
        <AppBar position="sticky" className={classes.appBar}>
          <Toolbar>
          <Grid justify={"space-between"} alignItems={"center"} container>
            <Grid xs={1} item container alignItems={"center"} justify={"flex-start"}>
            <Grid item xs={6}>
             <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={toggleDrawer(true)}
            edge="start"
          >
            <MenuIcon />
          </IconButton>
          <Drawer open={isOpen} onClose={toggleDrawer(false)}>
            {list}
          </Drawer></Grid>
         
          <Grid item xs={6}><Typography variant="h6">{pagename}</Typography></Grid>
          </Grid>
         
          <Grid item xs={1}>
          <div style={{textAlign:"center"}}><img alt="teamfolio logo" src="/static/images/logo/teamfolio_logo.png" height="auto" width="100%"/></div>
          </Grid>
          <Grid item xs={2}></Grid>
          </Grid>
          
          </Toolbar>
        </AppBar>
      </HideOnScroll>
          </React.Fragment>
    );
      
  }
  NavigationBar.propTypes = {
    pagename: PropTypes.string,
  }