import { labels } from "../labels";
import { RecentInvoiceImage4, RecentInvoiceImage5, ReportImg1, ReportImg2 } from "../png";

export const salesReturnData =[
    {id:1,
        image:ReportImg2,
        status:'Paid',
        amount:'$264',
        payment:'Cash',
        date:'23 Apr 2024',
        productCode:'#CNV0021',
        name:labels.worldEnergy

    },
    {id:2,
        image:ReportImg1,
        status:'Paid',
        amount:'$264',
        payment:'Cash',
        date:'23 Apr 2024',
        productCode:'#CNV0022',
        name:labels.fedex

    },  {id:3,
        image:RecentInvoiceImage4,
        status:'Paid',
        amount:'$264',
        payment:'Cash',
        date:'23 Apr 2024',
        productCode:'#CNV0023',
        name:labels.abbott

    },
    {id:4,
        image:RecentInvoiceImage5,
        status:'Paid',
        amount:'$264',
        payment:'Cash',
        date:'23 Apr 2024',
        productCode:'#CNV0024',
        name:labels.whirlpool

    },

]