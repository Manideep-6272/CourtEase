import React from 'react'
import Welcome from './Welcome';
import Stats from './Stats';
import Bookings from './Bookings';
function Homepage() {
  return (
    <div className="container mt-4">
      <Welcome />
      <Stats />
      <Bookings />
    </div>
  )
}
export default Homepage;