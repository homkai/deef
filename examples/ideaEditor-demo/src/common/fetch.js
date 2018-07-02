/**
 * @file 请求接口mock的fetch
 * @param path api路径
 * @param params 请求参数
 * @returns {Promise}
 */
export default (path, params = {}) => {
    return fetch(`/api?path=${path}`, {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            path,
            params
        })
    }).then(res => {
        return res.json()
    });
};