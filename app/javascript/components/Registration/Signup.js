import React, { Component } from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import {
  ValidatorForm,
  TextValidator,
  SelectValidator
} from "react-material-ui-form-validator";
import { withStyles } from "@material-ui/core/styles";
import compose from "recompose/compose";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import PropTypes from "prop-types";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import { createUser } from "../../actions/userAction";
import Snackbar from "@material-ui/core/Snackbar";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import { isEmpty, validateEmail } from "../../../helpers/validator";
import axios from "axios";
const useStyles = theme => ({
  paper: {
    marginTop: theme.spacing(8),
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
    marginTop: theme.spacing(3)
  },
  submit: {
    margin: theme.spacing(3, 0, 2)
  }
});
class Signup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      openSnackBar: false,
      openSnackBarMsg: "",
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      password_confirmation: "",
      errors: "",
      isFError: false,
      isLError: false,
      isEError: false,
      isPError: false,
      message: "",
      frstNameError: "",
      lastNameError: "",
      emailError: "",
      passError: ""
    };
  }
  handleChange = event => {
    const { name, value } = event.target;
    if (event.target.name === "password") {
      this.form.isFormValid(false);
    }
    //   if (name === "firstName" && isEmpty(value)) {
    //     this.setState({
    //       isFError: true,
    //       frstNameError: "First name is required."
    //     });
    //   }
    //   else
    //   {this.setState({
    //     isFError: false,
    //     frstNameError: ""
    //   });

    //   }

    // if (name === "lastName" && isEmpty(value)) {
    //     this.setState({
    //       isLError: true,
    //       lastNameError: "Last name is required."
    //     });
    //   }
    //   else
    //   {this.setState({
    //     isLError: false,
    //     lastNameError: ""
    //   });

    //   }
    //    if (name === "email" && isEmpty(value)) {
    //     this.setState({
    //       isEError: true,
    //       emailError: "Email is required."
    //     });
    //   }
    //   else
    //   {this.setState({
    //     isEError: false,
    //     emailError: ""
    //   });

    //   }

    //   if (name === "email" && !validateEmail(value)) {
    //     this.setState({
    //       isError: true,
    //       emailError: "Enter valid email."
    //     });
    //   }
    //   else
    //   {this.setState({
    //     isEError: false,
    //     emailError: ""
    //   });

    //   }

    //   if (name === "password" && isEmpty(value)) {
    //     this.setState({
    //       isPError: true,
    //       passError: "Password is required."
    //     });
    //   }
    //   else
    //   {this.setState({
    //     isPError: false,
    //     passError: ""
    //   });

    //   }

    this.setState({
      [name]: value
    });
  };
  closeSnackBar = () => {
    this.setState({
      openSnackBar: false,
      openSnackBarMsg: ""
    });
  };
  componentDidMount() {
    // custom rule will have name 'isPasswordMatch'
    ValidatorForm.addValidationRule("isPasswordMatch", value => {
      const { password } = this.state;
      if (value !== password) {
        return false;
      }
      return true;
    });
  }
  validUser() {
    if (
      !this.state.isFError ||
      !this.state.isLError ||
      !this.state.isEError ||
      !this.state.isPError
    ) {
      return false;
    }
    return true;
  }
  handleSubmit = event => {
    event.preventDefault();
    const {
      firstName,
      lastName,
      email,
      password,
      password_confirmation
    } = this.state;
    if (isEmpty(firstName)) {
      this.setState({
        isFError: true,
        frstNameError: "First name is required."
      });
    }
    if (isEmpty(lastName)) {
      this.setState({
        isLError: true,

        lastNameError: "Last name is required."
      });
    }
    if (isEmpty(email)) {
      this.setState({
        isEError: true,

        emailError: "Email is required."
      });
    }
    if (isEmpty(password)) {
      this.setState({
        isPError: true,

        passError: "Password is required."
      });
    }
    let user = {
      firstname: firstName,
      lastname: lastName,
      email: email,
      password: password,
      password_confirmation: password_confirmation
    };
    let user1 = {
      user: {
        username: email,
        firstname: firstName,
        lastname: lastName,
        email: email,
        password: password,
        password_confirmation: password_confirmation
      }
    };
    // { "user" : {"name":"Dave", "firstname":"Rob", "lastname":"Bert",
    //  "password":"superpass", "password_confirmation":"superpass"}}

    this.props.createUser(user1, data => {
      debugger;
      if (data) {
        this.setState({
          openSnackBar: true,
          openSnackBarMsg: "User Created Successfully."
        });
        this.props.handleLogin(data);
        this.redirect();
      } else {
        this.setState({
          openSnackBar: true,
          openSnackBarMsg: "Failed to create user."
        });
      }
    });

    // axios
    //   .post("http://localhost:9095/users", { user }, { withCredentials: true })
    //   .then(response => {
    //     if (response.data.status === "created") {
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
  redirect = () => {
    this.props.history.push("/");
  };
  handleErrors = () => {
    return (
      <div>
        <ul>
          {this.state.errors.map(error => {
            return <li key={error}>{error}</li>;
          })}
        </ul>
      </div>
    );
  };
  render() {
    const { classes } = this.props;
    const snackbarOpen = !isEmpty(this.props.message);
    const {
      firstName,
      lastName,
      email,
      password,
      password_confirmation
    } = this.state;
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
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <div className={classes.paper}>
            <Avatar className={classes.avatar}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign up
            </Typography>
            <ValidatorForm
              ref={r => (this.form = r)}
              onSubmit={this.handleSubmit}
              className={classes.form}
            >
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextValidator
                    fullWidth
                    variant="outlined"
                    label="First Name"
                    onChange={this.handleChange}
                    name="firstName"
                    value={firstName}
                    validators={["required"]}
                    errorMessages="First name is required."
                    autoFocus
                    // error={this.state.isFError}
                    // helperText={this.state.frstNameError}
                    // onChange={this.handleChange}
                    // autoComplete="fname"
                    // name="firstName"
                    // value={firstName}
                    // variant="outlined"
                    // required
                    // fullWidth
                    // id="firstName"
                    // label="First Name"
                    // autoFocus
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextValidator
                    fullWidth
                    variant="outlined"
                    label="Last Name"
                    onChange={this.handleChange}
                    name="lastName"
                    value={lastName}
                    validators={["required"]}
                    errorMessages="Last name is required."

                    // error={this.state.isLError}
                    // helperText={this.state.lastNameError}
                    // variant="outlined"
                    // required
                    // fullWidth
                    // id="lastName"
                    // label="Last Name"
                    // name="lastName"
                    // value={lastName}
                    // autoComplete="lname"
                    // onChange={this.handleChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextValidator
                    variant="outlined"
                    fullWidth
                    label="Email"
                    onChange={this.handleChange}
                    name="email"
                    value={email}
                    validators={["required", "isEmail"]}
                    errorMessages={["Email is required", "Email is not valid"]}

                    // error={this.state.isEError}
                    // helperText={this.state.emailError}
                    // variant="outlined"
                    // required
                    // fullWidth
                    // id="email"
                    // label="Email Address"
                    // name="email"
                    // value={email}
                    // autoComplete="email"
                    // onChange={this.handleChange}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextValidator
                    variant="outlined"
                    label="Password"
                    onChange={this.handleChange}
                    name="password"
                    value={password}
                    validators={["required"]}
                    errorMessages="Password is required."
                    type="password"
                    fullWidth
                    // error={this.state.isPError}
                    // helperText={this.state.passError}
                    // variant="outlined"
                    // required
                    // fullWidth
                    // name="password"
                    // value={password}
                    // label="Password"
                    // type="password"
                    // id="password"
                    // autoComplete="current-password"
                    // onChange={this.handleChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextValidator
                    label="Confirm Password"
                    onChange={this.handleChange}
                    name="password_confirmation"
                    type="password"
                    validators={["isPasswordMatch", "required"]}
                    errorMessages={[
                      "Password Mismatch",
                      "Confirm Password is required."
                    ]}
                    value={password_confirmation}
                    variant="outlined"
                    fullWidth

                    // variant="outlined"
                    // label="Password"
                    // onChange={this.handleChange}
                    // name="password_confirmation"
                    // value={password_confirmation}
                    // validators={["required"]}
                    // errorMessages="Password is required."
                    // type="password"
                    // fullWidth
                    // error={this.state.isPError}
                    // helperText={this.state.passError}
                    // variant="outlined"
                    // required
                    // fullWidth
                    // name="password"
                    // value={password}
                    // label="Password"
                    // type="password"
                    // id="password"
                    // autoComplete="current-password"
                    // onChange={this.handleChange}
                  />
                </Grid>
              </Grid>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
              >
                Sign Up
              </Button>
              <Grid container justify="flex-end">
                <Grid item>
                  <Link href="/" variant="body2">
                    Already have an account? Sign in
                  </Link>
                </Grid>
              </Grid>
            </ValidatorForm>
            <div>{this.state.errors ? this.handleErrors() : null}</div>
          </div>
        </Container>
      </React.Fragment>
    );
  }
}

Signup.propTypes = {
  classes: PropTypes.object.isRequired,
  component: PropTypes.object
};
const mapStateToProps = state => {
  return {
    //message: state.userReducer.message
  };
};

export default compose(
  withStyles(useStyles),
  connect(mapStateToProps, {
    createUser
  })
)(Signup);
// const mapStateToProps = state => ({
//   courseID: state.course.course.CourseID
// });
// const structuredSelector = createStructuredSelector({
//   things: state => state.things
// });

// const mapDispatchToProps = { createUser };

// export default compose(
//   withStyles(useStyles),
//   connect(structuredSelector, mapDispatchToProps)
// )(Signup);
