import { createStackNavigator,} from '@react-navigation/stack';

import loginScreen from './component/Login';

import menuScreen from './component/Menu'

export const SignedOutRoutes = createStackNavigator({
    Login: {
      screen: loginScreen,
      navigationOptions: {
        title: "Entrar"
      }
    },
  });
  
  export const SignedInRoutes = createStackNavigator({
    Logged: {
      screen: menuScreen,
      navigationOptions: {
        title: "Meu perfil"
      }
    },
  });

  export const createRootNavigator = (signedIn = false) => {
    return createStackNavigator({
      SignedIn: { screen: SignedInRoutes },
      SignedOut: { screen: SignedOutRoutes }
    },
    {
      headerMode: "none",
      mode: "modal",
      initialRouteName: signedIn ? "SignedIn" : "SignedOut",
      navigationOptions: {
        gesturesEnabled: false
      }
    });
  };