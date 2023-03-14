<script>
  import Header from "./Header.svelte";
  import Icon from "@iconify/svelte";
  import UsersPills from "./UsersPills.svelte";
  let users = [];
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
</script>

<div class="bg-[#271c46] h-full ">
  <div class="shadow-lg pb-1 mb-2">
    <Header />
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
  <div>
    {#each users as user}
      <UsersPills
        firstName={user.firstName}
        lastName={user.lastName}
        id={user.id}
        picture={user.picture}
      />
      {JSON.stringify(user.requestsReceived)}
    {/each}
  </div>
</div>
