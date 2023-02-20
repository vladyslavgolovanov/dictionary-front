import React from 'react';
import s from './App.module.css'
import {AppProvider} from "./context";
import {Header} from "./modules/Header";
import {Body} from "./modules/Body";

function _App () {
  return (
      <div className={s.page}>
        <Header />
        <Body />
      </div>
  )
}

function App() {
  return (
    <AppProvider>
      <_App/>
    </AppProvider>
  );
}

export default App;
