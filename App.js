import React, { Component } from 'react';
import {
  ActivityIndicator,
  Button,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {
  getGreatLakesBalance,
  getMohelaBalance,
} from './Api';

const styles = StyleSheet.create({
  balances: {
    fontSize: 20,
    textAlign: 'center',
    padding: 10,
  },
  balancesContainer: {
    alignItems: 'center',
    flex: 0,
    flexDirection: 'row',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  refreshButton: {
    bottom: 20,
    position: 'absolute',
  },
  total: {
    fontSize: 30,
    textAlign: 'center',
  },
  totalContainer: {
    alignItems: 'center',
    flex: 0,
    flexDirection: 'row',
    paddingTop: 20,
  },
});

export default class App extends Component {
  constructor(args) {
    super(...args);

    this.state = {
      greatLakesBalance: 0.0,
      greatLakesLoading: true,
      mohelaBalance: 0.0,
      mohelaLoading: true,
    };
  }

  componentDidMount() {
    this.refreshBalances();
  }

  updateGreatLakesBalance = async () => {
    this.setState({ greatLakesLoading: true });

    const greatLakesBalance = await getGreatLakesBalance();

    this.setState({
      greatLakesBalance,
      greatLakesLoading: false,
    });
  }

  updateMohelaBalance = async () => {
    this.setState({ mohelaLoading: true });

    const mohelaBalance = await getMohelaBalance();

    this.setState({
      mohelaLoading: false,
      mohelaBalance,
    });
  }

  refreshBalances = () => {
    this.updateGreatLakesBalance();
    this.updateMohelaBalance();
  }

  render() {
    const {
      greatLakesBalance,
      greatLakesLoading,
      mohelaBalance,
      mohelaLoading,
    } = this.state;

    return (
      <View style={styles.container}>
        <View style={styles.balancesContainer}>
          <Text style={styles.balances}>
            {`Mohela balance: ${mohelaLoading ? '' : `$${mohelaBalance.toFixed(2)}`}`}
          </Text>
          {mohelaLoading &&
            <ActivityIndicator animating />
          }
        </View>
        <View style={styles.balancesContainer}>
          <Text style={styles.balances}>
            {`Great lakes balance: ${greatLakesLoading ? '' : `$${greatLakesBalance.toFixed(2)}`}`}
          </Text>
          {greatLakesLoading &&
            <ActivityIndicator animating />
          }
        </View>
        <View style={styles.totalContainer}>
          <Text style={styles.total}>
            {`Total balance: ${mohelaLoading ? '' : `$${(mohelaBalance + greatLakesBalance).toFixed(2)}`}`}
          </Text>
          {(mohelaLoading || greatLakesLoading) &&
            <ActivityIndicator animating />
          }
        </View>
        <View style={styles.refreshButton}>
          <Button
            onPress={this.refreshBalances}
            title="Refresh"
          />
        </View>
      </View>
    );
  }
}
