import React, { Component } from 'react';
import {Button, Text, View, TouchableOpacity, Image, ScrollView} from 'react-native';
import styles from './../style';
import { validateStr, sanitizeInput, parseResponseBody, validateInt, getPhoneFromInput } from './../HelperFunctions';
var api = "https://man-in-a-van.appspot.com";

export default class MoverDetailScreen extends React.Component {

    static navigationOptions = {
        header: null
    };

    constructor(props) {
        super(props);
        this.state = {
            offerData: this.props.navigation.state.params.offerData,
            moverData: [],
            accepted: false,
            defaultPhoto: require("./../img/jeff.png")
        }
    }

    componentDidMount() {
        // Get mover's profile

        fetch(api + "/profile/" + this.state.offerData.userId, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
            }, credentials: 'same-origin',
        }).then(response => {
            if (response.status === 200) {
                response = parseResponseBody(response);
                this.setState({moverData: response});
            } else {
                throw new Error('Something went wrong on api server!');
            }
        });
    }

    render() {
        const { navigate } = this.props.navigation;

        const acceptOffer = () => {
            // update DB to reflect offer is accepted

            var validData = {"job_id": this.state.offerData.jobId, "offerID": this.state.offerData._id["$oid"]};

            fetch(api + "/acceptOffer", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }, credentials: 'same-origin',
                body: JSON.stringify(validData),
        }).then(response => {
            if (response.status === 200) {
                console.log(response);
                this.setState({accepted: true});
            } else {
                console.log(response);
                throw new Error('Something went wrong on api server!');
            }
        });
        };

        return (


            <View style={{flex: 1, justifyContent: "space-between"}}>

                <ScrollView>
                <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: "#fff", }}>
                    <Image source={this.state.defaultPhoto}
                                   style={{margin: 10, width: 100, height: 100, marginTop: 50,
                                       borderRadius: 50, display: this.state.moverData.photo ? "none" : "flex"}}/>

                            <Image source={{uri: "data:image/png;base64," + this.state.moverData.photo}}
                                   style={{margin: 10, width: 100, height: 100, marginTop: 50,
                                       borderRadius: 50, display: this.state.moverData.photo ? "flex" : "none"}}/>
                    <Text style={{
                        height: 30,
                        width: "90%",
                        margin:10,
                        fontSize:20,
                        color: "#666",
                        textAlign: 'center'
                    }}>{this.state.moverData.first_name + " " + this.state.moverData.last_name}</Text>
                    <Text style={{margin:20, fontSize:16}}>${this.state.offerData.price} |
                        Start at {this.state.offerData.start_time}</Text>
                    <Text style={{margin:10, fontSize:16}}>Phone: {this.state.moverData.phone}</Text>
                    <Text style={{margin:10, fontSize:16}}>Drives: {this.state.moverData.vehicle}</Text>
                    <Text style={{margin:10, fontSize:16, marginBottom: 30}}>Accepts: {this.state.moverData.payment}</Text>
                </View>

                <View style={[styles.grayFooter, {display: this.state.accepted ? "none" : "flex"}]}>
                    <TouchableOpacity
                            onPress={() => acceptOffer() }
                            style={styles.bigButton}
                        ><Text style={{color: "#fff", fontSize: 20}}>Accept Offer</Text></TouchableOpacity>
                    <Text
                        style={{margin:30, fontSize:16, color: "#666"}}
                        onPress={() => navigate("MoverList")}
                    >View Other Offers</Text>
                </View>


                <View style={[styles.grayFooter, {display: this.state.accepted ? "flex" : "none"}]}>
                    <Text
                        style={{margin:10, fontWeight: "bold", fontSize:20, color: "#00B0FF"}}
                    >Offer Accepted!</Text>
                    <Text
                        style={{marginTop:10, margin: 20, marginBottom: 30, fontSize:16, textAlign: 'center', color: "#666"}}
                    >Don&#8217;t forget to contact {this.state.moverData.first_name} to confirm details and be sure to pay when the job is done!</Text>

                    <TouchableOpacity style={styles.bigButton}
                        onPress={() => navigate("Review", {moverData: this.state.moverData}) }
                    >
                        <Text style={{color: "#fff"}}>Job Done? Leave a Review!</Text>
                    </TouchableOpacity>
                </View>

                    </ScrollView>
            </View>


        );
    }
}
