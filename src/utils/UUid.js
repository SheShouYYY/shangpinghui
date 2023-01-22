import { v4 as uuidv4 } from 'uuid';
export const getUUid = () => {
    // uuid等于获取本地存储
    let uuid = localStorage.getItem('UUID')
    // 如果没有，就存入一个
    if (!uuid) {
        const uuid = uuidv4()
        localStorage.setItem('UUID', uuid)
    }
    // 返回出去
    return uuid
}