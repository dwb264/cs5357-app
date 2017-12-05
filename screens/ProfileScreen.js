import React, { Component } from 'react';
import { Text, TextInput, ScrollView, View, Image, TouchableOpacity} from 'react-native';
import styles from './../style';
import { validateStr, sanitizeInput, parseResponseBody, validateInt, getPhoneFromInput } from './../HelperFunctions';

export default class ProfileScreen extends React.Component {
    static navigationOptions = {
        tabBarLabel: 'Profile',
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
        const isMover = userType == 'mover' ? true : false;

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
                        "type": userType,
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

        return (
                <ScrollView>
                    <View style={styles.container}>

                        <View style={styles.grayHeader}>
                            <Text style={styles.h1}>{this.state.firstName}&apos;s Profile</Text>
                        </View>

                    <Text
                        style={{display: this.state.validatedPhone ? 'none' : 'flex',
                            width: "100%",
                            backgroundColor: "yellow",
                            padding: 5,
                            marginTop: 0,
                            textAlign: 'center',
                        }}
                        onPress={() => navigate('GetCode')}
                    >Phone not yet validated. Tap here to validate phone</Text>
                    <View style={{flex:0, flexDirection: "row", justifyContent: "space-between", width: "90%", marginTop: 20}}>
                        <TouchableOpacity onPress={() => updateProfilePhoto()}>
                            <Image source={this.state.profilePhoto} style={{width: 100, height: 100}}/>
                        </TouchableOpacity>
                        <View style={{width: "80%", alignItems: 'flex-start', flexDirection: "row", marginLeft: 20}}>
                            <View>
                            <Text style={styles.jobDetailDesc}>First Name</Text>
                            <TextInput
                                style={[styles.formField, {width: 100, marginRight: 10}]}
                                placeholder="First Name"
                                defaultValue={this.state.firstName}
                                onChangeText={(text) => this.setState({newFirstName: text})}
                            />
                                <Text style={styles.errorText}>{this.state.firstNameError}</Text>
                            </View>
                            <View>
                            <Text style={styles.jobDetailDesc}>Last Name</Text>
                             <TextInput
                                style={[styles.formField, {width: 100}]}
                                placeholder="Last Name"
                                defaultValue={this.state.lastName}
                                onChangeText={(text) => this.setState({newLastName: text})}
                             />
                                <Text style={styles.errorText}>{this.state.lastNameError}</Text>
                            </View>
                        </View>
                    </View>

                        <View style={{flexDirection: "row", marginTop: 20, width: "90%"}}>
                            <View style={{width: "50%"}}>
                                <Text style={styles.jobDetailDesc}>Username</Text>
                                <TextInput
                                    style={[styles.formField, {marginRight: 10}]}
                                    placeholder="Username"
                                    defaultValue={this.state.username}
                                    onChangeText={(text) => this.setState({newUsername: text})}
                                /><Text style={styles.errorText}>{this.state.usernameError}</Text>
                            </View>
                            <View style={{width: "50%"}}>
                                <Text style={styles.jobDetailDesc}>Password</Text>
                                <TextInput
                                    style={styles.formField}
                                    placeholder="Password"
                                    secureTextEntry={true}
                                    defaultValue={this.state.password}
                                    onChangeText={(text) => this.setState({newPassword: text})}
                                /><Text style={styles.errorText}>{this.state.passwordError}</Text>
                            </View>
                        </View>

                        <View style={{width: "90%", display: isMover ? 'flex' : 'none'}}>
                            <Text style={styles.jobDetailDesc}>Zip Code</Text>
                            <TextInput
                                style={styles.formField}
                                placeholder="Zip Code"
                                defaultValue={this.state.zipCode}
                                onChangeText={(text) => this.setState({newZipCode: text})}
                            /><Text style={styles.errorText}>{this.state.zipcodeError}</Text>
                        </View>

                        <View style={{width: "90%", display: isMover ? 'flex' : 'none'}}>
                            <Text style={styles.jobDetailDesc}>Vehicle Type</Text>

                            <TextInput
                                style={styles.formField}
                                placeholder="Vehicle Type"
                                defaultValue={this.state.vehicle}
                                onChangeText={(text) => this.setState({newVehicle: text})}
                            /><Text style={styles.errorText}>{this.state.vehicleError}</Text>
                        </View>

                        <View style={{width: "90%", display: isMover ? 'flex' : 'none'}}>
                            <Text style={styles.jobDetailDesc}>Payment Types Accepted</Text>

                            <TextInput
                                style={styles.formField}
                                placeholder="Payment Types Accepted"
                                defaultValue={this.state.payments}
                                onChangeText={(text) => this.setState({newPayments: text})}
                            /><Text style={styles.errorText}>{this.state.paymentError}</Text>
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
