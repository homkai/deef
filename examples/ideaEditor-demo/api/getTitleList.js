/**
 * @file mock接口
 * @param params {object} 请求参数
 * @return {Promise}
 */
const listData = [
    {title: '天这么冷，你还没有手套？'},
    {title: '太卡？你和荣耀王者只差一部Mate10！'},
    {title: '两件8折，三件6折！'},
    {title: '双11历史最低价！'},
];

module.exports = ({searchQuery = ''} = {}) => {
    return new Promise(resolve => {
        setTimeout(() => resolve({
            error: null,
            status: 200,
            data: {
                listData: listData.filter(item => !searchQuery || ~item.title.indexOf(searchQuery))
            }
        }), 300);
    });
};