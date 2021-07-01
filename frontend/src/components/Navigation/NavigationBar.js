import { Button, Typography } from "@material-ui/core";
import AppBar from "@material-ui/core/AppBar";
import Avatar from "@material-ui/core/Avatar";
import Divider from "@material-ui/core/Divider";
import Drawer from "@material-ui/core/Drawer";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Slide from "@material-ui/core/Slide";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Toolbar from "@material-ui/core/Toolbar";
import useScrollTrigger from "@material-ui/core/useScrollTrigger";
import DateRangeIcon from "@material-ui/icons/DateRange";
import EqualizerIcon from "@material-ui/icons/Equalizer";
import LocalActivityIcon from "@material-ui/icons/LocalActivity";
import MenuIcon from "@material-ui/icons/Menu";
import RecentActorsIcon from "@material-ui/icons/RecentActors";
import axios from "axios";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  drawer: {
    width: "10vw",
    minWidth: "250px",
    maxWidth: "100vw",
  },
  appBar: {
    backgroundColor: theme.palette.appbarColor,
  },
  activePage:{
    borderLeft:"2px solid",
    borderColor:theme.primary
  }
}));

function HideOnScroll(props) {
  const { children } = props;
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
  const [isOpen, setOpen] = useState(false);
  const pagename = props.pagename;
  const currentUser = props.currentUser;
  const [user, setUser] = useState({});
  const setCurrentUser = props.setCurrentUser;




  const logout=() => {
    setCurrentUser(null)
  }




  const toggleDrawer = (open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setOpen(open);
  };

  useEffect(() => {
    const getResults = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/user/` + currentUser
        );
        setUser(response.data);
      } catch (err) {
        console.log(err);
      }
    };

    getResults();
  }, [currentUser]);


  const list = (
    <div
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
      className={classes.drawer}
    >
       <Grid
        container
        spacing={2}
        style={{ padding: 10, maxWidth: "100%" }}
        alignItems="center"
      >         <Grid item>
         
          <Avatar
            alt="Remy Sharp"
            src={"./static/images/profiles/" + user.user_id + ".jpg"}
          />
        </Grid>
        <Grid item>
          <Typography variant="body1">
            {user.vorname} {user.nachname}
          </Typography>
        </Grid>
      </Grid>
  
      <Divider></Divider>
      <List>
        <ListItem button component={Link} to="/" >
          <ListItemIcon>
            <RecentActorsIcon  />
          </ListItemIcon>
          <ListItemText primary={"Sammelalbum"}/>
        </ListItem>
        <ListItem button>
          <ListItemIcon>
            <EqualizerIcon />
          </ListItemIcon>
          <ListItemText primary={"Statistiken"} />
        </ListItem>
        <ListItem button component={Link} to="/achievements">
          <ListItemIcon>
            <LocalActivityIcon />
          </ListItemIcon>
          <ListItemText primary={"Erfolge"} />
        </ListItem>
        <ListItem button>
          <ListItemIcon>
            <DateRangeIcon />
          </ListItemIcon>
          <ListItemText primary={"Lunchdate"} />
        </ListItem>
      </List>
      <Button style={{position:"absolute",bottom:10,left:0}} onClick={logout} fullWidth>Logout</Button>
    </div>
  );

  return (
    <React.Fragment>
      <HideOnScroll {...props}>
        <AppBar position="sticky" className={classes.appBar}>
          <Toolbar>
            <Grid justify={"flex-start"} alignItems={"center"} container>
              <Grid
                xs={4}
                item
                container
                alignItems={"center"}
                justify={"flex-start"}
              >
                <Grid item xs={1}>
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
                  </Drawer>
                </Grid>

                <Grid item xs={6}>
                  <Typography variant="h6">{pagename}</Typography>
                </Grid>
              </Grid>
              <Grid item xs={4}>
                <div style={{ textAlign: "center" }}>
                  <img
                    alt="teamfolio logo"
                    src="./static/images/logo/teamfolio_logo.png"
                    height="40px"
                    width="auto"
                  />
                </div>
              </Grid>
              <Grid item xs={2}>

        
              </Grid>
            </Grid>
          </Toolbar>
        </AppBar>
      </HideOnScroll>
    </React.Fragment>
  );
}
NavigationBar.propTypes = {
  pagename: PropTypes.string,
  currentUser: PropTypes.number,
  setCurrentUser: PropTypes.func,
};
