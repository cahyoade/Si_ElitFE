import axios from "axios";
import { useState, useEffect, useContext } from "react";
import appSettings from "../../Appsettings";
import { AppContext } from "../../AppContext";
import TextInput from "../../components/TextInput";
import { toast } from "react-toastify";
import { userContext } from "./Index";
import SelectInput from "../../components/SelectInput";
import { useNavigate } from "react-router-dom";
import { BiSolidTrash } from "react-icons/bi";
import { BsCheckCircle } from "react-icons/bs";
import Swal from "sweetalert2";
import DateInput from "../../components/DateInput";

function BypassPresensi() {
    const [attendances, setAttendances] = useState<any[]>([]);
    const [classes, setClasses] = useState<any[]>([]);
    const [selectedClassId, setSelectedClassId] = useState<any>(0);
    const [search, setSearch] = useState<string>('');
    const [permitSearch, setPermitSearch] = useState<any>({ string: '', startDate: '', endDate: '' });
    const [permits, setPermits] = useState<any[]>([]);
    const token = useContext(AppContext).token.data;
    const setToken = useContext(AppContext).token.set;
    const navigate = useNavigate();

    
    const userData = useContext(userContext);

    const namaHari = ['minggu', 'senin', 'selasa', 'rabu', 'kamis', 'jumat', 'sabtu'];


    useEffect(() => {
        getClasses();
        getAttendances();
        getPermits();
    }, []);

    useEffect(() => {
        getAttendances();
    }, [selectedClassId]);

    function handleAttendanceSearch(e: any) {
        setSearch(e.target.value);
    }

    function checkAttendanceSearch(attendance: any) {
        let searchString = attendance.name + attendance.nis + attendance.class_name + attendance.grade + attendance.status;

        if (attendance.gender) {
            searchString += 'Laki-laki';
        } else {
            searchString += 'Perempuan';
        }

        try {
            const re = new RegExp(search.replace(/\\*/, ''), 'i');
            return re.exec(searchString);
        } catch {
            const re = new RegExp('zzzzzzz', 'i');
            return re.exec(searchString);
        }
    }

    function getClasses() {
        axios.get(`${appSettings.api}/classes?managerId=${userData.id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).then(res => {
            const classes = res.data.map((classData: any) => {
                const startDate = new Date(classData.start_date);
                const endDate = new Date(classData.end_date);
                return {
                    value: classData.id,
                    label: `${classData.name} - ${namaHari[startDate.getDay()]} ${startDate.getHours() > 13 ? startDate.getHours() > 18 ? 'malam' : 'sore' : 'pagi'}, ${startDate.toLocaleString('id').replace(/\//g, '-').replace(',', '').split(' ')[0]} (${startDate.toLocaleTimeString('id')} s/d ${endDate.toLocaleTimeString('id')})`
                }
            });
            if (classes.length === 0) {
                navigate('/santri');
            }
            setClasses(classes);
        }).catch(err => {
            if (err.response.status === 401) {
                localStorage.setItem('token', '');
                setToken('');
                toast.info('Token expired, please login again', { theme: "colored", toastId: 'expired' });
            } else {
                toast.error(err, { theme: "colored" })
            }
        })
    }

    function getAttendances() {
        axios.get(`${appSettings.api}/attendances?classId=${selectedClassId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).then(res => {

            setAttendances(res.data);
        }).catch(err => {
            if (err.response.status === 401) {
                localStorage.setItem('token', '');
                setToken('');
                toast.info('Token expired, please login again', { theme: "colored", toastId: 'expired' });
            } else {
                toast.error(err, { theme: "colored" })
            }
        })
    }

    function updateAttendance(user_id: number, class_id: number, status: 'hadir' | 'izin' | null) {
        axios.put(`${appSettings.api}/attendances`, {
            user_id: user_id,
            class_id: class_id,
            status: status,
            attend_at: (new Date()).toISOString()
        }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).then(res => {
            getAttendances();
        })
    }

    function handlePermitSearch(e: any) {
        setPermitSearch(prev => ({ ...prev, [e.target.name]: e.target.value }));
    }

    function checkPermitSearch(permit: any) {
        let searchString = permit.name + permit.nis + permit.class_name + permit.description;

        try {
            const re = new RegExp(permitSearch.string.replace(/\\*/, ''), 'i');
            return re.exec(searchString);
        } catch {
            const re = new RegExp('zzzzzzz', 'i');
            return re.exec(searchString);
        }
    }

    function getPermits() {
        axios.get(`${appSettings.api}/permits?startDate=${permitSearch.startDate}&endDate=${permitSearch.endDate}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).then(res => {
            setPermits(res.data);
        }).catch(err => {
            if (err.response.status === 401) {
                localStorage.setItem('token', '');
                setToken('');
                toast.info('Token expired, please login again', { theme: "colored", toastId: 'expired' });
            } else {
                toast.error(err, { theme: "colored" })
            }
        })
    }

    function approvePermit(permit) {
        Swal.fire({
            title: 'Apakan anda yakin ingin menyetujui izin?',
            showCancelButton: true,
            confirmButtonText: 'Ya',
            confirmButtonColor: '#d33'
        }).then((result) => {
            if (result.isConfirmed) {
                axios.put(`${appSettings.api}/permits`, {...permit, isApproved: 1}, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }).then(res => {
                    toast.success(res.data.msg, { theme: "colored" });
                    getPermits();
                })
            } else if (result.isDenied) {
                return
            }
        });
        
    }

    function deletePermit(user_id: number, class_id: number) {
        Swal.fire({
            title: 'Apakan anda yakin ingin menghapus data?',
            showCancelButton: true,
            confirmButtonText: 'Ya',
            confirmButtonColor: '#d33'
        }).then((result) => {
            if (result.isConfirmed) {
                axios.delete(`${appSettings.api}/permits?userId=${user_id}&classId=${class_id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }).then(res => {
                    getPermits();
                })
            } else if (result.isDenied) {
                return
            }
        });
    }




    return (
        <>
        <div className="min-h-[100svh] flex flex-col items-center justify-start grow px-12">
            <p className="font-bold text-xl md:text-3xl mb-16">Bypass <span className="text-themeTeal">Presensi</span></p>
            <div className="w-full flex justify-between mb-4">
                <TextInput name="search" title="🔎 masukkan kata kunci" errorMsg="" onChange={handleAttendanceSearch} className="w-full max-w-md" inputClassName="bg-white" value={search} />
                <SelectInput name="class" title="Pilih kelas" errorMsg="" onChange={(e: any) => { setSelectedClassId(e.target.value); getAttendances() }} className="w-full ml-4" value={selectedClassId} values={classes} />
            </div>
            <div className="rounded-lg overflow-x-hidden overflow-y-scroll max-h-[700px] no-scrollbar mb-24 w-full">
                <table className="w-full h-12 text-center">
                    <thead className="bg-themeTeal text-white sticky top-0 text-sm">
                        <tr>
                            <th className="pl-6 py-2">No</th>
                            <th className="pl-6 py-2">NIS</th>
                            <th className="pl-6 py-2">Nama</th>
                            <th className="pl-6 py-2">Kelas</th>
                            <th className="pl-6 py-2">Tanggal</th>
                            <th className="pl-6 py-2">Keterangan</th>
                            <th className="px-6 py-2">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm">
                        {
                            attendances.map((attendance: any, index) => {
                                const startDate = new Date(attendance.start_date);

                                return (
                                    checkAttendanceSearch(attendance) &&
                                    <tr className="even:bg-slate-200 odd:bg-white" key={index}>
                                        <td className="pl-6 py-2">{index + 1}</td>
                                        <td className="pl-6 py-2">{attendance.nis}</td>
                                        <td className="pl-6 py-2">{attendance.name.length > 24 ? attendance.name.substring(0, 24) + '...' : attendance.name}</td>
                                        <td className="pl-6 py-2">{attendance.class_name.length > 20 ? attendance.class_name.substring(0, 20) + '...' : attendance.class_name}</td>
                                        <td className="pl-6 py-2">{startDate.toLocaleString('id')}</td>
                                        <td>{attendance.status ? attendance.status : 'Not set'}</td>
                                        <td className="px-6 py-2 flex flex-wrap gap-2 items-center">
                                            <button className="bg-themeTeal text-white px-2 py-1 rounded" onClick={() => {
                                                updateAttendance(attendance.user_id, attendance.class_id, 'hadir');
                                            }}>
                                                hadir
                                            </button>
                                            <button className="bg-themeOrange text-white px-2 py-1 rounded" onClick={() => {
                                                updateAttendance(attendance.user_id, attendance.class_id, 'izin')
                                            }}>
                                                izin
                                            </button>
                                            <button className="bg-[#d9d9d9] px-2 py-1 rounded" onClick={() => {
                                                updateAttendance(attendance.user_id, attendance.class_id, null)
                                            }}>
                                                reset
                                            </button>
                                        </td>
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </table>
            </div>
        </div>

        <div className="min-h-[100svh] flex flex-col items-center justify-start py-16 grow px-12 w-full px-32">
            <p className="font-bold text-xl md:text-3xl mb-16">Data <span className="text-themeTeal">Perizinan</span></p>
            <div className="w-full flex justify-between mb-4">
                <TextInput name="string" title="🔎 masukkan kata kunci" errorMsg="" onChange={handlePermitSearch} className="w-full max-w-md" inputClassName="bg-white" value={permitSearch.string} />
                <DateInput name="startDate" title="dari" errorMsg="" onChange={handlePermitSearch} className="" inputClassName="bg-white" value={permitSearch.startDate} />
                <DateInput name="endDate" title="sampai" errorMsg="" onChange={handlePermitSearch} className="" inputClassName="bg-white" value={permitSearch.endDate} />
                <button className="bg-themeTeal text-white text-sm font-semibold px-4 py-2 mt-3 h-fit rounded" onClick={getPermits}>Terapkan filter</button>
            </div>
            <div className="rounded-lg overflow-x-hidden overflow-y-scroll max-h-[700px] no-scrollbar mb-24 w-full">
                <table className="w-full h-12 text-center">
                    <thead className="bg-themeTeal text-white sticky top-0 text-sm">
                        <tr>
                            <th className="pl-6 py-2">No</th>
                            <th className="py-2">NIS</th>
                            <th className="py-2">Nama</th>
                            <th className="py-2">Kelas</th>
                            <th className="py-2">Pengajian</th>
                            <th className="py-2">Tanggal</th>
                            <th className="py-2">Alasan</th>
                            <th className="py-2">Bukti</th>
                            <th className="py-2">Status</th>
                            <th className="pr-6 py-2">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm">
                        {
                            permits.map((permit: any, index) => {
                                const startDate = new Date(permit.start_date);
                                return (
                                    checkPermitSearch(permit) &&
                                    <tr className="even:bg-slate-200 odd:bg-white" key={index}>
                                        <td className="pl-6 py-2">{index + 1}</td>
                                        <td className="py-2">{permit.nis}</td>
                                        <td className="py-2">{permit.name.length > 24 ? permit.name.substring(0, 24) + '...' : permit.name}</td>
                                        <td className="py-2">{permit.class_type}</td>
                                        <td className="py-2">{startDate.getHours() > 13 ? startDate.getHours() > 18 ? 'Malam' : 'Sore' : 'Pagi'}</td>
                                        <td className="py-2">{startDate.toLocaleString('id').replace(/\//g, '-').replace(',', '')}</td>
                                        <td>{permit.description}</td>
                                        <td>
                                            <a href={`${appSettings.api}${permit.img_url}`} target="_blank" rel="noreferrer noopener">
                                            <button className="bg-themeTeal text-white px-2 py-1 rounded">
                                                Lihat bukti
                                            </button>
                                            </a>
                                        </td>
                                        <td className={`${permit.is_approved ? 'text-themeTeal' : 'text-themeRed'} font-semibold`}>{permit.is_approved ? 'Disetujui' : 'Belum disetujui'}</td>
                                        <td className="pr-6 py-2 flex flex-wrap gap-2 items-center justify-center">
                                            {!permit.is_approved && <button className="bg-themeTeal text-white px-2 py-1 rounded" onClick={() => {
                                                approvePermit(permit)
                                            }}>
                                                <BsCheckCircle />
                                            </button>}
                                            <button className="bg-themeRed text-white px-2 py-1 rounded" onClick={() => {
                                                deletePermit(permit.user_id, permit.class_id)
                                            }}>
                                                <BiSolidTrash />
                                            </button>
                                        </td>
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </table>
            </div>
        </div>
        </>
    );
}

export default BypassPresensi;