import { labels } from "../labels";
import { CustomProImg1, CustomProImg2, CustomProImg3, CustomProImg4, CustomProImg5, RecentInvoiceImage1, RecentInvoiceImage2, RecentInvoiceImage3, RecentInvoiceImage4, RecentInvoiceImage5, RecentInvoiceImage6, RecentInvoiceImage7 } from "../png";
import { colors } from "../theme/colors";

export const creditNotesdata = [
    {
        id : 1,
        img : CustomProImg1,
        invoiceNo : '#INV0021',
        companyName : 'BYD Groups',
        status : labels.paid,
        color : colors.green,
        amount : '$264',
        modeOfPayment : 'Cash',
        creditId : '#CN - 4567',
        dueDate : "23 Apr 2024"
    },
    {
        id : 2,
        img : CustomProImg2,
        invoiceNo : '#INV0022',
        companyName : 'World Energy',
        status : labels.sent,
        color : colors.redFour,
        amount : '$564',
        modeOfPayment : 'Cash',
        creditId : '#CN - 9876',
        dueDate : "21 Apr 2024"
    },
    {
        id : 3,
        img : CustomProImg3,
        invoiceNo : '#INV0022',
        companyName : 'FedEx',
        status : labels.partiallypaid,
        color : colors.blue,
        amount : '$874',
        modeOfPayment : 'Cash',
        creditId : '#CN - 2345',
        dueDate : "12 Apr 2024"
    },
    {
        id : 4,
        img : CustomProImg4,
        invoiceNo : '#INV0011',
        companyName : 'Abbott',
        status : labels.overDue,
        color : colors.yellow,
        amount : '$324',
        modeOfPayment : 'Cash',
        creditId : '#CN - 0987',
        dueDate : "18 Apr 2024"
    },
    {
        id : 5,
        img : CustomProImg5,
        invoiceNo : '#INV0018',
        companyName : 'Whirlpool',
        status :labels.unpaid,
        color : colors.danger,
        amount : '$364',
        modeOfPayment : 'Cash',
        creditId : '#CN - 6543',
        dueDate : "26 Apr 2024"
    },
    {
        id : 6,
        img : CustomProImg1,
        invoiceNo : '#INV0017',
        companyName : 'Google',
        status : labels.sent,
        color : colors.redFour,
        amount : '$264',
        modeOfPayment : 'Cash',
        creditId : '#CN - 3456',
        dueDate : "23 Apr 2024"
    },
    {
        id : 7,
        img : CustomProImg2,
        invoiceNo : '#INV0016',
        companyName : 'Palotte',
        status : labels.draft,
        color : colors.blueFour,
        amount : '$264',
        modeOfPayment : 'Cash',
        creditId : '#CN - 6789',
        dueDate : "23 Apr 2024"
    },
    
]