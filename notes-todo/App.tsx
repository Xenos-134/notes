import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

//CUSTOM COMPONENTS IMPORT
import TodoSticker from "./custom_components/TodoStickerView";
import Animated, {
    runOnJS,
    useAnimatedGestureHandler,
    useDerivedValue,
    useSharedValue,
    withRepeat,
    withTiming
} from "react-native-reanimated";
import {GestureHandlerRootView, PanGestureHandler, PanGestureHandlerGestureEvent} from "react-native-gesture-handler";
import {useEffect, useState} from "react";

type ContextType = {
    translateX: number;
    translateY: number;
};

export default function App() {

    const transformValueX = useSharedValue(100);
    const transformValueY = useSharedValue(100);

    //transformValue.value =  withRepeat(withTiming(400, {duration: 2000}), -1, true);



    const panGestureEvent = useAnimatedGestureHandler<
        PanGestureHandlerGestureEvent, ContextType>({
        onStart: (event, context) => {
            context.translateY = transformValueY.value;
            context.translateX = transformValueX.value;
        },
        onActive: (event, context) => {
            transformValueY.value = event.translationY + context.translateY;
            transformValueX.value = event.translationX + context.translateX;
        },
        onEnd: () => {

        },
    });


    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <PanGestureHandler onGestureEvent={panGestureEvent}>
                <Animated.View style={styles.animated_view}>
                    <View style={styles.container}>
                        <TodoSticker
                            coordenatesX={transformValueX} //Movement of all referential
                            coordenatesY={transformValueY}
                            y_coord={100}   //Initial Coords
                            x_coord={100}
                        />

                        <TodoSticker
                            coordenatesX={transformValueX} //Movement of all referential
                            coordenatesY={transformValueY}
                            y_coord={500}   //Initial Coords
                            x_coord={-100}
                        />
                    </View>
                </Animated.View>
            </PanGestureHandler>
        </GestureHandlerRootView>
    );
}


//TODO FAZER COM QUE A ALTURA FIQUE MAIS ALTERAVEL CONSOANTE QUANTIDADE DE TEXTO
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ebdbb2',
    },
    animated_view: {
        flex: 1,
    }
});