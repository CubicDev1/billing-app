import { labels } from "../labels";
import { CartCheckIcon, CartDownIcon, CustomProImg1, CustomProImg2, CustomProImg3, CustomProImg4, DummyIcon, ExpenseIcon, GoogleImg, IncomeIcon, LowStockIcon, ProImg1, ProImg2, ProImg3, ProImg4, ProImg5, ProImg6, ProImg7, ProfitIcon, QuotationIcon, ReportImg1, ReportImg2, ReportImg3, SalesIcon, SalesReturnIcon, StockIcon, TaxIcon } from "../png";
import { screenName } from "../screenNames";

export const reportsListData = [
    {
        id: 1,
        title: 'Expense\nReport',
        iconImg: ExpenseIcon,
        moveTo: screenName.ExpenseReport,
    },
    {
        id: 2,
        title: 'Purchase\nReport',
        iconImg: CartDownIcon,
        moveTo: screenName.PurchaseReport,
    },
    {
        id: 3,
        title: 'Purchase Return\nReport',
        iconImg: CartCheckIcon,
        moveTo: screenName.PurchaseReturnReport,


    },
    {
        id: 4,
        title: 'Sales\nReport',
        iconImg: SalesIcon,
        moveTo: screenName.SalesReport,
    },
    {
        id: 5,
        title: 'Sales Return\nReport',
        iconImg: SalesReturnIcon,
        moveTo: screenName.SalesReturnReport,


    },
    {
        id: 6,
        title: 'Quotation\nReport',
        iconImg: QuotationIcon,
        moveTo: screenName.QuotationReport,


    },
    {
        id: 7,
        title: 'Payment\nReport',
        iconImg: DummyIcon,
        moveTo: screenName.PaymentReport,
    },
    // {
    //     id: 8,
    //     title: 'Stock\nReport',
    //     iconImg: StockIcon,
    //     moveTo: screenName.StockReport,

    // },
    // {
    //     id: 9,
    //     title: 'Low Stock\nReport',
    //     iconImg: LowStockIcon,
    //     moveTo: screenName.LowStockReport,

    // },
    // {
    //     id: 10,
    //     title: 'Income\nReport',
    //     iconImg: IncomeIcon,
    //     moveTo: screenName.IncomeReport,


    // },
    {
        id: 11,
        title: 'Tax\nReport',
        iconImg: TaxIcon,
        moveTo: screenName.TaxReport,



    },
    // {
    //     id: 12,
    //     title: 'Profit or\nLoss',
    //     iconImg: ProfitIcon,
    //     moveTo: screenName.ProfitorLoss,


    // },
]

export const expenseReportData = [
    {
        id: 1,
        name: labels.fedex,
        email: labels.fedexEmail,
        status: labels.paid,
        amount: labels.amount1,
        category: labels.marketing,
        createdOn: labels.date1,
        image: ReportImg1,

    },

    {
        id: 2,
        name: labels.google,
        email: labels.googleEmail,
        status: labels.pending,
        amount: labels.amount2,
        category: labels.software,
        createdOn: labels.date2,
        image: GoogleImg
    },

    {
        id: 3,
        name: labels.worldEnergy,
        email: labels.worldEmail,
        status: labels.paid,
        amount: labels.amount3,
        category: labels.advertising,
        createdOn: labels.date3,
        image: ReportImg2
    },
    {
        id: 4,
        name: labels.paloatte,
        email: labels.paloatteEmail,
        status: labels.pending,
        amount: labels.amount1,
        category: labels.marketing,
        createdOn: labels.date4,
        image: ReportImg3
    },
    {
        id: 5,
        name: labels.worldEnergy,
        email: labels.worldEmail,
        status: labels.paid,
        amount: labels.amount3,
        category: labels.advertising,
        createdOn: labels.date3,
        image: ReportImg2
    },
    {
        id: 6,
        name: labels.fedex,
        email: labels.fedexEmail,
        status: labels.paid,
        amount: labels.amount1,
        category: labels.marketing,
        createdOn: labels.date1,
        image: ReportImg1
    },
]

