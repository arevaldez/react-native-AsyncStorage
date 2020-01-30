import React, { Component } from "react";
import {
  Text,
  View,
  StyleSheet,
  StatusBar,
  FlatList,
  AsyncStorage
} from "react-native";
import { AppLoading } from "expo";
import * as Font from "expo-font";
import uuidv1 from "uuid/v1";
import _values from "lodash.values";
import { Button, Text as NBText, Segment } from "native-base";

import Header from "../components/Header";
import FloatingButton from "../components/FloatingButton";
import Item from "../components/Item";

export default class HomeScreen extends Component {
  static navigationOptions = {
    headerShown: false
  };

  state = {
    todos: {},
    isDataReady: false,
    filter: "Todo"
  };

  componentDidMount = () => {
    this.loadTodos();
  };

  async loadTodos() {
    try {
      await Font.loadAsync({
        Roboto: require("../node_modules/native-base/Fonts/Roboto.ttf"),
        Roboto_medium: require("../node_modules/native-base/Fonts/Roboto_medium.ttf")
      });

      const getTodos = await AsyncStorage.getItem("todos");
      const parsedTodos = JSON.parse(getTodos);
      this.setState({
        todos: parsedTodos || {},
        isDataReady: true
      });
    } catch (err) {
      alert("Application Error. Cannot load data.");
      console.log("ERROR: ", err);
    }
  }

  onPressFab = () => {
    this.props.navigation.navigate("AddTask", {
      saveItem: this.addTodo
    });
  };

  saveTodos = newToDos => {
    const saveTodos = AsyncStorage.setItem("todos", JSON.stringify(newToDos));
  };

  addTodo = newTask => {
    const newTodoItem = newTask;

    if (newTodoItem !== "") {
      this.setState(prevState => {
        const ID = uuidv1();
        const newToDoObject = {
          [ID]: {
            id: ID,
            isCompleted: false,
            textValue: newTodoItem,
            createdAt: Date.now()
          }
        };
        const newState = {
          ...prevState,
          todos: {
            ...prevState.todos,
            ...newToDoObject
          }
        };
        this.saveTodos(newState.todos);
        return { ...newState };
      });
    }
  };

  deleteTodo = id => {
    this.setState(prevState => {
      const todos = prevState.todos;
      delete todos[id];
      const newState = {
        ...prevState,
        ...todos
      };
      this.saveTodos(newState.todos);
      return { ...newState };
    });
  };

  inCompleteTodo = id => {
    this.setState(prevState => {
      const newState = {
        ...prevState,
        todos: {
          ...prevState.todos,
          [id]: {
            ...prevState.todos[id],
            isCompleted: false
          }
        }
      };
      this.saveTodos(newState.todos);
      return { ...newState };
    });
  };

  completeTodo = id => {
    this.setState(prevState => {
      const newState = {
        ...prevState,
        todos: {
          ...prevState.todos,
          [id]: {
            ...prevState.todos[id],
            isCompleted: true
          }
        }
      };
      this.saveTodos(newState.todos);
      return { ...newState };
    });
  };

  filteredItems = () => {
    if (this.state.filter === "Todo") {
      return _values(this.state.todos).filter(i => {
        return !i.isCompleted;
      });
    }

    if (this.state.filter === "Complete") {
      return _values(this.state.todos).filter(i => {
        return i.isCompleted;
      });
    }
    return this.state.todos;
  };

  render() {
    const { isDataReady, filter } = this.state;

    if (!isDataReady) {
      return <AppLoading />;
    }
    return (
      <View style={styles.container}>
        <Header />
        <StatusBar barStyle="light-content" />
        <View style={styles.contentHeader}>
          <Segment style={{ backgroundColor: "#ffffff" }}>
            <Button
              active={filter === "Todo"}
              onPress={() => this.setState({ filter: "Todo" })}
            >
              <NBText>Todo</NBText>
            </Button>
            <Button
              last
              active={filter === "Complete"}
              onPress={() => this.setState({ filter: "Complete" })}
            >
              <NBText>Complete</NBText>
            </Button>
          </Segment>
        </View>
        <FlatList
          data={_values(this.filteredItems())}
          contentContainerStyle={styles.content}
          renderItem={row => {
            return (
              <Item
                isCompleted={row.item.isCompleted}
                textValue={row.item.textValue}
                id={row.item.id}
                deleteTodo={this.deleteTodo}
                completeTodo={this.completeTodo}
                inCompleteTodo={this.inCompleteTodo}
              />
            );
          }}
          keyExtractor={item => item.id}
        />
        <FloatingButton actionOnPress={this.onPressFab} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  content: {
    flex: 1,
    alignSelf: "stretch"
  },
  contentHeader: {
    alignItems: "center",
    justifyContent: "center"
  }
});
