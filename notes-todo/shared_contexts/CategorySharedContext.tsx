import React from "react";

function Noot() {};

export const CategorySharedContext = React.createContext({
    categoryList: [],
    addCategory: Noot,
    removeCategory: Noot,
    loadCategoriesFromRepository: Noot,
    removeAllCategories: Noot,
    addNoteToCategory: Noot,
    removeNoteFromCategory: Noot,
    calculateNewPosition: Noot,
    getAllCategories: Noot,
    changeCategor: Noot,
});