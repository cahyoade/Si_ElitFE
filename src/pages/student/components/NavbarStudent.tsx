import Logo from '../../../assets/logo.png';
import { Link, useLocation } from 'react-router-dom';
import { useContext, useState } from 'react';
import { RxHamburgerMenu } from 'react-icons/rx';
import { BiLogOut } from 'react-icons/bi';
import { AppContext } from '../../../AppContext';
import Swal from 'sweetalert2'

type NavbarProps = {
    className?: string
}


function Navbar({ className }: NavbarProps) {
    const [isExpanded, setIsExpanded] = useState(false);
    const setToken = useContext(AppContext).token.set;
    const location = useLocation();


    function logout() {
        Swal.fire({
            title: 'Apakan anda yakin ingin logout?',
            showCancelButton: true,
            confirmButtonText: 'Ya',
            confirmButtonColor: '#d33'
          }).then((result) => {
            if (result.isConfirmed) {
                localStorage.removeItem('token');
                setToken('');
                window.location.href = '/';
            } else if (result.isDenied) {
              return
            }
          });
    }

    return (
        <nav className={`h-28 z-30 flex items-center w-full justify-between px-8 md:px-16 sticky top-0 ${className}`}>
            <div className='flex items-center'>
                <img src={Logo} alt="Logo PPM" className='w-16 mr-3' />
                <div>
                    <p className='text-themeYellow font-bold text-xl md:text-2xl text-outline'>SI ELIT</p>
                    <p className='text-sm md:text-base'>Pondok Pesantren Bina Khoirul Insan</p>
                </div>
            </div>
            <RxHamburgerMenu fontSize="28px" className={`xl:hidden ml-8`} onClick={() => { setIsExpanded(prev => !prev) }} />
            <div className='hidden xl:flex w-4/12 min-w-[800px] text-xl justify-between items-center'>
                <Link to='/santri/beranda' className={`cursor-pointer ${!(['riwayatPresensi', 'jadwalKelas', 'formPerizinan', 'editProfil'].includes(location.pathname.split('/')[2])) ? 'font-bold' : ''}`}>Beranda</Link>
                <Link to='/santri/riwayatPresensi' className={`cursor-pointer ${location.pathname.split('/')[2] == 'riwayatPresensi' ? 'font-bold' : ''}`}>Riwayat Presensi</Link>
                <Link to='/santri/jadwalKelas' className={`cursor-pointer ${location.pathname.split('/')[2] == 'jadwalKelas' ? 'font-bold' : ''}`}>Jadwal Kelas</Link>
                <Link to='/santri/formPerizinan' className={`cursor-pointer ${location.pathname.split('/')[2] == 'formPerizinan' ? 'font-bold' : ''}`}>Form Perizinan</Link>
                <Link to='/santri/editProfil' className={`cursor-pointer ${location.pathname.split('/')[2] == 'editProfil' ? 'font-bold' : ''}`}>Edit Profil</Link>
                <BiLogOut className='cursor-pointer' fontSize="28px" onClick={logout}/>
            </div>
            <div className={`${isExpanded ? 'flex' : 'hidden'} text-base justify-between bg-white px-12 py-8 flex-col gap-8 absolute top-24 right-8 shadow-lg rounded-md`}>
                <Link to='/santri/beranda' className={`cursor-pointer ${!(['riwayatPresensi', 'jadwalKelas', 'formPerizinan', 'editProfil'].includes(location.pathname.split('/')[2])) ? 'font-bold' : ''}`}>Beranda</Link>
                <Link to='/santri/riwayatPresensi' className={`cursor-pointer ${location.pathname.split('/')[2] == 'riwayatPresensi' ? 'font-bold' : ''}`}>Riwayat Presensi</Link>
                <Link to='/santri/jadwalKelas' className={`cursor-pointer ${location.pathname.split('/')[2] == 'jadwalKelas' ? 'font-bold' : ''}`}>Jadwal Kelas</Link>
                <Link to='/santri/formPerizinan' className={`cursor-pointer ${location.pathname.split('/')[2] == 'formPerizinan' ? 'font-bold' : ''}`}>Form Perizinan</Link>
                <Link to='/santri/editProfil' className={`cursor-pointer ${location.pathname.split('/')[2] == 'editProfil' ? 'font-bold' : ''}`}>Edit Profil</Link>
                <div className={`cursor-pointer`} onClick={logout}>logout</div>
            </div>

        </nav>
    );
}

export default Navbar;