import {Text, View, StyleSheet, ScrollView, TouchableHighlight, Button, SectionList, StatusBar} from "react-native";
import {useContext, useEffect, useRef, useState} from "react";
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
import NewCategoryFormView from "./forms/NewCategoryForm";
import {RepositoryHook} from "../BD/RepositoryHook";
import {CategorySharedContext} from "../shared_contexts/CategorySharedContext";
import {NoteSharedContext} from "../shared_contexts/NotesSharedContext";

export default function NotesListView({navigation, route}) {
    //===========================================================
    //            States Declaration
    //===========================================================
    const [n, setN] = useState([]);
    const [deletedElement, setDeletedElement] = useState(null)
    const [visibleNewCategory, setVisibleNewCategory] = useState(false);
    const a = useRef([]);
    const [notesList, setNotesList] = useState([]);


    //===========================================================
    //            Custom Hooks and Context
    //===========================================================
    const repository = RepositoryHook();
    const categoryContext = useContext(CategorySharedContext);
    const noteContext = useContext(NoteSharedContext);

    useEffect(()=>{
        //console.log("RECEIVED PARAMS:\n", route.params.notesList);
        generateNotesList();
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

    function showNewCategotryForm() {
        setVisibleNewCategory(!visibleNewCategory);
    }

    function hideCategotryForm() {
        setVisibleNewCategory(false);
    }

    function createNewCategory(categoryName) {
        console.log("CREATINGNEW CATEGORY:", categoryName);
        //repository.addNewCategory(categoryName);
        categoryContext.addCategory(categoryName);
        hideCategotryForm();
    }


    const Item = ({note}) => (
        <Swipeable key={note._id}
                   ref = {ref => {
                       a.current[note.title] = ref
                   }}
                   renderRightActions={()=>Box(deleteNote, editNote, findNote, note)}>
            <NoteListItem
                key={note._id}
                note={note}/>
        </Swipeable>
    );



    //CURRENTLY REFORMATTING CODE TO ACCESS NOTES AND CATGORIES LIST FROM CONTEXTS
    // WILL USE THIS METHOD LATER
    async function generateNotesList() {
        const notes = await noteContext.getAllNotes();
        var non_category_notes = notes;
        const categories = await categoryContext.getAllCategories();
        console.log('======================LOADED NOTES ==================');
        console.log(notes);
        console.log('=====================LOADED  CATEGORIES==================');
        console.log(categories);
        console.log('============================================');

        var noteCategoryList = []

        categories.forEach(c => {
            console.log("C_NAME: ", c._name, ">>>>");
            var notesList = [];
            c.notesList.forEach(n => {
                const note = notes.find(elm => elm._id == n);
                non_category_notes = non_category_notes.filter(e => e._id != n);
                if(notesList.some(elm => elm._id == n)) return;
                notesList.push(note);
            })
            noteCategoryList.push({title: c._name, data: notesList});
        })
        //console.log("CATEGORY NOTES ARRAY: ", noteCategoryList);
        console.log("NON CATEGORY NOTES",non_category_notes);
        //Adding notes withou category
        noteCategoryList.push({title: "Without Category", data: non_category_notes});

        setNotesList(noteCategoryList);
    }

    return (
        <View style={styles.notes_list_main_view}>
            {
                visibleNewCategory && <NewCategoryFormView
                    createNewCategory={createNewCategory}/>
            }
            <View
                style={{paddingTop: 40, width: "100%"}}>
                <View style={styles.notes_list_header_view}>
                    <Text style={styles.notes_list_header_text}>
                        Notes
                    </Text>
                    <NewCategryButton method={showNewCategotryForm}/>
                </View>
                <SectionList
                    stickySectionHeadersEnabled
                    sections={notesList}
                    keyExtractor={(item, index) => item + index}
                    renderItem={({ item }) => <Item note={item} />}
                    renderSectionHeader={({ section: { title } }) => (
                        <Separator text={title}/>
                    )}
                    ListFooterComponent={()=> <Footer/>}
                />
            </View>
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


const Separator = ({ text }) => (
    <View style={styles.flatlist_separator}>
        <Text style={{
            color: "#ebdbb2",
            fontSize: 18,
            fontWeight: "700",
        }}>{text}</Text>
    </View>
);

function NewCategryButton({method}) {
    return (
        <TouchableHighlight
            onPress={method}
            style={styles.new_category_button}
        >
            <View>
                <Text style={styles.new_category_button_text}>New Category</Text>
            </View>
        </TouchableHighlight>
    )
}

function Footer() {
    return(
        <View
            style={{
                marginBottom: 100,
            }}
        />
    )
}


const styles = StyleSheet.create({
    flatlist_separator: {
        backgroundColor: "#504945",
        height: 50,
        alignItems: 'center',
        justifyContent: 'center'
    },
    new_category_button: {
        backgroundColor: "#689d6a",
        width: 120,
        height: 40,
        alignItems:"center",
        justifyContent: "center",
        elevation: 10,
        borderRadius: 5,
    },
    new_category_button_text: {
        color: "#d5c4a1",
        fontSize: 14,
        fontWeight: '500'
    },

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
        justifyContent: "space-around",
        marginBottom: 20,
        flexDirection: "row"
    },
    notes_list_header_text: {
        fontSize: 25,
        fontWeight: "600",
        color: "#282828",
    },



    container: {
        flex: 1,
        paddingTop: StatusBar.currentHeight,
        marginHorizontal: 16
    },
    item: {
        backgroundColor: "#f9c2ff",
        padding: 20,
        marginVertical: 8
    },
    header: {
        fontSize: 32,
        backgroundColor: "#fff"
    },
    title: {
        fontSize: 24
    }
})
