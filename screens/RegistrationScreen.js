import React, { Component } from 'react';
import {Text, TextInput, View, TouchableOpacity, Image, ScrollView} from 'react-native';
import styles from './../style';
import { validateStr, sanitizeInput, parseResponseBody, validateInt, getPhoneFromInput } from './../HelperFunctions';
var api = "https://man-in-a-van.appspot.com";

class RegistrationScreen extends React.Component {

    static navigationOptions = {
        header: null
    };

    constructor(props) {
        super(props);
        this.state = {
                userType: this.props.navigation.state.params.user_type,
                firstName: '',
                lastName: '',
                username: '',
                password: '',
                zipcode: '',
                vehicle: '',
                payment: '',

                firstNameError: '',
                lastNameError: '',
                usernameError: '',
                passwordError: '',
                zipcodeError: '',
                vehicleError: '',
                paymentError: '',
                photoError: '',

                allErrors: '',

                imageData: this.props.navigation.state.params.image_data,

            };

        //console.log(this.state.imageData);
    }

    componentDidMount() {

        if (this.props.navigation.state.params.previous_data !== null) {
            this.state = this.props.navigation.state.params.previous_data;
        }

        this.setState({imageData: this.props.navigation.state.params.image_data});

        if (this.props.navigation.state.params.image_data !== null) {
            this.setState({ photoError: ""})
        }
    }

    render() {
        const {navigate} = this.props.navigation;
        const isMover = this.props.navigation.state.params.user_type === 'mover' ? true : false;

        const submitForm = () => {

            /* -- Validate Form --*/

            this.setState({
                firstNameError: validateStr("First name", this.state.firstName, 100),
                lastNameError: validateStr("Last name", this.state.lastName, 100),
                usernameError: validateStr("Username", this.state.username, 50),
                passwordError: validateStr("Password", this.state.password, 100),
                //photoError: this.state.imageData === null ? "Please upload a profile photo" : "",

            }, () => {

                if (isMover) {
                    this.setState({
                        zipcodeError: validateInt("Zipcode", this.state.zipcode, 5),
                        vehicleError: validateStr("Vehicle", this.state.vehicle, 100),
                        paymentError: validateStr("Payment", this.state.payment, 50),
                    })
                }

                if (this.state.firstNameError == ""
                    && this.state.lastNameError == ""
                    && this.state.usernameError == ""
                    && this.state.passwordError == ""
                    && this.state.zipcodeError == ""
                    && this.state.vehicleError == ""
                    && this.state.paymentError == ""
                    && this.state.photoError == ""
                ) {

                    const validData = {
                        "type": this.state.userType,
                        "first_name": this.state.firstName,
                        "last_name": this.state.lastName,
                        "username": this.state.username,
                        "password": this.state.password,
                        "zipcode": this.state.zipcode,
                        "vehicle": this.state.vehicle,
                        "payment": this.state.payment,
                        "photo": this.state.imageData,
                    };

                    // POST new user to database

                    fetch(api + "/profile", {
                        method: 'POST',
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json',
                        }, credentials: 'include',
                        body: JSON.stringify(validData)
                    }).then(response => {
                        if (response.status === 201) {
                            navigate("GetCode", {user_type: this.state.userType});
                        } else {
                            console.log(JSON.stringify(response));
                            throw new Error('Something went wrong on api server!');
                        }
                    }).catch(function(error) {
                        console.log(error);
                    })

                } else {
                    this.setState({allErrors: "Please fix errors."});
                    return false;
                }

            });
        };

