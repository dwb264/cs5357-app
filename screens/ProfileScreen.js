import React, { Component } from 'react';
import { Text, TextInput, ScrollView, View, Image, TouchableOpacity} from 'react-native';
import styles from './../style';
import { validateStr, sanitizeInput, parseResponseBody, validateInt, getPhoneFromInput } from './../HelperFunctions';
var api = "https://man-in-a-van.appspot.com";

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
            defaultPhoto: require("./../img/jeff.png"),

            firstName: "",
            lastName: "",
            profilePhoto: null,
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
                        profilePhoto: response.photo,

                        newFirstName: response.first_name,
                        newLastName: response.last_name,
                        newUsername: response.username,
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

            this.setState({
                firstNameError: validateStr("First name", this.state.newFirstName, 100),
                lastNameError: validateStr("Last name", this.state.newLastName, 100),
                usernameError: validateStr("Username", this.state.newUsername, 50),
            }, () => {

                if (this.state.userType === 'mover') {
                    this.setState({
                        zipcodeError: validateInt("Zipcode", this.state.newZipCode, 5),
                        vehicleError: validateStr("Vehicle", this.state.newVehicle, 100),
                        paymentError: validateStr("Payment", this.state.newPayments, 100),
                    });
                }


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
                        },
                        body: JSON.stringify(validData),
                    }).then(response => {
                        if (response.status === 200) {
                            this.setState({
                                firstName: this.state.newFirstName,
                                lastName: this.state.newLastName,
                                username:this.state.newUsername,
                                zipCode: this.state.newZipCode,
                                vehicle: this.state.newVehicle,
                                payments: this.state.newPayments,
                            });
                            alert("Changes saved successfully.");
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

                    <View style={[styles.grayHeader, {
                        justifyContent: "space-between",
                        flexDirection: "row",
                        alignItems: "flex-start"
                    }]}>
                            <Text style={styles.h1}>{this.state.firstName}&apos;s Profile</Text>
                            <TouchableOpacity
                                style={{backgroundColor: "#FF6E40", padding: 10, marginTop: 20}}
                                onPress={() => {logout()}} >
                                <Text style={{color: "#fff"}}>Logout</Text>
                            </TouchableOpacity>
                        </View>

                    <View style={styles.containerTop}>

                        <TouchableOpacity style={{alignItems: "center"}}
                                          /* No updating for now
                                          onPress={() => updateProfilePhoto()} */>

                            <Image source={this.state.defaultPhoto}
                                   style={[styles.profilePhoto, {display: this.state.profilePhoto ? "none" : "flex"}]}/>

                            <Image source={{uri: "data:image/png;base64," + this.state.profilePhoto}}
                                   style={[styles.profilePhoto, {display: this.state.profilePhoto ? "flex" : "none"}]}/>

                            { /* <Text style={{color: "#999"}}>Tap to update profile photo</Text> */ }
                        </TouchableOpacity>

                        <View style={styles.profileFormView}>
                            <View style={styles.profileFormView2}>
                                <Text style={styles.profileFormLabel}>First Name</Text>

                                <View style={{width: "50%", marginLeft: 20}}>
                                <TextInput
                                    style={{fontSize: 16, height: 40}}
                                    placeholder="First Name"
                                    defaultValue={this.state.firstName}
                                    onChangeText={(text) => this.setState({newFirstName: text})}
                                />
                                <Text style={styles.errorText}>{this.state.firstNameError}</Text>
                                </View>

                            </View>

                        </View>


                        <View style={styles.profileFormView}>
                            <View style={styles.profileFormView2}>
                            <Text style={styles.profileFormLabel}>Last Name</Text>

                              <View style={{width: "50%", marginLeft: 20}}>
                             <TextInput
                                style={{fontSize: 16, height: 40}}
                                placeholder="Last Name"
                                defaultValue={this.state.lastName}
                                onChangeText={(text) => this.setState({newLastName: text})}
                             />
                                <Text style={styles.errorText}>{this.state.lastNameError}</Text>
                                </View>
                            </View>

                        </View>

                        <View style={[styles.profileFormView, {marginBottom: 30}]}>
                            <View style={styles.profileFormView2}>
                                <Text style={styles.profileFormLabel}>Username</Text>

                                <View style={{width: "50%", marginLeft: 20}}>
                                <TextInput
                                    style={{fontSize: 16, height: 40}}
                                    placeholder="Username"
                                    defaultValue={this.state.username}
                                    onChangeText={(text) => this.setState({newUsername: text})}
                                />
                                <Text style={styles.errorText}>{this.state.usernameError}</Text>

                                </View>

                                </View>
                            </View>

                        { /* You can't change your password sorry

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
                            */
                        }

                        <View style={[styles.profileFormView, {display: isMover ? 'flex' : 'none'}]}>
                            <View style={styles.profileFormView2}>
                            <Text style={styles.profileFormLabel}>Zip Code</Text>

                                <View style={{width: "50%", marginLeft: 20}}>
                            <TextInput
                                style={{fontSize: 16, height: 40}}
                                placeholder="Zip Code"
                                defaultValue={this.state.zipCode}
                                onChangeText={(text) => this.setState({newZipCode: text})}
                            />
                            <Text style={styles.errorText}>{this.state.zipcodeError}</Text>

                            </View>

                            </View>
                        </View>

                        <View style={[styles.profileFormView, {display: isMover ? 'flex' : 'none'}]}>
                            <View style={styles.profileFormView2}>
                            <Text style={styles.profileFormLabel}>Vehicle Type</Text>

                                <View style={{width: "50%", marginLeft: 20}}>
                            <TextInput
                                style={{fontSize: 16, height: 40}}
                                placeholder="Vehicle Type"
                                defaultValue={this.state.vehicle}
                                onChangeText={(text) => this.setState({newVehicle: text})}
                            />
                            <Text style={styles.errorText}>{this.state.vehicleError}</Text>
                                    </View>
                                </View>
                        </View>

                        <View style={[styles.profileFormView, {display: isMover ? 'flex' : 'none', marginBottom: 30}]}>
                            <View style={styles.profileFormView2}>
                            <Text style={styles.profileFormLabel}>Payment Types</Text>

                                <View style={{width: "50%", marginLeft: 20}}>
                            <TextInput
                                style={{fontSize: 16, height: 40}}
                                placeholder="Payment Types"
                                defaultValue={this.state.payments}
                                onChangeText={(text) => this.setState({newPayments: text})}
                            />
                            <Text style={styles.errorText}>{this.state.paymentError}</Text>
                                    </View>
                            </View>
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
