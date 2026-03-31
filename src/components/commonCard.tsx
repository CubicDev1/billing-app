import { ReactNode } from "react";
import { ViewStyle, View, StyleSheet } from "react-native";

interface CardProps {
    children: ReactNode;
    backgroundColor?: string;
    style?: ViewStyle;
}

export const Card = ({ children, backgroundColor = '#FFFFFF', style }: CardProps) => {
    return (
        <View style={[styles.card, { backgroundColor }, style]}>
            {children}
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        borderRadius: 8,
        padding: 10,
        marginRight : 10,
        // shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        // shadowOpacity: 0.25,
        // shadowRadius: 3.84,
        elevation: 5,
    },
});