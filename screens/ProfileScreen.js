import React, { Component } from 'react';
import { Text, TextInput, ScrollView, View, Image, TouchableOpacity} from 'react-native';
import styles from './../style';
import { validateStr, sanitizeInput, parseResponseBody, validateInt, getPhoneFromInput } from './../HelperFunctions';
var api = "http://127.0.0.1:8081";

export default class ProfileScreen extends React.Component {
    static navigationOptions = {
        tabBarLabel: 'Profile',
        tabBarIcon: () => (
            <Image
                source={require('./../img/icon-profile.png')}
                style={{width: 30, height: 30}}
            />
        ),
    };

    constructor(props) {
        super(props);
        this.state = {
            // TODO: get profile photo as well
            firstName: "",
            lastName: "",
            profilePhoto: require("./../img/jeff.png"),
            username: "",
            password: "",
            zipCode: "",
            vehicle: "",
            payments: "",
            validatedPhone: false,

            // If the user changes anything, it will be stored here
            newFirstName: null,
            newLastName: null,
            newProfilePhoto: null,
            newUsername: null,
            newPassword: null,
            newZipCode: null,
            newVehicle: null,
            newPayments: null,

            firstNameError: '',
            lastNameError: '',
            usernameError: '',
            passwordError: '',
            zipcodeError: '',
            vehicleError: '',
            paymentError: '',

            userType: "",
        }
    }

