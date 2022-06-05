import {View, StyleSheet, Text, Vibration} from "react-native";
import Animated, {
    runOnJS, useAnimatedGestureHandler,
    useAnimatedStyle,
    useDerivedValue,
    useSharedValue, withDelay,
    withRepeat,
    withTiming
} from "react-native-reanimated";
import {useContext, useEffect, useRef, useState} from "react";
import {PanGestureHandler, PanGestureHandlerGestureEvent} from "react-native-gesture-handler";
import {RepositoryHook} from "../BD/RepositoryHook";
import {CategorySharedContext} from "../shared_contexts/CategorySharedContext";


type ContextType = {
    translateX: number;
    translateY: number;

    translateXParent: number;
    translateYParent: number;
};

export default function TodoSticker(
    {
        coordenatesX,
        coordenatesY,
        x_coord,
        y_coord,
        scale,
        noteId,
        editNoteMethod,
        title,
        body,
        color,
        note,
        reaclculateNotesView
    }) {
    //===========================================================
    //              SHARED VALUES
    //===========================================================
    const position_y = useSharedValue(y_coord);
    const position_x = useSharedValue(x_coord);
    const translateX = useSharedValue(coordenatesX.value);
    const translateY = useSharedValue(coordenatesY.value);
    const translateXParent = useSharedValue(coordenatesX.value);
    const translateYParent = useSharedValue(coordenatesY.value);
    const todoState = useSharedValue(0);

    const isFinished = useSharedValue(false);
    //===========================================================
    //              STANDARD HOOKS AND REFS
    //===========================================================
    const [active, setActive] = useState(0);
    const panTimer = useRef(null);
    const [currentTapTime, setCurrentTapTime] = useState(0);
    const [lastTapTime, setLastTapTime] = useState(0);
    const repository = RepositoryHook();
    /*
    * TAP STATE
    *   0 - waiting for tap
    *   1 - 1 tap
    *   2 - second tap within defined interval
    * */


    //===========================================================
    //              USE EFFECT SECTION
    //===========================================================
    useEffect(()=>{
        if(y_coord && x_coord){
            position_y.value= y_coord;
            position_x.value= x_coord;
        }
    },[])


    //Handles double tap
    useEffect(()=>{
        if(currentTapTime == 0) return;
        if(Math.abs(currentTapTime - lastTapTime) < 350) {
            console.log("DOUBLE TAP DETECTED");
            setCurrentTapTime(0)
            editNoteHandler();
        }
        setLastTapTime(Date.now());
    },[currentTapTime])


    useEffect(()=> {
        if(active == 3) {   //Cancel
            resetPanTimer();
            setCurrentTapTime(Date.now());
            reaclculateNotesView(note);
            return;
        }

        if (active == 1) {  //Activate Timer
            activatePanTimer();
            return;
        }

        if(active == 2) {  //Virate
            Vibration.vibrate(50);
        }

    }, [active])


   /*
    *  0 - NOT ACTIVE
    *  1 - WAITING FOR SECOND PHASE
    *  2 - ACTIVATED
    *  3 - CANCELED
    * */

    function activatePanTimer() {
        panTimer.current =  setTimeout(function () {
            todoState.value = 2;
            setActive(2);
        }, 500);
    }

    function resetPanTimer() {
        clearTimeout(panTimer.current);
    }

    function changeStateFromWorker(value) {
        setActive(value);
    }


    //===========================================================
    //              USE DERIVED VALUES SECTION
    //===========================================================
    useDerivedValue(() => {
        if(isFinished.value) {
            runOnJS(repository.updateElement)(noteId,
                position_x.value + translateX.value,
                position_y.value + translateY.value
            );
            isFinished.value = false;
        }
    }, [isFinished.value])


    useDerivedValue(() => {
        if(todoState.value == 2) return;
        runOnJS(changeStateFromWorker)(todoState.value);
    }, [todoState.value])

    const panGestureEvent = useAnimatedGestureHandler<
        PanGestureHandlerGestureEvent, ContextType>({
        onStart: (event, context) => {

            context.translateY =  translateY.value;
            context.translateX =  translateX.value;

            context.translateXParent = coordenatesX.value;
            context.translateYParent = coordenatesY.value;

            todoState.value = 1;
        },
        onActive: (event, context) => {
            //ESTAMSO A MULTIPLICAR POR 1/SCALE VALUE PORQUE SE HOUVER SCALE AS COORDENADAS TABEM TEM QUE MODAR PROPORCAO

            if(todoState.value == 2) {
                translateX.value = event.translationX * (1/scale.value) + context.translateX;
                translateY.value = event.translationY * (1/scale.value) + context.translateY;

            } else {
                if((Math.abs(event.translationX) + Math.abs(event.translationY)) > 200/2 * scale.value) {
                    todoState.value = 3;
                }
                coordenatesX.value = -event.translationX * (1/scale.value) + context.translateXParent;
                coordenatesY.value = -event.translationY * (1/scale.value) + context.translateYParent;
            }
        },

        onFinish:()=>{
            todoState.value = 3;
        },
        onEnd: (event, context) => {
            todoState.value = 0;
            //TODO FAZER UPDATE DE POSICAO DO ELEMENTO AQUI
            isFinished.value = true;
            //repository.updateElement(noteId, translateX.value, translateY.value);

        },
    });


    const rStyle = useAnimatedStyle(() => {
        return {
            transform: [
                { translateX : scale.value*(-coordenatesX.value + position_x.value + translateX.value)},
                { translateY : scale.value*(-coordenatesY.value + position_y.value + translateY.value)},
                {scale : scale.value}
            ],
        };
    });

    function editNoteHandler() {
        editNoteMethod(noteId);
    }

    return(
            <PanGestureHandler onGestureEvent={panGestureEvent}>
                <Animated.View style={[rStyle]}>
                    <View style={[styles.todoSticker, {backgroundColor: color}]}>
                        <View style={styles.todo_title_div}>
                            <Text style={styles.todo_title_text}>{title}</Text>
                        </View>
                        <View style={styles.todo_body_div}>
                            <Text style={styles.todo_body_text}>{body}</Text>
                        </View>
                    </View>
                </Animated.View>
            </PanGestureHandler>
    )
}

const styles = StyleSheet.create({
    todoSticker: {
        position: "absolute",
        minHeight: 200,
        width: 200,
        backgroundColor: "#fabd2f",
        elevation: 5
    },
    todo_title_div: {
        flex:1,
        alignItems:"center",
        justifyContent:"center",
    },
    todo_title_text: {
        color: "#282828",
        fontSize: 18,
        fontWeight: "700"
    },
    todo_body_div: {
        flex:3,
        alignItems: "center"
    },
    todo_body_text: {
        color: "#282828",
        fontSize: 14,
        fontWeight: "500",
        fontStyle: "italic",
        marginHorizontal: 5,
    },
});

