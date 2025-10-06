import React, { useState, useEffect } from 'react'
import { MdOutlineFolderOpen } from 'react-icons/md'
import SignIn from 'views/signIn/signIn'
import SignUp from 'views/signIn/signUp'
import { FiTrash2 } from 'react-icons/fi'
import { useParams } from 'react-router-dom'
import { FaYoutube } from 'react-icons/fa'
import { ChartNoAxesCombined } from 'lucide-react'
import Dashboard from '../src/assets/svg/dashboard.svg'
import { FaFolderOpen } from 'react-icons/fa'
import { FaUsers } from 'react-icons/fa'
import Organisations from 'views/organisations'
const RoutesComponent = () => {
  const { id } = useParams()
  const [projectName, setProjectName] = useState()
  const [serviceName, setServiceName] = useState()
  const [routes, setRoutes] = useState([])

  useEffect(() => {
    const storedProjectName = localStorage.getItem('projectName')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localStorage.getItem('projectName')])

  useEffect(() => {
    setRoutes([
      {
        name: 'Sign In',
        path: 'sign-in',
        layout: '/afterLogin',
        icon: <img src={Dashboard} alt="Dashboard Icon" className="h-6 w-6" />,
        component: <SignIn />,
        isComing: false,
        isVisible: false,
      },
      {
        name: 'Sign Up',
        path: 'sign-up',
        layout: '/afterLogin',
        icon: <img src={Dashboard} alt="Dashboard Icon" className="h-6 w-6" />,
        component: <SignUp />,
        isComing: false,
        isVisible: false,
      },
      {
        name: 'Organisations',
        path: 'organisations',
        layout: '/afterLogin',
        icon: <FaUsers className="h-6 w-6" />,
        component: <Organisations />,
        isComing: false,
        isVisible: true,
      },
    ])
  }, [])

  return routes
}

export default RoutesComponent
