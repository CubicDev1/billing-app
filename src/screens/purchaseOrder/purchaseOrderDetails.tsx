import React, { Fragment, useEffect, useState } from 'react';
import { ActivityIndicator, Image, SafeAreaView, ScrollView, Share, Text, ToastAndroid, TouchableOpacity, View } from 'react-native';
import { TopHeader } from '../../components/commonComponents';
import DashedLine from '../../components/dashedLine';
import { quotationBottomBarData } from '../../utils/data/quotationsData';
import CustomIcon from '../../utils/icons';
import { labels } from '../../utils/labels';
import { SignatureImg } from '../../utils/png';
import { colors } from '../../utils/theme/colors';
import { flex1, mt10, mh10, mb10, flexRow, justifyBetween, alignItemCenter, mv10, justifyCenter, ml5, ml15, ml10, alignItemStart, mt5, mr10, mt15, mv15, mh15, alignSelfCenter, justifyStart, mv5, justifyAround, pr5, mr5, p10, m10, m5, justifyEnd } from '../../utils/theme/commonStyles';
import moment from 'moment';
import PopupCardModal from '../../components/popupCardModal';
import { getMethod, postMethod } from '../../services/apiService';
import { ApiUrl } from '../../services/apiUrl';
import { useNavigation } from '@react-navigation/native';
import { screenName } from '../../utils/screenNames';
import { handleGetInvoiceData } from '../../userCall/ApiUser';
import { DevWidth } from '../../utils/device';
import { useToast } from 'react-native-toast-notifications';
import { currencySymbol } from '../../constant/constApi';
import { OverLaySpinner } from '../../components/overLay';
import { getTopNotchStyle, getMainContainerStyle, commonStyles } from '../../utils/commonStyles';

export type purchaseDetailsProps = {

}

interface PurchaseOrderDetails {
    _id: string;
    purchaseOrderId: string;
    purchaseOrderDate: string;
    dueDate: string;
    items: Item[];
    TotalAmount: string;
    taxableAmount: string;
    totalDiscount: string;
    vat: string;
    discount: string;
    roundOff: boolean;
    bank: string | null;
    notes: string;
    referenceNo: string;
    sign_type: string;
    signatureId: Signature | null;
    signatureImage: string | null;
    signatureName: string | null;
    status: string;
    isDeleted: boolean;
    createdAt: string;
    updatedAt: string;
    userId: string;
    vendorId: Vendor;
}

interface Item {
    productId: string;
    name: string;
    quantity: string;
    rate: string;
    amount: string;
    discount: string;
    discountType: string;
    form_updated_discount: string;
    form_updated_discounttype: string;
    form_updated_rate: string;
    form_updated_tax: string;
    isRateFormUpadted: string;
    key: string;
    tax: string;
    taxInfo: TaxInfo;
    unit: string;
    units: string;
}

interface TaxInfo {
    _id: string;
    name: string;
    taxRate: string;
    status: boolean;
    type: string;
    userId: string;
    isDeleted: boolean;
    createdAt: string;
    updatedAt: string;
}

interface Signature {
    _id: string;
    signatureImage: string;
    signatureName: string;
    status: boolean;
    isDeleted: boolean;
    markAsDefault: boolean;
    createdAt: string;
    updatedAt: string;
    userId: string;
}

interface Vendor {
    _id: string;
    vendor_name: string;
    vendor_email: string;
    vendor_phone: string;
    balance: number;
    balanceType: string;
    status: boolean;
    isDeleted: boolean;
    created_at: string;
    updated_at: string;
    user_id: string;
}


