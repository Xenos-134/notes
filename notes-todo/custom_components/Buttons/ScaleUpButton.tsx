import {Text, View, StyleSheet, TouchableHighlight} from "react-native";

export default function ScaleUpButton({func}) {
    return(
        <TouchableHighlight
            onPress={func}
            style={styles.scale_button_view}>
            <Text>+</Text>
        </TouchableHighlight>
    )
}

const styles = StyleSheet.create({
    scale_button_view: {
        position:"absolute",
        height: 40,
        width: 40,
        top: 50,
        right: 25,
        alignItems:"center",
        justifyContent:'center',
        backgroundColor: "#689d6a",
        borderRadius: 10
    }
})