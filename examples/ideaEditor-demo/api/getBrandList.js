/**
 * @file mock接口 - 品牌列表
 * @param params {object} 请求参数
 * @return {Promise}
 */
const listData = [
    {brand: '淘宝热卖'},
    {brand: '聚划算'},
    {brand: '电器城'},
    {brand: '天猫超市'}
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