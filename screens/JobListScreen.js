import React, { Component } from 'react';
import { Text, ScrollView, View, FlatList, TouchableOpacity} from 'react-native';
import styles from './../style';
import { validateStr, sanitizeInput, parseResponseBody, validateInt, getPhoneFromInput } from './../HelperFunctions';
var api = "http://127.0.0.1:8081";

class JobList extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            data: [],
                // TODO:
                // Jobs should be:
                //   - Within a certain distance of the mover (e.g. 10mi)
                //   - End time is before the current time
                //   - Ordered by distance
        }
    }

    componentDidMount() {
        fetch(api + "/jobs", {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
            }, credentials: 'same-origin',
        }).then(response => {
            if (response.status === 200) {
                response = parseResponseBody(response);
                responsedata = [];
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
    }

    render() {

        const refreshJobs = () => {
            // TODO: GET available jobs from DB
            // Same selection criteria and sorting parameters as above
        };

        return(
            <View style={styles.containerTop}>

            <View style={styles.grayHeader}>
                <Text style={styles.h1}>{this.state.data.length} jobs are available{this.state.data.length > 0 ? "!" : " :("}</Text>
            </View>

                <ScrollView style={{height: 400, width: "90%"}}>
            <FlatList
                data={this.state.data}
                style={{width: "100%"}}

                renderItem={({item}) => (

                    <TouchableOpacity onPress={() => this.props.navigation.navigate("JobDetail", {jobId: item.values._id["$oid"]})}>

                    <View style={{width: "90%", paddingTop: 20, paddingBottom: 20, flexDirection: "row", alignItems: "flex-start"}}>
                        { /* <Image source={item.values.photo} style={{maxWidth: 80, maxHeight: 60}}/> */ }
                        <View style={{marginLeft: 10}}>
                        <Text style={{fontSize: 16, fontWeight: "bold", color: "#333"}}>{item.values.description}</Text>
                            <Text>Max ${item.values.max_price}</Text>
                            <Text>Start at {item.values.start_time}</Text>
                        </View>
                    </View>

                    </TouchableOpacity>
                )}
            />
                </ScrollView>
                <View style={styles.grayFooter}>
                    <View style={{flex:0, alignItems: "center", width: "90%"}}>
                        <Text
                            style={{height: 40, margin:10}}
                            onPress={() => refreshJobs() }
                        >Refresh List</Text>
                    </View>
                </View>

             </View>
        );
    }
}

export default class JobListScreen extends React.Component {
    static navigationOptions = {
        header: null
    };

    render() {

        return (
            <ScrollView>
                <JobList navigation={this.props.navigation} />
            </ScrollView>
        );
    }
}

// Nested navigator: https://reactnavigation.org/docs/intro/nesting
JobListScreen.router = JobList.router;