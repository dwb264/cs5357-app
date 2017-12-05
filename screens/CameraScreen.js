import React, { Component } from 'react';
import { Slider, Text, View, TouchableOpacity} from 'react-native';
import { Camera, Permissions, FileSystem, Video } from 'expo';
import styles from './../style';

export default class CameraScreen extends React.Component {

    static navigationOptions = {
        header: null
    };

    constructor(props) {
        super(props)
        this.state = {
            flash: 'off',
            zoom: 0,
            autoFocus: 'on',
            depth: 0,
            type: 'back',
            whiteBalance: 'auto',
            ratio: '16:9',
            ratios: [],
            photoId: 1,
            showGallery: false,
            photos: [],
            previous_data: this.props.navigation.state.params.previous_data
        }
    }

    getRatios = async function() {
        const ratios = await this.camera.getSupportedRatios();
        return ratios;
    };

    toggleView() {
        this.setState({
            showGallery: !this.state.showGallery,
        });
    }

    toggleFacing() {
        this.setState({
            type: this.state.type === 'back' ? 'front' : 'back',
        });
    }

    toggleFlash() {
        this.setState({
            flash: flashModeOrder[this.state.flash],
        });
    }

    setRatio(ratio) {
        this.setState({
            ratio,
        });
    }

    toggleWB() {
        this.setState({
            whiteBalance: wbOrder[this.state.whiteBalance],
        });
    }

    toggleFocus() {
        this.setState({
            autoFocus: this.state.autoFocus === 'on' ? 'off' : 'on',
        });
    }

    zoomOut() {
        this.setState({
            zoom: this.state.zoom - 0.1 < 0 ? 0 : this.state.zoom - 0.1,
        });
    }

    zoomIn() {
        this.setState({
            zoom: this.state.zoom + 0.1 > 1 ? 1 : this.state.zoom + 0.1,
        });
    }

    setFocusDepth(depth) {
        this.setState({
            depth,
        });
    }

    render() {

        const { navigate } = this.props.navigation;

        return (
            <View style={styles.container2}>

                <Camera
                ref={ref => {
                    this.camera = ref;
                }}
                style={{
                    flex: 1,
                    width: "100%"
                }}
                type={this.state.type}
                flashMode={this.state.flash}
                autoFocus={this.state.autoFocus}
                zoom={this.state.zoom}
                whiteBalance={this.state.whiteBalance}
                ratio={this.state.ratio}
                focusDepth={this.state.depth}>
                <View
                    style={{
                        flex: 0.5,
                        backgroundColor: 'transparent',
                        flexDirection: 'row',
                    }}>
                    <TouchableOpacity
                        style={styles.flipButton}
                        onPress={this.toggleFacing.bind(this)}>
                        <Text style={styles.flipText}> FLIP </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.flipButton}
                        onPress={this.toggleFlash.bind(this)}>
                        <Text style={styles.flipText}>
                            {' '}FLASH: {this.state.flash}{' '}
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.flipButton}
                        onPress={this.toggleWB.bind(this)}>
                        <Text style={styles.flipText}>
                            {' '}WB: {this.state.whiteBalance}{' '}
                        </Text>
                    </TouchableOpacity>
                </View>
                <View
                    style={{
                        flex: 0.4,
                        backgroundColor: 'transparent',
                        flexDirection: 'row',
                        alignSelf: 'flex-end',
                    }}>
                    <Slider
                        style={{ width: 150, marginTop: 15, alignSelf: 'flex-end' }}
                        onValueChange={this.setFocusDepth.bind(this)}
                        value={this.state.depth}
                        step={0.1}
                        disabled={this.state.autoFocus === 'on'}
                    />
                </View>
                <View
                    style={{
                        flex: 0.1,
                        backgroundColor: 'transparent',
                        flexDirection: 'row',
                        alignSelf: 'flex-end',
                    }}>
                    <TouchableOpacity
                        style={[styles.flipButton, { flex: 0.1, alignSelf: 'flex-end' }]}
                        onPress={this.zoomIn.bind(this)}>
                        <Text style={styles.flipText}> + </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.flipButton, { flex: 0.1, alignSelf: 'flex-end' }]}
                        onPress={this.zoomOut.bind(this)}>
                        <Text style={styles.flipText}> - </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.flipButton, { flex: 0.25, alignSelf: 'flex-end' }]}
                        onPress={this.toggleFocus.bind(this)}>
                        <Text style={styles.flipText}>
                            {' '}AF : {this.state.autoFocus}{' '}
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[
                            styles.flipButton,
                            styles.picButton,
                            { flex: 0.3, alignSelf: 'flex-end' },
                        ]}
                        onPress={() => {
                            if (this.camera) {
                                this.camera.takePictureAsync({base64: true}).then(image_data => {
                                    // console.log(this.state.previous_data);
                                    navigate("Register", {"image_data": image_data.base64, "previous_data": this.state.previous_data});
                                });
                            }}}>
                        <Text style={styles.flipText}> SNAP </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[
                            styles.flipButton,
                            styles.galleryButton,
                            { flex: 0.25, alignSelf: 'flex-end' },
                        ]}
                        onPress={() => navigate("Register", {"image_data": null, "previous_data": this.state.previous_data})}>
                        <Text style={styles.flipText}> Cancel </Text>
                    </TouchableOpacity>
                </View>
            </Camera>

            </View>
        );
    }
}