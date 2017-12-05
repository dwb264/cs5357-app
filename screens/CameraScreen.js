import React, { Component } from 'react';
import { Slider, Text, View, TouchableOpacity} from 'react-native';
import { Camera, Permissions, FileSystem, Video } from 'expo';
import styles from './../style';

export default class CameraScreen extends React.Component {

    state = {
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
    };

    componentDidMount() {
        FileSystem.makeDirectoryAsync(
            FileSystem.documentDirectory + 'photos'
        ).catch(e => {
            console.log(e, 'Directory exists');
        });
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

    takePicture = async function() {
        if (this.camera) {
            this.camera.takePicture().then(data => {
                FileSystem.moveAsync({
                    from: data,
                    to: `${FileSystem.documentDirectory}photos/Photo_${this.state
                        .photoId}.jpg`,
                }).then(() => {
                    this.setState({
                        photoId: this.state.photoId + 1,
                    });
                    Vibration.vibrate();
                });
            });
        }
    };

    renderGallery() {
        return <GalleryScreen onPress={this.toggleView.bind(this)} />;
    }

    renderCamera() {
        return (
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
                        onPress={this.takePicture.bind(this)}>
                        <Text style={styles.flipText}> SNAP </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[
                            styles.flipButton,
                            styles.galleryButton,
                            { flex: 0.25, alignSelf: 'flex-end' },
                        ]}
                        onPress={this.toggleView.bind(this)}>
                        <Text style={styles.flipText}> Gallery </Text>
                    </TouchableOpacity>
                </View>
            </Camera>
        );
    }

    render() {

        return (
            <View style={styles.container2}>
                {this.state.showGallery ? this.renderGallery() : this.renderCamera()}
            </View>
        );
    }
}