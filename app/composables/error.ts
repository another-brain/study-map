export const useNoticeError = (...errors: Ref<Error | undefined>[]) => {
    const { send } = useMessageStore();
    return watch(errors, errors => {
        for (const error of errors) {
            if (error) {
                send({
                    content: error.message,
                    type: MessageType.Error
                });
            }
        }
    });
};
