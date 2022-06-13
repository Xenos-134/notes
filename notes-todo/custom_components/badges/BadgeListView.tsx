import {FlatList, View, StyleSheet, Text, Dimensions, TouchableHighlight} from "react-native";
import {useContext, useEffect} from "react";
import {CategorySharedContext} from "../../shared_contexts/CategorySharedContext";
import {NoteClass} from "../../custom_classes/NoteClass";
import {CategoryClass} from "../../custom_classes/CategoryClass";
import {NoteSharedContext} from "../../shared_contexts/NotesSharedContext";

const SCREEN = Dimensions.get("screen");

export default function BadgeListView({categoriesList, note, add}) {
    const categoryContext = useContext(CategorySharedContext);
    const noteContext = useContext(NoteSharedContext);

    async function addNoteToCategory(category: CategoryClass) {
        console.log("ADDING :", category)
        categoryContext.addNoteToCategory(note, category);
        noteContext.addCategoryToNote(note._id, category);
        add(category);
    }


    const renderItem = ({item}) => (
        <Item category={item} method={addNoteToCategory} />
    );

    return (
        <View style={styles.categories_list_view}>
            <FlatList
                data={categoriesList}
                renderItem={renderItem}
                keyExtractor={item => item.id}
            />
        </View>
    )
}

const Item = ({category, method}) => (
    <TouchableHighlight
        onPress={()=> method(category)}
        style={styles.item}>
        <Text style={styles.title}>{category._name}</Text>
    </TouchableHighlight>
);


const styles = StyleSheet.create({
    item: {
        backgroundColor: '#ebdbb2',
        padding: 20,
        marginVertical: 8,
        marginHorizontal: 16,
        borderBottomWidth: 1,
        borderColor: "#282828",

    },
    title: {
        fontSize: 15,

    },
    categories_list_view: {
        position:"absolute",
        top: SCREEN.height * 0.2,
        left: SCREEN.width * 0.1,
        width: SCREEN.width * 0.7,
        height: SCREEN.height * 0.4,
        backgroundColor: "#ebdbb2",
        borderRadius: 15,
        zIndex: 10,
    }
});

