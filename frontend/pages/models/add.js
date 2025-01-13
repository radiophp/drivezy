import React from 'react';
import Link from 'next/link';
import styles from '@/styles/PageTitle.module.css'
import AddModel from "@/components/MyCompo/Models/AddModel";
import useTranslation from "next-translate/useTranslation";

const modelAdd = ()=> {
    const { t, lang } = useTranslation('common');
    return (
        <>
            {/* Page title */}
            <div className={styles.pageTitle}>
                <h1>{t('cars.add_model')}</h1>
                <ul>
                    <li>
                        <Link href="/">{t('left_side_menu.home')}</Link>
                    </li>
                    <li>
                        <Link href="/brands">{t('cars.models')}</Link>
                    </li>
                    <li>{t('cars.add_model')}</li>
                </ul>
            </div>


            <AddModel />
        </>
    );
}

export default modelAdd;
