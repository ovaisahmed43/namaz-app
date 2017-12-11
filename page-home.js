import React, {
    Component
} from 'react';
import {
    StatusBar,
    StyleSheet,
    ScrollView,
    Dimensions,
    Alert,
    Button,
    TouchableNativeFeedback,
    AsyncStorage,
} from 'react-native';
import {
    View,
    Icon,
    Text,
    H1,
} from 'native-base';

const styles = StyleSheet.create({
    background: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: '#16f49b',
    },
    Text: {
        color: '#333333',
        fontSize: 20,
        fontFamily: 'HelveticaNeue',
    },
    time: {
        color: '#333333',
        fontFamily: 'HelveticaNeue',
        fontSize: 40,
        lineHeight: 40,
    },
    weather: {
        color: '#333333',
        fontFamily: 'HelveticaNeue',
        fontSize: 60,
        lineHeight: 60,
    },

    bgGreen: {
        backgroundColor: '#16f49b',
    },

    colView: {
        alignItems: 'center',
        paddingVertical: 5,
        paddingHorizontal: 15,
        marginBottom: 1,
        backgroundColor: '#16f49b',
    },

    outerView: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        paddingVertical: 20,
        paddingHorizontal: 15,
        marginVertical: 1,
        marginHorizontal: '0%',
        backgroundColor: '#333333',
    },
    outerViewAlt: {
        backgroundColor: '#16f49b',
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
        color: '#16f49b',
        fontSize: 30,
        fontFamily: 'HelveticaNeue',
    },
    halfViewTextAlt: {
        color: '#333333',
    }
});

export default class HomePage extends Component {

