import React from 'react'
import "../styles/Details.scss";
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import DownloadIcon from '@mui/icons-material/Download';
import BlockIcon from '@mui/icons-material/Block';
import { auth, db } from '../lib/Firebase';
import { useChatsStore } from '../lib/UserChatsStore';
import { useUserStore } from '../lib/UserStore';
import { toast } from 'react-toastify';
import { arrayRemove, arrayUnion, doc, updateDoc } from 'firebase/firestore';


const Details = () => {
  const {changeBlock, isReceiverBlocked, isCurrentUserBlocked, user, chatId} = useChatsStore();
  const {currentUser} = useUserStore();


  const handleBlock =async () => {
    if(!user) return;

    const userDocRef = doc(db, "users", currentUser.id)
    try {
      await updateDoc(userDocRef, {
        blocked: isReceiverBlocked ? arrayRemove(user.id) : arrayUnion(user.id)
      });
      changeBlock();
    } catch (error) {
      toast.error(error.message);
    }
  }
  return (
    <div className='detailsPart'>
      <div className="user">
        <img src={user?.avatar || "/assets/cw.jpg"} alt="" />
        <h2>{user?.username}</h2>
        <p>lorem dolor sit amet.</p>
      </div>
      <div className="info">
        <div className="option">
          <div className="title">
            <span>chat settings</span>
            <span className='btn'><ArrowDropUpIcon /></span>
          </div>
        </div>

        <div className="option">
          <div className="title">
            <span>privacy & help</span>
            <span className='btn'><ArrowDropUpIcon /></span>
          </div>
        </div>

        <div className="option">
          <div className="title">
            <span>shared photos</span>
            <span className='btn'><ArrowDropDownIcon /></span>
          </div>
          <div className="photos">
            <div className="photoItem">
              <div className="photoDetail">
                <img src="/assets/cw.jpg" alt="" />
                <span>photo_2024.jpg</span>
              </div>
              <button><DownloadIcon className='ico'/></button>
            </div>

            <div className="photoItem">
              <div className="photoDetail">
                <img src="/assets/cw.jpg" alt="" />
                <span>photo_2024.jpg</span>
              </div>
              <button><DownloadIcon /></button>
            </div>

            <div className="photoItem">
              <div className="photoDetail">
                <img src="/assets/cw.jpg" alt="" />
                <span>photo_2024.jpg</span>
              </div>
              <button><DownloadIcon /></button>
            </div>

          </div>
        </div>

        <div className="option">
          <div className="title">
            <span>shared files</span>
            <span className='btn'><ArrowDropUpIcon /></span>
          </div>
        </div>

        <button onChange={handleBlock} className='blockBtn'>
          {isCurrentUserBlocked ? "you are blocked" : isReceiverBlocked ? "user blocked" : "block user"}
        </button>
        <button className="logout" onClick={() => auth.signOut()}>logout</button>
      </div>
    </div>
  )
}

export default Details;