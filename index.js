import { getPosts, postPosts, deleteFetch, fetchPostsUser, toggleLike, dislikeLike } from "./api.js";
import { renderAddPostPageComponent } from "./components/add-post-page-component.js";
import { renderAuthPageComponent } from "./components/auth-page-component.js";
import {
  ADD_POSTS_PAGE,
  AUTH_PAGE,
  LOADING_PAGE,
  POSTS_PAGE,
  USER_POSTS_PAGE,
} from "./routes.js";
import { renderPostsPageComponent } from "./components/posts-page-component.js";
import { renderUserPostComponent } from "./components/user-page-component.js";
import { renderLoadingPageComponent } from "./components/loading-page-component.js";
import {
  getUserFromLocalStorage,
  removeUserFromLocalStorage,
  saveUserToLocalStorage,
} from "./helpers.js";

export let user = getUserFromLocalStorage();
export let page = null;
export let posts = [];
export let postsUser = [];

const getToken = () => {
  const token = user ? `Bearer ${user.token}` : undefined;
  return token;
};

export const logout = () => {
  user = null;
  removeUserFromLocalStorage();
  goToPage(POSTS_PAGE);
};

function getAPI() {
  return getPosts({ token: getToken() })
    .then((newPosts) => {
      page = POSTS_PAGE;
      posts = newPosts;
      renderApp();
    })
    .catch((error) => {
      console.error(error);
      goToPage(POSTS_PAGE);
    });
}

function getAPIuser(data) {
  return fetchPostsUser(data.userId, { token: getToken() })
    .then((newPosts) => {
      page = USER_POSTS_PAGE;
      postsUser = newPosts;
      renderApp();
    })
    .catch((error) => {
      console.error(error);
      goToPage(POSTS_PAGE);
    });
}

export const goToPage = (newPage, data) => {
  if (
    [
      POSTS_PAGE,
      AUTH_PAGE,
      ADD_POSTS_PAGE,
      USER_POSTS_PAGE,
      LOADING_PAGE,
    ].includes(newPage)
  ) {
    if (newPage === ADD_POSTS_PAGE) {
      page = user ? ADD_POSTS_PAGE : AUTH_PAGE;
      return renderApp();
    }

    if (newPage === POSTS_PAGE) {
      page = LOADING_PAGE;
      renderApp();
      return getAPI();

    }

    if (newPage === USER_POSTS_PAGE) {
      console.log("Открываю страницу пользователя: ", data.userId);
      page = LOADING_PAGE;
      renderApp();
      return getAPIuser(data);
    }

    page = newPage;
    renderApp();

    return;
  }

  throw new Error("страницы не существует");
};

const renderApp = () => {
  const appEl = document.getElementById("app");
  if (page === LOADING_PAGE) {
    return renderLoadingPageComponent({
      appEl,
      user,
      goToPage,
    });
  }

  if (page === AUTH_PAGE) {
    return renderAuthPageComponent({
      appEl,
      setUser: (newUser) => {
        user = newUser;
        saveUserToLocalStorage(user);
        goToPage(POSTS_PAGE);
      },
      user,
      goToPage,
    });
  }

  if (page === ADD_POSTS_PAGE) {
    return renderAddPostPageComponent({
      appEl,
      onAddPostClick({ description, imageUrl }) {
        postPosts({ token: getToken(), description, imageUrl })
          .then(() => {
            goToPage(POSTS_PAGE);
          })
          .catch((error) => {
            if (error.message === "Сервер сломался") {
              alert("Сервер сломался, попробуйте позже");
              postPosts({ token: getToken(), description, imageUrl });
            } else {
              alert('Кажется, у вас сломался интернет, попробуйте позже');
              console.log(error);
            }
          });
      },
    });
  }

  if (page === POSTS_PAGE) {
    return renderPostsPageComponent({
      appEl,
    });
  }

  if (page === USER_POSTS_PAGE) {
    return renderUserPostComponent({
      appEl, token: getToken(), user: getUserFromLocalStorage()
    });
  }
};

goToPage(POSTS_PAGE);

export function deletePost(id) {
  if (user) {
    deleteFetch({ token: getToken() }, id)
      .then((newPosts) => {
        posts = newPosts;
        getAPI();
      })
  };
};

export function putLikes(id, data) {
  if (page === USER_POSTS_PAGE) {
  toggleLike(id, { token: getToken() })
    .then(() => {
      getAPIuser(data)
    })
    .catch((error) => {
      console.error(error)
      goToPage(AUTH_PAGE);
    });
  } else {
    toggleLike(id, { token: getToken() })
    .then(() => {
      getAPI()
    })
    .catch((error) => {
      console.error(error)
      goToPage(AUTH_PAGE);
    });
  }
};

export function removeLikes(id, data) {
  if (page === USER_POSTS_PAGE) {
  dislikeLike(id, { token: getToken() })
    .then(() => {
      getAPIuser(data)
    })
    .catch((error) => {
      console.error(error)
      goToPage(AUTH_PAGE);
    });
  } else {
    dislikeLike(id, { token: getToken() })
    .then(() => {
      getAPI()
    })
    .catch((error) => {
      console.error(error)
      goToPage(AUTH_PAGE);
    });
  }
};