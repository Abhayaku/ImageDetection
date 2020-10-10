import React, { Component } from 'react';
import {
    View, Text, Animated, TouchableWithoutFeedback, Image,
    ActivityIndicator, BackHandler, ScrollView, Easing, StatusBar
} from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler';
import ImagePicker from 'react-native-image-picker';
import vision from '@react-native-firebase/ml-vision';
import Calcuatoricon from 'react-native-vector-icons/MaterialIcons';

export default class Mainpage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            imagedata: null,
            choose: false,
            zoomvalue: new Animated.Value(0),
            spinvalue: new Animated.Value(0),
            text: 'Tap to choose image',
            displayresult: [],
            result: false,
            showindicator: false,
            reset: false,
            camera: false,
            gallery: false
        };
    }
    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.backpress);
    }
    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.backpress);
    }
    //backpress
    backpress = () => {
        BackHandler.exitApp();
        return true;
    }


    // animation of option
    fadeanimation = () => {
        Animated.timing(this.state.zoomvalue, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true
        }).start()
    }


    //rotation animation
    rotation = () => {
        Animated.timing(
            this.state.spinvalue, {
            toValue: 1,
            duration: 2000,
            easing: Easing.linear,
            useNativeDriver: true
        }).start(() => setTimeout(() => {
            this.setState({
                imagedata: null,
                choose: false,
                fadevalue: new Animated.Value(0),
                spinvalue: new Animated.Value(0),
                text: 'Tap to choose image',
                displayresult: [],
                result: false,
                showindicator: false,
                reset: false,
                camera: false,
                gallery: false
            });
        }, 100));
    }

    //choose camera
    choosecamera = () => {
        const options = {
            title: 'Select Image',
            storageOptions: {
                skipBackup: true,
                path: 'images',
            },
        };
        ImagePicker.launchCamera(options, (response) => {
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            } else {
                this.setState({ text: 'Loading...' });
                setTimeout(() => {
                    this.setState({ imagedata: response });
                    this.setState({ camera: true, gallery: false })
                }, 2000);
            }
        });
    }

    //choose library
    choosegallery = () => {
        const options = {
            title: 'Select Image',
            storageOptions: {
                skipBackup: true,
                path: 'images',
            },
        };
        ImagePicker.launchImageLibrary(options, (response) => {
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            } else {
                this.setState({ text: 'Loading...' });
                setTimeout(() => {
                    this.setState({ imagedata: response });
                    this.setState({ gallery: true, camera: false })
                }, 2000);
            }
        });
    }


    //process image    
    processImage = async (data) => {
        if (this.state.camera == true) {
            try {
                const label = await vision().imageLabelerProcessImage(data.uri, { confidenceThreshold: 0.8 });
                for (var i = 0; i < 5; i++) {
                    this.state.displayresult.push({
                        confidence: label[i].confidence,
                        text: label[i].text,
                    })
                }
                this.setState({ result: true, showindicator: false });
            } catch (error) {
                console.log(error.message);
            }
        }
        else {
            try {
                const label = await vision().imageLabelerProcessImage(data.path, { confidenceThreshold: 0.8 });
                for (var i = 0; i < 5; i++) {
                    this.state.displayresult.push({
                        confidence: label[i].confidence,
                        text: label[i].text,
                    })
                }
                this.setState({ result: true, showindicator: false });
            } catch (error) {
                console.log(error.message);
            }
        }
    }

    render() {
        const zoom = this.state.zoomvalue.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 1]
        });
        const spin = this.state.spinvalue.interpolate({
            inputRange: [0, 1],
            outputRange: ['0deg', '360deg']
        })
        return (
            <View style={{ flex: 1, backgroundColor: backgroundcolor }}>

                {/* header view*/}
                <View style={{ height: heightsize * 15 / 100, backgroundColor: buttonbackground, width: widthsize, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ color: highlightcolor, fontSize: widthsize * 5 / 100, fontWeight: 'bold' }}>
                        Object Detection
                    </Text>
                </View>
                <StatusBar backgroundColor={buttonbackground} />
                <ScrollView showsVerticalScrollIndicator={false}>

                    {/* image pick and display view */}
                    <View style={{ alignItems: 'center' }}>
                        <TouchableOpacity delayPressIn={0} activeOpacity={0.6}
                            onPress={() => {
                                this.setState({ choose: true, camera: false, gallery: false });
                                this.fadeanimation()
                            }}
                            disabled={this.state.result ? true : false}
                            style={{
                                width: widthsize * 60 / 100, height: heightsize * 30 / 100, borderRadius: 15, borderWidth: 2, borderStyle: 'dashed', alignItems: 'center',
                                justifyContent: 'center', borderColor: highlightcolor, marginTop: heightsize * 5 / 100, padding: widthsize * 2 / 100
                            }}>
                            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }} >
                                {
                                    this.state.imagedata == null ?
                                        <Text style={{ color: textcolor, fontSize: widthsize * 3.5 / 100 }}>{this.state.text}</Text>
                                        :
                                        <View style={{ flex: 1, overflow: 'hidden', width: widthsize * 56 / 100, height: heightsize * 28 / 100, borderRadius: 15 }}>
                                            <Image source={this.state.imagedata} style={{ flex: 1, height: null, width: null }} />
                                        </View>
                                }

                            </View>
                        </TouchableOpacity>
                    </View>


                    {/* detect button */}
                    {
                        this.state.imagedata == null ?
                            <View />
                            :
                            <View style={{ alignItems: 'center' }}>
                                <TouchableOpacity onPress={() => {
                                    this.setState({ showindicator: true });
                                    setTimeout(() => {
                                        this.processImage(this.state.imagedata);
                                    }, 2000);
                                }} delayPressIn={0} activeOpacity={0.5}
                                    disabled={this.state.result ? true : false}
                                    style={{
                                        marginTop: heightsize * 3 / 100, backgroundColor: highlightcolor, padding: widthsize * 5 / 100,
                                        borderRadius: widthsize * 5 / 100, width: widthsize * 40 / 100, alignItems: 'center', justifyContent: 'center'
                                    }}>
                                    <Text style={{ color: textcolor, fontSize: widthsize * 3.5 / 100 }}>Detect</Text>
                                </TouchableOpacity>
                            </View>
                    }

                    {/* result shown indicator */}
                    {
                        this.state.showindicator == false ?
                            <View />
                            :
                            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', height: heightsize * 30 / 100 }}>
                                <ActivityIndicator size={widthsize * 10 / 100} color={highlightcolor} />
                            </View>
                    }

                    {/* result shown */}
                    {
                        this.state.result == false ?
                            <View />
                            :
                            <View style={{ flex: 1, marginTop: heightsize * 3 / 100 }}>
                                {/* note */}
                                <View style={{
                                    height: heightsize * 7 / 100, backgroundColor: buttonbackground, borderRadius: 15,
                                    margin: widthsize * 3 / 100, padding: widthsize * 3 / 100, alignItems: 'center', justifyContent: 'center'
                                }}>
                                    <Text style={{ color: textcolor, fontSize: widthsize * 3 / 100 }}>
                                        Note:{'   '}Confidence will be calculated between 0 to 1.
                                    </Text>
                                </View>
                                {/* 1 */}
                                <View style={{
                                    height: heightsize * 7 / 100, backgroundColor: buttonbackground, borderRadius: 15, justifyContent: 'space-around',
                                    flexDirection: 'row', margin: widthsize * 3 / 100, padding: widthsize * 3 / 100, alignItems: 'center'
                                }}>
                                    <Text style={{ color: highlightcolor, fontSize: widthsize * 3 / 100 }}>Confidence:</Text>
                                    <Text style={{ color: textcolor, fontSize: widthsize * 3 / 100 }}>{this.state.displayresult[0].confidence.toFixed(2)}</Text>
                                    <Text style={{ color: highlightcolor, fontSize: widthsize * 3 / 100 }}>Result:</Text>
                                    <Text style={{ color: textcolor, fontSize: widthsize * 3 / 100 }}>{this.state.displayresult[0].text}</Text>
                                </View>
                                {/* 2 */}
                                <View style={{
                                    height: heightsize * 7 / 100, backgroundColor: buttonbackground, borderRadius: 15, justifyContent: 'space-around',
                                    flexDirection: 'row', margin: widthsize * 3 / 100, padding: widthsize * 3 / 100, alignItems: 'center'
                                }}>
                                    <Text style={{ color: highlightcolor, fontSize: widthsize * 3 / 100 }}>Confidence:</Text>
                                    <Text style={{ color: textcolor, fontSize: widthsize * 3 / 100 }}>{this.state.displayresult[1].confidence.toFixed(2)}</Text>
                                    <Text style={{ color: highlightcolor, fontSize: widthsize * 3 / 100 }}>Result:</Text>
                                    <Text style={{ color: textcolor, fontSize: widthsize * 3 / 100 }}>{this.state.displayresult[1].text}</Text>
                                </View>
                                {/* 3 */}
                                <View style={{
                                    height: heightsize * 7 / 100, backgroundColor: buttonbackground, borderRadius: 15, justifyContent: 'space-around',
                                    flexDirection: 'row', margin: widthsize * 3 / 100, padding: widthsize * 3 / 100, alignItems: 'center'
                                }}>
                                    <Text style={{ color: highlightcolor, fontSize: widthsize * 3 / 100 }}>Confidence:</Text>
                                    <Text style={{ color: textcolor, fontSize: widthsize * 3 / 100 }}>{this.state.displayresult[2].confidence.toFixed(2)}</Text>
                                    <Text style={{ color: highlightcolor, fontSize: widthsize * 3 / 100 }}>Result:</Text>
                                    <Text style={{ color: textcolor, fontSize: widthsize * 3 / 100 }}>{this.state.displayresult[2].text}</Text>
                                </View>
                                {/* 4 */}
                                <View style={{
                                    height: heightsize * 7 / 100, backgroundColor: buttonbackground, borderRadius: 15, justifyContent: 'space-around',
                                    flexDirection: 'row', margin: widthsize * 3 / 100, padding: widthsize * 3 / 100, alignItems: 'center'
                                }}>
                                    <Text style={{ color: highlightcolor, fontSize: widthsize * 3 / 100 }}>Confidence:</Text>
                                    <Text style={{ color: textcolor, fontSize: widthsize * 3 / 100 }}>{this.state.displayresult[3].confidence.toFixed(2)}</Text>
                                    <Text style={{ color: highlightcolor, fontSize: widthsize * 3 / 100 }}>Result:</Text>
                                    <Text style={{ color: textcolor, fontSize: widthsize * 3 / 100 }}>{this.state.displayresult[3].text}</Text>
                                </View>
                                {/* 5 */}
                                <View style={{
                                    height: heightsize * 7 / 100, backgroundColor: buttonbackground, borderRadius: 15, justifyContent: 'space-around',
                                    flexDirection: 'row', margin: widthsize * 3 / 100, padding: widthsize * 3 / 100, alignItems: 'center'
                                }}>
                                    <Text style={{ color: highlightcolor, fontSize: widthsize * 3 / 100 }}>Confidence:</Text>
                                    <Text style={{ color: textcolor, fontSize: widthsize * 3 / 100 }}>{this.state.displayresult[4].confidence.toFixed(2)}</Text>
                                    <Text style={{ color: highlightcolor, fontSize: widthsize * 3 / 100 }}>Result:</Text>
                                    <Text style={{ color: textcolor, fontSize: widthsize * 3 / 100 }}>{this.state.displayresult[4].text}</Text>
                                </View>
                                {/* reset button */}
                                <View style={{ alignItems: 'center', marginTop: heightsize * 2 / 100, marginBottom: heightsize * 3 / 100 }}>
                                    <TouchableOpacity onPress={() => {
                                        this.setState({ reset: true });
                                        this.rotation();
                                    }} delayPressIn={0} activeOpacity={0.5}
                                        style={{
                                            backgroundColor: highlightcolor, padding: widthsize * 5 / 100, borderRadius: widthsize * 5 / 100, width: widthsize * 40 / 100,
                                            alignItems: 'center', justifyContent: 'center'
                                        }}>
                                        <Text style={{ color: textcolor, fontSize: widthsize * 3.5 / 100 }}>Reset</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                    }
                </ScrollView>

                {/* reset animation */}
                {
                    this.state.reset == true ?
                        <View style={{ flex: 1, justifyContent: 'center', width: '100%', backgroundColor: 'rgba(0,0,0,0.8)', height: '100%', position: 'absolute' }}>
                            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                                <Animated.View style={{ transform: [{ rotate: spin }] }}>
                                    <Calcuatoricon name='camera'
                                        size={widthsize * 15 / 100}
                                        color={highlightcolor}>
                                    </Calcuatoricon>
                                </Animated.View>
                            </View>
                        </View>
                        :
                        <View />
                }

                {/* choose image option */}
                {
                    this.state.choose == true ?
                        <TouchableWithoutFeedback delayPressIn={0} onPress={() => this.setState({ choose: false })}>

                            <View style={{ flex: 1, justifyContent: 'center', width: '100%', backgroundColor: 'rgba(0,0,0,0.8)', height: '100%', position: 'absolute', padding: widthsize * 3 / 100 }}>
                                <TouchableWithoutFeedback onPress={() => this.setState({ choose: true })}>

                                    <Animated.View style={{ height: heightsize * 22 / 100, backgroundColor: buttonbackground, transform: [{ scale: zoom }] }}>

                                        <View style={{ padding: widthsize * 5 / 100, height: heightsize * 7 / 100 }}>
                                            <Text allowFontScaling={false} style={{ color: highlightcolor, fontWeight: 'bold', fontSize: widthsize * 3.5 / 100 }}>
                                                Select Image
                                            </Text>
                                        </View>

                                        <View style={{ padding: widthsize * 5 / 100, height: heightsize * 7 / 100 }}>
                                            <TouchableOpacity delayPressIn={0}
                                                onPress={() => {
                                                    this.setState({ choose: false });
                                                    this.choosecamera();
                                                }} activeOpacity={0.5} style={{ width: '80%' }}>
                                                <Text allowFontScaling={false} style={{ color: textcolor, fontSize: widthsize * 3 / 100, fontWeight: 'bold' }}>
                                                    Take Photo
                                            </Text>
                                            </TouchableOpacity>
                                        </View>

                                        <View style={{ padding: widthsize * 5 / 100, height: heightsize * 7 / 100 }}>
                                            <TouchableOpacity delayPressIn={0}
                                                onPress={() => {
                                                    this.setState({ choose: false });
                                                    this.choosegallery();
                                                }}
                                                activeOpacity={0.5} style={{ width: '80%' }}>
                                                <Text allowFontScaling={false} style={{ color: textcolor, fontSize: widthsize * 3 / 100, fontWeight: 'bold' }}>
                                                    Choose From Gallery
                                            </Text>
                                            </TouchableOpacity>
                                        </View>


                                    </Animated.View>
                                </TouchableWithoutFeedback>

                            </View>
                        </TouchableWithoutFeedback>
                        :
                        <View />

                }
            </View>
        );
    }
}
