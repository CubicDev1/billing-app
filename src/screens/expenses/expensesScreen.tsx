import { useFocusEffect, useIsFocused, useNavigation } from '@react-navigation/native';
import React, { Fragment, useCallback, useEffect, useState } from 'react';
import { FlatList, SafeAreaView, ScrollView, StyleSheet, Text, TouchableNativeFeedback, View } from 'react-native';
import { BarChart } from 'react-native-gifted-charts';
import BottomNavBar from '../../components/bottomNavBar';
import { OnboardingButton } from '../../components/commonButton';
import { ExpandableSection, ListSubHeader, MultiSelectOption, TopHeader } from '../../components/commonComponents';
import CustomModal from '../../components/commonModal';
import DashedLine from '../../components/dashedLine';
import LoadingIndicator from '../../components/loadingIndicator';
import { getMethod, postMethod } from '../../services/apiService';
import { ApiUrl } from '../../services/apiUrl';
import { DevWidth } from '../../utils/device';
import { labels } from '../../utils/labels';
import { colors } from '../../utils/theme/colors';
import { alignItemCenter, alignSelfCenter, flex1, flexRow, justifyBetween, mh10, mh15, mv10, mv15, mv5 } from '../../utils/theme/commonStyles';
import { SettingsComponentsProps } from '../expenses/expenseFilter';
import { ModalTopText } from '../inventory/stockDetails';
import { get } from 'react-native/Libraries/TurboModule/TurboModuleRegistry';
import { TouchableOpacity } from 'react-native';
import CustomIcon from '../../utils/icons';
import { doChangeSpinnerFlag } from '../../services/commonMethods';
import { currencySymbol } from '../../constant/constApi';
import { useSelector } from 'react-redux';
import { screenName } from '../../utils/screenNames';
import { useToast } from 'react-native-toast-notifications';
import { getTopNotchStyle, getMainContainerStyle, commonStyles } from '../../utils/commonStyles';

export type expensesReportProps = {}

export interface Expenses {
  _id: string
  expenseId: string
  reference: string
  amount: string
  paymentMode: string
  expenseDate: string
  status: string
  attachment: any
  description: string
  isDeleted: boolean
  userId: string
  createdAt: string
  updatedAt: string
  __v: number
}

