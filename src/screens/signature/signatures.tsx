import { useIsFocused, useNavigation } from '@react-navigation/native';
import React, { Fragment, useEffect, useState } from 'react';
import { Image, SafeAreaView, ScrollView, Text, ToastAndroid, TouchableOpacity, View } from 'react-native';
import BottomNavBar from '../../components/bottomNavBar';
import { ListSubHeader, TopHeader } from '../../components/commonComponents';
import DashedLine from '../../components/dashedLine';
import { getMethod, patchMethod } from '../../services/apiService';
import { ApiUrl } from '../../services/apiUrl';
import { DevHeight, DevWidth } from '../../utils/device';
import CustomIcon from '../../utils/icons';
import { labels } from '../../utils/labels';
import { screenName } from '../../utils/screenNames';
import { colors } from '../../utils/theme/colors';
import { alignSelfCenter, flex1, flexRow, justifyBetween, mh15, mh5, mv15, mv5, ph10, pt10 } from '../../utils/theme/commonStyles';
import { StyleSheet } from 'react-native';
import PopupCardModal from '../../components/popupCardModal';
import { useToast } from 'react-native-toast-notifications';
import { getTopNotchStyle, getMainContainerStyle, commonStyles } from '../../utils/commonStyles';

export type ReportsProps = {};

export interface Signature {
    __v: number;
    _id: string;
    createdAt: string;
    isDeleted: boolean;
    markAsDefault: boolean;
    signatureImage: string;
    signatureName: string;
    status: boolean;
    updatedAt: string;
    userId: string;
}

