import React from 'react';
import Link from 'next/link';
import styles from '@/styles/PageTitle.module.css'
import AddCar from "@/components/MyCompo/Cars/AddCar";
import useTranslation from "next-translate/useTranslation";

const carAdd = ()=> {
    const { t, lang } = useTranslation('common');
    return (
        <>
            {/* Page title */}
            <div className={styles.pageTitle}>
                <h1>{t('cars.add_car')}</h1>
                <ul>
                    <li>
                        <Link href="/">{t('left_side_menu.home')}</Link>
                    </li>
                    <li>
                        <Link href="/brands">{t('cars.cars')}</Link>
                    </li>
                    <li>{t('act.add')}</li>
                </ul>
            </div>


            <AddCar />
        </>
    );
}

export default carAdd;
