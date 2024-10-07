import React from 'react'
import "../styles/List.scss";
import Users from '../components/Users';
import ChatList from '../components/ChatList';
const List = () => {
  return (
    <div className='listPart'>
      <Users />
      <ChatList />
    </div>
  )
}

export default List;