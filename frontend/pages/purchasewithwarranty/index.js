import React from 'react';
import Link from 'next/link';
import styles from '@/styles/PageTitle.module.css';
import useTranslation from "next-translate/useTranslation";
import ListPurchaseWithWarranty from "@/components/MyCompo/PurchaseWithWarranty/ListPurchaseWithWarranty";
const Purchasewithwarranties = () =>{
    const { t, lang } = useTranslation('common');
    return (
        <>
            {/* Page title */}
            <div className={styles.pageTitle}>
                <h1>{t('invoice.purchase_with_warranty')}</h1>
                <ul>
                    <li>
                        <Link href="/">{t('left_side_menu.home')}</Link>
                    </li>
                    <li>{t('invoice.purchase_with_warranty')} </li>
                </ul>
            </div>


            {/* RecentOrders */}
            <ListPurchaseWithWarranty/>

        </>
    );
}
export default Purchasewithwarranties;
