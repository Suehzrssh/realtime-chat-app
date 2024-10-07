import React, { useEffect, useRef, useState } from 'react'
import "../styles/Chat.scss";
import InfoIcon from '@mui/icons-material/Info';
import VideoCallIcon from '@mui/icons-material/VideoCall';
import PhoneIcon from '@mui/icons-material/Phone';
import MicIcon from '@mui/icons-material/Mic';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import ImageIcon from '@mui/icons-material/Image';
import EmojiPicker from 'emoji-picker-react';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import { arrayUnion, doc, getDoc, onSnapshot, updateDoc } from 'firebase/firestore';
import { db } from '../lib/Firebase';
import { useChatsStore } from '../lib/UserChatsStore';
import { toast } from 'react-toastify';
import { useUserStore } from '../lib/UserStore';
import upload from '../lib/Upload';

const Chat = () => {
  const [chat, setChat] = useState();
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [img, setImg] = useState({
    file: null,
    url: ""
  });

  const {isReceiverBlocked, isCurrentUserBlocked, chatId, user} = useChatsStore();
  const {currentUser} = useUserStore();

  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({behavior: "smooth"});
  }, []);

  useEffect(() => {
    const unSub = onSnapshot(doc(db, "chats", chatId), (res) => {
      setChat(res.data());
    });

    return () => {
      unSub();
    }
  }, [chatId]);
  
  const handleEmoji = (e) => {
    setText((prev) => prev + e.emoji);
    setOpen(false);
  }

  const handleImg = (e) => {
    if(e.target.files[0]) {
      setImg({
        file: e.target.files[0],
        url: URL.createObjectURL(e.target.files[0])
      });
    }
  }

  const handleSend = async () => {
    if(text === "") return;

    let imgUrl = null;

    try {

      if(img.file) {
        imgUrl = await upload(img.file);
      }

      await updateDoc(doc(db, "chats", chatId), {
        messages:arrayUnion({
          sender: currentUser.id,
          text,
          createdAt: new Date(),
          ...(imgUrl && {img:imgUrl}),
        })
      });

      const userIDs = [currentUser.id, user.id];
      userIDs.forEach(async (id) => {
        const userChatsRef = doc(db, "userchats", id);

        const userChatsSnapshot = await getDoc(userChatsRef);
        if(userChatsSnapshot.exists()) {
        const userChatsData = userChatsSnapshot.data()

        const chatIndex = userChatsData.chats.findIndex(c => c.chatId === chatId)

        userChatsData.chats[chatIndex].lastMessage = text;
        userChatsData.chats[chatIndex].isSeen = id === currentUser.id ? true : false;
        userChatsData.chats[chatIndex].updatedAt = Date.now();

        await updateDoc(userChatsRef, {
          chats:userChatsData.chats,
        });
      }
      });


    } catch (error) {
      toast.error(error.message);
    }
    setImg({
      file:null,
      url: "",
    });
    setText("");
  }

  return (
    <div className='chatPart'>
      <div className="top">
        <div className="user">
          <img src={user?.avatar || "/assets/cw.jpg"} alt="" />
          <div className="texts">
          <h2>{user?.username}</h2>
          <p>Lorem ipsum dolor sit amet.</p>
          </div>
        </div>
        <div className="icons">
          <PhoneIcon className='icon'/>
          <VideoCallIcon className='icon'/>
          <InfoIcon className='icon'/>
        </div>
      </div>
      <div className="center">
        {
          chat?.messages?.map((message) => {
            
              return (
                <div
                  className={
                  message.senderId === currentUser?.id ? "message own" : "message"} key={message?.createdAt}>
                  <div className="texts">
                  {message?.img && <img src={message?.img} alt="" />}
                  <p>{message?.text}</p>
                  {/* <span>1 min ago</span> */}
                  </div>
               </div>
              );
          })
        }
        {img.url && (
          <div className="message own">
            <div className="texts">
             <img src={img?.url} alt="" />
            </div>
          </div>
        )
}
      <div ref={endRef}></div>
      </div>
      <div className="bottom">
        <div className="icons">
          <label htmlFor="img">
          <ImageIcon className='icon' />
          </label>
          <input type="file" id='img' name='img' style={{display: 'none'}} onChange={handleImg}/>
          <CameraAltIcon className='icon' />
          <MicIcon className='icon' />
        </div>
        <input
        value={text}
        type="text"
        placeholder='type your message here...'
        onChange={(e) => setText(e.target.value)}
        disabled={isCurrentUserBlocked || isReceiverBlocked}
        />
        <div className="emoji">
          <span className='icon' onClick={() => setOpen(prev => !prev)}><EmojiEmotionsIcon className='icon'/></span>
          <div className="picker">
          <EmojiPicker open={open} onEmojiClick={handleEmoji}/>
          </div>
        </div>
        <button onClick={handleSend} disabled={isCurrentUserBlocked || isReceiverBlocked}>Send</button>
      </div>
    </div>
  )
}

export default Chat;