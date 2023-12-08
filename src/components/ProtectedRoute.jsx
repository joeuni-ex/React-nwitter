import { Navigate } from "react-router-dom";
import { auth } from "../firebase";

//children하위 컴포넌트
//현재 유저가 인증되지 않았을 경우 로그인 페이지로 이동
const ProtectedRoute = ({ children }) => {
  const user = auth.currentUser; //현재 접속 유저
  if (user === null) {
    //유저가 없으면 navigate로 login 이동
    return <Navigate to="/login" />;
  }
  return children; //자식컴포넌트로 이동
};

export default ProtectedRoute;
