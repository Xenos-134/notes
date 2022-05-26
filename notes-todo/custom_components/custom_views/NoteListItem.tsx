import {View, Text, StyleSheet, ScrollView} from "react-native";
import {useEffect} from "react";



export default function NoteListItem({text}) {
    return(
            <View style={styles.note_list_item_main_view}>
                <Text style={styles.title_text}>
                    {text}
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
        marginBottom: 20,
        elevation: 10
    },
    title_text: {
        marginTop: 10,
        fontSize: 16,
        fontWeight: "600"
    }
})