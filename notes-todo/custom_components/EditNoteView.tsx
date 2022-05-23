import {View, Text, StyleSheet, TextInput, Button, LogBox, TouchableHighlight} from "react-native";
import {useEffect, useState} from "react";

export default function EditNoteView({route, navigation, saveChangedNote}) {
    const [title, setTitle] = useState(route.params.targetNote._title);
    const [body, setBody] = useState(route.params.targetNote._body);
    const [noteColor, setNoteColor] = useState("#fabd2f");
    //TODO ADICIONAR SELECTOR DE CORES


    useEffect(()=>{
        console.log("RECEIVED TODO", route.params)
    },[])

    function saveNoteChanges() {
        const noteCoppy = route.params.targetNote;
        noteCoppy._title = title;
        noteCoppy._body = body;
        //console.log("NEW NOTE: \n", noteCoppy);
        route.params.saveChangedNote(noteCoppy);
        navigation.goBack();
    }

    return (
        <View style={[styles.edit_note_view, {backgroundColor: noteColor}]}>
            <View style={styles.edit_note_text_view}>
                <TextInput
                    style={styles.edit_note_title_text_input}
                    value={title}
                    onChangeText={setTitle}
                />
                <TextInput
                    style={styles.edit_note_body_text_input}
                    multiline={true}
                    value={body}
                    onChangeText={setBody}
                />
            </View>

            <TouchableHighlight
                onPress={saveNoteChanges}
                underlayColor={"#689d6a"}
                style={styles.save_changes_button}>

                <Text>Save Changes</Text>
            </TouchableHighlight>
        </View>
    )
}

const styles = StyleSheet.create({
    edit_note_view: {
        flex: 1,
        justifyContent:"flex-start",
    },
    edit_note_text_view: {
        marginTop: "15%",
        marginHorizontal: '5%',
    },
    edit_note_title_text: {
        color: "#1d2021",
        fontWeight: "600",
        fontSize:17,
    },
    edit_note_title_text_input: {
        color: "#1d2021",
        fontWeight: "600",
        fontSize:17,
    },
    edit_note_body_text_input: {
        color: "#1d2021",
        fontWeight: "600",
        fontSize:17,
        marginTop: "7%",
    },
    save_changes_button: {
        position: "absolute",
        alignItems:"center",
        justifyContent:"center",
        width: "40%",
        height: "7%",
        bottom: "5%",
        backgroundColor: "#689d6a",
        alignSelf: "center",
        borderRadius: 12
    }
})

LogBox.ignoreLogs([
    'Non-serializable values were found in the navigation state',
]);