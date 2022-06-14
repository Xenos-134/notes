import {Button, FlatList, LogBox, StyleSheet, Text, View} from 'react-native';
import Animated, {
    runOnJS,
    useAnimatedGestureHandler,
    useDerivedValue,
    useSharedValue,
    withRepeat,
    withTiming
} from "react-native-reanimated";
import {GestureHandlerRootView, PanGestureHandler, PanGestureHandlerGestureEvent} from "react-native-gesture-handler";
import {useContext, useEffect, useReducer, useRef, useState} from "react";
import { Dimensions } from 'react-native';
import {useIsFocused} from "@react-navigation/native";


//CUSTOM COMPONENTS IMPORT
import TodoSticker from "./custom_components/TodoStickerView";
import NewNoteButton from "./custom_components/Buttons/NewNoteButton";
import ScaleUpButton from "./custom_components/Buttons/ScaleUpButton";
import ScaleDownButton from "./custom_components/Buttons/ScaleDownButton";
import {NoteClass} from "./custom_classes/NoteClass";
import {RepositoryHook} from "./BD/RepositoryHook";
import ShowAllNotesButton from "./custom_components/Buttons/NoteListButton";
import {CategoryClass} from "./custom_classes/CategoryClass";
import NoteClassView from "./custom_components/NoteClassView";
import {CategorySharedContext} from "./shared_contexts/CategorySharedContext";
import {ViewDimensionsContext} from "./shared_contexts/ViewDimensionContext";

type ContextType = {
    translateX: number;
    translateY: number;
};

const SCREEN_DIMENSION = Dimensions.get("window");

