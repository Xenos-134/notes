import {StyleSheet, Text, View} from "react-native";
import Animated, {
    useAnimatedGestureHandler,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
} from 'react-native-reanimated';

export default function NoteClassView(
    {
        referentialX,
        referentialY,
        scale,
        category,
    }) {


    const rStyle = useAnimatedStyle(() => {
        return {
            transform: [
                {
                    translateX: scale.value * (category.x - referentialX.value),
                },
                {
                    translateY: scale.value * (category.y - referentialY.value),
                },
                {scale: scale.value * 1.8}
            ],
        };
    });

    return (
            <Animated.View style={rStyle}>
                <View style={styles.note_category_view}>
                    <Text style={styles.note_category_text}>
                        {category._name}
                    </Text>
                </View>
            </Animated.View>
    )
}

const styles = StyleSheet.create({
    note_category_view: {
        backgroundColor: '#665c54',
        width: 300,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center'
    },
    note_category_text: {
        fontWeight: "600",
        fontSize: 18,
        color: "#ebdbb2"
    }

});