import {View, Text, StyleSheet, TextInput, Button, LogBox, TouchableHighlight} from "react-native";
import {useEffect, useState} from "react";

export default function EditNoteView({route, navigation, saveChangedNote}) {
    const [title, setTitle] = useState(route.params.targetNote._title);
    const [body, setBody] = useState(route.params.targetNote._body);
    const [color, setColor] = useState("#fabd2f");
    const [noteColor, setNoteColor] = useState("#fabd2f");
    //TODO ADICIONAR SELECTOR DE CORES


    useEffect(()=>{
        console.log("RECEIVED TODO", route.params)
        if(route.params.targetNote._color != null) {
            setColor(route.params.targetNote._color);
        }

    },[])

    function saveNoteChanges() {
        const noteCoppy = route.params.targetNote;
        noteCoppy._title = title;
        noteCoppy._body = body;
        noteCoppy._color = color;
        console.log("NEW NOTE: \n", noteCoppy);
        route.params.saveChangedNote(noteCoppy);
        navigation.goBack();
    }


    function changeColor(color: string) {
        setColor(color);
    }


    return (
        <View style={[styles.edit_note_view, {backgroundColor: color}]}>
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
            <ColorSelector changeColorMethod={changeColor} />
            <TouchableHighlight
                onPress={saveNoteChanges}
                underlayColor={"#689d6a"}
                style={styles.save_changes_button}>
                <Text style={styles.save_changes_button_text}>Save Changes</Text>
            </TouchableHighlight>
        </View>
    )
}

function ColorSelector({changeColorMethod}) {
    const defaultColors = ["#fabd2f", "#83a598", "#d3869b", "#8ec07c"]

    return (
        <View style={styles.color_selector_main_view}>
            {
                defaultColors.map( color =>
                    <TouchableHighlight
                         style={{marginRight: 10}}
                        onPress={()=> changeColorMethod(color)}
                    >
                        <View
                            style={[styles.color_selector_view, {backgroundColor: color}]}/>
                    </TouchableHighlight>
                )
            }
        </View>
    )
}


const styles = StyleSheet.create({
    color_selector_main_view: {
        flexDirection: "row",
        justifyContent: "flex-start",
        paddingHorizontal: 20,
    },
    color_selector_view: {
        width: 50,
        height: 50,
        backgroundColor: "blue",
        borderWidth: 3,
    },
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
    },
    save_changes_button_text: {
        color: "#ebdbb2",
        fontWeight: "600",
        fontSize: 16,
    },

    //COLOR SELECTOR PART TODO -> CHANGE TO ANOTHER VIEW 



})

LogBox.ignoreLogs([
    'Non-serializable values were found in the navigation state',
]);