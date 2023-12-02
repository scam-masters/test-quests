import React from 'react';
import CircleMission from '../components/button/circle_mission';

function Landing({ switchPage }) {
  return (
    <div className='p-10'>
        <div className='text-center relative align-middle'>
            <CircleMission onClick={() => switchPage('m1learning')} type="gradient">Path Traversal</CircleMission>
        </div>
        <div className='text-center mt-5 relative right-14 align-middle'>
            <CircleMission type="locked">Mission Locked</CircleMission>
        </div>
        <div className='text-center mt-5 relative align-middle'>
            <CircleMission type="locked">Mission Locked</CircleMission>
        </div>
        <div className='text-center mt-5 relative left-14 align-middle'>
            <CircleMission type="locked">Mission Locked</CircleMission>
        </div>
        <div className='text-center mt-5 mb-2.5 align-middle'>
            <CircleMission type="locked">Mission Locked</CircleMission>
        </div>
    </div>
  );
}

export default Landing;
