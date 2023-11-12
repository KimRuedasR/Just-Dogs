import React, { Component } from "react";
import { View, Text } from "react-native";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { fetchUser } from "../redux/actions/index.js";

// Main component connected to Redux store
export class Main extends Component {
  componentDidMount() {
    this.props.fetchUser();
  }
  render() {
    const { currentUser } = this.props;
    // Display if user data is not loaded yet
    if (currentUser == undefined) {
      return (
        <View style={{ flex: 1, justifyContent: "center" }}>
          <Text>Iniciando sesión...</Text>
        </View>
      );
    }
    // Display user once loaded
    return (
      <View style={{ flex: 1, justifyContent: "center" }}>
        <Text>{currentUser.name} inicio sesión</Text>
      </View>
    );
  }
}

const mapStateToProps = (store) => ({
  currentUser: store.userState.currentUser,
});
const mapDispatchProps = (dispatch) =>
  bindActionCreators({ fetchUser }, dispatch);

export default connect(mapStateToProps, mapDispatchProps)(Main);
