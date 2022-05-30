import {StyleSheet, View} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

export default function AddBadge() {
    return (
        <View style={
            {
                backgroundColor: "#ebdbb2",
                height: 40,
                width: 40,
                alignItems: "center",
                justifyContent:'center',
                flexDirection: "row",
                borderRadius: 10,
                elevation: 10,
            }
        }>
            <Icon name="add" size={25} color="#282828" />
        </View>
    )
}

