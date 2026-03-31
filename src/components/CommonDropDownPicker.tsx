import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Dropdown } from 'react-native-element-dropdown'
import { colors } from '../utils/theme/colors'

export type CommonDropDownPickerProps = {
    ListData: any;
    dropdownValue: any;
    handleDropdownChange: any;
    isFocus: boolean;
    setIsFocus: any;
    labelField: string;
    valueField: string;
    placeholder: string;
    disable?: boolean;
} 

export const CommonDropDownPicker: React.FC<CommonDropDownPickerProps> = ({
    ListData,
    dropdownValue,
    handleDropdownChange,
    isFocus,
    setIsFocus,
    labelField,
    valueField,
    placeholder,
    disable = false,
}) => {
    return (
        <View>
            <Dropdown
                style={[styles.dropdown, isFocus && { borderColor: 'blue' }]}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                inputSearchStyle={styles.inputSearchStyle}
                iconStyle={styles.iconStyle}
                data={ListData}
                search
                disable={disable}
                maxHeight={300}
                labelField={labelField}
                valueField={valueField}
                placeholder={!isFocus ? placeholder : '...'}
                searchPlaceholder="Search..."
                value={dropdownValue}
                onFocus={() => setIsFocus(true)}
                onBlur={() => setIsFocus(false)}
                onChange={handleDropdownChange}
                itemTextStyle = {styles.selectedTextStyle}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    selectedTextStyle: {
        fontSize: 12,
        color: colors.blackOne
    },
    iconStyle: {
        width: 20,
        height: 20,
    },
    inputSearchStyle: {
        height: 40,
        fontSize: 16,
        color: colors.redTwo
    },
    dropdown: {
        height: 40,
        borderColor: colors.greyFive,
        borderWidth: 0.5,
        borderRadius: 8,
        paddingHorizontal: 8,
        backgroundColor: colors.greyOne
    },
    placeholderStyle: {
        fontSize: 12,
        color: colors.greySix
    }
});
