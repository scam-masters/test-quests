"use client"
import React, { useState } from 'react';
import CircleMission from '@/components/button/circle_mission';
import { Dialog } from 'primereact/dialog';
import Link from 'next/link';

function Landing() {

    const [visible_dialog, setVisibleDialog] = useState(false);

    function MissionLocked() {
        return (
            setVisibleDialog(true)
        )
    }

    function handleCloseDialog() {
        return (
            setVisibleDialog(false)
        )
    }

    return (
        <div className='p-10'>
            <div className='text-center relative align-middle'>
                <Link href="/learning/1">
                    <CircleMission type="gradient">
                        Path Traversal
                    </CircleMission>
                </Link>
            </div>
            <div className='text-center mt-5 relative right-14 align-middle'>
                <Link href="/M2Exercise">
                    <CircleMission type="gradient">
                        Test M2
                    </CircleMission>
                </Link>
            </div>
            <div className='text-center mt-5 relative right-14 align-middle' onClick={MissionLocked}>
                <CircleMission type="locked">Mission Locked</CircleMission>
            </div>
            <div className='text-center mt-5 relative align-middle' onClick={MissionLocked}>
                <CircleMission type="locked">Mission Locked</CircleMission>
            </div>
            <div className='text-center mt-5 relative left-14 align-middle' onClick={MissionLocked}>
                <CircleMission type="locked">Mission Locked</CircleMission>
            </div>
            <div className='text-center mt-5 mb-2.5 align-middle' onClick={MissionLocked}>
                <CircleMission type="locked">Mission Locked</CircleMission>
            </div>
            
            <Dialog
                className='bg-tq-black text-tq-white w-1/2 h-auto'
                header="Mission Locked"
                visible={visible_dialog}
                onHide={handleCloseDialog}
            >
                <p>Please complete previous missions to access this one</p>
            </Dialog>
        </div>
    );
}

export default Landing;
