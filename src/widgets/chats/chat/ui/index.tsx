import {BackButton} from "@box/shared/ui";
import React, {
    FC,
    FormEventHandler,
    useEffect,
    useRef,
    useState,
} from "react";
import SendButtonIcon from "@assets/icons/40_green_send_button.svg";
import {ChatsInput, ChatsMessage, ChatModel} from "@box/entities/chat";
import {useWebSocket} from "@box/shared/hooks/useWebSocket";
import Cookies from "js-cookie";
import {useEvent, useStore} from "effector-react";
import {sendMessageFx} from "@box/entities/chat/model/chat.model";
import {WebSocketService} from "@box/shared/services";
import {$authStore} from "@box/entities/auth";
import classNames from "classnames";
import AvatarIcon from "@assets/icons/User Groups.svg";
import {IChatWidget} from "../types";
import s from './style.module.scss';
import IconUserForAuth from "@assets/icons/24_user.svg";
import {Avatar} from "@box/entities/user";
import dotenv from 'dotenv';

dotenv.config();

export const ChatWidget: FC<IChatWidget> = ({mini, chatId, name}) => {
    const contentScrollRef = useRef<HTMLDivElement>(null);

    const [connected, setConnected] = useState(false);

    const messages = useStore(ChatModel.$chatMessages);
    const chatMessageInput = useStore(ChatModel.$chatMessageInput);
    const chat = useStore(ChatModel.$chatModel);

    const changeMessageEvent = useEvent(ChatModel.changeInputMessage);
    const chatInputReset = useEvent(ChatModel.chatInputReset);
    const addMessage = useEvent(ChatModel.pushNewMessage);
    const getMessages = useEvent(ChatModel.getMessagesFx);
    const readChat = useEvent(ChatModel.readChatFx);

    const isLoading = useStore(ChatModel.$messagesLoading.$loaderStore);
    const {user} = useStore($authStore);

    const onMessage = (msg: MessageEvent<string>) => {
        addMessage(WebSocketService.parseJsonData(msg.data));
    };
    const onOpen = () => {
        setConnected(true);
    };
    const onClose = (event: CloseEvent) => {
        console.log("Chat socket has beed closed.")
    };
    const onError = (event: Event) => {
        console.log("Chat socket has gotten an error.")
    };

    const sendMessage = () => {
        if (connected) {
            sendMessageFx({id: chatId, content: chatMessageInput});
            readChat(chatId);
            chatInputReset();
        }
    };
    const onSubmit: FormEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault();
        sendMessage();
    };

    useEffect(() => {
        getMessages(chatId);
        readChat(chatId);
    }, [chatId]);

    useWebSocket(
        `${process.env.NEXT_PUBLIC_WS_URL}/ws/chat/${chatId}/?token=${Cookies.get(
            "access_token"
        )}`,
        onMessage,
        onOpen,
        onClose,
        onError
    );

    useEffect(() => {
        contentScrollRef.current?.scroll({
            top: contentScrollRef.current?.scrollHeight,
        });
    });

    if (isLoading) return null;

    const messagesStyleContainer = classNames(
        "w-full overflow-y-auto overflow-x-hidden px-3 py-2",
        {
            "flex items-center justify-center": !messages?.length,
            "h-[24rem]": !mini,
            "h-[16rem]": mini,
        },
        s.scrollbar
    );

    return (
        <div className="bg-slate-500 cursor-pointer relative">
            {!mini ? <BackButton>Вернуться к списку чатов</BackButton> : null}
            <div
                className={classNames(
                    "mt-2 bg-grey-10 rounded-[1.25rem] w-full",
                    {"max-h-[32rem] h-[32rem]": !mini},
                    {"max-h-[24rem] h-[24rem]": mini}
                )}
            >
                <div
                    className="h-14 px-3 bg-grey-10 flex items-center border-b-[1px] border-[#E8E8E8] z-20 w-full rounded-t-[1.25rem]">
                    <AvatarIcon/>
                    <p className="ml-2.5 text-sm font-medium">
                        {name ? name : chat?.name}
                    </p>
                </div>
                <div ref={contentScrollRef} className={messagesStyleContainer}>
                    {!messages?.length ? (
                        <div>Сообщений пока нет</div>
                    ) : (
                        messages.map((message) => (

                            <ChatsMessage
                                key={message.id}
                                fromMe={message.author.id === user?.id}
                                createdAt={message.createdAt}
                                //@ts-ignore
                                title={message.author?.company.name}
                                avatar={message.author?.id ? <Avatar className="shrink-0" size="sm"
                                                                     url={process.env.NEXT_PUBLIC_API_URL + message.author.company?.image || ''}/> :
                                    <IconUserForAuth/>}>

                                {message.content}
                            </ChatsMessage>
                        ))
                    )}
                </div>
                <form
                    onSubmit={onSubmit}
                    className="h-[4.5rem] px-3 border-t-[1px] border-[#E8E8E8] border-b-0 border-b flex justify-between items-center"
                >
                    <ChatsInput
                        mini={mini}
                        value={chatMessageInput}
                        onChange={changeMessageEvent}
                    />
                    <div onClick={sendMessage}>
                        <SendButtonIcon/>
                    </div>
                </form>
            </div>
        </div>
    );
};
