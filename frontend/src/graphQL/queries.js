import { gql } from '@apollo/client';

export const GET_CHAT_MESSAGES = gql`
query GetChatMessages($yourUserId: Int!,$chatUserId:Int!){
    chatMessages(chatUserId:$chatUserId,yourUserId:$yourUserId){
      content
    }
  }
`;

export const GET_ALL_USERS = gql`
query GetAllUsers{
  allUsers{
    id
    firstName
    lastName
    username
    mobileNo
  }
}
`
