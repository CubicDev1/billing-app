import { Platform, StyleSheet } from "react-native";
import { colors } from "./theme/colors";
import { size_16, weight_700, size_15, weight_500, size_14, weight_600, size_28, weight_400, size_12, size_18, size_10, size_24, bottom_width05, bg_color_white, p10, border_radius10, mv5, mh5, alignItemCenter, border_radius5, justifyCenter } from "./theme/commonStyles";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

export const commonStyles = StyleSheet.create({

    h32white700: {
        color: colors.white,
        ...size_16,
        ...weight_700
    },
    h28blackOne700: {
        color: colors.blackOne,
        ...size_28,
        ...weight_700,
    },
    h16blackTwo400: {
        color: colors.blackTwo,
        ...size_16,
        ...weight_400,
    },
    h15white400: {
        color: colors.white,
        ...size_15,
        ...weight_400
    },
    h14blackOne500: {
        color: colors.blackOne,
        ...size_14,
        ...weight_500
    },
    h14blackTwo500: {
        color: colors.blackTwo,
        ...size_14,
        ...weight_500
    },
    h14blackOne600: {
        color: colors.blackOne,
        ...size_14,
        ...weight_600,
    },
    h12BlackOne600: {
        color: colors.blackOne,
        ...size_12,
        ...weight_600,
    },
    h12Primary400: {
        color: colors.primary,
        ...size_12,
        ...weight_400,
    },
    h14Danger400: {
        color: colors.danger,
        ...size_14,
        ...weight_400,
    },
    h14400: {
        ...size_14,
        ...weight_400,
    },
    h14600: {
        ...size_14,
        ...weight_600,
    },
    h12Blue600: {
        color: colors.blue,
        ...size_12,
        ...weight_600,
    },
    h14White400Underline: {
        color: colors.white,
        ...size_14,
        ...weight_400,
        textDecorationLine: 'underline'
    },
    h14Primary400Underline: {
        color: colors.primary,
        ...size_14,
        ...weight_400,
        textDecorationLine: 'underline'
    },
    h18BlackOne700: {
        color: colors.blackOne,
        ...size_18,
        ...weight_700,
    },
    h10grey600: {
        color: colors.grey,
        ...size_10,
        ...weight_600,
    },
    h10White600: {
        color: colors.white,
        ...size_10,
        ...weight_600,
    },
    h12blackTwo600: {
        color: colors.blackTwo,
        ...size_12,
        ...weight_600,
    },
    h16Primary700: {
        color: colors.primary,
        ...size_16,
        ...weight_700,
    },
    h10green600: {
        color: colors.green,
        ...size_10,
        ...weight_600,
    },
    h10danger600: {
        color: colors.danger,
        ...size_10,
        ...weight_600,
    },
    h10blackTwo600: {
        color: colors.blackTwo,
        ...size_10,
        ...weight_600,
    },
    h16BlackOne700: {
        color: colors.blackOne,
        ...size_16,
        ...weight_700,
    },
    h16White700: {
        color: colors.white,
        ...size_16,
        ...weight_700,
    },
    h12GreyTwo400: {
        color: colors.greyTwo,
        ...size_12,
        ...weight_400,
    },
    h10Primary600: {
        color: colors.primary,
        ...size_10,
        ...weight_600,
    },
    h24BlackOne700: {
        color: colors.blackOne,
        ...size_24,
        ...weight_700,
    },
    h15blackTwo400: {
        color: colors.blackTwo,
        ...size_15,
        ...weight_400,
    },
    h16blackOne500: {
        color: colors.blackOne,
        ...size_15,
        ...weight_400,
    },
    h12blackTwo400: {
        color: colors.blackTwo,
        ...size_12,
        ...weight_400,
    },
    h15blackOne500: {
        color: colors.blackOne,
        ...size_15,
        ...weight_500,
    },
    h15blackOne600: {
        color: colors.blackOne,
        ...size_15,
        ...weight_500,
    },
    h12white600: {
        color: colors.white,
        ...size_12,
        ...weight_600,
    },
    h12RedFour600: {
        color: colors.redFour,
        ...size_12,
        ...weight_600,
    },
    h14BlackTwo400: {
        color: colors.blackTwo,
        ...size_14,
        ...weight_400,
    },
    h12BlackTwo500: {
        color: colors.blackTwo,
        ...size_12,
        ...weight_500,
    },
    h12RedTwo500: {
        color: colors.redTwo,
        ...size_12,
        ...weight_600,
    },
    h18white700: {
        color: colors.white,
        ...size_18,
        ...weight_700,
    },
    longButton: {
        height: 50,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.white,
        marginVertical: 15,
    },
    h14primary600: {
        ...size_14,
        ...weight_600,
    },
    topNotchBase: {
        flex: 0,
    },
    mainContainerBase: {
        flex: 1,
    },
    subContainerBase: {
        flex: 1,
    },
    keyboardAwareScrollView: {
        flex: 1,
    },
    bottomWidth: {
        ...bottom_width05,
        borderColor: colors.greyTwo
    },
    mainListCard: {
        elevation: 1,
        ...bg_color_white,
        ...p10,
        ...border_radius10,
        ...mv5,
        ...mh5
    },
    smallCard: {
        height: 25,
        backgroundColor: colors.redOne,
        ...border_radius5,
        ...justifyCenter,
        ...alignItemCenter,
    }

});


export const KeyboardAScrollView = ({ ...rest }) => (
    <KeyboardAwareScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        enableAutomaticScroll={true}
        extraHeight={Platform.OS === 'ios' ? 90 : 75}
        contentContainerStyle={commonStyles.keyboardAwareScrollView}
        {...rest}
    >
    </KeyboardAwareScrollView>
);

export const getSubContainerStyle = (props: {
    secondary?: boolean;
    space_between?: boolean;
}) => ({
    ...commonStyles.subContainerBase,
    backgroundColor: props.secondary ? colors.primary : colors.white,
    ...(props.space_between ? { justifyContent: 'space-between' } : {}),
});


export const getMainContainerStyle = (secondary?: boolean) => ({
    ...commonStyles.mainContainerBase,
    backgroundColor: secondary ? colors.primary : colors.white,
});

export const getTopNotchStyle = (secondary?: boolean) => ({
    ...commonStyles.topNotchBase,
    backgroundColor: secondary ? colors.primary : colors.white,
});

export const getLongButtonStyle = (props: {
    width?: any;
    height?: any;
    backgroundColor?: string;
}) => {
    return {
        ...(props.width && { width: props.width }),
        ...(props.height && { height: props.height }),
        ...(props.backgroundColor && { backgroundColor: props.backgroundColor }),
    };
};

export const getTextColorStyle = (color?: string) => ({
    color: color || colors.primary,
});