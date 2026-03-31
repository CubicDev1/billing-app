import { useFocusEffect, useIsFocused, useNavigation } from '@react-navigation/native';
import React, { Fragment, useCallback, useEffect, useState } from 'react';
import { Dimensions, FlatList, ScrollView, StyleSheet, Text, TouchableNativeFeedback, View } from 'react-native';
import { BarChart } from 'react-native-gifted-charts';
import BottomNavBar from '../../components/bottomNavBar';
import { OnboardingButton } from '../../components/commonButton';
import { ExpandableSection, ListSubHeader, MultiSelectOption, TopHeader } from '../../components/commonComponents';
import CustomModal from '../../components/commonModal';
import DashedLine, { DashedLines } from '../../components/dashedLine';
import LoadingIndicator from '../../components/loadingIndicator';
import { getMethod, patchMethod, postMethod } from '../../services/apiService';
import { ApiUrl } from '../../services/apiUrl';
import { DevWidth } from '../../utils/device';
import { labels } from '../../utils/labels';
import { colors } from '../../utils/theme/colors';
import { alignItemCenter, alignSelfCenter, flex1, flexRow, justifyBetween, mb10, mh10, mh15, ml10, mr10, mv10, mv15, mv5 } from '../../utils/theme/commonStyles';
import { ModalTopText } from '../inventory/stockDetails';
import { get } from 'react-native/Libraries/TurboModule/TurboModuleRegistry';
import { TouchableOpacity } from 'react-native';
import CustomIcon from '../../utils/icons';
import { doChangeSpinnerFlag } from '../../services/commonMethods';
import { useDispatch, useSelector } from 'react-redux';
import { Controller, useForm } from 'react-hook-form';
import { CustomTextInput } from '../../components/commonInputFields';
import { currencySymbol } from '../../constant/constApi';
import { screenName } from '../../utils/screenNames';
import { Image } from 'react-native';
import { useToast } from 'react-native-toast-notifications';
import PopupCardModal from '../../components/popupCardModal';
import * as TYPES from '../../action/ActionType';
import { commonStyles } from '../../utils/commonStyles';

export type CategoriesListProps = {};

export interface Category {
    __v: number;
    _id: string;
    created_at: string;
    image: string;
    isDeleted: boolean;
    name: string;
    slug: string;
    updated_at: string;
    user_id: string;
}

