import {View, StyleSheet, Text, Vibration} from "react-native";
import Animated, {
    runOnJS, useAnimatedGestureHandler,
    useAnimatedStyle,
    useDerivedValue,
    useSharedValue, withDelay,
    withRepeat,
    withTiming
} from "react-native-reanimated";
import {useEffect, useRef, useState} from "react";
import {PanGestureHandler, PanGestureHandlerGestureEvent} from "react-native-gesture-handler";


type ContextType = {
    translateX: number;
    translateY: number;
};

export default function TodoSticker({coordenatesX, coordenatesY, x_coord, y_coord}) {
    //SHARED VALUES
    const position_y = useSharedValue(y_coord);
    const position_x = useSharedValue(x_coord);
    const translateX = useSharedValue(0);
    const translateY = useSharedValue(0);
    const todoState = useSharedValue(0);
    //Standart states and refs
    const [active, setActive] = useState(0);
    const touchTimer = useRef(null);


    useEffect(()=>{
        if(y_coord && x_coord){
            position_y.value= y_coord;
            position_x.value= x_coord;
        }
    },[])


    useEffect(()=> {
        console.log("CHANGING STATE", active);
        if(active == 3) {
            resetTimer();
            return;
        }

        if (active == 1) {
            activateTimer();
            return;
        }

        if(active == 2) {
            Vibration.vibrate(50);
        }

    }, [active])



    /*
*  0 - NOT ACTIVE
*  1 - WAITING FOR SECOND PHASE
*  2 - ACTIVATED
*  3 - CANCELED
* */

    function activateTimer() {
        touchTimer.current =  setTimeout(function () {
            console.log(">>>>ACTIVATION", active);
            todoState.value = 2;
            setActive(2);
        }, 1000);
    }

    function resetTimer() {
        clearTimeout(touchTimer.current);
    }

    function changeStateFromWorker(value) {
        setActive(value);
    }

    useDerivedValue(() => {
        if(todoState.value == 2) return;
        runOnJS(changeStateFromWorker)(todoState.value);
    }, [todoState.value])

    const panGestureEvent = useAnimatedGestureHandler<
        PanGestureHandlerGestureEvent, ContextType>({
        onStart: (event, context) => {
            console.log("TOUCH DETECTED");
            context.translateY = translateY.value;
            context.translateX = translateX.value;
            todoState.value = 1;
        },
        onActive: (event, context) => {
            //TODO ADICIONAR AQUELA PARTE DE ATIVAR O ELEMENTO ATRAVES DE TOQUE CONTINUO


            if(todoState.value == 2) {
                translateX.value = event.translationX + context.translateX;
                translateY.value = event.translationY + context.translateY;
            } else {
                coordenatesX.value = event.translationX + context.translateX;
                coordenatesY.value = event.translationY + context.translateY;
            }
        },
        onEnd: () => {

        },
    });



    const rStyle = useAnimatedStyle(() => {
        return {
            transform: [
                { translateX : coordenatesX.value + position_x.value + translateX.value},
                { translateY : coordenatesY.value + position_y.value + translateY.value},
                {scale : 0.7}
            ],
        };
    });

    return(
        <PanGestureHandler onGestureEvent={panGestureEvent}>
            <Animated.View style={[rStyle]}>
                <View style={styles.todoSticker}>
                    <View style={styles.todo_title_div}>
                        <Text style={styles.todo_title_text}>TITLE</Text>
                    </View>
                    <View style={styles.todo_body_div}>
                        <Text style={styles.todo_body_text}>This is todo text that I need todo</Text>
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

