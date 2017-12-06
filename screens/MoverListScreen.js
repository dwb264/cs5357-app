import React, { Component } from 'react';
import { Text, ScrollView, View, FlatList, TouchableOpacity} from 'react-native';
import styles from './../style';
import { validateStr, sanitizeInput, parseResponseBody, validateInt, getPhoneFromInput } from './../HelperFunctions';
var api = "http://127.0.0.1:8081";

class MoverList extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            data: [],
            jobId: ''
        }
    }

    componentDidMount() {

        // Check if the requester has an open job

        fetch(api + '/jobs', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            credentials: 'same-origin',
        }).then(response => {
            if (response.status === 200) {
                response = parseResponseBody(response);

                if (response === null) {
                    console.log(response);
                }

                // If there is an open job, get the offers

                if (response) {

                    this.setState({jobId: response._id["$oid"]}, () => {
                        // Get jobs
                        fetch(api + "/getOffers/" + this.state.jobId, {
                            method: 'GET',
                            headers: {
                                'Accept': 'application/json',
                            }, credentials: 'same-origin',

                        }).then(jobResponse => {
                            if (jobResponse.status === 200) {
                                jobResponse = parseResponseBody(jobResponse);

                                var responsedata = [];

                                for (var i = 0; i < jobResponse.length; i++) {
                                    responsedata.push({
                                        "key": i,
                                        "values": jobResponse[i]
                                    });
                                }

                                this.setState({data: responsedata});

                            } else {
                                throw new Error('Something went wrong on api server!');
                            }
                        });
                    })

                    // Get mover info for each job
                }
            } else {
                console.log(JSON.stringify(response));
                throw new Error('Something went wrong on api server!');
            }
        });


    }

    render() {

        const refreshList = () => {
            console.log(this.state.data);
            if (this.state.jobId !== '') {
                fetch(api + "/getOffers/" + this.state.jobId, {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json',
                    }, credentials: 'same-origin',
                }).then(response => {
                    if (response.status === 200) {
                        response = parseResponseBody(response);
                        var responsedata = [];
                            for (var i = 0; i < response.length; i++) {
                                responsedata.push({
                                    "key": i,
                                    "values": response[i]
                                });
                            }

                            this.setState({data: responsedata});
                    } else {
                        throw new Error('Something went wrong on api server!');
                    }
                });
            } else {
                alert("You need to make a request in order to get offers!");
            }
        };

        return(
            <View style={styles.containerTop}>

                <View style={styles.grayHeader}>
                    <Text style={styles.h1}>{this.state.data.length} mover(s) available{this.state.data.length > 0 ? "!" : " :("}</Text>
                </View>

                <ScrollView style={{height: 400, width: "100%"}}>

            <FlatList
                data={this.state.data}
                style={{width: "90%", marginLeft: "5%"}}

                renderItem={({item}) => (
                    <TouchableOpacity style={{paddingTop: 20, paddingBottom: 20, flexDirection: "row", alignItems: "flex-start", borderBottomWidth: 1, borderBottomColor: "#d8d8d8"}}onPress={() => this.props.navigation.navigate("ViewMover", {offerData: item.values})}>

                    <View>
                            <Text style={{fontSize: 16, color: "#333", marginBottom: 10}}>Offer: ${item.values.price}</Text>
                            <Text style={{fontSize: 16, color: "#333", marginBottom: 10}}>Start time: {item.values.start_time}</Text>
                    </View>
                    </TouchableOpacity>
                )}
            />
                </ScrollView>
                <View style={[styles.grayFooter, {height: 100}]}>
                    <TouchableOpacity
                        onPress={() => refreshList()}
                    >
                        <Text style={{height: 40, margin:10}}>Refresh List</Text>
                    </TouchableOpacity>
                    </View>

            </View>
        );
    }
}

export default class MoverListScreen extends React.Component {
    static navigationOptions = {
        header: null
    };

    render() {

        return (
            <ScrollView>
                <MoverList navigation={this.props.navigation} />
            </ScrollView>
        );
    }
}

MoverListScreen.router = MoverList.router; // Nested navigator: https://reactnavigation.org/docs/intro/nesting