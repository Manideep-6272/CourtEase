import React from 'react'
import Hero from './Hero'
import Search from './Search'
import Upcoming from './Upcoming'
function Homepage() {
    return (
        <div>
            <Hero />
            <Search />
            <div className='dashboard-section mx-auto'>
                <Upcoming />
            </div>
        </div>
    )
}
export default Homepage;