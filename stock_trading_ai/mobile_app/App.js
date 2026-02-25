import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import PortfolioScreen from './src/screens/PortfolioScreen';
import TradeScreen from './src/screens/TradeScreen';
import AiTradeScreen from './src/screens/AiTradeScreen';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={{
            headerStyle: { backgroundColor: '#2196F3' },
            headerTintColor: '#fff',
            tabBarActiveTintColor: '#2196F3',
          }}
        >
          <Tab.Screen name="Portfolio" component={PortfolioScreen} />
          <Tab.Screen name="Trade" component={TradeScreen} />
          <Tab.Screen name="AI Analysis" component={AiTradeScreen} />
        </Tab.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
