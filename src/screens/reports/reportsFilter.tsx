import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { ScrollView, StyleSheet, View } from 'react-native';
import { OnboardingButton } from '../../components/commonButton';
import { CustomTextInputField, CustomerSearchExpanded, ExpandableSection, ExpandedByStatusComponent } from '../../components/commonComponents';
import { expenseReportData, paymentReportData, purchaseReportData, purchaseTaxData, quotationReportData } from '../../utils/data/reportsData';
import { DevWidth } from '../../utils/device';
import { labels } from '../../utils/labels';
import { colors } from '../../utils/theme/colors';
import { alignItemCenter, flex1, flexRow, justifyBetween, mv10 } from '../../utils/theme/commonStyles';
import { ModalTopText } from '../inventory/stockDetails';
import { commonStyles } from '../../utils/commonStyles';

export type SettingsComponentsProps = {
    onSave: () => void;
    onCancel: () => void;
};

// const formKeys = {
//     dueDate: 'dueDate',
// }

// const {
//     control,
// } = useForm();



// const ExpandedDateComponent = () => {
//     return (
//         <View style={[flexRow, justifyBetween, alignItemCenter]}>
//             <CustomTextInputField width={150} name={formKeys.dueDate} control={control} placeholder={labels.selectDate} label={labels.from} showIcon={true} showCalendar={true} iconName='calendar' iconType='Feather' iconSize={16} showStarSymbol={false}/>
//             <CustomTextInputField width={150} name={formKeys.dueDate} control={control} placeholder={labels.selectDate} label={labels.to} showIcon={true} showCalendar={true} iconName='calendar' iconType='Feather' iconSize={16} showStarSymbol={false}/>
//         </View>
//     )
// }

