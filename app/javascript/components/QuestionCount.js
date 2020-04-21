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
function QuestionCount(props) {
  return (
    <div className="questionCount">
      Question <span>{props.counter}</span> of <span>{props.total}</span>
    </div>
  );
}

QuestionCount.propTypes = {
  counter: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired
};

//export default QuestionCount;
const mapStateToProps = state => {
  return {
    message: state.userReducer.message
  };
};
export default QuestionCount;

// export default compose(
//   withStyles(useStyles),
//   connect(mapStateToProps, null)
// )(QuestionCount);
