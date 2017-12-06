import React, { Component } from 'react';
import {Text, View, TouchableOpacity, Image} from 'react-native';
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
            <View style={[styles.container, {backgroundColor: "#FAFAFA"}]}>

                <Text
                    style={{fontSize:30, color: "#333", marginTop: 20, marginBottom: 20}}
                >Man With A Van</Text>

                <View style={{width:"100%", height:"50%"}}>

                    <TouchableOpacity
                        onPress={() => {
                            navigate('Login', {"user_type": "mover"});

                        }}
                        style={{width:"100%", height: "50%"}}
                    >
                        <Image
                            style={{width:"100%", height: "100%"}}
                            source={require('./../img/login-mover.png')}

                        />
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => {
                            navigate('Login', {"user_type": "requester"});
                        }}
                        style={{width:"100%", height: "50%"}}
                    >
                        <Image
                            source={require('./../img/login-requester.png')}
                            style={{width:"100%", height: "100%"}}
                        />
                    </TouchableOpacity>
                </View>


                <Text
                    style={{fontSize:16, color: "#333", marginTop: 50, marginBottom: 10}}
                >New Around Here?</Text>

                <TouchableOpacity
                    onPress={() => {
                        navigate('Register', {"user_type": "mover", "image_data": null, "previous_data": null});
                    }}
                    style={styles.bigButton}
                >
                    <Text style={{color: "#fff", fontSize: 20}}>Register as Mover</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => {
                        navigate('Register', {"user_type": "requester", "image_data": null, "previous_data": null});
                    }}

                    style={styles.bigButton}
                >
                    <Text style={{color: "#fff", fontSize: 20}}>Register as Requester</Text>
                </TouchableOpacity>



            </View>
        );
    }
}