// @ts-ignore
export default function MainScreen({navigation}) {
    //===========================================================
    //             TESTING NOTES CATEGORY
    //===========================================================
    const [categories, setCategories] = useState([]);
    const [loadedCategories, setLoadedCategories] = useState([]);
    const categoryContext = useContext(CategorySharedContext);

    useEffect(()=>{
        const category1 = createNewCategory("Test Category 1");
        categorySharedContext.updateCategoryListMainScreen = loadCategoriesFromRepository;
        categorySharedContext.updateCategoryListMainScreen();
        category1.setPosition(100, -350);
        pushCategory(category1);
        viewDimensionsContext.scaleValue = scaleValue.value;

    },[])

    function createNewCategory(name: string) {
        const category = new CategoryClass(name);
        //console.log("Category", category);
        return category;
    }

    function pushCategory(category : CategoryClass) {
        setCategories( categories => [...categories, category]);
    }

    async function loadCategoriesFromRepository() {
        const loaded_categories =  await repository.loadCategories();
        const new_filtered_cats = loaded_categories.filter(e=> e.notesList.length != 0);
        console.log("NEW CATEGORY LIST: ", loaded_categories);
        // @ts-ignore
        setLoadedCategories([...new_filtered_cats]);

    }


    function addNoteToCategory(note : NoteClass) {
    }

    //===========================================================
    //              SHARED VALUES
    //===========================================================
    const transformValueX = useSharedValue(0);
    const transformValueY = useSharedValue(0);
    const scaleValue = useSharedValue(0.5);

    //===========================================================
    //              SHARED CONTEXT
    //===========================================================
    const viewDimensionsContext = useContext(ViewDimensionsContext);
    const categorySharedContext = useContext(CategorySharedContext);


    //===========================================================
    //              LOCAL STATES
    //===========================================================
    const [notesList, setNotes] = useState([]);
    const [currentFocusPoint, setCurrentFocus] = useState({x:0, y:0});
    const [firstRender, setFirstRender] = useState(true);
    const repository = RepositoryHook();

    //===========================================================
    //    TRYING FUNCTION TO NAVIGATE TO CERTAIN PLACE
    //===========================================================
    function navigateToPosition(x:number, y:number) {
        transformValueX.value = (x - SCREEN_DIMENSION.width*0.2);
        transformValueY.value = (y - SCREEN_DIMENSION.height*0.5);
    }

    //===========================================================
    //              USE EFFECT SECTION
    //===========================================================
    useEffect(()=>{
        loadAllNotes();
    },[])

    useEffect(()=>{ //TODO FAZER COM QUE NAVEGAMOS PARA O PRIMEIRO ELEMENTO DA LISTA
        if (notesList.length == 0 || !firstRender) return;
        transformValueY.value-=1500;
        transformValueX.value-=150;
        setFirstRender(false);
    },[notesList])

    async function loadAllNotes() {
        const notes = await repository.getAllNotes();
        setNotes(notes);
    }

    //===========================================================
    //  !!!(ATENTION) THIS PART CAUSES DELAY
    //===========================================================
    /*
    useDerivedValue(() => {
        runOnJS(updateCurrentFocusPosition)(transformValueX.value, transformValueY.value);
    },[transformValueX.value, transformValueY.value]);
*/
    function updateCurrentFocusPosition(newX, newY) {
        setCurrentFocus({x:-newX, y: -newY});
    }


    const panGestureEvent = useAnimatedGestureHandler<
        PanGestureHandlerGestureEvent, ContextType>({
        onStart: (event, context) => {
            context.translateY = transformValueY.value;
            context.translateX = transformValueX.value;
        },
        onActive: (event, context) => {
            transformValueY.value = -event.translationY * (1/scaleValue.value) + context.translateY;
            transformValueX.value = -event.translationX * (1/scaleValue.value)  + context.translateX;
        },
        onEnd: () => {

        },
    });


    //===========================================================
    //              LOCAL METHODS
    //===========================================================
    function addNewNote() {
        const noteListCoppy = notesList;
        const newNote = new NoteClass("TEST TITLE", "LOREM IPSUM BODY");

        newNote._x = -currentFocusPoint.x;
        newNote._y = -currentFocusPoint.y;
        repository.add(newNote);

        const newt = Object.assign({}, newNote);
        newt._x = 0;
        newt._y = 0;
        noteListCoppy.push(newt);
        setNotes([...noteListCoppy]);
    }

    function scaleUp() {
        scaleValue.value+=0.2;
        viewDimensionsContext.scaleValue = scaleValue.value;
        console.log(viewDimensionsContext.scaleValue, scaleValue.value);

    }

    function scaleDown() {
        scaleValue.value-=0.2;
        viewDimensionsContext.scaleValue = scaleValue.value;
        console.log(viewDimensionsContext.scaleValue, scaleValue.value);
    }

    function editNote(noteId: number) { //TODO PASSAR NoteClass por inteiro para o TodoStickerView e depois devolver aqui
        const targetNote = notesList.find(elm => elm._id == noteId)
        navigation.navigate("Edit Note", {
            targetNote,
            loadedCategories,
            saveChangedNote,
            deleteNote,
            addNoteToCategory,
        });
    }

    //TODO PASSAR ESTE METODO
    function saveChangedNote(changedNote: NoteClass) {
        //console.log("TRYING CHANGE NOTE:\n");
        const noteListCopy = notesList;
        for(var i = 0; i < noteListCopy.length; i++) {
            if(noteListCopy[i]._id === changedNote._id) {
                noteListCopy[i] = changedNote;
                break;
            }
        }

        //console.log("NEW NOTES LIST:\n", noteListCopy);
        setNotes([...noteListCopy]);
        repository.updateNotes(noteListCopy);
    }


    function navigateNotesList() {
        navigation.navigate("Notes List", {
            notesList,
            editNote,
            navigateToPosition,
        });
    }


    function deleteNote(note: NoteClass) {
        const filtered_notes = notesList.filter(elm => elm._id != note._id);
        repository.remove(note);
        setNotes(filtered_notes);
    }

    async function reaclculateNotesView(note : NoteClass) {
        setTimeout(async function () {
            const loadedCategories = await categoryContext.calculateNewPosition(note);
            setLoadedCategories(loadedCategories);
        }, 200);

    }

    return (
        <GestureHandlerRootView style={{ flex: 1}}>
            <PanGestureHandler onGestureEvent={panGestureEvent}>
                <Animated.View style={styles.animated_view}>
                    <View style={styles.container}>
                        {/* CATEGORIES LIST*/}
                        {
                            loadedCategories.map(category => (
                                <NoteClassView
                                    key={category._name}
                                    referentialX={transformValueX}
                                    referentialY={transformValueY}
                                    scale={scaleValue}
                                    category={category}
                                    numOfChilds={category.notesList.length}
                                />
                            ))
                        }
                        {/* NOTES LIST*/}
                        {
                            notesList.map(elm => (
                                <TodoSticker
                                    key={elm._id}
                                    coordenatesX={transformValueX} //Movement of all referential
                                    coordenatesY={transformValueY}
                                    y_coord={elm._y}   //Initial Coords
                                    x_coord={elm._x}
                                    scale={scaleValue}
                                    noteId={elm._id}
                                    editNoteMethod={editNote}
                                    title={elm._title}
                                    body={elm._body}
                                    color={elm._color?elm._color:"#fabd2f"}
                                    note={elm}
                                    reaclculateNotesView={reaclculateNotesView}
                                />
                            ))
                        }
                    </View>

                    <ScaleUpButton func={scaleUp}/>
                    <ScaleDownButton func={scaleDown}/>
                    <ShowAllNotesButton showNotesList={navigateNotesList}/>
                    <NewNoteButton func={addNewNote}/>
                </Animated.View>
            </PanGestureHandler>
        </GestureHandlerRootView>
    );
}
//<NewNoteButton func={addNewNote}/>

//TODO FAZER COM QUE A ALTURA FIQUE MAIS ALTERAVEL CONSOANTE QUANTIDADE DE TEXTO
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ebdbb2',
    },
    animated_view: {
        flex: 1,
    },
    swipe_from_below_view: {
        color: "red",
        position: "absolute",
        height: 600,
        width: 500,
        bottom: 10
    },
});

LogBox.ignoreLogs([
    'ViewPropTypes will be removed from React Native. Migrate to ViewPropTypes exported from \'deprecated-react-native-prop-types\'.',
]);
