import React, { Component } from 'react';
import { Button, Text, View, TouchableOpacity} from 'react-native';
import styles from './../style';
import { validateStr, sanitizeInput, parseResponseBody, validateInt, getPhoneFromInput } from './../HelperFunctions';
var api = "http://127.0.0.1:8081";

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
                jobId = null;
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
                <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: "#fff"}}>
                    { /* <Image source={this.state.data.photo} style={{marginTop: 50, width: 100, height: 100}}/> */ }
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
                    <Text style={{margin:10, fontSize:16}}>Accepts: {this.state.moverData.payment}</Text>
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
                        style={{margin:10, fontWeight: "bold", fontSize:20, color: "#00796B"}}
                    >Offer Accepted!</Text>
                    <Text
                        style={{marginTop:10, margin: 20, marginBottom: 30, fontSize:16, textAlign: 'center', color: "#666"}}
                    >Don&#8217;t forget to contact {this.state.moverData.first_name} to confirm details and be sure to pay when the job is done!</Text>

                    <Button
                        onPress={() => navigate("Review", {moverData: this.state.moverData}) }
                        title="Job Done? Leave a Review!"
                        color="#00796B"
                    />
                </View>
            </View>
        );
    }
}
