import {View, Text, StyleSheet, ScrollView} from "react-native";
import {useEffect} from "react";



export default function NoteListItem({note}) {
    return(
            <View style={[styles.note_list_item_main_view, {backgroundColor: note._color?note._color:"#fabd2f"}]}>
                <Text style={styles.title_text}>
                    {note._title}
                </Text>
                <Text style={styles.body_text}>
                    {note._body}
                </Text>
            </View>
    )
}

const styles = StyleSheet.create({
    note_list_item_main_view: {
        backgroundColor: "#fabd2f", //ESTA COR VAI SER UMA VARIAVEL
        alignItems:"center",
        width:  "100%",
        height: 150, //TODO ALTERAR ISTO PARA SER ATRAVES DE DIMNENSIONS
        elevation: 10
    },
    title_text: {
        marginTop: 10,
        fontSize: 16,
        fontWeight: "600"
    },
    body_text: {
        marginTop: 10,
        fontSize: 12,
        fontWeight: "400"
    }
})