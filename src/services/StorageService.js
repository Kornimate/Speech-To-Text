import { EDITOR_MIN_CONSTANT } from "../Data/ConstantValues"

const KEY = "dictation_app_key"

function SaveToStorage(data){
    localStorage.setItem(KEY, JSON.stringify(data))
}

function GetFromStorage(){
    const data = localStorage.getItem(KEY)
    if(data === null)
        return EDITOR_MIN_CONSTANT

    return JSON.parse(data)
}

function SetStorageValueToDefaultAndReturn(){
    localStorage.setItem(KEY, JSON.stringify(EDITOR_MIN_CONSTANT))
    return EDITOR_MIN_CONSTANT;
}

export { SaveToStorage, GetFromStorage, SetStorageValueToDefaultAndReturn}