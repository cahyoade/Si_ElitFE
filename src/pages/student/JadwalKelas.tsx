import { useEffect, useState, useContext } from "react";
import axios from "axios";
import appSettings from "../../Appsettings";
import { AppContext } from "../../AppContext";
import { ToastContainer, toast } from 'react-toastify'

function JadwalKelas() {
    const [upcomingClasses, setUpcomingClasses] = useState([]);
    const setToken = useContext(AppContext).token.set;

    const namaHari = ['minggu', 'senin', 'selasa', 'rabu', 'kamis', 'jumat', 'sabtu'];

    useEffect(() => {
        axios.get(`${appSettings.api}/classes/upcoming`)
            .then(res => {
                if (res.data.msg) {
                    toast.warn(res.data.msg);
                }
                else {
                    setUpcomingClasses(res.data)
                }
            })
            .catch(err => {
                if (err.response.status === 401) {
                    localStorage.setItem('token', '');
                    setToken('');
                    toast.info('Token expired, please login again', { theme: "colored", toastId: 'expired' });
                } else {
                    toast.error(err, { theme: "colored" })
                }
            })
    }, [])

    return (
        <div className="min-h-[100svh] flex flex-col items-center justify-start">

            <p className="font-bold text-xl md:text-3xl mb-16">Jadwal <span className="text-themeTeal">Kelas</span></p>
            <div className="rounded-lg overflow-x-hidden overflow-y-scroll max-h-96 no-scrollbar mb-24">
                <table className="w-full text-left h-12">
                    <thead className="bg-themeTeal text-white sticky top-0">
                        <tr>
                            <th className="pl-6 py-2">No.</th>
                            <th className="pl-6 py-2">Nama</th>
                            <th className="pl-6 py-2">Hari</th>
                            <th className="pl-6 py-2">Kelas</th>
                            <th className="pl-6 py-2">Ruangan</th>
                            <th className="px-6 py-2">Waktu</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            upcomingClasses.map((upcomingClass: any, index) => {
                                const startDate = new Date(upcomingClass.start_date);
                                const endDate = new Date(upcomingClass.end_date);

                                return (
                                    <tr className="even:bg-slate-200 odd:bg-white" key={index}>
                                        <td className="pl-6 py-2">{index + 1}.</td>
                                        <td className="pl-6 py-2">{upcomingClass.name}</td>
                                        <td className="pl-6 py-2">{namaHari[startDate.getDay()]}, {startDate.toLocaleString('id').replace(/\//g, '-').replace(',', '').split(' ')[0]}</td>
                                        <td className="pl-6 py-2">{startDate.getHours() > 13 ? startDate.getHours() > 18 ? 'Malam' : 'Sore' : 'Pagi'}</td>
                                        <td className="pl-6 py-2">{upcomingClass.location}</td>
                                        <td className="px-6 py-2">{startDate.toLocaleTimeString('id')} s/d {endDate.toLocaleTimeString('id')}</td>
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </table>
            </div>
        </div>

    );
}

export default JadwalKelas;