<script>
  import LeftContainer from "$components/LeftContainer.svelte";
  import RightContainer from "$components/RightContainer.svelte";
  import io from "socket.io-client";

  
  const socket = io("http://localhost:3000", {
    rejectUnauthorized: false,
  });

</script>

<div class="card bg-base-100 shadow-lg rounded-none h-full w-full">
  <div class="w-full grid grid-cols-12 h-full">
    <div class="col-span-4">
      <LeftContainer {socket} />
    </div>
    <div class="col-span-8">
      <RightContainer {socket}/>
    </div>
  </div>
</div>
