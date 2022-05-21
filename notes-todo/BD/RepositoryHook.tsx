import {useEffect, useState} from "react";
import {NoteClass} from "../custom_classes/NoteClass";

export function RepositoryHook() {
    const [_itemArray, setItemArray] = useState(new Array<NoteClass>());

    useEffect(()=>{
        console.log("ADDED NEW ITEM: ", _itemArray);
    },[_itemArray]);

    function add(item: NoteClass) {
        var exist: boolean = false;
        exist = _itemArray.some(elm => elm._id === item._id);
        if(exist) return;

        setItemArray([..._itemArray, item]);
    };

    function remove() {

    };

    function get(): NoteClass {

    }



    return {
        add,
        remove,
        get,
    }
}