import React, { Component } from 'react';
import {
  StackNavigator,
  TabNavigator,
} from 'react-navigation';

import HomePage from './page-home';
import HistoryPage from './page-history';
import LoginPage from './page-login';

const Tabs = TabNavigator({
  Home: { screen: HomePage },
  History: { screen: HistoryPage },
}, {
    tabBarPosition: 'bottom',
    swipeEnabled: true,
    animationEnabled: true,
    tabBarOptions: {
      activeTintColor: '#16f49b',
      labelStyle: {
        fontSize: 16,
      },
      style: {
        backgroundColor: '#333333',
      }
    }
  });

const App = StackNavigator({
  Home: { screen: Tabs },
  Login: { screen: LoginPage },
});

export default App;