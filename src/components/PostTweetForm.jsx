import { addDoc, collection } from "firebase/firestore";
import { useState } from "react";
import { styled } from "styled-components";
import { auth, db } from "../firebase";

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-right: 10px;
`;

const TextArea = styled.textarea`
  border: 2px solid white;
  padding: 20px;
  border-radius: 20px;
  font-size: 16px;
  color: white;
  background-color: black;
  width: 100%;
  resize: none;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  &::placeholder {
    font-size: 16px;
  }
  &:focus {
    outline: none;
    border-color: #1d9bf0;
  }
`;

const AttachFileButton = styled.label`
  padding: 10px 0px;
  color: #1d9bf0;
  text-align: center;
  border-radius: 20px;
  border: 1px solid #1d9bf0;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
`;

const AttachFileInput = styled.input`
  display: none;
`;

const SubmitBtn = styled.input`
  background-color: #1d9bf0;
  color: white;
  border: none;
  padding: 10px 0px;
  border-radius: 20px;
  font-size: 16px;
  cursor: pointer;
  &:hover,
  &:active {
    opacity: 0.9;
  }
`;

const PostTweetForm = () => {
  const [isLoading, setLoading] = useState(false); //로딩여부
  const [tweet, setTweet] = useState(""); // 트윗 내용
  const [file, setFile] = useState(null); //파일(이미지)
  const onChange = (e) => {
    setTweet(e.target.value);
  };
  const onFileChange = (e) => {
    const { files } = e.target;
    if (files && files.length === 1) {
      setFile(files[0]);
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const user = auth.currentUser;
    //유저 정보가 없거나, 로딩상태거나, 트윗 내용이 없거나,180자 이상이면 리턴한다.
    if (!user || isLoading || tweet === "" || tweet.length > 180) return;
    try {
      setLoading(true);
      //파이어 스토어에 tweet 저장하기 -> addDoc
      await addDoc(collection(db, "tweets"), {
        tweet, //tweet : tweet과 동일한 코드
        createdAt: Date.now(),
        username: user.displayName || "익명",
        userId: user.uid,
      });
    } catch (e) {
      //에러가 날 경우에 콘솔로 출력함.
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form onSubmit={onSubmit}>
      <TextArea
        rows={5}
        maxLength={180}
        onChange={onChange}
        value={tweet}
        placeholder="What is happening?!"
      />
      {/* file을 입력할 수 있는 input창 이미지 파일만 가능하다. */}
      <AttachFileButton htmlFor="file">
        {file ? "Photo added ✅" : "Add photo"}
      </AttachFileButton>
      <AttachFileInput
        onChange={onFileChange}
        type="file"
        id="file"
        accept="image/*"
      />
      <SubmitBtn
        type="submit"
        value={isLoading ? "Posting..." : "Post Tweet"}
      />
    </Form>
  );
};

export default PostTweetForm;
