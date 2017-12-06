import React, { Component } from 'react';
import { Text, TextInput, View, TouchableOpacity} from 'react-native';
import styles from './../style';
import { validateStr, sanitizeInput, parseResponseBody, validateInt, getPhoneFromInput } from './../HelperFunctions';
var api = "http://127.0.0.1:8081";

class LoginScreen extends React.Component {

    static navigationOptions = {
        header: null
    };

    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            error: '',
            userType: this.props.navigation.state.params.user_type,
        };
    }

    render() {

        const { navigate } = this.props.navigation;

        const validateLogin = () => {
            // Validate login credentials
            if (this.state.username == "" || this.state.password == "") {
                this.setState({error: "Username and password cannot be blank"});
                return false;

            } else {
                validData = {
                    "type": this.state.userType,
                    "username": this.state.username,
                    "password": this.state.password,
                };

                console.log(validData);

                fetch(api + '/login', {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(validData)
                }).then(response => {
                    if (response.status === 200) {
                        if (this.state.userType == 'requester') {
                            navigate('Requester', {"user_type": "requester"});
                        } else if (this.state.userType == 'mover') {
                            navigate('Mover', {"user_type": "mover"});
                        }
                    } else {
                        this.setState({error: "User not found. Please try again."});
                    }
                });

                return true;
            }
        };

        return (
            <View style={styles.container}>
                <Text
                    style={{fontSize:30, color: "#666", textAlign: 'center', margin: 10}}
                >Welcome back!</Text>
                <Text
                    style={{fontSize:20, color: "#666", textAlign: 'center',  margin: 10}}
                >Login as {this.state.userType}</Text>
                <TextInput
                    style={{height: 40, width: 200, margin:10, width: "90%", textAlign: 'center'}}
                    placeholder="Username"
                    onChangeText={(text) => this.setState({username: text})}
                />
                <TextInput
                    style={{height: 40, width: 200, margin:10, width: "90%", textAlign: 'center'}}
                    placeholder="Password"
                    secureTextEntry={true}
                    onChangeText={(text) => this.setState({password: text})}
                />
                <TouchableOpacity
                    onPress={() => validateLogin()}
                    style={styles.bigButton}
                ><Text style={{color: "#fff", fontSize: 20}}>Log In</Text></TouchableOpacity>
                <Text style={styles.errorText}> { this.state.error }</Text>
            </View>
        );
    }
}

export default LoginScreen;