const Signatures = (props: ReportsProps) => {
    const [activeId, setActiveId] = useState<number | null>(1);
    const navigation = useNavigation();
    const [signatures, setSignatures] = useState<Signature[]>([]);
    const [loading, setLoading] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [selectedId, setSelectedId] = useState(null)
    const toast = useToast();
    const isFocus = useIsFocused();
    useEffect(() => {
        getSignatureList();
    }, [isFocus]);

    const handleItemClick = (id: number) => {
        getMethod(
            `${ApiUrl.listOfSignature}?signatureId=${id}`,
            success => {
                if (success.code === 200) {
                } else {
                }
                getSignatureList();
            },
            error => {
            }
        );
    };

    const getSignatureList = () => {
        setLoading(true);
        getMethod(
            ApiUrl.listOfSignature,
            success => {
                if (success.code === 200) {
                    setSignatures(success.data);
                    const defaultSignature = success.data.find((signature: Signature) => signature.markAsDefault === true);
                    if (defaultSignature) {
                        setActiveId(defaultSignature._id);
                    }
                    else {
                        setActiveId(1);
                    }
                    console.log('Successfully got signature list', success.data);
                } else {
                    console.log('Failed from signature list', success.message);
                }
                setLoading(false);
            },
            error => {
                console.log('Error fetching signature list:', error);
                setLoading(false);
            }
        );
    };
    const handleDelete = (id: string) => {
        setOpenModal(true);
        setSelectedId(id);
    }

    const HandleAction = () => {
        setOpenModal(false);
        try {
            patchMethod(
                `${ApiUrl.deleteSignature}${selectedId}`,
                {},
                (success: { code: number; message: any; }) => {
                    if (success.code === 200) {
                        console.log('Successfully deleted');
                        toast.show("Signature deleted successfully", { type: "normal", placement: "bottom", duration: 4000, animationType: "slide-in", });
                        getSignatureList();
                    } else {
                        toast.show("Failed to delete'", { type: "normal", placement: "bottom", duration: 4000, animationType: "slide-in", });
                        console.log('Failed to delete:', success.message);
                    }
                },
                (error: any) => {
                    toast.show("Failed to delete'", { type: "normal", placement: "bottom", duration: 4000, animationType: "slide-in", });
                    console.log('Error deleting:', error);
                }
            );
        }
        catch (error) {
            toast.show("Failed to delete", { type: "normal", placement: "bottom", duration: 4000, animationType: "slide-in", });
            console.log('Error deleting:', error);
        }
    }

    return (
        <Fragment>
            <SafeAreaView style={getTopNotchStyle(true)} />
            <SafeAreaView style={getMainContainerStyle(false)}>
                <View style={[flex1]}>
                    <View style={{ flex: 1, backgroundColor: colors.whiteTwo }}>
                        <View style={mh15}>
                            <View style={mv15}>
                                <TopHeader
                                    headerText={labels.signatures}
                                    searchIcon={false}
                                    searchName={'Search ' + labels.invoiceTemplates}
                                />
                            </View>
                            <View style={[commonStyles.bottomWidth,mv5]}  />
                            <ScrollView>
                                <ListSubHeader listName={labels.signatures} totalNumber={signatures?.length ?? 0} onAddPress={() => navigation.navigate(screenName.AddSignatures as never)} addIcon={true} filterIcon={false} />
                                <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginVertical: 15 }}>
                                    {signatures.map((signature, index) => {
                                        const isActive = activeId === signature?._id;
                                        const backgroundColor = signature.status ? colors.green : colors.danger;
                                        return (
                                            <View key={index} style={[{ width: '100%', padding: 5 },]}>
                                                <View style={[{ backgroundColor: 'white', height: 100, borderRadius: 5, elevation: 3, }, ph10, pt10]}>
                                                    <View style={[flexRow, justifyBetween]}>
                                                        <Text style={[commonStyles.h15blackOne600,alignSelfCenter]} >{signature.signatureName}</Text>
                                                        <View style={{ flexDirection: 'row', alignSelf: 'center' }}>
                                                            <TouchableOpacity onPress={() => handleItemClick(signature._id)} style={{ backgroundColor: colors.greyOne, height: 32, width: 32, borderRadius: 30, justifyContent: 'center', alignItems: 'center' }} /* onPress={() => handleItemClick(index)} */ >
                                                                <CustomIcon name={isActive ? 'star' : 'star-o'} size={isActive ? 16 : 16} color={isActive ? colors.primary : colors.blackTwo} type={'FontAwesome'} />
                                                            </TouchableOpacity>
                                                            <TouchableOpacity onPress={() => navigation.navigate(screenName.AddSignatures, { signatureDetail: signature } as never)} style={{ backgroundColor: colors.greyOne, height: 32, width: 32, borderRadius: 30, justifyContent: 'center', alignItems: 'center', marginHorizontal: 3 }}>
                                                                <CustomIcon name={'edit'} size={16} color={colors.blackTwo} type={'Feather'} />
                                                            </TouchableOpacity>
                                                            <TouchableOpacity onPress={() => handleDelete(signature._id)} style={{ backgroundColor: colors.greyOne, height: 32, width: 32, borderRadius: 30, justifyContent: 'center', alignItems: 'center' }}>
                                                                <CustomIcon name={'delete-forever-outline'} size={18} color={colors.blackTwo} type={'MaterialCommunityIcons'} />
                                                            </TouchableOpacity>
                                                        </View>
                                                    </View>
                                                    <View style={{ marginVertical: 10 }}>
                                                        <DashedLine height={DevWidth - 50} color={colors.greyTwo} dashLength={10} dashGap={3} />
                                                    </View>
                                                    <View style={[flexRow, justifyBetween, { right: 10 }]}>
                                                        <Image source={{ uri: signature.signatureImage }} style={{ height: 26, width: 89, resizeMode: 'contain' }} />
                                                        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                                            <View style={{ backgroundColor, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 5, paddingVertical: 4, borderRadius: 4 }}>
                                                                <View style={{ height: 6, width: 6, borderRadius: 6, backgroundColor: colors.white, }} />
                                                                <Text style={[commonStyles.h12white600,mh5]}>{signature.status ? 'Active' : 'Inactive'}</Text>
                                                            </View>
                                                        </View>
                                                    </View>
                                                </View>
                                            </View>
                                        );
                                    })}
                                </View>
                            </ScrollView>
                            {openModal && (
                                <PopupCardModal
                                    handleYesBtn={HandleAction}
                                    text={`Are you sure you want to delete this signature?`}
                                    visible={openModal}
                                    onClose={() => setOpenModal(false)}
                                />
                            )}
                        </View>
                        <BottomNavBar />
                    </View>
                </View>
            </SafeAreaView>
        </Fragment>
    );
};



export default Signatures;
