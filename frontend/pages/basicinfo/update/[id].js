import React from 'react';
import Link from 'next/link';
import styles from '@/styles/PageTitle.module.css'
import UpdateBasicinfo from "@/components/MyCompo/Basicinfo/UpdateBasicinfo";
import useTranslation from "next-translate/useTranslation";

const basicinfoUpdate = ()=> {
    const { t, lang } = useTranslation('common');
    return (
        <>
            {/* Page title */}
            <div className={styles.pageTitle}>
                <h1>{t('basic_info.update_basic_info')}</h1>
                <ul>
                    <li>
                        <Link href="/">{t('left_side_menu.home')}</Link>
                    </li>
                    <li>
                        <Link href="/basicinfo/update/653d05e98a263c6c3efe6678/">Basic Info</Link>
                    </li>
                    <li>{t('act.update')}</li>
                </ul>
            </div>


            <UpdateBasicinfo />
        </>
    );
}

export default basicinfoUpdate;
