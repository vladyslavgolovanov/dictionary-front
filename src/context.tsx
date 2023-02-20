import React, {ReactElement, useContext, useEffect, useState} from "react";
import {FirebaseApp, initializeApp } from 'firebase/app';
import { getAuth, signInWithPopup, GoogleAuthProvider, Auth, signOut } from 'firebase/auth';
import {appConfig, firebaseConfig} from "./config";
import axios from "axios";

const AppContext = React.createContext<any>(null);

export function useAppContext() {
    return useContext(AppContext);
}


type PropsType = {
    children: ReactElement
}

type initUserDataType = {
    displayName: string | null
    email: string | null
    uid: string
}

export type translationItemType = {
    id: string
    input_text: string
    output_text: string
    from_user: string
}

export type payloadType = {
    input_text: string
    output_text: string
}

export const initTranslationItem = {
    id: '',
    input_text: '',
    output_text: '',
    from_user: '',
}

export function AppProvider (props: PropsType) {

    const {
        children
    } = props

    const app: FirebaseApp = initializeApp(firebaseConfig)
    const auth: Auth = getAuth(app)
    const provider: GoogleAuthProvider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });

    const [userData, setUserData] = useState<initUserDataType | null>(null)
    const [token, setToken] = useState<string | null>(null)

    const [translationList, setTranslationList] = useState<translationItemType[]>([])
    const [translationItem, setTranslationItem] = useState<translationItemType | null>(null)

    const [isOpenEditor, setIsOpenEditor] = useState<boolean>(false)
    const [editTranslationItemId, setEditTranslationItemId] = useState<string | null>(null)

    const loginWithPopup = async () => {
        if (auth && provider) {
            try {
                const data = await signInWithPopup(auth, provider)
                const token = await data.user.getIdToken()
                const userData: initUserDataType = {
                    displayName: data.user.displayName,
                    email: data.user.email,
                    uid: data.user.uid,
                }
                setToken(token)
                setUserData(userData)
            } catch (error: any) {
                console.log(error)
            }
        }
    }

    const logout = async () => {
        if (auth) {
            try {
                await signOut(auth)
                setUserData(null)
                setToken(null)

                setTranslationList([])
                resetData()
            } catch (error: any) {
                console.log(error)
            }
        }
    }

    const getTranslations = () => {
        axios.get(`${appConfig.api_url}/translations/`, {
            headers: {
                "Authorization": `Bearer ${token}`,
            }
        })
            .then(res => setTranslationList(res.data))
            .catch(e => console.log(e))
    }

    const getTranslation = (id: string) => {
        return axios.get(`${appConfig.api_url}/translation/${id}/`, {
            headers: {
                "Authorization": `Bearer ${token}`,
            }})
            .then(res => res.data)
            .catch(e => console.log(e))
    }

    const addTranslation = (payload: payloadType) => {
        return axios.post(`${appConfig.api_url}/translations/`, payload, {
            headers: {
                "Authorization": `Bearer ${token}`
            }})
            .then(res => res.data)
            .catch(e => console.log(e))
    }

    const updateTranslation = (id: string, payload: payloadType) => {
        return axios.put(`${appConfig.api_url}/translation/${id}/`, payload, {
            headers: {
                "Authorization": `Bearer ${token}`
            }})
            .then(res => res.data)
            .catch(e => console.log(e))
    }

    const deleteTranslation = (id: string) => {
        return axios.delete(`${appConfig.api_url}/translation/${id}/`, {
            headers: {
                "Authorization": `Bearer ${token}`
            }})
            .then(res => res.data)
            .catch(e => console.log(e))
    }

    const changeTranslationItem = (id: string | null, is_edit: boolean) => {
        if (id) {
            setIsOpenEditor(is_edit)
            setEditTranslationItemId(id)
            getTranslation(id)
                .then((data) => {
                    setTranslationItem(data)
                })
        } else {
            setTranslationItem(is_edit ? initTranslationItem : null)
            setIsOpenEditor(is_edit)
            setEditTranslationItemId(id)
        }
    }

    const saveTranslationItem = (data: translationItemType) => {
        const payload = {
            input_text: data.input_text,
            output_text: data.output_text
        }
        resetData()
        if (editTranslationItemId) {
            updateTranslation(editTranslationItemId, payload)
                .then(() => getTranslations())
        } else {
            addTranslation(payload)
                .then(() => getTranslations())
        }
    }

    const deleteTranslationItem = (id: string) => {
        resetData()
        deleteTranslation(id)
            .then(() => getTranslations())
    }

    const resetData = () => {
        setTranslationItem(null)
        setIsOpenEditor(false)
        setEditTranslationItemId(null)
    }

    useEffect(() => {
        if (userData) {
            getTranslations()
        } else {
            setTranslationList([])
        }
    }, [userData])

    const value = {
        userData,
        translationList,
        translationItem,
        isOpenEditor,
        editTranslationItemId,

        loginWithPopup,
        logout,

        changeTranslationItem,
        saveTranslationItem,
        deleteTranslationItem,
    }

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    )
}