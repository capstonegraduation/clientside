import React from 'react'
import './account.css'
import Homepage from '../components/Homepage'
import Image from '../assets/default-profile-picture1.jpg'
import { Link } from 'react-router-dom'
import axios from 'axios'
import {useState, useEffect } from 'react'



const Account = () => {
  const [post, setPost] = useState([]);
  const [picture, setProfile] = React.useState([]);
  const data = localStorage.getItem('ApplicantNum');
  const value = JSON.parse(data);
  const baseURL = `http://localhost:3006/api/v1/personalinfo/PA/${value.ApplicantID}`;
  
  useEffect(() => {
    axios.get(baseURL,
      {
        responseType: 'json',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        }
      }
      ).then((response) => {
      setPost(response.data); 
    });
  });

  useEffect(() => {
    axios.get(`http://localhost:3006/api/v1/userProf/getPROFILE/${value.ApplicantID}`,
      {
        responseType: 'json',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        }
      }
      ).then((response) => {
      setProfile(response.data.Profile);   
      
    });
  },[]);

  const profile = picture?.map((data) =>{
    return (
      <>
         <img src={data.profile} alt='' />
      </>
    );
  });
  return (
    <>

      <Homepage/>
      <div className='acard'>
    <div className='profile-card'>
        <div className="prof-pic">
          <div className='prof-img'>
              {profile}
              <div>
              <Link to='/ChangeProfile'className='changeprof'>Change Profile</Link>
              </div>
             
          </div>
          <div className='prof-det'>
            <div className='prof-email'>
              <p><strong>Email:</strong>{value.Email}</p>
            </div>
            <div className='prof-password'>
             <Link to='/ChangePassword'> <button>Change Password</button></Link>
            </div>
          </div>
        </div>
        <div className="prof-accs">
          <table>
          <tr>
            <th>Application Number</th>
            <td>{value.ApplicationNumber}</td>
            </tr>
            <tr>
            <th>Name</th>
            <td>{post.FirstName} {post.MiddleName} {post.LastName}</td>
            </tr>
            <tr>
            <th>Age</th>
            <td>{post.Age}</td>
            </tr>
            <tr>
            <th>Address</th>
            <td>{post.CurrentAddress}</td>
            </tr>
            <tr>
            <th>Contact Number</th>
            <td>{post.Contact}</td>
            </tr>
            <tr>
            <th>Status</th>
            <td>Pre-Approved</td>
            </tr>
          </table>
        </div>
    </div>
    </div>


    </>
  )
}

export default Account