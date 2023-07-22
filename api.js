const personalKey = "alexander-shmygin";
const baseHost = "https://webdev-hw-api.vercel.app";
const postsHost = `${baseHost}/api/v1/${personalKey}/instapro`;

export function getPosts({ token }) {
  return fetch(postsHost, {
    method: "GET",
    headers: {
      Authorization: token,
    },
  })
    .then((response) => {
      if (response.status === 401) {
        throw new Error("Нет авторизации");
      }

      return response.json();
    })
    .then((data) => {
      return data.posts;
    });
}

export function registerUser({ login, password, name, imageUrl }) {
  return fetch(baseHost + "/api/user", {
    method: "POST",
    body: JSON.stringify({
      login,
      password,
      name,
      imageUrl,
    }),
  }).then((response) => {
    if (response.status === 400) {
      throw new Error("Такой пользователь уже существует");
    }
    return response.json();
  });
}

export function loginUser({ login, password }) {
  return fetch(baseHost + "/api/user/login", {
    method: "POST",
    body: JSON.stringify({
      login,
      password,
    }),
  }).then((response) => {
    if (response.status === 400) {
      throw new Error("Неверный логин или пароль");
    }
    return response.json();
  });
}

// Загружает картинку в облако, возвращает url загруженной картинки
export function uploadImage({ file }) {
  const data = new FormData();
  data.append("file", file);

  return fetch(baseHost + "/api/upload/image", {
    method: "POST",
    body: data,
  }).then((response) => {
    return response.json();
  });
}

export const postPosts = ({ token, description, imageUrl }) => {
  return fetch(postsHost, {
    method: "POST",
    body: JSON.stringify({
      description,
      imageUrl,
    }),
    headers: {
      Authorization: token,
  }
  })
    .then((response) => {
      if (response.status === 500) {
        throw new Error("Сервер сломался");
      } else if (response.status === 400) {
        throw new Error("Плохой запрос");
      } else {
        return response.json();
      }
    })

}

export function deleteFetch({ token } ,id ) {
  return fetch(`${postsHost}/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: token,
      },
    })
      .then((response) => {
        return response.json();
      })
}

export function fetchPostsUser( id , { token }) {
  return fetch(`${postsHost}/user-posts/${id}`, {
    method: "GET",
    headers: {
      Authorization: token,
    },
  })
    .then((response) => {
      if (response.status === 401) {
        throw new Error("Нет авторизации");
      }
      return response.json();
    })
    .then((data) => {
      return data.posts;
    });
}

export const toggleLike = (id, {token}) => {
  return fetch(`${postsHost}/${id}/like`, {
    method: "POST",
    headers: {
      Authorization: token,
    },
  })
  .then((response) => {
    if (response.status === 200) {
      return response.json();
    }
    throw new Error("Лайкать посты могут только авторизованные пользователи");
  })
}

export const dislikeLike = (id, {token}) => {
  return fetch(`${postsHost}/${id}/dislike`, {
    method: "POST",
    headers: {
      Authorization: token,
    },
  }) 
  .then((response) => {
    if (response.status === 200) {
      return response.json();
    }
    throw new Error("Лайкать посты могут только авторизованные пользователи");
  })
}