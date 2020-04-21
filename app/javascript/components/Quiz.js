import React, { Component } from "react";
import PropTypes from "prop-types";
import CSSTransitionGroup from "react-transition-group";
import Question from "../components/Question";
import QuestionCount from "../components/QuestionCount";
import AnswerOption from "../components/AnswerOption";
import { withStyles } from "@material-ui/core/styles";
import compose from "recompose/compose";
import { connect } from "react-redux";
const useStyles = theme => ({
  textField: {
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2)
  }
});
const Quiz = props => {
  function renderAnswerOptions(key) {
    debugger;
    return (
      <AnswerOption
        key={key.content}
        answerContent={key.content}
        answerType={key.type}
        answer={props.answer}
        questionId={props.questionId}
        questionType={props.questionType}
        onAnswerSelected={props.onAnswerSelected}
      />
    );
  }
  handleStartGameClick = () => {
    props.handleNextClik();
  };
  return (
    // <CSSTransitionGroup
    //   className="container"
    //   component="div"
    //   transitionName="fade"
    //   transitionEnterTimeout={800}
    //   transitionLeaveTimeout={500}
    //   transitionAppear
    //   transitionAppearTimeout={500}
    // >
    <React.Fragment>
      <div key={props.questionId}>
        <QuestionCount counter={props.questionId} total={props.questionTotal} />
        <Question content={props.question} />
        <ul className="answerOptions">
          {props.answerOptions.map(renderAnswerOptions)}
        </ul>
        <Button
          onClick={() => handleStartGameClick()}
          className="btn btn-primary"
        >
          Next
        </Button>
      </div>
    </React.Fragment>
  );
};

Quiz.propTypes = {
  answer: PropTypes.string.isRequired,
  answerOptions: PropTypes.array.isRequired,
  question: PropTypes.string.isRequired,
  questionId: PropTypes.number.isRequired,
  questionTotal: PropTypes.number.isRequired,
  onAnswerSelected: PropTypes.func.isRequired
};

export default Quiz;
const mapStateToProps = state => {
  return {
    message: state.userReducer.message
  };
};
//export default QuizMode;

// export default compose(
//   withStyles(useStyles),
//   connect(mapStateToProps, null)
// )(Quiz);
