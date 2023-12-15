import { Badge, Flex, Image, Text, Tooltip } from "@mantine/core";
import readChatProfileLogo from "assets/readChatProfileLogo.svg";
import selectedChatProfileLogo from "assets/selectedChatProfileLogo.svg";
import { ChronologyName, FilterName, SubFilterName } from "components/types";
import useDashboard from "hooks/useDashboard";
import _ from "lodash";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { ISelectedPage, setActiveChat, setNewMessageToFalse, setSelectedPage } from "reducer/slice";
import styled from "styled-components";
import { getTime, preProcessText } from "util/dashboardUtils";
import {
  useLocation
} from "react-router-dom";

enum ITicketType {
  OPEN = "Open",
  RESOLVED = "Resolved",
}

const MessageBox = styled.div`
    cursor: pointer;
    margin-top: 0px;
    margin-bottom: 0px;
    background-color: ${(props: { selected: boolean }) =>
        props.selected ? "#F5F8FF" : ""};
    padding: 12px 16px;
    color: ${(props: { selected: boolean }) => (props.selected ? "" : "")};
    border-radius: 0px;
    border-bottom: 1px solid #eaecf0;
    background-colo: red;
    &:hover {
        background-color: #f2f5fa; // Change to the desired hover background color
    }
`;

const Wrapper = styled.div`
      height: calc(100vh - 179px);
    overflow: auto;

`;

const DetailWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

const SmallCircle = styled.span`
  display: inline-block;
  width: 6px;
  height: 6px;
  margin-right: 5px;
  background-color: ${(props: { status: ITicketType }) =>
    props.status === ITicketType.OPEN ? "red" : "green"};
  border-radius: 50%;
`;


type ITicketStatusBadge = {
  ticketType: ITicketType;
};

const TicketStatusBadge = ({ ticketType }: ITicketStatusBadge) => {
  return (
      <>
          <Badge
              size="sm"
              variant="dot"
              radius="sm"
              color={ticketType == ITicketType.OPEN ? "red" : "green"}
          >
              {" "}
              
              {ticketType}
          </Badge>
      </>
  );
};

