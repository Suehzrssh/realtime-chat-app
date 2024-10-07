import React, { useEffect, useState } from 'react';
import "../styles/ChatList.scss";
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import RemoveIcon from '@mui/icons-material/Remove';
import AddUser from './AddUser';
import { useUserStore } from '../lib/UserStore';
import { doc, getDoc, onSnapshot, updateDoc } from 'firebase/firestore';
import { db } from '../lib/Firebase';
import { useChatsStore } from '../lib/UserChatsStore';
import { toast } from 'react-toastify';

const ChatList = () => {
  const [addMode, setAddMode] = useState(false);
  const [chats, setChats] = useState([]);

  const {currentUser} = useUserStore();
  const {chatId, changeChat} = useChatsStore();
  

  useEffect(() => {
    const unSub = onSnapshot(doc(db, "userchats", currentUser.id), async (res) => {
      const items = res.data().chats;

      const promises = items?.map(async(item) => {
        const userDocRef = doc(db, "users", item.receiverId);
        const userDocSnap = await getDoc(userDocRef);

        const user = userDocSnap.data();

        return {...item, user};
      });

      const chatData = await Promise.all(promises);
      setChats(chatData.sort((a, b) => b.updatedAt - a.updatedAt));
    });

    return () => {
      unSub()
    }
  }, [currentUser.id]);

  const handleSelect = async (chat) => {

    const userChats = chats.map((item) => {
      const {user, ...rest} = item;
      return rest;
    });

    const chatIndex = userChats.findIndex(item=>item.chatId === chat.chatId);

    userChats[chatIndex].isSeen = true;

    const userChatsRef = doc(db, "userchats", currentUser.id);

    try {
      await updateDoc(userChatsRef, {
        chats:userChats,

      });
      changeChat(chat.chatId, chat.user);
    } catch (error) {
      toast.error(error.message);
    }
  }

  return (
    <div className='chatList'>
      <div className="search">
        <div className="searchBar">
          <SearchIcon />
          <input type="search" placeholder='search...' />
        </div>
        <button onClick={() => setAddMode((prev) => !prev)}>
        {addMode ? <RemoveIcon className='plus'/> : <AddIcon className='plus'/>}
        </button>
      </div>
      {chats?.map((chat) => {
        return (
          <div
           className="item" 
           key={chat.chatId} 
           onClick={() => handleSelect(chat)}
           style={{backgroundColor: chat?.isSeen ? "transparent" : "rgb(61, 201, 166)"}}>
            <img src={chat?.user.avatar || "/assets/cw.jpg"} alt="" />
          <div className="texts">
            <span>{chat?.user.username}</span>
            <p>{chat?.lastMessage}</p>
          </div>
        </div>
        )
      })}

      {addMode && <AddUser />}
    </div>
  )
}

export default ChatList