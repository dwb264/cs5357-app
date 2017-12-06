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
        }),
    }
    }, {
        tabBarPosition: 'bottom',
        tabBarOptions: {
            style: {
                backgroundColor: '#666',
            }
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
        }), initialRouteName: 'Jobs'
    }
    }, {
        tabBarPosition: 'bottom',
        tabBarOptions: {
            style: {
                backgroundColor: '#666',
            }
        }
    }), navigationOptions: ({ navigation }) => ({
            header: null,
        }),
    },

});

export default App;