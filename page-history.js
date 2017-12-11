import React, {
    Component
} from 'react';
import {
    StyleSheet,
    ScrollView,
} from 'react-native';
import {
    View,
    Text,
    Icon,
    H1,
    List,
    ListItem,
} from 'native-base';

const styles = StyleSheet.create({
    outerView: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        paddingVertical: 5,
        paddingHorizontal: 15,
        marginBottom: 1,
    },
    innerView: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    halfView: {
        width: '50%',
    },
    halfViewText: {
        color: '#ffffff',
        fontSize: 25,
    }
});

export default class HistoryPage extends Component {

    static navigationOptions = {
        header: null,
    }

    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            namaz: []
        }
    }

    componentDidMount() {
        this.getNamazTimesFromApiAsync();
    }

    getNamazTimesFromApiAsync() {
        fetch('https://muslimsalat.com/karachi/yearly.json')
            .then((response) => response.json())
            .then((response) => {
                this.setState({
                    isLoading: false,
                    isError: false,
                    namaz: response.items,
                });
            })
            .catch((error) => {
                this.setState({
                    isLoading: false,
                    isError: true
                });
                Alert.alert(error);
            });
    }

    render() {
        return (
            <ScrollView style={{ flex: 1, flexDirection: 'column', backgroundColor: 'rgba(255, 255, 255, 1.00)' }}>

                <View style={[styles.colView, {
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: 'rgba(0,100,0,1)',
                    height: 150,
                }]}>
                    <H1 style={styles.h1}>History</H1>
                </View>

                <List dataArray={this.state.namaz}
                    renderRow={(item) =>
                        <View style={[styles.outerView, {
                            backgroundColor: 'rgba(0,100,0,1)',
                        }]}>

                            <View style={styles.innerView}>
                                <Text style={styles.halfViewText}>{item.date_for}</Text>
                            </View>

                            <View style={styles.innerView}>
                                <Text>{item.fajr} {item.dhuhr}</Text>
                            </View>

                        </View>
                    }>
                </List>

            </ScrollView >
        );
    }
}
