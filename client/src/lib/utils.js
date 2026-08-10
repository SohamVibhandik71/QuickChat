export function formatMessageTime(date){
    const messageDate = new Date(date);

    if(Number.isNaN(messageDate.getTime())) return "";

    return messageDate.toLocaleTimeString("en-US",{
        hour : "2-digit",
        minute : "2-digit",
        hour12 : false
    })
}

