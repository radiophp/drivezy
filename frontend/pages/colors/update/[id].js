import React from 'react';
import Link from 'next/link';
import styles from '@/styles/PageTitle.module.css'
import UpdateColors from "@/components/MyCompo/Colors/UpdateColors";
import useTranslation from "next-translate/useTranslation";

const brandUpdate = ()=> {
    const { t, lang } = useTranslation('common');
    return (
        <>
            {/* Page title */}
            <div className={styles.pageTitle}>
                <h1>{t('cars.update_color')}</h1>
                <ul>
                    <li>
                        <Link href="/">{t('left_side_menu.home')}</Link>
                    </li>
                    <li>
                        <Link href="/brands">{t('cars.colors')} </Link>
                    </li>
                    <li>{t('act.update')}</li>
                </ul>
            </div>


            <UpdateColors />
        </>
    );
}

export default brandUpdate;
