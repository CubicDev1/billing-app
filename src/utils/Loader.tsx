// create a loadder here

import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { colors } from './theme/colors';

export const Loader = () => {
    return (
        <View
            style={{}}>
            <ActivityIndicator size= {60} color={colors.primary} />
        </View>
    );
}
