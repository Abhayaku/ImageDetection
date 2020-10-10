import React, { Component } from 'react';
import { View, Text, Animated } from 'react-native';
import Calcuatoricon from 'react-native-vector-icons/MaterialIcons';

export default class Splashscreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            logofade: new Animated.Value(0),
            textfade: new Animated.Value(0),
            zoomvalue: new Animated.Value(1),
        };
    }

    componentDidMount() {
        Animated.parallel([
            Animated.timing(this.state.logofade, {
                toValue: 1,
                duration: 1000,
                useNativeDriver: true
            }),
            Animated.timing(this.state.textfade, {
                toValue: 1,
                duration: 1000,
                useNativeDriver: true
            })
        ]).start(() =>
            Animated.parallel([
                Animated.timing(this.state.textfade, {
                    toValue: 0,
                    duration: 300,
                    useNativeDriver: true
                }),
                Animated.timing(this.state.zoomvalue, {
                    toValue: 8,
                    duration: 1200,
                    useNativeDriver: true
                }),
                Animated.timing(this.state.logofade, {
                    toValue: 0,
                    duration: 1200,
                    useNativeDriver: true
                }),
            ]).start(() => setTimeout(() => {
                this.props.navigation.navigate('Mainpage');
            }, 100)));
    }

    render() {
        const zoom = this.state.zoomvalue.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 1]
        });
        return (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: backgroundcolor }}>
                <Animated.View style={{ opacity: this.state.logofade, transform: [{ scale: zoom }] }}>
                    <Calcuatoricon name='camera'
                        size={widthsize * 35 / 100}
                        color={highlightcolor}>
                    </Calcuatoricon>
                </Animated.View>

                <Animated.View style={{ marginTop: heightsize * 3 / 100, opacity: this.state.textfade }}>
                    <Text allowFontScaling={false} style={{ color: highlightcolor, fontSize: widthsize * 6 / 100 }}>
                        Object Detection
                     </Text>
                </Animated.View>
            </View>
        );
    }
}
