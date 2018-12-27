const mockResult = {
	"code": "测试内容cmfa",
	"data": [{
		"banquet_code": "测试内容6jeo",
		"is_reversed": "测试内容9422",
		"is_used": "1",
		"wine_code": "测试内容93xb"
	},{
		"banquet_code": "测试内容6jeo",
		"is_reversed": "测试内容9422",
		"is_used": "1",
		"wine_code": "测试内容93xb"
	}],
	"message": "测试内容7sv5"
}

// State
const GET_DETAIL = 'reportDetailCode/GET_DETAIL';
const GET_DETAIL_SUCCESS = 'reportDetailCode/GET_DETAIL_SUCCESS';
const GET_DETAIL_FAILURE = 'reportDetailCode/GET_DETAIL_FAILURE';


const initial = {
  isLoading: true,
  hasMore: -2,
  detail: mockResult.data || null
};

// Reducer
export default function reducer(state = initial, action = {}) {
  switch (action.type) {
    case GET_DETAIL:
      return {
        ...initial
      };
    case GET_DETAIL_SUCCESS:
      let result = action && action.result;
      if (result.code === '1') {
        state.detail = result.data
        if (!state.detail || Object.isEmptyObject(state.detail)) {
          state.hasMore = 404
        } else {
          state.hasMore = 0
        }
      } else {
        state.hasMore = -1
      }
      return {
        ...state,
        isLoading: false
      };
    case GET_DETAIL_FAILURE:
      return {
        ...state,
        // hasMore: -1,
        isLoading: false
      };
    default:
      return state;
  }
}

// Action
export function getDetail(params) {
  return {
    types: [GET_DETAIL, GET_DETAIL_SUCCESS, GET_DETAIL_FAILURE],
    promise: client => client.post(`/app/client/yjn/report/getWindCodesDetail.do`, {data: params})
  };
}