import React from "react";

function Noot() {};

export const NoteSharedContext = React.createContext({
    notesList: [], //TODO -> share changes in notes throught this context
    getNote: Noot,
    addCategoryToNote: Noot,
    removeCategoryFromNote: Noot,
    loadNoteCategories: Noot,
})