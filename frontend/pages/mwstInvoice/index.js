import React from 'react';
import Link from 'next/link';
import styles from '@/styles/PageTitle.module.css';
import useTranslation from "next-translate/useTranslation";
import ListMwstInvoice from "@/components/MyCompo/MwstInvoice/ListMwstInvoice";
const MwstInvoices = () =>{
    const { t, lang } = useTranslation('common');
    return (
        <>
            {/* Page title */}
            <div className={styles.pageTitle}>
                <h1>{t('invoice.mwst_invoice')}</h1>
                <ul>
                    <li>
                        <Link href="/">{t('left_side_menu.home')}</Link>
                    </li>
                    <li>{t('invoice.mwst_invoice')} </li>
                </ul>
            </div>


            {/* RecentOrders */}
            <ListMwstInvoice/>

        </>
    );
}
export default MwstInvoices;
