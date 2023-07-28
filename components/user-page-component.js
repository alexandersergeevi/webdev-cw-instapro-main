import { USER_POSTS_PAGE } from "../routes.js";
import { renderHeaderComponent } from "./header-component.js";
import { postsUser, goToPage } from "../index.js";
import { deletePost, putLikes, removeLikes } from "../index.js"
import { formatDistanceToNow } from "date-fns";
import { ru } from "date-fns/locale"

export function renderUserPostComponent({ appEl }) {

    let userPostsHtml = postsUser.map((post) => {
        return `<li class="post">
  <div class="post-header" data-user-id=${post.user.id}>
      <img src=${post.user.imageUrl} class="post-header__user-image">
      <p class="post-header__user-name">${post.user.name}</p>
  </div>
  <div class="post-image-container">
    <img class="post-image" src=${post.imageUrl}>
  </div>
  <div class="post-likes">
    <button data-id=${post.id} data-liked="${post.isLiked}" class="like-button">
    ${post.isLiked ? `<img src="./assets/images/like-active.svg"></img>`
                : `<img src="./assets/images/like-not-active.svg"></img>`}
    </button>
    <p class="post-likes-text">
      Нравится: <strong>
      ${post.likes.length === 0 ? 0 : post.likes.length === 1 ? post.likes[0].name
                : post.likes[(post.likes.length - 1)].name + ' и еще ' + (post.likes.length - 1)}    
      </strong>
    </p>
  </div>
  <div class="post-block">
  <div>
  <p class="post-text">
    <span class="user-name">${post.user.name}</span>
    ${post.description}
  </p>
  <p class="post-date">
  ${formatDistanceToNow(new Date(post.createdAt), { locale: ru })} назад
  </p>
  </div>
  <button data-id=${post.id}  class="delete-button"></button>
  </div>
</li>`;
    }).join("");

    const appHtml = `
    <div class="page-container">
        <div class="header-container"></div>
        <ul class="posts">
        ${userPostsHtml}
        </ul>
    </div>`;

    appEl.innerHTML = appHtml;

    renderHeaderComponent({
        element: document.querySelector(".header-container"),
    });

    for (let userEl of document.querySelectorAll(".post-header")) {
        userEl.addEventListener("click", () => {
            goToPage(USER_POSTS_PAGE, {
                userId: userEl.dataset.userId,
            });
        });
    };

    const deleteButtons = document.querySelectorAll(".delete-button");

    for (const deleteButton of deleteButtons) {
        deleteButton.addEventListener("click", (event) => {
            event.stopPropagation();
            const id = deleteButton.dataset.id;
            deletePost(id);
        });
    }

    function getLikePost() {

        const likesButton = document.querySelectorAll('.like-button');
        for (const like of likesButton) {
            like.addEventListener("click", (event) => {
                event.stopPropagation();
                const id = like.dataset.id;
                const liked = like.dataset.liked;

                if (liked == 'false') {
                    putLikes(id);
                } else {
                    removeLikes(id);
                }

            })
        }
    };
    getLikePost();

}