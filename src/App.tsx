import { useState } from 'react';
import Landing from './pages/landing/Index';
import Student from './pages/student/Index';
import Teacher from './pages/teacher/Index';
import Admin from './pages/admin/Index';

function App() {
  const [view, setView] = useState(window.location.pathname.split('/')[1] || 'landing');
  const [token, setToken] = useState('');

  return (
    <>
    {
      view == 'student' && token ? <Student /> : <></>
    }
    {
      view == 'teacher' && token ? <Teacher /> : <></>
    }
    {
      view == 'admin' && token ? <Admin /> : <></>
    }
    {
      !(['student', 'teacher', 'admin'].includes(view)) || !token ? <Landing /> : <></>
    }
    </>
  )
}

export default App
