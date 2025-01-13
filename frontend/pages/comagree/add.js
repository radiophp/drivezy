import React from 'react';
import Link from 'next/link';
import styles from '@/styles/PageTitle.module.css'
import AddComissionAgreement from "@/components/MyCompo/ComissionAgreement/AddComissionAgreement";
import {comissionAgreementApiSlice} from "@/redux/slices/comissionAgreementApiSlice";
import useTranslation from "next-translate/useTranslation";

const comissionAgreementAdd = ()=> {
    const { t, lang } = useTranslation('common');
    return (
        <>
            {/* Page title */}
            <div className={styles.pageTitle}>
                <h1>{t('invoice.add_commission_agreement')}</h1>
                <ul>
                    <li>
                        <Link href="/">{t('left_side_menu.home')}</Link>
                    </li>
                    <li>
                        <Link href="/comagree/add">{t('invoice.commission_agreement')}</Link>
                    </li>
                    <li>{t('act.add')}</li>
                </ul>
            </div>


            <AddComissionAgreement />
        </>
    );
}

export default comissionAgreementAdd;
