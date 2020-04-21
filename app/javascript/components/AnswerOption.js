import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import compose from "recompose/compose";
import { connect } from "react-redux";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
const useStyles = theme => ({
  textField: {
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2)
  }
});
var value = "";
const handleStartGameClick = props => {
  props.onAnswerSelected;
};
const handleChange = val => {
  this.value = val;
};
function AnswerOption(props) {
  debugger;

  // onChange={props.onAnswerSelected}
  if (props.questionType === 1) {
    return (
      <React.Fragment>
        <li className="answerOption">
          <input
            type="radio"
            className="radioCustomButton"
            name="radioGroup"
            checked={false}
            id={props.answerType}
            value={props.answerContent}
            disabled={props.answer}
            onChange={event => handleChange(event.target.value)}
          />
          <label className="radioCustomLabel" htmlFor={props.answerType}>
            {props.answerContent}
          </label>
        </li>
      
      </React.Fragment>
    );
  } else {
    return (
      <React.Fragment>
        <TextField
          multiline
          value={event => event.target.value}
          rows="2"
          className="quiz-play-op quiz-play-text"
          name="radioGroup"
          id={props.answerType}
          onChange={event => handleChange(event.target.value)}
          margin="normal"
          variant="outlined"
        />
        
      </React.Fragment>
      // <input
      //   type="tex"
      //   className="txtFreeText"
      //   name="radioGroup"
      //   id={props.answerType}
      //   disabled={props.answer}
      //   onChange={event => event.target.value}
      // />
    );
  }
}

AnswerOption.propTypes = {
  answerType: PropTypes.string.isRequired,
  answerContent: PropTypes.string.isRequired,
  answer: PropTypes.string.isRequired,
  onAnswerSelected: PropTypes.func.isRequired
};

export default AnswerOption;
const mapStateToProps = state => {
  return {
    message: state.userReducer.message
  };
};
//export default QuizMode;

// export default compose(
//   withStyles(useStyles),
//   connect(mapStateToProps, null)
// )(AnswerOption);
