import React from 'react';
import "../styles/Users.scss";
import EditIcon from '@mui/icons-material/Edit';
import DuoIcon from '@mui/icons-material/Duo';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { useUserStore } from '../lib/UserStore';

const Users = () => {
  const {currentUser} = useUserStore();
  return (
    <div className='usersPart'>
        <div className="user">
            <img src={currentUser?.avatar || "/assets/cw.jpg"} alt="" />
            <h2>{currentUser?.username}</h2>
        </div>
        <div className="icons">
            <MoreHorizIcon className='icon'/>
            <DuoIcon className='icon'/>
            <EditIcon className='icon'/>
        </div>
    </div>
  )
}

export default Users