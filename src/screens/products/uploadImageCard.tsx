import React, { FC, useEffect, useState } from 'react';
import { Image, Text, TextStyle, ToastAndroid, TouchableOpacity, View, ViewStyle } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import ImageResizer from 'react-native-image-resizer';
import CustomIcon from '../../utils/icons';
import { ProfileImage } from '../../utils/png';
import { colors } from '../../utils/theme/colors';
import {
    alignSelfCenter,
    flexRow,
    mh10,
    mh5
} from '../../utils/theme/commonStyles';
import { useToast } from 'react-native-toast-notifications';
import { commonStyles } from '../../utils/commonStyles';

interface UploadImageCardProps {
    title: string;
    sizeInfo: string;
    onUpload: (image: string) => void;
    onDelete: () => void;
    imageTag: (picData: any) => void;
    initialImage?: string | null | ArrayBuffer;
    imgTrue?: boolean;
    showDeleteButton?: boolean;
}

export const UploadImageCard: FC<UploadImageCardProps> = ({
    title,
    sizeInfo,
    onUpload,
    onDelete,
    imageTag,
    initialImage = null,
    imgTrue,
    showDeleteButton = true,
}) => {

    const [image, setImage] = useState<string |ArrayBuffer| null>(initialImage);
    const toast = useToast();

    useEffect(() => {
        if (initialImage && isValidImageUri(initialImage)) {
            setImage(initialImage);
        }
    }, [initialImage]);

    const isValidImageUri = (uri: string | null): boolean => {
        if (typeof uri !== 'string') {
            return false;
        }
            if (uri.trim() === '') {
            return false;
        }
    
        const isHttpUrl = uri.startsWith('http://') || uri.startsWith('https://');
        
        const isFileUrl = uri.startsWith('file://');
        
        return isHttpUrl || isFileUrl;
    };

    const containerStyle: ViewStyle = {
        backgroundColor: colors.greyOne,
        padding: 10,
        borderRadius: 10,
        elevation: 1,
    };

    const handleUploadImage = () => {
        const options = {
            mediaType: 'photo',
            includeBase64: true,
        };
        launchImageLibrary(options, async (response) => {
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.errorCode) {
                console.log('ImagePicker Error: ', response.errorMessage);
            } else if (response.assets && response.assets.length > 0) {
                const selectedImage = response.assets[0];
                console.log(selectedImage,"selectedImage");
                if (selectedImage?.fileSize > 4 * 1024 * 1024) {
                    toast.show("Image size should be less than 4MB", {type: "normal",placement: "bottom",duration: 4000,animationType: "slide-in",});
                    setImage(null); 
                } else {
                    try {
                        const resizedImage = await ImageResizer.createResizedImage(
                            selectedImage.uri,
                            800, // max width
                            800, // max height
                            'JPEG', // format
                            80, // quality
                            0 // rotation
                        );
                        const base64Image = resizedImage.uri;
                        setImage(resizedImage.uri);
                        onUpload(base64Image);
                        imageTag(resizedImage);
                        console.log(resizedImage,"base64Image");
                        
                    } catch (err) {
                        console.log(err);
                    }
                }
            }
        });
    };

    const handleDeleteImage = () => {
        setImage(null);
        onDelete();
    };

    return (
        <View style={containerStyle}>
            <View style={[flexRow]}>
                {image ? (
                    <Image source={{ uri: image }} style={{ height: 70, width: 70, borderRadius: 5 }} />
                ) : imgTrue ? (
                    <Image source={ProfileImage} style={{ height: 70, width: 70, borderRadius: 5 }} />
                ) : (
                    <TouchableOpacity onPress={handleUploadImage}>
                        <View style={uploadButtonStyle}>
                            <CustomIcon name={'image'} size={14} color={colors.grey} type={'OctIcon'} />
                        </View>
                    </TouchableOpacity>
                )}
                <View style={[alignSelfCenter, mh10]}>
                    <View style={[flexRow]}>
                       <Text style={commonStyles.h14blackOne600}>{title}</Text>
                        {/* <H16danger600 style={{ color: 'red' }}> *</H16danger600> */}
                    </View>
                    <Text style={[commonStyles.h12blackTwo400]}>{sizeInfo}</Text>
                    <View style={[flexRow]}>
                        <TouchableOpacity
                            onPress={handleUploadImage}
                            style={uploadTextStyle}>
                            <Text style={[commonStyles.h12white600]}>Upload Image</Text>
                        </TouchableOpacity>
                        {showDeleteButton && (
                            <TouchableOpacity style={[alignSelfCenter, mh5]} onPress={handleDeleteImage}>
                                <Text style={[commonStyles.h14Danger400]}>Delete</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
            </View>
        </View>
    );
};

const uploadButtonStyle: ViewStyle = {
    height: 70,
    width: 70,
    backgroundColor: 'white',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: colors.greyTwo,
    justifyContent: 'center',
    alignItems: 'center'
};

const uploadTextStyle: TextStyle = {
    backgroundColor: colors.blueFive,
    height: 25,
    width: 91,
    marginVertical: 5,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
};

export default UploadImageCard;
