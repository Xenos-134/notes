class NoteClass {
    _title: string;
    _body: string;
    _id: string;
    _createdAt: Date;
    _group: number;

    constructor(title: string, body: string) {
        if (!title || !body) throw new Error("Incorrect Arguments"); //TODO CREATE CUSTOM ERRORS
        this._id = title.concat(Date.now().toString());
        this._title = title;
        this._body = body
    }

    getTitle() {
        return this._title;
    }

    getBody() {
        return this._title;
    }

    getId() {
        return this._id;
    }
}