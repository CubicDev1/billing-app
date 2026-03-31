import { currencySymbol } from "../../constant/constApi";
import { labels } from "../labels";
import { RecentInvoiceImage1, RecentInvoiceImage2, RecentInvoiceImage3, RecentInvoiceImage4, RecentInvoiceImage5, RecentInvoiceImage6, RecentInvoiceImage7 } from "../png";
import { InvoiceCardImg1, InvoiceCardImg2, InvoiceCardImg3, InvoiceCardImg4, ProductCardImg1, ProductCardImg2, ProductCardImg3, ProductCardImg4, ProductCardImg5 } from "../svg";
import { colors } from "../theme/colors";

interface TotalData {
    _id: string | null;
    total_sum: number;
    count: number;
}

// Assuming the type of `data` is as follows
type Response = {
    recurring_total: any;
    total_overdue: any;
    total_drafted: any;
    total_outstanding: any;
    total_invoice: any;
    totalRecs: Array<{ amount: number, count: number }>,
    paidRecs: Array<any>,
    outStandingRecs: Array<any>,
    draftedRecs: Array<any>,
    cancelledRecs: Array<any>,
    overDueRecs: Array<any>
};
export const invoiceCardData = (data: Response) => {    
    return [
        {
            id: 1,
            Img: InvoiceCardImg1,
            color: colors.blueTwo,
            amount: `$${data?.total_invoice[0]?.total_sum.toLocaleString() || '0'}`,
            text: 'Total Invoice',
            count: data?.total_invoice[0]?.count.toString() || '0',
        },
        {
            id: 2,
            Img: InvoiceCardImg2,
            color: colors.redTwo,
            amount: `$${data?.total_overdue[0]?.total_sum.toLocaleString() || '0'}`,
            text: 'Overdue',
            count: data?.total_overdue[0]?.count.toString() || '0',
        },
        {
            id: 3,
            Img: InvoiceCardImg3,
            color: colors.blueThree,
            amount: `$${data?.total_drafted[0]?.total_sum.toLocaleString() || '0'}`,
            text: 'Draft',
            count: data?.total_drafted[0]?.count.toString() || '0',
        },
        {
            id: 4,
            Img: InvoiceCardImg4,
            color: colors.yellowOne,
            amount: `$${data?.total_outstanding[0]?.total_sum.toLocaleString() || '0'}`,
            text: 'Outstanding',
            count: data?.total_outstanding[0]?.count.toString() || '0',
        },
    ];
}

export const CustomerCardData = (CardDetails: Response) => {
    
    return [
        {
            id: 1,
            Img: InvoiceCardImg1,
            color: colors.blueTwo,
            amount: `${currencySymbol}${CardDetails.totalRecs[0]?.amount.toLocaleString() || '0'}`,
            text: 'Total Invoice',
            count: CardDetails.totalRecs[0]?.count.toString() || '0',
        },
        {
            id: 2,
            Img: InvoiceCardImg2,
            color: colors.redTwo,
            amount: `${currencySymbol}${CardDetails.overDueRecs[0]?.amount.toLocaleString() || '0'}`,
            text: 'Overdue',
            count: CardDetails.overDueRecs[0]?.count.toString() || '0',
        },
        {
            id: 3,
            Img: InvoiceCardImg3,
            color: colors.blueThree,
            amount: `${currencySymbol}${CardDetails.draftedRecs[0]?.amount.toLocaleString() || '0'}`,
            text: 'Draft',
            count: CardDetails.draftedRecs[0]?.count.toString() || '0',
        },
        {
            id: 4,
            Img: InvoiceCardImg4,
            color: colors.yellowOne,
            amount: `${currencySymbol}${CardDetails.outStandingRecs[0]?.amount.toLocaleString() || '0'}`,
            text: 'Outstanding',
            count: CardDetails.outStandingRecs[0]?.count.toString() || '0',
        },
    ];
}



