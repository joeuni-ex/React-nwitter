import { RouterProvider, createBrowserRouter } from "react-router-dom";
import "./App.css";
import Layout from "./components/Layout";
import Home from "./routes/Home";
import Profile from "./routes/Profile";
import Login from "./routes/Login";
import CreateUser from "./routes/CreateUser";
import styled, { createGlobalStyle } from "styled-components";
import reset from "styled-reset";
import { useEffect, useState } from "react";
import LoadingScreen from "./components/LoadingScreen";
import { auth } from "./firebase";
import ProtectedRoute from "./components/ProtectedRoute";

//styled Conponents
const GlobalStyle = createGlobalStyle`
  ${reset}
  * {
  box-sizing: border-box;
  }
  body {
    background-color: black;
    color:white;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  }
`;

const Wrapper = styled.div`
  height: 100vh;
  display: flex;
  justify-content: center;
`;

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "",
        element: <Home />,
      },
      {
        path: "/profile",
        element: <Profile />,
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/create-user",
    element: <CreateUser />,
  },
]);

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const init = async () => {
    //파이어베이스 체크
    //2초동안 로딩한 다음 loading을 false시킨다.
    //setTimeout(() => setIsLoading(false), 2000);
    await auth.authStateReady(); //준비가 됐는지?
    setIsLoading(false);
  };
  //한 번만 실행한다.
  useEffect(() => {
    init();
  }, []);

  return (
    <>
      <Wrapper>
        <GlobalStyle />
        {/* 로딩이면 로딩스크린을 보여주고 아니면 router를 보여준다 */}
        {isLoading ? <LoadingScreen /> : <RouterProvider router={router} />}
      </Wrapper>
    </>
  );
}

export default App;
