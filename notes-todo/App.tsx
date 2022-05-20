import { StatusBar } from 'expo-status-bar';
import {Button, StyleSheet, Text, View} from 'react-native';

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
import {useEffect, useRef, useState} from "react";

type ContextType = {
    translateX: number;
    translateY: number;
};

export default function App() {
    const transformValueX = useSharedValue(0);
    const transformValueY = useSharedValue(0);

    const [notesList, setNotes] = useState([]);

    const [currentFocusPoint, setCurrentFocus] = useState({x:0, y:0});

    useEffect(()=>{
       // console.log("UPDATE CURRENT FOCUS POINT: ", currentFocusPoint);
    },[currentFocusPoint])

    useDerivedValue(() => {
        runOnJS(updateCurrentFocusPosition)(transformValueX.value, transformValueY.value);
    },[transformValueX.value, transformValueY.value]);

    function updateCurrentFocusPosition(newX, newY) {
        //console.log("NEW VALUES")
        setCurrentFocus({x:-newX, y: -newY});
    }


    const panGestureEvent = useAnimatedGestureHandler<
        PanGestureHandlerGestureEvent, ContextType>({
        onStart: (event, context) => {
            context.translateY = transformValueY.value;
            context.translateX = transformValueX.value;
        },
        onActive: (event, context) => {
            transformValueY.value = -event.translationY + context.translateY;
            transformValueX.value = -event.translationX + context.translateX;
        },
        onEnd: () => {

        },
    });



    function addNewNote2() {
        const noteListCoppy = notesList;
        console.log(currentFocusPoint.x, currentFocusPoint.y);

        const newt = {x: 100 , y: 100};
        noteListCoppy.push(newt);

        console.log("CREATED NEW NOTE AT: ", newt);
        setNotes([...noteListCoppy]);
    }

    return (
        <GestureHandlerRootView style={{ flex: 1}}>
            <PanGestureHandler onGestureEvent={panGestureEvent}>
                <Animated.View style={styles.animated_view}>
                    <View style={styles.container}>
                        {
                            notesList.map(elm => (
                                <TodoSticker
                                    coordenatesX={transformValueX} //Movement of all referential
                                    coordenatesY={transformValueY}
                                    y_coord={elm.y}   //Initial Coords
                                    x_coord={elm.x}
                                />
                            ))
                        }
                    </View>
                    <View style={{position:"absolute", top:currentFocusPoint.y + 50, left:currentFocusPoint.x + 50, backgroundColor:"green", width: 50, height:50}}>
                        <Text>ORIGIN</Text>
                    </View>
                </Animated.View>
            </PanGestureHandler>
            <Button title={"TEST"} onPress={addNewNote2} color={"red"}  />
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

/*
*                         <TodoSticker
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
                        * */