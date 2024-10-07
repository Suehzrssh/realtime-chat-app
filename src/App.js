import React, { useEffect } from "react";
import "./App.scss";
import List from "./pages/List";
import Chat from "./pages/Chat";
import Details from "./pages/Details";
import Form from "./components/Form";
import Notification from "./components/Notification";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./lib/Firebase";
import { useUserStore } from "./lib/UserStore";
import { useChatsStore } from "./lib/UserChatsStore";

function App() {

  const {currentUser, isLoading, fetchUserInfo} = useUserStore();
  const {chatId} = useChatsStore();

  useEffect(() => {
    const unSub = onAuthStateChanged(auth, (user) => {
      fetchUserInfo(user?.uid);
    });
    return () => {
      unSub();
    }
  }, [fetchUserInfo]);

  if(isLoading) return <div className="loading">Loading...</div>
  return (
    <div className="App">
      <div className="container">
      {
        currentUser ? (
          <>
            <List />
            {chatId && <Chat />}
            {chatId && <Details />}
          </>
        ) : (
          <Form />
        )
      }
      <Notification />
      </div>
    </div>
  );
}

export default App;
