<script>
  export let firstName = "";
  export let lastName = "";
  export let id = null;
  export let picture;
  export let requestSentTo = false;
  export let friends = false;
  export let requestReceived = false;
  export let socket;
  export let from;
  import {chatRoom} from '$lib/store/store.js'
  function clickHandel() {
    fetch("/api/sendRequest", {
      method: "POST",
      body: JSON.stringify({ id }),
      headers: {
        "content-type": "application/json",
      },
    })
      .then(async (res) => {
        if (!res.ok) throw res.json();
        requestSentTo = true;
        socket.emit("notification", {
          to: id,
          notificationId: "requestSent",
        });
      })

      .catch((e) => {
        console.log(e);
      });
  }

  function acceptRequest(accept) {
    fetch("/api/acceptRequest", {
      method: "POST",
      body: JSON.stringify({ id, accept }),
      headers: {
        "content-type": "application/json",
      },
    })
      .then((res) => {
        if (!res.ok) throw res.json();
        requestSentTo = false;
        requestReceived = false;
        if (accept) {
          friends = true;
        } else {
          friends = false;
        }
        return res;
      })
      .then((res) => {
        console.log(res.json());
      })
      .catch((e) => {
        console.log(e);
      });
  }
  const getChatRoomReady = () =>{
    fetch("/api/getChatRoom", {
      method: "POST",
      body: JSON.stringify({ id, from }),
      headers: {
        "content-type": "application/json",
      },
    })
    .then(res=>{
      if(!res.ok) throw res;
      return res.json();
    })
    .then(res=>{
      if(res.length){
          chatRoom.update(()=>{
      return {
        chatId:res[0].id,
      to:id,
      from,
      picture,
      firstName,
      lastName
    }
    })
      }

    })
    .catch(err=>{
      console.log(err)
    })

  }




</script>

<div class={`alert mb-1  rounded-none border-l-4 ${$chatRoom.to === id ? "border-r-0 bg-[#e5e5fe]" : "border-r-4"} border-[#271c46]`}>
  <div>
    <div class="w-12 rounded-full">
      <img src={picture} />
    </div>
    <span> {firstName || ""} {lastName || ""}</span>
  </div>
  <div class="flex-none">
    {#if requestSentTo}
      <button class="btn btn-xs btn-ghost btn-disabled">Request Sent</button>
    {:else if requestReceived}
      <button class="btn btn-xs btn-ghost" on:click={() => acceptRequest(false)}
        >Deny</button
      >
      <button
        class="btn btn-xs btn-primary"
        on:click={() => acceptRequest(true)}>Accept</button
      >
    {:else if friends}
      <button class="btn btn-xs btn-primary" on:click={getChatRoomReady}>Message</button>
    {:else}
      <button on:click={clickHandel} class="btn btn-xs btn-primary">
        Add
      </button>
    {/if}
  </div>
</div>
