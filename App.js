import React, { Component } from 'react';
import { Button, StyleSheet, Text, TextInput, ScrollView, View, Alert, FlatList, Image, TouchableHighlight} from 'react-native';
import { StackNavigator } from 'react-navigation';

class GetCodeScreen extends React.Component {

    static navigationOptions = {
        header: null
    };

    render() {

        const { navigate } = this.props.navigation;

        const validatePhone = () => {
            // TODO: validate phone number
            return true;
        };

        return (
            <View style={styles.container}>
                <Text
                    style={{fontSize:30, color: "#666"}}
                >Man With A Van</Text>
                <TextInput
                    style={{height: 40, width: 200, margin:30, textAlign: 'center'}}
                    placeholder="Enter Phone Number"
                />
                <Button
                    onPress={() => validatePhone ? navigate('EnterCode') : false}
                    title="Get Code"
                    color="#00796B"
                />
            </View>
        );
    }
}

class EnterCodeScreen extends React.Component {

    static navigationOptions = {
        header: null
    };

    render() {
        const { navigate } = this.props.navigation;

        const validateCode = () => {
            // TODO: validate code
            return true;
        };

        return (
            <View style={styles.container}>
                <Text
                    style={{fontSize:30, color: "#666"}}
                >Man With A Van</Text>
                <TextInput
                    style={{height: 40, width: 200, margin:30, textAlign: 'center'}}
                    placeholder="Enter Code"
                />
                <Button
                    onPress={() => validateCode ? navigate('Form') : false}
                    title="Join"
                    color="#00796B"
                />
            </View>
        );
    }
}

class FormScreen extends React.Component {

    static navigationOptions = {
        header: null
    };

    render() {
        const { navigate } = this.props.navigation;

        const validateForm = () => {
            // TODO: validate form
            Alert.alert(
                'Please Wait',
                'Looking for movers near you. We\'ll let you know when someone accepts your job.',
                [
                    {text: 'Cancel Request'},
                ],
                { cancelable: true }
            );
            return true;
        };

        return (
            <ScrollView>
                <View style={styles.containerTop}>
                    <View style={styles.grayHeader}>
                        <Text style={styles.h1}>What do you need help with today?</Text>
                        <Text style={{height: 20, width: "90%", margin:10}}>Enter your details and we&#8217;ll find you a mover!</Text>
                    </View>
                    <TextInput
                        style={styles.input}
                        placeholder="Start Address"
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="End Address"
                    />
                    <View style={{flex:0, flexDirection: "row", justifyContent: "space-between", width: "90%"}}>
                        <TextInput
                            style={{height: 40, width: "45%", marginTop:10, marginBottom:10}}
                            placeholder="Start Time"
                        />
                        <TextInput
                            style={{height: 40, width: "45%", marginTop:10, marginBottom:10}}
                            placeholder="End Time"
                        />
                    </View>
                    <TextInput
                        style={styles.input}
                        placeholder="Maximum Price"
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Describe the job"
                    />
                    <Text style={{height: 40, width: "90%", margin:10}}>📷 Upload Photos</Text>
                    <View style={styles.grayFooter}>
                        <Button
                            onPress={() => validateForm() ? navigate('MoverList') : false}
                            title="Find Movers"
                            color="#00796B"
                        />
                    </View>
                </View>
            </ScrollView>
        );
    }
}

class MoverList extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            data: [ // Hardcoded for now
                { key: 0, values: {
                    "id": 0, // Should correspond to id in database
                    "name": "Jeff McMover",
                    "photo": require("./img/jeff.png"),
                    "price": 400,
                    "startTime": new Date("Tue Mar 24 2015 20:00:00 GMT-0400 (EDT)"),
                    "rating": 4.9
                    }
                },
                { key: 1, values: {
                    "id": 1,
                    "name": "Joe Moverson",
                    "photo": require("./img/jeff.png"),
                    "price": 425,
                    "startTime": new Date("Tue Mar 24 2015 20:00:00 GMT-0400 (EDT)"),
                    "rating": 4.8
                    }
                }
            ]
        }
    }

    render() {

        return(
            <View style={styles.containerTop}>

            <View style={styles.grayHeader}>
                <Text style={styles.h1}>{this.state.data.length} movers are available{this.state.data.length > 0 ? "!" : " :("}</Text>
            </View>

            <FlatList
                data={this.state.data}
                style={{width: "100%"}}

                renderItem={({item}) => (
                    <View
                        style={{padding: 20, flexDirection: "row", justifyContent: "space-between"}}
                    >
                        <Image source={item.values.photo} style={{width: 40, height: 40}}/>
                        <View style={{marginRight: 10}}>
                        <Text style={{fontSize: 16, fontWeight: "bold", color: "#333"}}>{item.values.name}</Text>
                            <Text>${item.values.price} | Start at {item.values.startTime.getHours()}:{item.values.startTime.getMinutes()} | {item.values.rating}/5 Stars</Text>
                        </View>
                        <Text
                            onPress={() => this.props.navigation.navigate("MoverDetail")}
                            style={{fontWeight: "bold", color: "#00796B"}}
                        >
                            Details
                        </Text>
                    </View>
                )}
            />
                <View style={styles.grayFooter}>
                    <View style={{flex:0, flexDirection: "row", justifyContent: "space-between", width: "90%"}}>
                        <Text style={{height: 40, margin:10}}>Refresh List</Text>
                        <Text style={{height: 40, margin:10}}>Sort</Text>
                    </View>
                </View>

             </View>
        );
    }
}

