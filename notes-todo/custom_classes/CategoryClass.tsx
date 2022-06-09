import {NoteClass} from "./NoteClass";

export class CategoryClass {
    private _name : string;
    private notesList : Array<string>; //Lista de ID de notes que lhe pertencem
    private _color: string;
    //Top Corner
    x: number;
    y: number;
    //Bot Corner
    bx: number;
    by: number;

    constructor(categoryName: string) {
        this._name = categoryName;
        this.notesList = [];
        this.x = 0;
        this.y = 0;

        this.bx = 0;
        this.by = 0;
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
        return {x: this.x, y: this.y};
    }

    setPosition(x: number, y:number) {
        this.x = x;
        this.y = y;
        return this;
    }
}