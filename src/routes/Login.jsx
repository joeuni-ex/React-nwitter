import { useState } from "react";
import { auth } from "../firebase";
import { Link, useNavigate } from "react-router-dom";
import { FirebaseError } from "firebase/app";
import { signInWithEmailAndPassword } from "firebase/auth";
import {
  Error,
  Form,
  Input,
  Switcher,
  Title,
  Wrapper,
  errorMessageToKorean,
} from "../components/auth-components";
import GithubButton from "../components/GithubButton";

const Login = () => {
  const navigate = useNavigate();
  const [isLoading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const onChange = (e) => {
    //이벤트 객체를 분리함 ( target -> name/value )
    //console.log(e);
    const { name, value } = e.target;
    if (name === "email") {
      setEmail(value);
    } else if (name === "password") {
      setPassword(value);
    }
  };

  //console.log(name, email, password);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError(""); //에러 초기화
    if (isLoading || email === "" || password === "") return; //만약 이름,이메일,패스워드가 공백이면 리턴함

    //로그인 실행
    try {
      setLoading(true); //로딩 시작
      //유저정보
      const credentials = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      console.log(credentials.user); // 유저 정보 출력
      navigate("/"); //로그인 완료 후 기본 페이지로
    } catch (e) {
      if (e instanceof FirebaseError) {
        setError(e.code, e.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Wrapper>
      <Title>Login 𝕏</Title>
      <Form onSubmit={onSubmit}>
        <Input
          onChange={onChange}
          name="email"
          value={email}
          placeholder="Email"
          type="email"
          required
        />
        <Input
          onChange={onChange}
          value={password}
          name="password"
          placeholder="Password"
          type="password"
          required
        />
        <Input type="submit" value={isLoading ? "Loading..." : "Log in"} />
      </Form>
      {error && <Error>{errorMessageToKorean(error)}</Error>}

      <Switcher>
        계정이 없으신가요? <Link to="/create-user">가입하기 &rarr;</Link>
      </Switcher>
      <GithubButton />
    </Wrapper>
  );
};

export default Login;
