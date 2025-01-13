import React from 'react';
import Link from 'next/link';
import styles from '@/styles/PageTitle.module.css'
import AddBaseInfo from "@/components/MyCompo/Basicinfo/AddBasicInfo";

//
const brandAdd = ()=> {
    return (
        <>
            {/* Page title */}
            <div className={styles.pageTitle}>
                <h1>Add Basic Info</h1>
                <ul>
                    <li>
                        <Link href="/">Dashboard</Link>
                    </li>
                    <li>
                        <Link href="/brands">Basic info</Link>
                    </li>
                    <li>Add</li>
                </ul>
            </div>


            <AddBaseInfo />
        </>
    );
}

export default brandAdd;
