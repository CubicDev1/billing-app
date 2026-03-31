import { useFocusEffect, useNavigation } from '@react-navigation/native';
import React, { Fragment, useCallback, useEffect, useState } from 'react';
import { Image, SafeAreaView, Text, TouchableOpacity, View } from 'react-native';
import { ToggleSwitch, TopHeader } from '../../components/commonComponents';
import LoadingIndicator from '../../components/loadingIndicator';
import { getMethod } from '../../services/apiService';
import { ApiUrl } from '../../services/apiUrl';
import { settingsData } from '../../utils/data/settingsData';
import CustomIcon from '../../utils/icons';
import { labels } from '../../utils/labels';
import { screenName } from '../../utils/screenNames';
import { colors } from '../../utils/theme/colors';
import { alignItemCenter, alignSelfCenter, bg_color_white, flex1, flexRow, justifyBetween, justifyCenter, mh10, mh15, mv10, mv15, mv5 } from '../../utils/theme/commonStyles';
import BottomNavBar from '../../components/bottomNavBar';
import { defaultImage, defaultProfileImage, fallbackImage, ProfileImage } from '../../utils/png';
import { clearStorage } from '../../utils/async';
import { getTopNotchStyle, getMainContainerStyle, commonStyles } from '../../utils/commonStyles';

export type SettingsProps = {}

export interface ProfileData {
    DOB: string
    _id: string
    addressInformation: AddressInformation
    createdAt: string
    email: string
    fcmToken: string
    firstName: string
    fullname: string
    gender: string
    image: string
    isDeleted: boolean
    lastName: string
    mobileNumber: string
    requestForDelete: boolean
    role: string
    status: string
    updatedAt: string
    userId: string
    userName: string
}

export interface AddressInformation {
    address: string
    city: string
    country: string
    postalcode: string
    state: string
}

const SettingsScreen = (props: SettingsProps) => {
    const [profileView, setProfileView] = useState<ProfileData | null>(null);
    const [toggleVisible, setToggleVisible] = useState(false);
    const [loading, setLoading] = useState(true);
    const navigation = useNavigation();

    const handleToggleChange = () => {
        setToggleVisible(!toggleVisible);
    };

    useEffect(() => {
        setLoading(true);
        getProfile();
    }, [])

    useFocusEffect(
        useCallback(() => {
            getProfile();
        }, [])
    );

    const [isValidImage, setIsValidImage] = useState(false);
    useEffect(() => {
        if (profileView?.image) {
            Image.prefetch(profileView.image)
                .then(() => setIsValidImage(true))
                .catch(() => setIsValidImage(false));
        }
    }, [profileView?.image]);

    const handleSettingsItemPress = (moveTo?: string) => {
        if (moveTo) {
            if (moveTo == screenName.LoginEmailScreen) {
                navigation.reset({
                    index: 0,
                    routes: [{ name: screenName.LoginEmailScreen }],
                });
                clearStorage();
                return;
            }
            navigation.navigate(moveTo);
        } else {
            setToggleVisible(!toggleVisible);
        }
    };

    const getProfile = () => {
        getMethod(
            ApiUrl.settingsProfile,
            success => {
                if (success.code === 200) {
                    setProfileView(success.data);
                    setLoading(false);
                    console.log('Successfully got settings profile', success.data);
                } else {
                    console.log('Failed from settings profile', success.message);
                    setLoading(false);
                }
            },
            error => {
                console.log('Error fetching unit list:', error);
                setLoading(false);
            }
        );
    };

    if (loading) {
        return (
            <View style={[flex1, bg_color_white, justifyCenter, alignItemCenter]}>
                <LoadingIndicator />
            </View>
        );
    }

    return (
        <Fragment>
            <SafeAreaView style={getTopNotchStyle(true)} />

            <SafeAreaView style={getMainContainerStyle(false)}>
                <View style={[flex1]}>

                    <View style={[flex1, bg_color_white]}>
                        <View style={[mh15]}>
                            <View style={[mv15]}>
                                <TopHeader headerText={labels.settings} searchIcon={false} searchName={labels.settings} searchText={'Search ' + labels.settings} />
                            </View>
                             <View style={[commonStyles.bottomWidth,mv5]}  />
                            <View style={[mv10, flexRow, justifyBetween, alignItemCenter]}>
                                <TouchableOpacity style={[flexRow, alignItemCenter]} onPress={() => navigation.navigate(screenName.AccountSettings as never)}>
                                    <Image
                                        source={isValidImage ? { uri: profileView?.image } : { uri: defaultImage }}
                                        style={{ height: 60, width: 60, borderRadius: 10 }}
                                    />
                                    <Text style={[commonStyles.h18BlackOne700,mh10]}>{profileView?.firstName} {profileView?.lastName}</Text>
                                </TouchableOpacity>
                                <CustomIcon name={"chevron-right"} size={20} color={colors.blackOne} type={"Entypo"} />
                            </View>
                            <View>
                                {settingsData.map(({ title, id, IconImg, moveTo }) => {
                                    return (
                                        <View key={id} style={[mv10]}>
                                            <View style={[flexRow, justifyBetween]}>
                                                <TouchableOpacity style={[flexRow]} onPress={() => handleSettingsItemPress(moveTo)}>
                                                    <View style={{ backgroundColor: colors.whiteThree, height: 40, width: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' }}>
                                                        {IconImg && <IconImg height={15} width={15} />}
                                                    </View>
                                                    <Text style={[commonStyles.h15blackOne500,alignSelfCenter, mh10]}>{title}</Text>
                                                </TouchableOpacity>
                                                <View style={[justifyCenter, alignItemCenter]}>
                                                    {/* {id === 1 && (
                                            <>
                                                <ToggleSwitch value={toggleVisible} onToggle={handleToggleChange} />
                                            </>
                                        )} */}
                                                    {id !== 7 && (
                                                        <>
                                                            <CustomIcon name={"chevron-right"} size={20} color={colors.blackOne} type={"Entypo"} />
                                                        </>
                                                    )}
                                                </View>
                                            </View>
                                        </View>
                                    )
                                })}
                            </View>
                        </View>
                        <BottomNavBar />
                    </View>
                </View>
            </SafeAreaView>
        </Fragment>
    )
}

export default SettingsScreen;