        return (


            <ScrollView>

                <View style={styles.grayHeader}>
                    <Text style={[styles.h1, {marginTop: 20}]}>Register as {this.state.userType}</Text>
                </View>

                <View style={{backgroundColor: "#fff", alignItems: "center", marginTop: -20}}>

                <View style={{width: "90%", flex: 1, marginTop: 24, alignItems: "center", flexDirection: "column",
        justifyContent: 'center'}}>

                    <View style={{flexDirection: "row", justifyContent: "space-between", width: "90%"}}>
                        <View style={{ width: "45%", height: 40}}>
                        <TextInput
                            style={{height: 40, width: "100%", marginTop:10, marginBottom:5}}
                            placeholder="First Name"
                            value={this.state.firstName}
                            onChangeText={(text) => {
                                this.setState({
                                    firstName: text,
                                    firstNameError: validateStr("First name", text, 100)
                                });
                                }
                            }
                        />
                        <Text style={[styles.errorText, {marginTop: -10}]}>{ this.state.firstNameError }</Text>
                        </View>

                        <View style={{ width: "45%", height: 40}}>
                        <TextInput
                            style={{height: 40, width: "100%", marginTop:10, marginBottom:5}}
                            placeholder="Last Name"
                            value={this.state.lastName}
                            onChangeText={(text) => this.setState({
                                    lastName: text,
                                    lastNameError: validateStr("Last name", text, 100)
                                })
                            }
                        /><Text style={[styles.errorText, {marginTop: -10}]}>{ this.state.lastNameError }</Text>
                        </View>
                    </View>

                    <View style={styles.formField}>
                    <TextInput
                        style={{height: 40, width: "100%", marginTop:10, marginBottom:5}}
                        placeholder="Username"
                        value={this.state.username}
                        onChangeText={(text) => this.setState({
                            username: text,
                            usernameError: validateStr("Username", text, 50)
                        })
                        }
                    /><Text style={[styles.errorText, {marginTop: -10}]}>{ this.state.usernameError }</Text>
                    </View>

                    <View style={[styles.formField, {marginBottom: 30}]}>
                    <TextInput
                        style={{height: 40, width: "100%", marginTop:10, marginBottom:5}}
                        placeholder="Password"
                        value={this.state.password}
                        secureTextEntry={true}
                        onChangeText={(text) => this.setState({
                                    password: text,
                                    passwordError: validateStr("Password", text, 100)
                                })
                            }
                    /><Text style={[styles.errorText, {marginTop: -10}]}>{ this.state.passwordError }</Text>
                    </View>

                    <View style={[styles.formField, {display: isMover ? 'flex' : 'none'}]}>
                    <TextInput
                        style={{height: 40, width: "100%", marginTop:10, marginBottom:5 }}
                        placeholder="Zip Code"
                        value={this.state.zipcode}
                        onChangeText={(text) => this.setState({
                                    zipcode: text,
                                    zipcodeError: validateInt("Zipcode", text, 5)
                                })
                            }
                    /><Text style={[styles.errorText, {marginTop: -10}]}>{ this.state.zipcodeError }</Text>
                    </View>

                    <View style={[styles.formField, {display: isMover ? 'flex' : 'none'}]}>
                    <TextInput
                        style={{height: 40, width: "100%", marginTop:10, marginBottom:5, display: isMover ? 'flex' : 'none'}}
                        placeholder="Vehicle Type"
                        value={this.state.vehicle}
                        onChangeText={(text) => this.setState({
                                    vehicle: text,
                                    vehicleError: validateStr("Vehicle", text, 100)
                                })
                            }
                    /><Text style={[styles.errorText, {marginTop: -10}]}>{ this.state.vehicleError }</Text>
                    </View>

                    <View style={[styles.formField, {display: isMover ? 'flex' : 'none', marginBottom: 20}]}>
                    <TextInput
                        style={{height: 40, width: "100%", marginTop:10, marginBottom:5, display: isMover ? 'flex' : 'none'}}
                        placeholder="Payment Types Accepted"
                        value={this.state.payment}
                        onChangeText={(text) => this.setState({
                                    payment: text,
                                    paymentError: validateStr("Payment", text, 100)
                                })
                            }
                    /><Text style={[styles.errorText, {marginTop: -10}]}>{ this.state.paymentError }</Text>
                    </View>

                    <TouchableOpacity
                        style={{alignItems: "center", marginBottom: 30}}
                        onPress={() => {
                            this.props.navigation.state.params.previous_data = this.state;
                            navigate("Camera", {"previous_data": this.props.navigation.state.params.previous_data})

                        }}
                    >
                        <Text style={{height: 30, width: "90%", marginTop: 20, margin:10, display: this.state.imageData ? "none" : "flex"}}>📷 Take Profile Photo</Text>
                        <Text style={styles.errorText}>{ this.state.photoError }</Text>
                        <Text style={{height: 30, width: "90%", marginTop: 20, margin:10, display: this.state.imageData ? "flex" : "none"}}>Photo Uploaded Successfully. Tap to retake.</Text>
                        <Image
                               source={{uri: this.state.imageData ? 'data:image/png;base64,' + this.state.imageData : "./../img/jeff.png"}} style={{
                            display: this.state.imageData ? "flex" : "none",
                            width: 100,
                            height: 100
                        }}/>


                    </TouchableOpacity>



                    </View>
                    <View style={styles.grayFooter}>
                    <TouchableOpacity
                        onPress={() => submitForm() ? navigate('GetCode', {'user_type': this.state.userType}) : false}
                        style={styles.bigButton}
                    >
                        <Text style={{color: "#fff", fontSize: 20}}>Create Account</Text>
                    </TouchableOpacity>
                    <Text style={styles.errorText}>{ this.state.allErrors }</Text>
                    </View>
                </View>
                 </ScrollView>
        );
}

}

export default RegistrationScreen;