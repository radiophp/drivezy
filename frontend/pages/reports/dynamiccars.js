//write base component with arrow function
import styles from "@/styles/PageTitle.module.css";
import useTranslation from "next-translate/useTranslation";
import DynamicCars from "@/components/MyCompo/reports/DynamicCars";
import Link from "next/link";
import React from "react";

const Dynamiccars = () => {
    const { t, lang } = useTranslation('common');

    return (
        <>
            <div className={styles.pageTitle}>
                <h1>{t('left_side_menu.cars_dynamic_report')}</h1>
                <ul>
                    <li>
                        <Link href="/">{t('left_side_menu.home')}</Link>
                    </li>
                    <li>{t('left_side_menu.cars_dynamic_report')}</li>
                </ul>
            </div>
            <DynamicCars />
        </>
    );
}
export default Dynamiccars;
