import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios'



const Home = () => {

  const location = useLocation();

  const { data } = location.state || {};


  return (
    <>       
    <div>
      {data ? (data.id) : ('No data coming ')}
    </div>
    </>
  )
}

export default Home