export const allInvoicesdata = [
    {
        id: 1,
        img: RecentInvoiceImage1,
        invoiceNo: '#INV0021',
        companyName: 'BYD Groups',
        status: labels.paid,
        color: colors.green,
        amount: '$264',
        modeOfPayment: 'Cash',
        dueDate: "23 Apr 2024"
    },
    {
        id: 2,
        img: RecentInvoiceImage2,
        invoiceNo: '#INV0022',
        companyName: 'World Energy',
        status: labels.sent,
        color: colors.redFour,
        amount: '$564',
        modeOfPayment: 'Cash',
        dueDate: "21 Apr 2024"
    },
    {
        id: 3,
        img: RecentInvoiceImage3,
        invoiceNo: '#INV0022',
        companyName: 'FedEx',
        status: labels.partiallypaid,
        color: colors.blue,
        amount: '$874',
        modeOfPayment: 'Cash',
        dueDate: "12 Apr 2024"
    },
    {
        id: 4,
        img: RecentInvoiceImage4,
        invoiceNo: '#INV0011',
        companyName: 'Abbott',
        status: labels.overDue,
        color: colors.yellow,
        amount: '$324',
        modeOfPayment: 'Cash',
        dueDate: "18 Apr 2024"
    },
    {
        id: 5,
        img: RecentInvoiceImage5,
        invoiceNo: '#INV0018',
        companyName: 'Whirlpool',
        status: labels.unpaid,
        color: colors.danger,
        amount: '$364',
        modeOfPayment: 'Cash',
        dueDate: "26 Apr 2024"
    },
    {
        id: 6,
        img: RecentInvoiceImage6,
        invoiceNo: '#INV0017',
        companyName: 'Google',
        status: labels.sent,
        color: colors.redFour,
        amount: '$264',
        modeOfPayment: 'Cash',
        dueDate: "23 Apr 2024"
    },
    {
        id: 7,
        img: RecentInvoiceImage7,
        invoiceNo: '#INV0016',
        companyName: 'Palotte',
        status: labels.draft,
        color: colors.blueFour,
        amount: '$264',
        modeOfPayment: 'Cash',
        dueDate: "23 Apr 2024"
    },

]

export const paidInvoicesdata = [
    {
        id: 1,
        img: RecentInvoiceImage1,
        invoiceNo: '#INV0021',
        companyName: 'BYD Groups',
        status: labels.paid,
        color: colors.green,
        amount: '$264',
        modeOfPayment: 'Cash',
        dueDate: "23 Apr 2024"
    },
    {
        id: 2,
        img: RecentInvoiceImage2,
        invoiceNo: '#INV0022',
        companyName: 'World Energy',
        status: labels.paid,
        color: colors.green,
        amount: '$564',
        modeOfPayment: 'Cash',
        dueDate: "21 Apr 2024"
    },
    {
        id: 3,
        img: RecentInvoiceImage3,
        invoiceNo: '#INV0022',
        companyName: 'FedEx',
        status: labels.paid,
        color: colors.green,
        amount: '$874',
        modeOfPayment: 'Cash',
        dueDate: "12 Apr 2024"
    },
    {
        id: 4,
        img: RecentInvoiceImage4,
        invoiceNo: '#INV0011',
        companyName: 'Abbott',
        status: labels.paid,
        color: colors.green,
        amount: '$324',
        modeOfPayment: 'Cash',
        dueDate: "18 Apr 2024"
    },
    {
        id: 5,
        img: RecentInvoiceImage5,
        invoiceNo: '#INV0018',
        companyName: 'Whirlpool',
        status: labels.paid,
        color: colors.green,
        amount: '$364',
        modeOfPayment: 'Cash',
        dueDate: "26 Apr 2024"
    },
    {
        id: 6,
        img: RecentInvoiceImage6,
        invoiceNo: '#INV0017',
        companyName: 'Google',
        status: labels.paid,
        color: colors.green,
        amount: '$264',
        modeOfPayment: 'Cash',
        dueDate: "23 Apr 2024"
    },
    {
        id: 7,
        img: RecentInvoiceImage7,
        invoiceNo: '#INV0016',
        companyName: 'Palotte',
        status: labels.paid,
        color: colors.green,
        amount: '$264',
        modeOfPayment: 'Cash',
        dueDate: "23 Apr 2024"
    },

]

