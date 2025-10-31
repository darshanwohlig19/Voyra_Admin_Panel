import React, { useState, useEffect } from 'react'
import { MdOutlineFolderOpen, MdMovie } from 'react-icons/md'
import SignIn from 'views/signIn/signIn'
import SignUp from 'views/signIn/signUp'
import { FiTrash2 } from 'react-icons/fi'
import { useParams } from 'react-router-dom'
import { FaYoutube } from 'react-icons/fa'
import { ChartNoAxesCombined } from 'lucide-react'
import DashboardIcon from '../src/assets/svg/dashboard.svg'
import { FaFolderOpen } from 'react-icons/fa'
import { FaUsers } from 'react-icons/fa'
import Dashboard from 'views/dashboard'
import Organizations from 'views/organizations'
import OrganizationDetail from 'views/organizations/OrganizationDetail'
import ShortType from 'views/shortType'
import Parameters from 'views/parameters'
import Projects from 'views/projects'
import { getEncryptedCookie } from 'common/utils/cookieUtils'

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
    // Get user role from encrypted cookie
    const userRole = getEncryptedCookie('userRole')
    const isSuperAdmin = userRole === 'superadmin'

    setRoutes([
      {
        name: 'Sign In',
        path: 'sign-in',
        layout: '/afterLogin',
        icon: (
          <img src={DashboardIcon} alt="Dashboard Icon" className="h-6 w-6" />
        ),
        component: <SignIn />,
        isComing: false,
        isVisible: false,
      },
      {
        name: 'Sign Up',
        path: 'sign-up',
        layout: '/afterLogin',
        icon: (
          <img src={DashboardIcon} alt="Dashboard Icon" className="h-6 w-6" />
        ),
        component: <SignUp />,
        isComing: false,
        isVisible: false,
      },
      {
        name: 'Dashboard',
        path: 'dashboard',
        layout: '/afterLogin',
        icon: (
          <img src={DashboardIcon} alt="Dashboard Icon" className="h-6 w-6" />
        ),
        component: <Dashboard />,
        isComing: false,
        isVisible: isSuperAdmin, // Only visible to superadmin
      },
      {
        name: 'Organizations',
        path: 'organizations',
        layout: '/afterLogin',
        icon: <FaUsers className="h-6 w-6" />,
        component: <Organizations />,
        isComing: false,
        isVisible: isSuperAdmin, // Only visible to superadmin
      },

      {
        name: 'Organization Details',
        path: 'organizations/:orgId',
        layout: '/afterLogin',
        icon: <FaUsers className="h-6 w-6" />,
        component: <OrganizationDetail />,
        isComing: false,
        isVisible: false,
      },
      {
        name: 'Projects',
        path: 'projects',
        layout: '/afterLogin',
        icon: <FaFolderOpen className="h-6 w-6" />,
        component: <Projects />,
        isComing: false,
        isVisible: true,
      },
      {
        name: 'Short Type',
        path: 'short-type',
        layout: '/afterLogin',
        icon: <MdMovie className="h-6 w-6" />,
        component: <ShortType />,
        isComing: false,
        isVisible: true,
      },
      {
        name: 'Parameters',
        path: 'parameters',
        layout: '/afterLogin',
        icon: <MdOutlineFolderOpen className="h-6 w-6" />,
        component: <Parameters />,
        isComing: false,
        isVisible: true,
      },
    ])
  }, [])

  return routes
}

export default RoutesComponent
