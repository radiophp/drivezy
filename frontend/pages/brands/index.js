import React from 'react';
import ListBrands from "@/components/MyCompo/Brands/ListBrands";
import Link from 'next/link';
import styles from '@/styles/PageTitle.module.css';
import useTranslation from "next-translate/useTranslation";

const Brands = () =>{
    const { t, lang } = useTranslation('common');
    return (
        <>
            {/* Page title */}
            <div className={styles.pageTitle}>
                <h1>{t('cars.brands')}</h1>
                <ul>
                    <li>
                        <Link href="/">{t('left_side_menu.home')}</Link>
                    </li>
                    <li>{t('cars.brands')}</li>
                </ul>
            </div>


            {/* RecentOrders */}
            <ListBrands />

        </>
    );
}
export default Brands;
