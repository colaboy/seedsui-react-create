const mockListResult = {
	"code": "测试内容7n04",
	"data": [{
		"approval_status": "0",
		"banquet_name": "测试内容ih5d",
		"banquet_type": "测试内容4f64",
		"code": "测试内容84s3",
		"create_time_str": "2018-08-08",
		"creator_name": "测试内容sojj",
		"exe_time_str": "2018-08-08",
		"id": "测试内容0977",
		"product_name": "测试内容y5sy",
		"store_name": "测试内容13o4"
	},{
		"approval_status": "1",
		"banquet_name": "测试内容ih5d",
		"banquet_type": "测试内容4f64",
		"code": "测试内容84s3",
		"create_time_str": "2018-08-08",
		"creator_name": "测试内容sojj",
		"exe_time_str": "2018-08-08",
		"id": "测试内容0977",
		"product_name": "测试内容y5sy",
		"store_name": "测试内容13o4"
	},{
		"approval_status": "2",
		"banquet_name": "测试内容ih5d",
		"banquet_type": "测试内容4f64",
		"code": "测试内容84s3",
		"create_time_str": "2018-08-08",
		"creator_name": "测试内容sojj",
		"exe_time_str": "2018-08-08",
		"id": "测试内容0977",
		"product_name": "测试内容y5sy",
		"store_name": "测试内容13o4"
	},{
		"approval_status": "3",
		"banquet_name": "测试内容ih5d",
		"banquet_type": "测试内容4f64",
		"code": "测试内容84s3",
		"create_time_str": "2018-08-08",
		"creator_name": "测试内容sojj",
		"exe_time_str": "2018-08-08",
		"id": "测试内容0977",
		"product_name": "测试内容y5sy",
		"store_name": "测试内容13o4"
	},{
		"approval_status": "4",
		"banquet_name": "测试内容ih5d",
		"banquet_type": "测试内容4f64",
		"code": "测试内容84s3",
		"create_time_str": "2018-08-08",
		"creator_name": "测试内容sojj",
		"exe_time_str": "2018-08-08",
		"id": "测试内容0977",
		"product_name": "测试内容y5sy",
		"store_name": "测试内容13o4"
	},{
		"approval_status": "5",
		"banquet_name": "测试内容ih5d",
		"banquet_type": "测试内容4f64",
		"code": "测试内容84s3",
		"create_time_str": "2018-08-08",
		"creator_name": "测试内容sojj",
		"exe_time_str": "2018-08-08",
		"id": "测试内容0977",
		"product_name": "测试内容y5sy",
		"store_name": "测试内容13o4"
	}],
	"message": "测试内容d8g1"
};

// State
const INIT = 'reportList/INIT';

const CHANGE_SCROLLTOP = 'reportList/CHANGE_SCROLLTOP';

const GET_LIST = 'reportList/GET_LIST';
const GET_LIST_SUCCESS = 'reportList/GET_LIST_SUCCESS';
const GET_LIST_FAILURE = 'reportList/GET_LIST_FAILURE';

const CHANGE_FILTER = 'reportList/CHANGE_FILTER';

