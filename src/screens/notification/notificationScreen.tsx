import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, Text, ToastAndroid, TouchableOpacity, View } from 'react-native';
import BottomNavBar from '../../components/bottomNavBar';
import { TopHeader } from '../../components/commonComponents';
import PopupCardModal from '../../components/popoupCardModal';
import { deleteMethod, getMethod } from '../../services/apiService';
import { ApiUrl } from '../../services/apiUrl';
import { labels } from '../../utils/labels';
import { colors } from '../../utils/theme/colors';
import { flex1, flexRow, justifyBetween, mh10, mh15, mt10, mv15, mv5 } from '../../utils/theme/commonStyles';
import { useToast } from 'react-native-toast-notifications';
import { commonStyles } from '../../utils/commonStyles';

export type notificationScreenProps = {

}

export interface NotificationData {
    _id: string;
    title: string;
    body: string;
    createdAt: string;
}

const NotificationScreen = (props: notificationScreenProps) => {
    const [notification, setNotification] = useState<NotificationData[]>([]);
    const [showModal, setShowModal] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [selectedNotificationId, setSelectedNotificationId] = useState<string>('');
    const toast = useToast();

    useEffect(() => {
        getNotificationList();
    }, []);

    const openModal = (id: string) => {
        setSelectedNotificationId(id);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
    };

    const getNotificationList = () => {
        setLoading(true);
        getMethod(
            ApiUrl.listOfNotification,
            (success: any) => {
                if (success.code === 200) {
                    const transformedData = success.data.map((item: any) => ({
                        ...item,
                        createdAt: formatCreatedAt(item.createdAt)
                    }));
                    setNotification(transformedData);
                    setLoading(false);
                } else {
                    console.log('Failed to get notification list:', success.message);
                }
            },
            (error: any) => {
                console.log('Error fetching notification list:', error);
            }
        );
    };

    const deleteNotification = () => {
        deleteMethod(
            ApiUrl.deleteNotification,
            { _id: selectedNotificationId },
            (success: { code: number; message: string }) => {
                if (success.code === 200) {
                    const updatedNotificationList = notification.filter((item) => item._id !== selectedNotificationId);
                    setNotification(updatedNotificationList);
                    closeModal();
                    toast.show("Successfully deleted notification", {type: "normal",placement: "bottom",duration: 4000,animationType: "slide-in",});
                    
                } else {
                    toast.show("Failed to delete notification", {type: "normal",placement: "bottom",duration: 4000,animationType: "slide-in",});
                }
            },
            (error: any) => {
                console.log('Error deleting notification:', error);
                toast.show("Failed to delete notification", {type: "normal",placement: "bottom",duration: 4000,animationType: "slide-in",});
            }
        );
    };

    const formatCreatedAt = (createdAt: string) => {
        const date = new Date(createdAt);
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const seconds = Math.floor(diff / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);
        
        if (seconds < 60) {
            return `${seconds} seconds ago`;
        } else if (minutes < 60) {
            return `${minutes} minutes ago`;
        } else if (hours < 24) {
            return `${hours} hours ago`;
        } else if (days < 7) {
            return `${days} days ago`;
        } else {
            return date.toDateString();
        }
    };

    return (
        <View style={[flex1, { backgroundColor: colors.whiteTwo }]}>
            <View style={mh15}>
                <View style={mv15}>
                    <TopHeader headerText={labels.notification}  />
                </View>
                                              <View style={[commonStyles.bottomWidth,mv5]}  />

                <ScrollView>
                    <View style={{ paddingBottom: '50%' }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            {/* <TouchableOpacity onPress={() => alert('Mark all as read')}>
                                 <TouchableOpacity style={[commonStyles.mainListCard]} style={[flexRow, justifyCenter, alignItemCenter, { width: DevHeight / 5 }]} >
                                    <View style={{ backgroundColor: colors.white4, height: 20, width: 20, alignItems: 'center', justifyContent: 'center', borderRadius: 2 }}>
                                        <CustomIcon name={'checkmark-done-outline'} size={16} color={colors.blackOne} type={'Ionicons'} />
                                    </View>
                                    <Text style={[commonStyles.h14blackOne500]} style={[mh5]}>{labels.markallasRead}</Text>
                                </TouchableOpacity>
                            </TouchableOpacity> */}
                            {/* <TouchableOpacity onPress={() => openModal('all')}>
                                 <TouchableOpacity style={[commonStyles.mainListCard]} style={[flexRow, justifyCenter, alignItemCenter, { width: DevHeight / 4.9 }]} >
                                    <View style={{ backgroundColor: colors.white4, height: 20, width: 20, alignItems: 'center', justifyContent: 'center', borderRadius: 2, marginHorizontal: 5 }}>
                                        <CustomIcon name={'delete-forever-outline'} size={18} color={colors.blackTwo} type={'MaterialCommunityIcons'} />
                                    </View>
                                    <Text style={[commonStyles.h14blackOne500]} >{labels.deleteAllNotifications}</Text>
                                </TouchableOpacity>
                            </TouchableOpacity> */}
                        </View>
                        
                        {notification.map((data) => (
                            <View key={data._id}>
                                 <TouchableOpacity style={[commonStyles.mainListCard]}>
                                    <View>
                                        <View style={[mh10]}>
                                            <View>
                                                <Text style={[commonStyles.h14blackOne500]}>{data.title + ' : '}
                                                    <Text style={[commonStyles.h14BlackTwo400]}>{data.body}</Text>
                                                </Text>
                                            </View>
                                            <View style={[flexRow, justifyBetween, mt10]}>
                                                <Text style={[commonStyles.h12blackTwo400]}>{data.createdAt}</Text>
                                                {/* <TouchableOpacity onPress={() => openModal(data._id)}>
                                                    <CustomIcon name={'delete-forever-outline'} size={18} color={colors.blackTwo} type={'MaterialCommunityIcons'} />
                                                </TouchableOpacity> */}
                                            </View>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        ))}
                    </View>
                </ScrollView>
            </View>
            <BottomNavBar />
            {showModal && (
                <PopupCardModal 
                    handleYesBtn={deleteNotification} 
                    text='Do you want to delete this notification?' 
                    visible={showModal} 
                    onClose={closeModal} 
                />
            )}
        </View>
    );
};

export default NotificationScreen;