export const purchaseReportData = [
    {
        id: 1,
        code: '#P125390',
        productName: 'Beats Pro',
        inStock: '10',
        purchaseQuantity: '10',
        price: '$1100',
        productImg: ProImg1,
        dueDate: '15 Mar 2024',
        productType: 'Electronics',
        soldQty: '10',
        OpeningOty: '0',
        qtyIn: '12',
        qtyOut: '04',
        closingQty: '08',
        openingQty: '10',



    },
    {
        id: 2,
        code: '#P125389',
        productName: 'Nike Jordan',
        inStock: '12',
        purchaseQuantity: '15',
        price: '$1200',
        productImg: ProImg2,
        dueDate: '10 Mar 2024',
        productType: 'Shoes',
        soldQty: '15',
        OpeningOty: '0',
        qtyIn: '15',
        qtyOut: '06',
        closingQty: '09',
        openingQty: '12',



    },
    {
        id: 3,
        code: '#P125391',
        productName: 'Iphone 14 pro',
        inStock: '30',
        purchaseQuantity: '15',
        price: '$1450',
        productImg: ProImg3,
        dueDate: '27 Feb 2024',
        productType: 'Mobile Phones',
        soldQty: '20',
        OpeningOty: '0',
        qtyIn: '12',
        qtyOut: '06',
        closingQty: '06',
        openingQty: '12',




    },
    {
        id: 4,
        code: '#P125393',
        productName: 'Woodcraft Sandal',
        inStock: '25',
        purchaseQuantity: '20',
        price: '$248',
        productImg: ProImg4,
        dueDate: '16 Feb 2024',
        productType: 'Nike',
        soldQty: '25',
        OpeningOty: '0',
        qtyIn: '15',
        qtyOut: '06',
        closingQty: '04',
        openingQty: '15',




    },
    {
        id: 5,
        code: '#P125392',
        productName: 'Amazon Echo Dot',
        inStock: '12',
        purchaseQuantity: '15',
        price: '$1200',
        productImg: ProImg5,
        dueDate: '14 Feb 2024',
        productType: 'Speakers',
        soldQty: '18',
        OpeningOty: '0',
        qtyIn: '12',
        qtyOut: '04',
        closingQty: '08',
        openingQty: '18',



    },
    {
        id: 6,
        code: '#P125389',
        productName: 'Sofa Set Furnitures',
        inStock: '12',
        purchaseQuantity: '15',
        price: '$1200',
        productImg: ProImg6,
        dueDate: '13 Feb 2024',
        productType: 'Furnitures',
        soldQty: '10',
        OpeningOty: '0',
        qtyIn: '12',
        qtyOut: '04',
        closingQty: '08',
        openingQty: '12',



    },
    {
        id: 7,
        code: '#P125389',
        productName: 'Office Chairs',
        inStock: '12',
        purchaseQuantity: '15',
        price: '$1200',
        productImg: ProImg7,
        dueDate: '12 Feb 2024',
        productType: 'Chairs',
        soldQty: '12',
        OpeningOty: '0',
        qtyIn: '12',
        qtyOut: '06',
        closingQty: '06',
        openingQty: '10',


    },
]

export const quotationReportData = [
    {
        id: 1,
        name: labels.fedex,
        email: labels.fedexEmail,
        amount: labels.amount1,
        createdOn: labels.date1,
        image: ReportImg1,
        quotationId: 'QU-0014',
        dueDate: '20 Mar 2024'
    },

    {
        id: 2,
        name: labels.google,
        email: labels.googleEmail,
        amount: labels.amount2,
        createdOn: labels.date2,
        image: GoogleImg,
        quotationId: 'QU-0013',
        dueDate: '10 Mar 2024'
    },

    {
        id: 3,
        name: labels.worldEnergy,
        email: labels.worldEmail,
        amount: labels.amount3,
        createdOn: labels.date3,
        image: ReportImg2,
        quotationId: 'QU-0012',
        dueDate: '05 Mar 2024'
    },
    {
        id: 4,
        name: labels.paloatte,
        email: labels.paloatteEmail,
        amount: labels.amount1,
        createdOn: labels.date4,
        image: ReportImg3,
        quotationId: 'QU-0011',
        dueDate: '10 Mar 2024'
    },
    {
        id: 5,
        name: labels.worldEnergy,
        email: labels.worldEmail,
        amount: labels.amount3,
        createdOn: labels.date3,
        image: ReportImg2,
        quotationId: 'QU-0010',
        dueDate: '22 Feb 2024'
    },
    {
        id: 6,
        name: labels.fedex,
        email: labels.fedexEmail,
        amount: labels.amount1,
        createdOn: labels.date1,
        image: ReportImg1,
        quotationId: 'QU-0009',
        dueDate: '20 Feb 2024'
    },
]

