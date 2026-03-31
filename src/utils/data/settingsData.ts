import { labels } from "../labels";
import { InvoiceImg1, InvoiceImg2, InvoiceImg3 } from "../png";
import { screenName } from "../screenNames";
import { SettingsIconImg1, SettingsIconImg2, SettingsIconImg3, SettingsIconImg4, SettingsIconImg5, SettingsIconImg6, SettingsIconImg7 } from "../svg";

export const settingsData = [
    // {
    //     id: 1,
    //     title: labels.darkMode,
    //     IconImg: SettingsIconImg1,

    // },
    {
        id: 1,
        title: labels.generalSettings,
        IconImg: SettingsIconImg2,
        moveTo: screenName.GeneralSettings

    },
    {
        id: 2,
        title: labels.invoiceSettings,
        IconImg: SettingsIconImg3,
        moveTo: screenName.InvoiceSettings

    },
    {
        id: 3,
        title: labels.invoiceTemplates,
        IconImg: SettingsIconImg4,
        moveTo: screenName.InvoiceTemplates

    },
    {
        id: 4,
        title: labels.bankDetails,
        IconImg: SettingsIconImg5,
        moveTo: screenName.BankDetails

    },
    {
        id: 5,
        title: labels.taxRates,
        IconImg: SettingsIconImg6,
        moveTo: screenName.TaxRate
    },
    {
        id: 6,
        title: labels.logout,
        IconImg: SettingsIconImg7,
        moveTo: screenName.LoginEmailScreen

    },
]

export const bankDetailsData = [
    {
        id: 1,
        accName:labels.accName1,
        accNum:labels.accNum1,
        branch:labels.branch1,
        bankName:labels.bankName1,
        ifscode:labels.IFSCode1
    }
]

export const taxRatesData = [
    {
        id: 1,
        tax:'SGST',
        taxRate:'8%',
        status:'Active'
    },
    {
        id: 2,
        tax:'NO TAX',
        taxRate:'5%',
        status:'Active'

    },
    {
        id: 3,
        tax:'GST',
        taxRate:'8%',
        status:'Active'

    },
    {
        id: 4,
        tax:'CGST',
        taxRate:'18%',
        status:'Active'

    },
    {
        id: 5,
        tax:'Service Charge',
        taxRate:'18%',
        status:'Active'

    },
    {
        id: 6,
        tax:'VAT Standard rate',
        taxRate:'15%',
        status:'Active'

    },

]

export const invoiceTemplatesData = [
    {
        id: 1,
        image:InvoiceImg3
    },
    {
        id: 2,
        image:InvoiceImg3
    },
    {
        id: 3,
        image:InvoiceImg2
    },
    {
        id: 4,
        image:InvoiceImg1
    },
    {
        id: 5,
        image:InvoiceImg2
    },
    {
        id: 6,
        image:InvoiceImg2
    }
]