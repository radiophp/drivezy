import React from 'react';
import Link from 'next/link';
import styles from '@/styles/PageTitle.module.css'
import UpdateBrand from "@/components/MyCompo/Brands/UpdateBrand";
import useTranslation from "next-translate/useTranslation";

const brandUpdate = ()=> {
    const { t, lang } = useTranslation('common');
    return (
        <>
            {/* Page title */}
            <div className={styles.pageTitle}>
                <h1>{t('cars.update_brand')}</h1>
                <ul>
                    <li>
                        <Link href="/">{t('left_side_menu.home')}</Link>
                    </li>
                    <li>
                        <Link href="/brands">{t('cars.brands')} </Link>
                    </li>
                    <li>{t('act.update')}</li>
                </ul>
            </div>


            <UpdateBrand />
        </>
    );
}

export default brandUpdate;
