import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
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
    },});


export function TabPanel(props) {
    const { children, tabValue, index, ...other } = props;
    const classes = useStyles();

    return (
        <div
          role="tabpanel"
          hidden={tabValue !== index}
          id={`simple-tabpanel-${index}`}
          aria-labelledby={`simple-tab-${index}`}
          {...other}
        >
          {tabValue === index && (
          <Grid container className={classes.grid}>
              {children}
              </Grid>
          )}
        </div>
      );}

      TabPanel.propTypes = {
        children: PropTypes.node,
        index: PropTypes.any.isRequired,
        tabValue: PropTypes.any.isRequired,
      };