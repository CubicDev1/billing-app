import { useIsFocused, useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { OnboardingButton } from '../../components/commonButton';
import { ListSubHeader } from '../../components/commonComponents';
import CustomModal from '../../components/commonModal';
import { DashedLines } from '../../components/dashedLine';
import { getMethod, patchMethod } from '../../services/apiService';
import { ApiUrl } from '../../services/apiUrl';
import { labels } from '../../utils/labels';
import { colors } from '../../utils/theme/colors';
import { alignItemCenter, flex1, flexRow, justifyBetween, mh10, mv10, mv5 } from '../../utils/theme/commonStyles';
import { ModalTopText } from '../inventory/stockDetails';
import { TouchableOpacity } from 'react-native';
import CustomIcon from '../../utils/icons';
import { doChangeSpinnerFlag } from '../../services/commonMethods';
import { useDispatch, useSelector } from 'react-redux';
import { Controller, useForm } from 'react-hook-form';
import { CustomTextInput } from '../../components/commonInputFields';
import { screenName } from '../../utils/screenNames';
import { useToast } from 'react-native-toast-notifications';
import PopupCardModal from '../../components/popupCardModal';
import * as TYPES from '../../action/ActionType';
import { commonStyles } from '../../utils/commonStyles';

export type CategoriesListProps = {};

export interface Unit {
    _id: string;
    id: string;
    name: string;
    symbol: string;
    user_id: string;
    created_at: string;
    updated_at: string;
    isDeleted: boolean;
    __v: number;
}


const UnitsList = () => {
    const [unitFilter, setUnitFilter] = useState(false);
    const [unitList, setUnitList] = useState<Unit[]>([]);
    const focused = useIsFocused();
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const dispatch = useDispatch();
    const UnitsList: Array<{ name: string, _id: string }> = useSelector((state: any) => state?.Reducer?.units);
    const [filteredUnits, setFilteredUnits] = useState<Array<{ name: string, _id: string }>>(useSelector((state: any) => state?.Reducer?.units));
    const [selectedUnits, setSelectedUnits] = useState<Array<{ name: string, _id: string }>>([]);
    const [searchText, setSearchText] = useState('');
    const loading = useSelector((state: any) => state?.Reducer?.spinnerFlag)
    const [unitSelected, setUnitSelected] = useState<string>('');
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const toast = useToast();
    const navigation = useNavigation();

    const openFilterModal = () => {
        setUnitFilter(true);
    };

    const {
        control,
        reset,
        setValue
    } = useForm();

    useEffect(() => {
        if (page > 1) {
            getUnitsList(page, selectedUnits);
        }
    }, [page]);

    const closeModal = () => {
        setUnitFilter(false);
        setOpenDeleteModal(false);
        setUnitSelected('');
    };

    useEffect(() => {
        if (focused) {
            setPage(1);
            setSelectedUnits([]);
            getUnitsList(1, []);
        }
    }, [focused]);

    const handleReset = () => {
        setSearchText('');
        setSelectedUnits([]);
        setFilteredUnits(UnitsList);
        setValue('search', '');
        setPage(1);
        setUnitFilter(false);
        setSearchText('');
        getUnitsList(1, []);
    }

    const handleApply = () => {
        setPage(1);
        setValue('search', '');
        setFilteredUnits(UnitsList);
        getUnitsList(1, selectedUnits);
        setUnitFilter(false);
        setSearchText('');
    }

    const getUnitsList = (page: number, selectedCustomers: Array<{ name: string, _id: string }>) => {
        var customerId = "";
        if (selectedCustomers.length > 0) {
            customerId = `&category=${selectedCustomers.map(customer => customer._id).join(',')}`
        }
        doChangeSpinnerFlag(true);
        getDropdownUnits();
        getMethod(
            `${ApiUrl.unitList}?limit=${10}&skip=${(page == 1 ? 0 : (page - 1)) * 10}${customerId}`,
            success => {
                if (success.code === 200) {
                    setUnitList(success.data);
                    setTotal(success.totalRecords);
                    setUnitList(page == 1 ? success.data : [...unitList, ...success.data]);
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

    const getDropdownUnits = () => {
        getMethod(
            ApiUrl.dropDownUnits,
            success => {
                if (success.code == 200) {
                    console.log('Successfully got Category listdsada', success.data);
                    dispatch({ type: TYPES.UNITS_LIST, payload: success.data })
                    setFilteredUnits(success.data);
                } else {
                    //console.log('Failed to get Category list:', success.message);
                }
            },
            error => {
                //console.log('Error fetching Category list:', error);
            }
        );
    };

    const handleSearch = (text: string) => {
        setSearchText(text);
        const filteredCustomersNew = UnitsList.filter(customer => customer.name.toLowerCase().includes(text.toLowerCase()));
        setFilteredUnits(filteredCustomersNew ?? []);
    };

    const addPress = () => {
        navigation.navigate(screenName.AddNewUnits as never);
    };

    const viewUnitList = (id: any) => {
        getMethod(
            `${ApiUrl.unitView}/${id}`,
            success => {
                if (success.code === 200) {
                    console.log('Successfully view unit list', success.data);
                    (navigation as any).navigate(screenName.AddNewUnits, { unitData: success.data });
                } else {
                    console.log('Failed from unit list', success.message);
                }
            },
            error => {
                console.log('Error fetching unit list:', error);
            }
        );
    };

    const deleteUnit = (id: any) => {
        patchMethod(
            `${ApiUrl.unitDelete}/${id}`,
            {},
            (success: { code: number; message: any; }) => {
                if (success.code === 200) {
                    toast.show("Unit Deleted Successfully", { type: "normal", placement: "bottom", duration: 4000, animationType: "slide-in", });
                    setOpenDeleteModal(false);
                    setPage(1);
                    getUnitsList(1, selectedUnits);
                } else {
                    toast.show("Failed to delete unit", { type: "normal", placement: "bottom", duration: 4000, animationType: "slide-in", });
                }
            },
            error => {
                console.log('Error deleting category:', error);
            }
        );
    };


    return (
        <View style={[{ backgroundColor: colors.whiteTwo }]}>
            <View style={{ marginBottom: 300 }}>
                <ListSubHeader addIcon={true} onAddPress={addPress} listName={labels.units} totalNumber={total} onFilterPress={openFilterModal} />
                <FlatList
                    contentContainerStyle={{ paddingBottom: 10 }}
                    data={unitList}
                    ListEmptyComponent={
                        <View style={{ justifyContent: 'center', alignItems: 'center', marginVertical: 10 }} >
                            <Text style={[commonStyles.h12blackTwo600]}>{loading ? "Loading..." : "No data found"}</Text>
                        </View>
                    }
                    onEndReached={() => {
                        console.log('onEndReached', page, total, unitList.length);
                        if (total > unitList.length) {
                            setPage(page + 1);
                        }
                    }}
                    renderItem={({ item, index }) => {
                        const data = item;
                        return (
                             <TouchableOpacity style={[commonStyles.mainListCard,{
                                shadowColor: '#000',
                                shadowOffset: { width: 0, height: 2 },
                                shadowOpacity: 0.2,
                                shadowRadius: 4,
                                elevation: 4,
                             }]} disabled key={data._id}>
                                <View style={{ borderColor: colors.black, }}>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', }}>
                                        <View style={{ flexDirection: 'row' }}>
                                            <View style={{ alignSelf: 'center', marginHorizontal: 8 }}>
                                                 <Text style ={[commonStyles.h15blackOne600]}>{data.name}</Text>
                                                {/* <Text style={[commonStyles.h14BlackTwo400,alignSelfCenter]} >Slug : {data.slug}</Text> */}
                                            </View>
                                        </View>
                                        <View style={{ flexDirection: 'row', alignSelf: 'center' }}>
                                            <TouchableOpacity onPress={() => viewUnitList(data._id)} style={{ backgroundColor: colors.greyOne, height: 32, width: 32, borderRadius: 30, justifyContent: 'center', alignItems: 'center', marginHorizontal: 5 }}>
                                                <CustomIcon name={'edit'} size={16} color={colors.blackTwo} type={'Feather'} />
                                            </TouchableOpacity>
                                            <TouchableOpacity onPress={() => { setOpenDeleteModal(true), setUnitSelected(data._id) }} style={{ backgroundColor: colors.greyOne, height: 32, width: 32, borderRadius: 30, justifyContent: 'center', alignItems: 'center' }}>
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
                                               <Text style={[commonStyles.h12RedTwo500,mh10]}>Symbol : {data.symbol}</Text>
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
            {openDeleteModal && <PopupCardModal handleYesBtn={() => deleteUnit(unitSelected)} text={`Do you want to delete this unit?`} visible={openDeleteModal} onClose={() => setOpenDeleteModal(false)} />}
            <CustomModal children={

                <View style={[justifyBetween, flex1]}>
                    <ModalTopText iconPress={() => setUnitFilter(false)} title='Filter' />
                   <Text style={[commonStyles.h14blackOne600,mv10]} >{"Units"}</Text>
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
                            data={filteredUnits}
                            renderItem={({ item }) => {
                                return (
                                    <View style={[flexRow, alignItemCenter, mv5]}>
                                        <TouchableOpacity
                                            onPress={() => {
                                                const isSelected = selectedUnits.find((id) => id._id === item._id)
                                                if (isSelected) {
                                                    setSelectedUnits(selectedUnits.filter((id) => id._id !== item._id))
                                                } else {
                                                    setSelectedUnits([...selectedUnits, item])
                                                }
                                            }}
                                            style={[
                                                styles.multiSelectBox,
                                                {
                                                    marginHorizontal: 5,
                                                    backgroundColor: selectedUnits.find((id) => id._id === item._id) ? colors.primary : colors.white,
                                                    borderWidth: selectedUnits.find((id) => id._id === item._id) ? 0 : 1,
                                                    borderColor: selectedUnits.find((id) => id._id === item._id) ? colors.primary : colors.grey,
                                                },
                                            ]}
                                        >
                                            {selectedUnits.find((id) => id._id === item._id) && (
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
                visible={unitFilter}
                onClose={closeModal}
                height={'80%'} />
        </View>
    );
};

export default UnitsList;

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