const Expenses = (props: expensesReportProps) => {
  const [expenseFilter, setExpenseFilter] = useState(false);
  const [expensesList, setExpensesList] = useState<Expenses[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<Array<string>>([]);
  const focused = useIsFocused();
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const loading = useSelector((state: any) => state?.Reducer?.spinnerFlag)
  const navigation = useNavigation();
  const toast = useToast();

  const openFilterModal = () => {
    setExpenseFilter(true);
  };

  useEffect(() => {
    if (page > 1) {
      getExpensesList(page, selectedStatus.join(','));
    }
  }, [page]);

  const closeModal = () => {
    setExpenseFilter(false);
  };

  useEffect(() => {
    if (focused) {
      setPage(1);
      setSelectedStatus([]);
      getExpensesList(1);
    }
  }, [focused]);


  const handleReset = () => {
    setPage(1);
    setSelectedStatus([]);
    getExpensesList(1);
    setExpenseFilter(false);
  };

  const handleApply = () => {
    setPage(1);
    getExpensesList(1, selectedStatus.join(','));
    setExpenseFilter(false);
  };

  const getExpensesList = (page: number, status?: string) => {
    var searchText = "";
    if (status) {
      searchText = `&status=${status}`
    }
    doChangeSpinnerFlag(true);
    getMethod(
      `${ApiUrl.expensesList}?limit=${10}&skip=${(page == 1 ? 0 : (page - 1)) * 10}${searchText}`,
      success => {
        if (success.code === 200) {
          setExpensesList(success.data);
          setTotal(success.totalRecords);
          setExpensesList(page == 1 ? success.data : [...expensesList, ...success.data]);
          doChangeSpinnerFlag(false);
          console.log('Successfully got expenses list', success.data);
        } else {
          console.log('Failed to get expenses list:', success.message);
          doChangeSpinnerFlag(false);
        }
      },
      error => {
        console.log('Error fetching expenses list:', error);
        doChangeSpinnerFlag(false);
      }
    );
  };
  const handleStatusSelection = (status: string) => {
    setSelectedStatus(selectedStatus.includes(status) ? selectedStatus.filter(item => item !== status) : [...selectedStatus, status]);
  };

  const addPress = () => {
    navigation.navigate(screenName.AddExpenses as never);
  };

  const deleteExpenses = (_id: string) => {
    postMethod(
      ApiUrl.deleteExpenses,
      { _id }, // Send the _id in the request payload
      (success: { code: number; message: any }) => {
        if (success.code === 200) {
          const updatedPurchasesList = expensesList.filter(
            purchase => purchase._id !== _id,
          );
          setExpensesList(updatedPurchasesList);
          toast.show("Successfully deleted expense", { type: "normal", placement: "bottom", duration: 4000, animationType: "slide-in", });

        } else {
          toast.show("Failed to delete expense'", { type: "normal", placement: "bottom", duration: 4000, animationType: "slide-in", });

        }
      },
      error => {
        console.log('Error deleting expense:', error);
      },
    );
  };

  const viewExpensesEditList = (id: any) => {
    console.log('viewExpensesEditList', id);

    getMethod(
      `${ApiUrl.expensesDetails}/${id}`,
      success => {
        if (success.code === 200) {
          console.log('Successfully view edit expenses list', success.data);
          (navigation as any).navigate(screenName.AddExpenses, {
            expensesDatas: success.data,
          });
        } else {
          console.log('Failed from expenses list', success.message);
        }
      },
      error => {
        console.log('Error fetching expenses list:', error);
      }
    );
  };

  const viewExpensesList = (id: any) => {
    getMethod(
      `${ApiUrl.expensesDetails}/${id}`,
      success => {
        if (success.code === 200) {
          console.log('Successfully view expenses list', success.data);
          (navigation as any).navigate(screenName.ViewExpenses, {
            expensesDatas: success.data,
          });
        } else {
          console.log('Failed from expenses list', success.message);
        }
      },
      error => {
        console.log('Error fetching expenses list:', error);
      },
    );
  };

  return (
    <Fragment>
      <SafeAreaView style={getTopNotchStyle(true)} />

      <SafeAreaView style={getMainContainerStyle(false)}>
        <View style={[flex1]}>
          <View style={[flex1, { backgroundColor: colors.whiteTwo }]}>
            <View style={mh15}>
              <View style={mv15}>
                <TopHeader headerText={labels.expenses} />
              </View>
                                            <View style={[commonStyles.bottomWidth,mv5]}  />

              <View style={{ marginBottom: 300 }}>
                <ListSubHeader listName={labels.expenses} addIcon={true}
                  onAddPress={addPress} totalNumber={total} onFilterPress={openFilterModal} />
                <FlatList
                  contentContainerStyle={{ paddingBottom: 20 }}
                  data={expensesList}
                  ListEmptyComponent={
                    <View style={{ justifyContent: 'center', alignItems: 'center', marginVertical: 10 }} >
                      <Text style={[commonStyles.h12blackTwo600]}>{loading ? "Loading..." : "No data found"}</Text>
                    </View>
                  }
                  onEndReached={() => {
                    console.log('onEndReached', page, total, expensesList.length);
                    if (total > expensesList.length) {
                      setPage(page + 1);
                    }
                  }}
                  renderItem={({ item, index }) => {
                    let backgroundColor;
                    const data = item;
                    if (data.status === 'Paid') {
                      backgroundColor = colors.green;
                    } else if (data.status === 'Pending') {
                      backgroundColor = colors.blue;
                    } else if (data.status === 'Cancelled') {
                      backgroundColor = colors.danger;
                    } else {
                      backgroundColor = colors.white;
                    }
                    return (
                      <View key={data._id}>
                        {/* <TouchableNativeFeedback onPress={() => { }}> */}
                         <TouchableOpacity style={[commonStyles.mainListCard]} onPress={() => viewExpensesList(data._id)}>
                          <View
                            style={[flexRow, justifyBetween]}>
                            <Text style={[commonStyles.h16blackOne500,alignSelfCenter]} >
                              {data.expenseId}
                            </Text>
                            <View
                              style={{
                                flexDirection: 'row',
                                justifyContent: 'center',
                                alignItems: 'center',
                              }}>
                              <View
                                style={{
                                  backgroundColor,
                                  flexDirection: 'row',
                                  justifyContent: 'center',
                                  alignItems: 'center',
                                  paddingHorizontal: 5,
                                  paddingVertical: 4,
                                  borderRadius: 4,
                                  marginHorizontal: 5,
                                }}>
                                <View
                                  style={{
                                    height: 6,
                                    width: 6,
                                    borderRadius: 6,
                                    backgroundColor: colors.white,
                                  }}
                                />
                               <Text style={[commonStyles.h12white600,{marginHorizontal:4}]}>
                                  {data.status}
                                </Text>
                              </View>
                              <View style={{ flexDirection: 'row' }}>
                                <TouchableOpacity
                                  onPress={() => viewExpensesEditList(data._id)}
                                  style={{
                                    backgroundColor: colors.greyOne,
                                    height: 32,
                                    width: 32,
                                    borderRadius: 30,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    marginHorizontal: 5,
                                  }}>
                                  <CustomIcon
                                    name={'edit'}
                                    size={16}
                                    color={colors.blackTwo}
                                    type={'Feather'}
                                  />
                                </TouchableOpacity>
                                <TouchableOpacity
                                  onPress={() => deleteExpenses(data._id)}
                                  style={{
                                    backgroundColor: colors.greyOne,
                                    height: 32,
                                    width: 32,
                                    borderRadius: 30,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                  }}>
                                  <CustomIcon
                                    name={'delete-forever-outline'}
                                    size={18}
                                    color={colors.blackTwo}
                                    type={'MaterialCommunityIcons'}
                                  />
                                </TouchableOpacity>
                              </View>
                            </View>
                          </View>
                          <View style={{ marginVertical: 10 }}>
                            <DashedLine
                              height={310}
                              color={colors.greyTwo}
                              dashLength={10}
                              dashGap={5}
                            />
                          </View>
                          <View
                            style={{
                              backgroundColor: colors.white4,
                              padding: 10,
                              borderRadius: 10,
                            }}>
                            <View style={[flexRow, justifyBetween]}>
                              <View>
                                <Text style={[commonStyles.h12blackTwo600]}>
                                  {labels.reference}
                                </Text>
                               <Text style={commonStyles.h14blackOne600}>{data.reference}</Text>
                              </View>
                              <View>
                                <Text style={[commonStyles.h12blackTwo600]}>{labels.amount}</Text>
                               <Text style={commonStyles.h14blackOne600}>{currencySymbol}{data.amount}</Text>
                              </View>
                              <View>
                                <Text style={[commonStyles.h12blackTwo600]}>
                                  {labels.modeOfPayment}
                                </Text>
                               <Text style={commonStyles.h14blackOne600}>
                                  {data.paymentMode}
                                </Text>
                              </View>
                            </View>
                          </View>
                        </TouchableOpacity>
                        {/* </TouchableNativeFeedback> */}
                      </View>
                    );
                  }}
                  keyExtractor={(item, index) => index + ''}
                />
              </View>
            </View>
            <BottomNavBar />
            <CustomModal children={

              <View style={[justifyBetween, flex1]}>
                <ModalTopText iconPress={() => setExpenseFilter(false)} title='Filter' />
               <Text style={[commonStyles.h14blackOne600,mv10]} >{"By Staus"}</Text>
                <View style={[flex1, { marginBottom: 30, marginTop: 20 }]}>
                  <FlatList
                    data={['Paid', 'Pending', 'Cancelled']}
                    renderItem={({ item }) => (
                      <View style={[flexRow, alignItemCenter, mv5]}>
                        <TouchableOpacity
                          onPress={() => {
                            handleStatusSelection(item);
                          }}
                          style={[
                            styles.multiSelectBox,
                            {
                              marginHorizontal: 5,
                              backgroundColor: selectedStatus.includes(item) ? colors.primary : colors.white,
                              borderWidth: selectedStatus.includes(item) ? 0 : 1,
                              borderColor: selectedStatus.includes(item) ? colors.primary : colors.grey,
                            },
                          ]}
                        >
                          {selectedStatus.includes(item) && (
                            <CustomIcon name="check" size={15} color="white" type="MaterialIcons" />
                          )}
                        </TouchableOpacity>
                       <Text style={commonStyles.h14blackOne600}>{item}</Text>
                      </View>
                    )}
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
              visible={expenseFilter}
              onClose={closeModal}
              height={'80%'} />
          </View>
        </View>
      </SafeAreaView>
    </Fragment>
  );
};

export default Expenses;

const styles = StyleSheet.create({
  bottomButtonsContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  multiSelectBox: {
    width: 18,
    height: 18,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
