import {onChangetheme,onThemeInit,onShowCustomThemeView} from './theme';
import {onLoadingPopul,onLoadMorePopular,onFlushPopularFavorite} from './popul';
import {onLoadingTrending,onLoadMoreTrending,onFlushTrendingFavorite} from './trending';
import {onLoadMoreSearch,onSearch,onSearchCancel} from './search';
import {onLoadLanguage} from './language';
import {onLoadFavoriteData} from './favorite';
export default {
    onChangetheme,
    onLoadingPopul,
    onLoadMorePopular,


    onLoadingTrending,
    onLoadMoreTrending,
    onLoadFavoriteData,

    onFlushPopularFavorite,
    onFlushTrendingFavorite,

    onLoadLanguage,

    onThemeInit,
    onShowCustomThemeView,

    onLoadMoreSearch,
    onSearch,
    onSearchCancel,


}