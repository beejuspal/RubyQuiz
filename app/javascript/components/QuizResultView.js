import React, { Component } from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router";
import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Icon from "@material-ui/core/Icon";
import compose from "recompose/compose";
import { connect } from "react-redux";

import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import ButtonBase from "@material-ui/core/ButtonBase";
import CloseIcon from "@material-ui/icons/Close";
import Confetti from "react-confetti";

function TabContainer(props) {
  return (
    <Typography component="div" style={{ padding: "24px 0" }}>
      {props.children}
    </Typography>
  );
}
const styles = theme => ({
  body: {
    background: "white"
  },
  root: {
    display: "flex",
    flexWrap: "wrap",
    background: "white"
  },
  formControl: {
    margin: theme.spacing(3)
  },
  group: {
    margin: `${theme.spacing(2)}px 0`
  },
  formMultiline: {
    minWidth: 350
  },
  checked: {},
  lightTooltip: {
    background: theme.palette.common.white,
    color: theme.palette.text.primary,
    boxShadow: theme.shadows[1],
    fontSize: 11
  }
});

class QuizResultView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mode: this.props.mode ? this.props.mode : "test",
      // questions: this.props.questions ? this.props.questions : null,

      currentTab: 0,
      showProgress: true,
      quizAnalyticsData: null,
      AnalyticsDataAvailable: true,
      correctPercentageData: null,
      showResultView: false,
      showShareDialog: false,
      shareURL: ""
    };
  }

  intersperse(arr, sep) {
    if (arr.length === 0) {
      return [];
    }

    return arr.slice(1).reduce(
      function(xs, x, i) {
        return xs.concat([sep, x]);
      },
      [arr[0]]
    );
  }

  componentWillMount() {
    let questionIds = [];
  }
  secondsToTime(secs) {
    var hours = Math.floor(secs / (60 * 60));

    var divisor_for_minutes = secs % (60 * 60);
    var minutes = Math.floor(divisor_for_minutes / 60);

    var divisor_for_seconds = divisor_for_minutes % 60;
    var seconds = Math.ceil(divisor_for_seconds);

    var obj = {
      h: hours,
      m: minutes,
      s: seconds
    };

    var stringObj = "";
    if (hours > 0) {
      stringObj += hours + " hr ";
    }
    if (minutes > 0) {
      stringObj += minutes + " min ";
    }
    if (seconds > 0) {
      stringObj += seconds + " secs ";
    }
    return stringObj;
  }

  componentWillUnmount() {}

  handleBackClick = () => {
    this.setState({ showResultView: false });
    //this.props.handleBackClick();
  };

  handleShowAnswerClick = result => {
    //this.props.handleShowAnswerClick(result);
    this.setState({ showResultView: true });
  };

  handleShareClick = () => {
    var url = `${window.location.origin}/result/public/${window.localStorage.UserID}/${this.props.componentID}`;

    this.setState({
      showShareDialog: true,
      shareURL: url
    });
  };
  handleCrossClick = () => {
    this.setState({ showShareDialog: false });
  };

  handleReplayClick = () => {
    this.props.handleBackClick();
  };

  handleProgress(correctPercentage) {
    let colorMap = "#dc143c"; //red
    // let correctPercentage = 1;
    if (correctPercentage > 0) {
      colorMap = correctPercentage !== 100 ? "#ffff66" : "#2eb82e";
    }

    return (
      <Line
        percent={correctPercentage}
        style={{
          width: "100%",
          height: "5px"
        }}
        strokeColor={colorMap}
        value={"5"}
      />
    );
  }
  handleCorrectCountClick = () => {
    this.setState({ currentTab: 0 });
    // this.props.handleBackClick();
  };
  handleCopyLink = () => {
    navigator.clipboard.writeText(this.state.shareURL);
    this.props.setMessage("Link Copied!");
  };
  handleWrongCounttClick = () => {
    this.setState({ currentTab: 1 });
  };
  handleSkipCounttClick = () => {
    this.setState({ currentTab: 2 });
  };

  getSimpleQuestionTypeResult(question, isCorrect) {
    let { showProgress } = this.state;

    let questionTypeID = question.QuestionTypeID;

    let currentClass = isCorrect ? "CORRECT_" : "INCORRECT_";

    let userAnswerSelected = null;

    let correctAnswers = null;

    userAnswerSelected = question.UserAnswerSelected;
    userAnswerSelected = question.SelectedAnswerOption;

    correctAnswers = question.answers.filter(a => a.IsCorrect === true);

    let correctAnswer = "";

    let yourAnswer = "";

    let reason = "";

    switch (questionTypeID) {
      case 1:
        if (userAnswerSelected && userAnswerSelected.length > 0) {
          for (var i = 0; i < userAnswerSelected.length; i++) {
            yourAnswer += userAnswerSelected[i].Answer;
          }
        }
        break;

      case 2:
        yourAnswer = question.UserAnswerText;
        break;

      default:
        yourAnswer = question.UserAnswerText;
        break;
    }

    if (correctAnswers && correctAnswers.length > 0) {
      for (var i = 0; i < correctAnswers.length; i++) {
        correctAnswer += correctAnswers[i].Answer;
      }
    }

    return (
      <div
        className="quiz-result-slot"
        key={currentClass + question.QuestionID}
      >
        <div className="quiz-question-preview">
          <p class="question-num">Question</p>
          <div
            className="quiz-question-response"
            dangerouslySetInnerHTML={{
              __html: question.question
            }}
          />
        </div>
        <div className="d-flex">
          <strong className="quiz-title-left">You Answered:</strong>
          <div
            className={""}
            dangerouslySetInnerHTML={{
              __html: yourAnswer
            }}
          />
        </div>
        {/* {!isEditorEmpty(question.Reason) && (
          <div className="quiz-reason d-flex">
            <strong className="quiz-title-left">
              Reason:
          </strong>
            <div
              dangerouslySetInnerHTML={{
                __html: question.Reason
              }}
            />
          </div>
        )} */}
      </div>
    );
  }

  getCurrentResultDom(question, isCorrect, isSkipped) {
    let questionTypeID = question.QuestionTypeID;
    debugger;

    switch (questionTypeID) {
      case 1:
      case 2:
        return this.getSimpleQuestionTypeResult(question, isCorrect);

      default:
        return <div />;
    }
  }
  getQuizResultReview = (correctAnswerCount, totalAnswerCount) => {
    let correctCount = correctAnswerCount / totalAnswerCount;
    let correctPercent = correctCount * 100;
    const width_proportion = "100%";
    const height_proportion = "100%";

    if (correctAnswerCount === 0) {
      return <h3 className="review">Review: Not quite yet !</h3>;
    } else if (correctPercent <= 25) {
      return <h3 className="review">Review: You can do better !</h3>;
    } else if (correctPercent <= 50) {
      return <h3 className="review">Review: Not Bad.</h3>;
    } else if (correctPercent <= 75) {
      return <h3 className="review">Review: Nice work. Keep Going !</h3>;
    } else {
      return (
        <React.Fragment>
          <Confetti width={900} height={900} />
          <h3 className="review">Review: Brilliant ! , BRAVO !</h3>
        </React.Fragment>
      );
    }
  };

  render() {
    const { classes } = this.props;
    let { currentTab, showProgress } = this.state;

    let correctQuestionIDs = [];
    let incorrectQuestionIDs = [];
    let skipQuestionIDs = [];

    let correctDom = [],
      incorrectDom = [],
      skippedDom = [];

    let resultSet = null;
    resultSet = this.props.questions;
    debugger;

    if (resultSet && resultSet.length > 0) {
      correctDom = resultSet
        .filter(r => r.IsCorrect)
        .map(q => this.getCurrentResultDom(q, true, false));

      correctQuestionIDs = resultSet
        .filter(r => r.IsCorrect)
        .map(q => q.QuestionID);

      let remainingQuestions = resultSet.filter(r => !r.IsCorrect);
    }

    const correctAnswerCount = correctQuestionIDs.length;
    const wrongAnswerCount = incorrectQuestionIDs.length;
    const skipQuestionCount = skipQuestionIDs.length;

    const quiresults = resultSet.map((item, i) => {
      let questionHtml = function() {
        return { __html: item.question };
      };

      let response =
        item.IsCorrect === true
          ? "You correctly answered "
          : item.IsCorrect === false
          ? `You answered ${
              item.QuestionTypeID === 1
                ? item.SelectedAnswerOption.length > 0
                  ? item.SelectedAnswerOption[0].content
                  : "nothing"
                  ? item.QuestionTypeID === 2
                    ? item.UserAnswerText
                    : "nothing"
                  : "nothing"
                : "nothing"
            }. The correct answer is `
          : "The correct answer is ";

      return (
        <li
          className={"result" + (item.IsCorrect ? " correct" : " incorrect")}
          key={i}
        >
          <div className="question" dangerouslySetInnerHTML={questionHtml()} />
          <div className="response">
            {response} <b>{item.answers.filter(x => x.IsCorrect)[0].content}</b>
          </div>
          {/* <p className="explanation">
                  <i dangerouslySetInnerHTML={explanationHtml()} />
              </p> */}
        </li>
      );
    });
    window.scrollTo(0, 0);

    return (
      <div className={this.state.showResultView ? "" : ""}>
        {!this.state.showResultView ? (
          <React.Fragment>
            <section className="resultsSection">
              <h2>Results</h2>
              <div className="scoring">
                You answered {correctAnswerCount} correct out of{" "}
                {resultSet.length} questions.{" "}
              </div>
              <div className="badge1">
                {this.getQuizResultReview(correctAnswerCount, resultSet.length)}
              </div>
              <ol>{quiresults}</ol>
              <Button
                onClick={() => this.handleReplayClick()}
                variant="contained"
                color="primary"
              >
                Replay
              </Button>
            </section>
            {/* {resultSet && (
              <div>
                {" "}
                <div>
                  <div className="quiz-result-top">
                    <p className="stat">
                      {" "}
                      You answered {correctAnswerCount} correct out of{" "}
                      {resultSet.length} questions.{" "}
                    </p>

                    {this.getQuizResultReview(
                      correctAnswerCount,
                      resultSet.length
                    )}
                  </div>
                </div>
                <div className="btn-wrapper d-flex v-center btn-group-preview">
                 

                  <Button
                    onClick={() => this.handleReplayClick()}
                    variant="contained"
                    color="primary"
                  >
                    Replay
                  </Button>
                </div>
              </div>
            )} */}
          </React.Fragment>
        ) : null}
      </div>
    );
  }
}

QuizResultView.propTypes = {
  classes: PropTypes.object.isRequired
};

const mapStateToProps = state => {
  return {};
};

export default compose(
  withRouter,
  withStyles(styles),
  connect(mapStateToProps, null)
)(QuizResultView);
