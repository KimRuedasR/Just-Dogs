const functions = require("firebase-functions");
const admin = require("firebase-admin");
const vision = require("@google-cloud/vision");

admin.initializeApp();

const db = admin.firestore();
const client = new vision.ImageAnnotatorClient();

exports.analyzeImage = functions.storage.object().onFinalize(async (object) => {
  const filePath = object.name;
  console.log("File path:", filePath);
  const bucket = admin.storage().bucket(object.bucket);

  // Check if the file is an image
  const fileExtension = filePath.split(".").pop();
  if (!["jpg", "jpeg", "png", "gif"].includes(fileExtension.toLowerCase())) {
    console.log("File is not an image:", filePath);
    return null;
  }

  try {
    const [result] = await client.labelDetection(`gs://${bucket.name}/${filePath}`);
    const labels = result.labelAnnotations;
    console.log("Labels detected:", labels);

    const isDogDetected = labels.some((label) => {
      console.log(`Label: ${label.description}, Score: ${label.score}`);
      return label.description.toLowerCase() === "dog" && label.score > 0.8;
    });

    console.log(`Is dog detected: ${isDogDetected}`);

    if (!isDogDetected) {
      await bucket.file(filePath).delete();
      console.log("Image deleted as no dog was detected.");
    } else {
      console.log("Dog detected in the image.");
    }
  } catch (error) {
    console.error("Error analyzing image:", error);
  }

  return null;
});

exports.addLike = functions.firestore
    .document("/posts/{creatorId}/userPosts/{postId}/likes/{userId}")
    .onCreate((snap, context) => {
      return db
          .collection("posts")
          .doc(context.params.creatorId)
          .collection("userPosts")
          .doc(context.params.postId)
          .update({
            likesCount: admin.firestore.FieldValue.increment(1),
          });
    });

exports.removeLike = functions.firestore
    .document("/posts/{creatorId}/userPosts/{postId}/likes/{userId}")
    .onDelete((snap, context) => {
      return db
          .collection("posts")
          .doc(context.params.creatorId)
          .collection("userPosts")
          .doc(context.params.postId)
          .update({
            likesCount: admin.firestore.FieldValue.increment(-1),
          });
    });

exports.addFollower = functions.firestore
    .document("/following/{userId}/userFollowing/{FollowingId}")
    .onCreate((snap, context) => {
      return db
          .collection("users")
          .doc(context.params.FollowingId)
          .update({
            followersCount: admin.firestore.FieldValue.increment(1),
          })
          .then(() => {
            return db
                .collection("users")
                .doc(context.params.userId)
                .update({
                  followingCount: admin.firestore.FieldValue.increment(1),
                });
          });
    });

exports.removeFollower = functions.firestore
    .document("/following/{userId}/userFollowing/{FollowingId}")
    .onDelete((snap, context) => {
      return db
          .collection("users")
          .doc(context.params.FollowingId)
          .update({
            followersCount: admin.firestore.FieldValue.increment(-1),
          })
          .then(() => {
            return db
                .collection("users")
                .doc(context.params.userId)
                .update({
                  followingCount: admin.firestore.FieldValue.increment(-1),
                });
          });
    });

exports.addComment = functions.firestore
    .document("/posts/{creatorId}/userPosts/{postId}/comments/{userId}")
    .onCreate((snap, context) => {
      return db
          .collection("posts")
          .doc(context.params.creatorId)
          .collection("userPosts")
          .doc(context.params.postId)
          .update({
            commentsCount: admin.firestore.FieldValue.increment(1),
          });
    });
