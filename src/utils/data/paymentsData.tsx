import { labels } from "../labels";
import { GoogleImg, RecentInvoiceImage1, RecentInvoiceImage2, RecentInvoiceImage3, RecentInvoiceImage4, RecentInvoiceImage5, RecentInvoiceImage6, RecentInvoiceImage7, ReportImg1, ReportImg2, ReportImg3 } from "../png";

export const paymentsData = [
    {
        id : 1,
        img : RecentInvoiceImage1,
        companyName : 'BYD Groups',
        phoneNo : '+1 9754627382', 
        quotationId : 'QUO - 000015',
        createdOn : "23 Apr 2024",
        amount : '$1400',
        paymentId : '6iag827bdi8vgueede343',
        modeOfPayment : 'Cash',
    },
    {
        id : 2,
        img : RecentInvoiceImage2,
        companyName : 'World Energy',
        phoneNo : '+1 9754627528', 
        quotationId : 'QUO - 000014',
        createdOn : "21 Apr 2024",
        amount : '$950',
        paymentId : '34g6ygss22179afgha9',
        modeOfPayment : 'Bank',
    },
    {
        id : 3,
        img : RecentInvoiceImage3,
        companyName : 'FedEX',
        phoneNo : '+1 9754627386', 
        quotationId : 'QUO - 000013',
        createdOn : "12 Apr 2024",
        amount : '$1100',
        paymentId : '9776vhuug679afgha9',
        modeOfPayment : 'Cash',
    },
    {
        id : 4,
        img : RecentInvoiceImage4,
        companyName : 'Abbott',
        phoneNo : '+1 9754627397', 
        quotationId : 'QUO - 000012',
        createdOn : "18 Apr 2024",
        amount : '$700',
        paymentId : '8765yfysog679afgha9',
        modeOfPayment : 'Cash',
    },
    {
        id : 5,
        img : RecentInvoiceImage5,
        companyName : 'Whirlpool',
        phoneNo : '+1 9754627334', 
        quotationId : 'QUO - 000011',
        createdOn : "26 Apr 2024",
        amount : '$1400',
        paymentId : '90bialog679afgha9',
        modeOfPayment : 'Cash',
    },
    {
        id : 6,
        img : RecentInvoiceImage6,
        companyName : 'Google',
        phoneNo : '+1 9754627326', 
        quotationId : 'QUO - 000010',
        createdOn : "23 Apr 2024",
        amount : '$1800',
        paymentId : '09vsrtg679afgha9',
        modeOfPayment : 'Bank',
    },
    {
        id : 7,
        img : RecentInvoiceImage7,
        companyName : 'Palotte',
        phoneNo : '+1 9754627385', 
        quotationId : 'QUO - 000009',
        createdOn : "23 Apr 2024",
        amount : '$2100',
        paymentId : '09hgfng679afgha9',
        modeOfPayment : 'Cash',
    },
]

export const paymentSummaryData = [
    {
        id: 1,
        image: ReportImg1,
        name: labels.fedex,
        profileId: '#INV0020',
        date: '15 Mar 2024',
        payment: 'Cash',
        totalAmnt: '$2000',
    },
    {
        id: 2,
        image: GoogleImg,
        name: labels.google,
        profileId: '#INV0019',
        date: '10 Mar 2024',
        payment: 'Cash',
        totalAmnt: '$1600',



    },
    {
        id: 3,
        image: ReportImg2,
        name: labels.worldEnergy,
        profileId: '#INV0018',
        date: '24 Feb 2024',
        payment: 'Cash',
        totalAmnt: '$1400',


    },
    {
        id: 4,
        image: ReportImg3,
        name: labels.paloatte,
        profileId: '#INV0017',
        date: '18 Feb 2024',
        payment: 'Cash',
        totalAmnt: '$1200',


    },
]