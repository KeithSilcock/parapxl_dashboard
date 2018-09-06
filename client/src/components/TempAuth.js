import React from "react";

class Auth extends React.Component {
  //component not complete
  //just used for redirection now

  componentWillMount() {
    this.props.history.push("/admin/home");
  }

  render() {
    return <div />;
  }
}

export default Auth;
