import {translationItemType, useAppContext} from "../context";
import s from "../App.module.css";
import React, {useEffect, useState} from "react";

export function Body() {
    const {
        userData,
        translationList,

        changeTranslationItem
    } = useAppContext()

    const translations = translationList.map((item: translationItemType) =>
        <TranslationItem key={item.input_text} item={item}/>
    )

    if (!userData) {
        return (
            <div className={s.body}>
                <h3 className={s.bodyMessage}>Please login</h3>
            </div>
        )
    }

    return (
        <div className={s.body}>
            <div className={s.bodyContainer}>
                <div className={s.translationContainer}>
                    <button onClick={() => changeTranslationItem(null, true)}>Add new word</button>
                    {translations}
                </div>
                <TranslationEditor/>
            </div>
        </div>
    )
}

type propsType = {
    item: translationItemType
}

function TranslationItem (props: propsType) {
    const {
        item
    } = props

    const {
        changeTranslationItem,
    } = useAppContext()

    return (
        <div
            className={s.translationItem}
            onClick={() => changeTranslationItem(item.id, false)}
        >
            {item.input_text}
        </div>
    )
}

function TranslationEditor () {
    const {
        userData,

        translationItem,
        isOpenEditor,
        editTranslationItemId,

        changeTranslationItem,
        deleteTranslationItem,
        saveTranslationItem,
    } = useAppContext()

    const [data, setData] = useState<translationItemType | null>(null)

    const onChange = (key: string, value: string) => {
        const newData = {...data}
        newData[key as keyof translationItemType] = value
        setData(newData as translationItemType)
    }

    const onSave = () => {
        saveTranslationItem(data)
        setData(null)
    }

    const onClose = () => {
        changeTranslationItem(editTranslationItemId ? translationItem.id : null, false)
    }

    useEffect(() => {
        isOpenEditor && setData(translationItem)
    }, [isOpenEditor])

    if (!translationItem) return null

    if (isOpenEditor) {
        return (
            <div className={s.translationEditor}>
                <div className={s.editorItem}>
                    <span>Input word: </span>
                    <input
                        value={data?.input_text}
                        onChange={(e) => onChange('input_text', e.target.value)}
                    />
                </div>
                <div className={s.editorItem}>
                    <span>Output word: </span>
                    <input
                        value={data?.output_text}
                        onChange={(e) => onChange('output_text', e.target.value)}
                    />
                </div>
                <div className={s.editorItem}>
                    <button onClick={onClose}>Cancel</button>
                    <button onClick={onSave}>{editTranslationItemId ? "Edit" : "Add"}</button>
                </div>
            </div>
        )
    }

    return (
        <div className={s.translationEditor}>
            <div className={s.editorItem}>
                <span>Input word:</span>
                <span>{translationItem.input_text}</span>
            </div>
            <div className={s.editorItem}>
                <span>Output word:</span>
                <span>{translationItem.output_text}</span>
            </div>
            <div className={s.editorItem}>
                <span>Author:</span>
                <span>{translationItem.from_user}</span>
            </div>
            <div className={s.editorItem}>
                <button onClick={() => changeTranslationItem(null, false)}>Cancel</button>
                {userData.email === translationItem.from_user &&
                    <>
                        <button onClick={() => deleteTranslationItem(translationItem.id)}>Delete</button>
                        <button onClick={() => changeTranslationItem(translationItem.id, true)}>Edit</button>
                    </>
                }
            </div>
        </div>
    )
}