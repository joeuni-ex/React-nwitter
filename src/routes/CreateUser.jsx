import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Error,
  Form,
  Input,
  Switcher,
  Title,
  Wrapper,
  errorMessageToKorean,
} from "../components/auth-components";
import { auth } from "../firebase";
import { FirebaseError } from "firebase/app";

const CreateUser = () => {
  const [isLoading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate(); //네비게이션

  const onChange = (e) => {
    //이벤트 객체를 분리함 ( target -> name/value )
    //console.log(e);
    const { name, value } = e.target;
    if (name === "name") {
      setName(value);
    } else if (name === "email") {
      setEmail(value);
    } else if (name === "password") {
      setPassword(value);
    }
  };

  //console.log(name, email, password);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError(""); //에러 초기화
    if (isLoading || name === "" || email === "" || password === "") return; //만약 이름,이메일,패스워드가 공백이면 리턴함

    //회원가입 실행
    try {
      setLoading(true); //로딩 시작
      //유저정보
      const credentials = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      console.log(credentials.user); // 유저 정보 출력
      await updateProfile(credentials.user, {
        displayName: name, // 이름 저장
      });
      navigate("/"); //회원가입 완료 후 기본 페이지로
    } catch (e) {
      if (e instanceof FirebaseError) {
        setError(e.code);
      }
    } finally {
      setLoading(false);
    }
  };
  return (
    <Wrapper>
      <Title>Log into 𝕏</Title>
      <Form onSubmit={onSubmit}>
        <Input
          onChange={onChange}
          name="name"
          value={name}
          placeholder="Name"
          type="text"
          required
        />
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
        <Input
          type="submit"
          value={isLoading ? "Loading..." : "Create Account"}
        />
      </Form>
      {error && <Error>{errorMessageToKorean(error)}</Error>}
      <Switcher>
        이미 계정이 있습니까? <Link to="/login">로그인 &rarr;</Link>
      </Switcher>
    </Wrapper>
  );
};

export default CreateUser;
