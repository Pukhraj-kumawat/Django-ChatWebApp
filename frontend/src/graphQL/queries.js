import { gql } from "@apollo/client";

export const GET_CHAT_MESSAGES = gql`
  query GetChatMessages($yourUserId: Int!, $chatUserId: Int!) {
    chatMessages(chatUserId: $chatUserId, yourUserId: $yourUserId) {
      id
      sender {
        id
        username
      }
      recipient {
        id
        username
      }
      chatUserId
      content
      timestamp
      isRead
      parent{
        id
        sender{
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
`;

export const GET_USER = gql`
  query GetSingleUser($userId: Int!) {
    user(userId: $userId) {
      firstName
      lastName
      username
      mobileNo
      email
    }
  }
`;

export const GET_ALL_USERS = gql`
  query GetAllUsers($yourUserId: Int!) {
    allUsers(yourUserId: $yourUserId) {
      id
      firstName
      lastName
      username
      mobileNo
      profilePicture
    }
  }
`;

export const CREATE_CHAT_MESSAGE = gql`
  mutation CreateMessageMutation(
    $senderUserId: Int!
    $recipientUserId: Int!
    $content: String!
    $replyTo:String
  ) {
    createMessage(
      input: {
        sender: $senderUserId
        recipient: $recipientUserId
        content: $content
        replyToId:$replyTo
      }
    ) {      
      message {
        isRead
        id
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

        parent {
          id
          sender{
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
  }
`;

export const UPDATE_PROFILE = gql`
  mutation UpdateProfileMutation(
    $userId: ID!
    $firstName: String!
    $lastName: String!
    $mobileNo: String!
    $email:String!
  ) {
    updateProfile(
      input: {
        userId: $userId
        firstName: $firstName
        lastName: $lastName
        mobileNo: $mobileNo
        email:$email
      }
    ) {
      customUser {
        id
        firstName
        lastName
        mobileNo
      }
    }
  }
`;

