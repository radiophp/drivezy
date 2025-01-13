import React from 'react';
import ListColors from "@/components/MyCompo/Colors/ListColors";
import Link from 'next/link';
import styles from '@/styles/PageTitle.module.css';
import useTranslation from "next-translate/useTranslation";

const Colors = () =>{
    const { t, lang } = useTranslation('common');
    return (
        <>
            {/* Page title */}
            <div className={styles.pageTitle}>
                <h1>{t('cars.colors')}</h1>
                <ul>
                    <li>
                        <Link href="/">{t('left_side_menu.home')}</Link>
                    </li>
                    <li>{t('cars.colors')} </li>
                </ul>
            </div>


            {/* RecentOrders */}
            <ListColors />

        </>
    );
}
export default Colors;
