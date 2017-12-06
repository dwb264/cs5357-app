import React, { Component } from 'react';
import { Text, View, Alert, Image, TouchableHighlight, TouchableOpacity} from 'react-native';
import styles from './../style';
import { validateStr, sanitizeInput, parseResponseBody, validateInt, getPhoneFromInput } from './../HelperFunctions';
var api = "http://127.0.0.1:8081";

export default class ReviewScreen extends React.Component {

    constructor(props) {

        super(props);
        this.state = {
            data: this.props.navigation.state.params.moverData,
            numStars: null,
        };

        this.filledStar = require("./../img/filledStar.png");
        this.unfilledStar = require("./../img/unfilledStar.png");

    }

    static navigationOptions = {
        header: null
    };


    render() {
        const { navigate } = this.props.navigation;

        const recordRating = () => {

            if (this.state.numStars !== null) {
                var validData = {"rating": this.state.numStars, "moverID": this.state.data._id["$oid"] };

                fetch(api + "/review", {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    }, credentials: 'same-origin',
                    body: JSON.stringify(validData),
                }).then(response => {
                    if (response.status === 201) {
                        Alert.alert(
                            'Thank You!',
                            'You have rated ' + this.state.data.first_name + ' ' + this.state.numStars + ' stars.',
                            [
                                {text: 'Exit', onPress: () => navigate("Requester", {"refresh": true})},
                                // Refresh the request form page to reset it because the job is done
                            ],
                            { cancelable: true }
                        );
                    } else {
                        console.log(response);
                        throw new Error('Something went wrong on api server!');
                    }
                });

            } else {
                alert("Please select a star rating");
            }


        };

        return (
            <View style={{flex: 1, justifyContent: "space-between"}}>
                <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: "#fff"}}>
                    <Text style={[styles.h1, {textAlign: "center"}]}>Review Your Mover</Text>
                    <Text style={[styles.h1, {textAlign: "center"}]}>{this.state.data.first_name} {this.state.data.last_name}</Text>
                    <Text style={{margin:20, fontSize:16}}>Please rate {this.state.data.first_name} out of 5 stars.</Text>
                    <View style={{flexDirection: "row"}}>
                        <TouchableHighlight onPress={() => this.setState({numStars: 1})} underlayColor="#fff">
                            <Image
                                source={this.state.numStars > 0 ? this.filledStar : this.unfilledStar}
                                style={{width: 40, height: 40}}
                            />
                        </TouchableHighlight>

                        <TouchableHighlight onPress={() => this.setState({numStars: 2})} underlayColor="#fff">
                            <Image
                                source={this.state.numStars > 1 ? this.filledStar : this.unfilledStar}
                                style={{width: 40, height: 40}}
                                onPress={() => this.setState({numStars: 2}) }
                            />
                        </TouchableHighlight>

                        <TouchableHighlight onPress={() => this.setState({numStars: 3})} underlayColor="#fff">
                            <Image
                                source={this.state.numStars > 2 ? this.filledStar : this.unfilledStar}
                                style={{width: 40, height: 40}}
                                onPress={() => this.setState({numStars: 3}) }
                            />
                        </TouchableHighlight>

                        <TouchableHighlight onPress={() => this.setState({numStars: 4})} underlayColor="#fff">
                            <Image
                                source={this.state.numStars > 3 ? this.filledStar : this.unfilledStar}
                                style={{width: 40, height: 40}}
                                onPress={() => this.setState({numStars: 4})}
                            />
                        </TouchableHighlight>

                        <TouchableHighlight onPress={() => this.setState({numStars: 5})} underlayColor="#fff">
                            <Image
                                source={this.state.numStars > 4 ? this.filledStar : this.unfilledStar}
                                style={{width: 40, height: 40}}
                                onPress={() => this.setState({numStars: 5})}
                            />
                        </TouchableHighlight>
                    </View>
                </View>

                <View style={styles.grayFooter}>
                    <TouchableOpacity
                            onPress={() => recordRating()}
                            style={styles.bigButton}
                        ><Text style={{color: "#fff", fontSize: 20}}>Submit Review</Text></TouchableOpacity>
                    <Text
                        style={{margin:30, fontSize:16, color: "#666"}}
                        onPress={() => navigate("Requester")}
                    >Cancel</Text>
                </View>
            </View>
        );
    }
}
