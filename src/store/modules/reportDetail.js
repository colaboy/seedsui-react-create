import Bridge from 'seedsui-react/lib/Bridge';
const mockResult = {
	"code": "1",
	"data": {
    "approval_status": "5",
		"banquet_address": "测试内容9p6j",
		"banquet_date_str": "测试内容47e6",
		"banquet_distrinct": "测试内容873c",
		"end_date_str": "2018-08-08",
		"banquet_name": "测试内容sgh3",
		"banquet_type": "1",
		"banquet_time": "2018-08-08",
		"code": "测试内容admr",
		"consumer": "测试内容08fy",
		"consumer_phone": "15843241234",
		"create_time_str": "测试内容2w60",
		"creator_department": "测试内容cluz",
		"creator_name": "测试内容6ip1",
		"is_self": "1",
		"pic_path": "https://static.zcool.cn/git_z/z/common/images/svg/logo.svg",
		"product_count": "测试内容ssg8",
		"product_name": "测试内容4gt7",
		"remark": "测试内容2875",
		"store_code": "测试内容0qsu",
		"store_linkman": "测试内容g1wt",
		"store_name": "测试内容o8wi",
    "table_number": "20",
    "video_url": "http://res.waiqin365.com/video/v2001.MP4",
    "dealer_name": "经销商1",
    "dealer_code": "hhasdfasd",
    "documentary_mode": "2",
    "merchandiser": "bangshou",
    "merchandiser_name": "帮手1",
    "mss_msg": "北京,西城区",
    "wine_code": "21341234123,432134123421,4321342134",
    "store_id": "43214321",
    "dealer_id": "43214321",
    "product_id": "43214321",
    "vid": "43214321",
    "limit_days": "3",
    "banquet_id": "213413241",
    "dir": "test/01"
	},
	"message": 1
}

// State
const GET_DETAIL = 'reportDetail/GET_DETAIL';
const GET_DETAIL_SUCCESS = 'reportDetail/GET_DETAIL_SUCCESS';
const GET_DETAIL_FAILURE = 'reportDetail/GET_DETAIL_FAILURE';

const DELETE_DETAIL = 'reportDetail/DELETE_DETAIL';
const DELETE_DETAIL_SUCCESS = 'reportDetail/DELETE_DETAIL_SUCCESS';
const DELETE_DETAIL_FAILURE = 'reportDetail/DELETE_DETAIL_FAILURE';

const CANCEL_DETAIL = 'reportDetail/CANCEL_DETAIL';
const CANCEL_DETAIL_SUCCESS = 'reportDetail/CANCEL_DETAIL_SUCCESS';
const CANCEL_DETAIL_FAILURE = 'reportDetail/CANCEL_DETAIL_FAILURE';

const VERIFY_DETAIL = 'reportDetail/VERIFY_DETAIL';
const VERIFY_DETAIL_SUCCESS = 'reportDetail/VERIFY_DETAIL_SUCCESS';
const VERIFY_DETAIL_FAILURE = 'reportDetail/VERIFY_DETAIL_FAILURE';

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
      if (result.code === '1' && result.data && !Object.isEmptyObject(result.data)) {
        state.detail = result.data
        if (!state.detail || Object.isEmptyObject(state.detail)) {
          state.hasMore = 404;
        } else {
          state.hasMore = 0;
        }
      } else {
        state.hasMore = -1;
        Bridge.showToast(result.message || '获取失败, 请稍后再试', {mask: false});
      }
      return {
        ...state,
        isLoading: false
      };
    case GET_DETAIL_FAILURE:
      Bridge.showToast('获取异常, 请稍后再试', {mask: false});
      return {
        ...state,
        // hasMore: -1,
        isLoading: false
      };
    case DELETE_DETAIL:
      return {
        ...state,
        isLoading: true
      };
    case DELETE_DETAIL_SUCCESS:
      return {
        ...state,
        isLoading: false
      };
    case DELETE_DETAIL_FAILURE:
      return {
        ...state,
        isLoading: false
      };
    case CANCEL_DETAIL:
      return {
        ...state,
        isLoading: true
      };
    case CANCEL_DETAIL_SUCCESS:
      return {
        ...state,
        isLoading: false
      };
    case CANCEL_DETAIL_FAILURE:
      return {
        ...state,
        isLoading: false
      };
    case VERIFY_DETAIL:
      return {
        ...state,
        isLoading: true
      };
    case VERIFY_DETAIL_SUCCESS:
      return {
        ...state,
        isLoading: false
      };
    case VERIFY_DETAIL_FAILURE:
      return {
        ...state,
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
    promise: client => client.post(`/app/client/yjn/report/getDetail.do`, {data: params})
  };
}
export function delDetail(params) {
  return {
    types: [DELETE_DETAIL, DELETE_DETAIL_SUCCESS, DELETE_DETAIL_FAILURE],
    promise: client => client.post(`/app/client/yjn/report/removeReport.do`, {data: params})
  };
}
export function cancelDetail(params) {
  return {
    types: [CANCEL_DETAIL, CANCEL_DETAIL_SUCCESS, CANCEL_DETAIL_FAILURE],
    promise: client => client.post(`/app/client/yjn/report/cancel.do`, {data: params})
  };
}
export function verifyDetail(params) {
  return {
    types: [VERIFY_DETAIL, VERIFY_DETAIL_SUCCESS, VERIFY_DETAIL_FAILURE],
    promise: client => client.post(`/app/client/yjn/report/checkWineCodes.do`, {data: params})
  };
}
