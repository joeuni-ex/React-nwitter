import { addDoc, collection, updateDoc } from "firebase/firestore";
import { useState } from "react";
import { styled } from "styled-components";
import { auth, db, storage } from "../firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

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

  //트윗의 내용의 변경 시 트윗 내용 저장
  const onChange = (e) => {
    setTweet(e.target.value);
  };

  //파일 변경 시 파일의 url 저장
  const onFileChange = (e) => {
    const { files } = e.target;
    if (files && files.length === 1) {
      const changeIamage = files[0];
      if (changeIamage.size > 1000 * 1000) {
        alert("이미지 사이즈는 1MB 이하로 해주세요");
        setFile(null);
        return;
      }
      setFile(changeIamage);
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
      const doc = await addDoc(collection(db, "tweets"), {
        tweet, //tweet : tweet과 동일한 코드
        createdAt: Date.now(),
        username: user.displayName || "익명",
        userId: user.uid,
      });
      if (file) {
        //먼저 이미지를 저장할 참조 주소를 만든다.(tweets/유저아이디/문서아이디/이미지명.jpg)
        //나중에 가져올 때 쉽게 가져오게하기위해서
        const locationRef = ref(storage, `tweets/${user.uid}/${doc.id}`);

        //파일을 서버에 저장하는 함수
        const result = await uploadBytes(locationRef, file); //파일업로드
        const url = await getDownloadURL(result.ref); //파일의 주소

        //photo라는 항목을 만들어서 url을 추가한다.
        await updateDoc(doc, {
          photo: url,
        });
        setTweet(""); // 저장이 끝난 후에 트윗내용을 삭제함
        setFile(null); // 파일도 삭제함
      }
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
