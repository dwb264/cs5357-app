import React, { Component } from 'react';
import { Text, TextInput, ScrollView, View, Image, TouchableOpacity} from 'react-native';
import styles from './../style';
import { validateStr, sanitizeInput, parseResponseBody, validateInt, getPhoneFromInput } from './../HelperFunctions';
import {validatePrice} from "../HelperFunctions";
var api = "https://man-in-a-van.appspot.com";


export default class JobDetailScreen extends React.Component {

    static navigationOptions = {
        header: null
    };

    constructor(props) {
        super(props);
        this.state = {
            jobId: this.props.navigation.state.params.jobId, // Data about the job, passed from JobListScreen
            placed: false,
            offerAmount: "", // Input amount offered
            offerTime: "", // Input start time offered
            data: [],
            otherOffers: "None yet!",

            timeError: "",
            amountError: "",

            headerphoto: require("./../img/job-details.png")

        }
    }

    componentDidMount() {
        fetch(api + "/jobs/" + this.state.jobId, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
            }, credentials: 'same-origin',
        }).then(response => {
            if (response.status === 200) {
                response = parseResponseBody(response);
                this.setState({data: response});

            } else {
                throw new Error('Something went wrong on api server!');
            }
        });

        fetch(api + "/getOffers/" + this.state.jobId, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
            }, credentials: 'same-origin',
        }).then(response => {
            if (response.status === 200) {
                response = parseResponseBody(response);
                console.log(response);
                var offers = [];
                if (response.length > 0) {
                    for (var i = 0; i < response.length; i++) {
                        offers.push(parseFloat(response[i]['price']));
                    }
                    if (offers.length > 1) {
                        this.setState({otherOffers: "$" + Math.min.apply(Math, offers) + " - $" + Math.max.apply(Math, offers)});
                    } else {
                        this.setState({otherOffers: "$" + offers[0]})
                    }
                }
            } else {
                throw new Error('Something went wrong on api server!');
            }
        });
    }

    render() {
        const { navigate } = this.props.navigation;

        const placeOffer = () => {
            this.setState({
                // TODO: validate offer better
            //   - Amount must be numeric and less than requester's max amount
            //   - Start time must be between requester's start time and end time
                amountError: validatePrice("Offer", this.state.offerAmount),
                timeError: validateStr("Time", this.state.offerTime, 10),
            }, () => {
                if (this.state.amountError == "" && this.state.timeError == "") {
                    const offer = parseFloat(this.state.offerAmount);
                    const validData = {
                        "job_id": this.state.jobId,
                        "price": offer,
                        "start_time": this.state.offerTime,
                    };
                    fetch(api + "/addOffer", {
                        method: 'POST',
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json'
                        }, credentials: 'same-origin',
                        body: JSON.stringify(validData),
                    }).then(response => {
                        if (response.status === 201) {
                            this.setState({placed: true});
                        } else {
                            throw new Error('Something went wrong on api server!');
                        }
                    });
                } else {
                    return false;
                }
            });
        };

        return (
            <ScrollView>
            <View style={{flex: 1, justifyContent: "space-between", marginTop: 24}}>

                <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: "#fff"}}>

                    <Image source={this.state.headerphoto} style={{width: "100%", height:100}}/>

                    <View style={styles.jobDetailRow}>

                        <Text style={styles.jobDetailDesc}>Description</Text>
                        <Text style={styles.jobDetailInfo}>{this.state.data.description}</Text>

                    </View>

                    <View style={[styles.jobDetailRow, {flexDirection: 'row'}]}>
                        <View style={{width: "50%"}}>

                            <Text style={styles.jobDetailDesc}>Max Price</Text>
                            <Text style={styles.jobDetailInfo}>${this.state.data.max_price}</Text>

                        </View>

                        <View>

                            <Text style={styles.jobDetailDesc}>Other offers</Text>
                            <Text style={styles.jobDetailInfo}>{this.state.otherOffers}</Text>

                        </View>
                    </View>

                    <View style={[styles.jobDetailRow, {flexDirection: 'row', borderBottomWidth: 0}]}>
                        <View style={{width: "50%"}}>

                            <Text style={styles.jobDetailDesc}>Start time</Text>
                            <Text style={styles.jobDetailInfo}>{this.state.data.start_time}</Text>

                            <Text style={styles.jobDetailDesc}>End time</Text>
                            <Text style={styles.jobDetailInfo}>{this.state.data.end_time}</Text>

                        </View>
                        <View>

                            <Text style={styles.jobDetailDesc}>Start address</Text>
                            <Text style={styles.jobDetailInfo}>{this.state.data.start_address}</Text>

                            <Text style={styles.jobDetailDesc}>End address</Text>
                            <Text style={styles.jobDetailInfo}>{this.state.data.end_address}</Text>

                        </View>
                    </View>

                </View>

                <View style={[styles.grayFooter, {display: this.state.placed ? "none" : "flex"}]}>
                    <View style={{flex:0, flexDirection: "row", width: "90%",  padding: 10}}>
                        <View style={{width: "50%"}}>
                            <Text style={styles.jobDetailDesc}>Offer Amount ($)</Text>
                        <TextInput style={styles.formField}
                            placeholder="e.g. 100.00"
                            onChangeText={(text) => this.setState({offerAmount: text})}
                        />
                            <Text style={styles.errorText}>{this.state.amountError}</Text>
                        </View>
                        <View style={{width: "50%"}}>
                            <Text style={styles.jobDetailDesc}>Start Time</Text>
                        <TextInput style={styles.formField}
                            placeholder="e.g. 1:00pm"
                            onChangeText={(text) => this.setState({offerTime: text})}
                        /><Text style={styles.errorText}>{this.state.timeError}</Text>
                        </View>
                    </View>

                    <TouchableOpacity onPress={() => placeOffer() } style={styles.bigButton}>
                        <Text style={{color: "#fff", fontSize: 20}}>Place Offer</Text>
                    </TouchableOpacity>

                    <Text
                        style={{margin:20, fontSize:16, color: "#666"}}
                        onPress={() => navigate("JobList")}
                    >View Other Jobs</Text>
                </View>

                <View style={[styles.grayFooter, {display: this.state.placed ? "flex" : "none"}]}>
                    <Text
                        style={{margin:10, fontSize:20, color: "#00B0FF", fontWeight: "bold"}}
                    >Offer placed!</Text>
                    <Text>You have offered to do this job at {this.state.offerTime} for ${this.state.offerAmount}.</Text>
                    <Text
                        style={{marginTop:10, margin: 20, marginBottom: 30, fontSize:16, textAlign: 'center', color: "#666"}}
                    >We will let you know if the requester accepts your offer.</Text>
                </View>
            </View>
            </ScrollView>
        );
    }
}
