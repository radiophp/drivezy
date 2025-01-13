import React from 'react';
import Link from 'next/link';
import styles from '@/styles/PageTitle.module.css'
import AddMwstInvoice from "@/components/MyCompo/MwstInvoice/AddMwstInvoice";
import useTranslation from "next-translate/useTranslation";

const MwstInvoiceAdd = ()=> {
    const { t, lang } = useTranslation('common');
    return (
        <>
            {/* Page title */}
            <div className={styles.pageTitle}>
                <h1>{t('invoice.add_mwst_invoice')}</h1>
                <ul>
                    <li>
                        <Link href="/">{t('left_side_menu.home')}</Link>
                    </li>
                    <li>
                        <Link href="/deals">{t('invoice.mwst_invoice')}</Link>
                    </li>
                    <li>{t('act.add')}</li>
                </ul>
            </div>


            <AddMwstInvoice />
        </>
    );
}

export default MwstInvoiceAdd;
