import React from 'react';
import Link from 'next/link';
import styles from '@/styles/PageTitle.module.css'
import AddDeal from "@/components/MyCompo/Deals/AddDeal";

const dealAdd = ()=> {
    return (
        <>
            {/* Page title */}
            <div className={styles.pageTitle}>
                <h1>Add Deals</h1>
                <ul>
                    <li>
                        <Link href="/">Dashboard</Link>
                    </li>
                    <li>
                        <Link href="/deals">Deals</Link>
                    </li>
                    <li>Add</li>
                </ul>
            </div>


            <AddDeal />
        </>
    );
}

export default dealAdd;