export const paymentReportData = [
    {
        id: 1,
        name: labels.fedex,
        email: labels.fedexEmail,
        amount: labels.amount1,
        image: ReportImg1,
        payReceive: '$1500',
        paySent: '$400',
        date: '15 Mar 2024',
        modeOfPayement: 'cash',
        incomeAmount: '$2000',

    },

    {
        id: 2,
        name: labels.google,
        email: labels.googleEmail,
        amount: labels.amount2,
        image: GoogleImg,
        payReceive: '$1700',
        paySent: '$500',
        date: '110Mar 2024',
        modeOfPayement: 'cash',
        incomeAmount: '$1200',


    },

    {
        id: 3,
        name: labels.worldEnergy,
        email: labels.worldEmail,
        amount: labels.amount3,
        image: ReportImg2,
        payReceive: '$1600',
        paySent: '$200',
        date: '27 Feb 2024',
        modeOfPayement: 'cash',
        incomeAmount: '$1600',

    },
    {
        id: 4,
        name: labels.paloatte,
        email: labels.paloatteEmail,
        amount: labels.amount1,
        image: ReportImg3,
        payReceive: '$1400',
        paySent: '$100',
        date: '15 Feb 2024',
        modeOfPayement: 'cash',
        incomeAmount: '$1100',
    },
    {
        id: 5,
        name: labels.worldEnergy,
        email: labels.worldEmail,
        amount: labels.amount3,
        image: ReportImg2,
        payReceive: '$1500',
        paySent: '$400',
        date: '10 Feb 2024',
        modeOfPayement: 'cash',
        incomeAmount: '$1500',
    },
    {
        id: 6,
        name: labels.fedex,
        email: labels.fedexEmail,
        amount: labels.amount1,
        image: ReportImg1,
        payReceive: '$1500',
        paySent: '$400',
        date: '15 Jan 2024',
        modeOfPayement: 'cash',
        incomeAmount: '$2000',
    },
]

export const purchaseTaxData = [
    {
        id: 1,
        image: CustomProImg1,
        name: labels.emily,
        profileId: '#313235',
        date: '15 Mar 2024',
        discount: '10',
        taxAmount: '$200',
        payment: 'Cash',
        totalAmnt: '$2000',
    },
    {
        id: 2,
        image: CustomProImg2,
        name: labels.jerry,
        profileId: '#358193',
        date: '10 Mar 2024',
        discount: '08',
        taxAmount: '$100',
        payment: 'Cash',
        totalAmnt: '$1600',



    },
    {
        id: 3,
        image: CustomProImg3,
        name: labels.peter,
        profileId: '#381954',
        date: '24 Feb 2024',
        discount: '12',
        taxAmount: '$250',
        payment: 'Cash',
        totalAmnt: '$1400',


    },
    {
        id: 4,
        image: CustomProImg4,
        name: labels.lisa,
        profileId: '#361039',
        date: '18 Feb 2024',
        discount: '07',
        taxAmount: '$170',
        payment: 'Cash',
        totalAmnt: '$1200',


    },
]

export const salesTaxData = [
    {
        id: 1,
        image: ReportImg1,
        name: labels.fedex,
        profileId: '#INV0020',
        date: '15 Mar 2024',
        discount: '10',
        taxAmount: '$200',
        payment: 'Cash',
        totalAmnt: '$2000',
    },
    {
        id: 2,
        image: GoogleImg,
        name: labels.google,
        profileId: '#INV0019',
        date: '10 Mar 2024',
        discount: '08',
        taxAmount: '$100',
        payment: 'Cash',
        totalAmnt: '$1600',



    },
    {
        id: 3,
        image: ReportImg2,
        name: labels.worldEnergy,
        profileId: '#INV0018',
        date: '24 Feb 2024',
        discount: '12',
        taxAmount: '$250',
        payment: 'Cash',
        totalAmnt: '$1400',


    },
    {
        id: 4,
        image: ReportImg3,
        name: labels.paloatte,
        profileId: '#INV0017',
        date: '18 Feb 2024',
        discount: '07',
        taxAmount: '$170',
        payment: 'Cash',
        totalAmnt: '$1200',


    },
]