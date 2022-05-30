import {StyleSheet, Text, View} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

export default function CategoryBadge({text}) { //TODO ADICIONAR COR
    return (
        <View style={styles.category_badge_view} >
            <Text style={styles.category_badge_text}>{text}</Text>
            <View style={styles.icon_view}>
                <Icon name="close" size={25} color="#282828" />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    category_badge_view: {
        backgroundColor: "#ebdbb2",
        height: 40,
        alignItems: "center",
        justifyContent:'flex-start',
        flexDirection: "row",
        paddingLeft: 10,
        minWidth: 120,
        borderRadius: 10,
        elevation: 10,
        marginRight: 10
    },
    category_badge_text: {
        maxWidth : 100,
    },
    icon_view: {
        position: "absolute",
        right: 5,
    }
})