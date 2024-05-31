import { gql } from '@apollo/client';

export const GET_CHAT_MESSAGES = gql`
query GetChatMessages($yourUserId: Int!,$chatUserId:Int!){
    chatMessages(chatUserId:$chatUserId,yourUserId:$yourUserId){
      sender{
        id
        username
      }
      recipient{
        id
        username
      }
      chatUserId
      content      
      timestamp
      isRead
    }
  }
`;

export const GET_ALL_USERS = gql`
query GetAllUsers($yourUserId:Int!){
  allUsers(yourUserId:$yourUserId){
    id
    firstName
    lastName
    username
    mobileNo
  }
}
`

export const CREATE_CHAT_MESSAGE = gql`

mutation CreateMessageMutation($senderUserId: Int!, $recipientUserId: Int!, $content: String!) {
  createMessage(input:{
    sender:$senderUserId,
    recipient:$recipientUserId,
    content:$content
  })

  {
    message{
      sender {
        id
        username
      }
      recipient {
        id
        username
      }
      content
      timestamp
    }
  }
}

`