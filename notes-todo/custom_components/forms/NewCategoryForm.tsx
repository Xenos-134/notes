import {StyleSheet, Text, TextInput, TouchableHighlight, View} from "react-native";
import {Dimensions} from "react-native";
import {useState} from "react";
import {RepositoryHook} from "../../BD/RepositoryHook";

const SCREEN = Dimensions.get("window")

export default function NewCategoryFormView({createNewCategory}) {
    const [categoryTitle, setCategoryTitle] = useState("");



    return (
        <View style={styles.main_form_view}>
            <Text style={styles.form_title_text}>New Category</Text>
            <TextInput
                value={categoryTitle}
                autoFocus={true}
                onChangeText={setCategoryTitle}
                placeholder={"Category Name"}
            />
            <TouchableHighlight
                style={styles.form_button}
                onPress={()=>{createNewCategory(categoryTitle )}}>
                <Text>Create New Category</Text>
            </TouchableHighlight>
        </View>
    )
}


const styles = StyleSheet.create({
    main_form_view: {
        position: "absolute",
        top: SCREEN.height*0.1,
        height: SCREEN.height * 0.15,
        width: SCREEN.width * 0.95,
        zIndex: 10,
        borderRadius: SCREEN.height*0.02,
        alignItems:"center",
        backgroundColor: "#d5c4a1",
        elevation: 10,
    },
    form_title_text: {
        fontSize: 17,
        fontWeight: "600",
        marginTop: 10
    },
    form_button : {
        position: "absolute",
        bottom: 10,
        width: "50%",
        height: "35%",
        backgroundColor: "#b8bb26",
        alignItems: "center",
        justifyContent: 'center',
        borderRadius: 10,
        marginLeft: 10,
    }
})