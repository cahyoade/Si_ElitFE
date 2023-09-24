import Footer from "../../components/Footer";
import Navbar from "../../components/NavbarLanding";
import Hero from '../../assets/hero.png';

function Beranda() {

    return (
        <>
            <Navbar className="bg-themeTeal/20"/>
            <img src={Hero} alt="Tampak depan PPM" className="-translate-y-28 w-full object-cover -z-20 relative"/>
            <Footer />
        </>
    );
}

export default Beranda;