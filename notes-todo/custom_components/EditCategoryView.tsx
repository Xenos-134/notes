import React, {useContext, useEffect, useState} from "react";
import {View, Text, StyleSheet, Dimensions, TouchableHighlight, TextInput} from "react-native";
import ColorPicker from 'react-native-wheel-color-picker'
import {RepositoryHook} from "../BD/RepositoryHook";
import {CategorySharedContext} from "../shared_contexts/CategorySharedContext";
import {ColorSelector as CustomColorSelector} from "./EditNoteView";


const SCREEN = Dimensions.get("screen");
const DEFAULT_COLOR = "#ffffff";

export default function EditCategoryView({navigation, route}) {
    //===========================================================
    //              States
    //===========================================================
    const [color, setColor] = useState("#458588");
    const [defaultColor, setDefaultColor] = useState("#458588");
    const [csVisibility, setCSV] = useState(false);
    const [categoryName, setCategoryName] = useState("TEST");
    const [category, setCategotry] = useState(null);

    //===========================================================
    //              Context and Custom hooks
    //===========================================================
    const categorySharedContext = useContext(CategorySharedContext);

    useEffect(()=> {
        setCategoryName(route.params.category._name);
        if(route.params.category.color) {
            setDefaultColor(route.params.category.color);
            setColor(route.params.category.color);
        }
        setCategotry(route.params.category);
        setDefaultColor("#458588");
    },[])


    //===========================================================
    //              Methods
    //===========================================================
    function showColorSelector() {
        setCSV(!csVisibility);
    }

    function cancelColorSelection() {
        setColor(defaultColor);
    }

    function previewSelectColor(color: string) {
        if(color == DEFAULT_COLOR) return;
        console.log("SELECTED COLOR", color);
        setColor(color);
        if(!category) return;
        const copy = category;
        copy.color = color;
        setCategotry(copy);
    }

    function selectColor() {
        setDefaultColor(color);
    }

    function changeCategory() {
        //@ts-ignore
        console.log("CATEGORY:" , category)
        categorySharedContext.changeCategory(category);
        navigation.goBack();
        categorySharedContext.updateCategoryListMainScreen();
    }

    function changeCategoryName(text) {
        setCategoryName(text);
        var copy = category;
        copy._name = text;
        setCategotry(copy);
    }


    return (
        <View style={[styles.edit_category_main_view, {backgroundColor: color}]}>
            <View style={styles.edit_category_text_view}>
                <TextInput
                    style={styles.category_text}
                    value={categoryName}
                    onChangeText={changeCategoryName}
                />
            </View>
            <CustomColorSelector
                showCircleCS={showColorSelector}
                changeColorMethod={previewSelectColor}
            />
            <ColorSelector
                visible={csVisibility}
                selectColor={previewSelectColor}
                visibMethod={showColorSelector}
                cancelMethod={cancelColorSelection}
            />
            <View style={styles.bottom_buttons_view} >
                <TouchableHighlight
                    style={styles.save_changes_button}
                    onPress={changeCategory}
                >
                    <Text style={styles.color_selector_text}>Save Changes</Text>
                </TouchableHighlight>
                <TouchableHighlight
                    style={styles.cancel_changes_button}
                    onPress={() => navigation.goBack()}
                >
                    <Text style={styles.color_selector_text}>Cancel</Text>
                </TouchableHighlight>
            </View>
        </View>
    )
}


export function ColorSelector({selectColor, visible, visibMethod, cancelMethod}) {
    return(
        <View
            style={{
                position: "absolute",
                top: SCREEN.height * 0.2,
                alignSelf: "center",
                zIndex: 20,

            }}
        >
            {visible &&
                <View style={styles.color_picker_view}>
                    <ColorPicker
                        onColorChange={selectColor}
                    />
                    <View style={styles.select_color_buttons_view}>
                        <TouchableHighlight
                            style={styles.select_button}
                            onPress={visibMethod}
                        >
                            <Text style={styles.color_selector_text}>Select</Text>
                        </TouchableHighlight>
                        <TouchableHighlight
                            style={styles.cancel_button}
                            onPress={()=>{visibMethod(); cancelMethod();}}
                        >
                            <Text style={styles.color_selector_text}>Cancel</Text>
                        </TouchableHighlight>
                    </View>
                </View>
            }
        </View>
    )
}



const styles = StyleSheet.create({
    edit_category_main_view: {
        backgroundColor: "#458588",
        flex: 1,
    },
    edit_category_text_view: {
        marginTop: SCREEN.height * 0.1,
    },
    category_text: {
        fontSize: 18,
        fontWeight: "600",
        marginLeft: SCREEN.width*0.1,
    },
    select_color: {

    },
    save_changes_button: {
        backgroundColor: "#689d6a",
        width: "40%",
        height: 50,
        alignItems: "center",
        justifyContent:"center",
        borderRadius: 7,
        elevation: 10

    },
    cancel_changes_button: {
        backgroundColor: "#d79921",
        width: "40%",
        height: 50,
        alignItems: "center",
        justifyContent:"center",
        borderRadius: 7,
        elevation: 10

    },
    bottom_buttons_view: {
        position: "absolute",
        bottom: 0,
        width: SCREEN.width,
        padding: 20,
        flexDirection: "row",
        justifyContent: "space-around"
    },


    //TODO -> make component
    color_picker_view: {
        width: SCREEN.width * 0.9,
        height: SCREEN.width * 1.3,
        backgroundColor: "#fbf1c7",
        borderRadius: 10,
        padding: 15,
        elevation: 15
    },
    select_color_buttons_view : {
        flexDirection: "row",
        justifyContent: "space-around",
        marginTop: 20
    },
    select_button: {
        backgroundColor: "#689d6a",
        width: "40%",
        height: 45,
        alignItems: "center",
        justifyContent:"center",
        borderRadius: 7
    },
    cancel_button: {
        backgroundColor: "#fb4934",
        width: "40%",
        height: 45,
        alignItems: "center",
        justifyContent:"center",
        borderRadius: 7
    },
    color_selector_text: {
        fontSize: 15,
        fontWeight: "600",
        color: "#ebdbb2"
    }
})