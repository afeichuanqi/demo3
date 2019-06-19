import Types from '../Types';
import ThemeDao from "../../expand/dao/ThemeDao";

/**
 * 主题变更
 * @param theme
 * @returns {{theme: *, type: string}}
 */
export function onChangetheme(theme) {
    return {type: Types.CHANGE_THERE_COLOR, theme: theme};
}

/**
 * 初始化主题
 * @returns {Function}
 */
export function onThemeInit() {
    return dispatch => {
        new ThemeDao().getTheme().then((data) => {
            dispatch(onChangetheme(data))
        })
    }
}

/**
 * 显示自定义主题浮层
 * @returns {{customThemeViewVisible: (text: (string | ), duration?: number, callback?: () => void) => void, type: string}}
 */
export function onShowCustomThemeView(show){
    return {type:Types.SHOW_THEME_VIEW,customThemeViewVisible:show};
}