//===========================================================
//             Context used to share scale value ...
//              at this point i reformatting
//===========================================================
import React from "react";

function Noot() {};

export const ViewDimensionsContext = React.createContext({
    scaleValue: 0,
    getScaleValue: Noot,
});