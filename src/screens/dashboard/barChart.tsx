import { Text, View } from 'react-native';
import { BarChart, barDataItem } from 'react-native-gifted-charts';
import { colors } from '../../utils/theme/colors';
import { commonStyles } from '../../utils/commonStyles';

interface SalesData {
  createdAt: string;
  TotalAmount: string;
}

interface GroupedSales {
  month: string;
  totalAmount: number;
}

export const BarChartDiagram = ({ purchaseAmount, salesAmount }: any) => {
  console.log('bar chart data', purchaseAmount, salesAmount)

  // Combine data for BarChart
  const combinedList: barDataItem[] | { value: any; label?: string; spacing?: number; labelWidth?: number; labelTextStyle?: { color: string; }; frontColor: string; }[] | undefined = [];

  // Array to map month numbers to their three-letter abbreviations
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  // Iterate over sales data keys
  purchaseAmount.forEach((items: any, index: number) => {
    combinedList.push(
      {
        value: purchaseAmount[index]?.total || 0,
        label: purchaseAmount[index].month || '',
        spacing: 8,
        labelWidth: 35,
        labelComponent: () => (
          <View style={{ alignItems: 'center', marginLeft: -12 }}>
            <Text style = {[commonStyles.h12GreyTwo400,{ color: 'gray', fontSize: 10 }]} >{purchaseAmount[index].month || ''}</Text>
          </View>
        ),
        labelTextStyle: { color: 'gray' },
        frontColor: colors.primarTwo,
      }
    );

    combinedList.push(
      {
        value: salesAmount[index]?.total || 0,
        frontColor: colors.blackOne,
      }
    );
  });


  console.log('combined list', combinedList)

  return (
    <View style={{ backgroundColor: colors.white, borderRadius: 10 }}>
      <BarChart
        data={combinedList}
        barWidth={10}
        spacing={50}
        roundedTop
        roundedBottom
        rulesLength={280}
        rulesColor={colors.greyFour}
        xAxisThickness={0}
        yAxisThickness={0}
        yAxisTextStyle={{ color: 'gray', fontSize: 10 }}
        xAxisTextStyle={{ color: 'gray', fontSize: 10 }}
        maxValue={Math.max(...combinedList.map(item => item.value)) + 100}
        noOfSections={5}
      />
    </View>
  );
};
