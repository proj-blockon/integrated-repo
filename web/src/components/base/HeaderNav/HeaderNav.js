import React, { Component, Fragment } from 'react';
import { NavLink, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as userActions from 'store/modules/user';
import LoggedInNav from 'components/base/HeaderNav/LoggedInNav';
import LoggedOutNav from 'components/base/HeaderNav/LoggedOutNav';
import * as AuthAPI from 'lib/api/auth';
import './HeaderNav.scss';

export const HeaderNavItem = ({ children, item, nav_click, to, exact }) => {
  return (
    <Fragment>
      <NavLink
        to={to}
        activeClassName="active"
        exact={exact ? true : undefined}
      >
        <li
          onClick={() => {
            nav_click();
          }}
        >
          {children}
        </li>
      </NavLink>
    </Fragment>
  );
};

/**
 * 헤더 아이템 컴포넌트
 * @param activeItem 현재 선택된 아이템
 * @param onSelect 아이템 선택 함수
 */
class HeaderNav extends Component {
  state = {
    toggled: false
  };

  // nav 클릭시 토글 변수를 추가해서 변수에 따라 메뉴가 나오고 사라질 수 있게 한다.
  nav_click = () => {
    this.setState({
      toggled: !this.state.toggled
    });
  };

  handleLogout = async () => {
    const { UserActions } = this.props;

    await AuthAPI.logout()
      .then(() => {
        console.log('access-token 쿠키 삭제 성공');
      })
      .catch(() => {
        console.log('access-token 쿠키 삭제 실패');
      });

    localStorage.removeItem('loggedInfo');
    UserActions.logout();
    this.props.history.push('/'); /* / 라우트로 이동 */
  };

  /**
   * 로그인 여부에 따라 로그인/로그아웃 버튼 조건부 렌더링
   */
  getUserButtons = () => {
    const { isLogged } = this.props;

    if (isLogged) {
      return (
        <LoggedInNav
          nav_click={this.nav_click}
          handleLogout={this.handleLogout}
        />
      );
    } else {
      return <LoggedOutNav nav_click={this.nav_click} />;
    }
  };

  render() {
    const { toggled } = this.state;

    return (
      <nav className="HeaderNav">
        <div className="nav-mobile">
          <button
            id="nav-toggle"
            onClick={this.nav_click}
            className={toggled ? 'active' : undefined}
          >
            <span />
          </button>
        </div>

        <ul className={toggled ? 'active' : undefined}>
          <HeaderNavItem item="about" nav_click={this.nav_click} to="/" exact>
            소개
          </HeaderNavItem>
          <HeaderNavItem item="message" nav_click={this.nav_click} to="/search">
            평점검색
          </HeaderNavItem>
          {this.getUserButtons()}
        </ul>
      </nav>
    );
  }
}

const mapStateToProps = ({ user }) => ({
  isLogged: user.isLogged
});

const mapDispatchToProps = dispatch => ({
  UserActions: bindActionCreators(userActions, dispatch)
});

// withRouter: 상위 Route 컴포넌트의 history 객체를 props로 넣어줌
export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(HeaderNav)
);