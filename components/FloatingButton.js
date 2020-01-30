import React from "react";
import { StyleSheet } from "react-native";
import { Icon, Fab } from "native-base";

function FloatingButton({ actionOnPress }) {
  return (
    <Fab
      direction="up"
      style={styles.button}
      position="bottomRight"
      onPress={actionOnPress}
    >
      <Icon name="ios-add" />
    </Fab>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#5859f2"
  }
});

export default FloatingButton;
