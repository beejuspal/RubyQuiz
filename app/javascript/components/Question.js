import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import compose from "recompose/compose";
import { connect } from "react-redux";
const useStyles = theme => ({
  textField: {
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2)
  }
});
function Question(props) {
  return <h2 className="question">{props.content}</h2>;
}

Question.propTypes = {
  content: PropTypes.string.isRequired
};

export default Question;
const mapStateToProps = state => {
  return {
    message: state.userReducer.message
  };
};
//export default QuizMode;

// export default compose(
//   withStyles(useStyles),
//   connect(mapStateToProps, null)
// )(Question);
