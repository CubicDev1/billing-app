import { CurrencyDollar, FileInvoice, UserPlus } from "../png"

export const notificationData1 = [
    {
        id: 1,
        time: '11.45 am',
        icon:UserPlus,
        notificationType: 'New Vendor Added',
        notification:'Credentials of new vendor John are successfully added'

    },
    {
        id: 2,
        time: '10.45 am',
        icon: FileInvoice,
        notificationType: 'Invoice #INV0024 Updated',
        notification:'Invoice',
        invoiceId:' #INV0024',
        notificationMsg1:' \nfor Emily has been updated.'
    },
    {
        id: 3,
        time: '10.45 am',
        icon: CurrencyDollar,
        notificationType: 'Payment Received ',
        notification:'Payment of $1200 been received for Invoice ',
        invoiceId:'#INV0032',
        notificationMsg1:' form Peter'
    }
]


export const notificationData2 = [
    {
        id: 1,
        icon:UserPlus,
        time: '1 day ago',
        notificationType: 'New Customer Added',
        notification:' Credentials of new \ncustomer Paloatte are successfully added '
    },

    {
        id: 2,
        icon:UserPlus,
        time: '1 day ago',
        notificationType: 'New Vendor Added',
        notification:' Credentials of new     \nvendor John are successfully added '

    }
]