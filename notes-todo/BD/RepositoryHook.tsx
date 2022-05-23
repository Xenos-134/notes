import {useEffect, useRef, useState} from "react";
import {NoteClass} from "../custom_classes/NoteClass";
import AsyncStorage from '@react-native-async-storage/async-storage';


export function RepositoryHook() {
    const [_itemArray, setItemArray] = useState(new Array<NoteClass>());
    const [firstRun, setFirstRun] = useState(true);

    useEffect(()=>{
        if(!_itemArray || _itemArray.length == 0) return;
        AsyncStorage.setItem('@notesList', JSON.stringify(_itemArray));
    },[_itemArray]);

    useEffect(()=>{
        //resetRepository();
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


    return {
        add,
        remove,
        get,
        getAllNotes,
        loadNotesList,
        updateElement,
    }
}