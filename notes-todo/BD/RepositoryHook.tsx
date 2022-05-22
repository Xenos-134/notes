import {useEffect, useState} from "react";
import {NoteClass} from "../custom_classes/NoteClass";
import AsyncStorage from '@react-native-async-storage/async-storage';


export function RepositoryHook() {
    const [_itemArray, setItemArray] = useState(new Array<NoteClass>());

    useEffect(()=>{
        //console.log("ADDED NEW ITEM: ", _itemArray);
        if(_itemArray.length == 0) return;
        AsyncStorage.setItem('@notesList', JSON.stringify(_itemArray));
    },[_itemArray]);

    useEffect(()=>{
        //resetRepository();
        loadNotesList();
    },[])

    async function add(item: NoteClass) {
        var exist: boolean = false;
        exist = _itemArray.some(elm => elm._id === item._id);
        if(exist) return;

        setItemArray([..._itemArray, item]);
    };

    function remove() {
        //TODO
    };

    function get(): NoteClass {
        //TODO
    }

    async function loadNotesList() {
        const loadedNotesList = await AsyncStorage.getItem('@notesList')
        const parsedList = await JSON.parse(loadedNotesList);

        //console.log(parsedList);
        setItemArray(parsedList);
    }

    async function resetRepository() {
        await AsyncStorage.clear();
        AsyncStorage.setItem("@notesList", JSON.stringify([]));
    }

    async function getAllNotes() {
        //ISTO ESTA REDUNDANTE POIS setState nao e assincron por isso a chamada no inicio ira devolver uma lista vazia
        const loadedNotesList = await AsyncStorage.getItem('@notesList')
        const parsedList = await JSON.parse(loadedNotesList);
        return parsedList;
    }

    function updateElement(elementId: string, x:number, y:number) {

    }


    return {
        add,
        remove,
        get,
        getAllNotes,
    }
}