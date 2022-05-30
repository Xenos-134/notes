import {Text, View, StyleSheet, ScrollView, TouchableHighlight, Button} from "react-native";
import {useEffect, useRef, useState} from "react";
import Icon from 'react-native-vector-icons/MaterialIcons';


import NoteListItem from "./custom_views/NoteListItem";
import Animated, {
    runOnJS,
    useAnimatedStyle,
    useDerivedValue,
    useSharedValue,
    withRepeat,
    withSpring,
    withTiming
} from "react-native-reanimated";
import {Swipeable} from "react-native-gesture-handler";

export default function NotesListView({navigation, route}) {
    const [n, setN] = useState([]);
    const [deletedElement, setDeletedElement] = useState(null)

    const a = useRef([]);

    useEffect(()=>{
        console.log("RECEIVED PARAMS:\n", route.params.notesList);
        setN(route.params.notesList);
    },[])

    function deleteItem(item) {
        const nCoppy = n.filter(elm => elm.title != item.title);
        setN([...nCoppy]);
    }

    function closeAllElm(note) {
        a.current[note.title].close();
    }

    function deleteNote(note) {
        closeAllElm(note);
        const notesCoppy = n.filter(elm => elm.title != note.title);
        setN([...notesCoppy]);
    }

    function editNote(note) {
        route.params.editNote(note._id)
    }

    function findNote(note) {
        route.params.navigateToPosition(note._x, note._y);
        navigation.goBack();

    }

    return (
        <View style={styles.notes_list_main_view}>
            <ScrollView
                style={{paddingTop: 40, width: "100%"}}
                
            >
                <View style={styles.notes_list_header_view}>
                    <Text style={styles.notes_list_header_text}>
                        Notes
                    </Text>
                </View>
                {
                    n.map(note => (
                        <Swipeable id={note._id}
                                   ref = {ref => {
                                       a.current[note.title] = ref
                                   }}

                                   renderRightActions={()=>Box(deleteNote, editNote, findNote, note)}>
                            <NoteListItem note={note}/>
                        </Swipeable>
                    ))
                }
            </ScrollView>
        </View>
    )
}

function Box(deleteMethod, editNote, findNote, note) {
    return(
        <View style={styles.side_panel_view}>
            <TouchableHighlight
                style={styles.edit_item_view}
                onPress={()=>editNote(note)}>
                <Icon name="edit" size={30} color="#900" />
            </TouchableHighlight>
            <TouchableHighlight
                style={styles.locate_item_view}
                onPress={()=>findNote(note)}>
                <Icon name="find-in-page" size={30} color="#900" />
            </TouchableHighlight>
            <TouchableHighlight
                style={styles.delete_item_view}
                onPress={()=>deleteMethod(note)}>
                <Icon name="delete" size={30} color="#900" />
            </TouchableHighlight>

        </View>
    )
}


const styles = StyleSheet.create({
    notes_list_main_view: {
        flex: 1,
        width: "100%",
        backgroundColor: "#d5c4a1",
        alignItems:"center",
    },
    side_panel_view: {
        alignItems:"center",

    },
    delete_item_view: {
        backgroundColor:"#cc241d",
        width: 50,
        height: 50,
        alignItems:"center",
        justifyContent:"center",
    },
    edit_item_view: {
        backgroundColor:"#fabd2f",
        width: 50,
        height: 50,
        alignItems:"center",
        justifyContent:"center",
    },
    locate_item_view: {
        backgroundColor:"#b8bb26",
        width: 50,
        height: 50,
        alignItems:"center",
        justifyContent:"center",
    },
    notes_list_header_view: {
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 20
    },
    notes_list_header_text: {
        fontSize: 25,
        fontWeight: "600",
        color: "#282828",
    }
})