const initial = {
  scrollTop: 0, // 保存滚动条位置
  isLoading: true,
  page: 1,
  rows: 50,
  hasMore: -2,
  list: mockListResult.data || [],
  // 过滤条件
  banquetTypeList: [{ // 宴会类型列表, 写死
    key: '1',
    value: '公司年会'
  }, {
    key: '2',
    value: '家宴'
  }, {
    key: '3',
    value: '开业庆典'
  }, {
    key: '4',
    value: '满月宴'
  }, {
    key: '5',
    value: '乔迁'
  }, {
    key: '6',
    value: '周岁宴'
  }, {
    key: '7',
    value: '同学聚会'
  }, {
    key: '8',
    value: '婚宴'
  }, {
    key: '9',
    value: '升学宴'
  }, {
    key: '10',
    value: '白事'
  }, {
    key: '11',
    value: '寿宴'
  }, {
    key: '12',
    value: '其他'
  }],
  banquetTypeName: '',
  banquetType: '',
  banquetStatusList: [
    {
      key: '1',
      value: '全部'
    },
    {
      key: '2',
      value: '物流码校验中'
    },
    {
      key: '3',
      value: '物流码报错'
    },
    {
      key: '4',
      value: '待审批'
    },
    {
      key: '5',
      value: '已通过'
    },
    {
      key: '6',
      value: '未通过'
    },
    {
      key: '7',
      value: '已取消'
    },
    {
      key: '1',
      value: '未提交'
    }
  ],
  banquetStatusName: '',
  banquetStatus: '',
  storeName: '',
  storeId: '',
  creatimeStart: '',
  createTimeEnd: '',
  creatorName: '',
  banquetDate: '',
  endDate: ''
};
// Reducer
export default function reducer(state = initial, action = {}) {
  switch (action.type) {
    case CHANGE_SCROLLTOP:
      state.scrollTop = action.scrollTop;
      return {
        ...state
      };
    case INIT:
      return {
        ...initial
      };
    case CHANGE_FILTER:
      var params = action.params;
      if (params.cmName !== undefined) state.cmName = params.cmName;
      if (params.banquetTypeName !== undefined) state.banquetTypeName = params.banquetTypeName;
      if (params.banquetType !== undefined) state.banquetType = params.banquetType;
      if (params.banquetStatusName !== undefined) state.banquetStatusName = params.banquetStatusName;
      if (params.banquetStatus !== undefined) state.banquetStatus = params.banquetStatus;
      if (params.storeName !== undefined) state.storeName = params.storeName;
      if (params.storeId !== undefined) state.storeId = params.storeId;
      if (params.creatimeStart !== undefined) state.creatimeStart = params.creatimeStart;
      if (params.createTimeEnd !== undefined) state.createTimeEnd = params.createTimeEnd;
      if (params.creatorName !== undefined) state.creatorName = params.creatorName;
      if (params.banquetDate !== undefined) state.banquetDate = params.banquetDate;
      if (params.endDate !== undefined) state.endDate = params.endDate;
      return {
        ...state
      };
    case GET_LIST:
      state.page = action.params.page;
      return {
        ...state,
        hasMore: -2,
        isLoading: state.page === 1 ? true : false
      };
    case GET_LIST_SUCCESS:
      let result = action && action.result;
      if (result.code === '1') {
        const serList = result.data;
        state.list = state.page === 1 ? serList : state.list.concat(serList);
        // 判断0.无更多数据, 1.头部刷新完成, 2.底部刷新完成, 404.一条数据都没有
        state.hasMore = state.page === 1 ? 1 : 2;
        // 判断是否无更多数据
        if (state.rows > serList.length) state.hasMore = 0;
        // 判断是否暂无数据
        if (state.list.length === 0) state.hasMore = 404;
      } else {
        state.hasMore = -1;
      }
      return {
        ...state,
        isLoading: false
      };
    case GET_LIST_FAILURE:
      return {
        ...state,
        hasMore: -1,
        isLoading: false
      };
    default:
      return state;
  }
}

// Action
export function init(){
  return (dispatch) => {
    dispatch({
      type: INIT
    });
  };
}
// 修改滚动条位置
export function changeScrollTop(scrollTop) {
  return {
    type: CHANGE_SCROLLTOP,
    scrollTop
  }
}
// 获取执行类的活动
export function getList(params) {
  return {
    types: [GET_LIST, GET_LIST_SUCCESS, GET_LIST_FAILURE],
    promise: client => client.post(`/app/client/yjn/report/selectBanqueReporttList.do`, {data: params}),
    params
  };
}
export function changeFilter(params) {
  return {
    type: CHANGE_FILTER,
    params
  };
}