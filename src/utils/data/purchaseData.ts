import { labels } from "../labels";
import { CustomProImg1, CustomProImg2, CustomProImg3, CustomProImg4, CustomProImg6 } from "../png";

export const purchaseData = [
    {
        id: 1,
        image: CustomProImg1,
        name: labels.emily,
        purchaseOrderId: '#PO-0008',
        date: '15 Mar 2024',
        amount: '$1500',
    },
    {
        id: 2,
        image: CustomProImg2,
        name: labels.jerry,
        purchaseOrderId: '#PO-0007',
        date: '10 Mar 2024',
        amount: '$1200',
    },
    {
        id: 3,
        image: CustomProImg3,
        name: labels.peter,
        purchaseOrderId: '#PO-0006',
        date: '05 Mar 2024',
        amount: '$900',


    },
    {
        id: 4,
        image: CustomProImg4,
        name: labels.lisa,
        purchaseOrderId: '#361039',
        date: '27 Feb 2024',
        amount: '$1150',
    },
]


export const purchaseReturnData = [
    {
        id: 1,
        image: CustomProImg1,
        name: labels.emily,
        purchaseOrderId: '#DEBIT-0009',
        date: '15 Mar 2024',
        amount: '$1500',
    },
    {
        id: 2,
        image: CustomProImg2,
        name: labels.jerry,
        purchaseOrderId: '#DEBIT-0008',
        date: '10 Mar 2024',
        amount: '$1200',
    },
    {
        id: 3,
        image: CustomProImg3,
        name: labels.peter,
        purchaseOrderId: '#PO-0006',
        date: '#DEBIT-0007',
        amount: '$900',


    },
    {
        id: 4,
        image: CustomProImg4,
        name: labels.lisa,
        purchaseOrderId: '#DEBIT-0006',
        date: '27 Feb 2024',
        amount: '$1150',
    },
    {
        id: 5,
        image: CustomProImg6,
        name: labels.andrew,
        purchaseOrderId: '#DEBIT-0005',
        date: '15 Feb 2024',
        amount: '$1000',
    },
]

export const purchasesData = [
    {
        id: 1,
        image: CustomProImg1,
        name: labels.emily,
        purchaseOrderId: '#PUR0019',
        date: '15 Mar 2024',
        amount: '$1500',
        status:'Paid',
        payment:'Cash'
    },
    {
        id: 2,
        image: CustomProImg2,
        name: labels.jerry,
        purchaseOrderId: '#PUR0018',
        date: '10 Mar 2024',
        amount: '$1200',
        status:'Paid',
        payment:'Cash'
    },
    {
        id: 3,
        image: CustomProImg3,
        name: labels.peter,
        purchaseOrderId: '#PUR0017',
        date: '#DEBIT-0007',
        amount: '$900',
        status:'Paid',
        payment:'Cash'

    },
    {
        id: 4,
        image: CustomProImg4,
        name: labels.lisa,
        purchaseOrderId: '#PUR0016',
        date: '27 Feb 2024',
        amount: '$1150',
        status:'Paid',
        payment:'Cash'
    },
    {
        id: 5,
        image: CustomProImg6,
        name: labels.andrew,
        purchaseOrderId: '#PUR0015',
        date: '15 Feb 2024',
        amount: '$1000',
        status:'Paid',
        payment:'Cash'
    },
]