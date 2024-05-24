interface CallbackEvent extends Event {
    readonly callback : function;
}
interface callBackEventInit extends EventInit {
    callback?: function;
}

declare const callbackEvent: {
    prototype: CallbackEvent;
    new(type: string, eventInitDict?: callBackEventInit): CallbackEvent;
};

export default {callbackEvent}