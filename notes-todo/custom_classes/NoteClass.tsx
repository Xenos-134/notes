export class NoteClass {
    _title: string;
    _body: string;
    _id: string;
    _createdAt: Date;
    _group: number;     //INDICA  A QUE CLASSE PERTENCE (DEPOIS IREI ADICIONAR ESTA FIUNCIONALIDADE)
    _x: number;
    _y: number;

    constructor(title: string, body: string) {
        if (!title || !body) throw new Error("Incorrect Arguments"); //TODO CREATE CUSTOM ERRORS
        this._id = title.concat(Date.now().toString());
        this._title = title;
        this._body = body
    }

    getTitle(): string {
        return this._title;
    }

    getBody(): string {
        return this._title;
    }

    getId(): string {
        return this._id;
    }
}