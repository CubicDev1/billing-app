import React, { Fragment, useState } from 'react';
import { Image, SafeAreaView, ScrollView, Share, Text, ToastAndroid, TouchableOpacity, View } from 'react-native';
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
import { useSelector } from 'react-redux';
import { getTopNotchStyle, getMainContainerStyle, commonStyles } from '../../utils/commonStyles';

interface Address {
    name: string;
    addressLine1: string;
    addressLine2: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
}

interface BankDetails {
    bankName: string;
    branch: string;
    accountHolderName: string;
    accountNumber: string;
    IFSC: string;
}

interface Customer {
    _id: string;
    name: string;
    email: string;
    phone: string;
    website?: string;
    image?: string;
    notes?: string;
    status: string;
    billingAddress: Address;
    shippingAddress: Address;
    bankDetails: BankDetails;
    userId: string;
    isDeleted: boolean;
    createdAt: string;
    updatedAt: string;
    __v: number;
}

interface Item {
    name: string;
    key: string;
    productId: string;
    quantity: string;
    units: string;
    unit: string;
    rate: string;
    discount: string;
    tax: string;
    taxInfo: string; // or define the object if it's not a string
    amount: string;
    discountType: string;
    isRateFormUpdated: string;
    form_updated_discounttype: string;
    form_updated_discount: string;
    form_updated_rate: string;
    form_updated_tax: string;
}

interface Signature {
    _id: string;
    signatureName: string;
    signatureImage: string;
    status: boolean;
    markAsDefault: boolean;
    isDeleted: boolean;
    userId: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
}

interface InvoiceDetails {
    billingAddress: any;
    _id: string;
    deliveryChallanNumber: string;
    customerId: Customer;
    invoiceDate: string;
    dueDate: string;
    renewalDates: string[];
    status: string;
    payment_method: string;
    referenceNo: string;
    isRecurringCancelled: boolean;
    isRecurring: boolean;
    recurringCycle: string;
    items: Item[];
    taxableAmount: string;
    totalDiscount: string;
    vat: string;
    roundOff: boolean;
    TotalAmount: string;
    bank: string | null;
    notes: string;
    sign_type: string;
    signatureId: Signature | null;
    signatureImage: string | null;
    isDeleted: boolean;
    isCloned: boolean;
    isSalesReturned: boolean;
    userId: string;
    createdAt: string;
    updatedAt: string;
    id: string;
    balance: string;
    paidAmount: number;
}

interface Item {
    name: string;
    key: string;
    productId: string;
    quantity: string;
    units: string;
    unit: string;
    rate: string;
    discount: string;
    tax: string;
    taxInfo: string;
    amount: string;
    discountType: string;
    isRateFormUpadted: string;
    form_updated_discounttype: string;
    form_updated_discount: string;
    form_updated_rate: string;
    form_updated_tax: string;
}

interface Props {
    items: Item[];
}

interface InvoiceDetailsProps {
    route: {
        params: {
            deliveryChallanData: InvoiceDetails;
        };
    };
    signatureImageUrlParts: string[] | undefined;

}