const PurchaseOrderDetails = ({ route }: any) => {
    // Extract invoiceDetails from route.params
    const [invoiceDetails, setViewDetailsData] = useState<PurchaseOrderDetails | null>(null);
    const navigation = useNavigation();
    console.log('invoiceDetails', invoiceDetails);
    const [showModal, setShowModal] = useState(false);
    const [text, setText] = useState('');
    const [correctUrl, setCorrectUrl] = useState('');
    const [signName, setSignName] = useState('');
    const toast = useToast();

    useEffect(() => {
        ViewPurchaseData();
    }, []);

    useEffect(() => {
        if (invoiceDetails) {
            setCorrectUrl(invoiceDetails.signatureImage ? invoiceDetails.signatureImage : invoiceDetails.signatureId?.signatureImage ? invoiceDetails.signatureId.signatureImage : '');
            setSignName(invoiceDetails.signatureName ? invoiceDetails.signatureName : invoiceDetails.signatureId?.signatureName ? invoiceDetails.signatureId.signatureName : '');
        }
    }, [invoiceDetails])


    const ViewPurchaseData = () => {
        try {
            getMethod(
                ApiUrl.viewPurchaseOrder + route.params.itemId,
                success => {
                    if (success.code === 200) {
                        console.log('Successfully got purchase order details', success.data);
                        setViewDetailsData(success.data)
                    } else {
                        console.log('Failed to get purchase order details:', success.message);
                    }
                },
                error => {
                    console.log('Error fetching purchase order details:', error);
                }
            );
        }
        catch (error) {
            console.log('Error purchase order details:', error);
        }
    };
    return (
        <Fragment>
            <SafeAreaView style={getTopNotchStyle(true)} />

            <SafeAreaView style={getMainContainerStyle(false)}>
                <View style={[flex1]} >
                    <View style={[mh15, mv10]}>
                        <TopHeader headerText={labels.purchaseOrderDetails} />
                    </View>
                    <View style={[commonStyles.bottomWidth, mv5]} />

                    <ScrollView showsVerticalScrollIndicator={false}>
                        <View style={[flex1, mt10, mh10, mb10]}>

                            {invoiceDetails ?
                                <View>
                                    <View style={[{ paddingVertical: 10, width: '100%', backgroundColor: colors.white, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.50, shadowRadius: 3.84, elevation: 2, borderRadius: 8 }, justifyCenter]}>
                                        <View style={[flexRow, justifyBetween, alignItemCenter,]}>
                                            <View style={[ml10]}>
                                                <Text style={commonStyles.h14blackOne600}>Date</Text>
                                                <View style={[{ height: 40, width: DevWidth / 2.3, backgroundColor: colors.greyOne, borderRadius: 5 }, alignItemStart, justifyCenter, mt5]}>
                                                    <Text style={[commonStyles.h12blackTwo400, ml10]} >{moment(invoiceDetails.purchaseOrderDate).format('DD MMM YYYY')}</Text>
                                                </View>
                                            </View>
                                            <View style={[mr10]}>
                                                <Text style={commonStyles.h14blackOne600}>Purchase Order No</Text>
                                                <View style={[{ height: 40, width: DevWidth / 2.3, backgroundColor: colors.greyOne, borderRadius: 5 }, alignItemStart, justifyCenter, mt5]}>
                                                    <Text style={[commonStyles.h12blackTwo400, ml10]}>{invoiceDetails.purchaseOrderId}</Text>
                                                </View>
                                            </View>
                                        </View>
                                        <View style={[flexRow, alignItemCenter, justifyBetween, mh10, mv10]}>
                                            <View style={[flex1]}>
                                                <Text style={commonStyles.h14blackOne600}>Purchases Order To</Text>
                                            </View>
                                            <View style={{ width: 10 }} />
                                            <View style={[flex1]}>
                                                <Text style={commonStyles.h14blackOne600}>Pay To</Text>
                                            </View>
                                        </View>
                                        <View style={[flexRow, alignItemCenter, justifyBetween, mh10]}>
                                            {/* Notes Section */}
                                            <View style={[{
                                                backgroundColor: colors.greyOne,
                                                padding: 10,
                                                flex: 1,
                                                borderRadius: 5,
                                                alignSelf: 'stretch',
                                                minHeight: 50,
                                            }]}>
                                                <Text style={[commonStyles.h12blackTwo400]} >{invoiceDetails.vendorId?.vendor_name ?? "N/A"}</Text>
                                                <Text style={[commonStyles.h12blackTwo400]} >{invoiceDetails?.vendorId?.vendor_email ?? "N/A"}</Text>
                                                <Text style={[commonStyles.h12blackTwo400]} >{invoiceDetails?.vendorId?.vendor_phone ?? "N/A"}</Text>
                                            </View>

                                            <View style={{ width: 10 }} />

                                            {/* Terms & Conditions Section */}
                                            <View style={[{
                                                backgroundColor: colors.greyOne,
                                                padding: 10,
                                                flex: 1,
                                                borderRadius: 5,
                                                alignSelf: 'stretch',
                                                minHeight: 50,
                                            }]}>
                                                <View style={{ width: '100%' }}>
                                                    <Text style={[commonStyles.h12blackTwo400]} >Kanakku LLC{'\n'}Brooklyn, NY 333{'\n'}USA</Text>

                                                </View>
                                            </View>
                                        </View>
                                    </View>
                                    <View>
                                        <Text style={[commonStyles.h12BlackTwo500, mv15]} >Items</Text>
                                        <View style={[{ width: '100%', backgroundColor: colors.white, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.50, shadowRadius: 3.84, elevation: 2, borderRadius: 8, padding: 5 }, justifyCenter, alignItemCenter]}>
                                            {invoiceDetails?.items.map((item, index) => (
                                                <View style={{ width: '100%' }}>
                                                    <View key={index} style={[{ backgroundColor: colors.whiteTwo, borderWidth: 1, borderRadius: 8, borderColor: colors.greyFour }]}>
                                                        <View style={[flexRow, justifyBetween, alignItemCenter]}>
                                                            <Text style={[commonStyles.h14blackOne600, ml10]} >{item.name}</Text>
                                                            <View style={[commonStyles.smallCard, mr10, mt10, alignItemCenter, { backgroundColor: colors.redSix }]} >
                                                                <Text style={[commonStyles.h12RedTwo500, mh10]}>{currencySymbol}{parseFloat(item.amount).toFixed(2)}</Text>
                                                            </View>
                                                        </View>
                                                        <View style={[flexRow, justifyBetween, alignItemCenter, mh15, mt5]}>
                                                            <View>
                                                                <Text style={[commonStyles.h12blackTwo400, m5]} >Unit</Text>
                                                                <Text style={[commonStyles.h12BlackOne600, m5]} >{item.units}</Text>
                                                            </View>
                                                            <View>
                                                                <Text style={[commonStyles.h12blackTwo400, m5]} >Quantity</Text>
                                                                <Text style={[commonStyles.h12BlackOne600, m5]} >{item.quantity}</Text>
                                                            </View>
                                                            <View>
                                                                <Text style={[commonStyles.h12blackTwo400, m5]} >Rate</Text>
                                                                <Text style={[commonStyles.h12BlackOne600, m5]} >{currencySymbol}{parseFloat(item.rate).toFixed(2)}</Text>
                                                            </View>
                                                            <View>
                                                                <Text style={[commonStyles.h12blackTwo400, m5]} >Discount</Text>
                                                                <Text style={[commonStyles.h12BlackOne600, m5]} >{currencySymbol}{parseFloat(item.discount).toFixed(2)}</Text>
                                                            </View>
                                                        </View>
                                                    </View>
                                                </View>
                                            ))}
                                            <View style={[justifyBetween, flexRow, { width: '100%', padding: 5 }]}>
                                                <Text style={[commonStyles.h18BlackOne700, {}]}>Total</Text>
                                                <Text style={[commonStyles.h18BlackOne700, {}]}>{currencySymbol}{invoiceDetails.TotalAmount}</Text>
                                            </View>
                                        </View>
                                    </View>
                                    <View style={mv10}>
                                        <Text style={commonStyles.h14blackOne600} >Summary</Text>
                                        <View style={[{ width: '100%', backgroundColor: colors.white, borderWidth: 1, borderColor: colors.greyTwo, borderRadius: 8 }, mv10]}>
                                            <View style={[mh10, mv10]}>
                                                <View style={[flexRow, justifyBetween]}>
                                                    <Text style={[commonStyles.h14blackTwo500]}>Amount</Text>
                                                    <Text style={[commonStyles.h14blackTwo500]}>{currencySymbol}{invoiceDetails.taxableAmount}</Text>
                                                </View>
                                                <View style={[flexRow, justifyBetween, mt10]}>
                                                    <Text style={[commonStyles.h14blackTwo500]}>Discount</Text>
                                                    <Text style={[commonStyles.h14blackTwo500]}>{currencySymbol}{invoiceDetails?.totalDiscount}</Text>
                                                </View>
                                                <View style={[flexRow, justifyBetween, mt10]}>
                                                    <Text style={[commonStyles.h14blackTwo500]}>Tax</Text>
                                                    <Text style={[commonStyles.h14blackTwo500]}>{currencySymbol}{invoiceDetails?.vat}</Text>
                                                </View>
                                                <View style={{ marginVertical: 10, width: '100%', borderColor: colors.greyEight, borderStyle: 'dashed', borderBottomWidth: 1 }} />
                                                <View style={[flexRow, justifyBetween]}>
                                                    <Text style={[commonStyles.h18BlackOne700, {}]}>Total</Text>
                                                    <Text style={[commonStyles.h18BlackOne700, {}]}>{currencySymbol}{invoiceDetails.TotalAmount}</Text>
                                                </View>
                                            </View>
                                        </View>
                                    </View>
                                    {/* <View style={[flexRow, alignItemCenter, justifyBetween, mh10]}>
                                <View style={{ padding: 10, flex: 1, backgroundColor: colors.blueOne, borderRadius: 5 }}>
                                    <View style={[flexRow, alignItemCenter, justifyStart]}>
                                        <View>
                                            <CustomIcon color={colors.blackOne} name='file-outline' size={16} type='MaterialCommunityIcons' />
                                        </View>
                                        <Text style={[commonStyles.h14blackTwo500,ml5]}>labels.notes}</Text>
                                    </View>
                                    <Text style={[commonStyles.h12BlackOne600]} style={[mt5]}>{invoiceDetails?.notes}</Text>
                                </View>
                                <View style={{ width: 10 }} />
                                <View style={{ padding: 10, flex: 1, backgroundColor: colors.greenOne, borderRadius: 5 }}>
                                    <View style={[flexRow, alignItemCenter, justifyStart]}>
                                        <View>
                                            <CustomIcon color={colors.blackOne} name='file-outline' size={16} type='MaterialCommunityIcons' />
                                        </View>
                                        <Text style={[commonStyles.h14blackTwo500,ml5]}>labels.termsConditions}</Text>
                                    </View>
                                    <View style={{ width: '100%' }}>
                                        <Text style={[commonStyles.h12BlackOne600]} style={[mt5]}>{invoiceDetails?.termsAndCondition + "dsadasd ds ass da sd asd as d sa"}</Text>
                                    </View>
                                </View>
                            </View> */}

                                    <View style={[flexRow, alignItemCenter, justifyBetween, mh10]}>
                                        {/* Notes Section */}
                                        <View style={[{
                                            backgroundColor: colors.blueOne,
                                            padding: 10,
                                            flex: 1,
                                            borderRadius: 5,
                                            alignSelf: 'stretch',
                                            minHeight: 50,
                                        }]}>
                                            <View style={[flexRow, alignItemCenter, justifyStart]}>
                                                <CustomIcon color={colors.blackOne} name='file-outline' size={16} type='MaterialCommunityIcons' />
                                                <Text style={[commonStyles.h14blackTwo500, ml5]}>{labels.notes}</Text>
                                            </View>
                                            <Text style={[commonStyles.h12blackTwo400, mt5]} >{invoiceDetails?.notes}</Text>
                                        </View>

                                        <View style={{ width: 10 }} />

                                        {/* Terms & Conditions Section */}
                                        <View style={[{
                                            backgroundColor: colors.greenOne,
                                            padding: 10,
                                            flex: 1,
                                            borderRadius: 5,
                                            alignSelf: 'stretch',
                                            minHeight: 50,
                                        }]}>
                                            <View style={[flexRow, alignItemCenter, justifyStart]}>
                                                <CustomIcon color={colors.blackOne} name='file-outline' size={16} type='MaterialCommunityIcons' />
                                                <Text style={[commonStyles.h14blackTwo500, ml5]}>{labels.termsConditions}</Text>
                                            </View>
                                            <View style={{ width: '100%' }}>
                                                <Text style={[commonStyles.h12blackTwo400, mt5]} >{invoiceDetails?.termsAndCondition}</Text>
                                            </View>
                                        </View>
                                    </View>
                                    <View style={[mv10, { alignItems: 'flex-end' }]}>
                                        <Text style={[commonStyles.h14blackOne600, { alignItems: 'flex-end' }]} >{signName ?? 'Signature'}</Text>
                                        {correctUrl != null &&
                                            <View style={{}}>
                                                <View style={{ padding: 5, marginTop: 5, alignItems: 'flex-end', borderRadius: 5, borderColor: colors.grey, borderWidth: 0.5 }}>
                                                    <Image
                                                        source={{ uri: correctUrl }}
                                                        style={{ width: 100, height: 30, resizeMode: 'contain' }}
                                                    />
                                                </View>
                                            </View>}

                                    </View>
                                </View>
                                : <View style={[flex1, alignItemCenter, justifyCenter]}>
                                    <ActivityIndicator color={colors.primary || 'blue'} size="large" />
                                </View>}
                        </View>
                    </ScrollView>
                </View>
            </SafeAreaView>
        </Fragment >
    )
}

export default PurchaseOrderDetails