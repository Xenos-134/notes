import {View, StyleSheet, Text} from "react-native";
import Animated, {
    runOnJS, useAnimatedGestureHandler,
    useAnimatedStyle,
    useDerivedValue,
    useSharedValue, withDelay,
    withRepeat,
    withTiming
} from "react-native-reanimated";
import {useEffect, useState} from "react";
import {PanGestureHandler, PanGestureHandlerGestureEvent} from "react-native-gesture-handler";


type ContextType = {
    translateX: number;
    translateY: number;
};

export default function TodoSticker({coordenatesX, coordenatesY, x_coord, y_coord}) {
    const sharedValue = useSharedValue(-100);
    const position_y = useSharedValue(y_coord);
    const position_x = useSharedValue(x_coord);


    useEffect(()=>{
        sharedValue.value = withRepeat(withTiming(100, {duration: 1000}), -1, true);
        if(y_coord && x_coord){
            position_y.value= y_coord;
            position_x.value= x_coord;
        }
    },[])


    const panGestureEvent = useAnimatedGestureHandler<
        PanGestureHandlerGestureEvent, ContextType>({
        onStart: (event, context) => {
            console.log("TOUCH DETECTED");
            context.translateY = coordenatesY.value;
            context.translateX = coordenatesX.value;
        },
        onActive: (event, context) => {
            //TODO ADICIONAR AQUELA PARTE DE ATIVAR O ELEMENTO ATRAVES DE TOQUE CONTINUO
            coordenatesX.value = event.translationX + context.translateX;
            coordenatesY.value = event.translationY + context.translateY;
        },
        onEnd: () => {

        },
    });



    const rStyle = useAnimatedStyle(() => {
        return {
            transform: [
                { translateX : coordenatesX.value + position_x.value},
                { translateY : coordenatesY.value + position_y.value},
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

