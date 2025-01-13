import React from 'react';
import Link from 'next/link';
import styles from '@/styles/PageTitle.module.css'
import AddNettoInvoice from "@/components/MyCompo/NettoInvoice/AddNettoInvoice";
import useTranslation from "next-translate/useTranslation";

const DfzInvoiceAdd = ()=> {
    const { t, lang } = useTranslation('common');
    return (
        <>
            {/* Page title */}
            <div className={styles.pageTitle}>
                <h1>{t('invoice.add_netto_invoice')}</h1>
                <ul>
                    <li>
                        <Link href="/">{t('left_side_menu.home')}</Link>
                    </li>
                    <li>
                        <Link href="/deals">{t('invoice.netto_invoice')}</Link>
                    </li>
                    <li>{t('act.add')}</li>
                </ul>
            </div>


            <AddNettoInvoice />
        </>
    );
}

export default DfzInvoiceAdd;
