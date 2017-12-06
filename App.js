import React, { Component } from 'react';
import {
    StackNavigator,
    TabNavigator,
} from 'react-navigation';
import { Camera, Permissions, FileSystem, Video } from 'expo';

import CameraScreen from './screens/CameraScreen';
import EnterCodeScreen from './screens/EnterCodeScreen';
import GetCodeScreen from './screens/GetCodeScreen';
import InitialOptionsScreen from './screens/InitialOptionsScreen';
import JobDetailScreen from './screens/JobDetailScreen';
import JobListScreen from './screens/JobListScreen';
import LoginScreen from './screens/LoginScreen';
import MoverListScreen from './screens/MoverListScreen';
import MoverDetailScreen from './screens/MoverDetailScreen';
import ProfileScreen from './screens/ProfileScreen';
import RegistrationScreen from './screens/RegistrationScreen';
import RequestFormScreen from './screens/RequestFormScreen';
import ReviewScreen from './screens/ReviewScreen';
import styles from './style';
import './HelperFunctions';
import {Image} from "react-native";

var userType; // either mover or requester
var api = "http://127.0.0.1:8081";
var jobId = null; // Current job id; null if no current job

// StackNavigator: a registry of all screens in the app
// Requester and mover both have a nested TabNavigator that contains their screens
const App = StackNavigator({
    InitialOptions: { screen: InitialOptionsScreen },
    Register: { screen: RegistrationScreen },
    Login: { screen: LoginScreen },
    Camera: { screen: CameraScreen },
    GetCode: { screen: GetCodeScreen },
    EnterCode: { screen: EnterCodeScreen },
    Requester: { screen: TabNavigator({
        RequestForm: { screen: RequestFormScreen },
        Profile: { screen: ProfileScreen },
        Movers: { screen: StackNavigator({
            MoverList: { screen: MoverListScreen },
            ViewMover: { screen: MoverDetailScreen},
            Review: { screen: ReviewScreen },
        }),
            navigationOptions: ({ navigation }) => ({
                header: null,
                tabBarIcon: () => (
                    <Image
                     source={require('./img/icon-movers.png')}
                     style={{width: 30, height: 30}}
                />
                ),

        }),
    }
    }, {
        tabBarPosition: 'bottom',
        tabBarOptions: {
            style: {
                backgroundColor: '#0091EA',
            },
                activeTintColor: "#fff",
                inactiveTintColor: "#b8b8b8"
        }
    }), navigationOptions: ({ navigation }) => ({
            header: null,
        }),
    },
    Mover: { screen: TabNavigator({
        Profile: { screen: ProfileScreen },
        Jobs: { screen: StackNavigator({
            JobList: { screen: JobListScreen },
            JobDetail: { screen: JobDetailScreen},
        }), navigationOptions: ({ navigation }) => ({
            header: null,
            tabBarIcon: () => (
                    <Image
                     source={require('./img/icon-jobs.png')}
                     style={{width: 30, height: 30}}
                />
            ),
        }), initialRouteName: 'Jobs'
    }
    }, {
        tabBarPosition: 'bottom',
        tabBarOptions: {
            style: {
                backgroundColor: '#0091EA',
            },

                activeTintColor: "#fff",
                inactiveTintColor: "#b8b8b8",

        }
    }), navigationOptions: ({ navigation }) => ({
            header: null,

        }),
    },

});

export default App;