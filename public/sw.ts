// https://nextjs.org/docs/app/building-your-application/configuring/progressive-web-apps#5-creating-a-service-worker
// this file only exists to override the old service worker from create-react-app

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then((registrations) => {
    for (const registration of registrations) {
      registration.unregister()
    }
  })
}