export const partiallyPaidInvoicesdata = [
    {
        id: 1,
        img: RecentInvoiceImage1,
        invoiceNo: '#INV0021',
        companyName: 'BYD Groups',
        status: labels.partiallypaid,
        color: colors.blue,
        amount: '$264',
        modeOfPayment: 'Cash',
        dueDate: "23 Apr 2024"
    },
    {
        id: 2,
        img: RecentInvoiceImage2,
        invoiceNo: '#INV0022',
        companyName: 'World Energy',
        status: labels.partiallypaid,
        color: colors.blue,
        amount: '$564',
        modeOfPayment: 'Cash',
        dueDate: "21 Apr 2024"
    },
    {
        id: 3,
        img: RecentInvoiceImage3,
        invoiceNo: '#INV0022',
        companyName: 'FedEx',
        status: labels.partiallypaid,
        color: colors.blue,
        amount: '$874',
        modeOfPayment: 'Cash',
        dueDate: "12 Apr 2024"
    },
    {
        id: 4,
        img: RecentInvoiceImage4,
        invoiceNo: '#INV0011',
        companyName: 'Abbott',
        status: labels.partiallypaid,
        color: colors.blue,
        amount: '$324',
        modeOfPayment: 'Cash',
        dueDate: "18 Apr 2024"
    },
    {
        id: 5,
        img: RecentInvoiceImage5,
        invoiceNo: '#INV0018',
        companyName: 'Whirlpool',
        status: labels.partiallypaid,
        color: colors.blue,
        amount: '$364',
        modeOfPayment: 'Cash',
        dueDate: "26 Apr 2024"
    },
    {
        id: 6,
        img: RecentInvoiceImage6,
        invoiceNo: '#INV0017',
        companyName: 'Google',
        status: labels.partiallypaid,
        color: colors.blue,
        amount: '$264',
        modeOfPayment: 'Cash',
        dueDate: "23 Apr 2024"
    },
    {
        id: 7,
        img: RecentInvoiceImage7,
        invoiceNo: '#INV0016',
        companyName: 'Palotte',
        status: labels.partiallypaid,
        color: colors.blue,
        amount: '$264',
        modeOfPayment: 'Cash',
        dueDate: "23 Apr 2024"
    },

]

export const overdueInvoicesdata = [
    {
        id: 1,
        img: RecentInvoiceImage1,
        invoiceNo: '#INV0021',
        companyName: 'BYD Groups',
        status: labels.overDue,
        color: colors.yellow,
        amount: '$264',
        modeOfPayment: 'Cash',
        dueDate: "23 Apr 2024"
    },
    {
        id: 2,
        img: RecentInvoiceImage2,
        invoiceNo: '#INV0022',
        companyName: 'World Energy',
        status: labels.overDue,
        color: colors.yellow,
        amount: '$564',
        modeOfPayment: 'Cash',
        dueDate: "21 Apr 2024"
    },
    {
        id: 3,
        img: RecentInvoiceImage3,
        invoiceNo: '#INV0022',
        companyName: 'FedEx',
        status: labels.overDue,
        color: colors.yellow,
        amount: '$874',
        modeOfPayment: 'Cash',
        dueDate: "12 Apr 2024"
    },
    {
        id: 4,
        img: RecentInvoiceImage4,
        invoiceNo: '#INV0011',
        companyName: 'Abbott',
        status: labels.overDue,
        color: colors.yellow,
        amount: '$324',
        modeOfPayment: 'Cash',
        dueDate: "18 Apr 2024"
    },
    {
        id: 5,
        img: RecentInvoiceImage5,
        invoiceNo: '#INV0018',
        companyName: 'Whirlpool',
        status: labels.overDue,
        color: colors.yellow,
        amount: '$364',
        modeOfPayment: 'Cash',
        dueDate: "26 Apr 2024"
    },
    {
        id: 6,
        img: RecentInvoiceImage6,
        invoiceNo: '#INV0017',
        companyName: 'Google',
        status: labels.overDue,
        color: colors.yellow,
        amount: '$264',
        modeOfPayment: 'Cash',
        dueDate: "23 Apr 2024"
    },
    {
        id: 7,
        img: RecentInvoiceImage7,
        invoiceNo: '#INV0016',
        companyName: 'Palotte',
        status: labels.overDue,
        color: colors.yellow,
        amount: '$264',
        modeOfPayment: 'Cash',
        dueDate: "23 Apr 2024"
    },

]

