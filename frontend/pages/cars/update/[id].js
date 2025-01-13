import React from 'react';
import Link from 'next/link';
import styles from '@/styles/PageTitle.module.css'
import UpdateCar from "@/components/MyCompo/Cars/UpdateCar";
import useTranslation from "next-translate/useTranslation";

const CarUpdate = ()=> {
    const { t, lang } = useTranslation('common');
    return (
        <>
            {/* Page title */}
            <div className={styles.pageTitle}>
                <h1>{t('cars.update_car' )}</h1>
                <ul>
                    <li>
                        <Link href="/">{t('left_side_menu.home')}</Link>
                    </li>
                    <li>
                        <Link href="/cars">{t('cars.cars')}</Link>
                    </li>
                    <li>{t('act.update')}</li>
                </ul>
            </div>
            <UpdateCar />
        </>
    );
}

export default CarUpdate;
