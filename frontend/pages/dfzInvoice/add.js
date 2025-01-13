import React from 'react';
import Link from 'next/link';
import styles from '@/styles/PageTitle.module.css'
import AddDfzInvoice from "@/components/MyCompo/DfzInvoice/AddDfzInvoice";
import useTranslation from "next-translate/useTranslation";

const DfzInvoiceAdd = ()=> {
    const { t, lang } = useTranslation('common');
    return (
        <>
            {/* Page title */}
            <div className={styles.pageTitle}>
                <h1>{t('invoice.add_dfz_invoice')}</h1>
                <ul>
                    <li>
                        <Link href="/">{t('left_side_menu.home')}</Link>
                    </li>
                    <li>
                        <Link href="/dfzInvoice/">{t('invoice.dfz_invoice')}</Link>
                    </li>
                    <li>{t('act.add')}</li>
                </ul>
            </div>


            <AddDfzInvoice />
        </>
    );
}

export default DfzInvoiceAdd;
