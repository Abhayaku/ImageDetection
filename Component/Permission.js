import React, { Component } from 'react';
import { View, PermissionsAndroid } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

export default class Permission extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }
    async componentDidMount() {
        let userpermission = await PermissionsAndroid.requestMultiple([
            PermissionsAndroid.PERMISSIONS.CAMERA,
            PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
            PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        ]);

        let access = [
            ['cameraaccess', userpermission['android.permission.CAMERA']],
            ['readstorageaccess', userpermission['android.permission.READ_EXTERNAL_STORAGE']],
            ['writestorageaccess', userpermission['android.permission.WRITE_EXTERNAL_STORAGE']],
        ];
        await AsyncStorage.multiSet(access);

        //permission granted
        if (userpermission['android.permission.CAMERA'] == 'granted') {
            if (userpermission['android.permission.READ_EXTERNAL_STORAGE'] == 'granted') {
                if (userpermission['android.permission.WRITE_EXTERNAL_STORAGE'] == 'granted') {
                    setTimeout(() => {
                        this.props.navigation.navigate('Splashscreen');
                    }, 500);
                }
                else {
                    this.props.navigation.navigate('Splashscreen');
                }
            }
            else {
                this.props.navigation.navigate('Splashscreen');
            }
        }
        else {
            this.props.navigation.navigate('Splashscreen');
        }
    }

    render() {
        return (
            <View style={{ flex: 1, backgroundColor: backgroundcolor }}>
            </View >
        );
    }
}
