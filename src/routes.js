import React, { useState, useEffect } from 'react'
import { MdOutlineFolderOpen, MdMovie, MdDashboard } from 'react-icons/md'
import SignIn from 'views/signIn/signIn'
import SignUp from 'views/signIn/signUp'
import { FiTrash2 } from 'react-icons/fi'
import { IoMdPricetags } from 'react-icons/io'
import Logs from 'views/logs'
import { useParams } from 'react-router-dom'
import { NotepadText } from 'lucide-react'

import { FaYoutube, FaCog, FaGlobe } from 'react-icons/fa'
import { ChartNoAxesCombined } from 'lucide-react'
import { FaFolderOpen } from 'react-icons/fa'
import { FaUsers } from 'react-icons/fa'
import Dashboard from 'views/dashboard'
import Organizations from 'views/organizations'
import OrganizationDetail from 'views/organizations/OrganizationDetail'
import ProjectWorkflow from 'views/projectWorkflow'
import Config from 'views/config'
import DomainBlock from 'views/domainblock'
import Pricing from 'views/pricing'
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
        icon: <MdDashboard className="h-6 w-6" />,
        component: <SignIn />,
        isComing: false,
        isVisible: false,
      },
      {
        name: 'Sign Up',
        path: 'sign-up',
        layout: '/afterLogin',
        icon: <MdDashboard className="h-6 w-6" />,
        component: <SignUp />,
        isComing: false,
        isVisible: false,
      },
      {
        name: 'Dashboard',
        path: '',
        layout: '/afterLogin',
        icon: <MdDashboard className="h-6 w-6" />,
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
        name: 'Workflow',
        path: 'workflow',
        layout: '/afterLogin',
        icon: <FaFolderOpen className="h-6 w-6" />,
        component: <ProjectWorkflow />,
        isComing: false,
        isVisible: isSuperAdmin, // Only visible to superadmin
      },
      {
        name: 'Domain',
        path: 'domain',
        layout: '/afterLogin',
        icon: <FaGlobe className="h-6 w-6" />,
        component: <DomainBlock />,
        isComing: false,
        isVisible: isSuperAdmin, // Only visible to superadmin
      },
      {
        name: 'Config',
        path: 'config',
        layout: '/afterLogin',
        icon: <FaCog className="h-6 w-6" />,
        component: <Config />,
        isComing: false,
        isVisible: isSuperAdmin, // Only visible to superadmin
      },
      {
        name: 'Pricing',
        path: 'pricing',
        layout: '/afterLogin',
        icon: <IoMdPricetags className="h-6 w-6" />,
        component: <Pricing />,
        isComing: false,
        isVisible: isSuperAdmin, // Only visible to superadmin
      },
      {
        name: 'Logs',
        path: 'logs',
        layout: '/afterLogin',
        icon: <NotepadText className="h-6 w-6" />,
        component: <Logs />,
        isComing: false,
        isVisible: isSuperAdmin, // Only visible to superadmin
      },
    ])
  }, [])

  return routes
}

export default RoutesComponent
