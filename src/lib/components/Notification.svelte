<script>
  export let notify;

  function acceptRequest(accept) {
    fetch("/api/acceptRequest", {
      method: "POST",
      body: JSON.stringify({
        id: notify.from,
        accept,
        notificationId: notify.id,
      }),
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
</script>

<div class="alert mb-1  rounded-none border-x-4 border-[#271c46]">
  <div>
    <span>{notify.message}</span>
  </div>
  {#if !notify.message.includes("accepted")}
    <div class="flex-none">
      <button on:click={() => acceptRequest(false)} class="btn btn-sm btn-ghost"
        >Deny</button
      >
      <button
        on:click={() => acceptRequest(true)}
        class="btn btn-sm btn-primary">Accept</button
      >
    </div>
  {/if}
</div>
