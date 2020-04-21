import React, { Component } from "react";
import { connect } from "react-redux";

import { withStyles } from "@material-ui/core/styles";
import compose from "recompose/compose";
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
import { getloginUser } from "../actions/userAction";
import { makeStyles } from "@material-ui/core/styles";
import QuizMode from "../components/QuizMode";
import quizQuestions from "../Api/quizQuestions";
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

class QuizPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoggedIn: false,
      user: {},
      userDataGet: [],
      showQuiz: false,
      quizDesc: "Welcome to Rubby Quiz"
    };
  }
  componentDidMount() {
    debugger;
    var userData = this.props;
    this.props.getloginUser(data => {
      if (data) {
        if (data.logged_in) {
          this.setState({ isLoggedIn: true, user: data.user });
        } else {
          this.handleClick();
        }
      } else {
        this.handleClick();
      }
    });
  }
  componentDidUpdate(prev) {
    var pp = prev;
    debugger;
  }
  loginStatus = () => {
    axios
      .get("http://localhost:3001/logged_in", { withCredentials: true })
      .then(response => {
        if (response.data.logged_in) {
          this.handleLogin(response);
        } else {
          this.handleLogout();
        }
      })
      .catch(error => console.log("api errors:", error));
  };

  handleClick = () => {
    axios
      .delete("http://localhost:9095/logout", { withCredentials: true })
      .then(response => {
        //this.props.handleLogout();
        this.props.history.push("/");
      })
      .catch(error => console.log(error));
  };
  handleStartGameClick = () => {
    this.props.history.push("/mainquiz");
  };
  render() {
    //const classes = useStyles();
    //this.useStyles.root

    const { classes } = this.props;
    return (
      <React.Fragment>
        {this.state.isLoggedIn ? (
          <div>
            {/* Welcome :{this.state.user.firstname}
            <Link to="/logout" onClick={this.handleClick}>
              Log Out
            </Link> */}
            <div className="quiz-preview-main">
              <div className="quiz-intro d-flex">
                <div className="quiz-column">
                  <div className="intro-inner">
                    <div className="quiz-intro-head">
                      <img src="/assets/winner.png" />
                      <span className="quiz-prev-count">
                        Lets Take A Quiz !!!
                      </span>
                    </div>
                    <div
                      className="quiz-prev-des"
                      dangerouslySetInnerHTML={{
                        __html: this.state.quizDesc
                      }}
                    />
                    <img
                      src="/assets/img-quiz.png"
                      width="140"
                      className="img-fix"
                    />
                    <strong className="content-title">Practice Mode</strong>
                    <span className="quiz-info d-flex">
                      {quizQuestions.length} Questions
                    </span>
                    <div className="d-flex h-center">
                      {/* <Button
                        onClick={this.handleStartGameClick}
                        className="btn btn-primary"
                      >
                        Start Game
                      </Button> */}
                      <Button
                        onClick={this.handleStartGameClick}
                        variant="contained"
                        color="primary"
                      >
                        Start Game
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : null}
        {this.state.showQuiz ? <QuizPage /> : null}
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
//export default QuizPage;
const mapStateToProps = state => {
  debugger;
  return {
    userDataGet: state.userReducer.userDataGet
  };
};
export default compose(
  withStyles(useStyles),
  connect(mapStateToProps, { getloginUser })
)(QuizPage);
