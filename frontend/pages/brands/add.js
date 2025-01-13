import React from 'react';
import Link from 'next/link';
import styles from '@/styles/PageTitle.module.css'
import AddBrand from "@/components/MyCompo/Brands/AddBrand";
import useTranslation from "next-translate/useTranslation";

const brandAdd = ()=> {
    const { t, lang } = useTranslation('common');
    return (
        <>
            {/* Page title */}
            <div className={styles.pageTitle}>
                <h1>{t('cars.add_brand')}</h1>
                <ul>
                    <li>
                        <Link href="/">{t('left_side_menu.home')}</Link>
                    </li>
                    <li>
                        <Link href="/brands">{t('cars.brands')}</Link>
                    </li>
                    <li>{t('act.add')}</li>
                </ul>
            </div>


            <AddBrand />
        </>
    );
}

export default brandAdd;
