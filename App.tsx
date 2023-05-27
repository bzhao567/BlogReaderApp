import React, { useEffect, useRef } from 'react';
import { NavigationContainer, NavigationContainerRef, ParamListBase } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Linking } from 'react-native';
import DeepLinking from 'react-native-deep-linking';
import HomeScreen from './HomeScreen';
import DetailedView from './DetailedView';
import Icon from 'react-native-vector-icons/Ionicons'

Icon.loadFont();

type RootStackParamList = {
  Home: undefined;
  DetailedView: { id: string };
};

const Stack = createStackNavigator<RootStackParamList>();

const linking = {
  prefixes: ['blogreaderapp://'],
  config: {
    screens: {
      DetailedView: 'blog/:id',
    },
  },
};

function App() {
  const navigationRef = useRef<NavigationContainerRef<RootStackParamList>>(null);

  useEffect(() => {
    const handleOpenURL = (event: { url: string }) => {
      const { url } = event;
      let path = url.split('://')[1];
      let id = path.split('/')[1];  // Get the blog ID

      if (path.startsWith('blog/')) {
        navigationRef.current?.navigate('DetailedView', { id: id });
      }
    };

    const urlListener = Linking.addListener('url', handleOpenURL);
    
    return () => {
      // Unsubscribe the event listener
      urlListener.remove();
    };
  }, []);

  return (
    <NavigationContainer 
      ref={navigationRef} 
      onReady={() => {
        Linking.getInitialURL().then((url) => {
          if (url) {
            let path = url.split('://')[1];
            let id = path.split('/')[1];  // Get the blog ID
      
            // The screen to navigate to
            let screen: keyof RootStackParamList;
            let screenParams: RootStackParamList[keyof RootStackParamList] | undefined;
            
            if (path.startsWith('blog/')) {
              screen = 'DetailedView';
              screenParams = { id: id };
            } else {
              screen = 'Home';
            }
      
            // Reset the navigation state
            navigationRef.current?.reset({
              index: 1,
              routes: [
                { name: 'Home' },
                {
                  name: screen,
                  params: screenParams,
                },
              ],
            });
          }
        });
      }}
      linking={linking}
    >
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="DetailedView" component={DetailedView} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;

