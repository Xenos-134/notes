import {Button, StyleSheet, Text, View} from 'react-native';
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


//CUSTOM COMPONENTS IMPORT
import TodoSticker from "./custom_components/TodoStickerView";
import NewNoteButton from "./custom_components/Buttons/NewNoteButton";
import ScaleUpButton from "./custom_components/Buttons/ScaleUpButton";
import ScaleDownButton from "./custom_components/Buttons/ScaleDownButton";
import {NoteClass} from "./custom_classes/NoteClass";
import {RepositoryHook} from "./BD/RepositoryHook";

type ContextType = {
    translateX: number;
    translateY: number;
};

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
    const repository = RepositoryHook();


    //===========================================================
    //              USE EFFECT SECTION
    //===========================================================
    useEffect(()=>{
        loadAllNotes();
    },[])

    async function loadAllNotes() {
        await repository.loadNotesList();
        const notes = await repository.getAllNotes();
        setNotes(notes);
    }


    useDerivedValue(() => {
        runOnJS(updateCurrentFocusPosition)(transformValueX.value, transformValueY.value);
    },[transformValueX.value, transformValueY.value]);

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
        //console.log("CREATED NEW ITEM", newNote);


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

    function editNote(noteId: number) {
        console.log("WE ARE TRING TO EDIT NODE", noteId);
        navigation.navigate("Edit Note");
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
                                />
                            ))
                        }
                    </View>
                    <View style={{
                        position:"absolute",
                        top:currentFocusPoint.y,
                        left:currentFocusPoint.x,
                        backgroundColor:"green", width: 50, height:50
                    }}>

                        <Text>ORIGIN</Text>
                    </View>
                    <ScaleUpButton func={scaleUp}/>
                    <ScaleDownButton func={scaleDown}/>
                    <NewNoteButton func={addNewNote}/>
                </Animated.View>
            </PanGestureHandler>
        </GestureHandlerRootView>
    );
}


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
