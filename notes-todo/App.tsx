import { StatusBar } from 'expo-status-bar';
import {Button, StyleSheet, Text, View} from 'react-native';
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


//CUSTOM COMPONENTS IMPORT
import TodoSticker from "./custom_components/TodoStickerView";
import NewNoteButton from "./custom_components/Buttons/NewNoteButton";
import ScaleUpButton from "./custom_components/Buttons/ScaleUpButton";
import ScaleDownButton from "./custom_components/Buttons/ScaleDownButton";

type ContextType = {
    translateX: number;
    translateY: number;
};

export default function App() {
    const transformValueX = useSharedValue(0);
    const transformValueY = useSharedValue(0);
    const scaleValue = useSharedValue(0.5);

    const [notesList, setNotes] = useState([{x: 0 , y: 0},
        {x: 233 , y: -19},
        {x: 224 , y: 225}
    ]);

    const [currentFocusPoint, setCurrentFocus] = useState({x:0, y:0});



    useDerivedValue(() => {
        runOnJS(updateCurrentFocusPosition)(transformValueX.value, transformValueY.value);
    },[transformValueX.value, transformValueY.value]);

    function updateCurrentFocusPosition(newX, newY) {
        setCurrentFocus({x:-newX, y: -newY});
    }


    const panGestureEvent = useAnimatedGestureHandler<
        PanGestureHandlerGestureEvent, ContextType>({
        onStart: (event, context) => {
            context.translateY = transformValueY.value;
            context.translateX = transformValueX.value;
        },
        onActive: (event, context) => {
            transformValueY.value = -event.translationY * (1/scaleValue.value) + context.translateY;
            transformValueX.value = -event.translationX * (1/scaleValue.value)  + context.translateX;
        },
        onEnd: () => {

        },
    });


    function addNewNote() {
        const noteListCoppy = notesList;
        console.log(-currentFocusPoint.x, -currentFocusPoint.y);

        const newt = {x: 0 , y: 0};
        noteListCoppy.push(newt);

        console.log("CREATED NEW NOTE AT: ", newt);
        setNotes([...noteListCoppy]);
    }

    function scaleUp() {
        scaleValue.value+=0.2;
    }

    function scaleDown() {
        scaleValue.value-=0.2;
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
                                    scale={scaleValue}
                                />
                            ))
                        }
                    </View>
                    <View style={{
                        position:"absolute",
                        top:currentFocusPoint.y + 50,
                        left:currentFocusPoint.x + 50,
                        backgroundColor:"green", width: 50, height:50
                    }}>

                        <Text>ORIGIN</Text>
                    </View>
                    <ScaleUpButton func={scaleUp}/>
                    <ScaleDownButton func={scaleDown}/>
                    <NewNoteButton func={addNewNote}/>
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
