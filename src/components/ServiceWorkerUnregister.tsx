'use client'

import { useEffect } from 'react'
import { unregister } from '../../public/serviceWorker'

const ServiceWorkerUnregister = () => {
  useEffect(() => {
    unregister()
  }, [])

  return null
}

export default ServiceWorkerUnregister
