import {useEffect, useRef, useState} from "react";
import {NoteClass} from "../custom_classes/NoteClass";
import AsyncStorage from '@react-native-async-storage/async-storage';
import {CategoryClass} from "../custom_classes/CategoryClass";


const noteStorageKey = "@notesList";
const CATEGORY_KEYS = "@categoriesKeysList";


export function RepositoryHook() {
    const [firstRun, setFirstRun] = useState(true);




    useEffect(()=>{
        //AsyncStorage.clear();
    },[])


    async function add(item: NoteClass) {
        const loadedNotes = await getAllNotes();
        console.log(loadedNotes)
        if(loadedNotes == null || loadedNotes.length == 0) {
            //setItemArray([item]);
            await AsyncStorage.setItem(noteStorageKey, JSON.stringify([item]));
            console.log("XXX")

            return;
        }
        const parsedList = await JSON.parse(loadedNotes);
        parsedList.push(item);
        AsyncStorage.setItem(noteStorageKey, JSON.stringify(parsedList));
        console.log("SUCESS")
    };


    function get(): NoteClass {
        //TODO
    }


    async function loadNotesList() {
        const loadedNotesList = await AsyncStorage.getItem(noteStorageKey)
        const parsedList = await JSON.parse(loadedNotesList);
    }


    async function resetRepository() {
        await AsyncStorage.clear();
        AsyncStorage.setItem("@notesList", JSON.stringify([]));
    }


    async function getAllNotes() {
        //ISTO ESTA REDUNDANTE POIS setState nao e assincron por isso a chamada no inicio ira devolver uma lista vazia
        const loadedNotesList = await AsyncStorage.getItem('@notesList')
        const parsedList = await JSON.parse(loadedNotesList);
        return parsedList!=null?parsedList:[];
    }


    async function updateElement(elementId: string, x:number, y:number) {
        //NOTA: ISTO ESTA MUITO MAL FEITO POIS CADA ALTERACAO OBRIGA A CARREGAR TODA A LISTA

        /*
        *       Aqui estou na duvida como fazer:
        *   1 - Dar update apenas no AsyncStorage.
        *   2 - Dar return tanto aqui como em AsyncStorage
        * */

        var itemArrayCopy = await getAllNotes();
        //TODO -> Verificar se aqui vai ser preciso usar as promisses para ter o elemento

        for (var i = 0; i < itemArrayCopy.length; i++) {
            if(itemArrayCopy[i]._id === elementId) {
                itemArrayCopy[i]._x = x;
                itemArrayCopy[i]._y = y;
            }
        }

        itemArrayCopy = JSON.stringify(itemArrayCopy);
        await AsyncStorage.setItem('@notesList', itemArrayCopy);
        const newListx = await getAllNotes();
    }

    function updateNotes(noteList: Array<NoteClass>) {
        AsyncStorage.setItem('@notesList', JSON.stringify(noteList));
    }

    async function remove(note: NoteClass) {
        const notes_list = await getAllNotes();
        const filtered_list =  notes_list.filter(n => n._id != note._id);
        console.log("NOTES LIST AFTHER DELETE: ", filtered_list);
        await AsyncStorage.setItem('@notesList', JSON.stringify(filtered_list));
        return;
    }

    //===========================================================
    //             TESTING NOTES CATEGORY (START)
    //===========================================================
    async function addNewCategory(name:string) : Promise<CategoryClass> {
        console.log("ADDING NEW CATEGORY: ",name);
        const newCategory = new CategoryClass(name);
        const keys = await getCategoryKeys();
        if(keys.includes(name)) {
            console.log("ERROR: CANNOT ADD CATEGORY, ALREADY EXIST");
            return; //THROW ERROR HERE
        }
        await addCategoryKey(name);
        console.log("!!!")
        AsyncStorage.setItem(name, JSON.stringify(newCategory));
        return newCategory;
    }


    async function addNoteToCategory(note: NoteClass ,category: CategoryClass) {
        const loadedCategory = await getCategory(category._name);
        loadedCategory.notesList.push(note._id);
        console.log("ADDING NOTE TO CATEGORY: ", loadedCategory, note._title);
        AsyncStorage.setItem(loadedCategory._name, JSON.stringify(loadedCategory));
    }

    function removeNoteFromCategory(note: NoteClass) {
        //TODO
    }

    async function changeCategoryPosition(category : CategoryClass) {
        await AsyncStorage.setItem(category._name, JSON.stringify(category));
        return;
    }

    async function getCategory(key:string) {
        const loadedKeys = await getCategoryKeys();
        if(!loadedKeys.includes(key)) return;
        const loadedCategory = await AsyncStorage.getItem(key);
        const parsedCategory = await JSON.parse(loadedCategory);
        console.log(">>>>>>>",parsedCategory)
        return parsedCategory
    }

    async function addCategoryKey(key: string) {
        console.log("ADDING KEY");
        const keys = await getCategoryKeys();
        if(keys.includes(key)) {
            console.log("ESTA KEY JA EXISTE");
            return; //THROW ERROR HERE PROB
        }
        keys.push(key);
        await AsyncStorage.setItem(CATEGORY_KEYS, JSON.stringify(keys));
    }

    async function deleteCategoryKey() {
        //TODO
    }


    async function getCategoryKeys() : Promise<Array<string>> {
        const keys = await AsyncStorage.getItem(CATEGORY_KEYS);
        console.log("Loaded  Category Keys: ", keys);
        if(keys == null) return [];
        return JSON.parse(keys);
    }

    async function loadCategories() : Promise<Array<CategoryClass>> {
        const categories : Array<CategoryClass>= [];
        const keys = await getCategoryKeys();
        if(keys.length == 0) return categories;

        for (const key of keys) {
            const category = await AsyncStorage.getItem(key);
            if(category == null) return []; //THROW ERROR HERE PROBBLY
            const parsedCategory = JSON.parse(category);
            categories.push(parsedCategory);
        }
        console.log("Loaded  CATEGORIES: ", categories);
        return categories;
    }
    //===========================================================
    //             TESTING NOTES CATEGORY (END)
    //===========================================================

    return {
        add,
        remove,
        get,
        getAllNotes,
        loadNotesList,
        updateElement,
        updateNotes,
        addNewCategory,
        addNoteToCategory,
        loadCategories,
        changeCategoryPosition
    }
}