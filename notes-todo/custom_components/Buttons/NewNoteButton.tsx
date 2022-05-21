import {View, StyleSheet, Text, TouchableHighlight} from "react-native";

export default function NewNoteButton({func}) {
    return (
        <TouchableHighlight
            style={styles.new_note_main_view}
            underlayColor={"#427b58"}
            onPress={func}

        >
            <Text style={styles.new_note_text}> NEW NOTE</Text>
        </TouchableHighlight>
    )
}

const styles = StyleSheet.create({
    new_note_main_view: {
        height: 75,
        width: 75,
        display:"flex",
        position: "absolute",
        bottom: 50,
        right: 50,
        backgroundColor: "#689d6a",
        borderRadius: 38,
        alignItems:"center",
        justifyContent:"center",
        elevation: 10,
    },
    new_note_text: {
        color: "#fbf1c7",
        fontWeight: "600",
        fontStyle:"italic",
    }
})