import React from 'react';
import Link from 'next/link';
import styles from '@/styles/PageTitle.module.css';
import useTranslation from "next-translate/useTranslation";
import ListNettoInvoice from "@/components/MyCompo/NettoInvoice/ListNettoInvoice";
const NettoInvoices = () =>{
    const { t, lang } = useTranslation('common');
    return (
        <>
            {/* Page title */}
            <div className={styles.pageTitle}>
                <h1>{t('invoice.netto_invoice')}</h1>
                <ul>
                    <li>
                        <Link href="/">{t('left_side_menu.home')}</Link>
                    </li>
                    <li>{t('invoice.netto_invoice')} </li>
                </ul>
            </div>


            {/* RecentOrders */}
            <ListNettoInvoice/>

        </>
    );
}
export default NettoInvoices;
