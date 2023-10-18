import { useEffect, useState, useContext } from "react";
import axios from "axios";
import appSettings from "../../Appsettings";
import { AppContext } from "../../AppContext";
import { toast } from 'react-toastify'
import DateInput from "../../components/DateInput";
import TextInput from "../../components/TextInput";
import { BiSolidTrash } from "react-icons/bi";
import { FiEdit } from "react-icons/fi";
import SelectInput from "../../components/SelectInput";
import { userContext } from "./Index";
import Swal from "sweetalert2";

function JadwalKelas() {
    const [classes, setClasses] = useState([]);
    const [students, setStudents] = useState([]);
    const [teachers, setTeachers] = useState([]);
    const [mode, setMode] = useState('' as 'form' | 'view');
    const [search, setSearch] = useState({ string: '', startDate: '', endDate: '' });
    const setToken = useContext(AppContext).token.set;
    const token = useContext(AppContext).token.data;
    const [kelas, setKelas] = useState<any>({
        id: '',
        name: '',
        start_date: '',
        end_date: '',
        location: '',
        manager_id: '',
        teacher_id: ''
    });

    const initialKelas = {
        id: '',
        name: '',
        start_date: '',
        end_date: '',
        location: '',
        manager_id: '',
        teacher_id: ''
    }


    const namaHari = ['minggu', 'senin', 'selasa', 'rabu', 'kamis', 'jumat', 'sabtu'];

    useEffect(() => {
        getUsers();
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

    function getUsers() {
        axios.get(`${appSettings.api}/users`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(res => {
                if (res.data.msg) {
                    toast.warn(res.data.msg);
                }
                else {
                    let students = [];
                    let teachers = [];
                    res.data.map((user: any) => {
                        if (user.role === 1) {
                            students.push({ value: user.id, label: user.name + ' - ' + user.nis });
                        }
                        if (user.role === 2) {
                            teachers.push({ value: user.id, label: user.name });
                        }
                    })
                    setStudents(students);
                    setTeachers(teachers);
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

    function handleSubmit(e: any) {
        e.preventDefault();
        if (validateClass() === false) return;
        axios.post(`${appSettings.api}/classes`, kelas, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(res => {
                if (res.data.msg === 'Class created.') {
                    toast.success(res.data.msg, { theme: 'colored' });
                    setKelas(initialKelas);
                    getClasses();
                    setMode('view');
                } else {
                    toast.warn(res.data.msg, { theme: 'colored' });
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

    function handleEdit(e: any) {
        e.preventDefault();
        if (validateClass() === false) return;
        axios.put(`${appSettings.api}/classes`, kelas, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(res => {
                if (res.data.msg === 'Class updated.') {
                    toast.success(res.data.msg, { theme: 'colored' });
                    setKelas(initialKelas);
                    getClasses();
                    setMode('view');
                } else {
                    toast.warn(res.data.msg, { theme: 'colored' });
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

    function deleteClass(id: string) {
        Swal.fire({
            title: 'Apakan anda yakin ingin menghapus kelas?',
            showCancelButton: true,
            confirmButtonText: 'Ya',
            confirmButtonColor: '#d33'
        }).then((result) => {
            if (result.isConfirmed) {
                axios.delete(`${appSettings.api}/classes?classId=${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                    .then(res => {
                        if (res.data.msg === 'Class deleted.') {
                            toast.success(res.data.msg, { theme: 'colored' });
                            setKelas(initialKelas);
                            getClasses();
                        } else {
                            toast.warn(res.data.msg, { theme: 'colored' });
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
            } else if (result.isDenied) {
                return
            }
        });
    }

    function handleSearch(e: any) {
        setSearch(prev => ({ ...prev, [e.target.name]: e.target.value }));
    }

    function toSqlDateTime(input: string) {
        const date = new Date(input);
        return date.getFullYear() + '-' +
            ('00' + (date.getMonth() + 1)).slice(-2) + '-' +
            ('00' + date.getDate()).slice(-2) + ' ' +
            ('00' + date.getHours()).slice(-2) + ':' +
            ('00' + date.getMinutes()).slice(-2) + ':' +
            ('00' + date.getSeconds()).slice(-2);
    }

    function validateClass() {
        let res = true;
        Object.keys(kelas).map((key) => {
            if (kelas[key] === '' && !key.endsWith('Err') && key !== 'id') {
                res = false;
                setKelas(prev => {
                    return { ...prev, [key + 'Err']: 'tidak boleh kosong' }
                })
            }
        })

        if(kelas.start_date > kelas.end_date){
            res = false;
            setKelas(prev => {
                return { ...prev, ['end_dateErr']: 'tidak boleh lebih awal dari waktu mulai' }
            })
        }

        if(!res){
            toast.warn('Mohon isi semua field yang ada', { theme: 'colored' });
        }

        return res;
    }


    function handleChange(e: any) {
        setKelas(prev => {
            return { ...prev, [e.target.name]: e.target.type == 'file' ? e.target.files[0] : e.target.value, [e.target.name + 'Err']: '' }
        })
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
        <div className="min-h-[100svh] flex flex-col items-center px-12 py-16 grow">
            <p className="font-bold text-xl md:text-3xl mb-16">{mode === 'form' ? kelas.id ? 'Edit' : 'Tambah' : ''} Jadwal <span className="text-themeTeal">Kelas</span></p>
            {
                mode === 'form' ?
                    <form className="w-full max-w-6xl bg-[#f6f6f6]/50 p-8 shadow-md flex flex-col rounded-xl mb-16" onSubmit={(e) => {
                        if (kelas.id) {
                            handleEdit(e);
                        }
                        else {
                            handleSubmit(e);
                        }
                    }}>
                        <TextInput name='name' value={kelas.name} title='Nama' errorMsg={kelas.nameErr} onChange={handleChange} inputClassName="bg-white" className="mb-8" />
                        <DateInput name='start_date' timeInput={true} value={kelas.start_date} title='Waktu Mulai' errorMsg={kelas.start_dateErr} onChange={handleChange} inputClassName="bg-white" className="mb-8" />
                        <DateInput name='end_date' timeInput={true} value={kelas.end_date} title='Waktu Selesai' errorMsg={kelas.end_dateErr} onChange={handleChange} inputClassName="bg-white" className="mb-8" />
                        <TextInput name='location' value={kelas.location} title='Lokasi' errorMsg={kelas.locationErr} onChange={handleChange} inputClassName="bg-white" className="mb-8" />
                        <SelectInput title='Pengurus' name='manager_id' value={kelas.manager_id} onChange={handleChange} errorMsg={kelas.manager_idErr} values={students} />
                        <SelectInput title='Guru' name='teacher_id' value={kelas.teacher_id} onChange={handleChange} errorMsg={kelas.teacher_idErr} values={teachers} />
                        <div className="self-end justify-between flex">
                            <button type="button" className="bg-[#d9d9d9] px-12 py-2 rounded mr-8 hover:scale-[1.03] font-semibold text-sm" onClick={() => {
                                setKelas(initialKelas);
                                setMode('view');
                            }}>Batal</button>
                            <button type='submit' className='bg-themeTeal text-white font-semibold text-sm px-12 py-2 rounded hover:scale-[1.03] transition-all duration-200'>Submit</button>
                        </div>
                    </form>
                    :
                    <>
                        <div className="w-full flex justify-between">
                            <div className="w-[400px]">
                                <TextInput name="string" title="🔎 masukkan kata kunci" errorMsg="" onChange={handleSearch} className="w-full max-w-md mb-4" inputClassName="bg-white" value={search.string} />
                                <div className="flex gap-4">
                                    <DateInput name="startDate" title="dari" errorMsg="" onChange={handleSearch} className="" inputClassName="bg-white" value={search.startDate} />
                                    <DateInput name="endDate" title="sampai" errorMsg="" onChange={handleSearch} className="" inputClassName="bg-white" value={search.endDate} />
                                    <button className="bg-themeTeal text-white text-sm font-semibold px-4 py-2 h-full rounded" onClick={getClasses}>Terapkan filter</button>
                                </div>
                            </div>
                            <button className="bg-themeTeal text-white text-sm font-semibold px-4 py-2 h-full rounded self-end mb-7" onClick={() => setMode('form')}>Tambah Data</button>
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
                                        <th className="pl-6 py-2">Waktu</th>
                                        <th className="px-6 py-2">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        classes.map((cl: any, index) => {
                                            const startDate = new Date(cl.start_date);
                                            const endDate = new Date(cl.end_date);
                                            return (
                                                checkSearch(cl) &&
                                                <tr className="even:bg-slate-200 odd:bg-white" key={index}>
                                                    <td className="pl-6 py-2">{index + 1}.</td>
                                                    <td className="pl-6 py-2">{cl.name}</td>
                                                    <td className="pl-6 py-2">{namaHari[startDate.getDay()]}, {startDate.toLocaleString('id').replace(/\//g, '-').replace(',', '').split(' ')[0]}</td>
                                                    <td className="pl-6 py-2">{startDate.getHours() > 13 ? startDate.getHours() > 18 ? 'Malam' : 'Sore' : 'Pagi'}</td>
                                                    <td className="pl-6 py-2">{cl.location}</td>
                                                    <td className="pl-6 py-2">{startDate.toLocaleTimeString('id')} s/d {endDate.toLocaleTimeString('id')}</td>
                                                    <td className="px-6 py-2">
                                                        <button className="bg-themeOrange text-white px-2 py-1 rounded mr-2" onClick={() => {
                                                            setKelas({ ...initialKelas, ...cl, start_date: toSqlDateTime(cl.start_date), end_date: toSqlDateTime(cl.end_date) });
                                                            setMode('form');
                                                        }}>
                                                            <FiEdit />
                                                        </button>
                                                        <button className="bg-themeRed text-white px-2 py-1 rounded" onClick={() => deleteClass(cl.id)}>
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
                    </>
            }


        </div>

    );
}

export default JadwalKelas;