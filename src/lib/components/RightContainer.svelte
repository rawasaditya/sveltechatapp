<script>
  import { chatRoom } from "$lib/store/store.js";
  import chatsvg from "$img/chat.svg" 
  export let socket;

  let messages = []

  let chatRoomDetails = {};
  chatRoom.subscribe((value) => {
    chatRoomDetails = value;
  });
  let message = ""
  const sendMessage = () =>{
    messages = [...messages, {
      target:"chat-end",
      message
    }]

    socket.emit("sent",{
      chatId:chatRoomDetails.chatId,
      to:chatRoomDetails.to,
      from:chatRoomDetails.from,
      message
    })

    fetch("/api/saveMessage", {
      method: "POST",
      body: JSON.stringify({
      to:chatRoomDetails.to,
      from:chatRoomDetails.from,
      message,
      chatId:chatRoomDetails.chatId
    }),
      headers: {
        "content-type": "application/json",
      },
    })
    .then(res=>{
      if(!res.ok) throw res.json()
      return res.json()
    })
    .then(res=>{
      console.log(res)
    })
    .catch(err=>{
      console.error(err)
    })

    message=""
  }

  socket.on("receive",(data)=>{
    console.log(chatRoomDetails)
    if(data.chatId === chatRoomDetails.chatId){
      messages = [...messages, {
      target:"chat-start",
      message:data.message
    }]
    }
  })
  $: msgs = messages
</script>
{#if Object.keys(chatRoomDetails).length}
  <div class="bg-[#e5e5fe] min-h-[100%]  overflow-y-auto">

    <div class="alert mb-1 rounded-none  bg-base-100 shadow-lg"><div><div class="w-12 rounded-full"><img src={chatRoomDetails.picture}></div> <span>    {chatRoomDetails.firstName}
      {chatRoomDetails.lastName}</span></div> </div>
    <div class="h-[51rem] overflow-y-auto py-10">
      {#each messages as msg, i}
      <div class={`chat ${msg.target}`}>
        <div class={`chat-bubble ${msg.target === "chat-start" ? "bg-white text-slate-600" : ""}`}>{msg.message}</div>
      </div>
      {/each}
    </div>
    <div class=" pb-10 mx-3 pb-5 bg-transparent">
      <div class="w-full flex gap-0 items-center rounded-full overflow-hidden ">
        <input
          type="text"
          bind:value={message}
          on:keydown={(e)=> e.keyCode===13 ? sendMessage() : null}
          placeholder="Type here"
          class="input input-bordered input-md w-full rounded-none border-0 outline-none"
        />
        <button on:click={sendMessage} class="btn btn-primary  rounded-none border-none outline-none "
          >Send</button
        >
      </div>
    </div>
  </div>
  {:else}
  <div class="flex h-full justify-center">
    <img src={chatsvg} class="w-1/2"/>
  </div>
{/if}
