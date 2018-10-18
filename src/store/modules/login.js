// Model
const LOGIN = 'login/LOGIN';
const LOGIN_SUCCESS = 'login/LOGIN_SUCCESS';
const LOGIN_FAILURE = 'login/LOGIN_FAILURE';

const SMS = 'login/SMS';
const SMS_SUCCESS = 'login/SMS_SUCCESS';
const SMS_FAILURE = 'login/SMS_FAILURE';

const initial = {
  isLoading: false
};

// Reducer
export default function reducer(state = initial, action = {}) {
  switch (action.type) {
    case LOGIN:
      return {
        ...state,
        isLoading: true
      };
    case LOGIN_SUCCESS:
      return {
        ...state,
        isLoading: false
      };
    case LOGIN_FAILURE:
      return {
        ...state,
        isLoading: false
      };
    case SMS:
      return {
        ...state
      };
    case SMS_SUCCESS:
      return {
        ...state
      };
    case SMS_FAILURE:
      return {
        ...state
      };
    default:
      return state;
  }
}

// Action
export function login(params) {
  return {
    types: [LOGIN, LOGIN_SUCCESS, LOGIN_FAILURE],
    promise: client => client.get('/login/mobileLoginBySmsToWeChat.action', params)
  };
}
export function sentSms(params) {
  return {
    types: [SMS, SMS_SUCCESS, SMS_FAILURE],
    promise: client => client.get('/login/sendLoginSmsVerifyCode.action', params)
  };
}
