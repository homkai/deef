/**
 * @file 工具方法
 */
import {Dialog} from 'fcui2';


export const alertDialog = ({message, title = '温馨提示', onEnter, onCancel}) => {
    Array.isArray(message) && (message = message.join('<br/>'));

    onCancel ? new Dialog().confirm({
        title,
        message,
        onEnter,
        onCancel,
        showCloseButton: false
    }) : new Dialog().alert({
        title,
        message,
        onClose: onEnter,
        showCloseButton: false
    });
};