class MoverListScreen extends React.Component {
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

class MoverDetailScreen extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            data: {
                // Should get this from the database
                "id": 0,
                "name": "Jeff McMover",
                "photo": require("./img/jeff.png"),
                "price": 400,
                "startTime": new Date("Tue Mar 24 2015 20:00:00 GMT-0400 (EDT)"),
                "rating": 4.9,
                "phone": "555-867-5309",
                "vehicle": "Large box truck",
                "payment": "Cash, Venmo"
            },
            preAccept: "flex",
            postAccept: "none"
        }
    }

    static navigationOptions = {
        header: null
    };

    render() {
        const { navigate } = this.props.navigation;

        const acceptOffer = () => {
            this.setState({preAccept: "none", postAccept: "flex"});
        };

        return (

            <View style={{flex: 1, justifyContent: "space-between"}}>
                <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: "#fff"}}>
                    <Image source={this.state.data.photo} style={{marginTop: 50, width: 100, height: 100}}/>
                    <Text style={{
                        height: 30,
                        width: "90%",
                        margin:10,
                        fontSize:20,
                        color: "#666",
                        textAlign: 'center'
                    }}>{this.state.data.name}</Text>
                    <Text style={{margin:20, fontSize:16}}>${this.state.data.price} | Start at {this.state.data.startTime.getHours()}:{this.state.data.startTime.getMinutes()} | {this.state.data.rating}/5 Stars</Text>
                    <Text style={{margin:10, fontSize:16}}>Phone: {this.state.data.phone}</Text>
                    <Text style={{margin:10, fontSize:16}}>Drives: {this.state.data.vehicle}</Text>
                    <Text style={{margin:10, fontSize:16}}>Accepts: {this.state.data.payment}</Text>
                </View>

                <View style={[styles.grayFooter, {display: this.state.preAccept}]}>
                    <Button
                        onPress={() => acceptOffer() }
                        title="Accept Offer"
                        color="#00796B"
                    />
                    <Text
                        style={{margin:30, fontSize:16, color: "#666"}}
                        onPress={() => navigate("MoverList")}
                    >View Other Offers</Text>
                </View>


                <View style={[styles.grayFooter, {display: this.state.postAccept}]}>
                    <Text
                        style={{margin:10, fontWeight: "bold", fontSize:30, color: "#00796B"}}
                    >Offer Accepted!</Text>
                    <Text
                        style={{marginTop:10, margin: 20, marginBottom: 30, fontSize:16, textAlign: 'center', color: "#666"}}
                    >Don't forget to contact {this.state.data.name.split(" ")[0]} to confirm details and be sure to pay when the job is done!</Text>
                    <Button
                        onPress={() => navigate("Review") }
                        title="Job Done? Leave a Review!"
                        color="#00796B"
                    />
                </View>
            </View>
        );
    }
}

class ReviewScreen extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            data: {
                // Should get this from the database
                "id": 0,
                "name": "Jeff McMover",
                "photo": require("./img/jeff.png"),
                "price": 400,
                "startTime": new Date("Tue Mar 24 2015 20:00:00 GMT-0400 (EDT)"),
                "rating": 4.9,
                "phone": "555-867-5309",
                "vehicle": "Large box truck",
                "payment": "Cash, Venmo"
            },
            numStars: 0,
        };

        this.filledStar = require("./img/filledStar.png");
        this.unfilledStar = require("./img/unfilledStar.png");

    }

    static navigationOptions = {
        header: null
    };


    render() {
        const { navigate } = this.props.navigation;

        const recordRating = () => {
            Alert.alert(
                'Thank You!',
                'You have rated ' + this.state.data.name.split(" ")[0] + ' ' + this.state.numStars + ' stars.',
                [
                    {text: 'Exit', onPress: () => navigate("GetCode")},
                ],
                { cancelable: true }
            );
        };

        return (
            <View style={{flex: 1, justifyContent: "space-between"}}>
                <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: "#fff"}}>
                    <Text style={[styles.h1, {textAlign: "center"}]}>Review Your Mover</Text>
                    <Image source={this.state.data.photo} style={{marginTop: 20, width: 100, height: 100}}/>
                    <Text style={[styles.h1, {textAlign: "center"}]}>{this.state.data.name}</Text>
                    <Text style={{margin:20, fontSize:16}}>Please rate {this.state.data.name.split(" ")[0]} out of 5 stars.</Text>
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
                    <Button
                        onPress={() => recordRating() }
                        title="Submit Review"
                        color="#00796B"
                    />
                    <Text
                        style={{margin:30, fontSize:16, color: "#666"}}
                        onPress={() => navigate("GetCode")}
                    >Cancel</Text>
                </View>
            </View>
        );
    }
}


const App = StackNavigator({
    GetCode: { screen: GetCodeScreen },
    EnterCode: { screen: EnterCodeScreen },
    Form: { screen: FormScreen },
    MoverList: { screen: MoverListScreen},
    MoverDetail: { screen: MoverDetailScreen},
    Review: { screen: ReviewScreen },
    },
    {
        headerMode: 'screen'
    });


const styles = StyleSheet.create({
    //https://material.io/guidelines/style/color.html#color-color-palette
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    containerTop: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
    },
    grayHeader: {
        backgroundColor: "#e8e8e8",
        width: "100%",
        paddingTop: 40,
        paddingBottom: 20,
        flex: 0,
        alignItems: 'center',
        marginBottom: 20,
    },
    grayFooter: {
        backgroundColor: "#e8e8e8",
        width: "100%",
        paddingTop: 20,
        paddingBottom: 40,
        flex: 0,
        alignItems: 'center'
    },
    h1: {
        height: 30,
        width: "90%",
        margin:10,
        fontSize:20,
        color: "#666"
    },
    input: {
        height: 40,
        width: "90%",
        margin:10
    },
    moverListItem: {
        paddingBottom: 20,
    },


});

export default App;