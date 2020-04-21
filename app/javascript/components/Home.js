import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import compose from "recompose/compose";
import { connect } from "react-redux";
import axios from "axios";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Link from "@material-ui/core/Link";
import Paper from "@material-ui/core/Paper";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import BackgroundImg from "../../assets/images/img.jpeg";
import Snackbar from "@material-ui/core/Snackbar";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import {
  ValidatorForm,
  TextValidator,
  SelectValidator
} from "react-material-ui-form-validator";
import { loginUser } from "../actions/userAction";
import { makeStyles } from "@material-ui/core/styles";
const useStyles = theme => ({
  root: {
    height: "100vh"
  },
  image: {
    //backgroundImage: `url(${BackgroundImg})`,
    backgroundImage: "url('/assets/img.jpeg')",
    backgroundRepeat: "no-repeat",
    backgroundColor:
      theme.palette.type === "light"
        ? theme.palette.grey[50]
        : theme.palette.grey[900],
    backgroundSize: "cover",
    backgroundPosition: "center"
  },
  paper: {
    margin: theme.spacing(8, 4),
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1)
  },
  submit: {
    margin: theme.spacing(3, 0, 2)
  }
});

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      openSnackBar: false,
      openSnackBarMsg: "",
      username: "",
      email: "",
      password: "",
      errors: ""
    };
  }
  handleClick = () => {
    axios
      .delete("http://localhost:9095/logout", { withCredentials: true })
      .then(response => {
        props.handleLogout();
        props.history.push("/");
      })
      .catch(error => console.log(error));
  };
  closeSnackBar = () => {
    this.setState({
      openSnackBar: false,
      openSnackBarMsg: ""
    });
  };
  handleChange = event => {
    const { name, value } = event.target;
    this.setState({
      [name]: value
    });
  };
  redirect = () => {
    this.props.history.push("/quizpage");
  };
  handleSubmit = event => {
    event.preventDefault();
    const { username, email, password } = this.state;
    let user = {
      username: email,
      email: email,
      password: password
    };
    let user1 = {
      user: {
        username: email,
        email: email,
        password: password
      }
    };
    this.props.loginUser(user1, data => {
      debugger;
      if (data) {
        this.props.handleLogin(data);
        this.redirect();
      } else {
        this.setState({
          openSnackBar: true,
          openSnackBarMsg: "Failed to login."
        });
      }
    });
    // axios
    //   .post("http://localhost:9095/login", { user }, { withCredentials: true })
    //   .then(response => {
    //     if (response.data.logged_in) {
    //       this.props.handleLogin(response.data);
    //       this.redirect();
    //     } else {
    //       this.setState({
    //         errors: response.data.errors
    //       });
    //     }
    //   })
    //   .catch(error => console.log("api errors:", error));
  };
  render() {
    //const classes = useStyles();
    //this.useStyles.root
    const { username, email, password } = this.state;
    const { classes } = this.props;
    return (
      <React.Fragment>
        <Snackbar
          anchorOrigin={{
            vertical: "top",
            horizontal: "center"
          }}
          open={this.state.openSnackBar}
          autoHideDuration={6000}
          onClose={this.closeSnackBar}
          message={this.state.openSnackBarMsg}
          action={
            <React.Fragment>
              <IconButton
                size="small"
                aria-label="close"
                color="inherit"
                onClick={this.closeSnackBar}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            </React.Fragment>
          }
        />
        <Grid container component="main" className={classes.root}>
          <CssBaseline />
          <Grid item xs={false} sm={4} md={7} className={classes.image} />
          <Grid
            item
            xs={12}
            sm={8}
            md={5}
            component={Paper}
            elevation={6}
            square
          >
            <div className={classes.paper}>
              <Avatar className={classes.avatar}>
                <LockOutlinedIcon />
              </Avatar>
              <Typography component="h1" variant="h5">
                Sign in
              </Typography>
              <ValidatorForm
                onSubmit={this.handleSubmit}
                className={classes.form}
              >
                <TextValidator
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  label="Email Address"
                  onChange={this.handleChange}
                  name="email"
                  value={email}
                  validators={["required", "isEmail"]}
                  errorMessages={["Email is required", "Email is not valid"]}
                />
                <TextValidator
                  variant="outlined"
                  label="Password"
                  margin="normal"
                  onChange={this.handleChange}
                  name="password"
                  value={password}
                  validators={["required"]}
                  errorMessages="Password is required."
                  type="password"
                  fullWidth
                />

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  className={classes.submit}
                >
                  Sign In
                </Button>
                <Grid container>
                  <Grid item>
                    <Link href="/signup" variant="body2">
                      {"Don't have an account? Sign Up"}
                    </Link>
                  </Grid>
                </Grid>
              </ValidatorForm>
            </div>
          </Grid>
        </Grid>
      </React.Fragment>
    );
  }

  //   return (
  //     <div>
  //       <Link to="/login">Log In</Link>
  //       <br></br>
  //       <Link to="/signup">Sign Up</Link>
  //       <br></br>
  //       {props.loggedInStatus ? (
  //         <Link to="/logout" onClick={handleClick}>
  //           Log Out
  //         </Link>
  //       ) : null}
  //     </div>
  //   );
}
//export default Home;
const mapStateToProps = state => {
  return {
    //message: state.userReducer.message
  };
};
//export default compose(withStyles(useStyles))(Home);
export default compose(
  withStyles(useStyles),
  connect(mapStateToProps, {
    loginUser
  })
)(Home);
