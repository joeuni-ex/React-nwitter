import { deleteDoc, doc } from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import { styled } from "styled-components";
import { auth, db, storage } from "../firebase";

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: 3fr 1fr;
  padding: 20px;
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 15px;
  margin-bottom: 10px;
`;

const Column = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const Photo = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 15px;
`;

const Username = styled.span`
  font-weight: 600;
  font-size: 15px;
`;

const Payload = styled.p`
  margin: 10px 0px;
  font-size: 18px;
`;

const DeleteButton = styled.button`
  background-color: tomato;
  color: white;
  font-weight: 600;
  border: 0;
  font-size: 12px;
  padding: 5px 10px;
  text-transform: uppercase;
  border-radius: 5px;
  cursor: pointer;
`;

const Tweet = ({ username, photo, tweet, userId, id }) => {
  const user = auth.currentUser; // 인증한 유저 가져오기(현재 로그인 유저)

  //삭제 버튼을 클릭했을 경우 실행되는 함수
  const onDelete = async () => {
    //확인 누르면 true로 삭제를 실행한다.
    const ok = confirm("해당 트윗을 삭제하시겠습니까?");
    //현재 로그인 되어있는 유저의 아이디와 트윗 작성자의 id와 동일하지 않으면 리턴한다. (user가 있으면 uid를 가져옴)
    if (!ok || user?.uid !== userId) return;
    try {
      //1. DB의 트윗 삭제
      //tweets컬렉션의 id에 해당하는 문서(DB)를 삭제한다.
      await deleteDoc(doc(db, "tweets", id));
      //2. 이미지 삭제
      //만약 사진이 있으면 사진도 스토리지에서 삭제한다.
      if (photo) {
        const photoRef = ref(storage, `tweets/${user.uid}/${id}`);
        await deleteObject(photoRef);
      }
    } catch (e) {
      //오류가 있으면 콘솔로 출력한다.
      console.log(e);
    } finally {
      //
    }
  };
  return (
    <Wrapper>
      <Column>
        <Username>{username}</Username>
        <Payload>{tweet}</Payload>
        <div>
          {/* 현재 인증되어있는 유저가 있으면 게시글 작성자 id와 비교해서 동일할 경우에만 버튼이 출력된다.  */}
          {user?.uid === userId ? (
            <DeleteButton onClick={onDelete}>Delete</DeleteButton>
          ) : null}
        </div>
      </Column>
      <Column>{photo ? <Photo src={photo} /> : null}</Column>
    </Wrapper>
  );
};

export default Tweet;
