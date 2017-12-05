import React, { Component } from 'react';
import { Text, View, TouchableOpacity} from 'react-native';
import styles from './../style';
import { validateStr, sanitizeInput, parseResponseBody, validateInt, getPhoneFromInput } from './../HelperFunctions';
var api = "http://127.0.0.1:8081";

export default class InitialOptionScreen extends React.Component {

    static navigationOptions = {
        header: null
    };

    render() {

        const { navigate } = this.props.navigation;

        return (
            <View style={styles.container}>

                <Text
                    style={{fontSize:30, color: "#666"}}
                >Man With A Van</Text>
                <TouchableOpacity
                    onPress={() => {
                        userType = 'mover';
                        navigate('Login');
                    }}
                    style={styles.bigButton}
                >
                    <Text style={{color: "#fff", fontSize: 20}}>Login as Mover</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => {
                        userType = 'requester';
                        navigate('Login');
                    }}
                    style={styles.bigButton}
                >
                    <Text style={{color: "#fff", fontSize: 20}}>Login as Requester</Text>
                </TouchableOpacity>

                    <Text
                    onPress={() => {
                        userType = 'mover';
                        navigate('Register', {"user_type": "mover", "image_data": null, "previous_data": null});
                    }}
                    style={{margin: 5}}
                    >Register as Mover</Text>

                    <Text
                    onPress={() => {
                        userType = 'requester';
                        navigate('Register', {"user_type": "requester", "image_data": null, "previous_data": null});
                    }}
                    style={{margin: 5}}
                    >Register as Requester</Text>

            </View>
        );
    }
}