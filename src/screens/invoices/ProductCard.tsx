// ProductCard.tsx
import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { alignItemCenter, flex1, flexRow, justifyBetween, justifyCenter, ml10, ml5, mr10, mr5, mv5 } from '../../utils/theme/commonStyles';
import { colors } from '../../utils/theme/colors';
import { ApiUrl } from '../../services/apiUrl';
import CustomIcon from '../../utils/icons';
import { NoImage } from '../../utils/png';
import { AppDomainUrl } from '../../services/apiService';
import { commonStyles } from '../../utils/commonStyles';

interface ProductCardProps {
    item: any;
    quantity: number;
    onIncrement: () => void;
    onDecrement: () => void;
    onAdd: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ item, quantity, onIncrement, onDecrement, onAdd }) => {
    return (
        <View style={[{ height: 70, width: '100%', backgroundColor: colors.white, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.50, shadowRadius: 3.84, elevation: 2, borderRadius: 8 }, mv5, flexRow, justifyBetween, alignItemCenter]} key={item?._id}>
            <View style={[flexRow,flex1, alignItemCenter, ml10]}>
                {/* <View style={[[{ height: 40, width: 40, backgroundColor: colors.whiteOne, borderRadius: 8 }, alignItemCenter, justifyCenter]]}>
                    {item?.images && item.images[0] !== '' ?
                        <Image
                            source={{ uri: `${AppDomainUrl}${item.images[0]}` }}
                            style={{ height: 40, width: 40, borderRadius: 8 }}
                            defaultSource={NoImage}  // Fallback image (optional, might not be supported in all versions)
                            resizeMode="contain"  // Adjust as needed
                        /> :
                        <Image 
                        source={NoImage}
                        style={{ height: 40, width: 40, borderRadius: 8 }}
                        />
                    }
                </View> */}
                <View style={[mr10,flex1]}>
                     <Text style ={[commonStyles.h15blackOne600]} numberOfLines={1}>{item?.name}</Text>
                    <View style={[flexRow, alignItemCenter]}>
                        <Text style={[commonStyles.h12Primary400]}>Unit : {item?.units?.name}</Text>
                        <Text style={{ color: colors.greyTwo }}> | </Text>
                        <Text style={[commonStyles.h10blackTwo600]}>Price : {item?.sellingPrice}</Text>
                    </View>
                </View>
            </View>
            <View style={[flexRow, alignItemCenter, mr10]} >
                <View style={[flexRow, alignItemCenter, justifyCenter, { height: 35, width: 80, borderRadius: 5, borderColor: colors.greyTwo, borderWidth: 1 }]}>
                    <TouchableOpacity onPress={onDecrement} style={[{ backgroundColor: colors.greyTwo, height: 25, width: 25, borderRadius: 5, }, alignItemCenter, justifyCenter]}>
                        <CustomIcon name="minus" size={12} color={colors.blackOne} type='Feather' />
                    </TouchableOpacity>
                    <Text style={[commonStyles.h12BlackTwo500,mr5, ml5]} >{quantity}</Text>
                    <TouchableOpacity onPress={onIncrement} style={[{ backgroundColor: colors.greyTwo, height: 25, width: 25, borderRadius: 5, }, alignItemCenter, justifyCenter]}>
                        <CustomIcon name="plus" size={12} color={colors.blackOne} type='Feather' />
                    </TouchableOpacity>
                </View>
                {/* <TouchableOpacity onPress={onAdd} style={[ml10, alignItemCenter, justifyCenter, { height: 25, width: 45, borderRadius: 5, backgroundColor: colors.primary }]}>
                    <Text style={[commonStyles.h12white600]}>Add</Text>
                </TouchableOpacity> */}
            </View>
        </View>
    );
};

export default ProductCard;
