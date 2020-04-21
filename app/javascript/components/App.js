import React, { Component } from "react";
import axios from "axios";
import { withStyles } from "@material-ui/core/styles";
import compose from "recompose/compose";
import { connect } from "react-redux";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Home from "./Home";
import QuizPage from "./QuizPage";

import QuizMode from "./QuizMode";
import Login from "../components/Registration/Login";
import Signup from "../components/Registration/Signup";
import Button from "@material-ui/core/Button";
import Snackbar from "@material-ui/core/Snackbar";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import { isEmpty } from "../../helpers/validator";
import { Provider } from "react-redux";
import configureStore from "../configureStore";
import setMessage from "../actions/userAction";
export const store = configureStore({});
const useStyles = theme => ({
  textField: {
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2)
  }
});
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoggedIn: false,
      user: {}
    };
  }
  componentDidMount() {
    this.loginStatus();
  }
  loginStatus = () => {
    axios
      .get("http://localhost:9095/logged_in", { withCredentials: true })
      .then(response => {
        if (response.data.logged_in) {
          this.handleLogin(response);
        } else {
          this.handleLogout();
        }
      })
      .catch(error => console.log("api errors:", error));
  };
  handleLogin = data => {
    this.setState({
      isLoggedIn: true,
      user: data.user
    });
  };
  closeSnackBar() {
    this.props.setMessage("");
  }
  handleLogout = () => {
    this.setState({
      isLoggedIn: false,
      user: {}
    });
  };
  render() {
    const snackbarOpen = !isEmpty(this.props.message);
    return (
      <div>
        <Snackbar
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left"
          }}
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={this.closeSnackBar}
          message={this.props.message}
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

        <BrowserRouter>
          <Provider store={store}>
            <Switch>
              <Route
                exact
                path="/"
                render={props => (
                  <Home
                    {...props}
                    handleLogin={this.handleLogin}
                    handleLogout={this.handleLogout}
                    loggedInStatus={this.state.isLoggedIn}
                  />
                )}
              />
              <Route
                exact
                path="/login"
                render={props => (
                  <Login
                    {...props}
                    handleLogin={this.handleLogin}
                    loggedInStatus={this.state.isLoggedIn}
                  />
                )}
              />
              <Route
                exact
                path="/signup"
                render={props => (
                  <Signup
                    {...props}
                    handleLogin={this.handleLogin}
                    loggedInStatus={this.state.isLoggedIn}
                  />
                )}
              />
              <Route
                exact
                path="/quizpage"
                render={props => (
                  <QuizPage
                    {...props}
                    handleLogin={this.handleLogin}
                    loggedInStatus={this.state.isLoggedIn}
                    userDetail={this.state.user}
                  />
                )}
              />
              <Route
                exact
                path="/mainquiz"
                render={props => (
                  <QuizMode
                    {...props}
                    handleLogin={this.handleLogin}
                    loggedInStatus={this.state.isLoggedIn}
                    userDetail={this.state.user}
                  />
                )}
              />
            </Switch>
          </Provider>
        </BrowserRouter>
      </div>
    );
  }
}
const mapStateToProps = state => {
  debugger;
  return {
    message: state.userReducer.message
  };
};

export default App;
