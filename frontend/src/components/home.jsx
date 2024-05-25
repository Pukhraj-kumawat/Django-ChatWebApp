import React, { useEffect, useState } from 'react';
import { useLocation,useNavigate } from 'react-router-dom';
import axios from 'axios'
import { useQuery } from '@apollo/client';
import { GET_CHAT_MESSAGES,GET_ALL_USERS } from '../graphQL/queries';
import ListUsers from './listUsers';



const Home = (props) => {

  const [userId,setUserId] = useState(null)
  const [jwt_token,setJwt_token] = useState(null)
  const [chatUserId,setChatUserId] = useState(undefined)
  



  const location = useLocation();
  useEffect(() => {
    if (location.state && location.state.jwtToken) {
      const jwtToken = location.state.jwtToken;
      setJwt_token(jwtToken)

    }
  }, [location.state]);
  
  useEffect(() => {
    if (props.jwtToken) {
      setJwt_token(props.jwtToken);
    }
  }, [props.jwtToken]);

  useEffect(() => {
    const getHomePage = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/home', {
          headers: {
            Authorization: `Bearer ${jwt_token}`,
          },
        });

        setUserId(response.data.id);
        
      } catch (error) {
        if(error.response && error.response.status === 401){
          console.log('jwt expired');
          localStorage.removeItem('jwt_token');
          const navigate = useNavigate()
          navigate('/');
          window.location.reload();
        }
      }
    };

    if (jwt_token) {
      getHomePage();
    }
  }, [jwt_token]); 



  const { loading:loadingChatMessage, error:errorChatMessage, data:dataChatMessage } = useQuery(GET_CHAT_MESSAGES,{
    variables:{
      yourUserId:Number(userId),
      chatUserId:Number(chatUserId)
    },
    skip: !chatUserId    
  });
  // if (loadingChatMessage) return <div>Loading...</div>;
  // if (errorChatMessage) {
  //   return <div>Error loading data</div>;
  // }
  if(dataChatMessage){
    console.log(dataChatMessage);
  }

  



  const {loading:loadingAllUsers,error:errorAllUsers,data:dataAllUsers} = useQuery(GET_ALL_USERS)
  if (loadingAllUsers) return <div>Loading...</div>;
  if (errorAllUsers) {
    return <div>Error loading data</div>;
  }

  return <ListUsers users={dataAllUsers.allUsers} setChatUserId = {setChatUserId} />
  
}

export default Home