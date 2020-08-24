import React from 'react';
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  View,
  Button,
} from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { DrawerToggle, headerOptions } from '../menus/HeaderComponents';
import { AuthManager } from '../auth/AuthManager';
import { GraphManager } from '../graph/GraphManager';

const Stack = createStackNavigator();
const UserState = React.createContext({userLoading: true, userName: '', accessToken: ''});
type HomeScreenState = {
  userLoading: boolean;
  userName: string;
  accessToken: string;
}



const HomeComponent = () => {
  const userState = React.useContext(UserState);

  const _requestVerifyAPI = async () => {
    console.log("userState: ", JSON.stringify(userState));
    console.log("userState.accessToken: ", JSON.stringify(userState.accessToken));
    
    let url = "http://52.151.25.73:8080/api/jwt/checkAADJWT?tenantId=06aa9b7a-f7ae-4e01-9581-a769e9fc1bd6&clientId=a20ecdc7-18c5-4e42-81e7-c6153fa00e5c&token="+userState.accessToken;
    fetch(url, {
      headers: {
　　　　'Content-Type': 'application/x-www-form-urlencoded'
  　　},
    })
    .then(function(response) {
      return response.json();
    })
    .then(function(myJson) {
      console.log(myJson);
      Alert.alert(
        JSON.stringify(myJson),
        "",
        [
            {
            text: 'OK'
            }
        ],
        { cancelable: false }
      );
    });
  }

  const _requestRefreshToken = async () => {
    try{
      let refreshTokenResult = await AuthManager.refreshAccessTokenAsync();
      console.log("refresh        token: ", refreshTokenResult);
      if(refreshTokenResult){
        let url = "http://52.151.25.73:8080/api/jwt/checkAADJWT?tenantId=06aa9b7a-f7ae-4e01-9581-a769e9fc1bd6&clientId=a20ecdc7-18c5-4e42-81e7-c6153fa00e5c&token="+refreshTokenResult;
        fetch(url, {
          headers: {
    　　　　'Content-Type': 'application/x-www-form-urlencoded'
      　　},
        })
        .then(function(response) {
          return response.json();
        })
        .then(function(myJson) {
          console.log(myJson);
          Alert.alert(
            JSON.stringify(myJson),
            "",
            [
                {
                text: 'OK'
                }
            ],
            { cancelable: false }
          );
        });
      }else{
        Alert.alert(
          "Failed to get refresh token! ",
          "",
          [
              {
              text: 'Cancel'
              }
          ],
          { cancelable: false }
        );
      }
      
    }
    catch(err){
      Alert.alert(
        JSON.stringify(err),
        "",
        [
            {
            text: 'Cancel'
            }
        ],
        { cancelable: false }
      );
    }
    
    
    
  }

  return (
    <View style={styles.container}>
      <ActivityIndicator animating={userState.userLoading} size='large' />
      {userState.userLoading ? null: <Text>Hello {userState.userName} !</Text>}
      <View style={styles.buttonMargin}>
        <Button title='Validate API' onPress={_requestVerifyAPI}/>
      </View>
      <View style={styles.buttonMargin}>
        <Button title='Refresh Token' onPress={_requestRefreshToken}/>
      </View>
      <View style={styles.buttonMargin}>
      
      </View>
      
    </View>
  );
}

export default class HomeScreen extends React.Component {

  state: HomeScreenState = {
    userLoading: true,
    userName: '',
    accessToken: '',
  };

  async componentDidMount() {
    try {
      // Get the signed-in user from Graph
      const user = await GraphManager.getUserAsync();
      console.log("Home User:", JSON.stringify(user));
      // Set the user name to the user's given name
      this.setState({userName: user.givenName, userLoading: false, accessToken: user.accessToken});
    } catch (error) {
      Alert.alert(
        'Error getting user',
        JSON.stringify(error),
        [
            {
            text: 'OK'
            }
        ],
        { cancelable: false }
      );
    }
  }

  

  render() {
    return (
      <UserState.Provider value={this.state}>
          <Stack.Navigator screenOptions={headerOptions}>
            <Stack.Screen name='Home'
              component={HomeComponent}
              options={{
                title: 'Welcome',
                headerLeft: () => <DrawerToggle/>
              }} />
          </Stack.Navigator>
      </UserState.Provider>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonMargin: {
    marginTop: 10,
    justifyContent: "space-between"
  }

});