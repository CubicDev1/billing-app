import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { OnboardingButton } from '../../components/commonButton';
import { CustomTextInputField, MultiLineTextBox, ToggleSwitch } from '../../components/commonComponents';
import { DevWidth } from '../../utils/device';
import CustomIcon from '../../utils/icons';
import { labels } from '../../utils/labels';
import { colors } from '../../utils/theme/colors';
import { alignItemCenter, flex1, flexRow, justifyBetween, mh10 } from '../../utils/theme/commonStyles';
import { commonStyles } from '../../utils/commonStyles';

export type StockFormProps = {
    title: string;
    onSave: () => void;
    onCancel: () => void;
    placeholder: string;
    btnTitle: string;
    toggleBtn?: boolean;
};

export const ModalTopText = ({ title, iconPress, toggleBtn }) => {
    const [toggleVisible, setToggleVisible] = useState(false);

    const handleToggleChange = () => {
        setToggleVisible(!toggleVisible);
    };

    return (
        <View style={[flexRow, justifyBetween, alignItemCenter]}>
            <Text style={[commonStyles.h18BlackOne700,{}]}>{title}</Text>
            {
                toggleBtn ?
                    <View style={[flexRow]}>
                        <View style={[mh10]}>
                            <ToggleSwitch value={toggleVisible} onToggle={handleToggleChange} />
                        </View>
                        <TouchableOpacity style={{ backgroundColor: colors.greyTwo, justifyContent: 'center', alignItems: 'center', borderRadius: 5, }} onPress={iconPress}>
                            <CustomIcon name={'cross'} size={14} color={colors.blackTwo} type={'Entypo'} />
                        </TouchableOpacity>
                    </View>
                    :
                    <TouchableOpacity style={{ backgroundColor: colors.greyTwo, justifyContent: 'center', alignItems: 'center', borderRadius: 5 }} onPress={iconPress}>
                        <CustomIcon name={'cross'} size={14} color={colors.blackTwo} type={'Entypo'} />
                    </TouchableOpacity>
            }
        </View>
    );
};

export const StockForm = ({ title, onSave, placeholder, btnTitle, onCancel }: StockFormProps) => {
    const [text, setText] = useState('');
    const [isActiveBtn, setIsActiveBtn] = useState(false);

    const handleChangeText = (newText: any) => {
        setText(newText);
    };

    const handleCancelBtnClick = () => {
        setIsActiveBtn(true);
        onCancel();
    };

    const handleSaveBtnClick = () => {
        setIsActiveBtn(false);
        onSave();
    };

    const { control } = useForm();
    const formKeys = {
        name: 'name',
        quantity: 'quantity',
        units: 'units'
    };

    return (
        <View style={[flex1]}>
            <View>
                <ModalTopText title={title} iconPress={() => { }} />
                <CustomTextInputField name={formKeys.name} control={control} placeholder={placeholder} label={labels.name} />
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <CustomTextInputField width={150} name={formKeys.quantity} control={control} placeholder={'0'} label={labels.quantity} showIcon={true} showCalendar={true} iconName='select-arrows' iconType='Entypo' iconSize={16} />
                    <CustomTextInputField name={formKeys.units} control={control} placeholder={labels.pc} label={labels.units} width={150} />
                </View>
                <MultiLineTextBox
                    placeHolder={placeholder}
                    label='Notes'
                    value={text}
                    onChangeValue={handleChangeText}
                    multiline={true}
                    keyboardType="default"
                    height={100}
                    maxLength={200}
                    disable={false}
                />
            </View>
            <View style={styles.bottomButtonsContainer}>
                <OnboardingButton
                    width={DevWidth / 2.3}
                    title={labels.cancel}
                    onChange={handleCancelBtnClick}
                    backgroundColor={isActiveBtn ? colors.primary : colors.greySeven}
                    color={isActiveBtn ? colors.white : colors.blackOne}
                />
                <OnboardingButton
                    width={DevWidth / 2.3}
                    title={btnTitle}
                    onChange={handleSaveBtnClick}
                    backgroundColor={isActiveBtn ? colors.greySeven : colors.primary}
                    color={isActiveBtn ? colors.blackOne : colors.white}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    bottomButtonsContainer: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
});

export const StockAdd = ({ onSave, onCancel }) => { // onSave is passed as a prop

    return (
        <StockForm
            title="Add Stock"
            onSave={onSave}
            onCancel={onCancel}
            btnTitle={labels.addQuantity}
            placeholder='Added a New Quantity'
        />
    );
};

export const StockRemove = ({ onSave, onCancel }) => {

    return (
        <StockForm
            title="Remove Stock"
            onSave={onSave}
            onCancel={onCancel}
            placeholder='Removed Quantity'
            btnTitle={labels.removeQuanity}
        />
    );
};