import React, {
    Component
} from 'react';
import {
    StyleSheet,
    StatusBar,
} from 'react-native';
import {
    View,
    Container,
    Button,
    Text,
} from 'native-base';
import Home from './page-home';

const styles = StyleSheet.create({
    button: {
        borderWidth: 1,
        borderColor: 'rgb(255,255,255)',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0,100,0,1)',
        borderRadius: 100,
        justifyContent: 'center',
        alignItems: 'center'
    }
});

export default class LoginPage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isLoggedIn: false,
        }
    }

    static navigationOptions = {
        header: null,
    }

    moveHome() {
        this.setState({
            isLoggedIn: true,
        });
    }

    render() {
        if (this.state.isLoggedIn) {
            return (
                <Home />
            );
        }
        else {
            return (
                <View style={{
                    flex: 1,
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: 'rgba(0,100,0,1)',
                }}>
                    <StatusBar
                        backgroundColor="rgba(0,100,0,1)"
                        barStyle="light-content"
                    />
                    <View style={{
                        width: 100,
                        height: 100
                    }}>
                        <Button
                            onPress={() => { this.setState({ isLoggedIn: true, }) }}
                            style={styles.button}>
                            <Text>Google</Text>
                        </Button>
                    </View>
                </View>
            );
        }
    }
}