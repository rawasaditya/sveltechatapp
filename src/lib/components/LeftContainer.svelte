<script>
  import Header from "./Header.svelte";
  import Icon from "@iconify/svelte";
  import UsersPills from "./UsersPills.svelte";
  import { page } from "$app/stores";
  import { onMount } from "svelte";
  import NotificationLists from "./NotificationLists.svelte";
  export let socket;

  let users = [];
  let notifications = [];
  let showNotification = false;
  let searchFunction = async (e) => {
    if (e.target.value.trim().length !== 0) {
      const searchString = e.target.value;
      fetch("/api/searchUsers", {
        method: "POST",
        body: JSON.stringify({ search: searchString }),
        headers: {
          "content-type": "application/json",
        },
      })
        .then((res) => {
          if (!res.ok) {
            throw res.json();
          }
          return res.json();
        })
        .then((res) => {
          users = res;
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      users = [];
    }
  };

  const searchDebounce = (e) => {
    let timer;
    clearTimeout(timer);
    timer = setTimeout(() => {
      searchFunction(e);
    }, 750);
  };

  const getNotifications = () => {
    fetch("/api/getNotifications", {
      method: "POST",
      body: JSON.stringify({ id: $page.data.user.id }),
      headers: {
        "content-type": "application/json",
      },
    })
      .then((res) => {
        if(!res.ok) throw res.json()
        return res.json();
      })
      .then((res) => {
        notifications = res;
      }).catch(err=>{
        notifications = []
      })
  };

  const getAllFriends = () => {
    fetch("/api/getAllFriends")
      .then((res) => {
        if (!res.ok) {
          throw res.json();
        }
        return res.json();
      })
      .then((res) => {
        users = res;
      })
      .catch((err) => {
        console.log(err);
      });
  };

  onMount(() => {
    getNotifications();
    getAllFriends();
  });

  socket.emit("connected", $page.data.user.id);


  socket.on("notificationReceived", (msg) => {
    getNotifications();
  });
</script>

<div class="bg-[#271c46] h-full ">
  <div class="shadow-lg pb-1 mb-2">
    <Header notificationsCount={notifications.length} bind:showNotification />
    <div
      class="flex items-center border border-[#3a315a]  mx-4 px-4 py-2 mb-2 "
    >
      <input
        type="type"
        on:keyup={searchDebounce}
        class="outline-none bg-inherit  flex-1  text-white "
        placeholder="Search your friend here"
      />
      <Icon
        icon="material-symbols:search-rounded"
        class="text-white text-center text-2xl"
      />
    </div>
  </div>
  {#if !showNotification}
    <h1 class="text-center text-slate-400 font-bold mb-3">Friends</h1>
    <div>
      {#each users as user}
        <UsersPills
          firstName={user.firstName}
          lastName={user.lastName}
          id={user.id}
          picture={user.picture}
          requestSentTo={user.requestSentTo}
          requestReceived={user.requestReceived}
          friends={user.friends}
          {socket}
          from={$page.data.user.id}
        />
      {/each}
    </div>
  {:else}
    <div>
      <h1 class="text-center text-slate-400 font-bold mb-3">Notifications</h1>
      <NotificationLists {notifications} />
    </div>
  {/if}
</div>
