import {useEffect, useRef, useState} from "react";
import {NoteClass} from "../custom_classes/NoteClass";
import AsyncStorage from '@react-native-async-storage/async-storage';
import {CategoryClass} from "../custom_classes/CategoryClass";


const noteStorageKey = "@notesList";
const CATEGORY_KEYS = "@categoriesKeysList";


export function RepositoryHook() {
    useEffect(()=>{
        //AsyncStorage.clear();
    },[])


    async function add(item: NoteClass) {
        const loadedNotes = await getAllNotes();
        if(loadedNotes == null || loadedNotes.length == 0) {
            //setItemArray([item]);
            await AsyncStorage.setItem(noteStorageKey, JSON.stringify([item]));
            return;
        }
        const parsedList = await JSON.parse(loadedNotes);
        parsedList.push(item);
        await AsyncStorage.setItem(noteStorageKey, JSON.stringify(parsedList));
    };


    async function getNoteById(noteId: string): Promise<NoteClass> {
        const notesList = await loadNotesList();
        const note = notesList.find( n => n._id === noteId);
        return note;
    }


    async function loadNotesList() : Promise<Array<NoteClass>> {
        const loadedNotesList = await AsyncStorage.getItem(noteStorageKey)
        const parsedList = await JSON.parse(loadedNotesList);
        return parsedList;
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

    async function updateNotes(noteList: Array<NoteClass>) {
        const savedNotes = await AsyncStorage.setItem('@notesList', JSON.stringify(noteList));
        return savedNotes;
    }

    async function remove(note: NoteClass) {
        const notes_list = await getAllNotes();
        const filtered_list =  notes_list.filter(n => n._id != note._id);
        await AsyncStorage.setItem('@notesList', JSON.stringify(filtered_list));
        return;
    }

    //===========================================================
    //             TESTING NOTES CATEGORY (START)
    //===========================================================
    async function addNewCategory(name:string) : Promise<CategoryClass> {
        const newCategory = new CategoryClass(name);
        const keys = await getCategoryKeys();
        if(keys.includes(name)) {
            return; //THROW ERROR HERE
        }
        await addCategoryKey(name);
        AsyncStorage.setItem(name, JSON.stringify(newCategory));
        return newCategory;
    }


    async function addNoteToCategory(note: NoteClass ,category: CategoryClass) {
        const loadedCategory = await getCategory(category._name);
        loadedCategory.notesList.push(note._id);
        AsyncStorage.setItem(loadedCategory._name, JSON.stringify(loadedCategory));
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
        return parsedCategory
    }

    async function addCategoryKey(key: string) {
        const keys = await getCategoryKeys();
        if(keys.includes(key)) {
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
        return categories;
    }


    async function addCategoryToNote(noteId: string, cat: CategoryClass) {
        const notes = await getAllNotes();
        const note = notes.find(n => n._id === noteId);

        //FIXME S- REMOVER ESTA PARTE
        if(note._categories == null) note._categories = [];
        //FIXME E- REMOVER ESTA PARTE
        if(note._categories.some(c => c._name == cat._name)) return;
        note._categories.push(cat);
        console.log("NOTE: ", notes);
        updateNotes(notes);
    }

    async function removeCategoryFromNote(noteId: string, cat: CategoryClass) {
        const notes = await getAllNotes();
        const note = notes.find(n => n._id === noteId);

        //FIXME S- REMOVER ESTA PARTE
        if(note._categories == null) note._categories = [];
        //FIXME E- REMOVER ESTA PARTE
        console.log(">>>NOTE: ", note._categories);
        await removeNoteFromCategory(noteId, cat._name);
        note._categories = note._categories.filter(c => c._name !== cat._name);
        const newNoteList = await updateNotes(notes);
        return newNoteList;
    }

    async function removeCategory() {
        //TODO
    }


    async function removeNoteFromCategory(noteId: string, categoryId: string) {
        const category = await getCategoryById(categoryId);

        // @ts-ignore
        category.notesList = category.notesList.filter(n => n._id == noteId);
        console.log("NEW CATEGORY:", category);
        AsyncStorage.setItem(categoryId, JSON.stringify(category));
    }

    async function getCategoryById(catId: string) {
        const category = await AsyncStorage.getItem(catId);
        if(category == null) return; //THROW ERROR HERE
        const parsedCategory = await JSON.parse(category);
        return parsedCategory;
    }

    //===========================================================
    //             TESTING NOTES CATEGORY (END)
    //===========================================================

    return {
        add,
        remove,
        getNoteById,
        getAllNotes,
        loadNotesList,
        updateElement,
        updateNotes,
        addNewCategory,
        addNoteToCategory,
        loadCategories,
        changeCategoryPosition,
        addCategoryToNote,
        removeCategoryFromNote
    }
}