const MessageContainer = () => {
  const { inbox:{selectedFilter, selectedSubFilter, selectedChronology, ticketFilterText,allConversations}, user, activeChat, channelsInfo, selectedPage } = useDashboard();
  const dispatch = useDispatch();
  const location = useLocation();
  const handleClick = ({ type, name, channelId }: ISelectedPage) => {
    dispatch(
      setSelectedPage({
        type,
        name,
        channelId,
      })
    );
  };

  useEffect(()=>{
       // read channelId param from url
       const queryParameters = new URLSearchParams(location.search)
       // if the url has channelId param, set the channelId
       const channelIdInUrl = queryParameters.get("channelId");
       const ticketIdInUrl = queryParameters.get("ticketId");
   
       if (channelIdInUrl) {
   
       localStorage.setItem(
         "userstak-dashboard-channelId",
         channelIdInUrl
       );
       handleClick({
         type: "detail",
         name: "inbox",
         channelId: channelIdInUrl,
       });
       //@ts-ignore
       dispatch(setActiveChat(null));

       if (ticketIdInUrl) {
          const conversation = allConversations.find(
            (ticket) => ticket.ticketId === ticketIdInUrl
          );
          if (conversation) {
            dispatch(setActiveChat(conversation));
            dispatch(setNewMessageToFalse(conversation.ticketId));
          }
       }
     } else {
      //@ts-ignore
    dispatch(setSelectedPage({ type: "detail", name: "inbox", channelId: channelsInfo.channels[0].channelId }));
     }
  },[])
  
  return (
    <Wrapper>
      {allConversations
        .filter((conversation) => {
          //@ts-ignore
          if (selectedPage.type === 'detail' && selectedPage.name === 'inbox' && ((selectedPage.channelId || channelsInfo.channels[0].channelId) === conversation.channelId)) {
            return true;
          }
          return false;
        }).sort((a, b) => {
          if (selectedChronology === ChronologyName.OLDEST) {
            // Sort in ascending order (recent first)
            return a.createdAt - b.createdAt;
          } else if (selectedChronology === ChronologyName.RECENT) {
            // Sort in descending order (oldest first)
            return b.createdAt - a.createdAt;
          }
          return 0;
        })
        .filter((conversation) => {
          // Filter responsible for Ticket Status
          if (selectedFilter === FilterName.SHOW_ALL) return true;
          if (selectedFilter === FilterName.SHOW_OPENED && conversation.isOpen)
            return true;
          if (selectedFilter === FilterName.SHOW_CLOSED && !conversation.isOpen)
            return true;
          return false;
        })
        .filter((conversation) => {
          // Filter responsible for Ticket Assignment
          if (selectedSubFilter === SubFilterName.SHOW_ALL) return true;
          if (
            selectedSubFilter === SubFilterName.SHOW_ASSIGNED &&
            conversation?.assignedUserInfo?.email === user.email
          )
            return true;
          if (
            selectedSubFilter === SubFilterName.SHOW_UNASSIGNED &&
            conversation?.assignedUserInfo?.email !== user.email
          )
            return true;
          return false;
        })
        .filter((ticket) => {
          if (ticketFilterText.trim() === "") {
            // If user input is empty, return all tickets
            return true;
          }
        
          // Check if the user input matches customerEmail or ticketId
          const emailMatch = ticket.customerEmail.toLowerCase().includes(ticketFilterText.toLowerCase());
          const ticketIdMatch = ticket.ticketId.toLowerCase() === ticketFilterText.toLowerCase();
        
          // Return true if there is a match in either customerEmail or ticketId
          return emailMatch || ticketIdMatch;
        })
        .filter((conversation) => {
          // check if channelsInfo[conversation.channelId].members has user._id in it
          if (conversation.channelId) {
            if (
              channelsInfo[conversation.channelId] &&
              channelsInfo[conversation.channelId].members.includes(user.userId)
            )
              return true;
          }
          return false;
        })
        .map((conversation) => {
          const isSelected = activeChat?.ticketId === conversation.ticketId;
          const messageLength = conversation.messages.length;
          const lengthCondition =  messageLength > 1;
          const lastMessageIndex = messageLength - 1;
          const lastMessage = preProcessText(lengthCondition ? conversation.messages[lastMessageIndex].message || '' : conversation.text || '', {
            email: conversation?.customerEmail,
          });
          return (
            <>
              <MessageBox
                onClick={() => {
                  localStorage.setItem("usci", conversation.channelId);
                  dispatch(setActiveChat(conversation));
                  dispatch(setNewMessageToFalse(conversation.ticketId));
                }}
                selected={isSelected}
              >
                <DetailWrapper>
                  <div style={{ width: "100%" }}>
                    <DetailWrapper style={{ marginBottom: "8px" }}>
                      <Text
                        color={isSelected ? "#3054B9" : conversation.hasNewMessage === 1 ? '#344054' :'#667085'}
                        weight={500}
                        style={{ fontSize: "13px" }}
                        size="md"
                      >
                        <Flex align="center">
                          <Image
                            maw={18}
                            mx="auto"
                            src={
                              isSelected
                                ? selectedChatProfileLogo
                                : readChatProfileLogo
                            }
                            alt="Random image"
                            style={{ marginRight: "8px" }}
                          />
                          {conversation.customerEmail}
                        </Flex>
                      </Text>
                      <TicketStatusBadge
                        ticketType={
                          conversation.isOpen
                            ? ITicketType.OPEN
                            : ITicketType.RESOLVED
                        }
                      />
                    </DetailWrapper>
                    <DetailWrapper>
                      <Flex
                        justify={"space-between"}
                        style={{ width: "100%" }}
                        align={"center"}
                      >
                        <Tooltip
                          multiline
                          position="bottom-end"
                          style={{
                            maxWidth: "320px",
                          }}
                          label={lastMessage}
                        >
                          <Text
                            style={{
                              maxWidth: "60%",
                              width: "wrap-content",
                            }}
                            truncate
                            color={isSelected ? "#3054B9" : conversation.hasNewMessage === 1 ? '#344054' :'#667085'}
                            weight="500"
                            size="13px"
                          >
                            {lastMessage}
                          </Text>
                        </Tooltip>
                        <Text
                          color={isSelected ? "#3054B9" : conversation.hasNewMessage === 1 ? '#344054' :'#667085'}
                          weight={500}
                          size="13px"
                        >
                          {getTime(_.toString(conversation?.createdAt))}
                        </Text>
                      </Flex>
                    </DetailWrapper>
                  </div>
                </DetailWrapper>
              </MessageBox>
            </>
          );
        })}
    </Wrapper>
  );
};

export default MessageContainer;