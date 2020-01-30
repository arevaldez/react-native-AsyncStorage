import React, { Component } from "react";
import { createStackNavigator } from "react-navigation-stack";
import { createAppContainer } from "react-navigation";
import HomeScreen from "../screens/HomeScreen";
import AddTaskScreen from "../screens/AddTaskScreen";

const StackNav = createStackNavigator(
  {
    Home: {
      screen: HomeScreen
    },
    AddTask: {
      screen: AddTaskScreen
    }
  },
  {
    // Changes transition from card to Modal will not work for android though
    mode: "modal"
  }
);

const RootNavigator = createAppContainer(StackNav);

export default RootNavigator;
