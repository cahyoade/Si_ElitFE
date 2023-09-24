import Logo from '../assets/logo.png'

type NavbarProps = {
    className?: string
}


function Navbar({className}: NavbarProps) {

    return (
        <nav className={`h-28 z-30 flex items-center justify-between px-16 sticky top-0 ${className}`}>
            <div className='flex items-center'>
                <img src={Logo} alt="Logo PPM" className='w-16 mr-3'/>
                <div>
                    <p className='text-themeYellow font-bold text-2xl text-outline'>SI ELIT</p>
                    <p className='text-base'>Pondok Pesantren Bina Khoirul Insan</p>
                </div>
            </div>
            <div className='flex w-3/12 min-w-[460px] text-xl justify-between'>
                <a href='/landing/beranda' className={`cursor-pointer ${!(['faq', 'jadwalKelas', 'login'].includes(window.location.pathname.split('/')[2])) ? 'font-bold' : ''}`}>Beranda</a>
                <a href='/landing/jadwalKelas' className={`cursor-pointer ${window.location.pathname.split('/')[2] == 'jadwalKelas' ? 'font-bold' : ''}`}>Jadwal Kelas</a>
                <a href='/landing/faq' className={`cursor-pointer ${window.location.pathname.split('/')[2] == 'faq' ? 'font-bold' : ''}`}>FAQ</a>
                <a href='/landing/login' className={`cursor-pointer ${window.location.pathname.split('/')[2] == 'login' ? 'font-bold' : ''}`}>login</a>
            </div>
        </nav>
    );
}

export default Navbar;