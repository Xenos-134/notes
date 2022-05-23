import {View, Text, StyleSheet, TextInput} from "react-native";
import {useEffect, useState} from "react";

export default function EditNoteView({route, navigation}) {
    const [title, setTitle] = useState("Lorem Ipsum")
    const [body, setBody] = useState("Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam quis gravida purus. Quisque semper venenatis condimentum. Praesent pretium purus lacus, sed volutpat lectus tempus eu. ")
    const [noteColor, setNoteColor] = useState("#fabd2f");
    //TODO ADICIONAR SELECTOR DE CORES

    useEffect(()=>{
        console.log("RECEIVED TODO", route.params)
    },[])

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

})