import React from 'react';
import ListCustomers from "@/components/MyCompo/Customers/ListCustomers";
import Link from 'next/link';
import styles from '@/styles/PageTitle.module.css';
import useTranslation from "next-translate/useTranslation";

const Customers = () =>{
    const { t, lang } = useTranslation('common');
    return (
        <>
            {/* Page title */}
            <div className={styles.pageTitle}>
                <h1>{t('customer.customers')}</h1>
                <ul>
                    <li>
                        <Link href="/">{t('left_side_menu.home')}</Link>
                    </li>
                    <li>{t('customer.customers')}</li>
                </ul>
            </div>


            {/* RecentOrders */}
            <ListCustomers />

        </>
    );
}
export default Customers;