    static navigationOptions = {
        header: null,
    }

    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            date: "",
            time: "",
            city: "",
            city1: "lahore",
            country: "",
            weather: {
                temperature: "30",
            },
            namaz: {
                date_for: "please wait",
                fajr: "please wait",
                dhuhr: "please wait",
                asr: "please wait",
                maghrib: "please wait",
                isha: "please wait",
            },
            namaz_pray: {
                date_for: null,
                fajr_pray: false,
                dhuhr_pray: false,
                asr_pray: false,
                maghrib_pray: false,
                isha_pray: false,
            },
            coords: {},
        }
    }

    updateDateTime() {
        const date = new Date();
        this.setState({
            date: date.toDateString(),
        });
        this.updateTime();
    }

    updateTime(date) {
        setInterval(() => {
            this.setState({
                time: new Date().toLocaleTimeString()
            })
        }, 1000)
    }

    // updateDataFromDB() {
    //     const date = new Date();
    //     AsyncStorage.getItem('@NamazTable:' + date.toDateString().toString(), (data) => {
    //         if (data == null) {
    //             console.error(date.toDateString() + ' 1');
    //             try {
    //                 AsyncStorage.setItem(
    //                     '@NamazTable:' + date.toDateString().toString(),
    //                     JSON.stringify({
    //                         name: JSON.stringify(this.state.namaz),
    //                         namaz_pray: JSON.stringify(this.state.namaz_pray)
    //                     }));
    //             } catch (error) {
    //                 console.error(error);
    //             }
    //             this.updateDataFromDB();
    //         } else {
    //             console.error(date.toDateString() + ' 2');
    //             AsyncStorage.getItem('@NamazTable:' + date.toDateString().toString(), (data_namaz) => {
    //                 this.setState({
    //                     namaz: JSON.parse(data_namaz.namaz),
    //                     namaz_pray: JSON.parse(data_namaz.namaz_pray)
    //                 });
    //             }, (error) => {
    //                 console.error(error);
    //             });
    //         }
    //     }, (error) => {
    //         console.error(error);
    //     });
    // }

    componentDidMount() {

        AsyncStorage.getItem(this.state.date)
            .then((result) => {
                // console.error(result);
                if (result != null) {
                    this.setState({
                        namaz: JSON.parse(result)
                    });
                }
            })
            .catch((error) => {
                Alert.alert(error.toString());
            });

        this.updateDateTime();
        this.getLocation();
    }

    getNamazTimesFromApiAsync() {
        const fetch_url = 'https://muslimsalat.com/' + this.state.city1 + '/daily.json';

        fetch(fetch_url)
            .then((response) => response.json())
            .then((response) => {
                // console.error(response);
                this.setState({
                    isLoading: false,
                    isError: false,
                    city: response.city,
                    country: response.country,
                    weather: response.today_weather,
                    namaz: response.items[0],
                });
                // this.updateDataFromDB();
                AsyncStorage.setItem(response.items[0].date_for, JSON.stringify(response.items[0]));
            })
            .catch((error) => {
                this.setState({
                    isError: true
                });
                Alert.alert(error.toString());
            });
    }

    getLocation() {
        navigator.geolocation.getCurrentPosition((position) => {

            const fetch_url = 'http://maps.googleapis.com/maps/api/geocode/json?latlng=' + position.coords.latitude + ',' + position.coords.longitude + '&sensor=true';

            // console.error(fetch_url);

            fetch(fetch_url)
                .then((response) => response.json())
                .then((response) => {
                    const results = response.results;
                    // console.error(results);
                    for (var i = 0; i < results.length; i++) {
                        if (results[i].types[0] === "locality") {
                            this.setState({
                                city1: (results[i].address_components[0].short_name).toLowerCase()
                            });
                            this.getNamazTimesFromApiAsync();
                        }
                    }
                })
                .catch((error) => {
                    Alert.alert("Error Code: " + error.code.toString(), error.message.toString());
                    this.getNamazTimesFromApiAsync();
                });

            this.setState({
                coords: position.coords,
            });

        }, (error) => {
            Alert.alert("Error Code: " + error.code.toString(), error.message.toString());
            // this.getNamazTimesFromApiAsync();
        });
    }

    changeState(name) {
        let pray = this.state.namaz_pray;

        if (name == 'fajr') {
            if (this.state.namaz_pray.fajr_pray) {
                pray.fajr_pray = false;
            } else {
                pray.fajr_pray = true;
            }
        } else if (name == 'dhuhr') {
            if (this.state.namaz_pray.dhuhr_pray) {
                pray.dhuhr_pray = false;
            } else {
                pray.dhuhr_pray = true;
            }
        } else if (name == 'asr') {
            if (this.state.namaz_pray.asr_pray) {
                pray.asr_pray = false;
            } else {
                pray.asr_pray = true;
            }
        } else if (name == 'maghrib') {
            if (this.state.namaz_pray.maghrib_pray) {
                pray.maghrib_pray = false;
            } else {
                pray.maghrib_pray = true;
            }
        } else if (name == 'isha') {
            if (this.state.namaz_pray.isha_pray) {
                pray.isha_pray = false;
            } else {
                pray.isha_pray = true;
            }
        } else { }

        this.setState({
            namaz_pray: pray
        });

        // this.updateDataFromDB();
    }

    render() {
        return (
            <ScrollView style={styles.background}>

                <StatusBar
                    backgroundColor="#16f49b"
                    barStyle="dark-content"
                />

                <TouchableNativeFeedback
                    onPress={this.getLocation.bind(this)}
                >
                    <View style={[styles.colView, {
                        justifyContent: 'center',
                    }]}>

                        <H1 style={styles.time}>{this.state.time.toString()}</H1>
                        <Text style={styles.Text}>{this.state.date}</Text>
                        <Text style={styles.Text}>{this.state.city}, {this.state.country}</Text>

                    </View>
                </TouchableNativeFeedback>



                <TouchableNativeFeedback
                    onLongPress={() => { this.changeState('fajr') }}
                >
                    <View style={[styles.outerView, this.state.namaz_pray.fajr_pray && styles.outerViewAlt]}>

                        <View style={styles.innerView}>

                            <Text style={[styles.halfView, styles.halfViewText, this.state.namaz_pray.fajr_pray && styles.halfViewTextAlt, {
                                textAlign: 'left',
                            }]}>Fajr</Text>

                            <Text style={[styles.halfView, styles.halfViewText, this.state.namaz_pray.fajr_pray && styles.halfViewTextAlt, {
                                textAlign: 'right',
                            }]}>{this.state.namaz.fajr}</Text>

                        </View>

                    </View>
                </TouchableNativeFeedback>



                <TouchableNativeFeedback
                    onLongPress={() => { this.changeState('dhuhr') }}
                >
                    <View style={[styles.outerView, this.state.namaz_pray.dhuhr_pray && styles.outerViewAlt]}>

                        <View style={styles.innerView}>

                            <Text style={[styles.halfView, styles.halfViewText, this.state.namaz_pray.dhuhr_pray && styles.halfViewTextAlt, {
                                textAlign: 'left',
                            }]}>Dhuhr</Text>

                            <Text style={[styles.halfView, styles.halfViewText, this.state.namaz_pray.dhuhr_pray && styles.halfViewTextAlt, {
                                textAlign: 'right',
                            }]}>{this.state.namaz.dhuhr}</Text>

                        </View>

                    </View>
                </TouchableNativeFeedback>



                <TouchableNativeFeedback
                    onLongPress={() => { this.changeState('asr') }}
                >
                    <View style={[styles.outerView, this.state.namaz_pray.asr_pray && styles.outerViewAlt]}>

                        <View style={styles.innerView}>

                            <Text style={[styles.halfView, styles.halfViewText, this.state.namaz_pray.asr_pray && styles.halfViewTextAlt, {
                                textAlign: 'left',
                            }]}>Asr</Text>

                            <Text style={[styles.halfView, styles.halfViewText, this.state.namaz_pray.asr_pray && styles.halfViewTextAlt, {
                                textAlign: 'right',
                            }]}>{this.state.namaz.asr}</Text>

                        </View>

                    </View>
                </TouchableNativeFeedback>



                <TouchableNativeFeedback
                    onLongPress={() => { this.changeState('maghrib') }}
                >
                    <View style={[styles.outerView, this.state.namaz_pray.maghrib_pray && styles.outerViewAlt]}>

                        <View style={styles.innerView}>

                            <Text style={[styles.halfView, styles.halfViewText, this.state.namaz_pray.maghrib_pray && styles.halfViewTextAlt, {
                                textAlign: 'left',
                            }]}>Maghrib</Text>

                            <Text style={[styles.halfView, styles.halfViewText, this.state.namaz_pray.maghrib_pray && styles.halfViewTextAlt, {
                                textAlign: 'right',
                            }]}>{this.state.namaz.maghrib}</Text>

                        </View>

                    </View>
                </TouchableNativeFeedback>



                <TouchableNativeFeedback
                    onLongPress={() => { this.changeState('isha') }}
                >
                    <View style={[styles.outerView, this.state.namaz_pray.isha_pray && styles.outerViewAlt]}>

                        <View style={styles.innerView}>

                            <Text style={[styles.halfView, styles.halfViewText, this.state.namaz_pray.isha_pray && styles.halfViewTextAlt, {
                                textAlign: 'left',
                            }]}>Isha</Text>

                            <Text style={[styles.halfView, styles.halfViewText, this.state.namaz_pray.isha_pray && styles.halfViewTextAlt, {
                                textAlign: 'right',
                            }]}>{this.state.namaz.isha}</Text>

                        </View>

                    </View>
                </TouchableNativeFeedback>

                <TouchableNativeFeedback
                    onPress={this.getLocation.bind(this)}
                >

                    <View style={[styles.outerView, styles.bgGreen]}>

                        <View style={styles.innerView}>

                            <Text style={[styles.halfView, styles.Text, {
                                textAlign: 'left',
                            }]}>{this.state.city}'s Weather</Text>

                            <Text style={[styles.halfView, styles.weather, {
                                textAlign: 'right'
                            }]}>
                                <Text style={{ fontSize: 55 * 1.6, lineHeight: 62 * 1.1, textAlignVertical: 'top' }}>
                                    {this.state.weather.temperature}
                                </Text>
                                C
                            </Text>

                        </View>

                    </View>

                </TouchableNativeFeedback>

            </ScrollView>
        );
    }
}
