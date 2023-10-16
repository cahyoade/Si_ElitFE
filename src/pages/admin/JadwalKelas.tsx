import { useEffect, useState, useContext } from "react";
import axios from "axios";
import appSettings from "../../Appsettings";
import { AppContext } from "../../AppContext";
import { toast } from 'react-toastify'
import DateInput from "../../components/DateInput";
import TextInput from "../../components/TextInput";

function JadwalKelas() {
    const [classes, setClasses] = useState([]);
    const [search, setSearch] = useState({ string: '', startDate: '', endDate: '' });
    const setToken = useContext(AppContext).token.set;
    const token = useContext(AppContext).token.data;

    const namaHari = ['minggu', 'senin', 'selasa', 'rabu', 'kamis', 'jumat', 'sabtu'];

    useEffect(() => {
        getClasses();
    }, []);

    function getClasses() {
        axios.get(`${appSettings.api}/classes`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(res => {
                if (res.data.msg) {
                    toast.warn(res.data.msg);
                }
                else {
                    setClasses(res.data)
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
    }

    function handleSearch(e: any) {
        setSearch(prev => ({ ...prev, [e.target.name]: e.target.value }));
    }

    function checkSearch(permit: any) {
        let searchString = permit.name + permit.nis + permit.class_name + permit.description;

        try {
            const re = new RegExp(search.string.replace(/\\*/, ''), 'i');
            return re.exec(searchString);
        } catch {
            const re = new RegExp('zzzzzzz', 'i');
            return re.exec(searchString);
        }
    }

    return (
        <div className="min-h-[100svh] flex flex-col items-center px-20 py-16 grow">
            <p className="font-bold text-xl md:text-3xl mb-16">Jadwal <span className="text-themeTeal">Kelas</span></p>
            <div className="w-full flex justify-between mb-4">
                <TextInput name="string" title="🔎 masukkan kata kunci" errorMsg="" onChange={handleSearch} className="w-full max-w-md" inputClassName="bg-white" value={search.string} />
                <DateInput name="startDate" title="dari" errorMsg="" onChange={handleSearch} className="" inputClassName="bg-white" value={search.startDate} />
                <DateInput name="endDate" title="sampai" errorMsg="" onChange={handleSearch} className="" inputClassName="bg-white" value={search.endDate} />
                <button className="bg-themeTeal text-white text-sm font-semibold px-4 py-2 mt-3 h-fit rounded" onClick={getClasses}>Terapkan filter</button>
            </div>
            <div className="rounded-lg overflow-x-hidden overflow-y-scroll max-h-96 no-scrollbar mb-24 w-full">
                <table className="w-full h-12 text-sm text-center">
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
                            classes.map((upcomingClass: any, index) => {
                                const startDate = new Date(upcomingClass.start_date);
                                const endDate = new Date(upcomingClass.end_date);

                                return (

                                    <tr className="even:bg-slate-200 odd:bg-white" key={index}>
                                        <td className="pl-6 py-2">{index + 1}.</td>
                                        <td className="pl-6 py-2">{upcomingClass.name}</td>
                                        <td className="pl-6 py-2">{namaHari[startDate.getDay()]}, {startDate.toLocaleDateString('id')}</td>
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