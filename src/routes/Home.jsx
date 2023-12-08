import { auth } from "../firebase";

const Home = () => {
  //로그아웃 함수
  const logOut = () => {
    auth.signOut();
  };
  return (
    <h1>
      <button onClick={logOut}>Log Out</button>
    </h1>
  );
};

export default Home;
