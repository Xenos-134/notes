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


const Stack = createStackNavigator();

function App() {
    const [categoriesLoaded, setCategoiesLoaded] = useState(false);

    //===========================================================
    //             INITIALIZATION OF CONTEXT (START)
    //===========================================================
    const repository = RepositoryHook();

    const noteCategoryContext = useContext(CategorySharedContext);
    // @ts-ignore
    noteCategoryContext.addCategory = async function (categoryName) {
        const createdCategory = await repository.addNewCategory(categoryName);
        noteCategoryContext.categoryList.push(createdCategory);
        console.log("Adding category", noteCategoryContext.categoryList);
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
        //console.log("LOADED CATEGORIES: ", loadedCategories);
    }

    // @ts-ignore
    noteCategoryContext.addNoteToCategory = async function(note: NoteClass, category: CategoryClass) {
        repository.addNoteToCategory(note, category);
    }

    noteCategoryContext.calculateNewPosition = async function (note) {
        const notes = await repository.getAllNotes();

        const loadedCategories = await repository.loadCategories();
        if (loadedCategories && loadedCategories.length == 0) return []
        const targetCategories = loadedCategories.filter(elm => elm.notesList.includes(note._id));



        Promise.all(
            targetCategories.map( async elm=> {
                var leftTopCorner = {x: Infinity, y: Infinity};
                var rightBottomCorner = {x: -Infinity, y: Infinity};


                console.log("TARGET: ", elm._name)
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

                })
                elm.x = leftTopCorner.x;
                elm.y = leftTopCorner.y;
                await repository.changeCategoryPosition(elm);
            })
        )

        return await repository.loadCategories();
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
                <Stack.Screen name="Loading" component={LoadingView} />
                <Stack.Screen name="Edit Note" component={EditNoteView} />
                <Stack.Screen name="Notes List" component={NotesListView} options={{cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,}} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}

export default App;