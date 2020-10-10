import React, { Component } from 'react';
import { View, StatusBar, Dimensions } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import AsyncStorage from '@react-native-community/async-storage';
import Permission from './Component/Permission';
import Splashscreen from './Component/Splashscreen';
import Mainpage from './Component/Mainpage';

export default class App extends Component {
  constructor(props) {
    super(props);
    global.widthsize = Dimensions.get('window').width;
    global.heightsize = Dimensions.get('window').height;
    global.backgroundcolor = '#161926';
    global.buttonbackground = '#252c47';
    global.highlightcolor = '#fc753f';
    global.textcolor = '#ffffff';
  }
  
  render() {
    const Stack = createStackNavigator();
    return (
      <NavigationContainer>
        <Stack.Navigator headerMode='none' initialRouteName='Index'>
          <Stack.Screen name='Index' component={Index} />
          <Stack.Screen name='Permission' component={Permission} />
          <Stack.Screen name='Splashscreen' component={Splashscreen} />
          <Stack.Screen name='Mainpage' component={Mainpage} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}

//for checking the permisssion
class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  async componentDidMount() {
    await AsyncStorage.multiGet(['cameraaccess',
      'readstorageaccess', 'writestorageaccess']).then(data => {
        global.cameraaccess = data[0][1];
        global.readstorageaccess = data[1][1];
        global.writestorageaccess = data[2][1];
      })

    //permission check
    if (cameraaccess == 'granted') {
      if (readstorageaccess == 'granted') {
        if (writestorageaccess == 'granted') {
          this.props.navigation.navigate('Splashscreen');
        }
        else {
          this.props.navigation.navigate('Permission');
        }
      }
      else {
        this.props.navigation.navigate('Permission');
      }
    }
    else {
      this.props.navigation.navigate('Permission');
    }
  }
  render() {
    return (
      <View style={{ flex: 1, backgroundColor: backgroundcolor }}>
        <StatusBar backgroundColor={backgroundcolor} />
      </View >
    );
  }
}
