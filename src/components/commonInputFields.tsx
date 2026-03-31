import React from 'react';
import { Pressable, StyleSheet, Text, TextInput, TextInputProps, View } from 'react-native';
import { colors } from '../utils/theme/colors';
import { labels } from '../utils/labels';

interface CustomTextInputProps extends TextInputProps {
    placeholder?: string;
    value?: any;
    onChangeText?: (text: string) => void;
    textColor?: string;
    error?: string | undefined;
    multiline?: any;
    showOtp?: boolean;
    width?: number | string | any;
    getNumber?: () => void;
    autoCapitalize?: "sentences" | "none" | "words" | "characters" | undefined;
    onEnter?: CallableFunction;
    editable?: boolean; // Add the editable prop here
}

export const CustomTextInput: React.FC<CustomTextInputProps> = ({
    placeholder,
    value,
    onChangeText,
    secureTextEntry,
    keyboardType,
    textColor,
    error,
    maxLength,
    multiline,
    showOtp,
    getNumber,
    width,
    onEnter,
    autoCapitalize = 'sentences',
    editable = true, // Default to true
}) => {
    return (
        <View style={styles.container}>
            {showOtp ? (
                <View>
                    <View style={[styles.iconInputContainer, { width: width }]}>
                        <TextInput
                            style={[styles.input, { color: textColor ?? colors.black }]}
                            placeholder={placeholder}
                            value={value}
                            multiline={multiline}
                            onChangeText={onChangeText}
                            secureTextEntry={secureTextEntry}
                            keyboardType={keyboardType}
                            autoCapitalize={autoCapitalize}
                            onSubmitEditing={() => {
                                onEnter && onEnter();
                            }}
                            placeholderTextColor={colors.greySix}
                            editable={editable} // Pass the editable prop
                        />
                        <Pressable onPress={getNumber}>
                            <Text style={styles.h14Primary600}>{labels.generateCode}</Text>
                        </Pressable>
                    </View>
                    {error && <Text style={styles.errorText}>{error}</Text>}
                </View>
            ) : (
                <View>
                    <TextInput
                        style={[styles.inputStyle, { color: textColor ?? colors.black }]}
                        placeholder={placeholder}
                        value={value}
                        multiline={multiline}
                        maxLength={maxLength}
                        onChangeText={onChangeText}
                        secureTextEntry={secureTextEntry}
                        autoCapitalize={autoCapitalize}
                        onSubmitEditing={() => {
                            onEnter && onEnter();
                        }}
                        keyboardType={keyboardType}
                        placeholderTextColor={colors.grey}
                        editable={editable} // Pass the editable prop
                    />
                    {error && <Text style={styles.errorText}>{error}</Text>}
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    iconInputContainer: {
        borderWidth: 1,
        borderColor: colors.greyFive,
        borderRadius: 10,
        backgroundColor: colors.greyOne,
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row',
        paddingHorizontal: 10,
        height: 38,
        width: '100%',
    },
    inputStyle: {
        alignItems: 'center',
        width: '100%',
        borderRadius: 6,
        alignSelf: 'center',
        height: 38,
        paddingVertical: 10,
        fontSize: 12,
    },
    input: {
        alignItems: 'center',
        borderRadius: 6,
        alignSelf: 'center',
        height: 38,
        paddingVertical: 10,
        fontSize: 12,
    },
    h14Primary600: {
        color: colors.primary,
        fontSize: 14,
        fontWeight: '600',
    },
    errorText: {
        color: colors.danger,
    },
});

