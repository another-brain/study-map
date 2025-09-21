import { defineStore } from 'pinia';

export const useMessageStore = defineStore('message', () => {
    const queue = ref(new Array<rawMessage>());
    function send(message: Message) {
        queue.value.push({
            text: message.content,
            color: message.type,
            timeout: 2000
        });
    }
    function set(newValue: rawMessage[]) {
        queue.value = newValue;
    }
    return {
        queue,
        set,
        send
    };
});

type rawMessage = {
    text: string;
    color: string;
    timeout: number;
};

export type Message = {
    content: string;
    type: MessageType;
};

export const enum MessageType {
    Error = 'error',
    Info = 'primary'
}
