import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { ScrollView, StyleSheet, View } from 'react-native';
import { OnboardingButton } from '../../components/commonButton';
import { CustomerSearchExpanded, ExpandableSection } from '../../components/commonComponents';
import { categoriesListData, productsListData, unitsListData } from '../../utils/data/productsListData';
import { DevWidth } from '../../utils/device';
import { labels } from '../../utils/labels';
import { colors } from '../../utils/theme/colors';
import { flex1, mv10 } from '../../utils/theme/commonStyles';
import { ModalTopText } from '../inventory/stockDetails';
import { commonStyles } from '../../utils/commonStyles';

export type SettingsComponentsProps = {
    onSave: () => void;
    onCancel: () => void;
};

export const ProductFilter = ({ onSave, onCancel }: SettingsComponentsProps) => {
    const [isActiveBtn, setIsActiveBtn] = useState(false);
    const [searchValueProductName, setSearchValueProductName] = useState('');
    const [searchValueProductType, setSearchValueProductType] = useState('');
    const [searchValueProductCategory, setSearchValueProductCategory] = useState('');

    const [noData, setNoData] = useState(false); 

    const handleCancelBtnClick = () => {
        setIsActiveBtn(true);
        onCancel();
    };

    const handleSaveBtnClick = () => {
        setIsActiveBtn(false);
        if (!checkDataExists()) {
            setNoData(true);
        } else {
            setNoData(false);
            onSave();
        }
    };

    const checkDataExists = () => {
        return searchValueProductName.trim() !== '' || searchValueProductType.trim() !== '' || searchValueProductCategory.trim() !== '';
    };

    const { control } = useForm();

    // Extracting product names for the first search and product types for the second search
    const productNames = productsListData.map(item => item.productName);
    const productTypes = productsListData.map(item => item.code);
    const productCategory = productsListData.map(item => item.productType);


    return (
        <View style={[flex1]}>
            <ScrollView>
                <View style={{ paddingBottom: 80 }}>
                    <ModalTopText title={labels.filter} iconPress={() => { } } toggleBtn={()=>{}} />
                    <View style={[mv10]}>
                        <ExpandableSection
                            text={labels.product}
                            renderingComponent={
                                <CustomerSearchExpanded
                                    isCheckBoxNeeded={true}
                                    placeholder="Search Product Name"
                                    data={productNames} 
                                    onChangeText={setSearchValueProductName}
                                    value={searchValueProductName}
                                />
                            }
                        />
                         <View style={[commonStyles.bottomWidth,mv10]} />
                        <ExpandableSection
                            text={'ProductType'}
                            renderingComponent={
                                <CustomerSearchExpanded
                                    isCheckBoxNeeded={true}
                                    placeholder="Search Product Type"
                                    data={productTypes} 
                                    onChangeText={setSearchValueProductType}
                                    value={searchValueProductType}
                                />
                            }
                        />
                         <View style={[commonStyles.bottomWidth,mv10]} />
                        <ExpandableSection
                            text={'Category'}
                            renderingComponent={
                                <CustomerSearchExpanded
                                    isCheckBoxNeeded={true}
                                    placeholder="Search Categories"
                                    data={productCategory} 
                                    onChangeText={setSearchValueProductCategory}
                                    value={searchValueProductCategory}
                                />
                            }
                        />
                         <View style={[commonStyles.bottomWidth,mv10]} />
                    </View>
                </View>
            </ScrollView>
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
                    title={labels.apply}
                    onChange={handleSaveBtnClick}
                    backgroundColor={isActiveBtn ? colors.greySeven : colors.primary}
                    color={isActiveBtn ? colors.blackOne : colors.white}
                />
            </View>
        </View>
    );
};

export const CategoryFilter = ({ onSave, onCancel }: SettingsComponentsProps) => {
    const [isActiveBtn, setIsActiveBtn] = useState(false);
    const [searchValueProductType, setSearchValueProductType] = useState<string>('');


    const [noData, setNoData] = useState(false); 

    const handleCancelBtnClick = () => {
        setIsActiveBtn(true);
        onCancel();
    };

    const handleSaveBtnClick = () => {
        setIsActiveBtn(false);
        if (!checkDataExists()) {
            setNoData(true);
        } else {
            setNoData(false);
            onSave();
        }
    };

    const checkDataExists = () => {
        return (
            searchValueProductType.trim() !== '' 
            )
    };

    const productTypes = categoriesListData.map(item => item.productType);

    return (
        <View style={[flex1]}>
            <ScrollView>
                <View style={{ paddingBottom: 80 }}>
                    <ModalTopText title={labels.filter} iconPress={() => { } } toggleBtn={()=>{}} />
                    <View style={[mv10]}>
                        <ExpandableSection
                            text={labels.category}
                            renderingComponent={
                                <CustomerSearchExpanded
                                    isCheckBoxNeeded={true}
                                    placeholder="Search Category"
                                    data={productTypes} 
                                    onChangeText={setSearchValueProductType}
                                    value={searchValueProductType}
                                />
                            }
                        />
                         <View style={[commonStyles.bottomWidth,mv10]} />
                    </View>
                </View>
            </ScrollView>
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
                    title={labels.apply}
                    onChange={handleSaveBtnClick}
                    backgroundColor={isActiveBtn ? colors.greySeven : colors.primary}
                    color={isActiveBtn ? colors.blackOne : colors.white}
                />
            </View>
        </View>
    );
};

export const UnitFilter = ({ onSave, onCancel }: SettingsComponentsProps) => {
    const [isActiveBtn, setIsActiveBtn] = useState(false);
    const [searchValueProductType, setSearchValueProductType] = useState<string>('');


    const [noData, setNoData] = useState(false); 

    const handleCancelBtnClick = () => {
        setIsActiveBtn(true);
        onCancel();
    };

    const handleSaveBtnClick = () => {
        setIsActiveBtn(false);
        if (!checkDataExists()) {
            setNoData(true);
        } else {
            setNoData(false);
            onSave();
        }
    };

    const checkDataExists = () => {
        return (
            searchValueProductType.trim() !== '' 
            )
    };

    const productTypes = unitsListData.map(item => item.productType);

    return (
        <View style={[flex1]}>
            <ScrollView>
                <View style={{ paddingBottom: 80 }}>
                    <ModalTopText title={labels.filter} iconPress={() => { } } toggleBtn={()=>{}} />
                    <View style={[mv10]}>
                        <ExpandableSection
                            text={labels.units}
                            renderingComponent={
                                <CustomerSearchExpanded
                                    isCheckBoxNeeded={true}
                                    placeholder="Search Unit"
                                    data={productTypes} 
                                    onChangeText={setSearchValueProductType}
                                    value={searchValueProductType}
                                />
                            }
                        />
                         <View style={[commonStyles.bottomWidth,mv10]} />
                    </View>
                </View>
            </ScrollView>
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
                    title={labels.apply}
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

export default ProductFilter;
