import React, { Component } from 'react';
import {Text, TextInput, ScrollView, View, TouchableOpacity, Image} from 'react-native';
import DateTimePicker from 'react-native-modal-datetime-picker';
import styles from './../style';
import { validateStr, parseResponseBody, validateInt, getPhoneFromInput, validatePrice } from './../HelperFunctions';
var api = "http://127.0.0.1:8081";

class RequestFormScreen extends React.Component {

    static navigationOptions = {
        tabBarLabel: 'Request',
        tabBarIcon: () => (
            <Image
                source={require('./../img/icon-request.png')}
                style={{width: 30, height: 30}}
            />
        ),
    };

    constructor(props) {
        super(props);
        this.state = {
            startAddress: '',
            endAddress: '',
            startTime: '',
            endTime: '',
            maximumPrice: '',
            description: '',
            timePickerVisible: false,
            activeField: null,
            submitted:false,

            startAddressError: '',
            endAddressError: '',
            startTimeError: '',
            endTimeError: '',
            maximumPriceError: '',
            descriptionError: '',

            allErrors: '',
        };
    }

    componentDidMount() {
        // See if the user has a currently open job, and if so, load it
        fetch(api + '/jobs', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            credentials: 'include',
        }).then(response => {
            if (response.status === 200) {
                response = parseResponseBody(response);
                if (response) {
                    this.setState({
                        startAddress: response.start_address,
                        endAddress: response.end_address,
                        startTime: response.start_time,
                        endTime: response.end_time,
                        maximumPrice: response.max_price,
                        description: response.description,
                        submitted: true,
                    })
                    this.state.jobId = (response._id["$oid"]);
                }
            } else {
                console.log(JSON.stringify(response));
                throw new Error('Something went wrong on api server!');
            }
        });
    }

    componentDidFocus() {
        // See if the user has a currently open job, and if so, load it
        fetch(api + '/jobs', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            credentials: 'include',
        }).then(response => {
            if (response.status === 200) {
                response = parseResponseBody(response);
                if (response) {
                    this.setState({
                        startAddress: response.start_address,
                        endAddress: response.end_address,
                        startTime: response.start_time,
                        endTime: response.end_time,
                        maximumPrice: response.max_price,
                        description: response.description,
                        submitted: true,
                    })
                    this.state.jobId = (response._id["$oid"]);
                }
            } else {
                console.log(JSON.stringify(response));
                throw new Error('Something went wrong on api server!');
            }
        });
    }

    render() {
        const { navigate } = this.props.navigation;

        const validateForm = () => {

            // Validate job

            this.setState({
                startAddressError: validateStr("Start address", this.state.startAddress, 100),
                endAddressError: validateStr("End address", this.state.endAddress, 100),
                startTimeError: validateStr("Start time", this.state.startTime, 50),
                endTimeError: validateStr("End time", this.state.endTime, 50),
                maximumPriceError: validatePrice("Max price", this.state.maximumPrice, 50),
                descriptionError: validateStr("Description", this.state.description, 500),
            }, () => {

                if (this.state.startAddressError == ""
                    && this.state.endAddressError == ""
                    && this.state.startTimeError == ""
                    && this.state.endTimeError == ""
                    && this.state.maximumPriceError == ""
                    && this.state.descriptionError == ""
                ) {

                    const validData = {
                        "start_time": this.state.startTime,
                        "end_time": this.state.endTime,
                        "start_address": this.state.startAddress,
                        "end_address": this.state.endAddress,
                        "max_price": this.state.maximumPrice,
                        "description": this.state.description,
                    };

                    // POST new job to database

                    fetch(api + "/jobs", {
                        method: 'POST',
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(validData)
                    }).then(response => {
                        if (response.status === 200) {
                            jobId = response._bodyInit;
                            this.setState({submitted: true});
                            navigate("MoverList");
                        } else {
                            alert(JSON.stringify(response));
                            throw new Error('Something went wrong on api server!');
                        }
                    })

                } else {
                    this.setState({allErrors: "Please fix errors."});
                    return false;
                }

            });
        };

        return (
            <View style={styles.container}>

                <View style={styles.grayHeader}>
                    <Text style={styles.h1}>Submit a new job request</Text>
                </View>

                <ScrollView>

                    <View style={{width: "90%", marginLeft: "5%"}}>

                        <View style={{height: 70,}}>
                            <Text style={styles.jobDetailDesc}>Start Address</Text>
                            <TextInput
                                style={{ display: this.state.submitted ? "none" : "flex" }}
                                placeholder="1 Main St, Anytown, NY, 10101"
                                onChangeText={(text) => this.setState({startAddress: text})}
                            /><Text style={styles.errorText}>{ this.state.startAddressError } </Text>
                            <Text style={{ fontSize: 16, display: this.state.submitted ? "flex" : "none" }}>{ this.state.startAddress } </Text>
                        </View>

                        <View style={{height: 70}}>
                            <Text style={styles.jobDetailDesc}>End Address</Text>
                            <TextInput
                                style={{ display: this.state.submitted ? "none" : "flex" }}
                                placeholder="1 Main St, Anytown, NY, 10101"
                                onChangeText={(text) => this.setState({endAddress: text})}
                            /><Text style={styles.errorText}>{ this.state.endAddressError } </Text>
                            <Text style={{ fontSize: 16, display: this.state.submitted ? "flex" : "none" }}>{ this.state.endAddress } </Text>
                        </View>

                        <View style={{flex:0, flexDirection: "row", justifyContent: "space-between", width: "95%"}}>
                            <View style={{height: 70, width: "45%"}}>
                                <Text style={styles.jobDetailDesc}>Start Time</Text>
                                <TextInput
                                    style={{ display: this.state.submitted ? "none" : "flex"}}
                                    placeholder="1:00pm"
                                    onFocus={() => this.setState({timePickerVisible: true, activeField: "startTime"})}
                                    onChangeText={(text) => this.setState({startTime: text})}
                                /><Text style={styles.errorText}>{ this.state.startTimeError } </Text>
                                <Text style={{ fontSize: 16, display: this.state.submitted ? "flex" : "none" }}>{ this.state.startTime } </Text>
                            </View>

                            <View style={{height: 70, width: "45%"}}>
                                <Text style={styles.jobDetailDesc}>End Time</Text>
                                <TextInput
                                    style={{ display: this.state.submitted ? "none" : "flex" }}
                                    placeholder="6:00pm"
                                    onFocus={() => this.setState({timePickerVisible: true, activeField: "endTime"})}
                                    onChangeText={(text) => this.setState({endTime: text})}
                                /><Text style={styles.errorText}>{ this.state.endTimeError } </Text>
                                <Text style={{ fontSize: 16, display: this.state.submitted ? "flex" : "none" }}>{ this.state.endTime } </Text>
                            </View>
                        </View>

                        <View style={{height: 70}}>
                            <Text style={styles.jobDetailDesc}>Maximum Price</Text>
                            <TextInput
                                style={{ display: this.state.submitted ? "none" : "flex" }}
                                placeholder="500.00"
                                onChangeText={(text) => this.setState({maximumPrice: text})}
                            /><Text style={styles.errorText}>{ this.state.maximumPriceError } </Text>
                            <Text style={{ fontSize: 16, display: this.state.submitted ? "flex" : "none" }}>{ this.state.maximumPrice } </Text>
                        </View>

                        <View style={{height: 70}}>
                            <Text style={styles.jobDetailDesc}>Description of the job</Text>
                            <TextInput
                                style={{ display: this.state.submitted ? "none" : "flex" }}
                                placeholder="Volume of items, type of items, etc"
                                onChangeText={(text) => this.setState({description: text})}
                            /><Text style={styles.errorText}>{ this.state.descriptionError } </Text>
                            <Text style={{ fontSize: 16, display: this.state.submitted ? "flex" : "none" }}>{ this.state.description } </Text>
                        </View>

                    </View>



                </ScrollView>

                <View style={styles.grayFooter}>
                    <TouchableOpacity

                        onPress={() => validateForm() ? navigate('Movers') : false}
                        style={[styles.bigButton, {display: this.state.submitted ? "none" : "flex" }]}
                    ><Text style={{color: "#fff", fontSize: 20}}>Find Movers</Text></TouchableOpacity>

                    <View style={{display: this.state.submitted ? "flex" : "none", alignItems: "center"}}>
                        <Text style={{margin:10, fontSize:20, fontWeight: "bold", color: "#00B0FF" }}>Job Submitted Successfully!</Text>
                        <Text style={{marginTop:10, margin: 20, marginBottom: 30, fontSize:14, color: "#666", textAlign: "center"}}>Check the movers list to see if any movers have placed an offer.</Text>
                    </View>
                </View>

            </View>
        );
    }
}

export default RequestFormScreen;