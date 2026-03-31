
import { useNavigation } from "@react-navigation/native";
import React, { JSX, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Animated, Image, KeyboardTypeOptions, Linking, ScrollView, Share, StyleProp, StyleSheet, Text, TextInput, TouchableOpacity, View, ViewStyle } from "react-native";
import { ModalTopText } from "../screens/inventory/stockDetails";
import { actionData } from "../utils/data/invoiceData";
import CustomIcon from "../utils/icons";
import { labels } from "../utils/labels";
import { screenName } from "../utils/screenNames";
import { AdjustmentIcon } from "../utils/svg";
import { colors } from "../utils/theme/colors";
import { alignItemCenter, alignSelfCenter, flexRow, justifyAround, justifyBetween, justifyCenter, justifyEvenly, justifyStart, mh10, mh5, ml10, ml5, mr10, mt10, mt15, mt5, mv10, mv5, p5 } from "../utils/theme/commonStyles";
import { minLengthValidation, requiredValidation, validationSchema } from "../utils/validationConfig";
import { CustomTextInput } from "./commonInputFields";
import CustomModal from "./commonModal";
import { DashedBorderView } from "./dashedLine";
import PopupCardModal from "./popupCardModal";
import moment from "moment";
import { handleGetInvoiceData } from "../userCall/ApiUser";
import { fallbackImage } from "../utils/png";
import { currencySymbol } from "../constant/constApi";
import { getMethod, postMethod } from "../services/apiService";
import { ApiUrl } from "../services/apiUrl";
import { doChangeSpinnerFlag } from "../services/commonMethods";
import { useDispatch } from "react-redux";
import { useToast } from 'react-native-toast-notifications';
import { commonStyles } from "../utils/commonStyles";

// =================================== TABBAR  BUTTON ===================================== //

interface TabBarProps {
    tabs: { label: string; count?: number }[];
    activeTab: string;
    onTabPress: (tab: string) => void;
    borderRadius?: number;
    width?: any;
    marginRight?: number;
    isScroll?: boolean;

}

