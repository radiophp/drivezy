import React from 'react';
import Link from 'next/link';
import styles from '@/styles/PageTitle.module.css'
import AddColors from "@/components/MyCompo/Colors/AddColors";
import useTranslation from "next-translate/useTranslation";

const colorAdd = ()=> {
    const { t, lang } = useTranslation('common');
    return (
        <>
            {/* Page title */}
            <div className={styles.pageTitle}>
                <h1>{t('cars.add_color')}</h1>
                <ul>
                    <li>
                        <Link href="/">{t('left_side_menu.home')}</Link>
                    </li>
                    <li>
                        <Link href="/brands">{t('cars.colors')} </Link>
                    </li>
                    <li>{t('act.add')} </li>
                </ul>
            </div>


            <AddColors />
        </>
    );
}

export default colorAdd;
