import React from 'react';
import { Image, ScrollView, Text, View } from 'react-native';
import { TopHeader } from '../../components/commonComponents';
import DashedLine from '../../components/dashedLine';
import { quotationBottomBarData } from '../../utils/data/quotationsData';
import CustomIcon from '../../utils/icons';
import { labels } from '../../utils/labels';
import { SignatureImg } from '../../utils/png';
import { colors } from '../../utils/theme/colors';
import { flex1, mt10, mh10, mb10, flexRow, justifyBetween, alignItemCenter, mv10, justifyCenter, ml5, ml15, ml10, alignItemStart, mt5, mr10, mt15, mv15, mh15, alignSelfCenter, justifyStart, mv5, justifyAround, pv15 } from '../../utils/theme/commonStyles';
import { DevWidth } from '../../utils/device';
import { commonStyles } from '../../utils/commonStyles';

export type creditNotesDetailsProps = {
    
    }


const CreditNotesDetailsScreen = (props: creditNotesDetailsProps) => {
    return (
        <View style={[flex1, { backgroundColor: colors.white }]}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={[flex1, mt10, mh10, mb10]}>
                    <TopHeader headerText={labels.creditNotesDetails} searchIcon={false} />
                    <View style={[flexRow, justifyBetween, alignItemCenter, mv10]}>
                        <View>
                            <Text style={[commonStyles.h18BlackOne700,{}]}>Credit Notes Details</Text>
                        </View>
                        <View style={[flexRow, justifyBetween, alignItemCenter]}>
                            <View style={[{ height: 30, width: 30, backgroundColor: colors.greyOne, borderRadius: 15 }, alignItemCenter, justifyCenter]}>
                                <CustomIcon name={'edit'} size={15} color={colors.blackTwo} type={'Feather'} />
                            </View>
                            <View style={[{ height: 30, width: 30, backgroundColor: colors.greyOne, borderRadius: 15 }, alignItemCenter, justifyCenter, ml5]}>
                                <CustomIcon name={'delete-forever-outline'} size={17} color={colors.blackTwo} type={'MaterialCommunityIcons'} />
                            </View>
                            <View style={[{ height: 25, width: 50, backgroundColor: colors.green, borderRadius: 5 }, alignItemCenter, justifyCenter, flexRow, ml15]}>
                                <View style={{ height: 6, width: 6, borderRadius: 10, backgroundColor: colors.white }} />
                                <Text style={[commonStyles.h12white600,ml5]} >Paid</Text>
                            </View>
                        </View>
                    </View>
                    <View style={[{ height: 180, width: '100%', backgroundColor: colors.white, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.50, shadowRadius: 3.84, elevation: 2, borderRadius: 8 }, justifyCenter]}>
                        <View style={[flexRow, justifyBetween, alignItemCenter,]}>
                            <View style={[ml10]}>
                               <Text style={commonStyles.h14blackOne600}>Date</Text>
                                <View style={[{ height: 40, width: DevWidth / 2.3, backgroundColor: colors.greyOne, borderRadius: 5 }, alignItemStart, justifyCenter, mt5]}>
                                    <Text style={[commonStyles.h14BlackTwo400,ml10]}>15 Mar 2024</Text>
                                </View>
                            </View>
                            <View style={[mr10]}>
                               <Text style={commonStyles.h14blackOne600}>Credit Note No</Text>
                                <View style={[{ height: 40, width: DevWidth / 2.3, backgroundColor: colors.greyOne, borderRadius: 5 }, alignItemStart, justifyCenter, mt5]}>
                                    <Text style={[commonStyles.h14BlackTwo400,ml10]} >QUO - 000015</Text>
                                </View>
                            </View>
                        </View>
                        <View style={[flexRow, justifyBetween, alignItemCenter, mt15]}>
                            <View style={[ml10]}>
                               <Text style={commonStyles.h14blackOne600}>Purchase Order To</Text>
                                <View style={[{ height: 60, width: DevWidth / 2.3, backgroundColor: colors.greyOne, borderRadius: 5 }, alignItemStart, justifyCenter, mt5]}>
                                    <Text style={[commonStyles.h14BlackTwo400,ml10]} >Naveen Bansel{'\n'}yodha@gmail.com{'\n'}987654321</Text>
                                </View>
                            </View>
                            <View style={[mr10]}>
                               <Text style={commonStyles.h14blackOne600}>Pay To</Text>
                                <View style={[{ height: 60, width: DevWidth / 2.3, backgroundColor: colors.greyOne, borderRadius: 5 }, alignItemStart, justifyCenter, mt5]}>
                                    <Text style={[commonStyles.h14BlackTwo400,ml10]}>KanakkuLLC{'\n'}Brooklyn, NY 333{'\n'}USA</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                    <View>
                        <Text style={[commonStyles.h12BlackTwo500,mv15]}>Items</Text>
                        <View style={[{ width: '100%', backgroundColor: colors.white, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.50, shadowRadius: 3.84, elevation: 2, borderRadius: 8 }, justifyCenter, alignItemCenter, pv15]}>
                            <View style={[{ height: 80, width: '90%', backgroundColor: colors.whiteTwo, borderWidth: 1, borderRadius: 8, borderColor: colors.greyFour }]}>
                                <View style={[flexRow, justifyBetween, alignItemCenter]}>
                                  <Text style={[commonStyles.h14blackOne600,ml10]} >Nike Shoe</Text>
                                                                                                <View style={[commonStyles.smallCard,mr10, mt10, alignItemCenter, { backgroundColor: colors.redSix }]}>

                                       <Text style={[commonStyles.h12RedTwo500,mh10]} >$5000</Text>
                                    </View>
                                </View>
                                <View style={[flexRow, justifyBetween, alignItemCenter, mh15, mt5]}>
                                    <View>
                                        <Text style={[commonStyles.h12blackTwo400]}>Unit</Text>
                                        <Text style={[commonStyles.h12BlackOne600]}>Pc</Text>
                                    </View>
                                    <View>
                                        <Text style={[commonStyles.h12blackTwo400]}>Quantity</Text>
                                        <Text style={[commonStyles.h12BlackOne600]}>10</Text>
                                    </View>
                                    <View>
                                        <Text style={[commonStyles.h12blackTwo400]}>Rate</Text>
                                        <Text style={[commonStyles.h12BlackOne600]}>$7000</Text>
                                    </View>
                                    <View>
                                        <Text style={[commonStyles.h12blackTwo400]}>Discount</Text>
                                        <Text style={[commonStyles.h12BlackOne600]}>$2000</Text>
                                    </View>
                                </View>
                            </View>
                            <View style={[{ height: 80, width: '90%', backgroundColor: colors.whiteTwo, borderWidth: 1, borderRadius: 8, borderColor: colors.greyFour }, mt10]}>
                                <View style={[flexRow, justifyBetween, alignItemCenter]}>
                                  <Text style={[commonStyles.h14blackOne600,ml10]} >Iphone 15 pro</Text>
                                                                                                <View style={[commonStyles.smallCard,mr10, mt10, alignItemCenter, { backgroundColor: colors.redSix }]}>

                                       <Text style={[commonStyles.h12RedTwo500,mh10]} >$5450</Text>
                                    </View>
                                </View>
                                <View style={[flexRow, justifyBetween, alignItemCenter, mh15, mt5]}>
                                    <View>
                                        <Text style={[commonStyles.h12blackTwo400]}>Unit</Text>
                                        <Text style={[commonStyles.h12BlackOne600]}>Pc</Text>
                                    </View>
                                    <View>
                                        <Text style={[commonStyles.h12blackTwo400]}>Quantity</Text>
                                        <Text style={[commonStyles.h12BlackOne600]}>10</Text>
                                    </View>
                                    <View>
                                        <Text style={[commonStyles.h12blackTwo400]}>Rate</Text>
                                        <Text style={[commonStyles.h12BlackOne600]}>$4547</Text>
                                    </View>
                                    <View>
                                        <Text style={[commonStyles.h12blackTwo400]}>Discount</Text>
                                        <Text style={[commonStyles.h12BlackOne600]}>$1047</Text>
                                    </View>
                                </View>
                            </View>
                            <View style={[justifyBetween, mh15, flexRow, mt10, { height: 20, width: '90%' }]}>
                                <Text style={[commonStyles.h18BlackOne700,{}]}>Total</Text>
                                <Text style={[commonStyles.h18BlackOne700,{}]}>$11500</Text>
                            </View>
                        </View>
                    </View>
                    <View style={mv10}>
                       <Text style={commonStyles.h14blackOne600} >Invoice Summary</Text>
                        <View style={[{ height: 130, width: '100%', backgroundColor: colors.white, borderWidth: 1, borderColor: colors.greyTwo, borderRadius: 8 }, mv10]}>
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
                    <View style={[flexRow, alignItemCenter, justifyBetween, mh10]}>
                        <View style={[flexRow, alignItemCenter, justifyStart, { height: 35, width: '48%', backgroundColor: colors.greenOne, borderRadius: 5 }]}>
                            <View style={[ml10]}>
                                <CustomIcon color={colors.blackOne} name='file-outline' size={16} type='MaterialCommunityIcons' />
                            </View>
                            <Text style={[commonStyles.h14blackTwo500,ml5]}>Terms & Conditions</Text>
                        </View>
                        <View style={[flexRow, alignItemCenter, justifyStart, { height: 35, width: '48%', backgroundColor: colors.lightBlue, borderRadius: 5 }]}>
                            <View style={[ml10]}>
                                <CustomIcon color={colors.blackOne} name='file-outline' size={16} type='MaterialCommunityIcons' />
                            </View>
                            <Text style={[commonStyles.h14blackTwo500,ml5]} >Terms & Conditions</Text>
                        </View>
                    </View>
                    <View style={mv10}>
                       <Text style={commonStyles.h14blackOne600} >Signature</Text>
                        <View style={[flexRow, alignItemCenter, alignSelfCenter, justifyStart, mv5, { height: 35, width: '95%', backgroundColor: colors.greenOne, borderRadius: 5 }]}>
                            <View style={[]}>
                                <Image source={SignatureImg} style={{ height: 20, width: 70 }} />
                            </View>
                        </View>
                    </View>
                    <View style = {[flexRow, justifyAround]}>
                        {
                            quotationBottomBarData.map((item) => {
                                return (
                                    <View key={item.id}>
                                        <View style={[{ height: 30, width: 30, backgroundColor: colors.greyOne, borderRadius: 15 }, alignItemCenter, justifyCenter]}>
                                            <CustomIcon name={item.iconName} size={15} color={colors.blackTwo} type={item.iconType} />
                                        </View>
                                        <Text style={[commonStyles.h14blackTwo500,mt5]}>{item.name}</Text>
                                    </View>
                                )
                            })
                        }
                    </View>
                </View>
            </ScrollView>
        </View>
    )
}

export default CreditNotesDetailsScreen;