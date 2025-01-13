import React from 'react';
import Link from 'next/link';
import styles from '@/styles/PageTitle.module.css'
import UpdateCustomer from "@/components/MyCompo/Customers/UpdateCustomer";
import useTranslation from "next-translate/useTranslation";

const customerUpdate = ()=> {
    const { t, lang } = useTranslation('common');
    return (
        <>
            {/* Page title */}
            <div className={styles.pageTitle}>
                <h1>{t('customer.update_customer')}</h1>
                <ul>
                    <li>
                        <Link href="/">{t('left_side_menu.home')}</Link>
                    </li>
                    <li>
                        <Link href="/customers">{t('customer.customers')}</Link>
                    </li>
                    <li>{t('act.update')}</li>
                </ul>
            </div>


            <UpdateCustomer />
        </>
    );
}

export default customerUpdate;