    componentDidMount() {
            fetch(api + "/profile", {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
            }, credentials: 'same-origin',
        }).then(response => {
            if (response.status === 200) {
                response = parseResponseBody(response);
                this.setState({
                        userType: response.type,
                        firstName: response.first_name,
                        lastName: response.last_name,
                        username: response.username,
                        password: response.password,
                        zipCode: response.zipcode,
                        vehicle: response.vehicle,
                        payments: response.payment,
                        validatedPhone: response["verified_phone"],

                        newFirstName: response.first_name,
                        newLastName: response.last_name,
                        newUsername: response.username,
                        newPassword: response.password,
                        newZipCode: response.zipcode,
                        newVehicle: response.vehicle,
                        newPayments: response.payment,
                });


            } else {
                throw new Error('Something went wrong on api server!');
            }
        });
    }

    render() {
        const { navigate } = this.props.navigation;
        const isMover = this.state.userType == 'mover' ? true : false;

        const updateProfile = () => {
            // TODO: Validate form and post data to DB
            var validData = {};

            this.setState({
                firstNameError: validateStr("First name", this.state.newFirstName, 100),
                lastNameError: validateStr("Last name", this.state.newLastName, 100),
                usernameError: validateStr("Username", this.state.newUsername, 50),
                zipcodeError: validateInt("Zipcode", this.state.newZipCode, 5),
                vehicleError: validateStr("Vehicle", this.state.newVehicle, 100),
                paymentError: validateStr("Payment", this.state.newPayments, 100),
            }, () => {

                if (this.state.firstNameError == ""
                    && this.state.lastNameError == ""
                    && this.state.usernameError == ""
                    && this.state.zipcodeError == ""
                    && this.state.vehicleError == ""
                    && this.state.paymentError == ""
                ) {

                    const validData = {
                        "type": this.state.userType,
                        "first_name": this.state.newFirstName,
                        "last_name": this.state.newLastName,
                        "username": this.state.newUsername,
                        "zipcode": this.state.newZipCode,
                        "vehicle": this.state.newVehicle,
                        "payment": this.state.newPayments,
                    }

                    fetch(api + "/profile", {
                        method: 'PUT',
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json'
                        }, credentials: 'same-origin',
                        body: JSON.stringify(validData),
                    }).then(response => {
                        if (response.status === 200) {
                            response = parseResponseBody(response);
                            this.setState({
                                firstName: response.first_name,
                                lastName: response.last_name,
                                username: response.username,
                                zipCode: response.zipcode,
                                vehicle: response.vehicle,
                                payments: response.payment,
                            });

                        } else {
                            throw new Error('Something went wrong on api server!');
                        }
                    });
                }
            });
        }

        const cancelUpdateProfile = () => {
            // Revert all fields to original state
            fetch(api + "/profile", {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                }, credentials: 'same-origin',
            }).then(response => {
                if (response.status === 200) {
                    response = parseResponseBody(response);
                    this.setState({
                        firstName: response.first_name,
                        lastName: response.last_name,
                        username: response.username,
                        password: response.password,
                        zipCode: response.zipcode,
                        vehicle: response.vehicle,
                        payments: response.payment,
                    });

                } else {
                    throw new Error('Something went wrong on api server!');
                }
            });
        };

        const updateProfilePhoto = () => {
            // TODO: allow new image to be uploaded
            alert("Tapping photo will trigger prompt to upload new photo");
        };

        const logout = () => {
            fetch(api + "/logout", {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                }, credentials: 'same-origin',
            }).then(response => {
                if (response.status === 200) {
                    navigate("InitialOptions");
                } else {
                    throw new Error('Something went wrong on api server!');
                }
            });
        }

        return (
                <ScrollView>

                    <Text
                        style={{display: this.state.validatedPhone ? 'none' : 'flex',
                            width: "100%",
                            backgroundColor: "yellow",
                            padding: 5,
                            marginTop: 24,
                            textAlign: 'center',
                        }}
                        onPress={() => navigate('GetCode', {'user_type': this.state.userType})}
                    >Phone not yet validated. Tap here to validate phone</Text>

                    <View style={[styles.grayHeader, {marginTop: 0}]}>
                            <Text style={styles.h1}>{this.state.firstName}&apos;s Profile</Text>
                            <TouchableOpacity
                                onPress={() => {logout()}} >
                                <Text>Logout</Text>
                            </TouchableOpacity>
                        </View>

                    <View style={styles.containerTop}>

                        <TouchableOpacity style={{alignItems: "center"}}
                                          onPress={() => updateProfilePhoto()}>
                            <Image source={this.state.profilePhoto} style={{margin: 10, width: 100, height: 100}}/>
                            <Text style={{color: "#999"}}>Tap to update profile photo</Text>
                        </TouchableOpacity>

                        <View style={{width: "90%", alignItems: "center", marginTop: 30}}>
                            <View style={{ flexDirection: "row", alignItems: "flex-start", height: 40}}>
                                <Text style={{fontSize: 16, color: "#999", width: "50%", textAlign: "right"}}>First Name</Text>
                                <TextInput
                                    style={[{fontSize: 16, marginLeft: 20, width: "50%"}]}
                                    placeholder="First Name"
                                    defaultValue={this.state.firstName}
                                    onChangeText={(text) => this.setState({newFirstName: text})}
                                />
                            </View>
                            <Text style={[styles.errorText, {marginTop: -10}]}>{this.state.firstNameError}</Text>
                        </View>


                        <View style={{width: "90%", alignItems: "center", marginTop: 10}}>
                            <View style={{ flexDirection: "row", alignItems: "flex-start", height: 40}}>
                            <Text style={{fontSize: 16, color: "#999", width: "50%", textAlign: "right"}}>Last Name</Text>
                             <TextInput
                                style={[{fontSize: 16, marginLeft: 20, width: "50%"}]}
                                placeholder="Last Name"
                                defaultValue={this.state.lastName}
                                onChangeText={(text) => this.setState({newLastName: text})}
                             />
                            </View>
                            <Text style={[styles.errorText, {marginTop: -10}]}>{this.state.lastNameError}</Text>
                        </View>

                        <View style={{width: "90%", alignItems: "center", marginTop: 10}}>
                            <View style={{ flexDirection: "row", alignItems: "flex-start", height: 40}}>
                                <Text style={{fontSize: 16, color: "#999", width: "50%", textAlign: "right"}}>Username</Text>
                                <TextInput
                                    style={{fontSize: 16, marginLeft: 20, width: "50%"}}
                                    placeholder="Username"
                                    defaultValue={this.state.username}
                                    onChangeText={(text) => this.setState({newUsername: text})}
                                />
                                </View>
                                <Text style={[styles.errorText, {marginTop: -10}]}>{this.state.usernameError}</Text>
                            </View>


                        <View style={{width: "90%", alignItems: "center", marginTop: 10, marginBottom: 30}}>
                            <View style={{ flexDirection: "row", alignItems: "flex-start", height: 40}}>
                                <Text style={{fontSize: 16, color: "#999", width: "50%", textAlign: "right"}}>Password</Text>
                                <TextInput
                                    style={{fontSize: 16, marginLeft: 20, width: "50%"}}
                                    placeholder="Password"
                                    secureTextEntry={true}
                                    defaultValue="******"
                                    onChangeText={(text) => this.setState({newPassword: text})}
                                />
                                </View>
                                <Text style={[styles.errorText, {marginTop: -10}]}>{this.state.passwordError}</Text>
                            </View>

                        <View style={{width: "90%", display: isMover ? 'flex' : 'none', alignItems: "center", marginTop: 10}}>
                            <View style={{ flexDirection: "row", alignItems: "flex-start", height: 40}}>
                            <Text style={{fontSize: 16, color: "#999", width: "50%", textAlign: "right"}}>Zip Code</Text>
                            <TextInput
                                style={{fontSize: 16, marginLeft: 20, width: "50%"}}
                                placeholder="Zip Code"
                                defaultValue={this.state.zipCode}
                                onChangeText={(text) => this.setState({newZipCode: text})}
                            />
                            </View>
                            <Text style={styles.errorText}>{this.state.zipcodeError}</Text>
                        </View>

                        <View style={{width: "90%", display: isMover ? 'flex' : 'none', alignItems: "center", marginTop: 10}}>
                            <View style={{ flexDirection: "row", alignItems: "flex-start", height: 40}}>
                            <Text style={{fontSize: 16, color: "#999", width: "50%", textAlign: "right"}}>Vehicle Type</Text>
                            <TextInput
                                style={{fontSize: 16, marginLeft: 20, width: "50%"}}
                                placeholder="Vehicle Type"
                                defaultValue={this.state.vehicle}
                                onChangeText={(text) => this.setState({newVehicle: text})}
                            /></View>
                            <Text style={styles.errorText}>{this.state.vehicleError}</Text>
                        </View>

                        <View style={{width: "90%", display: isMover ? 'flex' : 'none', alignItems: "center", marginTop: 10, marginBottom: 30}}>
                            <View style={{ flexDirection: "row", alignItems: "flex-start", height: 40}}>
                            <Text style={{fontSize: 16, color: "#999", width: "50%", textAlign: "right"}}>Payment Types Accepted</Text>
                            <TextInput
                                style={{fontSize: 16, marginLeft: 20, width: "50%"}}
                                placeholder="Payment Types"
                                defaultValue={this.state.payments}
                                onChangeText={(text) => this.setState({newPayments: text})}
                            /></View>
                            <Text style={styles.errorText}>{this.state.paymentError}</Text>
                        </View>

                    <View style={styles.grayFooter}>
                        <TouchableOpacity
                             onPress={() => updateProfile()}
                            style={styles.bigButton}
                        ><Text style={{color: "#fff", fontSize: 20}}>Save Changes</Text></TouchableOpacity>

                        <Text
                            onPress={() => cancelUpdateProfile()}
                        >Cancel</Text>
                    </View>
                </View>
                </ScrollView>
        );
    };
}
