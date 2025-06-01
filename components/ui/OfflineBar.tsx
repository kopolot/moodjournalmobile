import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function OfflineBar() {
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.offlineContainer}>
                <Text style={styles.offlineText}>Brak połączenia z internetem</Text>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#f44336",
        padding: 12,
    },
    offlineContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    offlineText: {
        color: "#fff",
        marginLeft: 8,
    },
});