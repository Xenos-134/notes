import * as React from 'react';
import {useContext, useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {CardStyleInterpolators, createStackNavigator} from '@react-navigation/stack';


//CUSTOM COMPONENTS IMPORTS
import MainScreen from "./MainScreen";
import EditNoteView from "./custom_components/EditNoteView";
import NotesListView from "./custom_components/NotesListView";
import LoadingView from "./custom_components/LoadingView";
import {CategorySharedContext} from "./shared_contexts/CategorySharedContext";
import {CategoryClass} from "./custom_classes/CategoryClass";
import {RepositoryHook} from "./BD/RepositoryHook";
import {NoteClass} from "./custom_classes/NoteClass";
import {NoteSharedContext} from "./shared_contexts/NotesSharedContext";
import {ViewDimensionsContext} from "./shared_contexts/ViewDimensionContext";
import EditCategoryView from "./custom_components/EditCategoryView";
import {hasColorProps} from "react-native-reanimated/lib/types/lib/reanimated2/hook/utils";


const Stack = createStackNavigator();

function App() {
    const [categoriesLoaded, setCategoiesLoaded] = useState(false);
    const repository = RepositoryHook();


//===========================================================
//             INITIALIZATION OF CONTEXT (START)
//===========================================================
    const noteContext = useContext(NoteSharedContext);
    const noteCategoryContext = useContext(CategorySharedContext);
    const viewDimensionsContext = useContext(ViewDimensionsContext);

    //===========================================================
    //              Note Category Context
    //===========================================================

    // @ts-ignore
    noteCategoryContext.addCategory = async function (categoryName) {
        const createdCategory = await repository.addNewCategory(categoryName);
        noteCategoryContext.categoryList.push(createdCategory);
    }

    // @ts-ignorez
    noteCategoryContext.removeCategory = function (category: CategoryClass) {
        noteCategoryContext.categoryList = noteCategoryContext.categoryList.filter( ({name}) => {
            name != category.name
        })
    }

    noteCategoryContext.loadCategoriesFromRepository = async function () {
        const loadedCategories = await repository.loadCategories();
        // @ts-ignore
        noteCategoryContext.categoryList = loadedCategories;
    }

    // @ts-ignore
    noteCategoryContext.addNoteToCategory = async function(note: NoteClass, category: CategoryClass) {
        await repository.addNoteToCategory(note, category);
    }


    //CALCULATES MOST TOP AND MOST BOT POSITION OF THE NOTES OF SAME CATEGORY
    // @ts-ignore
    noteCategoryContext.calculateNewPosition = async function (note) {
        const notes = await repository.getAllNotes();

        const loadedCategories = await repository.loadCategories();
        if (loadedCategories && loadedCategories.length == 0) return []
        const targetCategories = loadedCategories.filter(elm => elm.notesList.includes(note._id));



        Promise.all(
            targetCategories.map( async elm=> {
                var leftTopCorner = {x: Infinity, y: Infinity};
                var rightBottomCorner = {x: -Infinity, y: -Infinity};


                elm.notesList.forEach( n => {
                    const fn = notes.find(tn => tn._id == n);
                    elm.x = fn._x;
                    elm.y = fn._y;

                    if(fn._x < leftTopCorner.x) {
                        leftTopCorner.x = fn._x;
                    }

                    if(fn._y < leftTopCorner.y) {
                        leftTopCorner.y = fn._y;
                    }
                    if(fn._x > rightBottomCorner.x) {
                        rightBottomCorner.x = fn._x;
                    }
                    if(fn._y > rightBottomCorner.y) {
                        rightBottomCorner.y = fn._y;
                    }

                });
                elm.x = leftTopCorner.x - 20; //ADD SMALL VALUE TO NOT MAKE SMALL MARGIN BETWEEN NOTE AND CAT BORDER
                elm.y = leftTopCorner.y - 80;

                elm.bx = rightBottomCorner.x + 120 * 1/viewDimensionsContext.scaleValue;
                elm.by = rightBottomCorner.y + 120 * 1/viewDimensionsContext.scaleValue;
                await repository.changeCategoryPosition(elm);
            })
        )
        return await repository.loadCategories();
    }

    noteCategoryContext.getAllCategories = async function () : Promise<Array<CategoryClass>>{
        const categories = await repository.loadCategories();
        return categories;
    }

    // @ts-ignore
    noteCategoryContext.changeCategory = async function(category: CategoryClass) {
        repository.changeCategory(category);
    }

    //===========================================================
    //              Note  Context
    //===========================================================
    // @ts-ignore
    noteContext.getNote = async function(noteId: string) : Promise<NoteClass>{
       console.log("TRYING TO GET NOTE: ", noteId);
       const note = await  repository.getNoteById(noteId);
       return note;
    }

    // @ts-ignore
    noteContext.addCategoryToNote = async function(noteId: string, cat: CategoryClass) {
        repository.addCategoryToNote(noteId, cat);
    }


    // @ts-ignore
    noteContext.loadNoteCategories = async function(noteId: string) {
        const note = await repository.getNoteById(noteId);
        console.log("SSSSSSSSSSSSSSSSSSSS",note)
        if(note._categories == null) return [];
        return note._categories;
    }

    // @ts-ignore
    noteContext.removeCategoryFromNote = async function(noteId: string, cat: CategoryClass) {
        console.log("WILL REMOVE FROM CAT: ", cat._name)
        repository.removeCategoryFromNote(noteId, cat);
    }

    noteContext.getAllNotes = async function() : Promise<Array<NoteClass>> {
        const notes = await repository.getAllNotes();
        return notes;
    }

    //===========================================================
    //              View Dimensions Context
    //===========================================================
    viewDimensionsContext.getScaleValue = function () {
        console.log("CURRENT SCALE VALUE: ", viewDimensionsContext.scaleValue);
    }

//===========================================================
//             INITIALIZATION OF CONTEXT (END)
//===========================================================


    useEffect(()=>{
        if(categoriesLoaded) return;
        noteCategoryContext.loadCategoriesFromRepository();
        setCategoiesLoaded(false);
    },[categoriesLoaded])


    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{headerShown: false}}>
                <Stack.Screen name="MainScreen" component={MainScreen} />
                <Stack.Screen name="Edit Category" component={EditCategoryView}/>
                <Stack.Screen name="Edit Note" component={EditNoteView} />
                <Stack.Screen name="Notes List" component={NotesListView} options={{cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,}} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}

export default App;