import {View, StyleSheet} from "react-native";
import LottieView from 'lottie-react-native';

export default function LoadingView() {
    return (
        <View style={styles.loading_main_view}>
            <LottieView source={require('../animations/notepad_animation.json')} autoPlay loop />
        </View>
    )
}

const styles = StyleSheet.create({
    loading_main_view: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#d5c4a1",
    }
})