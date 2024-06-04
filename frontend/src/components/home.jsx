import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import ListUsers from "./listUsers";
import { VscAccount } from "react-icons/vsc";

const Home = (props) => {
  const randomNumber = Math.random();

  const [userId, setUserId] = useState(null);
  const [jwt_token, setJwt_token] = useState(null);

  const [socket, setSocket] = useState(null);

  const location = useLocation();

  useEffect(() => {
    if (location.state && location.state.jwtToken) {
      const jwtToken = location.state.jwtToken;
      setJwt_token(jwtToken);
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
        const response = await axios.get("http://127.0.0.1:8000/home", {
          headers: {
            Authorization: `Bearer ${jwt_token}`,
          },
        });

        setUserId(response.data.id);
      } catch (error) {
        if (error.response && error.response.status === 401) {
          console.log("jwt expired");
          localStorage.removeItem("jwt_token");
          const navigate = useNavigate();
          navigate("/");
          window.location.reload();
        }
      }
    };

    if (jwt_token) {
      getHomePage();
    }
  }, [jwt_token]);

  return (
    <>
      <div className="relative h-screen">
        <ListUsers data={{ userId: userId }} />

        <div className="absolute top-5 right-10">
          <VscAccount size={33} />
        </div>
      </div>
    </>
  );
};

export default Home;