const CategoriesList = () => {
    const [catFilter, setCattFilter] = useState(false);
    const [catList, setCatList] = useState<Category[]>([]);
    const focused = useIsFocused();
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const dispatch = useDispatch();
    const CategoriesList: Array<{ name: string, _id: string }> = useSelector((state: any) => state?.Reducer?.category);
    const [filteredCategories, setFilteredCategories] = useState<Array<{ name: string, _id: string }>>(useSelector((state: any) => state?.Reducer?.category));
    const [selectedCategories, setSelectedCategories] = useState<Array<{ name: string, _id: string }>>([]);
    const [searchText, setSearchText] = useState('');
    const loading = useSelector((state: any) => state?.Reducer?.spinnerFlag)
    const [categories, setCategorys] = useState<string>('');
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const toast = useToast();
    const navigation = useNavigation();

    const openFilterModal = () => {
        setCattFilter(true);
    };

    const {
        control,
        reset,
        setValue
    } = useForm();

    useEffect(() => {
        if (page > 1) {
            getCategoryList(page, selectedCategories);
        }
    }, [page]);

    const closeModal = () => {
        setCattFilter(false);
        setOpenDeleteModal(false);
        setCategorys('');
    };

    useEffect(() => {
        if (focused) {
            setPage(1);
            setSelectedCategories([]);
            getCategoryList(1, []);
        }
    }, [focused]);

    const handleReset = () => {
        setSearchText('');
        setSelectedCategories([]);
        setFilteredCategories(CategoriesList);
        setValue('search', '');
        setPage(1);
        setCattFilter(false);
        setSearchText('');
        getCategoryList(1, []);
    }

    const handleApply = () => {
        setPage(1);
        setValue('search', '');
        setFilteredCategories(CategoriesList);
        getCategoryList(1, selectedCategories);
        setCattFilter(false);
        setSearchText('');
    }

    const getCategoryList = (page: number, selectedCustomers: Array<{ name: string, _id: string }>) => {
        var customerId = "";
        if (selectedCustomers.length > 0) {
            customerId = `&category=${selectedCustomers.map(customer => customer._id).join(',')}`
        }
        doChangeSpinnerFlag(true);
        getDropdownCategory();
        getMethod(
            `${ApiUrl.categoryList}?limit=${10}&skip=${(page == 1 ? 0 : (page - 1)) * 10}${customerId}`,
            success => {
                if (success.code === 200) {
                    setCatList(success.data);
                    setTotal(success.totalRecords);
                    setCatList(page == 1 ? success.data : [...catList, ...success.data]);
                    doChangeSpinnerFlag(false);
                    console.log('Successfully list', success.data);
                } else {
                    console.log('Failed list:', success.message);
                    doChangeSpinnerFlag(false);
                }
            },
            error => {
                console.log('Error fetching expenses list:', error);
                doChangeSpinnerFlag(false);
            }
        );
    };

    const getDropdownCategory = () => {
        getMethod(
            ApiUrl.dropDownCategory,
            success => {
                if (success.code == 200) {
                    console.log('Successfully got Category listdsada', success.data);
                    dispatch({ type: TYPES.CATEGORY_LIST, payload: success.data })
                    setFilteredCategories(success.data);
                } else {
                    //console.log('Failed to get Category list:', success.message);
                }
            },
            error => {
                //console.log('Error fetching Category list:', error);
            }
        );
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear().toString();
        return `${day}-${month}-${year}`;
    };

    const handleSearch = (text: string) => {
        setSearchText(text);
        const filteredCustomersNew = CategoriesList.filter(customer => customer.name.toLowerCase().includes(text.toLowerCase()));
        setFilteredCategories(filteredCustomersNew ?? []);
    };

    const addPress = () => {
        navigation.navigate(screenName.AddNewCategories as never);
    };

    const viewCategoriesList = (id: any) => {
        getMethod(
            `${ApiUrl.categoryList}/${id}`,
            success => {
                if (success.code == 200) {
                    console.log('Successfully view category list', success.data);
                    (navigation as any).navigate(screenName.AddNewCategories, { categoryData: success.data });
                } else {
                    console.log('Failed from category list', success.message);
                }
            },
            error => {
                console.log('Error fetching category list:', error);
            }
        );
    };

    const deleteCategory = (id: any) => {
        patchMethod(
            `${ApiUrl.categoryList}/${id}`,
            {},
            (success: { code: number; message: any; }) => {
                if (success.code == 200) {
                    setPage(1);
                    getCategoryList(1, selectedCategories);
                    toast.show("Deleted category successfully", { type: "normal", placement: "bottom", duration: 4000, animationType: "slide-in", });
                    setOpenDeleteModal(false);
                } else {
                    toast.show("Failed to delete category'", { type: "normal", placement: "bottom", duration: 4000, animationType: "slide-in", });

                }
            },
            error => {
                console.log('Error deleting category:', error);
                toast.show(error.data.message[0], { type: "normal", placement: "bottom", duration: 4000, animationType: "slide-in", });
            }
        );
    };

    return (
        <View style={[{ backgroundColor: colors.whiteTwo }]}>
            <View style={{ marginBottom: 300 }}>
                <ListSubHeader addIcon={true} onAddPress={addPress} listName={labels.categories} totalNumber={total} onFilterPress={openFilterModal} />
                <FlatList
                    contentContainerStyle={{ paddingBottom: 10 }}
                    data={catList}
                    ListEmptyComponent={
                        <View style={{ justifyContent: 'center', alignItems: 'center', marginVertical: 10 }} >
                            <Text style={[commonStyles.h12blackTwo600]}>{loading ? "Loading..." : "No data found"}</Text>
                        </View>
                    }
                    onEndReached={() => {
                        console.log('onEndReached', page, total, catList.length);
                        if (total > catList.length) {
                            setPage(page + 1);
                        }
                    }}
                    renderItem={({ item, index }) => {
                        const data = item;
                        return (
                             <TouchableOpacity style={[commonStyles.mainListCard
                                ,{
                                    shadowColor: '#000',
                                    shadowOffset: { width: 0, height: 2 },
                                    shadowOpacity: 0.2,
                                    shadowRadius: 4,
                                    elevation: 4,
                                }
                             ]} disabled key={data._id} >
                                <View style={{ borderColor: colors.black, }}>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', }}>
                                        <View style={{ flexDirection: 'row' }}>
                                            <View style={{ alignSelf: 'center', marginHorizontal: 8 }}>
                                                 <Text style ={[commonStyles.h15blackOne600]}>{data.name}</Text>
                                                {/* <Text style={[commonStyles.h14BlackTwo400,alignSelfCenter]} >Slug : {data.slug}</Text> */}
                                            </View>
                                        </View>
                                        <View style={{ flexDirection: 'row', alignSelf: 'center' }}>
                                            <TouchableOpacity onPress={() => viewCategoriesList(data._id)} style={{ backgroundColor: colors.greyOne, height: 32, width: 32, borderRadius: 30, justifyContent: 'center', alignItems: 'center', marginHorizontal: 5 }}>
                                                <CustomIcon name={'edit'} size={16} color={colors.blackTwo} type={'Feather'} />
                                            </TouchableOpacity>
                                            <TouchableOpacity onPress={() => { setOpenDeleteModal(true), setCategorys(data._id) }} style={{ backgroundColor: colors.greyOne, height: 32, width: 32, borderRadius: 30, justifyContent: 'center', alignItems: 'center' }}>
                                                <CustomIcon name={'delete-forever-outline'} size={18} color={colors.blackTwo} type={'MaterialCommunityIcons'} />
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                    <View style={{ marginVertical: 10, alignItems: 'center' }}>
                                        {/* <DashedLine height={350} color={colors.greyTwo} dashLength={10} dashGap={5} /> */}
                                        <DashedLines color={colors.greyTwo} totalLengthPercentage={90} dashThickness={1} dashGap={10} />
                                    </View>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginLeft: 5 }}>
                                            <View style={[commonStyles.smallCard,{height:20}]} >
                                               <Text style={[commonStyles.h12RedTwo500,mh10]} >Slug : {data.slug}</Text>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        )
                    }}
                    keyExtractor={(item, index) => index + ''}
                />
            </View>
            {openDeleteModal && <PopupCardModal handleYesBtn={() => deleteCategory(categories)} text={`Do you want to delete this Category?`} visible={openDeleteModal} onClose={() => setOpenDeleteModal(false)} />}
            <CustomModal children={

                <View style={[justifyBetween, flex1]}>
                    <ModalTopText iconPress={() => setCattFilter(false)} title='Filter' />
                   <Text style={[commonStyles.h14blackOne600,mv10]} >{"Category"}</Text>
                    <View style={styles.input}>
                        <Controller
                            name={'search'}
                            control={control}
                            defaultValue={searchText}
                            render={({ field: { onChange, value } }) => (
                                <CustomTextInput
                                    placeholder={'Search'}
                                    value={value}
                                    onEnter={() => {
                                        handleSearch(value);
                                    }}
                                    onChangeText={onChange}
                                    textColor={colors.black}
                                />
                            )}
                        />

                        <CustomIcon
                            name={'search'}
                            size={16}
                            color={colors.grey}
                            type="Feather"
                        />
                    </View>
                    <View style={[flex1, { marginBottom: 30, marginTop: 20 }]}>
                        <FlatList
                            data={filteredCategories}
                            renderItem={({ item }) => {
                                return (
                                    <View style={[flexRow, alignItemCenter, mv5]}>
                                        <TouchableOpacity
                                            onPress={() => {
                                                const isSelected = selectedCategories.find((id) => id._id === item._id)
                                                if (isSelected) {
                                                    setSelectedCategories(selectedCategories.filter((id) => id._id !== item._id))
                                                } else {
                                                    setSelectedCategories([...selectedCategories, item])
                                                }
                                            }}
                                            style={[
                                                styles.multiSelectBox,
                                                {
                                                    marginHorizontal: 5,
                                                    backgroundColor: selectedCategories.find((id) => id._id === item._id) ? colors.primary : colors.white,
                                                    borderWidth: selectedCategories.find((id) => id._id === item._id) ? 0 : 1,
                                                    borderColor: selectedCategories.find((id) => id._id === item._id) ? colors.primary : colors.grey,
                                                },
                                            ]}
                                        >
                                            {selectedCategories.find((id) => id._id === item._id) && (
                                                <CustomIcon name="check" size={15} color="white" type="MaterialIcons" />
                                            )}
                                        </TouchableOpacity>
                                       <Text style={commonStyles.h14blackOne600}>{item.name}</Text>
                                    </View>
                                )
                            }}
                        />
                    </View>
                    <View style={[flexRow, justifyBetween, alignItemCenter]}>
                        <OnboardingButton
                            width={150}
                            title={labels.reset}
                            onChange={handleReset}
                            backgroundColor={colors.greySeven}
                            color={colors.blackOne}
                        />
                        <OnboardingButton
                            width={150}
                            title={labels.apply}
                            onChange={handleApply}
                            backgroundColor={colors.primary}
                            color={colors.white}
                        />
                    </View>
                </View>

            }
                visible={catFilter}
                onClose={closeModal}
                height={'80%'} />
        </View>
    );
};

export default CategoriesList;

const styles = StyleSheet.create({
    bottomButtonsContainer: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    input: {
        borderWidth: 1,
        borderColor: colors.greyFive,
        borderRadius: 10,
        paddingHorizontal: 10,
        backgroundColor: colors.greyOne,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    multiSelectBox: {
        width: 18,
        height: 18,
        borderRadius: 4,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
