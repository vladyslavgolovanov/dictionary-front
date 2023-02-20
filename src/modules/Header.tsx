import {useAppContext} from "../context";
import s from "../App.module.css";
import React from "react";

export function Header() {
    return (
        <header className={s.header}>
            <div className={s.headerContainer}>
                <div className={s.logo}>Dictionary</div>
                <HeaderData/>
            </div>
        </header>
    )
}

function HeaderData() {
    const {
        userData,

        loginWithPopup,
        logout,
    } = useAppContext()

    if (!userData) {
        return (
            <button onClick={loginWithPopup}>Login</button>
        )
    }

    return (
        <div className={s.headerData}>
            <div>{userData.displayName}</div>
            <button onClick={logout}>Logout</button>
        </div>
    )
}