export const TabBar: React.FC<TabBarProps> = ({ tabs, activeTab, isScroll, onTabPress, marginRight, borderRadius, width }) => {
    return (
        <View>
            {
                isScroll ? (
                    <View style={styles.tabContainer}>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} >
                            {tabs.map((tabInfo) => (
                                <TouchableOpacity
                                    key={tabInfo.label}
                                    style={[
                                        styles.tab,
                                        {
                                            backgroundColor: activeTab === tabInfo.label ? colors.primary : colors.white,
                                            borderWidth: activeTab === tabInfo.label ? 0 : 1,
                                            borderColor: activeTab === tabInfo.label ? 'transparent' : colors.greyTwo,
                                            borderRadius: borderRadius || 10,
                                            width: width || 100,
                                            marginRight: marginRight || 0
                                        }
                                    ]}
                                    onPress={() => onTabPress(tabInfo.label)}>
                                    <View style={styles.flexRow}>
                                        <Text style={[commonStyles.h14600, { color: activeTab === tabInfo.label ? colors.white : colors.blackOne }]} >
                                            {tabInfo.label}
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>
                ) : (
                    <View style={styles.tabContainer}>
                        {tabs.map((tabInfo) => (
                            <TouchableOpacity
                                key={tabInfo.label}
                                style={[
                                    styles.tab,
                                    {
                                        backgroundColor: activeTab === tabInfo.label ? colors.primary : colors.white,
                                        borderWidth: activeTab === tabInfo.label ? 0 : 1,
                                        borderColor: activeTab === tabInfo.label ? 'transparent' : colors.greyTwo,
                                        borderRadius: borderRadius || 10,
                                        width: width || 100,
                                        marginRight: marginRight || 0
                                    }
                                ]}
                                onPress={() => onTabPress(tabInfo.label)}>
                                <View style={styles.flexRow}>
                                    <Text style={[commonStyles.h14600, { color: activeTab === tabInfo.label ? colors.white : colors.blackOne }]}>
                                        {tabInfo.label}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        ))}
                    </View>
                )
            }
        </View>
    );
};


// =================================================== TABBAR ========================================================= //

interface HeaderProps {
    headerText: string;
    searchIcon?: boolean;
    searchText?: any;
    searchName?: any
}

export const TopHeader: React.FC<HeaderProps> = ({ headerText, searchIcon, searchText,
    searchName }) => {
    const [isSearchBarOpen, setIsSearchBarOpen] = useState(false);
    const [iconType, setIconType] = useState<'search' | 'cross'>('search'); // State to manage icon type
    const [iconTypeName, setIconTypename] = useState<'Fontisto' | 'Entypo'>('Fontisto'); // State to manage icon type
    const [searchTextValue, setSearchTextValue] = useState('');
    const navigation = useNavigation()

    const toggleSearchBar = () => {
        setIsSearchBarOpen(!isSearchBarOpen);
        setIconType(iconType === 'search' ? 'cross' : 'search');
        setIconTypename(iconTypeName === 'Fontisto' ? 'Entypo' : 'Fontisto');

    };

    const closeSearchBar = () => {
        setIsSearchBarOpen(false);
        setIconType('search');
    };

    const handleSearchInputChange = (text: string) => {
        setSearchTextValue(text);
        console.log(text);
    }

    const { control } = useForm();

    return (
        <View>
            <View style={[flexRow, justifyBetween, alignItemCenter]}>
                <TouchableOpacity style={styles.iconContainer} onPress={() => navigation.goBack()}>
                    <CustomIcon name={"chevron-left"} size={15} color={colors.blackOne} type={"Entypo"} />
                </TouchableOpacity>
                <Text style={[commonStyles.h18BlackOne700, {}]} >{headerText}</Text>
                {searchIcon ? (
                    <TouchableOpacity style={styles.iconContainer} onPress={toggleSearchBar}>

                        <CustomIcon name={iconType} size={13} color={colors.blackTwo} type={iconTypeName} />
                    </TouchableOpacity>
                ) : (
                    <Text>{'           '}</Text>
                )}
            </View>
            {isSearchBarOpen && (
                <CustomTextInputField onChangeText={(i) => handleSearchInputChange(i)} name={searchName} control={control} placeholder={searchText} onClose={closeSearchBar} showIcon={true} />
            )}
        </View>
    );
};
// ===============================================  SUB HEADER OF LIST =========================================== //

interface SubHeaderProps {
    listName: string;
    totalNumber: string | number;
    onAddPress?: () => void;
    addIcon?: boolean;
    filterIcon?: boolean;
    onFilterPress?: () => void;
}

export const ListSubHeader: React.FC<SubHeaderProps> = ({ listName, totalNumber, onAddPress, addIcon, filterIcon, onFilterPress }) => {
    return (
        <View style={[flexRow, justifyBetween, mv5]}>
            <View style={[flexRow, alignItemCenter]}>
                <Text style={[commonStyles.h14blackOne600, alignSelfCenter]}>{'Total ' + listName}</Text>
                <View style={{ backgroundColor: colors.green, height: 20, width: 20, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginHorizontal: 5 }}>
                    <Text style={[commonStyles.h10White600]} >{totalNumber}</Text>
                </View>
            </View>
            <View style={[flexRow, alignItemCenter]}>
                {addIcon &&
                    <TouchableOpacity onPress={onAddPress} style={{ backgroundColor: colors.primary, height: 36, width: 36, borderRadius: 40, padding: 10 }}>
                        <CustomIcon name={'plus'} size={16} color={colors.white} type={"Entypo"} />
                    </TouchableOpacity>
                }
                {filterIcon !== false &&
                    <TouchableOpacity onPress={onFilterPress} style={{ height: 36, width: 36, borderRadius: 40, padding: 10, marginHorizontal: 10, borderWidth: 1, borderColor: colors.greyTwo }}>
                        <AdjustmentIcon width={16} height={16} />
                    </TouchableOpacity>
                }
            </View>
        </View>
    );
};
// ==================================================================================== Round Check box Button ================================================================ //
interface RoundCheckBoxProps {
    title: string;
    onChange: () => void;
    borderColor: string;
    backgroundColor: string;
    textColor: string;
}

export const RoundCheckBox: React.FC<RoundCheckBoxProps> = ({ title, onChange, borderColor, backgroundColor, textColor }) => {

    return (
        <View style={[styles.roundCheckboxContainer, { borderColor }]}>
            <TouchableOpacity style={[flexRow, mh10]} onPress={onChange}>
                <View style={[styles.roundCheckBoxButton1, { borderColor }]} >
                    <View style={[styles.roundCheckBoxButton2, { backgroundColor }]} />
                </View>
                <Text style={[commonStyles.h14400, mh5, { color: textColor }]} >{title}</Text>
            </TouchableOpacity>
        </View>
    );
};
// ============================================================ Common Input Field =================================================//

interface CustomTextInputProps {
    value?: any;
    name: string;
    control: any;
    onBlur?: () => void;
    placeholder: string;
    label?: string;
    showIcon?: boolean;
    showOtp?: boolean;
    width?: number | any;
    subHead?: string;
    subHeadOnPress?: () => void;
    color?: any;
    iconName?: string | any;
    iconType?: string | any;
    iconSize?: number | any;
    onClose?: () => void;
    showCalendar?: boolean;
    defaultValue?: string;
    showStarSymbol?: boolean;
    subIcon?: boolean,
    onChangeText?: (text: string) => void;
    error?: string;

}
export const CustomTextInputField: React.FC<CustomTextInputProps> = ({
    name,
    control,
    placeholder,
    label,
    showIcon = false,
    showOtp,
    width,
    subHead,
    color,
    showCalendar,
    iconName,
    iconType,
    iconSize,
    defaultValue,
    subHeadOnPress,
    subIcon,
    value,
    onChangeText,
    error,
    onBlur,
    showStarSymbol = true // Default to true
}) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    return (
        <View style={{ marginVertical: 5 }}>
            <View style={[flexRow, justifyBetween]}>
                <View style={flexRow}>
                    {label && (
                        <>
                            <Text style={[commonStyles.h14blackOne600, mv5]}>{label}</Text>
                            {showStarSymbol && <Text style={[commonStyles.h14Danger400]}>*</Text>}
                            <Text style={[commonStyles.h14Danger400]}></Text>
                        </>
                    )}
                </View>
                {subHead &&
                    <TouchableOpacity onPress={subHeadOnPress}>
                        <Text style={{ color: color ? color : 'red', alignSelf: 'center', marginTop: 5 }}>{subHead}</Text>
                    </TouchableOpacity>
                }
            </View>
            <View style={[styles.iconContainer, { width: width }]} >
                <Controller
                    name={name}
                    control={control}
                    defaultValue={defaultValue}
                    render={({ field: { onChange, value } }) => (
                        <CustomTextInput
                            placeholder={placeholder}
                            value={value}
                            onChangeText={onChange}
                            textColor={colors.black}
                            onBlur={onBlur}
                        />
                    )}
                    rules={{
                        required: requiredValidation(placeholder),
                        minLength: minLengthValidation(validationSchema.name.minLength),
                    }}
                />
                {error && <Text style={{ color: 'red' }}>{error}</Text>}

                {showIcon && (
                    <View>
                        {label ?
                            showCalendar ?
                                (
                                    <View>
                                        <CustomIcon name={iconName} type={iconType} size={iconSize} color={colors.grey} />
                                    </View>
                                )
                                : (
                                    <TouchableOpacity onPress={toggleDropdown}>
                                        <CustomIcon
                                            name="chevron-small-down"
                                            size={16}
                                            color={colors.grey}
                                            type="Entypo"
                                        />
                                    </TouchableOpacity>
                                ) : (
                                <TouchableOpacity>
                                    <CustomIcon
                                        name="search"
                                        size={12}
                                        color={colors.grey}
                                        type="Feather" // Adjust this according to your icon library
                                    />
                                </TouchableOpacity>
                            )}
                    </View>
                )}
                {showOtp && (
                    <Text style={[commonStyles.h14primary600, { color: colors.primary }]}>{labels.generateCode}</Text>
                )}
            </View>
            {isDropdownOpen && (
                <View style={{ backgroundColor: 'white', padding: 10, marginTop: 10, elevation: 1 }}>
                    <Text style={commonStyles.h14blackOne600}>{"listItem"}</Text>
                </View>
            )}
        </View>
    );
};


// ============================================================ Common navigate box =================================================//

interface CustomNavigateBoxProps {
    label: string;
    name: string;
    color?: any;
    onNavigate: () => void;
}

export const CustomNavigateBox: React.FC<CustomNavigateBoxProps> = ({
    label,
    color,
    onNavigate,
    name
}) => {

    return (
        <View style={{ marginVertical: 5 }}>
            <View style={[flexRow, justifyBetween]}>
                <View style={flexRow}>
                    {label && (
                        <>
                            <Text style={[commonStyles.h14blackOne600, mv5]} >{label}</Text>
                            <Text style={[commonStyles.h14Danger400]}>*</Text>
                        </>
                    )}
                </View>
            </View>
            <TouchableOpacity onPress={onNavigate} style={[flexRow, justifyCenter, alignItemCenter, { height: 60, width: '100%' }]}>
                <DashedBorderView borderColor={colors.grey} borderWidth={1} borderStyle={'dashed'}>
                    <View style={[alignItemCenter, justifyCenter, { height: 16, width: 16, borderRadius: 5, backgroundColor: color }]}>
                        <CustomIcon color={colors.white} name='plus' size={12} type='Entypo' />
                    </View>
                    <Text style={[{ color: color }, ml5]}>{name}</Text>
                </DashedBorderView>
            </TouchableOpacity>
        </View>
    );
};

// ============================================================ Common Invoice Card =================================================//

type InvoiceData = {
    invoiceNumber: string;
    customerId: any;
    TotalAmount: string;
    payment_method: string;
    id: number;
    img: any;
    invoiceNo: string;
    companyName: string;
    status: string;
    amount: string;
    modeOfPayment: string;
    dueDate: string;
    color: string;
};

type InvoiceCardProps = {
    data: InvoiceData;
    refresh: () => void
    noOptions?: boolean
}

export const InvoiceCard: React.FC<InvoiceCardProps> = ({ data, refresh, noOptions }) => {
    const navigation = useNavigation();
    const [actionModal, setActionModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
    const dispatch = useDispatch();
    const toast = useToast();

    const openActionModal = () => {
        setActionModal(true);
    }

    const getIvoiceDetails = (id: any) => {
        doChangeSpinnerFlag(true);
        getMethod(
            `${ApiUrl.getAllInvoice}/${id}`,
            success => {
                doChangeSpinnerFlag(false);
                if (success.code == 200) {
                    (navigation as any).navigate(screenName.InvoiceDetailsScreen, { invoiceDetails: success.data?.invoice_details } as any)
                } else {
                    // console.log();
                }
            },
            error => {
                doChangeSpinnerFlag(false);
            },
        );
    }
    const handleActionClick = async (id: number, item?: any) => {
        console.log('id...', id);
        setActionModal(false);
        const editInvoice = await handleGetInvoiceData(data);
        console.log('editInvoice', editInvoice);

        if (id == 1) {
            navigation.navigate(screenName.SendPaymentLink as never)
        } else if (id == 0) {
            getIvoiceDetails(editInvoice?.invoice_details?._id)
        } else if (id == 3) {
            (navigation as any).navigate(screenName.AddInvoiceScreen, { isAddedProductAvailable: item, invoiceDetails: editInvoice?.invoice_details } as any)
        } else if (id == 4) {
            getMethod(
                ApiUrl.addInvoice + `/pdfCreate?invoiceId=${editInvoice?.invoice_details?._id}} `,
                (success: { code: number; message: any; }) => {
                    if (success.code === 200) {
                        toast.show(`Invoice Sent Success`, { type: "normal", placement: "bottom", duration: 4000, animationType: "slide-in", });
                        refresh();
                    } else {
                        toast.show(`Failed to Sent invoice`, { type: "normal", placement: "bottom", duration: 4000, animationType: "slide-in", });
                    }
                },
                error => {
                    toast.show(`Failed to Sent invoice`, { type: "normal", placement: "bottom", duration: 4000, animationType: "slide-in", });
                }
            );
        }
        else if (id === 6 || id === 7) {
            var text = id === 6 ? 'Convert' : 'Clone';
            postMethod(
                ApiUrl.addInvoice + `/${editInvoice?.invoice_details?._id}/${text === 'Clone' ? 'clone' : 'convertsalesreturn'}`,
                {},
                (success: { code: number; message: any; }) => {
                    if (success.code === 200) {
                        console.log('Successfully cloned invoice', success?.data);
                        toast.show(`Invoice ${text} Success`, { type: "normal", placement: "bottom", duration: 4000, animationType: "slide-in", });
                        refresh()
                    } else {
                        toast.show(`Failed to ${text} invoice`, { type: "normal", placement: "bottom", duration: 4000, animationType: "slide-in", });
                    }
                },
                error => {
                    toast.show(`Failed to ${text} invoice`, { type: "normal", placement: "bottom", duration: 4000, animationType: "slide-in", });
                }
            );
        }

        else if (id == 8) {
            setActionModal(false);
            setShowDeleteModal(true);
        }
        else if (id == 2) {
            const editInvoice = await handleGetInvoiceData(data);
            const pdfUrl = editInvoice?.invoice_details?.pdfUrl;

            if (pdfUrl) {
                Linking.openURL(pdfUrl)
                    .catch(err => {
                        console.error("Failed to open PDF URL:", err);
                        toast.show("Unable to open PDF", { type: "danger" });
                    });
            } else {
                toast.show("No PDF available for this invoice", {
                    type: "warning",
                    placement: "bottom",
                    duration: 4000,
                    animationType: "slide-in",
                });
            }
        }

    }

    const ActionModal = () => {
        return (
            <View style={[]}>
                <ModalTopText title='Actions' iconPress={() => setActionModal(false)} />
                <View>
                    {
                        actionData.map((item) => {
                            if ((data.status.toLowerCase() == 'paid' || data.status.toLowerCase() == 'partially_paid') && item.id == 3) {
                                return null;
                            }
                            return (
                                <TouchableOpacity onPress={() => handleActionClick(item.id)} key={item.id} style={[flexRow, justifyStart, alignItemCenter, mv10]}>
                                    <View style={[{ height: 36, width: 36, borderRadius: 25, backgroundColor: colors.white4 }, justifyCenter, alignItemCenter]}>
                                        <CustomIcon color={colors.blackTwo} name={item.iconName} size={item.iconSize} type={item.iconType} />
                                    </View>
                                    <Text style={[commonStyles.h14blackTwo500, ml10]} >{item.text}</Text>
                                </TouchableOpacity>
                            )
                        })
                    }
                </View>
            </View>
        )
    }

    function changeColor(status: string): string | undefined {

        switch (status.toLowerCase()) {
            case 'paid':
                return colors.green;
            case 'overdue':
                return colors.yellow;
            case 'partially_paid':
                return colors.blue;
            case 'sent':
                return colors.redFour;
            case 'draft':
                return colors.blueFour;
            default:
                return colors.greyTwo;
        }
    }

    function LabelText(text: string) {
        switch (text.toLowerCase()) {
            case 'paid':
                return labels.paid;
            case 'overdue':
                return labels.overDue;
            case 'partially_paid':
                return labels.partiallypaid;
            case 'sent':
                return labels.sent;
            case 'drafted':
                return labels.draft;
            default:
                return labels.unpaid;
        }
    }
    const imageUri = data?.customerId?.image || fallbackImage;
    return (
        <TouchableOpacity onPress={() => getIvoiceDetails(data?._id)} style={{ flex: 1, marginTop: 15, marginHorizontal: 2, backgroundColor: colors.white, borderRadius: 8, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.50, shadowRadius: 3.84, elevation: 2 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 10, marginVertical: 10 }}>
                <View style={[flexRow, alignItemCenter]}>
                    <View style={{ height: 50, width: 50, borderWidth: 1, borderColor: colors.greyTwo, borderRadius: 10, justifyContent: 'center', alignItems: 'center' }}>
                        <Image
                            source={
                                data?.customerId?.image
                                    ? { uri: data.customerId.image }

                                    : { uri: 'https://i.sstatic.net/ouxqq.gif' } // Local placeholder image
                            }
                            style={{ width: 45, height: 45, borderRadius: 10 }}
                        />
                    </View>
                    <View style={{ marginLeft: 10 }}>
                        <Text style={[commonStyles.h12Primary400]}>{`#INV${data?.invoiceNumber}`.replace(/\s+/g, '')}</Text>
                        <Text style={[commonStyles.h16BlackOne700, mt5]} >{data.companyName ?? data?.customerId?.name}</Text>
                    </View>
                </View>
                <View style={[flexRow, alignItemCenter]}>
                    <View style={[{ height: 25, backgroundColor: changeColor(data.status), borderRadius: 5 }, alignItemCenter, justifyCenter, flexRow, justifyEvenly]}>
                        <View style={[ml10, { height: 5, width: 5, borderRadius: 20, backgroundColor: colors.white }]} />
                        <Text style={[commonStyles.h12white600, ml5, mr10]} >{LabelText(data.status)}</Text>
                    </View>
                    {!noOptions && <TouchableOpacity onPress={openActionModal} style={[{ height: 30, width: 30, backgroundColor: colors.greyOne, borderRadius: 15 }, alignItemCenter, justifyCenter, ml10]}>
                        <CustomIcon name='dots-vertical' size={15} color={colors.blackTwo} type='MaterialCommunityIcons' />
                    </TouchableOpacity>}
                </View>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', padding: 10, margin: 10, marginTop: 0, backgroundColor: colors.greyOne, borderRadius: 8 }}>
                <View>
                    <Text style={[commonStyles.h10blackTwo600]}>Amount</Text>
                    <Text style={[commonStyles.h12BlackOne600]}>{currencySymbol}{data.amount ?? data?.TotalAmount ? data.TotalAmount : '$0'}</Text>
                </View>
                <View style={{ marginLeft: 15 }}>
                    <Text style={[commonStyles.h10blackTwo600]}>Mode of Payment</Text>
                    <Text style={[commonStyles.h12BlackOne600]}>{data.modeOfPayment ?? data?.payment_method}</Text>
                </View>
                <View style={{ marginLeft: 15 }}>
                    <Text style={[commonStyles.h10blackTwo600]}>Due Date</Text>
                    <Text style={[commonStyles.h12BlackOne600]}>{moment(data.dueDate).format('DD-MM-YYYY')}</Text>
                </View>
            </View>
            <CustomModal children={<ActionModal />} visible={actionModal} onClose={() => setActionModal(false)} height={'65%'} />
            {showDeleteModal && <PopupCardModal handleYesBtn={() => { }} text='Do you want to Delete Invoice' visible={showDeleteModal} onClose={() => setShowDeleteModal(false)} />}
        </TouchableOpacity>
    );
};

// ============================================================ Common Invoice Card =================================================//

type InvoiceScreenCardProps = {
    data: InvoiceData;
    UserData: any;
}

export const InvoiceScreenCard: React.FC<InvoiceScreenCardProps> = ({ data, UserData }) => {
    const navigation = useNavigation();
    const [actionModal, setActionModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
    const fallbackImage = `https://kanakku-web.dreamstechnologies.com:7008/uploads/customers/image-1718722558788-615086778.jpg`
    const openActionModal = () => {
        setActionModal(true);
    }

    const getIvoiceDetails = (id: any) => {
        doChangeSpinnerFlag(true);
        getMethod(
            `${ApiUrl.getAllInvoice}/${id}`,
            success => {
                doChangeSpinnerFlag(false);
                if (success.code == 200) {
                    (navigation as any).navigate(screenName.InvoiceDetailsScreen, { invoiceDetails: success.data?.invoice_details } as any)
                } else {
                    // console.log();
                }
            },
            error => {
                doChangeSpinnerFlag(false);
            },
        );
    }

    const handleActionClick = (id: number, item?: any) => {
        console.log('id', id);

        if (id == 1) {
            navigation.navigate(screenName.SendPaymentLink as never)
        } else if (id == 2) {
            navigation.navigate(screenName.InvoiceDetailsScreen as never)
        } else if (id == 3) {
            navigation.navigate(screenName.AddInvoiceScreen, { isAddedProductAvailable: item, invoiceDetails: data } as any)
        } else if (id == 4) {
            Share.share({
                message: `This is Kanakku App shared message`,
            });
        } else if (id == 8) {
            setActionModal(false);
            setShowDeleteModal(true);
        }
    }

    const ActionModal = () => {
        return (
            <View style={[]}>
                <ModalTopText title='Actions' iconPress={() => setActionModal(false)} />
                <View>
                    {
                        actionData.map((item) => {
                            return (
                                <TouchableOpacity onPress={() => handleActionClick(item.id)} key={item.id} style={[flexRow, justifyStart, alignItemCenter, mv10]}>
                                    <View style={[{ height: 36, width: 36, borderRadius: 25, backgroundColor: colors.white4 }, justifyCenter, alignItemCenter]}>
                                        <CustomIcon color={colors.blackTwo} name={item.iconName} size={item.iconSize} type={item.iconType} />
                                    </View>
                                    <Text style={[commonStyles.h14blackTwo500, ml10]} >{item.text}</Text>
                                </TouchableOpacity>
                            )
                        })
                    }
                </View>
            </View>
        )
    }

    function changeColor(status: string): string | undefined {

        switch (status.toLowerCase()) {
            case 'paid':
                return colors.green;
            case 'overdue':
                return colors.yellow;
            case 'partially_paid':
                return colors.blue;
            case 'sent':
                return colors.redFour;
            case 'draft':
                return colors.blueFour;
            default:
                return colors.greyTwo;
        }
    }

    function LabelText(text: string) {
        switch (text.toLowerCase()) {
            case 'paid':
                return labels.paid;
            case 'overdue':
                return labels.overDue;
            case 'partially_paid':
                return labels.partiallypaid;
            case 'sent':
                return labels.sent;
            case 'drafted':
                return labels.draft;
            default:
                return labels.unpaid;
        }
    }
    const imageUri = data?.customerId?.image || fallbackImage;
    console.log('imageUri', data);

    return (
        <TouchableOpacity onPress={() => getIvoiceDetails(data?._id)} style={{ height: 120, width: '100%', marginTop: 15, alignSelf: 'center', backgroundColor: colors.white, borderRadius: 8, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.50, shadowRadius: 3.84, elevation: 2 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 10, marginVertical: 10 }}>
                <View style={[flexRow, alignItemCenter]}>
                    <View style={{ marginLeft: 10 }}>
                        <Text style={[commonStyles.h12Primary400]}>{`#INV${data?.invoiceNumber}`.replace(/\s+/g, '')}</Text>
                        <View style={[flexRow, mt10, { backgroundColor: colors.greyOne, borderRadius: 5 }]}>
                            <CustomIcon name='calendar' size={18} color={colors.blackTwo} type='Feather' />
                            <Text style={[commonStyles.h16BlackOne700]}>  Created on {moment(data?.createdAt).format('DD-MM-YYYY')}</Text>
                        </View>
                    </View>
                </View>
                <View style={[flexRow, alignItemCenter]}>
                    <View style={[{ height: 25, backgroundColor: changeColor(data.status), borderRadius: 5 }, alignItemCenter, justifyCenter, flexRow, justifyEvenly]}>
                        <View style={[ml10, { height: 5, width: 5, borderRadius: 20, backgroundColor: colors.white }]} />
                        <Text style={[commonStyles.h12white600, ml5, mr10]} >{LabelText(data.status)}</Text>
                    </View>
                </View>
            </View>
            <View style={[flexRow, justifyAround, alignItemCenter, mh10, p5, { height: 40, width: '95%', backgroundColor: colors.greyOne, borderRadius: 8 }]}>
                <View>
                    <Text style={[commonStyles.h12blackTwo600]}>Amount</Text>
                    <Text style={commonStyles.h14blackOne600}>{data.amount ?? data?.TotalAmount}</Text>
                </View>
                <View>
                    <Text style={[commonStyles.h12blackTwo600]}>Mode of Payment</Text>
                    <Text style={commonStyles.h14blackOne600}>{data.modeOfPayment ?? data?.payment_method}</Text>
                </View>
                <View>
                    <Text style={[commonStyles.h12blackTwo600]}>Due Date</Text>
                    <Text style={commonStyles.h14blackOne600}>{moment(data.dueDate).format('DD-MM-YYYY')}</Text>
                </View>
            </View>
            <CustomModal children={<ActionModal />} visible={actionModal} onClose={() => setActionModal(false)} height={'65%'} />
            {showDeleteModal && <PopupCardModal handleYesBtn={() => setShowDeleteModal(false)} text='Do you want to Delete Invoice' visible={showDeleteModal} onClose={() => setShowDeleteModal(false)} />}
        </TouchableOpacity>
    );
};
// =============== Multi select option component======================

interface MultiSelectProps {
    selectedColor: string;
    unselectedColor: string;
    isSelected: boolean;
    onSelect: () => void;
}

export const MultiSelectOption: React.FC<MultiSelectProps> = ({
    selectedColor,
    unselectedColor,
    isSelected,
    onSelect,
}) => {
    return (
        <TouchableOpacity
            onPress={onSelect}
            style={[
                styles.multiSelectBox,
                {
                    backgroundColor: isSelected === true ? selectedColor : colors.white,
                    borderWidth: isSelected === true ? 0 : 1,
                    borderColor: isSelected === true ? colors.primary : colors.grey,
                },
            ]}
        >
            {isSelected === true && (
                <CustomIcon name="check" size={15} color="white" type="MaterialIcons" />
            )}
        </TouchableOpacity>
    );
};

// =============== Multi line textinput component======================

interface MultiLineTextBoxProps {
    value: string;
    label: string;
    showMandatory?: boolean;
    onChangeValue: (text: string) => void;
    height?: number | any;
    maxLength?: number;
    multiline?: boolean;
    keyboardType?: KeyboardTypeOptions;
    placeHolder: string;
    disable?: boolean;
    error?: string | undefined;
    errorMessage?: string;
}

export const MultiLineTextBox: React.FC<MultiLineTextBoxProps> = ({
    value,
    maxLength,
    keyboardType,
    placeHolder,
    label,
    height,
    onChangeValue,
    multiline,
    disable,
    error,
    showMandatory
}): JSX.Element => {
    const [isFocused, setFocused] = useState(value ? true : false);
    const [_animatedIsFocused, _setAnimatedIsFocused] = useState(new Animated.Value(0));
    const inputRef = React.useRef<TextInput>(null);

    const handleFocus = () => setFocused(true);
    const handleBlur = () => setFocused(!!value);


    return (
        <View style={height ? { marginTop: 10 } : { marginTop: 10 }}>
            <View style={[flexRow]}>
                <Text style={[commonStyles.h14blackOne600, mv5]}>{label}</Text>
                {showMandatory && <Text style={[commonStyles.h14Danger400]}>*</Text>}
            </View>
            <TextInput
                editable={!disable}
                multiline={multiline}
                value={value}
                textAlignVertical={height ? 'top' : 'center'}
                maxLength={maxLength}
                autoCorrect={false}
                keyboardType={keyboardType}
                ref={inputRef}
                placeholder={placeHolder}
                placeholderTextColor={colors.grey}
                style={[
                    styles.input,
                    height && { height }
                ]}
                onChangeText={onChangeValue}
                onFocus={handleFocus}
                onBlur={handleBlur}
                blurOnSubmit
            />
            {error && <Text style={styles.errorText}>{error}</Text>}
        </View>
    );
};

// =============== Radio Button component======================

interface RadioBtnProps {
    selected: boolean;
    onPress: () => void;
}

export const RadioBtn: React.FC<RadioBtnProps> = ({ selected, onPress }) => {
    return (
        <TouchableOpacity style={[flexRow, alignItemCenter]} onPress={onPress}>
            <View style={{
                backgroundColor: colors.white,
                borderColor: selected ? colors.primary : colors.grey,
                width: 20,
                height: 20,
                borderRadius: 10,
                borderWidth: 1,
                justifyContent: 'center',
                alignItems: 'center',
            }}>
                {selected && (
                    <View style={{
                        width: 10,
                        height: 10,
                        borderRadius: 5,
                        backgroundColor: selected ? colors.primary : colors.white,
                    }} />
                )}
            </View>
        </TouchableOpacity>
    );
};


// ======================================= TOGGLE SWITCH ======================================= //
type ToggleSwitchProps = {
    value: boolean;
    onToggle: () => void;
};

export const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ value, onToggle }) => {
    const borderRadius = 20; // Adjust the border radius as needed

    return (
        <TouchableOpacity onPress={onToggle}>
            <View
                style={[
                    styles.container,
                    {
                        backgroundColor: value ? colors.primary : colors.grey,
                        borderWidth: 1,
                        borderColor: value ? colors.primary : colors.grey,
                    },
                ]}
            >
                <View
                    style={[
                        styles.toggle,
                        {
                            transform: [{ translateX: value ? 15 : 0.2 }],
                            backgroundColor: value ? colors.white : colors.white,
                        },
                    ]}
                />
            </View>
        </TouchableOpacity>
    );
};
//==================================================== FILTER FIELD ============================================================



interface ExpandableSectionProps {
    renderingComponent: JSX.Element;
    text: string;
    style?: StyleProp<ViewStyle>;
}

export const ExpandableSection: React.FC<ExpandableSectionProps> = ({ renderingComponent, text, style }) => {
    const [showComponent, setShowComponent] = useState(false); // State to manage component visibility

    const toggleComponent = () => {
        setShowComponent(!showComponent); // Toggle visibility state
    };

    return (
        <View style={style}>
            <TouchableOpacity onPress={toggleComponent}>
                <View style={[flexRow, justifyBetween, alignItemCenter, mt15]}>
                    <Text style={commonStyles.h14blackOne600}>{text}</Text>
                    <CustomIcon
                        name={showComponent ? 'angle-up' : 'angle-down'} // Change icon based on visibility state
                        type='FontAwesome6'
                        color={colors.black}
                        size={10}
                    />
                </View>
            </TouchableOpacity>
            {showComponent && (
                <View>
                    {renderingComponent}
                </View>
            )}
        </View>
    );
};




//==================================
interface ExpandedByStatusProps {
    data: any;
}

export const ExpandedByStatusComponent: React.FC<ExpandedByStatusProps> = ({ data }) => {
    const [checkBox, setCheckBox] = useState<boolean[]>(new Array(data.length).fill(false));

    const handleCheckBox = (index: number) => {
        const updatedCheckBox = [...checkBox]; // Create a copy of checkBox state array
        updatedCheckBox[index] = !updatedCheckBox[index]; // Toggle the value at the given index
        setCheckBox(updatedCheckBox); // Update the checkBox state
    };

    return (
        <View>
            {
                data.map((item, index) => (
                    <View key={index} style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', marginVertical: 5 }}>
                        <MultiSelectOption
                            selectedColor={colors.primary}
                            unselectedColor={'#FF6263'}
                            isSelected={checkBox[index] || false}
                            onSelect={() => handleCheckBox(index)}
                        />
                        <Text style={[commonStyles.h14BlackTwo400, ml10]}>{item}</Text>
                    </View>
                ))
            }
        </View>
    );
};

//==========================================================


interface FilterHeaderProps {
    headerText: string;
    searchIcon?: boolean;
    searchText?: any;
    searchName?: any;
    handleSearch: (searchValue: string) => void;
}

export const FilterHeader: React.FC<FilterHeaderProps> = ({ headerText, searchIcon, searchText, searchName, handleSearch }) => {
    const [isSearchBarOpen, setIsSearchBarOpen] = useState(false);
    const [iconType, setIconType] = useState<'angle-right' | 'angle-down'>('angle-right'); // State to manage icon type
    const [iconTypeName, setIconTypeName] = useState<'FontAwesome6' | 'FontAwesome6'>('FontAwesome6'); // State to manage icon type

    const toggleSearchBar = () => {
        setIsSearchBarOpen(!isSearchBarOpen);
        setIconType(isSearchBarOpen ? 'angle-right' : 'angle-down');
    };

    const closeSearchBar = () => {
        setIsSearchBarOpen(false);
        setIconType('angle-right');
    };

    const { control } = useForm();

    const onChangeText = (text: string) => {
        handleSearch(text); // Call handleSearch function whenever search text changes
    };

    return (
        <View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={commonStyles.h14blackOne600}>{headerText}</Text>
                {searchIcon && (
                    <TouchableOpacity onPress={toggleSearchBar}>
                        <CustomIcon name={iconType} size={15} color={colors.blackOne} type={iconTypeName} />
                    </TouchableOpacity>
                )}
            </View>
            {isSearchBarOpen && (
                <CustomTextInputField
                    name={searchName}
                    control={control}
                    placeholder={searchText}
                    onClose={closeSearchBar}
                    showIcon={true}
                    onChangeText={onChangeText}
                />
            )}
        </View>
    );
};


interface CustomerSearchProps {
    placeholder: string;
    data: string[];
    isCheckBoxNeeded?: boolean;
    onChangeText: (text: string) => void;
    value: string;
}

export const CustomerSearchExpanded: React.FC<CustomerSearchProps> = ({ placeholder, data, isCheckBoxNeeded, onChangeText, value }) => {
    const [searchText, setSearchText] = useState(value);
    const [filteredData, setFilteredData] = useState<string[]>(data);
    const [checkBox, setCheckBox] = useState<boolean[]>(new Array(filteredData.length).fill(false));
    const handleInputChange = (text: string) => {
        setSearchText(text); // Update search text state
        // Filter data based on the search text
        const filteredItems = data.filter(item => item.toLowerCase().includes(text.toLowerCase()));
        setFilteredData(filteredItems); // Update filtered data state
    };

    // const handleCheckBox = (index: number) => {
    //     const updatedCheckBox = [...checkBox]; // Create a copy of checkBox state array
    //     updatedCheckBox[index] = !updatedCheckBox[index]; // Toggle the value at the given index
    //     setCheckBox(updatedCheckBox); // Update the checkBox state
    //     onChangeText(text)
    // };
    const handleCheckBox = (index: number) => {
        const updatedCheckBox = [...checkBox]; // Copy the current state
        updatedCheckBox[index] = !updatedCheckBox[index]; // Toggle the checkbox state
        setCheckBox(updatedCheckBox); // Update the state

        const selectedItems = filteredData.filter((_, i) => updatedCheckBox[i]);
        if (onChangeText) {
            onChangeText(selectedItems); // Pass selected items only if onChangeText is defined
        } else {
            console.warn('onChangeText is not defined'); // Debug log for missing prop
        }
    };



    return (
        <View>
            <View style={{ justifyContent: 'flex-start', marginVertical: 5, height: 35, width: '100%', backgroundColor: '#F4F4F4', borderColor: '#CCCCCC', borderRadius: 8 }}>
                <TextInput
                    style={{ marginLeft: 15, color: colors.grey }}
                    onChangeText={handleInputChange}
                    value={searchText}
                    placeholder={placeholder}
                    keyboardType='default'
                    placeholderTextColor={colors.blackTwo}
                />
                <View style={{ marginRight: 15 }}>
                    {/* CustomIcon component */}
                </View>
            </View>
            {searchText !== '' && (
                <View>
                    {filteredData.length === 0 ? (
                        <Text style={[commonStyles.h14blackOne500]}>No items found</Text>
                    ) : (
                        filteredData.map((item, index) => (
                            <View key={index} style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', marginVertical: 5 }}>
                                {
                                    isCheckBoxNeeded ? (
                                        <MultiSelectOption
                                            selectedColor={colors.primary}
                                            unselectedColor={'#FF6263'}
                                            isSelected={checkBox[index] || false}
                                            onSelect={() => handleCheckBox(index)}
                                        />
                                    ) : (
                                        <View />
                                    )
                                }
                                <Text style={[commonStyles.h14blackOne500, ml10]}>{item}</Text>
                            </View>
                        ))
                    )}
                </View>
            )}
        </View>
    );
};



const styles = StyleSheet.create({
    tabContainer: {
        flexDirection: "row",
        justifyContent: 'space-between', // Center the ScrollView
        alignItems: "center",
        alignSelf: "center",
        width: "100%", // Ensure it spans the full width
    },
    scrollContainer: {
        flexDirection: "row",
        justifyContent: "space-around", // Distribute tabs evenly with spacing around
        alignItems: "center",
        // paddingHorizontal: 10, // Add padding for proper spacing at the edges
    },
    tab: {
        height: 38,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 20,
        // marginHorizontal: 10, // Add horizontal spacing between tabs
    },
    flexRow: {
        flexDirection: "row",
        alignItems: "center",
    },
    iconContainer: {
        backgroundColor: colors.greyTwo,
        height: 36,
        width: 36,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center'
    },
    roundCheckboxContainer: {
        borderWidth: 1,
        height: 38,
        width: '48%',
        borderRadius: 10,
        justifyContent: 'center',
    },
    roundCheckBoxButton1: {
        height: 16,
        width: 16, borderWidth: 1,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center'
    },
    roundCheckBoxButton2: {
        height: 7,
        width: 7,
        borderRadius: 5,
    },
    multiSelectBox: {
        width: 18,
        height: 18,
        borderRadius: 4,
        justifyContent: 'center',
        alignItems: 'center',
    },
    input: {
        color: 'black',
        width: '100%',
        borderRadius: 6,
        backgroundColor: colors.greyOne,
        alignSelf: 'center',
        height: 40,
        paddingHorizontal: 10,
        borderWidth: 1,
        marginTop: 0,
        fontSize: 12,
        borderColor: colors.greyFour
    },
    container: {
        width: 30,
        height: 15,
        borderRadius: 20,
        flexDirection: 'row',
        alignItems: 'center',
    },
    toggle: {
        width: 13,
        height: 13,
        borderRadius: 15,
    },
    errorText: {
        fontSize: 12,
        color: colors.danger,
        paddingLeft: 5
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
    },
});