import {StyleSheet, TouchableHighlight, View} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

export default function AddBadge({openCategoryList}) {
    return (
        <TouchableHighlight
            onPress={openCategoryList}
            style={
            {
                backgroundColor: "#ebdbb2",
                height: 40,
                width: 40,
                alignItems: "center",
                justifyContent:'center',
                flexDirection: "row",
                borderRadius: 10,
                elevation: 10,
                marginRight: 10,
                marginLeft: 20,
            }
        }>
            <Icon name="add" size={25} color="#282828" />
        </TouchableHighlight>
    )
}

