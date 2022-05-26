import {StyleSheet, Text, TouchableHighlight} from "react-native";

export default function ShowAllNotesButton({showNotesList}) {
    return(
        <TouchableHighlight
            onPress={showNotesList}
            underlayColor={"#545511"}
            style={styles.show_notes_list_button}>
            <Text> a </Text>
        </TouchableHighlight>
    )
}

const styles = StyleSheet.create({
    show_notes_list_button: {
        position: "absolute",
        alignItems:"center",
        justifyContent:"center",
        bottom:"50%",
        right: 0,
        backgroundColor: "#b8bb26",
        height: 50,
        width: 50,
        borderBottomLeftRadius: 20,
        borderTopLeftRadius: 20,
        elevation: 10
    }
});
