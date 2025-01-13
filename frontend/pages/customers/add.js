import React from 'react';
import Link from 'next/link';
import styles from '@/styles/PageTitle.module.css'
import AddCustomer from "@/components/MyCompo/Customers/AddCustomer";

import useTranslation from "next-translate/useTranslation";

const customerAdd = ()=> {
    const { t, lang } = useTranslation('common');
    return (
        <>
            {/* Page title */}
            <div className={styles.pageTitle}>
                <h1>{t('customer.add_customer')}</h1>
                <ul>
                    <li>
                        <Link href="/">{t('left_side_menu.home')}</Link>
                    </li>
                    <li>
                        <Link href="/customers">{t('customer.customers')}</Link>
                    </li>
                    <li>{t('act.add')}</li>
                </ul>
            </div>


            <AddCustomer />
        </>
    );
}

export default customerAdd;
