import React from 'react';
import Link from 'next/link';
import styles from '@/styles/PageTitle.module.css'
import UpdateModel from "@/components/MyCompo/Models/UpdateModel";
import useTranslation from "next-translate/useTranslation";

const modelUpdate = ()=> {
    const { t, lang } = useTranslation('common');
    return (
        <>
            {/* Page title */}
            <div className={styles.pageTitle}>
                <h1>{t('cars.update_model')}</h1>
                <ul>
                    <li>
                        <Link href="/">{t('left_side_menu.home')}</Link>
                    </li>
                    <li>
                        <Link href="/models">{t('cars.models')}</Link>
                    </li>
                    <li>{t('cars.update_model')}</li>
                </ul>
            </div>


            <UpdateModel />
        </>
    );
}

export default modelUpdate;
