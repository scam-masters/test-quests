import CircleMission from '@/components/button/circle_mission';
import { Dialog } from 'primereact/dialog';

function Landing({ switchPage }) {
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
                <CircleMission onClick={() => switchPage('m1learning')} type="gradient">Path Traversal</CircleMission>
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
                header="Mission Locked"
                visible={visible_dialog}
                style={{ width: '50vw' }}
                onHide={handleCloseDialog}
            >
                <p>Please complete previous missions to access this one</p>
            </Dialog>
        </div>
    );
}

export default Landing;
