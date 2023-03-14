<script>
  import Icon from "@iconify/svelte";
  export let firstName = "";
  export let lastName = "";
  export let id = null;
  export let picture;
  export let requestsReceived = false;
  export let requestedTo = false;
  export let friends = false;
</script>

<div
  class="card w-full bg-base-100  rounded-none bg-transparent border-b border-b-[#533d8f]"
>
  <div class="card-body py-3">
    <div class="flex items-center justify-between">
      <div class="flex  gap-3 items-center">
        <div class="avatar">
          <div class="w-12 rounded-full">
            <img src={picture} />
          </div>
        </div>
        <span class="text-white"> {firstName} {lastName} </span>
      </div>
      <div class="flex gap-2">
        {#if requestsReceived}
          request sent
        {:else if requestedTo}
          accept request
        {:else if friends}
          message
        {:else}
          <Icon
            icon="mdi:user-add-outline"
            class="text-white text-2xl cursor-pointer hover:text-slate-300"
          />
        {/if}
      </div>
    </div>
  </div>
</div>
