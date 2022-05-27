import {Text, View, StyleSheet, TouchableHighlight} from "react-native";

export default function ScaleDownButton({func}) {
    return(
        <TouchableHighlight
            onPress={func}
            style={styles.scale_button_view}>
            <Text style={styles.text}>-</Text>
        </TouchableHighlight>
    )
}

const styles = StyleSheet.create({
    scale_button_view: {
        position:"absolute",
        height: 40,
        width: 40,
        top: 100,
        right: 25,
        alignItems:"center",
        justifyContent:'center',
        backgroundColor: "#689d6a",
        elevation: 10,
        borderRadius: 10
    },
    text: {
        color: "#fbf1c7",
        fontWeight: "500",
        fontSize: 25
    }
})