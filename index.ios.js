import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View
} from 'react-native';
import App from './App';
import TodayWidget from './TodayWidget';

export default class StudentLoans extends Component {
  render() {
    return (
      <App />
    );
  }
}

AppRegistry.registerComponent('StudentLoans', () => StudentLoans);
AppRegistry.registerComponent('TodayWidget', () => TodayWidget);