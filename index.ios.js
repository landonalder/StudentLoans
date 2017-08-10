import React from 'react';
import {
  AppRegistry,
} from 'react-native';
import App from './App';
import TodayWidget from './TodayWidget';

const StudentLoans = () => (
  <App />
);

AppRegistry.registerComponent('StudentLoans', () => StudentLoans);
AppRegistry.registerComponent('TodayWidget', () => TodayWidget);
