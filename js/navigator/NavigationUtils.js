export default class NavigationUtils{
    /**
     * 返回上上一页
     */
    static goBack(navigation){
        navigation.goBack();
    }

    /**
     * 跳转到首页
     */
    static toSetHomPage(navigation){
        // const {navigation} = params;
        navigation.navigate('Main');
    }
    static goPage(params,page){
        const navigation = NavigationUtils.navigation;
        if(!navigation){
            return;
        }
        navigation.navigate(
            page,
            {
                ...params
            });
    }
    /**
     * 跳转到指定页面
     */
    static toselfSetPage(params,page){
        // console.log( ...params);
        const navigation = NavigationUtils.navigation;
        if(!navigation){
            return;
        }
        navigation.navigate(
            page,
            {
                ...params
            });
    }
}