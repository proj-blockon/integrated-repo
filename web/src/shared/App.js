import React, { Component } from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';
import { Home, Contract, Auth } from 'pages';
import ContractCardList from 'components/ContractCardList';
import AppTemplate from 'components/AppTemplate';
import HeaderNav from 'components/HeaderNav';
import HeaderContainer from 'containers/HeaderContainer';
import PrivateRoute from 'components/PrivateRoute';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as userActions from 'store/modules/user';

/**
 * 서버와 클라이언트에서 공용으로 사용하는 컴포넌트
 */
class App extends Component {
  state = {
    tab: null
  };

  // 새로고침시 로그인 유지
  initializeUserInfo = () => {
    const loggedInfo = JSON.parse(localStorage.getItem('loggedInfo'));
    if (!loggedInfo) return;

    const { UserActions } = this.props;
    UserActions.setLoggedInfo(loggedInfo);
  };

  handleSelectTab = tab => {
    this.setState({
      tab
    });
  };

  componentDidMount() {
    this.initializeUserInfo();
  }

  render() {
    const { isLogged } = this.props;
    const { tab } = this.state;

    return (
      <AppTemplate
        header={
          <HeaderContainer
            left={<HeaderNav tab={tab} onSelect={this.handleSelectTab} />}
          />
        }
      >
        <Switch>
          {/* 라우트에 맞춰서 컴포넌트를 보여줌 */}
          <Route exact path="/" component={Home} />
          <PrivateRoute
            exact
            path="/contract"
            component={ContractCardList}
            isLogged={isLogged}
          />
          <PrivateRoute
            path="/contract/edit"
            component={Contract}
            isLogged={isLogged}
          />
          <Route path="/auth" component={Auth} />
        </Switch>
      </AppTemplate>
    );
  }
}

// 스토어의 state를 props로 넣어주는 함수
const mapStateToProps = ({ user }) => ({
  isLogged: user.isLogged
});

// 액션을 dispatch하는 함수를 props로 넣어주는 함수
const mapDispatchToProps = dispatch => ({
  UserActions: bindActionCreators(userActions, dispatch)
});

// withRouter: 라우트가 변경될 때마다 render가 호출되게 함
export default withRouter(
  // connect 함수로 컴포넌트에 스토어 연동
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(App)
);