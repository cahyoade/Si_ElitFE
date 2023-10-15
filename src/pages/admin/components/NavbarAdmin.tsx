import Logo from '../../../assets/logo.png';

import { useContext, useState } from 'react';
import { BiLogOut } from 'react-icons/bi';
import { AppContext } from '../../../AppContext';
import Swal from 'sweetalert2'

type NavbarProps = {
    className?: string
}


function Navbar({ className }: NavbarProps) {
    const setToken = useContext(AppContext).token.set;


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
            <div className='flex w-4/12 min-w-[100px] text-xl justify-end items-center'>
                <BiLogOut className='cursor-pointer' fontSize="28px" onClick={logout}/>
            </div>
        </nav>
    );
}

export default Navbar;