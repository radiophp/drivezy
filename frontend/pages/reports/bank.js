//write base component with arrow function
import styles from "@/styles/PageTitle.module.css";
import useTranslation from "next-translate/useTranslation";
import BankReport from "@/components/MyCompo/reports/BankReport";
import Link from "next/link";
import React from "react";

const Bank = () => {
    const { t, lang } = useTranslation('common');

    return (
       <>
           <div className={styles.pageTitle}>
               <h1>{t('invoice.bank_report')}</h1>
               <ul>
                   <li>
                       <Link href="/">{t('left_side_menu.home')}</Link>
                   </li>
                   <li>{t('invoice.bank_report')}</li>
               </ul>
           </div>
            <BankReport />
       </>
    );
}
export default Bank;
