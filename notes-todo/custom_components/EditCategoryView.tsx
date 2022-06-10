import React, {useEffect, useState} from "react";
import {View, Text, StyleSheet, Dimensions, TouchableHighlight} from "react-native";
import ColorPicker from 'react-native-wheel-color-picker'


const SCREEN = Dimensions.get("screen");

export default function EditCategoryView() {
    const [color, setColor] = useState("#458588");

    useEffect(()=>{

    },[]);

    function selectColor(color: string) {
        console.log("SELECTED COLOR", color);
        setColor(color);
    }

    return (
        <View style={[styles.edit_category_main_view, {backgroundColor: color}]}>
            <View style={styles.edit_category_text_view}>
                <Text style={styles.category_text}>CATEGORY NAME</Text>
            </View>
            <View style={styles.color_picker_view}>
                <ColorPicker
                    onColorChange={selectColor}
                />
                <View style={styles.select_color_buttons_view}>
                    <TouchableHighlight>
                        <Text>Select</Text>
                    </TouchableHighlight>
                    <TouchableHighlight>
                        <Text>Cancel</Text>
                    </TouchableHighlight>
                </View>
            </View>
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

    //TODO -> make component
    color_picker_view: {
        width: SCREEN.width * 0.9,
        height: SCREEN.width * 1.3,
        position: "absolute",
        top: SCREEN.height * 0.2,
        alignSelf: "center",
        backgroundColor: "#fbf1c7",
        borderRadius: 10,
        padding: 15,
        elevation: 15
    },
    select_color_buttons_view : {
        flexDirection: "row",
        justifyContent: "space-around",
        marginTop: 20
    }
})