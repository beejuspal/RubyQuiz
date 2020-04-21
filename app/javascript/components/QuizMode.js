import React, { Component } from "react";
import quizQuestions from "../Api/quizQuestions";
import Quiz from "../components/Quiz";
import QuizPage from "../components/QuizPage";
import QuizTestMode from "../components/QuizTestMode";
import Result from "../components/Result";
import { withStyles } from "@material-ui/core/styles";
import compose from "recompose/compose";
import { connect } from "react-redux";
import { getloginUser } from "../actions/userAction";
const useStyles = theme => ({
  textField: {
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2)
  }
});
class QuizMode extends Component {
  constructor(props) {
    super(props);

    this.state = {
      counter: 0,
      questionId: 1,
      questionType: 1,
      question: "",
      answerOptions: [],
      answer: "",
      answersCount: {},
      result: "",
      mainQuizQuestion: quizQuestions,
      showQuiz: true,
      showQuizPage: false,
      isLoggedIn: false
    };

    this.handleAnswerSelected = this.handleAnswerSelected.bind(this);
  }

  componentDidMount() {
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
    const shuffledAnswerOptions = quizQuestions.map(question =>
      this.shuffleArray(question.answers)
    );
    debugger;
    this.setState({
      question: quizQuestions[0].question,
      questionType: quizQuestions[0].QuestionTypeID,
      answerOptions: shuffledAnswerOptions[0],
      mainQuizQuestion: quizQuestions
    });
  }

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
  handleNextClik() {
    if (this.state.questionId < quizQuestions.length) {
      setTimeout(() => this.setNextQuestion(), 300);
    } else {
      setTimeout(() => this.setResults(this.getResults()), 300);
    }
  }
  handleAnswerSelected(event) {
    this.setUserAnswer(event.currentTarget.value);
    debugger;
  }

  setUserAnswer(answer) {
    this.setState((state, props) => ({
      answersCount: {
        ...state.answersCount,
        [answer]: (state.answersCount[answer] || 0) + 1
      },
      answer: answer
    }));
  }

  setNextQuestion() {
    const counter = this.state.counter + 1;
    const questionId = this.state.questionId + 1;

    this.setState({
      counter: counter,
      questionId: questionId,
      question: quizQuestions[counter].question,
      answerOptions: quizQuestions[counter].answers,
      answer: "",
      questionType: quizQuestions[counter].QuestionTypeID
    });
  }

  getResults() {
    const answersCount = this.state.answersCount;
    const answersCountKeys = Object.keys(answersCount);
    const answersCountValues = answersCountKeys.map(key => answersCount[key]);
    const maxAnswerCount = Math.max.apply(null, answersCountValues);

    return answersCountKeys.filter(key => answersCount[key] === maxAnswerCount);
  }

  setResults(result) {
    if (result.length === 1) {
      this.setState({ result: result[0] });
    } else {
      this.setState({ result: "Undetermined" });
    }
  }
  handleBackClick = () => {
    this.props.history.push("/quizpage");
    // debugger;
    // this.setState({
    //   showQuizPage: true,
    //   showQuiz: false
    // });
  };

  renderQuiz() {
    return (
      <QuizTestMode
        handleBackClick={() => this.handleBackClick()}
        questions={this.state.mainQuizQuestion}
      />
    );

    // <Quiz
    //   answer={this.state.answer}
    //   answerOptions={this.state.answerOptions}
    //   questionId={this.state.questionId}
    //   question={this.state.question}
    //   questionTotal={quizQuestions && quizQuestions.length}
    //   onAnswerSelected={this.handleAnswerSelected}
    //   handleNextClik={this.handleNextClik}
    //   questionType={this.state.questionType}
    // />
  }

  renderResult() {
    return <Result quizResult={this.state.result} />;
  }

  render() {
   
    if (this.state.showQuiz) {
      return (
        <div className="App">
          <div className="App-header">
            <img src="/assets/rubbyrails.png" className="App-logo" alt="logo" />
            <h2>Rubby Quiz</h2>
          </div>

          <QuizTestMode
            handleBackClick={() => this.handleBackClick()}
            questions={this.state.mainQuizQuestion}
          />
        </div>
      );
    } else if (this.state.showQuizPage) {
      return <QuizPage {...this.props} />;
    } else {
      return <div></div>;
    }
  }
}
const mapStateToProps = state => {
  return {
    message: state.userReducer.message
  };
};
//export default QuizMode;

export default compose(
  withStyles(useStyles),
  connect(mapStateToProps, { getloginUser })
)(QuizMode);
