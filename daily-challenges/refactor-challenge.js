// ==============================================================
// DAY 4 — Refactor Challenge
// BEFORE: the original "callback hell" example from Week 6
// AFTER:  refactored with error handling, meaningful names,
//         extracted repeated code, and comments
// ==============================================================


// ==============================================================
// BEFORE (the messy original)
// ==============================================================
//
// function getUserData(userId, callback) {
//     setTimeout(() => {
//         callback({ id: userId, name: "John" });
//     }, 1000);
// }
//
// function getUserPosts(userId, callback) {
//     setTimeout(() => {
//         callback([
//             { id: 1, title: "Post 1" },
//             { id: 2, title: "Post 2" }
//         ]);
//     }, 1000);
// }
//
// function getPostComments(postId, callback) {
//     setTimeout(() => {
//         callback([
//             { id: 1, text: "Great post!" },
//             { id: 2, text: "Thanks for sharing" }
//         ]);
//     }, 1000);
// }
//
// getUserData(1, function(user) {
//     console.log("User:", user);
//     getUserPosts(user.id, function(posts) {
//         console.log("Posts:", posts);
//         getPostComments(posts[0].id, function(comments) {
//             console.log("Comments:", comments);
//             // Imagine 3 more levels deep...
//         });
//     });
// });
//
// PROBLEMS WITH THIS CODE:
//   1. No error handling at all — if any step "failed," there's no way to know
//   2. Vague names: "callback" tells you nothing about what it does
//   3. Deep nesting (the "pyramid of doom") — hard to read, hard to reorder
//   4. Repeated setTimeout + callback pattern copy-pasted 3 times
//   5. No comments explaining WHY the delay/simulation exists


// ==============================================================
// AFTER (refactored)
// ==============================================================

// --------------------------------------------------------------
// A single reusable helper that simulates ANY delayed network
// call. This removes the need to repeat "setTimeout + resolve"
// logic in every individual fetch function below.
// --------------------------------------------------------------
function simulateNetworkRequest(resultData, delayMs = 1000, shouldFail = false) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (shouldFail) {
        reject(new Error("Simulated network request failed"));
      } else {
        resolve(resultData);
      }
    }, delayMs);
  });
}

// --------------------------------------------------------------
// Fetches a single user's basic profile data.
// Renamed from "getUserData" -> "fetchUserProfile" to make it
// clear this returns PROFILE info, not posts or comments.
// --------------------------------------------------------------
function fetchUserProfile(userId) {
  if (!userId || userId <= 0) {
    // Fail fast on obviously invalid input, before even
    // "hitting the network" — good practice for real APIs too.
    return Promise.reject(new Error("A valid userId is required"));
  }

  const fakeProfile = { id: userId, name: "John" };
  return simulateNetworkRequest(fakeProfile);
}

// --------------------------------------------------------------
// Fetches all posts written by a given user.
// --------------------------------------------------------------
function fetchUserPosts(userId) {
  const fakePosts = [
    { id: 1, title: "Post 1" },
    { id: 2, title: "Post 2" },
  ];
  return simulateNetworkRequest(fakePosts);
}

// --------------------------------------------------------------
// Fetches all comments on a given post.
// --------------------------------------------------------------
function fetchPostComments(postId) {
  const fakeComments = [
    { id: 1, text: "Great post!" },
    { id: 2, text: "Thanks for sharing" },
  ];
  return simulateNetworkRequest(fakeComments);
}

// --------------------------------------------------------------
// Loads a user's profile, their first post, and that post's
// comments — one flat, readable sequence instead of a pyramid.
//
// Using async/await + try/catch gives us ONE place to catch
// failures from ANY of the three steps, instead of needing
// error handling nested inside every callback.
// --------------------------------------------------------------
async function loadUserFeed(userId) {
  try {
    const userProfile = await fetchUserProfile(userId);
    console.log("User profile loaded:", userProfile);

    const userPosts = await fetchUserPosts(userProfile.id);
    console.log("User posts loaded:", userPosts);

    if (userPosts.length === 0) {
      // Guard clause: nothing to fetch comments FOR, so stop here
      // cleanly instead of letting postComments crash on posts[0].
      console.log("This user has no posts yet.");
      return { userProfile, userPosts, postComments: [] };
    }

    const firstPost = userPosts[0];
    const postComments = await fetchPostComments(firstPost.id);
    console.log("Comments on first post loaded:", postComments);

    return { userProfile, userPosts, postComments };

  } catch (error) {
    // ONE error handler covers profile, posts, AND comments failures.
    console.error("Failed to load user feed:", error.message);
    throw error; // re-throw so the caller can react too, if needed
  }
}

// --------------------------------------------------------------
// Run it
// --------------------------------------------------------------
loadUserFeed(1)
  .then((feed) => console.log("Feed fully loaded:", feed))
  .catch(() => console.log("Could not load the feed — showing fallback UI."));