import * as React from 'react';
import {View, Text, Button} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { CardStyleInterpolators } from '@react-navigation/stack';


//CUSTOM COMPONENTS IMPORTS
import MainScreen from "./MainScreen";
import EditNoteView from "./custom_components/EditNoteView";
import NotesListView from "./custom_components/NotesListView";
import LoadingView from "./custom_components/LoadingView";


const Stack = createStackNavigator();

function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{headerShown: false}}>
                <Stack.Screen name="MainScreen" component={MainScreen} />
                <Stack.Screen name="Loading" component={LoadingView} />
                <Stack.Screen name="Edit Note" component={EditNoteView} />
                <Stack.Screen name="Notes List" component={NotesListView} options={{cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,}} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}

export default App;