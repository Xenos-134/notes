import * as React from 'react';
import {View, Text, Button} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import MainScreen from "./MainScreen";
import EditNoteView from "./custom_components/EditNoteView";


const Stack = createStackNavigator();

function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{headerShown: false}}>
                <Stack.Screen name="MainScreen" component={MainScreen} />
                <Stack.Screen name="Edit Note" component={EditNoteView} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}

export default App;