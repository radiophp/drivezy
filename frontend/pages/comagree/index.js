import React from 'react';
import Link from 'next/link';
import styles from '@/styles/PageTitle.module.css';
import useTranslation from "next-translate/useTranslation";
import ListComissionAgreement from  "/components/MyCompo/ComissionAgreement/ListComissionAgreement";
const Comagrees = () =>{
    const { t, lang } = useTranslation('common');
    return (
        <>
            {/* Page title */}
            <div className={styles.pageTitle}>
                <h1>{t('invoice.commission_agreement')}</h1>
                <ul>
                    <li>
                        <Link href="/">{t('left_side_menu.home')}</Link>
                    </li>
                    <li>{t('invoice.commission_agreement')} </li>
                </ul>
            </div>


            {/* RecentOrders */}
            <ListComissionAgreement/>

        </>
    );
}
export default Comagrees;
