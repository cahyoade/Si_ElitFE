import { useState } from 'react';
import Beranda from './Beranda';
import Faq from './FAQ';
import JadwalKelas from './JadwalKelas';
import Login from './Login';

function Landing() {
    const [view, setView] = useState(window.location.pathname.split('/')[2] || 'Beranda');

    return (
        <>
            {
                view == 'faq' ? <Faq /> : <></>
            }
            {
                view == 'jadwalKelas' ? <JadwalKelas /> : <></>
            }
            {
                view == 'login' ? <Login /> : <></>
            }
            {
                !(['faq', 'jadwalKelas', 'login'].includes(view)) ? <Beranda /> : <></>
            }
        </>
    );
}

export default Landing;