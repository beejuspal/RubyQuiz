/*Single Page*/

import React, { Component } from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router";
import { withStyles } from "@material-ui/core/styles";
import compose from "recompose/compose";
import { connect } from "react-redux";
import Button from "@material-ui/core/Button";
import Radio from "@material-ui/core/Radio";
import QuizResultView from "../components/QuizResultView";
import TextField from "@material-ui/core/TextField";

import Checkbox from "@material-ui/core/Checkbox";
import IconButton from "@material-ui/core/IconButton";
import ButtonBase from "@material-ui/core/ButtonBase";
import quizQuestions from "../Api/quizQuestions";

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

class QuizTestMode extends Component {
  constructor(props) {
    super(props);

    this.state = {
      tree: null,
      currentQuestionIndex: 0,
      selectedOptionID: "",
      attemptedQuestions: [],
      hasLoaded: false,
      selectedOption: 0,
      questions: this.props.questions ? this.props.questions : null,
      hasSubmitted: false,
      correctAnswer: 0,
      wrongAnswer: 0,
      viewSummary: false,
      openDialog: false,
      editorHasMounted: false,

      handleBack: false,
      dataSaved: false,
      quizLogTime: 0,

      skipedQuestion: 0,
      showHintIcon: false,
      showHint: false,
      openHintIndex: [],
      isUserResponseSaved: false,
      UserAnswerText: "",
      userAnswer: [],
      quizAnswers: [],
      currentQuestion: null,

      gameSaveButtonClickFunc: null,

      serverReponseSuccess: false,
      totalQuestions: 0,
      timerComplete: false,

      counter: 0,
      questionId: 1,
      questionType: 1,
      question: "",
      answerOptions: [],
      answer: "",
      answersCount: {},
      result: ""
    };
    this.handleChange = this.handleChange.bind(this);
  }

  componentWillMount() {}

  handleShowAnswerTestClick = result => {};
  shuffleArray(array) {
    var currentIndex = array.length,
      temporaryValue,
      randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }

    return array;
  }
  componentDidMount() {
    const shuffledAnswerOptions = quizQuestions.map(question =>
      this.shuffleArray(question.answers)
    );
    debugger;
    this.setState({
      questions: quizQuestions,
      question: quizQuestions[0].question,
      questionType: quizQuestions[0].QuestionTypeID,
      answerOptions: shuffledAnswerOptions[0],
      totalQuestions: this.state.questions.length
    });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps !== "" && nextProps.questions) {
      this.setState({
        questions: nextProps.questions,
        totalQuestions: nextProps.questions.length
      });
    } else {
      return;
    }
  }

  handleButtonClick = () => {
    this.setState({ openDialog: true });
  };
  handleCloseClick = () => {
    this.setState({ openDialog: false, viewSummary: false });
  };

  handleBackClick = () => {
    this.props.handleBackClick && this.props.handleBackClick();
    this.setState({ handleBack: false, viewSummary: false });
  };

  changeReview(review, q) {
    this.setState({ answer: review });
  }

  handleReplayButtonClick = () => {
    this.setState({ hasLoaded: false });
    this.props.getAllQuizQuestions(
      this.props.childQuizID ? this.props.childQuizID : this.props.quizID,
      () => {
        this.setState({
          currentQuestionIndex: 0,
          selectedOptionID: "",
          attemptedQuestions: [],
          hasLoaded: true
        });
      }
    );
  };

  handleChange(answer, review, typeid, index, curQuestion) {
    if (curQuestion !== null) {
      if (this.state.questions) {
        var Question = this.state.questions;
        var tree = [
          ...Question.map(question => {
            if (question.QuestionID === curQuestion.QuestionID) {
              if (typeid === 2) {
                return {
                  ...question,
                  IsChecked: true,
                  IsCorrect:
                    question.answers[0].content &&
                    question.answers[0].content === review
                      ? true
                      : false,

                  SelectedAnswerOption: question.answers.filter(option => {
                    return option.AnswerID === answer;
                  }),
                  UserAnswerText: review,
                  answers: question.answers.map(option => {
                    return { ...option, IsChecked: true };
                  })
                };
              } else {
                if (typeof question.IsChecked === "undefined") {
                  var selectedOption = this.state.selectedOption;
                  this.setState({ selectedOption: selectedOption + 1 });
                }

                return {
                  ...question,
                  IsChecked: true,
                  IsCorrect: question.answers.filter(option => {
                    return option.AnswerID === answer;
                  })[0].IsCorrect,

                  SelectedAnswerOption: question.answers.filter(option => {
                    return option.AnswerID === answer;
                  }),
                  answers: question.answers.map(option => {
                    if (option.AnswerID === answer) {
                      return {
                        ...option,
                        IsChecked: true
                      };
                    }
                    return {
                      ...option,
                      IsChecked: false
                    };
                  })
                };
              }
            }
            return question;
          })
        ];
        this.setState({
          tree: tree,
          questions: tree,
          selectedOptionID: answer,
          UserAnswerText: review
        });
      }
    }
  }

  handleSubmitClick = () => {
    this.handleSubmitConfirmClick && this.handleSubmitConfirmClick();
  };
  handleTimerComplete = () => {
    this.setState({ timerComplete: true });
    this.handleSubmitConfirmClick && this.handleSubmitConfirmClick();
  };
  handleSubmitConfirmClick = () => {
    let currentQuestion = this.state.questions[this.state.currentQuestionIndex];
    let attemptedQuestions = this.state.quizAnswers;

    if (parseInt(currentQuestion.QuizQuestionTypeID) === SingleAnswerQuestion) {
      attemptedQuestions = attemptedQuestions.filter(
        a => a.QuestionID !== currentQuestion.QuestionID
      );
      attemptedQuestions.push({
        QuestionID: currentQuestion.QuestionID,
        Answer: currentQuestion.AnswerOptions.filter(a => a.IsChecked)
          .map(a => a.AnswerID)
          .toString()
      });
      this.setState(
        { quizAnswers: attemptedQuestions, openDialog: true },
        () => {
          this.handleSubmitAfterConfirmClick &&
            this.handleSubmitAfterConfirmClick();
        }
      );
    } else if (
      parseInt(currentQuestion.QuizQuestionTypeID) === TrueFalseQuestion
    ) {
      attemptedQuestions = attemptedQuestions.filter(
        a => a.QuestionID !== currentQuestion.QuestionID
      );
      attemptedQuestions.push({
        QuestionID: currentQuestion.QuestionID,
        Answer: currentQuestion.AnswerOptions.filter(a => a.IsChecked)
          .map(a => a.AnswerID)
          .toString()
      });

      this.setState(
        { quizAnswers: attemptedQuestions, openDialog: true },
        () => {
          this.handleSubmitAfterConfirmClick &&
            this.handleSubmitAfterConfirmClick();
        }
      );
    } else if (
      parseInt(currentQuestion.QuizQuestionTypeID) === MultipleChoice
    ) {
      attemptedQuestions = attemptedQuestions.filter(
        a => a.QuestionID !== currentQuestion.QuestionID
      );
      attemptedQuestions.push({
        QuestionID: currentQuestion.QuestionID,
        Answer:
          "[" +
          currentQuestion.AnswerOptions.filter(a => a.IsChecked)
            .map(a => a.AnswerID)
            .toString() +
          "]"
      });
      this.setState(
        { quizAnswers: attemptedQuestions, openDialog: true },
        () => {
          this.handleSubmitAfterConfirmClick &&
            this.handleSubmitAfterConfirmClick();
        }
      );
    } else if (parseInt(currentQuestion.QuizQuestionTypeID) === FreeText) {
      attemptedQuestions = attemptedQuestions.filter(
        a => a.QuestionID !== currentQuestion.QuestionID
      );
      attemptedQuestions.push({
        QuestionID: currentQuestion.QuestionID,
        Answer:
          typeof currentQuestion.UserAnswerText === "undefined"
            ? ""
            : currentQuestion.UserAnswerText.trim().toLowerCase()
      });
      this.setState(
        { quizAnswers: attemptedQuestions, openDialog: true },
        () => {
          this.handleSubmitAfterConfirmClick &&
            this.handleSubmitAfterConfirmClick();
        }
      );
    } else if (gameTypeQuizList.includes(currentQuestion.QuizQuestionTypeID)) {
      this.state.gameSaveButtonClickFunc &&
        this.state.gameSaveButtonClickFunc();
    }
  };

  handleSubbmitAfterConfirmClick = () => {
    var updatedUserAnswer = this.state.quizAnswers;

    let userAnswer = {
      QuizAnswers: updatedUserAnswer
    };

    var postData = JSON.stringify(userAnswer);
    if (this.state.tree === null) {
      if (this.state.questions) {
        var Question = this.state.questions;
        var tree = [
          ...Question.map(question => {
            return {
              ...question,
              IsChecked: true,
              IsCorrect: false,

              SelectedAnswerOption: [],
              UserAnswerText: "",
              answers:
                question.answers &&
                question.answers.map(option => {
                  return { ...option, IsChecked: false };
                })
            };
          })
        ];
        this.setState({ tree: tree, questions: tree, hasSubmitted: true });
      }
    }
    this.setState({ hasSubmitted: true, serverReponseSuccess: true });
    this.setState({ viewSummary: !this.state.viewSummary });

    //this.handleSummaryClick();

    this.setState({ dataSaved: true });
  };

  handleSubmitButtonClick = () => {
    this.setState({ openDialog: true });
  };

  handleBackButtonClick = () => {
    let currentQuestion = this.state.questions[
      this.state.currentQuestionIndex - 1
    ];
    this.setState({
      currentQuestionIndex: this.state.currentQuestionIndex - 1,
      selectedOptionID:
        currentQuestion.AnswerOptions &&
        currentQuestion.AnswerOptions.filter(a => a.IsChecked)[0]
          ? currentQuestion.AnswerOptions.filter(a => a.IsChecked)[0].AnswerID
          : "",
      isUserResponseSaved: true,
      hasSubmitted: false
    });
  };

  handleNextButtonClick = clickValue => {
    if (this.state.currentQuestionIndex + 1 === this.state.totalQuestions) {
      this.setState({ hasSubmitted: true });
      return;
    }

    let currentQuestion = this.state.questions[this.state.currentQuestionIndex];

    let nextIndex = this.state.currentQuestionIndex + 1;

    let nextQuestion = this.state.questions[nextIndex];

    let attemptedQuestions = this.state.quizAnswers;
    attemptedQuestions = attemptedQuestions.filter(
      a => a.QuestionID !== currentQuestion.QuestionID
    );

    let answer = "";
    if (currentQuestion.QuizQuestionTypeID === 1) {
      answer = currentQuestion.answers
        .filter(a => a.IsChecked)
        .map(a => a.AnswerID)
        .toString();
    } else if (currentQuestion.QuizQuestionTypeID === 2) {
      answer =
        typeof currentQuestion.UserAnswerText === "undefined"
          ? ""
          : currentQuestion.UserAnswerText.trim().toLowerCase();
    }

    attemptedQuestions.push({
      QuestionID: currentQuestion.QuestionID,
      Answer: answer
    });

    this.setState({
      quizAnswers: attemptedQuestions,
      currentQuestionIndex: this.state.currentQuestionIndex + 1,
      selectedOptionID:
        nextQuestion &&
        nextQuestion.answers &&
        nextQuestion.answers.filter(a => a.IsChecked)[0]
          ? nextQuestion.answers.filter(a => a.IsChecked)[0].AnswerID
          : "",
      hasSubmitted: false,
      showHint: false
    });
  };

  getQuestions = currentQuestion => {
    if (typeof currentQuestion !== "undefined") {
      if (currentQuestion.QuestionTypeID === 1) {
        return (
          <React.Fragment>
            <li className="answerOption">
              {currentQuestion.answers.map((a, index) => {
                return (
                  <div>
                    <Radio
                      key={a.AnswerID}
                      checked={a.AnswerID === this.state.selectedOptionID}
                      onChange={() =>
                        this.handleChange(
                          a.AnswerID,
                          "",
                          currentQuestion.QuestionTypeID,
                          index,
                          currentQuestion
                        )
                      }
                      value={a.AnswerID}
                      name={a.AnswerID}
                      id={"rdo" + a.AnswerID.toString()}
                      className="op-input"
                    />
                    <label
                      for={"rdo" + a.AnswerID.toString()}
                      className="op-text"
                    >
                      {a.content}
                    </label>
                  </div>
                );
              })}
            </li>
          </React.Fragment>
        );
      } else {
        return (
          <div>
            {currentQuestion.answers.map((a, index) => {
              return (
                <div>
                  <React.Fragment>
                    <TextField
                      multiline
                      value={
                        currentQuestion.UserAnswerText
                          ? currentQuestion.UserAnswerText
                          : ""
                      }
                      rows="2"
                      className="quiz-play-op quiz-play-text"
                      name={currentQuestion.answerType}
                      id={currentQuestion.answerType}
                      onChange={event =>
                        this.handleChange(
                          a.AnswerID,
                          event.target.value,
                          currentQuestion.QuestionTypeID,
                          0,
                          currentQuestion
                        )
                      }
                      margin="normal"
                      variant="outlined"
                    />
                  </React.Fragment>
                </div>
              );
            })}
          </div>
        );
      }
    }
  };

  handleCheckButtonClick() {
    // var audioComponent = document.getElementById("quizAudio");
    // audioComponent.src = "";

    //Analytic
    this.setState({ getTime: true, hasTimeUtilized: false });

    UpdateAnalyticLogInfo(
      this.props.courseID,
      this.props.componentID,
      null,
      "quiz",
      this.props.permalink.TypeID,
      attempted,
      false,
      practice
    );

    let checkAnswerVerb = didnot_answered;
    let answerOptions = this.state.questions[this.state.currentQuestionIndex]
      .AnswerOptions;

    if (!isEmpty(this.state.UserAnswerText.trim())) {
      let correctAns = String(answerOptions[0].Answer)
        .replace("<p>", "")
        .replace("</p>", "")
        .toLowerCase();
      checkAnswerVerb =
        correctAns === this.state.UserAnswerText.trim().toLowerCase()
          ? correctly_answered
          : incorrectly_answered;
      if (checkAnswerVerb === correctly_answered) {
        this.playSound(true);
      } else {
        this.playSound(false);
      }
    } else if (!isEmpty(this.state.selectedOptionID)) {
      if (
        this.state.questions[this.state.currentQuestionIndex]
          .QuizQuestionTypeID === MultipleChoice
      ) {
        var correctAnswerOptionCount = answerOptions.filter(a => a.IsCorrect)
          .length;

        var selectedAnswerOptionCount = answerOptions.filter(a => a.IsChecked)
          .length;

        checkAnswerVerb =
          correctAnswerOptionCount === selectedAnswerOptionCount &&
          answerOptions.filter(a => !a.IsCorrect && a.IsChecked).length <= 0
            ? correctly_answered
            : incorrectly_answered;

        if (checkAnswerVerb === correctly_answered) {
          this.playSound(true);
        } else {
          this.playSound(false);
        }
      } else if (
        this.state.questions[this.state.currentQuestionIndex]
          .QuizQuestionTypeID === TrueFalseQuestion
      ) {
        checkAnswerVerb = answerOptions.find(
          f => f.AnswerID == this.state.selectedOptionID
        ).IsCorrect
          ? correctly_answered
          : incorrectly_answered;
        if (checkAnswerVerb === correctly_answered) {
          this.playSound(true);
        } else {
          this.playSound(false);
        }
      } else {
        checkAnswerVerb = answerOptions.find(
          f => f.AnswerID == this.state.selectedOptionID
        ).IsCorrect
          ? correctly_answered
          : incorrectly_answered;
        if (checkAnswerVerb === correctly_answered) {
          this.playSound(true);
        } else {
          this.playSound(false);
        }
      }
    }
    //Analytic
    UpdateAnalyticLogInfo(
      this.props.courseID,
      this.props.componentID,
      0,
      "quiz",
      this.props.permalink.TypeID,
      checkAnswerVerb,
      false,
      practice
    );

    this.setState({ isUserResponseSaved: true });
    let questions1 = this.state.questions.map((q, index) => {
      if (index === this.state.currentQuestionIndex) {
        return {
          ...q,
          isUserResponseSaved: true
        };
      }
      return q;
    });
    this.setState({
      questions: questions1
    });
  }

  getQuestionTypeMessage(questionType, questionTitle) {
    let message = "";
    switch (questionType) {
      case DragAndDrop:
        message = questionTitle ? questionTitle : "Drag the words";
        break;
      case FillTheGap:
        message = questionTitle ? questionTitle : "Click the words";
        break;
      case FreeText:
        message = "Answer the following";
        break;
      case TrueFalseQuestion:
        message = "Select TRUE or FALSE";
        break;
      case MatchTheFollowing:
        message = questionTitle ? questionTitle : "Match the following";
        break;
      case MultipleChoice:
        message = "Choose multiple options";
        break;
      case SingleAnswerQuestion:
        message = "Choose a single option";
        break;
      case ImageSequencing:
        message = questionTitle ? questionTitle : "Arrange the images in order";
        break;
      case WordSequencing:
        message = questionTitle ? questionTitle : "Arrange the word in order";
        break;
      case AdvanceFillInTheBlanks:
        message = questionTitle ? questionTitle : "Fill in the blanks";
        break;
    }

    return message;
  }
  continueQuizVideo = () => {
    this.props.continueQuizVideo &&
      this.props.continueQuizVideo(this.props.childQuizID);
  };

  render() {
    const { classes } = this.props;
    const { currentTab, UserAnswerText, attemptedQuestions } = this.state;

    const {
      hasSubmitted,
      viewSummary,
      handleBack,
      tree,
      dataSaved
    } = this.state;

    const questions = this.state.questions;

    if (
      questions &&
      questions !== undefined &&
      questions.length !== 0 &&
      !viewSummary &&
      questions.length > this.state.currentQuestionIndex === true
    ) {
      let currentQuestion = questions[this.state.currentQuestionIndex];

      let questionDisplay = this.getQuestions(currentQuestion);

      return (
        <React.Fragment>
          <div key={currentQuestion.questionId}>
            <div className="questionCount">
              Question <span>{this.state.currentQuestionIndex + 1}</span> of{" "}
              <span>{this.state.totalQuestions}</span>
            </div>
            <h2 className="question">{currentQuestion.question}</h2>
            <ul className="answerOptions">{questionDisplay}</ul>
            <Button
              onClick={() => {
                this.state.currentQuestionIndex + 1 ===
                this.state.totalQuestions
                  ? this.handleSubbmitAfterConfirmClick()
                  : this.handleNextButtonClick();
              }}
              variant="contained"
              color="primary"
            >
              {this.state.currentQuestionIndex + 1 === this.state.totalQuestions
                ? "Finish"
                : "Next"}
            </Button>
            {/* <Button
            onClick={() => {
                this.state.currentQuestionIndex + 1 ===
                  this.state.totalQuestions
                  ? this.handleSubbmitAfterConfirmClick()
                  : this.handleNextButtonClick();
              }}
              className="btn btn-primary"
            >
              {this.state.currentQuestionIndex + 1 ===
                          this.state.totalQuestions
                          ? "Finish"
                          : "Next"}
            </Button> */}
          </div>
        </React.Fragment>
      );
    } else if (this.state.serverReponseSuccess) {
      return (
        <QuizResultView
          handleBackClick={() => this.handleBackClick()}
          questions={tree}
        />
      );
    }
  }
}

QuizTestMode.propTypes = {
  classes: PropTypes.object.isRequired
};

const mapStateToProps = state => {
  return {};
};

export default compose(
  withStyles(styles),
  connect(mapStateToProps, null)
)(QuizTestMode);