export const unpaidInvoicesdata = [
    {
        id: 1,
        img: RecentInvoiceImage1,
        invoiceNo: '#INV0021',
        companyName: 'BYD Groups',
        status: labels.unpaid,
        color: colors.danger,
        amount: '$264',
        modeOfPayment: 'Cash',
        dueDate: "23 Apr 2024"
    },
    {
        id: 2,
        img: RecentInvoiceImage2,
        invoiceNo: '#INV0022',
        companyName: 'World Energy',
        status: labels.unpaid,
        color: colors.danger,
        amount: '$564',
        modeOfPayment: 'Cash',
        dueDate: "21 Apr 2024"
    },
    {
        id: 3,
        img: RecentInvoiceImage3,
        invoiceNo: '#INV0022',
        companyName: 'FedEx',
        status: labels.unpaid,
        color: colors.danger,
        amount: '$874',
        modeOfPayment: 'Cash',
        dueDate: "12 Apr 2024"
    },
    {
        id: 4,
        img: RecentInvoiceImage4,
        invoiceNo: '#INV0011',
        companyName: 'Abbott',
        status: labels.unpaid,
        color: colors.danger,
        amount: '$324',
        modeOfPayment: 'Cash',
        dueDate: "18 Apr 2024"
    },
    {
        id: 5,
        img: RecentInvoiceImage5,
        invoiceNo: '#INV0018',
        companyName: 'Whirlpool',
        status: labels.unpaid,
        color: colors.danger,
        amount: '$364',
        modeOfPayment: 'Cash',
        dueDate: "26 Apr 2024"
    },
    {
        id: 6,
        img: RecentInvoiceImage6,
        invoiceNo: '#INV0017',
        companyName: 'Google',
        status: labels.unpaid,
        color: colors.danger,
        amount: '$264',
        modeOfPayment: 'Cash',
        dueDate: "23 Apr 2024"
    },
    {
        id: 7,
        img: RecentInvoiceImage7,
        invoiceNo: '#INV0016',
        companyName: 'Palotte',
        status: labels.unpaid,
        color: colors.danger,
        amount: '$264',
        modeOfPayment: 'Cash',
        dueDate: "23 Apr 2024"
    },

]

export const sentInvoicesdata = [
    {
        id: 1,
        img: RecentInvoiceImage1,
        invoiceNo: '#INV0021',
        companyName: 'BYD Groups',
        status: labels.sent,
        color: colors.redFour,
        amount: '$264',
        modeOfPayment: 'Cash',
        dueDate: "23 Apr 2024"
    },
    {
        id: 2,
        img: RecentInvoiceImage2,
        invoiceNo: '#INV0022',
        companyName: 'World Energy',
        status: labels.sent,
        color: colors.redFour,
        amount: '$564',
        modeOfPayment: 'Cash',
        dueDate: "21 Apr 2024"
    },
    {
        id: 3,
        img: RecentInvoiceImage3,
        invoiceNo: '#INV0022',
        companyName: 'FedEx',
        status: labels.sent,
        color: colors.redFour,
        amount: '$874',
        modeOfPayment: 'Cash',
        dueDate: "12 Apr 2024"
    },
    {
        id: 4,
        img: RecentInvoiceImage4,
        invoiceNo: '#INV0011',
        companyName: 'Abbott',
        status: labels.sent,
        color: colors.redFour,
        amount: '$324',
        modeOfPayment: 'Cash',
        dueDate: "18 Apr 2024"
    },
    {
        id: 5,
        img: RecentInvoiceImage5,
        invoiceNo: '#INV0018',
        companyName: 'Whirlpool',
        status: labels.sent,
        color: colors.redFour,
        amount: '$364',
        modeOfPayment: 'Cash',
        dueDate: "26 Apr 2024"
    },
    {
        id: 6,
        img: RecentInvoiceImage6,
        invoiceNo: '#INV0017',
        companyName: 'Google',
        status: labels.sent,
        color: colors.redFour,
        amount: '$264',
        modeOfPayment: 'Cash',
        dueDate: "23 Apr 2024"
    },
    {
        id: 7,
        img: RecentInvoiceImage7,
        invoiceNo: '#INV0016',
        companyName: 'Palotte',
        status: labels.sent,
        color: colors.redFour,
        amount: '$264',
        modeOfPayment: 'Cash',
        dueDate: "23 Apr 2024"
    },

]

