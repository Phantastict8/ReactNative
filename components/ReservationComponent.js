import React, { Component } from 'react';
import {
    Text,
    View,
    ScrollView,
    StyleSheet,
    Picker,
    Switch,
    Button,
    Modal,
    Alert,
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as Notifications from 'expo-notifications';

class Reservation extends Component {
    constructor(props) {
        super(props);

        this.state = {
            campers: 1,
            hikeIn: false,
            date: new Date(),
            showCalendar: false,
            // showModal: false,
        };
    }

    static navigationOptions = {
        title: 'Reserve Campsite',
    };

    // toggleModal() {
    //     this.setState({ showModal: !this.state.showModal });
    // }

    handleReservation() {
        console.log(JSON.stringify(this.state));
        // this.toggleModal();
        Alert.alert(
            'Begin Search?',
            `Number of Campers: ${this.state.campers}\n\nHike-In? ${
                this.state.hikeIn
            }\n\nDate: ${this.state.date.toLocaleDateString('en-US')}`,
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                    onPress: () => console.log('Cancel Pressed'),
                },
                {
                    text: 'OK',
                    onPress: () => {
                        this.presentLocalNotification(
                            this.state.date.toLocaleDateString('en-US')
                        );
                        this.resetForm();
                    },
                },
            ],
            { cancelable: false }
        );
    }

    resetForm() {
        this.setState({
            campers: 1,
            hikeIn: false,
            date: new Date(),
            showCalendar: false,
            // showModal: false,
        });
    }

    async presentLocalNotification(date) {
        function sendNotification() {
            Notifications.setNotificationHandler({
                handleNotification: async () => ({
                    shouldShowAlert: true,
                }),
            });

            Notifications.scheduleNotificationAsync({
                content: {
                    title: 'Your Campsite Reservation Search',
                    body: `Search for ${date}' requested`,
                },
                trigger: null,
            });
        }

        let permissions = await Notifications.getPermissionsAsync();
        if (!permissions.granted) {
            permissions = await Notifications.requestPermissionsAsync();
        }
        if (permissions.granted) {
            sendNotification();
        }
    }

    render() {
        return (
            <ScrollView>
                <Animatable.View
                    animation="zoomIn"
                    duration={2000}
                    delay={1000}
                >
                    <View style={styles.formRow}>
                        <Text style={styles.formLabel}>Number of Campers</Text>
                        <Picker
                            style={styles.formItem}
                            selectedValue={this.state.campers}
                            onValueChange={itemValue =>
                                this.setState({ campers: itemValue })
                            }
                        >
                            <Picker.Item label="1" value="1" />
                            <Picker.Item label="2" value="2" />
                            <Picker.Item label="3" value="3" />
                            <Picker.Item label="4" value="4" />
                            <Picker.Item label="5" value="5" />
                            <Picker.Item label="6" value="6" />
                        </Picker>
                    </View>
                    <View style={styles.formRow}>
                        <Text style={styles.formLabel}>Hike-In?</Text>
                        <Switch
                            style={styles.formItem}
                            value={this.state.hikeIn}
                            trackColor={{ true: '#5637DD', false: null }}
                            onValueChange={value =>
                                this.setState({ hikeIn: value })
                            }
                        />
                    </View>
                    <View style={styles.formRow}>
                        <Text style={styles.formLabel}>Date</Text>
                        <Button
                            onPress={() =>
                                this.setState({
                                    showCalendar: !this.state.showCalendar,
                                })
                            }
                            title={this.state.date.toLocaleDateString('en-US')}
                            color="#5637DD"
                            accessibilityLabel="Tap me to select a reservation date"
                        />
                    </View>
                    {this.state.showCalendar && (
                        <DateTimePicker
                            value={this.state.date}
                            mode={'date'}
                            display="default"
                            onChange={(event, selectedDate) => {
                                selectedDate &&
                                    this.setState({
                                        date: selectedDate,
                                        showCalendar: false,
                                    });
                            }}
                            style={styles.formItem}
                        />
                    )}
                    <View style={styles.formRow}>
                        <Button
                            onPress={() => this.handleReservation()}
                            title="Search"
                            color="#5637DD"
                            accessibilityLabel="Tap me to search for available campsites to reserve"
                        />
                    </View>
                </Animatable.View>
                {/* <Modal
                    animationType={'slide'}
                    transparent={false}
                    visible={this.state.showModal}
                    onRequestClose={() => this.toggleModal()}
                >
                    <View style={styles.modal}>
                        <Text style={styles.modalTitle}>
                            Search Campsite Reservations
                        </Text>
                        <Text style={styles.modalText}>
                            Number of Campers: {this.state.campers}
                        </Text>
                        <Text style={styles.modalText}>
                            Hike-In?: {this.state.hikeIn ? 'Yes' : 'No'}
                        </Text>
                        <Text style={styles.modalText}>
                            Date: {this.state.date.toLocaleDateString('en-US')}
                        </Text>
                        <Button
                            onPress={() => {
                                this.toggleModal();
                                this.resetForm();
                            }}
                            color="#5637DD"
                            title="Close"
                        />
                    </View>
                </Modal> */}
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    formRow: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        flexDirection: 'row',
        margin: 20,
    },
    formLabel: {
        fontSize: 18,
        flex: 2,
    },
    formItem: {
        flex: 1,
    },
    modal: {
        justifyContent: 'center',
        margin: 20,
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        backgroundColor: '#5637DD',
        textAlign: 'center',
        color: '#fff',
        marginBottom: 20,
    },
    modalText: {
        fontSize: 18,
        margin: 10,
    },
});

export default Reservation;
