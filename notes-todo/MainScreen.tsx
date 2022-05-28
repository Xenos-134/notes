import {Button, LogBox, StyleSheet, Text, View} from 'react-native';
import Animated, {
    runOnJS,
    useAnimatedGestureHandler,
    useDerivedValue,
    useSharedValue,
    withRepeat,
    withTiming
} from "react-native-reanimated";
import {GestureHandlerRootView, PanGestureHandler, PanGestureHandlerGestureEvent} from "react-native-gesture-handler";
import {useEffect, useRef, useState} from "react";
import { Dimensions } from 'react-native';


//CUSTOM COMPONENTS IMPORT
import TodoSticker from "./custom_components/TodoStickerView";
import NewNoteButton from "./custom_components/Buttons/NewNoteButton";
import ScaleUpButton from "./custom_components/Buttons/ScaleUpButton";
import ScaleDownButton from "./custom_components/Buttons/ScaleDownButton";
import {NoteClass} from "./custom_classes/NoteClass";
import {RepositoryHook} from "./BD/RepositoryHook";
import ShowAllNotesButton from "./custom_components/Buttons/NoteListButton";

type ContextType = {
    translateX: number;
    translateY: number;
};

const SCREEN_DIMENSION = Dimensions.get("window");

export default function MainScreen({navigation}) {
    //===========================================================
    //              SHARED VALUES
    //===========================================================
    const transformValueX = useSharedValue(0);
    const transformValueY = useSharedValue(0);
    const scaleValue = useSharedValue(0.5);


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
        console.log("NAVIGATING TO ANOTHER POSITION")

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
        await repository.loadNotesList();
        const notes = await repository.getAllNotes();
        console.log("NOTES: ", notes);
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
        //console.log(-currentFocusPoint.x, -currentFocusPoint.y);
        const newNote = new NoteClass("TEST TITLE", "LOREM IPSUM BODY");

        newNote._x = -currentFocusPoint.x;
        newNote._y = -currentFocusPoint.y;
        repository.add(newNote);

        const newt = Object.assign({}, newNote);
        newt._x = 0;
        newt._y = 0;
        //console.log(newt);
        noteListCoppy.push(newt);
        setNotes([...noteListCoppy]);
    }

    function scaleUp() {
        scaleValue.value+=0.2;
    }

    function scaleDown() {
        scaleValue.value-=0.2;
    }

    function editNote(noteId: number) { //TODO PASSAR NoteClass por inteiro para o TodoStickerView e depois devolver aqui
        const targetNote = notesList.find(elm => elm._id == noteId)
        navigation.navigate("Edit Note", {
            targetNote,
            saveChangedNote,
            deleteNote,
        });
    }

    //TODO PASSAR ESTE METODO
    function saveChangedNote(changedNote: NoteClass) {
        console.log("TRYING CHANGE NOTE:\n");
        const noteListCopy = notesList;
        for(var i = 0; i < noteListCopy.length; i++) {
            if(noteListCopy[i]._id === changedNote._id) {
                noteListCopy[i] = changedNote;
                break;
            }
        }

        console.log("NEW NOTES LIST:\n", noteListCopy);
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

    return (
        <GestureHandlerRootView style={{ flex: 1}}>
            <PanGestureHandler onGestureEvent={panGestureEvent}>
                <Animated.View style={styles.animated_view}>
                    <View style={styles.container}>
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


