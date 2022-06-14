import {StyleSheet, Text, View} from "react-native";
import Animated, {
    useAnimatedGestureHandler,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
} from 'react-native-reanimated';
import {useEffect, useState} from "react";

export default function NoteClassView(
    {
        referentialX,
        referentialY,
        scale,
        category,
        numOfChilds
    }) {

    const [visible, setVisible] = useState(false);

    useEffect(()=>{
        if(numOfChilds > 1) setVisible(true);
    },[])


    const rStyle = useAnimatedStyle(() => {
        return {
            transform: [
                {
                    translateX: scale.value * (category.x - referentialX.value),
                },
                {
                    translateY: scale.value * (category.y - referentialY.value),
                },
                {scale: scale.value}
            ],
        };
    });

    function calculateViewWidth(x: number, bx: number) {
        'worklet'
        if(Math.abs(x - bx)  < 400) return 400;
        return  Math.abs(x - bx);
    }

    function calculateViewHeight(y: number, by: number) {
        'worklet'
        if(Math.abs(y - by)  < 400) return 400;
        return  Math.abs(y - by);
    }


    const categoryViewDimensions = useAnimatedStyle(() => {
        const categoryViewWidth = category.x - category.bx;
        const categoryViewHeight = category.y - category.by;


        return {
            width: calculateViewWidth(category.x, category.bx),
            height: calculateViewHeight(category.y, category.by),
        };
    });

    
    return (
            <Animated.View style={rStyle}>
                <Animated.View style={[styles.noteCategoryOut, categoryViewDimensions, {borderColor: category.color}]}>
                    <View style={
                        [styles.note_category_view, {backgroundColor: category.color?category.color:"#282828"},]}>
                        <Text style={styles.note_category_text}>
                            {category._name}
                        </Text>
                    </View>
                </Animated.View>
            </Animated.View>
    )
}

const styles = StyleSheet.create({
    note_category_view: {
        backgroundColor: '#665c54',
        width: 300,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        left: -2,
        top: -2,
    },
    note_category_text: {
        fontWeight: "600",
        fontSize: 18,
        color: "#ebdbb2"
    },
    noteCategoryOut: {
        position: "absolute",
        alignItems: "flex-start",
        justifyContent: "flex-start",
        borderWidth: 5,
        borderColor: '#665c54',
    }

});