const DeliveryChallanDetailsScreen: React.FC<InvoiceDetailsProps> = ({ route }) => {
    // Extract invoiceDetails from route.params
    const invoiceDetails = route?.params?.deliveryChallanData;
    const navigation = useNavigation();
    console.log('invoiceDetails', invoiceDetails);
    const ProductsList: Array<{ name: string, _id: string }> = useSelector((state: any) => state?.Reducer?.product);
    const [showModal, setShowModal] = useState(false);
    const UnitsList: Array<{ name: string, _id: string }> = useSelector((state: any) => state?.Reducer?.units);
    const [text, setText] = useState('');
    let correctUrl = invoiceDetails.signatureImage ? invoiceDetails.signatureImage : invoiceDetails.signatureId?.signatureImage ? invoiceDetails.signatureId.signatureImage : '';
    let signName = invoiceDetails.signatureName ? invoiceDetails.signatureName : invoiceDetails.signatureId?.signatureName ? invoiceDetails.signatureId.signatureName : '';
    const toast = useToast();

    return (
        <Fragment>
            <SafeAreaView style={getTopNotchStyle(true)} />

            <SafeAreaView style={getMainContainerStyle(false)}>
                <View style={[flex1]}>
                    <View style={[mh15, mv10]}>
                        <TopHeader headerText={labels.deliveryChallanDetails} />
                    </View>
                     <View style={[commonStyles.bottomWidth,mv5]} />
                    <ScrollView showsVerticalScrollIndicator={false}>
                        <View style={[flex1, mt10, mh10, mb10]}>
                            {/* <TopHeader headerText={labels.invoiceDetails} searchIcon={false} /> */}
                            <View style={[{ paddingVertical: 10, width: '100%', backgroundColor: colors.white, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.50, shadowRadius: 3.84, elevation: 2, borderRadius: 8 }, justifyCenter]}>
                                <View style={[flexRow, justifyBetween, alignItemCenter,]}>
                                    <View style={[ml10]}>
                                       <Text style={commonStyles.h14blackOne600}>Date</Text>
                                        <View style={[{ height: 40, width: DevWidth / 2.3, backgroundColor: colors.greyOne, borderRadius: 5 }, alignItemStart, justifyCenter, mt5]}>
                                            <Text style={[commonStyles.h12blackTwo400,ml10]} >{moment(invoiceDetails.deliveryChallanDate).format('DD MMM YYYY')}</Text>
                                        </View>
                                    </View>
                                    <View style={[mr10]}>
                                       <Text style={commonStyles.h14blackOne600}>Invoice No</Text>
                                        <View style={[{ height: 40, width: DevWidth / 2.3, backgroundColor: colors.greyOne, borderRadius: 5 }, alignItemStart, justifyCenter, mt5]}>
                                            <Text style={[commonStyles.h12blackTwo400,ml10]} >{invoiceDetails.deliveryChallanNumber}</Text>
                                        </View>
                                    </View>
                                </View>

                                <View style={[flexRow, alignItemCenter, justifyBetween, mh10, mv10]}>
                                    <View style={[flex1]}>
                                       <Text style={commonStyles.h14blackOne600}>Quotation To</Text>
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
                                        <Text style={[commonStyles.h12blackTwo400]} >{invoiceDetails.customerId.name ?? "N/A"}</Text>
                                        <Text style={[commonStyles.h12blackTwo400]} >{invoiceDetails?.customerId?.email ?? "N/A"}</Text>
                                        <Text style={[commonStyles.h12blackTwo400]} >{invoiceDetails?.customerId?.phone ?? "N/A"}</Text>
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
                                <Text style={[commonStyles.h12BlackTwo500,mv15]}>Items</Text>
                                <View style={[{ width: '100%', backgroundColor: colors.white, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.50, shadowRadius: 3.84, elevation: 2, borderRadius: 8, padding: 5 }, justifyCenter, alignItemCenter]}>
                                    {invoiceDetails?.items.map((item, index) => (
                                        <View style={{ width: '100%' }}>
                                            <View key={index} style={[{ backgroundColor: colors.whiteTwo, borderWidth: 1, borderRadius: 8, borderColor: colors.greyFour }]}>
                                                <View style={[flexRow, justifyBetween, alignItemCenter]}>
                                                   <Text style={[commonStyles.h14blackOne600,ml10]}>{ProductsList.find(product => product._id === item.productId)?.name ?? "N/A"}</Text>
                                                                                                                <View style={[commonStyles.smallCard,mr10, mt10, alignItemCenter, { backgroundColor: colors.redSix }]}>

                                                       <Text style={[commonStyles.h12RedTwo500,mh10]} >{currencySymbol}{parseFloat(item.amount).toFixed(2)}</Text>
                                                    </View>
                                                </View>
                                                <View style={[flexRow, justifyBetween, alignItemCenter, mh15, mt5]}>
                                                    <View>
                                                        <Text style={[commonStyles.h12blackTwo400,m5]}>Unit</Text>
                                                        <Text style={[commonStyles.h12BlackOne600,m5]} >{UnitsList.find(unit => unit._id === item.unit)?.name ?? "N/A"}</Text>
                                                    </View>
                                                    <View>
                                                        <Text style={[commonStyles.h12blackTwo400,m5]}>Quantity</Text>
                                                        <Text style={[commonStyles.h12BlackOne600,m5]}>{item.quantity}</Text>
                                                    </View>
                                                    <View>
                                                        <Text style={[commonStyles.h12blackTwo400,m5]}>Rate</Text>
                                                        <Text style={[commonStyles.h12BlackOne600,m5]}>{currencySymbol}{parseFloat(item.rate).toFixed(2)}</Text>
                                                    </View>
                                                    <View>
                                                        <Text style={[commonStyles.h12blackTwo400,m5]}>Discount</Text>
                                                        <Text style={[commonStyles.h12BlackOne600,m5]} >{currencySymbol}{parseFloat(item.discount).toFixed(2)}</Text>
                                                    </View>
                                                </View>
                                            </View>
                                        </View>
                                    ))}
                                    <View style={[justifyBetween, flexRow, { width: '100%', padding: 5 }]}>
                                        <Text style={[commonStyles.h18BlackOne700,{}]}>Total</Text>
                                        <Text style={[commonStyles.h18BlackOne700,{}]}>{currencySymbol}{invoiceDetails.TotalAmount}</Text>
                                    </View>
                                </View>
                            </View>
                            <View style={mv10}>
                               <Text style={commonStyles.h14blackOne600} >Invoice Summary</Text>
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
                                            <Text style={[commonStyles.h18BlackOne700,{}]}>Total</Text>
                                            <Text style={[commonStyles.h18BlackOne700,{}]}>{currencySymbol}{invoiceDetails.TotalAmount}</Text>
                                        </View>
                                    </View>
                                </View>
                            </View>

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
                                        <Text style={[commonStyles.h14blackTwo500,ml5]} >{labels.notes}</Text>
                                    </View>
                                      <Text style={[commonStyles.h12blackTwo400,mt5]} >{invoiceDetails?.notes}</Text>
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
                                        <Text style={[commonStyles.h14blackTwo500,ml5]}>{labels.termsConditions}</Text>
                                    </View>
                                    <View style={{ width: '100%' }}>
                                          <Text style={[commonStyles.h12blackTwo400,mt5]} >{invoiceDetails?.termsAndCondition}</Text>
                                    </View>
                                </View>
                            </View>
                            <View style={[mv10, { alignItems: 'flex-end' }]}>
                               <Text style={[commonStyles.h14blackOne600,{alignItems:'flex-end'}]} >{signName ?? 'Signature'}</Text>
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
                    </ScrollView>
                </View>
            </SafeAreaView>
        </Fragment >
    )
}

export default DeliveryChallanDetailsScreen