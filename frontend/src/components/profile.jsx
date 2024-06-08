import React, { useEffect, useState, useRef } from "react";
import { VscAccount } from "react-icons/vsc";
import { GET_USER, UPDATE_PROFILE } from "../graphQL/queries";
import { useQuery, useMutation } from "@apollo/client";
import EditableInput from "./editableProfile";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";

const Profile = (props) => {
  const { userId } = props.data;
  const [profileToggle, setProfileToggle] = useState(false);
  const [profileClick, setProfileClick] = useState(false);
  const [isEditable, setIsEditable] = useState({
    name: false,
    email: false,
    mobile: false,
  });
  const [valueName, setValueName] = useState("");
  const [valueEmail, setValueEmail] = useState("");
  const [valueMobile, setValueMobile] = useState("");

  const [isProfileChange, setIsProfileChange] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const nameRef = useRef(null);
  const emailRef = useRef(null);
  const mobileRef = useRef(null);

  const [
    updateProfileMutate,
    {
      loading: loadingUpdateProfile,
      error: errorUpdateProfile,
      data: dataUpdatedProfile,
    },
  ] = useMutation(UPDATE_PROFILE);

  const handleProfileToggle = () => {
    setProfileToggle((prevToggle) => !prevToggle);
  };

  const logoutClick = ()=>{
    localStorage.removeItem("jwt_token");
    window.location.reload();
  }

  const handleOutsideClick = (event) => {
    if (!document.getElementById("profile-div").contains(event.target)) {
      setProfileToggle(false);
      setProfileClick(false);
    }
  };

  const handleProfileClick = (event) => {
    setProfileClick(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const namePattern = /^[a-zA-Z]+ [a-zA-Z]+$/;
    if (!namePattern.test(valueName)) {
      alert(
        'The first and last name should single space separated as "John dea"'
      );
      return;
    }
    const [firstName, lastName] = valueName.split(" ");

    // console.log(userId,firstName,lastName,valueMobile,valueEmail);

    try {
      const dataUpdatedProfile = await updateProfileMutate({
        variables: {
          userId: Number(userId),
          firstName: firstName,
          lastName: lastName,
          mobileNo: valueMobile,
          email: valueEmail,
        },
      });

      console.log("Profile updated sucessfull :", dataUpdatedProfile);
      setIsSubmitted(true);

      setTimeout(() => {
        setIsSubmitted(false);
        setIsProfileChange(false)
      }, 2000);
      
    } catch (error) {
      console.error("Error updating profile:", error);
      if (error.networkError && error.networkError.result) {
        console.error("Network error details:", error.networkError.result);
      }
    }
  };

  useEffect(() => {
    if (profileToggle) {
      document.addEventListener("click", handleOutsideClick);
    } else {
      document.removeEventListener("click", handleOutsideClick);
    }
    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, [profileToggle]);

  const {
    loading: loadingUser,
    error: errorUser,
    data: dataUser,
  } = useQuery(GET_USER, {
    variables: {
      userId: Number(userId),
    },
  });

  useEffect(() => {
    if (dataUser) {
      setValueName(`${dataUser.user.firstName} ${dataUser.user.lastName}`);
      setValueEmail(dataUser.user.email);
      setValueMobile(dataUser.user.mobileNo);
    }
  }, [dataUser]);

  if (loadingUser) return <div>Loading all users ...</div>;
  if (errorUser) return <div>Error in loading all users</div>;

  return (
    <>
      <div className="absolute top-5 right-10" id="profile-div">
        <div className="flex flex-raw justify-between items-center">
          <div className="mr-4">
            {profileToggle && (
              <>
                <div className="absolute right-0 mr-10 bg-white border rounded-lg shadow-lg">
                  <div className="flex flex-raw">
                    <div className="ml-2 mt-8 mr-2  w-[150px]">
                      <p
                        className={`text-gray-800 font-semibold cursor-pointer ${
                          profileClick ? "cursor-pointer" : "hover:underline"
                        }`}
                        onClick={handleProfileClick}
                      >
                        {dataUser.user.firstName} {dataUser.user.lastName}
                      </p>
                      <small className="text-gray-600">
                        {dataUser.user.username}
                      </small>
                    </div>
                    <div className=" mr-2 mt-2 mb-2">
                      <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200 ">
                        {/* <img src={imageUrl} alt="Profile" className="w-full h-full object-cover" /> */}
                      </div>
                    </div>
                  </div>

                  {isSubmitted && (
                    <div className="top-0 inset-x-0 bg-green-500 text-white py-2 px-4 shadow-md text-center">
                      <p>Profile has successfully updated!</p>
                    </div>
                  )}
                  {profileClick && profileToggle && (
                    <div className="bg-gray-100 flex items-center justify-center">
                      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                        <form onSubmit={handleSubmit}>
                          <EditableInput
                            label="Name"
                            type="text"
                            isEditable={isEditable}
                            setIsEditable={setIsEditable}
                            fieldRef={nameRef}
                            fieldName="name"
                            setState={setValueName}
                            value={valueName}
                            placeholder="e.g : John dea"
                            setIsProfileChange={setIsProfileChange}
                          />
                          <EditableInput
                            label="Email"
                            type="email"
                            isEditable={isEditable}
                            setIsEditable={setIsEditable}
                            fieldRef={emailRef}
                            fieldName="email"
                            setState={setValueEmail}
                            value={valueEmail}
                            placeholder="e.g : johndea@gmai.com"
                            setIsProfileChange={setIsProfileChange}
                          />
                          <EditableInput
                            label="Mobile Number"
                            type="tel"
                            isEditable={isEditable}
                            setIsEditable={setIsEditable}
                            fieldRef={mobileRef}
                            fieldName="mobile"
                            setState={setValueMobile}
                            value={valueMobile}
                            placeholder="e.g : 6376418758"
                            setIsProfileChange={setIsProfileChange}
                          />
                          <div className="text-center">
                            <button
                              type={isProfileChange ? "submit" : "button"}
                              className={`bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 ${!isProfileChange && "opacity-60" } `}
                            >
                              Save Changes
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  )}

                  <hr />

                  {!profileClick && (
                    <div className="py-2 px-4">
                      <button className="text-gray-800 hover:text-gray-900 ml-2" onClick={logoutClick}>
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          <div>
            <VscAccount
              size={33}
              onClick={handleProfileToggle}
              className="hover:opacity-50"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
