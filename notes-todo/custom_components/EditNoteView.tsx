import {View, Text, StyleSheet, TextInput, Button, LogBox, TouchableHighlight} from "react-native";
import {useContext, useEffect, useState} from "react";
import CategoryBadge from "./badges/CategoryBadge";
import AddBadge from "./badges/AddBadge";
import BadgeListView from "./badges/BadgeListView";
import {CategorySharedContext} from "../shared_contexts/CategorySharedContext";

export default function EditNoteView({route, navigation}) {
    const [title, setTitle] = useState(route.params.targetNote._title);
    const [body, setBody] = useState(route.params.targetNote._body);
    const [color, setColor] = useState("#fabd2f");
    const [openCategorySelector, setOCS] = useState(false);

    //TODO ADICIONAR SELECTOR DE CORES RADIAL
    //===========================================================
    //            CONTEXTS
    //===========================================================
    const categoryContext = useContext(CategorySharedContext);


    useEffect(()=>{
        console.log("RECEIVED TODO", route.params.loadedCategories)


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

    function deleteNote() {
        route.params.deleteNote(route.params.targetNote);
        navigation.goBack();
    }


    function changeColor(color: string) {
        setColor(color);
    }

    function addCategory() {
        route.params.addNoteToCategory(route.params.targetNote);
    }

    function openCategoryList() {
        categoryContext.calculateNewPosition(route.params.targetNote);
        setOCS(!openCategorySelector);
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
                <View style={styles.badges_view}>
                    <CategoryBadge text={"Test Bage"}/>
                    <AddBadge openCategoryList={openCategoryList}/>
                </View>
                {
                    openCategorySelector && <BadgeListView
                        note={route.params.targetNote}
                        categoriesList={categoryContext.categoryList}/>
                }
            </View>
            <ColorSelector changeColorMethod={changeColor} />
            <View style={styles.buttons_view}>
                <TouchableHighlight
                    onPress={saveNoteChanges}
                    underlayColor={"#689d6a"}
                    style={styles.save_changes_button}>
                    <Text style={styles.save_changes_button_text}>Save Changes</Text>
                </TouchableHighlight>

                <TouchableHighlight
                    onPress={deleteNote}
                    underlayColor={"#689d6a"}
                    style={styles.delete_button}>
                    <Text style={styles.save_changes_button_text}>Delete</Text>
                </TouchableHighlight>
            </View>
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
        position: "absolute",
        bottom: 120,
    },
    color_selector_view: {
        width: 50,
        height: 50,
        backgroundColor: "blue",
        borderWidth: 2,
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
        marginBottom: "7%"
    },
    save_changes_button: {
        alignItems:"center",
        justifyContent:"center",
        width: "40%",
        height: 60,
        backgroundColor: "#689d6a",
        alignSelf: "center",
        borderRadius: 12,
        elevation: 10
    },
    save_changes_button_text: {
        color: "#ebdbb2",
        fontWeight: "600",
        fontSize: 16,
    },
    delete_button: {
        alignItems:"center",
        justifyContent:"center",
        width: "40%",
        height: 60,
        backgroundColor: "#fb4934",
        alignSelf: "center",
        borderRadius: 12,
        elevation: 10
    },
    buttons_view: {
        width: "100%",
        flexDirection: "row",
        justifyContent: "space-evenly",
        position: "absolute",
        bottom: "3%",
    },
    badges_view: {
        flexDirection: "row",
    }
})

LogBox.ignoreLogs([
    'Non-serializable values were found in the navigation state',
]);