export const draftInvoicesdata = [
    {
        id: 1,
        img: RecentInvoiceImage1,
        invoiceNo: '#INV0021',
        companyName: 'BYD Groups',
        status: labels.draft,
        color: colors.blueOne,
        amount: '$264',
        modeOfPayment: 'Cash',
        dueDate: "23 Apr 2024"
    },
    {
        id: 2,
        img: RecentInvoiceImage2,
        invoiceNo: '#INV0022',
        companyName: 'World Energy',
        status: labels.draft,
        color: colors.blueOne,
        amount: '$564',
        modeOfPayment: 'Cash',
        dueDate: "21 Apr 2024"
    },
    {
        id: 3,
        img: RecentInvoiceImage3,
        invoiceNo: '#INV0022',
        companyName: 'FedEx',
        status: labels.draft,
        color: colors.blueOne,
        amount: '$874',
        modeOfPayment: 'Cash',
        dueDate: "12 Apr 2024"
    },
    {
        id: 4,
        img: RecentInvoiceImage4,
        invoiceNo: '#INV0011',
        companyName: 'Abbott',
        status: labels.draft,
        color: colors.blueOne,
        amount: '$324',
        modeOfPayment: 'Cash',
        dueDate: "18 Apr 2024"
    },
    {
        id: 5,
        img: RecentInvoiceImage5,
        invoiceNo: '#INV0018',
        companyName: 'Whirlpool',
        status: labels.draft,
        color: colors.blueOne,
        amount: '$364',
        modeOfPayment: 'Cash',
        dueDate: "26 Apr 2024"
    },
    {
        id: 6,
        img: RecentInvoiceImage6,
        invoiceNo: '#INV0017',
        companyName: 'Google',
        status: labels.draft,
        color: colors.blueOne,
        amount: '$264',
        modeOfPayment: 'Cash',
        dueDate: "23 Apr 2024"
    },
    {
        id: 7,
        img: RecentInvoiceImage7,
        invoiceNo: '#INV0016',
        companyName: 'Palotte',
        status: labels.draft,
        color: colors.blueOne,
        amount: '$264',
        modeOfPayment: 'Cash',
        dueDate: "23 Apr 2024"
    },
]

export const productsData = [
    {
        id: 1,
        Img: ProductCardImg1,
        name: 'Beats Pro',
        unit: 'Pc',
        price: '$258',
    },
    {
        id: 2,
        Img: ProductCardImg2,
        name: 'Nike Jordan',
        unit: 'Pc',
        price: '$258',
    },
    {
        id: 3,
        Img: ProductCardImg3,
        name: 'Iphone 14 pro',
        unit: 'Pc',
        price: '$258',
    },
    {
        id: 4,
        Img: ProductCardImg4,
        name: 'Woodcraft Sandal',
        unit: 'Pc',
        price: '$258',
    },
    {
        id: 5,
        Img: ProductCardImg5,
        name: 'Amazon Echo Dot',
        unit: 'Pc',
        price: '$258',
    },
]

export const addedProductData = [
    {
        id: 1,
        qty: '50 Pc * $258',
        dicount: '$0',
        name: 'Iphone 14 Pro',
        amount: '$105',
    },
    {
        id: 2,
        qty: '10 Pc * $102',
        dicount: '$200 - (0%)',
        name: 'Nike Shoe',
        amount: '$102',
    },
]

export const actionData = [
    // {
    //     id: 1,
    //     text: 'Send Payment Link',
    //     iconName: 'link',
    //     iconType: 'MaterialCommunityIcons',
    //     iconSize: 14,
    // },
    {
        id: 2,
        text: 'View Invoice',
        iconName: 'email-outline',
        iconType: 'MaterialCommunityIcons',
        iconSize: 14,
    },
    {
        id: 3,
        text: 'Edit',
        iconName: 'edit',
        iconType: 'Feather',
        iconSize: 14,
    },
    {
        id: 4,
        text: 'Send',
        iconName: 'send',
        iconType: "Feather",
        iconSize: 14,
    },
    // {
    //     id: 5,
    //     text: 'Print & Download',
    //     iconName: 'printer',
    //     iconType: "Feather",
    //     iconSize: 14,
    // },
    {
        id: 6,
        text: 'Convert to Sales Return',
        iconName: 'file-clock-outline',
        iconType: "MaterialCommunityIcons",
        iconSize: 14,
    },
    {
        id: 7,
        text: 'Clone as Invoice',
        iconName: 'copy',
        iconType: "Feather",
        iconSize: 14,
    },
    // {
    //     id: 8,
    //     text: 'Delete',
    //     iconName: 'delete-forever-outline',
    //     iconType: 'MaterialCommunityIcons',
    //     iconSize: 14,
    // },
]
