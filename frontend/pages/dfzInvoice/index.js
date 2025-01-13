import React from 'react';
import Link from 'next/link';
import styles from '@/styles/PageTitle.module.css';
import useTranslation from "next-translate/useTranslation";
import ListDfzInvoice from "@/components/MyCompo/DfzInvoice/ListDfzInvoice";

const DfzInvoices = () =>{
    const { t, lang } = useTranslation('common');
    return (
        <>
            {/* Page title */}
            <div className={styles.pageTitle}>
                <h1>{t('invoice.dfz_invoice')}</h1>
                <ul>
                    <li>
                        <Link href="/">{t('left_side_menu.home')}</Link>
                    </li>
                    <li>{t('invoice.dfz_invoice')} </li>
                </ul>
            </div>


            {/* RecentOrders */}
            <ListDfzInvoice/>

        </>
    );
}
export default DfzInvoices;
