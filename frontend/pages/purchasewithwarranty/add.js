import React from 'react';
import Link from 'next/link';
import styles from '@/styles/PageTitle.module.css'
import AddPurchaseWithWarranty from  "@/components/MyCompo/PurchaseWithWarranty/AddPurchaseWithWarranty";
import purchaseWithWarrantyApiSlice from '@/redux/slices/purchaseWithWarrantyApiSlice';
import useTranslation from "next-translate/useTranslation";


const purchasewithwarrantyAdd = ()=> {
    const { t, lang } = useTranslation('common');
    return (
        <>
            {/* Page title */}
            <div className={styles.pageTitle}>
                <h1>{t('invoice.add_purchase_with_warranty')}</h1>
                <ul>
                    <li>
                        <Link href="/">{t('left_side_menu.home')}</Link>
                    </li>
                    <li>
                        <Link href="/purchasewithwarranty/add">{t('invoice.purchase_with_warranty')}</Link>
                    </li>
                    <li>{t('act.add')}</li>
                </ul>
            </div>


            <AddPurchaseWithWarranty />
        </>
    );
}

export default purchasewithwarrantyAdd;
