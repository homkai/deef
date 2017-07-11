/**
 * Created by DOCer on 2017/7/11.
 */

export default {
	namespace: 'test',
	state: {
		isLoading: false,
		percent: 0
	},
	reducers: {
		showLoading(state){
			return{
				...state,
				isLoading: true
			}
		},
		hideLoading(state){
			return{
				...state,
				isLoading: false
			}
		},
		increase(state){
			let percent = state.percent + 10;
		    if (percent > 100) {
		      	percent = 100;
		    }
			return{
				...state,
				percent
			}
		},
		decline(state){
		    let percent = state.percent - 10;
		    if (percent < 0) {
		      percent = 0;
		    }
			return{
				...state,
				percent
			}
		}
	}
};
