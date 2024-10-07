import React, { useState } from 'react';
import "../styles/Form.scss";
import { toast } from 'react-toastify';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../lib/Firebase';
import { doc, setDoc } from 'firebase/firestore';
import upload from '../lib/Upload';

const Login = () => {
  const [avatar, setAvatar] = useState({
    file: null,
    url: ""
  });

  const [loading, setLoading] = useState(false);

const handleAvatar = (e) => {
  if(e.target.files[0]) {
    setAvatar({
      file: e.target.files[0],
      url: URL.createObjectURL(e.target.files[0])
    });
  }
}

const handleLogin = async (e) => {
  e.preventDefault();
  setLoading(true);

  const formData = new FormData(e.target);

  const { email, password} = Object.fromEntries(formData);

  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (error) {
    toast.error(error.message);
  } finally {
    setLoading(false);
  }
}

const handleRegister = async (e) => {
  e.preventDefault();
  setLoading(true);
  const formData = new FormData(e.target);

  const {username, email, password} = Object.fromEntries(formData);

  try {
    const res = await createUserWithEmailAndPassword(auth, email, password);

    const imgUrl =await upload(avatar.file);

    await setDoc(doc(db, "users", res.user.uid), {
      username: username,
      email: email,
      avatar: imgUrl,
      id: res.user.uid,
      blocked: []
    });
    await setDoc(doc(db, "userchats", res.user.uid), {
      chats: []
    });
    toast.success("Account is created! You can login Now!");
  } catch (error) {
    toast.error(error.message);
  } finally {
    setLoading(false);
  }
}

  return (
    <div className='form'>
      <div className="item">
        <h2>Wellcome back</h2>
        <form onSubmit={handleLogin}>
          <input autoComplete='off' type="email" placeholder='email...' name='email'/>
          <input autoComplete='off' type="password" placeholder='password...' name='password' />
          <button disabled={loading} type='submit'>{loading ? "loading" : "sign in"}</button>
        </form>
      </div>
      <div className="line"></div>
      <div className="item">
      <h2>create an account</h2>
        <form onSubmit={handleRegister}>
          <label htmlFor="file">
            <img src={avatar.url || "/assets/cw.jpg"} alt="" style={{width: '100px', height: '100px', objectFit: 'cover'}}/>
            <span>upload image</span></label>
          <input type="file" id='file' style={{display: 'none'}} onChange={handleAvatar}/>
          <input autoComplete='off' type="text" placeholder='username...' name='username'/>
          <input autoComplete='off' type="email" placeholder='email...' name='email'/>
          <input autoComplete='off' type="password" placeholder='password...' name='password' />
          <button disabled={loading} type='submit'>{loading ? "loading" : "sign up"}</button>
        </form>
      </div>
    </div>
  )
}

export default Login;