
uni.onKeyboardHeightChange((e) => {
    common.state.softInputHeight = e.height
    console.log(e.height, '软键盘高度发生变化')
})

const common = {
	namespaced: true,
    state: {
        softInputHeight: 0, // 软件盘高度
    },
    mutations: {
	    setSoftInputHeight(state, height) {
	        state.softInputHeight = height + 60
        }
    }
}

export default common
