import { auth } from "../firebase";

const Home = () => {
  //로그아웃 함수
  const logOut = () => {
    auth.signOut();
  };
  return <h1>Home</h1>;
};

export default Home;
