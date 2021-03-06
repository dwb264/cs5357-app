import React, { Component } from 'react';
import { Text, TextInput, View, TouchableOpacity} from 'react-native';
import styles from './../style';
import { validateStr, sanitizeInput, parseResponseBody, validateInt, getPhoneFromInput } from './../HelperFunctions';
var api = "http://127.0.0.1:8081";

class EnterCodeScreen extends React.Component {

    static navigationOptions = {
        header: null
    };

    constructor(props) {
        super(props);
        this.state = {
            code: '',
            codeError: '',
            userType: '',
        };
    }

    componentDidMount() {
        fetch(api + '/profile', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            credentials: 'same-origin',
        }).then(response => {
            if (response.status === 200) {
                response = parseResponseBody(response);
                this.setState({
                    userType: response.type
                });
            } else {
                console.log(JSON.stringify(response));
                throw new Error('Something went wrong on api server!');
            }
        });
    }

    render() {
        const {navigate} = this.props.navigation;

        const validateCode = () => {
            // Validate code sent by SMS
            this.setState({codeError: validateStr("Code", this.state.code, 100)}, () => {
                if (this.state.codeError == "") {

                    const validData = {"code": this.state.code};

                    // Send SMS to validated number
                    fetch(api + '/verify', {
                        method: 'POST',
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json',
                        },
                        credentials: 'same-origin',
                        body: JSON.stringify(validData)
                    }).then(response => {
                        if (response.status === 200) {
                            console.log(response);
                            if (this.state.userType == 'requester') {
                                navigate('Requester', {"refresh": false});
                            } else {
                                navigate('Mover');
                            }
                        } else {
                            console.log(JSON.stringify(response));
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
                    style={{fontSize: 30, color: "#666", textAlign: 'center', margin: 10}}
                >Thanks for entering your phone.</Text>
                <Text
                    style={{fontSize: 20, color: "#666", textAlign: 'center', margin: 10}}
                >We have sent you a validation code. Please enter it below.</Text>
                <View>
                    <TextInput
                        style={{height: 40, width: 200, margin: 30, textAlign: 'center'}}
                        placeholder="Enter Code"
                        onChangeText={(text) => {
                            this.setState({code: text});
                        }}
                    /><Text style={styles.errorText}>{this.state.codeError}</Text>
                </View>

                <TouchableOpacity
                    onPress={() => validateCode()}
                    style={styles.bigButton}
                ><Text style={{color: "#fff", fontSize: 20}}>Validate</Text></TouchableOpacity>
            </View>
        );
    }
}

export default EnterCodeScreen;