import React from 'react';
import ListCars from "@/components/MyCompo/Cars/ListCars";
import Link from 'next/link';
import styles from '@/styles/PageTitle.module.css';
import useTranslation from "next-translate/useTranslation";


const Cars = () =>{
    const { t, lang } = useTranslation('common');
    return (
        <>
            {/* Page title */}
            <div className={styles.pageTitle}>
                <h1>{t('cars.cars')}</h1>
                <ul>
                    <li>
                        <Link href="/">{t('left_side_menu.home')}</Link>
                    </li>
                    <li>{t('cars.cars')}</li>
                </ul>
            </div>


            {/* RecentOrders */}
            <ListCars />

        </>
    );
}
export default Cars;
