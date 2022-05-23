import {View, Text, StyleSheet} from "react-native";

export default function EditNoteView() {
    return (
        <View style={styles.edit_note_view}>
            <Text>EDIT NOTES VIEW</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    edit_note_view: {
        flex: 1,
        backgroundColor: "red",
    }
})