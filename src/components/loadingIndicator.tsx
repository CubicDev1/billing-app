import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { colors } from '../utils/theme/colors';

const LoadingIndicator = () => {
    return (
        <View style={styles.container}>
            <ActivityIndicator size="large" color={colors.primary} style={{}} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default LoadingIndicator;
