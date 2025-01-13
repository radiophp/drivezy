import React from 'react';
import ListModels from "@/components/MyCompo/Models/ListModels";
import Link from 'next/link';
import styles from '@/styles/PageTitle.module.css';
import useTranslation from "next-translate/useTranslation";

const Models = () =>{
    const { t, lang } = useTranslation('common');
    return (
        <>
            {/* Page title */}
            <div className={styles.pageTitle}>
                <h1>{t('cars.models')}</h1>
                <ul>
                    <li>
                        <Link href="/">{t('left_side_menu.home')}</Link>
                    </li>
                    <li>{t('cars.models')}</li>
                </ul>
            </div>


            {/* RecentOrders */}
            <ListModels />

        </>
    );
}
export default Models;
