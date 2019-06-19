import Types from '../../action/Types';
import {ThemeFlags} from "../../res/styles/ThemeFactory";
import ThemeFactory from "../../res/styles/ThemeFactory";

const defaultContent = {
    theme: ThemeFactory.createTheme(ThemeFlags.Default),
    onShowCustomThemeView: false,
}

export default function onAction(state = defaultContent, action) {

    const {type, theme} = action;
    switch (type) {
        case Types.CHANGE_THERE_COLOR :
            return {
                ...state,
                theme: theme,
            }
        case Types.SHOW_THEME_VIEW :
            return {
                ...state,
                customThemeViewVisible: action.customThemeViewVisible,
            }
        default:
            return state
    }
}