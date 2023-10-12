import { useState, useEffect } from 'react'
import Landing from './pages/landing/Index'
import Student from './pages/student/Index'
import Teacher from './pages/teacher/Index'
import Admin from './pages/admin/Index'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import Faq from './pages/landing/FAQ'
import Beranda from './pages/landing/Beranda'
import JadwalKelas from './pages/landing/JadwalKelas'
import About from './pages/landing/About'
import Login from './pages/landing/Login'

import StudentBeranda from './pages/student/Beranda'
import StudentJadwalKelas from './pages/student/JadwalKelas'
import StudentRiwayatPresensi from './pages/student/RiwayatPresensi'
import StudentFormPerizinan from './pages/student/FormPerizinan'
import StudentEditProfil from './pages/student/EditProfil'

import Loading from './components/Loading'
import { AppContext } from './AppContext'
import RouteChanger from './components/RouteChanger'


function App() {
	const [token, setToken] = useState(localStorage.getItem('token') || '');
	const [isLoading, setIsLoading] = useState(false);

	return (
		<AppContext.Provider value={{
			token: { data: token, set: setToken },
			loading: { data: isLoading, set: setIsLoading }
		}}>
			{isLoading === true ? <Loading /> : <></>}
			<Router>
				<RouteChanger token={token} />
				<Routes>
					<Route path='/' element={< Landing />}>
						<Route index element={<Beranda />}></Route>
						<Route path='beranda' element={<Beranda />}></Route>
						<Route path='faq' element={<Faq />}></Route>
						<Route path='jadwalKelas' element={<JadwalKelas />}></Route>
						<Route path='login' element={<Login />}></Route>
						<Route path='about' element={<About />}></Route>
					</Route>
					<Route path='/santri' element={< Student />}>
						<Route index element={<StudentBeranda />}></Route>
						<Route path='beranda' element={<StudentBeranda />}></Route>
						<Route path='riwayatPresensi' element={<StudentRiwayatPresensi />}></Route>
						<Route path='jadwalKelas' element={<StudentJadwalKelas />}></Route>
						<Route path='formPerizinan' element={<StudentFormPerizinan />}></Route>
						<Route path='editProfil' element={<StudentEditProfil />}></Route>
					</Route>
					<Route path='/guru' element={< Teacher />}></Route>
					<Route path='/admin' element={< Admin />}></Route>
				</Routes>
			</Router>
		</AppContext.Provider>
	)
}

export default App
