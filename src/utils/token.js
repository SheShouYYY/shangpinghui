// 本地存储token
export const sendToken = (token) => {
    localStorage.setItem('token', token)
}

// 获取token
export const getToken = () => {
    return localStorage.getItem('token')
}

// 删除本地token
export const removeToken = () => {
    localStorage.removeItem('token')
}