export const PurchaseReportFilter = ({ onSave, onCancel }: SettingsComponentsProps) => {
    const [isActiveBtn, setIsActiveBtn] = useState(false);
    const [searchValueProductType, setSearchValueProductType] = useState<string>('');
    const [searchValuePurchaseId, setSearchPurchaseId] = useState<string>('');

    const purchaseVendor = purchaseReportData.map(item => item.productName);
    const productId = purchaseReportData.map(item => item.code);

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
                                    placeholder="Search Product"
                                    data={purchaseVendor} 
                                    onChangeText={setSearchValueProductType}
                                    value={searchValueProductType}
                                />
                            }
                        />
                         <View style={[commonStyles.bottomWidth,mv10]} />

                        <ExpandableSection
                            text={'Product Id'}
                            renderingComponent={
                                <CustomerSearchExpanded
                                    isCheckBoxNeeded={true}
                                    placeholder="Search Prouct Id"
                                    data={productId} 
                                    onChangeText={setSearchPurchaseId}
                                    value={searchValuePurchaseId}
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

export const PurchaseReturnReportFilter = ({ onSave, onCancel }: SettingsComponentsProps) => {
    const [isActiveBtn, setIsActiveBtn] = useState(false);
    const [searchValueProductType, setSearchValueProductType] = useState<string>('');
    const [searchValuePurchaseId, setSearchPurchaseId] = useState<string>('');



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
    const formKeys = {
        dueDate: 'dueDate',
    }

    const {
        control,
    } = useForm();

    const purchaseVendor = purchaseReportData.map(item => item.productName);
    const productId = purchaseReportData.map(item => item.code);

    const ExpandedDateComponent = () => {
        return (
            <View style={[flexRow, justifyBetween, alignItemCenter]}>
                <CustomTextInputField width={150} name={formKeys.dueDate} control={control} placeholder={labels.selectDate} label={labels.from} showIcon={true} showCalendar={true} iconName='calendar' iconType='Feather' iconSize={16} showStarSymbol={false}/>
                <CustomTextInputField width={150} name={formKeys.dueDate} control={control} placeholder={labels.selectDate} label={labels.to} showIcon={true} showCalendar={true} iconName='calendar' iconType='Feather' iconSize={16} showStarSymbol={false}/>
            </View>
        )
    }

    
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
                                    placeholder="Search Product"
                                    data={purchaseVendor} 
                                    onChangeText={setSearchValueProductType}
                                    value={searchValueProductType}
                                />
                            }
                        />
                         <View style={[commonStyles.bottomWidth,mv10]}  />

                        <ExpandableSection
                            text={labels.purchaseOrderID}
                            renderingComponent={
                                <CustomerSearchExpanded
                                    isCheckBoxNeeded={true}
                                    placeholder="Search Purchase order Id"
                                    data={productId} 
                                    onChangeText={setSearchPurchaseId}
                                    value={searchValuePurchaseId}
                                />
                            }
                        />
                         <View style={[commonStyles.bottomWidth,mv10]}  />
                        <ExpandableSection
                        text="Due Date"
                        renderingComponent={<ExpandedDateComponent />}
                    />
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

export const SalesReportFilter = ({ onSave, onCancel }: SettingsComponentsProps) => {
    const [isActiveBtn, setIsActiveBtn] = useState(false);
    const [searchValueProductType, setSearchValueProductType] = useState<string>('');
    const [searchValuePurchaseId, setSearchPurchaseId] = useState<string>('');
    const [searchCategory, setSearchCategory] = useState<string>('');




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
    const formKeys = {
        dueDate: 'dueDate',
    }

    const {
        control,
    } = useForm();

    const purchaseVendor = purchaseReportData.map(item => item.productName);
    const productId = purchaseReportData.map(item => item.code);
    const category = purchaseReportData.map(item => item.productType);


    const ExpandedDateComponent = () => {
        return (
            <View style={[flexRow, justifyBetween, alignItemCenter]}>
                <CustomTextInputField width={150} name={formKeys.dueDate} control={control} placeholder={labels.selectDate} label={labels.from} showIcon={true} showCalendar={true} iconName='calendar' iconType='Feather' iconSize={16} showStarSymbol={false}/>
                <CustomTextInputField width={150} name={formKeys.dueDate} control={control} placeholder={labels.selectDate} label={labels.to} showIcon={true} showCalendar={true} iconName='calendar' iconType='Feather' iconSize={16} showStarSymbol={false}/>
            </View>
        )
    }

    
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
                                    placeholder="Search Product"
                                    data={purchaseVendor} 
                                    onChangeText={setSearchValueProductType}
                                    value={searchValueProductType}
                                />
                            }
                        />
                         <View style={[commonStyles.bottomWidth,mv10]} />

                        <ExpandableSection
                            text={labels.purchaseOrderID}
                            renderingComponent={
                                <CustomerSearchExpanded
                                    isCheckBoxNeeded={true}
                                    placeholder="Search Purchase order Id"
                                    data={productId} 
                                    onChangeText={setSearchPurchaseId}
                                    value={searchValuePurchaseId}
                                />
                            }
                        />
                         <View style={[commonStyles.bottomWidth,mv10]}  />
                        <ExpandableSection
                            text={labels.category}
                            renderingComponent={
                                <CustomerSearchExpanded
                                    isCheckBoxNeeded={true}
                                    placeholder="Search Category"
                                    data={category} 
                                    onChangeText={setSearchCategory}
                                    value={searchCategory}
                                />
                            }
                        />
                         <View style={[commonStyles.bottomWidth,mv10]}  />
                        <ExpandableSection
                        text="Due Date"
                        renderingComponent={<ExpandedDateComponent />}
                    />
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

export const QuotationReportFilter = ({ onSave, onCancel }: SettingsComponentsProps) => {
    const [isActiveBtn, setIsActiveBtn] = useState(false);
    const [searchValueProductType, setSearchValueProductType] = useState<string>('');
    const [searchValuePurchaseId, setSearchPurchaseId] = useState<string>('');



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
    const formKeys = {
        dueDate: 'dueDate',
    }

    const {
        control,
    } = useForm();

    const purchaseVendor = quotationReportData.map(item => item.name);
    const productId = purchaseReportData.map(item => item.code);

    const ExpandedDateComponent = () => {
        return (
            <View style={[flexRow, justifyBetween, alignItemCenter]}>
                <CustomTextInputField width={150} name={formKeys.dueDate} control={control} placeholder={labels.selectDate} label={labels.from} showIcon={true} showCalendar={true} iconName='calendar' iconType='Feather' iconSize={16} showStarSymbol={false}/>
                <CustomTextInputField width={150} name={formKeys.dueDate} control={control} placeholder={labels.selectDate} label={labels.to} showIcon={true} showCalendar={true} iconName='calendar' iconType='Feather' iconSize={16} showStarSymbol={false}/>
            </View>
        )
    }

    
    return (
        <View style={[flex1]}>
            <ScrollView>
                <View style={{ paddingBottom: 80 }}>
                    <ModalTopText title={labels.filter} iconPress={() => { } } toggleBtn={()=>{}} />
                    <View style={[mv10]}>
                        <ExpandableSection
                            text={labels.customer}
                            renderingComponent={
                                <CustomerSearchExpanded
                                    isCheckBoxNeeded={true}
                                    placeholder="Search Customer"
                                    data={purchaseVendor} 
                                    onChangeText={setSearchValueProductType}
                                    value={searchValueProductType}
                                />
                            }
                        />
                         <View style={[commonStyles.bottomWidth,mv10]}  />

                        <ExpandableSection
                            text={labels.quotationId}
                            renderingComponent={
                                <CustomerSearchExpanded
                                    isCheckBoxNeeded={true}
                                    placeholder="Search Quotation Id"
                                    data={productId} 
                                    onChangeText={setSearchPurchaseId}
                                    value={searchValuePurchaseId}
                                />
                            }
                        />
                         <View style={[commonStyles.bottomWidth,mv10]}  />
                        <ExpandableSection
                        text="Due Date"
                        renderingComponent={<ExpandedDateComponent />}
                    />
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

export const PaymentReportFilter = ({ onSave, onCancel }: SettingsComponentsProps) => {
    const [isActiveBtn, setIsActiveBtn] = useState(false);
    const [searchValueProductType, setSearchValueProductType] = useState<string>('');

    const purchaseVendor = paymentReportData.map(item => item.name);

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
  

    
    return (
        <View style={[flex1]}>
            <ScrollView>
                <View style={{ paddingBottom: 80 }}>
                    <ModalTopText title={labels.filter} iconPress={() => { } } toggleBtn={()=>{}} />
                    <View style={[mv10]}>
                        <ExpandableSection
                            text={labels.customer}
                            renderingComponent={
                                <CustomerSearchExpanded
                                    isCheckBoxNeeded={true}
                                    placeholder="Search Customer"
                                    data={purchaseVendor} 
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

export const StockReportFilter = ({ onSave, onCancel }: SettingsComponentsProps) => {
    const [isActiveBtn, setIsActiveBtn] = useState(false);
    const [searchValueProductType, setSearchValueProductType] = useState<string>('');
    const [searchValuePurchaseId, setSearchPurchaseId] = useState<string>('');
    const [searchCategory, setSearchCategory] = useState<string>('');




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

    const purchaseVendor = purchaseReportData.map(item => item.productName);
    const productId = purchaseReportData.map(item => item.code);
    const category = purchaseReportData.map(item => item.productType);


    
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
                                    placeholder="Search Product"
                                    data={purchaseVendor} 
                                    onChangeText={setSearchValueProductType}
                                    value={searchValueProductType}
                                />
                            }
                        />
                         <View style={[commonStyles.bottomWidth,mv10]} />

                        <ExpandableSection
                            text={labels.purchaseOrderID}
                            renderingComponent={
                                <CustomerSearchExpanded
                                    isCheckBoxNeeded={true}
                                    placeholder="Search Purchase order Id"
                                    data={productId} 
                                    onChangeText={setSearchPurchaseId}
                                    value={searchValuePurchaseId}
                                />
                            }
                        />
                         <View style={[commonStyles.bottomWidth,mv10]} />
                        <ExpandableSection
                            text={labels.category}
                            renderingComponent={
                                <CustomerSearchExpanded
                                    isCheckBoxNeeded={true}
                                    placeholder="Search Category"
                                    data={category} 
                                    onChangeText={setSearchCategory}
                                    value={searchCategory}
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

export const IncomeReportFilter = ({ onSave, onCancel }: SettingsComponentsProps) => {
    const [isActiveBtn, setIsActiveBtn] = useState(false);
    const [searchValueProductType, setSearchValueProductType] = useState<string>('');
    const [searchValuePurchaseId, setSearchPurchaseId] = useState<string>('');



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
    const formKeys = {
        dueDate: 'dueDate',
    }

    const {
        control,
    } = useForm();

    const purchaseVendor = paymentReportData.map(item => item.name);
    const paymentMode = ['Cash','Cheque']

    const ExpandedDateComponent = () => {
        return (
            <View style={[flexRow, justifyBetween, alignItemCenter]}>
                <CustomTextInputField width={150} name={formKeys.dueDate} control={control} placeholder={labels.selectDate} label={labels.from} showIcon={true} showCalendar={true} iconName='calendar' iconType='Feather' iconSize={16} showStarSymbol={false}/>
                <CustomTextInputField width={150} name={formKeys.dueDate} control={control} placeholder={labels.selectDate} label={labels.to} showIcon={true} showCalendar={true} iconName='calendar' iconType='Feather' iconSize={16} showStarSymbol={false}/>
            </View>
        )
    }

    
    return (
        <View style={[flex1]}>
            <ScrollView>
                <View style={{ paddingBottom: 80 }}>
                    <ModalTopText title={labels.filter} iconPress={() => { } } toggleBtn={()=>{}} />
                    <View style={[mv10]}>
                        <ExpandableSection
                            text={labels.customer}
                            renderingComponent={
                                <CustomerSearchExpanded
                                    isCheckBoxNeeded={true}
                                    placeholder="Search Customer"
                                    data={purchaseVendor} 
                                    onChangeText={setSearchValueProductType}
                                    value={searchValueProductType}
                                />
                            }
                        />
                         <View style={[commonStyles.bottomWidth,mv10]} />
                        
                        <ExpandableSection
                        text="Due Date"
                        renderingComponent={<ExpandedDateComponent />}
                    />
                         <View style={[commonStyles.bottomWidth,mv10]} />
                        <ExpandableSection
                        text={labels.modeOfPayment}
                        renderingComponent={<ExpandedByStatusComponent data={paymentMode} />}
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

export const PurchaseTaxReportFilter = ({ onSave, onCancel }: SettingsComponentsProps) => {
    const [isActiveBtn, setIsActiveBtn] = useState(false);
    const [searchValueProductType, setSearchValueProductType] = useState<string>('');
    const [searchValuePurchaseId, setSearchPurchaseId] = useState<string>('');



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
    const formKeys = {
        dueDate: 'dueDate',
    }

    const {
        control,
    } = useForm();

    const purchaseVendor = purchaseTaxData.map(item => item.name);
    const paymentMode = ['Cash','Cheque']

    const ExpandedDateComponent = () => {
        return (
            <View style={[flexRow, justifyBetween, alignItemCenter]}>
                <CustomTextInputField width={150} name={formKeys.dueDate} control={control} placeholder={labels.selectDate} label={labels.from} showIcon={true} showCalendar={true} iconName='calendar' iconType='Feather' iconSize={16} showStarSymbol={false}/>
                <CustomTextInputField width={150} name={formKeys.dueDate} control={control} placeholder={labels.selectDate} label={labels.to} showIcon={true} showCalendar={true} iconName='calendar' iconType='Feather' iconSize={16} showStarSymbol={false}/>
            </View>
        )
    }

    
    return (
        <View style={[flex1]}>
            <ScrollView>
                <View style={{ paddingBottom: 80 }}>
                    <ModalTopText title={labels.filter} iconPress={() => { } } toggleBtn={()=>{}} />
                    <View style={[mv10]}>
                        <ExpandableSection
                            text={labels.vendor}
                            renderingComponent={
                                <CustomerSearchExpanded
                                    isCheckBoxNeeded={true}
                                    placeholder="Search Vendor"
                                    data={purchaseVendor} 
                                    onChangeText={setSearchValueProductType}
                                    value={searchValueProductType}
                                />
                            }
                        />
                         <View style={[commonStyles.bottomWidth,mv10]} />
                        
                        <ExpandableSection
                        text="Due Date"
                        renderingComponent={<ExpandedDateComponent />}
                    />
                         <View style={[commonStyles.bottomWidth,mv10]} />
                        <ExpandableSection
                        text={labels.modeOfPayment}
                        renderingComponent={<ExpandedByStatusComponent data={paymentMode} />}
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

export const SalesTaxReportFilter = ({ onSave, onCancel }: SettingsComponentsProps) => {
    const [isActiveBtn, setIsActiveBtn] = useState(false);
    const [searchValueProductType, setSearchValueProductType] = useState<string>('');
    const [searchValuePurchaseId, setSearchPurchaseId] = useState<string>('');



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
    const formKeys = {
        dueDate: 'dueDate',
    }

    const {
        control,
    } = useForm();

    const purchaseVendor = paymentReportData.map(item => item.name);
    const paymentMode = ['Cash','Cheque']

    const ExpandedDateComponent = () => {
        return (
            <View style={[flexRow, justifyBetween, alignItemCenter]}>
                <CustomTextInputField width={150} name={formKeys.dueDate} control={control} placeholder={labels.selectDate} label={labels.from} showIcon={true} showCalendar={true} iconName='calendar' iconType='Feather' iconSize={16} showStarSymbol={false}/>
                <CustomTextInputField width={150} name={formKeys.dueDate} control={control} placeholder={labels.selectDate} label={labels.to} showIcon={true} showCalendar={true} iconName='calendar' iconType='Feather' iconSize={16} showStarSymbol={false}/>
            </View>
        )
    }

    
    return (
        <View style={[flex1]}>
            <ScrollView>
                <View style={{ paddingBottom: 80 }}>
                    <ModalTopText title={labels.filter} iconPress={() => { } } toggleBtn={()=>{}} />
                    <View style={[mv10]}>
                        <ExpandableSection
                            text={labels.customer}
                            renderingComponent={
                                <CustomerSearchExpanded
                                    isCheckBoxNeeded={true}
                                    placeholder="Search Customer"
                                    data={purchaseVendor} 
                                    onChangeText={setSearchValueProductType}
                                    value={searchValueProductType}
                                />
                            }
                        />
                         <View style={[commonStyles.bottomWidth,mv10]} />
                        
                        <ExpandableSection
                        text="Due Date"
                        renderingComponent={<ExpandedDateComponent />}
                    />
                         <View style={[commonStyles.bottomWidth,mv10]} />
                        <ExpandableSection
                        text={labels.modeOfPayment}
                        renderingComponent={<ExpandedByStatusComponent data={paymentMode} />}
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

export const ExpensesReportFilter = ({ onSave, onCancel }: SettingsComponentsProps) => {
    const [isActiveBtn, setIsActiveBtn] = useState(false);
    const [searchValueProductType, setSearchValueProductType] = useState<string>('');
    const [searchCategory, setSearchCategory] = useState<string>('');


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
    const formKeys = {
        dueDate: 'dueDate',
    }

    const {
        control,
    } = useForm();

    const purchaseVendor = expenseReportData.map(item => item.name);
    const category = expenseReportData.map(item=>item.category)
    const paymentMode = ['Pain','Pending','Cancelled']

    const ExpandedDateComponent = () => {
        return (
            <View style={[flexRow, justifyBetween, alignItemCenter]}>
                <CustomTextInputField width={150} name={formKeys.dueDate} control={control} placeholder={labels.selectDate} label={labels.from} showIcon={true} showCalendar={true} iconName='calendar' iconType='Feather' iconSize={16} showStarSymbol={false}/>
                <CustomTextInputField width={150} name={formKeys.dueDate} control={control} placeholder={labels.selectDate} label={labels.to} showIcon={true} showCalendar={true} iconName='calendar' iconType='Feather' iconSize={16} showStarSymbol={false}/>
            </View>
        )
    }

    
    return (
        <View style={[flex1]}>
            <ScrollView>
                <View style={{ paddingBottom: 80 }}>
                    <ModalTopText title={labels.filter} iconPress={() => { } } toggleBtn={()=>{}} />
                    <View style={[mv10]}>
                        <ExpandableSection
                            text={labels.customer}
                            renderingComponent={
                                <CustomerSearchExpanded
                                    isCheckBoxNeeded={true}
                                    placeholder="Search Customer"
                                    data={purchaseVendor} 
                                    onChangeText={setSearchValueProductType}
                                    value={searchValueProductType}
                                />
                            }
                        />
                         <View style={[commonStyles.bottomWidth,mv10]} />
                        <ExpandableSection
                            text={labels.category}
                            renderingComponent={
                                <CustomerSearchExpanded
                                    isCheckBoxNeeded={true}
                                    placeholder="Search Category"
                                    data={category} 
                                    onChangeText={setSearchCategory}
                                    value={searchCategory}
                                />
                            }
                        />
                         <View style={[commonStyles.bottomWidth,mv10]} />
                        <ExpandableSection
                        text="Due Date"
                        renderingComponent={<ExpandedDateComponent />}
                    />
                         <View style={[commonStyles.bottomWidth,mv10]} />
                        <ExpandableSection
                        text={'By Status'}
                        renderingComponent={<ExpandedByStatusComponent data={paymentMode} />}
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

export const ProfitOrLossReportFilter = ({ onSave, onCancel }: SettingsComponentsProps) => {
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
    const formKeys = {
        dueDate: 'dueDate',
    }

    const {
        control,
    } = useForm();

    const data = ['2022','2023','2024']

    const ExpandedDateComponent = () => {
        return (
            <View >
                <CustomTextInputField  name={formKeys.dueDate} control={control} placeholder={labels.selectDate} label={labels.from} showIcon={true} showCalendar={true} iconName='calendar' iconType='Feather' iconSize={16} showStarSymbol={false}/>
                <CustomTextInputField name={formKeys.dueDate} control={control} placeholder={labels.selectDate} label={labels.to} showIcon={true} showCalendar={true} iconName='calendar' iconType='Feather' iconSize={16} showStarSymbol={false}/>
            </View>
        )
    }

    
    return (
        <View style={[flex1]}>
            <ScrollView>
                <View style={{ paddingBottom: 80 }}>
                    <ModalTopText title={labels.filter} iconPress={() => { } } toggleBtn={()=>{}} />
                    <View style={[mv10]}>
                        <ExpandableSection
                            text={'Period'}
                            renderingComponent={
                                <CustomerSearchExpanded
                                    isCheckBoxNeeded={true}
                                    placeholder="This Year"
                                    data={data} 
                                    onChangeText={setSearchValueProductType}
                                    value={searchValueProductType}
                                />
                            }
                        />
                         <View style={[commonStyles.bottomWidth,mv10]} />
                        
                        <ExpandableSection
                        text="Due Date"
                        renderingComponent={<ExpandedDateComponent />}
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

