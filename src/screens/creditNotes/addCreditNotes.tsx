import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { OnboardingButton } from '../../components/commonButton';
import { TopHeader, CustomTextInputField, CustomNavigateBox, MultiLineTextBox, MultiSelectOption, RadioBtn } from '../../components/commonComponents';
import DashedLine from '../../components/dashedLine';
import { addedProductData } from '../../utils/data/invoiceData';
import CustomIcon from '../../utils/icons';
import { labels } from '../../utils/labels';
import { screenName } from '../../utils/screenNames';
import { colors } from '../../utils/theme/colors';
import { flex1, mt10, mh10, mv10, flexRow, justifyBetween, alignItemCenter, justifyCenter, mb5, mt5, mh15, mr5, alignSelfCenter, justifyStart, ml15, ml10, mv5 } from '../../utils/theme/commonStyles';
import { useNavigation } from '@react-navigation/native';
import { useForm } from 'react-hook-form';
import CustomModal from '../../components/commonModal';
import { AddBankDetails, AddTax } from '../settings/settingsComponent';
import { commonStyles } from '../../utils/commonStyles';

export type addCreditNotesProps = {

}


const AddCreditNotesScreen = ({ route }: any) => {
    const isAddedProductAvailable = route.params?.isAddedProductAvailable;
    const navigation = useNavigation();

    const [notes, setNotes] = useState('');
    const [termsCondition, setTermsCondition] = useState('');
    const [selectedSignature, setSelectedSignature] = useState<string | null>(null);
    const [checkBox, setCheckBox] = useState(false);
    const [isActiveBtn, setIsActiveBtn] = useState(false);
    const [addBankDetailsModal, setAddBankDetailsModal] = useState(false);
    const [addTaxModal, setAddTaxModal] = useState(false);

    const handleSignatureSelect = (status: string) => {
        setSelectedSignature(status);
    };

    const handleSaveBtnClick = () => {
        setIsActiveBtn(true);
        navigation.navigate(screenName.CreditNotesDetailsScreen as never)
    };

    const handleCancelBtnClick = () => {
        setIsActiveBtn(false);
        reset()
    };

    const handleCheckBox = () => {
        setCheckBox(!checkBox);
    }

    const openModal = () => {
        setAddBankDetailsModal(true);
    };
    const openTaxModal = () => {
        setAddTaxModal(true);
    };

    const closeModal = () => {
        setAddBankDetailsModal(false);
        setAddTaxModal(false);
    };

    const addSaveBtn = () => {
        closeModal()
    }

    const formKeys = {
        referenceNumber: 'referenceNumber',
        invoiceDate: 'invoiceDate',
        dueDate: 'dueDate',
        customerName: 'customerName',
        selectBank: 'selectBank',
        paymentMethod: 'paymentMethod',
        selectSignature: 'selectSignature',
    }

    const {
        control,
        reset,
    } = useForm();

    const signature = [
        {
            id: 1,
            name: 'Manual Signature',
        },
        {
            id: 2,
            name: 'E-Signature',
        },
    ]
    return (
        <View style={[flex1, { backgroundColor: colors.white }]}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={[flex1, mt10, mh10]}>
                    <TopHeader headerText={labels.addCreditNote} searchIcon={false} />
                                                        <View style={[commonStyles.smallCard,mv10]} >

                       <Text style={[commonStyles.h12RedTwo500,mh10]} >Credit Note Id : #CN - 000016</Text>
                    </View>
                    <CustomTextInputField name={formKeys.customerName} control={control} placeholder={labels.enterCustomerName} label={labels.customerName} showIcon={true} subHead='Add New' color={colors.primary} />
                    <CustomTextInputField name={formKeys.invoiceDate} control={control} placeholder={labels.selectDate} label={labels.creditNoteDate} showIcon={true} showCalendar={true} iconName='calendar' iconType='Feather' iconSize={16} />
                    <CustomTextInputField name={formKeys.dueDate} control={control} placeholder={labels.selectDate} label={labels.dueDate} showIcon={true} showCalendar={true} iconName='calendar' iconType='Feather' iconSize={16} />
                    <CustomTextInputField name={formKeys.referenceNumber} control={control} placeholder={labels.enterReferenceNumber} label={labels.referenceNumber} />
                    {
                        isAddedProductAvailable ? (
                            <View>
                                <View style={flexRow}>
                                   <Text style={[commonStyles.h14blackOne600,mv5]} >{labels.products}</Text>
                                    <Text style={[commonStyles.h14Danger400]}>*</Text>
                                </View>
                                <View style={[{ height: 300, width: '100%', borderWidth: 1, borderColor: colors.greyTwo, borderRadius: 8 }]}>
                                    <View style={[flexRow, justifyBetween, alignItemCenter, mv10, mh10]}>
                                        <View style={[flexRow, justifyBetween, alignItemCenter]}>
                                            <CustomIcon color={colors.blackTwo} name='chevron-small-up' size={14} type='Entypo' />
                                            <Text style={[commonStyles.h14BlackTwo400]}>{labels.products}(2)</Text>
                                        </View>
                                        <Text style = {[commonStyles.h12Primary400]}>Add Item</Text>
                                    </View>
                                    <View style={[alignItemCenter, justifyCenter]}>
                                        {
                                            addedProductData.map((item) => {
                                                return (
                                                    <View style={[{ height: 100, width: '95%', backgroundColor: colors.greyOne, borderRadius: 8 }, mb5]} key={item.id}>
                                                        <View style={[flexRow, justifyBetween, mh10, mv10]}>
                                                            <Text style={[commonStyles.h18BlackOne700,{}]}>{item.name}</Text>
                                                            <Text style={[commonStyles.h18BlackOne700,{}]}>{item.amount}</Text>
                                                        </View>
                                                        <View style={[alignItemCenter]}>
                                                            <DashedLine height={300} color={colors.greyTwo} dashLength={10} dashGap={0} />
                                                        </View>
                                                        <View style={[flexRow, alignItemCenter, justifyBetween]}>
                                                            <View style={[flexRow, alignItemCenter, justifyBetween]}>
                                                                <View style={[mt10, mh10]}>
                                                                    <Text style={[commonStyles.h12blackTwo600]}>Qty*Rate</Text>
                                                                    <Text style={[commonStyles.h12blackTwo600,mt5]} >Discount & Tax</Text>
                                                                </View>
                                                                <View style={[mt10, mh10]}>
                                                                    <Text style={[commonStyles.h12blackTwo600]}>{item.qty}</Text>
                                                                    <Text style={[commonStyles.h12blackTwo600,mt5]} >{item.dicount}</Text>
                                                                </View>
                                                            </View>
                                                            <View style={[flexRow, alignItemCenter, justifyBetween]}>
                                                                <View style={[mt10, mh10]}>
                                                                    <CustomIcon color={colors.blackTwo} name='edit' size={14} type='Feather' />
                                                                </View>
                                                                <View style={[mt10, mh10]}>
                                                                    <CustomIcon color={colors.blackTwo} name='delete-forever-outline' size={18} type='MaterialCommunityIcons' />
                                                                </View>
                                                            </View>
                                                        </View>
                                                    </View>
                                                )
                                            })
                                        }
                                    </View>
                                    <View style={[alignItemCenter, mv10]}>
                                        <DashedLine height={320} color={colors.greyTwo} dashLength={10} dashGap={5} />
                                    </View>
                                    <View style={[flexRow, justifyBetween, mh15]}>
                                        <Text style={[commonStyles.h18BlackOne700,{}]}>Total</Text>
                                        <Text style={[commonStyles.h18BlackOne700,{}]}>$21457</Text>
                                    </View>
                                </View>
                            </View>
                        ) : (
                            <CustomNavigateBox name='Add Product' label={labels.products} onNavigate={() => navigation.navigate(screenName.ProductScreen, { fromScreen: labels.creditNote } as never)} color={colors.primary} />
                        )
                    }
                    <CustomTextInputField name={formKeys.selectBank} control={control} placeholder={labels.select} label={labels.selectBank} showIcon={true} subHead='Add New' color={colors.primary} subHeadOnPress={openModal} />
                    <MultiLineTextBox
                        placeHolder={labels.notes}
                        label={labels.notes}
                        value={notes}
                        onChangeValue={() => setNotes(notes)}
                        multiline={true}
                        keyboardType="default"
                        height={100}
                        maxLength={200}
                        disable={false}
                    />
                    <MultiLineTextBox
                        placeHolder={labels.terms}
                        label={labels.termsConditions}
                        value={termsCondition}
                        onChangeValue={() => setTermsCondition(termsCondition)}
                        multiline={true}
                        keyboardType="default"
                        height={100}
                        maxLength={200}
                        disable={false}
                    />
                    <View style={mv10}>
                       <Text style={commonStyles.h14blackOne600} >Invoice Summary</Text>
                        <View style={[{ height: 165, width: '100%', backgroundColor: colors.white, borderWidth: 1, borderColor: colors.greyTwo, borderRadius: 8 }, mv10]}>
                            <View style={[mh10, mv10]}>
                                <View style={[flexRow, justifyBetween]}>
                                    <Text style={[commonStyles.h14blackTwo500]}>Amount</Text>
                                    <Text style={[commonStyles.h14blackTwo500]}>$0</Text>
                                </View>
                                <View style={[flexRow, justifyBetween, mt10]}>
                                    <Text style={[commonStyles.h14blackTwo500]}>Discount</Text>
                                    <Text style={[commonStyles.h14blackTwo500]}>$0</Text>
                                </View>
                                <View style={[flexRow, justifyBetween, mt10]}>
                                    <Text style={[commonStyles.h14blackTwo500]}>Tax</Text>
                                    <Text style={[commonStyles.h14blackTwo500]}>$0</Text>
                                </View>
                                <View style={[flexRow, justifyBetween, alignItemCenter, mt5]}>
                                    <View style={[flexRow, justifyCenter, mt10]}>
                                        <Text style={[commonStyles.h14blackTwo500,mr5]} >Round Off</Text>
                                        <MultiSelectOption selectedColor={colors.primary} unselectedColor={colors.danger} isSelected={checkBox} onSelect={handleCheckBox} />
                                    </View>
                                    <Text style={[commonStyles.h14blackTwo500]}>$0</Text>
                                </View>
                                <View style={[alignSelfCenter, mv10]}>
                                    <DashedLine height={300} color={colors.greyEight} dashGap={4} />
                                </View>
                                <View style={[flexRow, justifyBetween]}>
                                    <Text style={[commonStyles.h18BlackOne700,{}]}>Total</Text>
                                    <Text style={[commonStyles.h18BlackOne700,{}]}>$0</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                    <View style={mv10}>
                       <Text style={commonStyles.h14blackOne600} >Signature</Text>
                        <View style={[flexRow, justifyBetween, alignItemCenter]}>
                            {
                                signature.map((item) => {
                                    return (
                                        <View style={[flexRow, mv10, { height: 40, width: '48%', borderWidth: 1, borderColor: selectedSignature === item.name ? colors.primary : colors.grey, borderRadius: 8 }, alignItemCenter, justifyStart]} key={item.id}>
                                            <View style={ml15}>
                                                <RadioBtn
                                                    key={item.id}
                                                    selected={selectedSignature === item.name}
                                                    onPress={() => handleSignatureSelect(item.name)}
                                                />
                                            </View>
                                            <Text style={[ml10, { color: selectedSignature === item.name ? colors.primary : colors.grey }]}>{item.name}</Text>
                                        </View>
                                    )
                                })
                            }
                        </View>
                    </View>
                    <CustomTextInputField name={formKeys.selectSignature} control={control} placeholder={labels.select} label={labels.selectSignature} showIcon={true} />
                </View>
                <View style={[flexRow, justifyBetween, mt10, mh10]}>
                    <OnboardingButton
                        width={160}
                        title={labels.reset}
                        onChange={handleCancelBtnClick}
                        backgroundColor={isActiveBtn ? colors.primary : colors.greySeven}
                        color={isActiveBtn ? colors.white : colors.blackOne}
                    />
                    <OnboardingButton
                        width={160}
                        title={labels.saveChanges}
                        onChange={handleSaveBtnClick}
                        backgroundColor={isActiveBtn ? colors.greySeven : colors.primary}
                        color={isActiveBtn ? colors.blackOne : colors.white}
                    />
                </View>
            </ScrollView>
            <CustomModal children={<AddBankDetails onSave={addSaveBtn} onCancel={closeModal} />} visible={addBankDetailsModal} onClose={closeModal} height={'80%'} />
            <CustomModal children={<AddTax onSave={addSaveBtn} onCancel={closeModal} />} visible={addTaxModal} onClose={closeModal} height={'80%'} />
        </View>
    )
}

const styles = StyleSheet.create({
    bottomButtonsContainer: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
});

export default AddCreditNotesScreen