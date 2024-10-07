import React, { useState } from 'react';
import "../styles/AddUser.scss";
import {AnimatePresence, motion} from 'framer-motion';
import { toast } from 'react-toastify';
import { arrayUnion, collection, doc, getDocs, query, serverTimestamp, setDoc, updateDoc, where } from 'firebase/firestore';
import { db } from '../lib/Firebase';
import { useUserStore } from '../lib/UserStore';

const AddUser = () => {
    const [user, setUser] = useState(null);
    const {currentUser} = useUserStore();

    const handleSearch = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const username = formData.get("username");

        try {
            const userRef = collection(db, "users");
            const q = query(userRef, where("username", "==", username));

            const querySnapshot = await getDocs(q);

            if(!querySnapshot.empty) {
                setUser(querySnapshot.docs[0].data());
            }
        } catch (error) {
            toast.error(error.message);
        }
    }

    const handleAdd = async () => {
        const chatRef = collection(db, "chats");
        const userChatsRef = collection(db, "userchats");

        try {
            const newChatRef = doc(chatRef);
            await setDoc(newChatRef, {
                createdAt: serverTimestamp(),
                messages: []
            });

            await updateDoc(doc(userChatsRef, user.id), {
                chats:arrayUnion({
                    chatId: newChatRef.id,
                    lastMessage: "",
                    receiverId: currentUser.id,
                    updatedAt: Date.now()
                })
            });

            await updateDoc(doc(userChatsRef, currentUser.id), {
                chats:arrayUnion({
                    chatId: newChatRef.id,
                    lastMessage: "",
                    receiverId: user.id,
                    updatedAt: Date.now()
                })
            });


        } catch (error) {
            toast.error(error.message);
        }
    }


  return (
    <AnimatePresence>
        <motion.div 
        initial ={{x: -200, y: 0, scale: .5}}
        animate={{
        x: 0,
        y: 0,
        scale: 1,}}
        transition={{duration: .3}}
    className='addUser'>
        <form onSubmit={handleSearch}>
            <input type="search" placeholder='username...' name='username' />
            <button>search</button>
        </form>
        {user && <div className="user">
            <div className="detail">
                <img src={user?.avatar || '/assets/cw.jpg'} alt="" style={{height: '50px', width: '50px'}}/>
                <span>{user?.username}</span>
            </div>
            <button onClick={handleAdd}>add user</button>
        </div>}
    </motion.div>
    </AnimatePresence>
  )
}

export default AddUser;