import React from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import {
  getGreatLakesBalance,
  getMohelaBalance,
} from './Api';

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginLeft: 20,
    marginRight: 20,
  },
  refreshButton: {
    alignItems: 'center',
    backgroundColor: '#c4c7c8',
    borderRadius: 35,
    flex: 0,
    height: 70,
    justifyContent: 'center',
    opacity: 0.8,
    width: 70,
  },
  refreshText: {
    color: 'black',
  },
  totalAmount: {
    fontSize: 28,
    marginTop: 5,
  },
  totalTitle: {
    fontSize: 20,
  },
  totalContainer: {
    flex: 0,
  },
});

class TodayWidget extends React.Component {
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

    const isLoading = mohelaLoading || greatLakesLoading;

    return (
      <View
        style={styles.container}
      >
        <View style={styles.totalContainer}>
          <Text style={styles.totalTitle}>
            {'Total balance:'}
          </Text>
          <Text style={styles.totalAmount}>
            {isLoading ? '' : `$${(mohelaBalance + greatLakesBalance).toFixed(2)}`}
          </Text>
          {isLoading &&
            <ActivityIndicator animating />
          }
        </View>
        <TouchableOpacity
          onPress={this.refreshBalances}
          style={styles.refreshButton}
        >
          <Text style={styles.refreshText}>{'Refresh'}</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

export default TodayWidget;
