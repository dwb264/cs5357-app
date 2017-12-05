import React, { Component } from 'react';
import { Text, TextInput, View, TouchableOpacity} from 'react-native';
import styles from './../style';
import { validateStr, sanitizeInput, parseResponseBody, validateInt, getPhoneFromInput } from './../HelperFunctions';
var api = "http://127.0.0.1:8081";

class GetCodeScreen extends React.Component {

    static navigationOptions = {
        header: null
    };

    constructor(props) {
        super(props);
        this.state = {
            phone: '',
            phoneError: '',
        };
    }

    render() {

        const { navigate } = this.props.navigation;

        const validatePhone = () => {
            // Validate phone number
            this.setState({phoneError: validateInt("Phone", this.state.phone, 10)}, () => {
                if (this.state.phoneError == "") {

                    const validData = {"phone": this.state.phone};

                    // Send SMS to validated number
                    fetch(api + '/profile', {
                    method: 'PUT',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    }, credentials: 'same-origin',
                    body: JSON.stringify(validData)
                }).then(response => {
                    if (response.status === 200) {
                        navigate("EnterCode");
                    } else {
                        console.log(response);
                        throw new Error('Something went wrong on api server!');
                    }
                });
                }
                return false;
            });


        };

        return (
            <View style={styles.container}>
                <Text
                    style={{fontSize:20, color: "#666", textAlign: 'center', margin: 10}}
                >Please validate your phone number</Text>

                <View style={{height: 100, margin: 20}}>
                <TextInput
                    style={{height: 40, width: 200, textAlign: 'center'}}
                    placeholder="Enter Phone Number"
                    onChangeText={(text) => {
                        this.setState({
                            phone: getPhoneFromInput(text),
                        });
                    }}
                /><Text style={[styles.errorText, {textAlign: 'center'}]}>{ this.state.phoneError }</Text>
                </View>

                <TouchableOpacity
                    onPress={() => validatePhone()}
                    style={styles.bigButton}
                ><Text style={{color: "#fff", fontSize: 20}}>Get Code</Text></TouchableOpacity>

                <TouchableOpacity
                    onPress={() => {
                        if (userType == 'requester') {
                            navigate('Requester');
                        } else {
                            navigate('Mover');
                        }
                    }}
                    style={[styles.bigButton, {backgroundColor: "#666"}]}
                ><Text style={{color: "#fff", fontSize: 20}}>I&apos;ll Do This Later</Text></TouchableOpacity>

            </View>
        );
    }
}

export default GetCodeScreen;