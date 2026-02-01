import React, { useState, useEffect } from 'react'
import {
  MdDashboard,
  MdHome,
  MdInfo,
  MdImage,
  MdContactMail,
  MdViewCarousel,
} from 'react-icons/md'
import { FaStar, FaBlog } from 'react-icons/fa'
import { BsPeopleFill } from 'react-icons/bs'
import SignIn from 'views/signIn/signIn'
import SignUp from 'views/signIn/signUp'
import Dashboard from 'views/dashboard'
import Home from 'views/home'
import About from 'views/about'
import Celebrities from 'views/celebrities'
import Gallery from 'views/gallery'
import Testimonials from 'views/testimonials'
import Blog from 'views/blog'
import Contact from 'views/contact'
import HeroSections from 'views/hero-sections'

import { getEncryptedCookie } from 'common/utils/cookieUtils'

const RoutesComponent = () => {
  const [routes, setRoutes] = useState([])

  useEffect(() => {
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
      // {
      //   name: 'Dashboard',
      //   path: 'dashboard',
      //   layout: '/afterLogin',
      //   icon: <MdDashboard className="h-6 w-6" />,
      //   component: <Dashboard />,
      //   isComing: false,
      //   isVisible: isSuperAdmin,
      // },
      {
        name: 'Home',
        path: '',
        layout: '/afterLogin',
        icon: <MdHome className="h-6 w-6" />,
        component: <Home />,
        isComing: false,
        isVisible: true,
      },
      {
        name: 'About',
        path: 'about',
        layout: '/afterLogin',
        icon: <MdInfo className="h-6 w-6" />,
        component: <About />,
        isComing: false,
        isVisible: true,
      },
      {
        name: 'Celebrities',
        path: 'celebrities',
        layout: '/afterLogin',
        icon: <BsPeopleFill className="h-6 w-6" />,
        component: <Celebrities />,
        isComing: false,
        isVisible: true,
      },
      {
        name: 'Gallery',
        path: 'gallery',
        layout: '/afterLogin',
        icon: <MdImage className="h-6 w-6" />,
        component: <Gallery />,
        isComing: false,
        isVisible: true,
      },
      {
        name: 'Testimonials',
        path: 'testimonials',
        layout: '/afterLogin',
        icon: <FaStar className="h-6 w-6" />,
        component: <Testimonials />,
        isComing: false,
        isVisible: true,
      },
      {
        name: 'Blog',
        path: 'blog',
        layout: '/afterLogin',
        icon: <FaBlog className="h-6 w-6" />,
        component: <Blog />,
        isComing: false,
        isVisible: true,
      },
      {
        name: 'Contact',
        path: 'contact',
        layout: '/afterLogin',
        icon: <MdContactMail className="h-6 w-6" />,
        component: <Contact />,
        isComing: false,
        isVisible: true,
      },
      {
        name: 'Hero Sections',
        path: 'hero-sections',
        layout: '/afterLogin',
        icon: <MdViewCarousel className="h-6 w-6" />,
        component: <HeroSections />,
        isComing: false,
        isVisible: true,
      },
    ])
  }, [])

  return routes
}

export default RoutesComponent
