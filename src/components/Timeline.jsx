import {
  collection,
  getDocs,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { styled } from "styled-components";
import { db } from "../firebase";
import Tweet from "./Tweet";

const Wrapper = styled.div`
  margin-top: 20px;
`;
const Timeline = () => {
  const [tweets, setTweet] = useState([]);

  useEffect(() => {
    let unsub = null;

    //트윗 가져오는 함수
    const fetchTweets = async () => {
      //tweets 컬렉션에서 가져온다.
      //작성일자 기준으로 내림차순으로 가져온다(최신일자)
      const q = query(collection(db, "tweets"), orderBy("createdAt", "desc"));
      //다 가져올때 까지 기다림
      //const snapshot = await getDocs(q);
      //snapshot안의 docs가 실제 문서임

      //실시간으로 가져오는 작업을 중단하는 함수가 unsub임
      unsub = onSnapshot(q, (snapshot) => {
        //가져온 데이터를 분해해서 리턴한다.
        const tweets = snapshot.docs.map((doc) => {
          const { tweet, createdAt, userId, username, photo } = doc.data();
          return {
            tweet,
            createdAt,
            userId,
            username,
            photo,
            id: doc.id,
          };
        });
        setTweet(tweets); // 트윗에 저장한다.
      });
    };
    fetchTweets(); //모든 트윗들을 가져오기
    return () => unsub();
  }, []);
  return (
    <Wrapper>
      {tweets.map((tweet) => (
        <Tweet key={tweet.id} {...tweet} />
      ))}
    </Wrapper>
  );
};

export default Timeline;
