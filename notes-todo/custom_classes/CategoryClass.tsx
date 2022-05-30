import {NoteClass} from "./NoteClass";

export class CategoryClass {
    private _name : string;
    private notesList : Array<string>; //Lista de ID de notes que lhe pertencem
    private _color: string;
    private _x: number;
    private _y: number;

    constructor(categoryName: string) {
        this._name = categoryName;
        this.notesList = [];
    }

    get name() : string {
        return this._name;
    }

    get color() {
        return this._color;
    }

    push(note : NoteClass) {
        this.notesList.push(note._id);
    }

    get position() {
        return {x: this._x, y: this._y};
    }

    setPosition(x: number, y:number) {
        this._x = x;
        this._y = y;
        return this;
    }
}